import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { applyNodeChanges, Background, BackgroundVariant, ReactFlow } from 'reactflow'
import { getAllEntities } from '../data'
import ConceptNode from '../components/nodes/ConceptNode.jsx'
import VariableNode from '../components/nodes/VariableNode.jsx'
import ConstructionEdge from './ConstructionEdge.jsx'
import ExplanationPopover from './ExplanationPopover.jsx'
import StudentNode from './nodes/StudentNode.jsx'
import StudentNodePanel from './StudentNodePanel.jsx'
import { loadConstructionSession, saveConstructionSession } from '../lib/construction/constructionStore'
import { computeExplanationFilled } from '../lib/construction/constructionFile'

const nodeTypes = { concept: ConceptNode, variable: VariableNode, student: StudentNode }
const edgeTypes = { construction: ConstructionEdge }

function deriveCanonicalNodes(positions) {
  return Object.keys(positions).filter((id) => !id.startsWith('student-'))
}

function asSessionObject(value) {
  return value && typeof value === 'object' ? value : null
}

function getPublishedCanonicalEntities() {
  return getAllEntities().filter((entity) => (entity?.review_state ?? 'published') === 'published')
}

function getEntityDisplayName(entity) {
  if (!entity || typeof entity !== 'object') {
    return ''
  }
  if (entity.layer === 'variable') {
    return entity.name ?? entity.title ?? entity.id
  }
  return entity.title ?? entity.name ?? entity.id
}

function createStudentNodeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `student-${crypto.randomUUID()}`
  }
  return `student-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function createEdgeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `edge-${crypto.randomUUID()}`
  }
  return `edge-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function buildStudentNodeBankEntry(studentNode) {
  return {
    id: studentNode.id,
    layer: 'student',
    title: studentNode.title,
    name: studentNode.title,
    review_state: 'published',
    domain: typeof studentNode.color === 'string' ? studentNode.color : null,
    tags: [],
  }
}

function createStudentNodeRecord(payload) {
  const now = new Date().toISOString()
  const content = payload?.content ?? {}
  return {
    id: createStudentNodeId(),
    title: payload?.title ?? 'Untitled student node',
    created_at: now,
    modified_at: now,
    field_order: Array.isArray(payload?.field_order) ? [...payload.field_order] : [],
    content: {
      notes: typeof content.notes === 'string' ? content.notes : '',
      formula: typeof content.formula === 'string' ? content.formula : null,
      description: typeof content.description === 'string' ? content.description : null,
      simplifying_assumption: typeof content.simplifying_assumption === 'string' ? content.simplifying_assumption : null,
      applicability: typeof content.applicability === 'string' ? content.applicability : null,
      misconception: typeof content.misconception === 'string' ? content.misconception : null,
    },
    color: typeof payload?.color === 'string' ? payload.color : null,
  }
}

function updateStudentNodeRecord(existingNode, payload) {
  const content = payload?.content ?? {}
  return {
    ...existingNode,
    title: payload?.title ?? existingNode.title,
    modified_at: new Date().toISOString(),
    field_order: Array.isArray(payload?.field_order) ? [...payload.field_order] : existingNode.field_order ?? [],
    color: typeof payload?.color === 'string' ? payload.color : null,
    content: {
      notes: typeof content.notes === 'string' ? content.notes : '',
      formula: typeof content.formula === 'string' ? content.formula : null,
      description: typeof content.description === 'string' ? content.description : null,
      simplifying_assumption: typeof content.simplifying_assumption === 'string' ? content.simplifying_assumption : null,
      applicability: typeof content.applicability === 'string' ? content.applicability : null,
      misconception: typeof content.misconception === 'string' ? content.misconception : null,
    },
  }
}

function toFlowNode(nodeId, position, entityById) {
  const entity = entityById.get(nodeId)
  if (!entity) {
    return null
  }
  const isVariable = entity.layer === 'variable'
  const isStudent = entity.layer === 'student'
  return {
    id: nodeId,
    type: isStudent ? 'student' : isVariable ? 'variable' : 'concept',
    position: {
      x: typeof position?.x === 'number' ? position.x : 0,
      y: typeof position?.y === 'number' ? position.y : 0,
    },
    draggable: true,
    data: {
      node: entity,
      title: getEntityDisplayName(entity),
      canonicalSymbol: entity.canonical_symbol ?? null,
      domain: entity.domain ?? null,
      mass: entity.mass ?? 1,
      color: entity.color ?? null,
      visualState: 'base',
      understandingState: 'unseen',
      constructionMode: true,
    },
  }
}

function buildFlowNodesFromPositions(positions, entityById) {
  if (!positions || typeof positions !== 'object') {
    return []
  }
  return Object.entries(positions)
    .map(([nodeId, position]) => toFlowNode(nodeId, position, entityById))
    .filter(Boolean)
}

function toFiniteCoordinate(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeNodeBox(node) {
  const width = typeof node?.width === 'number' ? node.width : typeof node?.measured?.width === 'number' ? node.measured.width : 0
  const height =
    typeof node?.height === 'number' ? node.height : typeof node?.measured?.height === 'number' ? node.measured.height : 0
  return {
    x: toFiniteCoordinate(node?.position?.x),
    y: toFiniteCoordinate(node?.position?.y),
    width,
    height,
  }
}

function defaultNodeSize(node) {
  if (node?.type === 'variable') {
    return { width: 70, height: 70 }
  }
  if (node?.type === 'student') {
    return { width: 150, height: 56 }
  }
  return { width: 100, height: 100 }
}

/** @param {{ sessionId: string, onBackToLanding?: () => void }} props */
export default function ConstructionCanvas({ sessionId, onBackToLanding }) {
  const [session, setSession] = useState(null)
  const [flowNodes, setFlowNodes] = useState([])
  const [isBankOpen, setIsBankOpen] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [contextMenu, setContextMenu] = useState(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [studentPanel, setStudentPanel] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)
  const [explanationPopover, setExplanationPopover] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [unfilledEdgeCursor, setUnfilledEdgeCursor] = useState(0)
  const viewportRef = useRef(null)

  const canonicalEntities = useMemo(() => getPublishedCanonicalEntities(), [])
  const studentBankEntries = useMemo(
    () =>
      Array.isArray(session?.student_nodes)
        ? session.student_nodes
            .filter((node) => typeof node?.id === 'string' && node.id.startsWith('student-'))
            .map((node) => buildStudentNodeBankEntry(node))
        : [],
    [session?.student_nodes],
  )
  const allBankEntries = useMemo(() => [...canonicalEntities, ...studentBankEntries], [canonicalEntities, studentBankEntries])
  const entityById = useMemo(
    () => new Map(allBankEntries.map((entity) => [entity.id, entity])),
    [allBankEntries],
  )

  useEffect(() => {
    const loaded = asSessionObject(loadConstructionSession(sessionId))
    if (!loaded) {
      return
    }
    setSession(loaded)
    setTitleDraft(typeof loaded.title === 'string' ? loaded.title : '')
    if (loaded.library_source?.type === 'blank-template' && typeof loaded.library_source.topic === 'string') {
      setTopicFilter(loaded.library_source.topic)
    }
  }, [sessionId])

  const domainOptions = useMemo(() => {
    const domains = new Set()
    for (const entity of canonicalEntities) {
      if (typeof entity.domain === 'string' && entity.domain.length > 0) {
        domains.add(entity.domain)
      }
    }
    return [...domains].sort()
  }, [canonicalEntities])

  const topicOptions = useMemo(() => {
    const topics = new Set()
    for (const entity of canonicalEntities) {
      for (const tag of entity.tags ?? []) {
        if (typeof tag === 'string' && tag.length > 0) {
          topics.add(tag)
        }
      }
    }
    return [...topics].sort()
  }, [canonicalEntities])

  const placedNodeIds = useMemo(() => new Set(Object.keys(session?.positions ?? {})), [session?.positions])
  const unfilledEdges = useMemo(
    () => (Array.isArray(session?.edges) ? session.edges.filter((edge) => !computeExplanationFilled(edge?.explanation)) : []),
    [session?.edges],
  )

  const bankNodes = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return allBankEntries.filter((entity) => {
      const isStudent = entity.layer === 'student'
      if (!isStudent && domainFilter !== 'all' && entity.domain !== domainFilter) {
        return false
      }
      if (!isStudent && topicFilter !== 'all') {
        const tags = Array.isArray(entity.tags) ? entity.tags : []
        if (!tags.includes(topicFilter)) {
          return false
        }
      }
      if (query.length === 0) {
        return true
      }
      const name = getEntityDisplayName(entity).toLowerCase()
      return name.includes(query)
    })
  }, [allBankEntries, domainFilter, topicFilter, searchValue])

  useEffect(() => {
    if (!session) {
      setFlowNodes([])
      return
    }
    setFlowNodes(buildFlowNodesFromPositions(session.positions, entityById))
  }, [entityById, session])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }
    const timer = window.setTimeout(() => setToastMessage(null), 1800)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const getFlowNodeById = useCallback((nodeId) => flowNodes.find((node) => node.id === nodeId) ?? null, [flowNodes])

  const getEdgeMidpoint = useCallback(
    (sourceId, targetId) => {
      const sourceNode = getFlowNodeById(sourceId)
      const targetNode = getFlowNodeById(targetId)
      if (!sourceNode || !targetNode) {
        return { x: 100, y: 100 }
      }
      const sourceBox = normalizeNodeBox(sourceNode)
      const targetBox = normalizeNodeBox(targetNode)
      const sourceSize = sourceBox.width > 0 && sourceBox.height > 0 ? sourceBox : { ...sourceBox, ...defaultNodeSize(sourceNode) }
      const targetSize = targetBox.width > 0 && targetBox.height > 0 ? targetBox : { ...targetBox, ...defaultNodeSize(targetNode) }
      return {
        x: sourceSize.x + sourceSize.width / 2 + (targetSize.x + targetSize.width / 2 - (sourceSize.x + sourceSize.width / 2)) / 2,
        y: sourceSize.y + sourceSize.height / 2 + (targetSize.y + targetSize.height / 2 - (sourceSize.y + sourceSize.height / 2)) / 2,
      }
    },
    [getFlowNodeById],
  )

  function panToPosition(position) {
    if (typeof reactFlowInstance?.setCenter === 'function') {
      reactFlowInstance.setCenter(position.x, position.y, { zoom: 1.2, duration: 200 })
    }
  }

  function openExplanationPopover(edgeId) {
    if (!session) {
      return
    }
    const edge = (session.edges ?? []).find((entry) => entry.id === edgeId)
    if (!edge) {
      return
    }
    const midpoint = getEdgeMidpoint(edge.source, edge.target)
    setExplanationPopover({ edgeId, position: midpoint })
    setSelectedEdgeId(edgeId)
  }

  const flowEdges = useMemo(() => {
    if (!Array.isArray(session?.edges)) {
      return []
    }
    return session.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'construction',
      data: {
        explanation: edge.explanation,
        onClick: (edgeId) => {
          setSelectedEdgeId(edgeId)
        },
        onContextMenu: (edgeId, position) => {
          setSelectedEdgeId(edgeId)
          setContextMenu({
            kind: 'edge',
            edgeId,
            x: position.x,
            y: position.y,
          })
        },
      },
    }))
  }, [session?.edges])

  const handleNodesChange = useCallback((changes) => {
    setFlowNodes((currentNodes) => applyNodeChanges(changes, currentNodes))
  }, [])

  function commitSession(nextSession) {
    const stamped = {
      ...nextSession,
      canonical_nodes: deriveCanonicalNodes(nextSession.positions ?? {}),
      modified_at: new Date().toISOString(),
    }
    setSession(stamped)
    saveConstructionSession(stamped)
  }

  function handlePlaceNode(nodeId, dropPosition) {
    if (!session || placedNodeIds.has(nodeId)) {
      return
    }
    commitSession({
      ...session,
      positions: {
        ...(session.positions ?? {}),
        [nodeId]: dropPosition,
      },
    })
  }

  function handleDropOnCanvas(event) {
    event.preventDefault()
    const nodeId = event.dataTransfer?.getData('application/atlas-node-id') || event.dataTransfer?.getData('text/plain')
    if (!nodeId || !entityById.has(nodeId)) {
      return
    }
    const rawDropPosition =
      typeof reactFlowInstance?.screenToFlowPosition === 'function'
        ? reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY })
        : { x: event.clientX, y: event.clientY }
    const nextPosition = {
      x: toFiniteCoordinate(rawDropPosition?.x),
      y: toFiniteCoordinate(rawDropPosition?.y),
    }
    handlePlaceNode(nodeId, nextPosition)
  }

  function handlePaneDoubleClick(event) {
    event.preventDefault()
    const rawPosition =
      typeof reactFlowInstance?.screenToFlowPosition === 'function'
        ? reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY })
        : { x: event.clientX, y: event.clientY }
    const placementPosition = {
      x: toFiniteCoordinate(rawPosition?.x),
      y: toFiniteCoordinate(rawPosition?.y),
    }
    setStudentPanel({
      mode: 'create',
      source: 'canvas',
      placementPosition,
      node: {
        title: '',
        color: '',
        content: { notes: '' },
      },
    })
  }

  function handleNodeDragStop(_, node) {
    if (!session || !node?.id || !node.position || !placedNodeIds.has(node.id)) {
      return
    }
    commitSession({
      ...session,
      positions: {
        ...(session.positions ?? {}),
        [node.id]: {
          x: node.position.x,
          y: node.position.y,
        },
      },
    })
  }

  function handleNodeClick(_, node) {
    if (!node?.id || !node.id.startsWith('student-') || !session) {
      return
    }
    const studentNode = Array.isArray(session.student_nodes)
      ? session.student_nodes.find((entry) => entry.id === node.id)
      : null
    if (!studentNode) {
      return
    }
    setStudentPanel({
      mode: 'edit',
      source: 'edit',
      node: {
        ...studentNode,
        content: {
          notes: studentNode.content?.notes ?? '',
          formula: studentNode.content?.formula ?? null,
          description: studentNode.content?.description ?? null,
          simplifying_assumption: studentNode.content?.simplifying_assumption ?? null,
          applicability: studentNode.content?.applicability ?? null,
          misconception: studentNode.content?.misconception ?? null,
        },
      },
    })
  }

  function handleNodeContextMenu(event, node) {
    event.preventDefault()
    setContextMenu({
      kind: 'node',
      nodeId: node.id,
      x: event.clientX,
      y: event.clientY,
    })
  }

  function removeEdge(edgeId) {
    if (!session || typeof edgeId !== 'string') {
      return
    }
    const nextEdges = (session.edges ?? []).filter((edge) => edge.id !== edgeId)
    if (nextEdges.length === (session.edges ?? []).length) {
      return
    }
    commitSession({
      ...session,
      edges: nextEdges,
    })
    if (selectedEdgeId === edgeId) {
      setSelectedEdgeId(null)
    }
    if (explanationPopover?.edgeId === edgeId) {
      setExplanationPopover(null)
    }
    setContextMenu(null)
  }

  function handleConnect(connection) {
    if (!session) {
      return
    }
    const source = typeof connection?.source === 'string' ? connection.source : null
    const target = typeof connection?.target === 'string' ? connection.target : null
    if (!source || !target) {
      return
    }
    if (source === target) {
      setToastMessage('A node cannot connect to itself.')
      return
    }
    const duplicateExists = (session.edges ?? []).some((edge) => {
      const sameDirection = edge.source === source && edge.target === target
      const reverseDirection = edge.source === target && edge.target === source
      return sameDirection || reverseDirection
    })
    if (duplicateExists) {
      setToastMessage('A connection between these nodes already exists.')
      return
    }
    const nextEdge = {
      id: createEdgeId(),
      source,
      target,
      explanation: null,
      explanation_filled: false,
      created_at: new Date().toISOString(),
    }
    commitSession({
      ...session,
      edges: [...(session.edges ?? []), nextEdge],
    })
    setSelectedEdgeId(nextEdge.id)
    const midpoint = getEdgeMidpoint(source, target)
    setExplanationPopover({ edgeId: nextEdge.id, position: midpoint })
    panToPosition(midpoint)
  }

  function handleEdgeClick(_, edge) {
    if (!edge?.id) {
      return
    }
    setSelectedEdgeId(edge.id)
  }

  function handleRemovePlacedNode(nodeId) {
    if (!session || !placedNodeIds.has(nodeId)) {
      return
    }
    const approved = window.confirm('Remove this node from the canvas?')
    if (!approved) {
      setContextMenu(null)
      return
    }

    const nextPositions = { ...(session.positions ?? {}) }
    delete nextPositions[nodeId]
    const nextEdges = Array.isArray(session.edges)
      ? session.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      : []

    commitSession({
      ...session,
      positions: nextPositions,
      edges: nextEdges,
    })
    if (selectedEdgeId && !(nextEdges ?? []).some((edge) => edge.id === selectedEdgeId)) {
      setSelectedEdgeId(null)
    }
    if (explanationPopover?.edgeId && !(nextEdges ?? []).some((edge) => edge.id === explanationPopover.edgeId)) {
      setExplanationPopover(null)
    }
    setContextMenu(null)
  }

  function handleTitleSave() {
    if (!session) {
      return
    }
    const trimmed = titleDraft.trim()
    const nextTitle = trimmed.length > 0 ? trimmed : session.title
    setEditingTitle(false)
    if (nextTitle === session.title) {
      return
    }
    commitSession({
      ...session,
      title: nextTitle,
    })
  }

  function handleCreateStudentFromPanel(payload) {
    if (!session) {
      return
    }
    const createdNode = createStudentNodeRecord(payload)
    const nextStudentNodes = [...(Array.isArray(session.student_nodes) ? session.student_nodes : []), createdNode]
    const nextPositions = { ...(session.positions ?? {}) }
    if (studentPanel?.source === 'canvas' && studentPanel?.placementPosition) {
      nextPositions[createdNode.id] = studentPanel.placementPosition
    }
    commitSession({
      ...session,
      student_nodes: nextStudentNodes,
      positions: nextPositions,
    })
    setStudentPanel(null)
  }

  function handleSaveStudentFromPanel(payload) {
    if (!session || studentPanel?.mode !== 'edit') {
      return
    }
    const currentId = studentPanel?.node?.id
    if (typeof currentId !== 'string') {
      return
    }
    const nextStudentNodes = (Array.isArray(session.student_nodes) ? session.student_nodes : []).map((entry) =>
      entry.id === currentId ? updateStudentNodeRecord(entry, payload) : entry,
    )
    commitSession({
      ...session,
      student_nodes: nextStudentNodes,
    })
  }

  function handleExplanationSave(nextExplanation) {
    if (!session || !explanationPopover?.edgeId) {
      return
    }
    const edgeId = explanationPopover.edgeId
    const normalizedExplanation =
      typeof nextExplanation === 'string' && nextExplanation.trim().length > 0 ? nextExplanation : null
    const nextEdges = (session.edges ?? []).map((edge) =>
      edge.id === edgeId
        ? {
            ...edge,
            explanation: normalizedExplanation,
            explanation_filled: computeExplanationFilled(normalizedExplanation),
          }
        : edge,
    )
    commitSession({
      ...session,
      edges: nextEdges,
    })
    setExplanationPopover(null)
  }

  function handleBadgeCycle() {
    if (unfilledEdges.length === 0) {
      return
    }
    const nextIndex = unfilledEdgeCursor % unfilledEdges.length
    const edge = unfilledEdges[nextIndex]
    const midpoint = getEdgeMidpoint(edge.source, edge.target)
    setExplanationPopover({ edgeId: edge.id, position: midpoint })
    setSelectedEdgeId(edge.id)
    panToPosition(midpoint)
    setUnfilledEdgeCursor((current) => current + 1)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!selectedEdgeId) {
        return
      }
      const activeTag = typeof document !== 'undefined' ? document.activeElement?.tagName?.toLowerCase() : ''
      const isInputLike =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (typeof document !== 'undefined' && document.activeElement?.isContentEditable)
      if (isInputLike) {
        return
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        removeEdge(selectedEdgeId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEdgeId, session])

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <p className="text-sm text-slate-300">Loading construction session...</p>
      </main>
    )
  }

  return (
    <main className="relative flex h-screen min-h-screen w-full bg-slate-950 text-slate-100" onClick={() => setContextMenu(null)}>
      <aside
        className={`${isBankOpen ? 'w-80' : 'w-12'} relative border-r border-slate-800 bg-slate-900/70 transition-[width] duration-200`}
      >
        <button
          type="button"
          onClick={() => setIsBankOpen((open) => !open)}
          className="absolute right-2 top-2 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
          aria-label="Toggle node bank"
        >
          {isBankOpen ? 'Hide' : 'Show'}
        </button>
        {isBankOpen ? (
          <div className="h-full overflow-y-auto p-3 pt-11">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Node bank</h2>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by name"
                className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
              />
              <select
                value={domainFilter}
                onChange={(event) => setDomainFilter(event.target.value)}
                className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
              >
                <option value="all">All domains</option>
                {domainOptions.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              <select
                value={topicFilter}
                onChange={(event) => setTopicFilter(event.target.value)}
                className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
              >
                <option value="all">All topic tags</option>
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded border border-dashed border-cyan-500/70 bg-cyan-900/20 px-2 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-800/30"
              onClick={() =>
                setStudentPanel({
                  mode: 'create',
                  source: 'bank',
                  placementPosition: null,
                  node: {
                    title: '',
                    color: '',
                    content: { notes: '' },
                  },
                })
              }
            >
              + New node
            </button>
            <ul className="mt-3 space-y-2">
              {bankNodes.map((entity) => {
                const nodeId = entity.id
                const isPlaced = placedNodeIds.has(nodeId)
                const label = getEntityDisplayName(entity)
                return (
                  <li key={nodeId}>
                    <div
                      draggable={!isPlaced}
                      onDragStart={(event) => {
                        event.dataTransfer.setData('application/atlas-node-id', nodeId)
                        event.dataTransfer.setData('text/plain', nodeId)
                      }}
                      className={`rounded border px-2 py-1.5 text-sm ${
                        isPlaced
                          ? 'cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500'
                          : 'cursor-grab border-slate-600 bg-slate-950 text-slate-100 hover:border-slate-500'
                      }`}
                    >
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-slate-400">
                        {entity.layer === 'student' ? 'student node' : entity.layer}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/85 px-4 py-2">
          <p className="text-sm text-cyan-200">Construction mode — your work, not the canonical graph.</p>
          <button
            type="button"
            onClick={() => window.open('/', '_blank')}
            className="text-sm text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
          >
            View canonical reference →
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/65 px-4 py-2">
          <div>
            {unfilledEdges.length > 0 ? (
              <button
                type="button"
                aria-live="polite"
                onClick={handleBadgeCycle}
                className="rounded border border-amber-500/70 bg-amber-700/20 px-3 py-1 text-sm font-semibold text-amber-100 hover:bg-amber-700/35"
              >
                {unfilledEdges.length} edges without explanations
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                autoFocus
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleTitleSave()
                  }
                  if (event.key === 'Escape') {
                    setTitleDraft(session.title ?? '')
                    setEditingTitle(false)
                  }
                }}
                className="rounded border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                aria-label="Session title"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 hover:bg-slate-800"
              >
                {session.title}
              </button>
            )}
            <button
              type="button"
              onClick={() => saveConstructionSession(session)}
              className="rounded border border-cyan-500/70 bg-cyan-700/25 px-3 py-1 text-sm font-semibold text-cyan-100 hover:bg-cyan-700/45"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => window.alert('Export arrives in Session 8.')}
              className="rounded border border-slate-600 bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-100 hover:bg-slate-700"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof onBackToLanding === 'function') {
                  onBackToLanding()
                  return
                }
                window.location.assign('?mode=construct')
              }}
              className="rounded border border-slate-600 bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-100 hover:bg-slate-700"
            >
              My Maps
            </button>
          </div>
        </div>
        <div
          ref={viewportRef}
          className="relative min-h-0 flex-1"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDropOnCanvas}
        >
          <ReactFlow
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={flowNodes}
            edges={flowEdges}
            nodesDraggable
            fitView
            onNodesChange={handleNodesChange}
            onNodeDragStop={handleNodeDragStop}
            onNodeClick={handleNodeClick}
            onNodeContextMenu={handleNodeContextMenu}
            onConnect={handleConnect}
            onEdgeClick={handleEdgeClick}
            onPaneDoubleClick={handlePaneDoubleClick}
            onPaneClick={() => setSelectedEdgeId(null)}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1f2937" gap={20} variant={BackgroundVariant.Dots} />
          </ReactFlow>

          {studentPanel ? (
            <StudentNodePanel
              mode={studentPanel.mode}
              node={studentPanel.node}
              onClose={() => setStudentPanel(null)}
              onCreate={handleCreateStudentFromPanel}
              onSave={handleSaveStudentFromPanel}
            />
          ) : null}
          {toastMessage ? (
            <div className="pointer-events-none absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded border border-rose-500/60 bg-slate-900/95 px-3 py-1.5 text-sm text-rose-100 shadow-xl">
              {toastMessage}
            </div>
          ) : null}
          {selectedEdgeId ? (
            <aside className="absolute bottom-4 right-4 z-40 w-[340px] rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">Connection</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-100">
                {(session.edges ?? []).find((edge) => edge.id === selectedEdgeId)?.explanation?.trim()
                  ? (session.edges ?? []).find((edge) => edge.id === selectedEdgeId)?.explanation
                  : 'Add an explanation for this edge.'}
              </p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openExplanationPopover(selectedEdgeId)}
                  className="rounded border border-cyan-500/70 bg-cyan-700/25 px-3 py-1 text-sm font-semibold text-cyan-100 hover:bg-cyan-700/45"
                >
                  Edit explanation
                </button>
                <button
                  type="button"
                  onClick={() => removeEdge(selectedEdgeId)}
                  className="rounded border border-rose-500/70 bg-rose-900/25 px-3 py-1 text-sm font-semibold text-rose-100 hover:bg-rose-800/35"
                >
                  Delete edge
                </button>
              </div>
            </aside>
          ) : null}
          {explanationPopover ? (
            <ExplanationPopover
              edge={(session.edges ?? []).find((edge) => edge.id === explanationPopover.edgeId) ?? null}
              sourceNode={entityById.get((session.edges ?? []).find((edge) => edge.id === explanationPopover.edgeId)?.source)}
              targetNode={entityById.get((session.edges ?? []).find((edge) => edge.id === explanationPopover.edgeId)?.target)}
              position={explanationPopover.position}
              onSave={handleExplanationSave}
              onSkip={() => setExplanationPopover(null)}
            />
          ) : null}
        </div>
      </section>

      {contextMenu ? (
        <div
          className="fixed z-50 rounded border border-slate-600 bg-slate-900 p-1 shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="block rounded px-3 py-1 text-sm text-rose-200 hover:bg-slate-800"
            onClick={() => {
              if (contextMenu.kind === 'edge') {
                removeEdge(contextMenu.edgeId)
                return
              }
              handleRemovePlacedNode(contextMenu.nodeId)
            }}
          >
            {contextMenu.kind === 'edge' ? 'Delete edge' : 'Remove'}
          </button>
        </div>
      ) : null}
    </main>
  )
}
