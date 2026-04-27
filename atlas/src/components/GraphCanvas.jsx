import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  useReactFlow,
  useNodesState,
} from 'reactflow'
import { isStateAtLeast, isStateAtMost } from '../lib/understanding'
import FloatingEdge from './FloatingEdge.jsx'
import HoverCardOverlay from './HoverCardOverlay.jsx'
import CameraController, { centerOnNodeInViewport } from './graph/CameraController.jsx'
import ConceptNode from './nodes/ConceptNode.jsx'
import VariableNode from './nodes/VariableNode.jsx'

const nodeTypes = { concept: ConceptNode, variable: VariableNode }
const edgeTypes = { atlas: FloatingEdge }
const MOBILE_LONG_PRESS_MS = 400
const MOBILE_IDLE_DRAG_THRESHOLD = 9999
const CLICK_SUPPRESSION_AFTER_DRAG_MS = 250

function getMiniMapNodeColor(node) {
  const domain = node?.data?.domain
  if (domain === 'mechanics') {
    return '#fb923c'
  }
  if (domain === 'electromagnetism') {
    return '#f87171'
  }
  if (domain === 'thermodynamics') {
    return '#22c55e'
  }
  if (domain === 'waves') {
    return '#a855f7'
  }
  if (domain === 'optics') {
    return '#38bdf8'
  }
  if (node?.type === 'variable') {
    return '#94a3b8'
  }
  return '#64748b'
}

/** @param {{ selectedNodeId: string | null, panelWidth?: number, isPanelOpen?: boolean, viewPanelWidth?: number, isViewPanelOpen?: boolean, isMobile?: boolean, onActionsChange?: (actions: { fitGraph: (() => void) | null, centerSelected: (() => void) | null } | null) => void }} props */
function ViewportActionsBridge({
  selectedNodeId,
  panelWidth = 440,
  isPanelOpen = false,
  viewPanelWidth = 0,
  isViewPanelOpen = false,
  isMobile = false,
  onActionsChange,
}) {
  const reactFlow = useReactFlow()

  const fitGraph = useCallback(() => {
    reactFlow.fitView({ padding: 0.2, duration: 320 })
  }, [reactFlow])

  const centerSelected = useCallback(() => {
    if (!selectedNodeId) {
      return
    }
    centerOnNodeInViewport({
      reactFlow,
      nodeId: selectedNodeId,
      panelWidth,
      isPanelOpen,
      viewPanelWidth,
      isViewPanelOpen,
      isMobile,
      duration: 420,
    })
  }, [
    isMobile,
    isPanelOpen,
    isViewPanelOpen,
    panelWidth,
    reactFlow,
    selectedNodeId,
    viewPanelWidth,
  ])

  useEffect(() => {
    if (typeof onActionsChange !== 'function') {
      return undefined
    }
    onActionsChange({ fitGraph, centerSelected })
    return () => onActionsChange(null)
  }, [centerSelected, fitGraph, onActionsChange])

  return null
}

function ZoomInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 6.5a.75.75 0 0 1 .75.75v4h4a.75.75 0 0 1 0 1.5h-4v4a.75.75 0 0 1-1.5 0v-4h-4a.75.75 0 0 1 0-1.5h4v-4a.75.75 0 0 1 .75-.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M7.25 12a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5h-8a.75.75 0 0 1-.75-.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FitViewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      data-testid="fit-view-target-icon"
    >
      <path
        d="M6 3.5h4a.75.75 0 0 1 0 1.5H7.5V7.5a.75.75 0 0 1-1.5 0V3.5Zm8 0h4v4a.75.75 0 0 1-1.5 0V5H14a.75.75 0 0 1 0-1.5ZM6.75 14.5a.75.75 0 0 1 .75.75v2.5H10a.75.75 0 0 1 0 1.5H6v-4a.75.75 0 0 1 .75-.75Zm10.5 0a.75.75 0 0 1 .75.75v4h-4a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 .75-.75ZM12 10.25a1.75 1.75 0 1 1 0 3.5a1.75 1.75 0 0 1 0-3.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      data-testid="fullscreen-toggle-icon"
    >
      <path
        d="M5.5 4h4a.75.75 0 0 1 0 1.5H7v2.5a.75.75 0 0 1-1.5 0V4Zm9 0h4v4a.75.75 0 0 1-1.5 0V5.5h-2.5a.75.75 0 0 1 0-1.5ZM6.25 15.25a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-4v-4a.75.75 0 0 1 .75-.75Zm11.5 0a.75.75 0 0 1 .75.75v4h-4a.75.75 0 0 1 0-1.5H17V16a.75.75 0 0 1 .75-.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ViewportUtilityControls({ isMobile = false, containerRef }) {
  const reactFlow = useReactFlow()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    handleFullscreenChange()
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [containerRef])

  const handleFullscreenToggle = useCallback(async () => {
    const container = containerRef.current
    if (!container) {
      return
    }

    if (document.fullscreenElement === container && typeof document.exitFullscreen === 'function') {
      await document.exitFullscreen()
      return
    }

    if (!document.fullscreenElement && typeof container.requestFullscreen === 'function') {
      await container.requestFullscreen()
    }
  }, [containerRef])

  if (isMobile) {
    return null
  }

  const buttonClassName =
    'rounded-md border border-slate-600 bg-slate-800/90 p-2 text-slate-200 transition hover:bg-slate-700/90'

  return (
    <>
      <MiniMap
        data-testid="desktop-minimap"
        className="!m-0 !left-3 !bottom-3 !top-auto !right-auto !h-28 !w-40 !overflow-hidden !rounded-lg !border !border-slate-600/60 !bg-slate-900/95 !shadow-xl !shadow-black/50"
        nodeColor={getMiniMapNodeColor}
        maskColor="rgb(15 23 42 / 0.65)"
        pannable
        zoomable
      />
      <div
        data-testid="desktop-viewport-controls"
        className="pointer-events-auto absolute bottom-3 left-[11.8rem] z-20 flex items-center gap-1.5 rounded-lg border border-slate-600/60 bg-slate-900/95 p-1.5 shadow-xl shadow-black/50"
      >
        <button type="button" onClick={() => reactFlow.zoomOut()} className={buttonClassName} aria-label="Zoom out">
          <ZoomOutIcon />
        </button>
        <button type="button" onClick={() => reactFlow.zoomIn()} className={buttonClassName} aria-label="Zoom in">
          <ZoomInIcon />
        </button>
        <button
          type="button"
          onClick={() => reactFlow.fitView({ padding: 0.2, duration: 320 })}
          className={buttonClassName}
          aria-label="Fit view"
        >
          <FitViewIcon />
        </button>
        <button
          type="button"
          onClick={handleFullscreenToggle}
          className={buttonClassName}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <FullscreenIcon />
        </button>
      </div>
    </>
  )
}

function toFlowNodes(
  nodes,
  selectedNodeId,
  focalNodeIds,
  neighborNodeIds,
  distantNodeIds,
  understandingStatesById,
  frontierConceptIds,
  onSetHover,
  isDraggingNode,
) {
  return nodes.map((node) => {
    const nodeX = typeof node.position?.x === 'number' ? node.position.x : 0
    const nodeY = typeof node.position?.y === 'number' ? node.position.y : 0

    let visualState = 'base'
    if (selectedNodeId) {
      if (focalNodeIds.has(node.id)) {
        visualState = 'focal'
      } else if (neighborNodeIds.has(node.id)) {
        visualState = 'neighbor'
      } else if (distantNodeIds.has(node.id)) {
        visualState = 'distant'
      }
    }

    return {
      id: node.id,
      type: node.layer === 'variable' ? 'variable' : 'concept',
      position: { x: nodeX, y: nodeY },
      data: {
        title: node.layer === 'variable' ? node.name : node.title,
        domain: node.domain,
        canonicalSymbol: node.canonical_symbol,
        mass: node.mass,
        visualState,
        understandingState:
          node.layer === 'concept' && typeof understandingStatesById?.[node.id] === 'string'
            ? understandingStatesById[node.id]
            : 'unseen',
        isFrontierConcept: node.layer === 'concept' && frontierConceptIds.has(node.id),
        onSetHover: typeof onSetHover === 'function' ? onSetHover : null,
        isDraggingNode,
        node,
      },
    }
  })
}

function getFrontierConceptIds(edges, nodeById, understandingStatesById) {
  const ids = new Set()
  for (const edge of edges) {
    if (edge.type !== 'foundational') {
      continue
    }
    const sourceNode = nodeById.get(edge.source)
    const targetNode = nodeById.get(edge.target)
    if (sourceNode?.layer !== 'concept' || targetNode?.layer !== 'concept') {
      continue
    }
    const sourceState = understandingStatesById?.[edge.source] ?? 'unseen'
    const targetState = understandingStatesById?.[edge.target] ?? 'unseen'
    if (isStateAtLeast(sourceState, 'apply') && isStateAtMost(targetState, 'seen')) {
      ids.add(edge.target)
    }
  }
  return ids
}

function toFlowEdges(
  edges,
  selectedNodeId,
  neighborNodeIds,
  understandingStatesById,
  nodeById,
  onSetHover,
  isMobile,
) {
  return edges.map((edge) => ({
    id: edge.id,
    type: 'atlas',
    source: edge.source,
    target: edge.target,
    data: {
      type: edge.type,
      weight: edge.weight,
      emphasis:
        !selectedNodeId
          ? 'base'
          : edge.source === selectedNodeId || edge.target === selectedNodeId
            ? 'focal'
            : neighborNodeIds.has(edge.source) && neighborNodeIds.has(edge.target)
              ? 'neighbor'
              : 'distant',
      isFrontier: (() => {
        if (edge.type !== 'foundational') {
          return false
        }
        const sourceNode = nodeById.get(edge.source)
        const targetNode = nodeById.get(edge.target)
        if (sourceNode?.layer !== 'concept' || targetNode?.layer !== 'concept') {
          return false
        }
        const sourceState = understandingStatesById?.[edge.source] ?? 'unseen'
        const targetState = understandingStatesById?.[edge.target] ?? 'unseen'
        return isStateAtLeast(sourceState, 'apply') && isStateAtMost(targetState, 'seen')
      })(),
      rationale: typeof edge.rationale === 'string' ? edge.rationale : undefined,
      sourceTitle:
        nodeById.get(edge.source)?.title ??
        nodeById.get(edge.source)?.name ??
        nodeById.get(edge.source)?.id ??
        edge.source,
      targetTitle:
        nodeById.get(edge.target)?.title ??
        nodeById.get(edge.target)?.name ??
        nodeById.get(edge.target)?.id ??
        edge.target,
      onSetHover: typeof onSetHover === 'function' ? onSetHover : null,
      isMobile,
    },
  }))
}

/** @param {{ nodes: object[], edges: object[], selectedNodeId: string | null, isPanelOpen?: boolean, panelWidth?: number, viewPanelWidth?: number, isViewPanelOpen?: boolean, focalNodeIds: Set<string>, neighborNodeIds: Set<string>, distantNodeIds: Set<string>, understandingStatesById?: Record<string, string>, onNodeClick?: (node: object) => void, onNodePositionCommit?: (nodeId: string, position: {x:number,y:number}) => void, onViewportActionsChange?: (actions: { fitGraph: (() => void) | null, centerSelected: (() => void) | null } | null) => void, autoRecenterEnabled?: boolean, isMobile?: boolean, hoveredEntity?: { kind: 'node' | 'edge', id: string, screenX: number, screenY: number } | null, onSetHover?: (nextHover: { kind: 'node' | 'edge', id: string, screenX: number, screenY: number } | null) => void }} props */
export default function GraphCanvas({
  nodes,
  edges,
  visibleLayers,
  visibleDomains,
  selectedNodeId,
  isPanelOpen = false,
  panelWidth = 440,
  viewPanelWidth = 0,
  isViewPanelOpen = false,
  focalNodeIds,
  neighborNodeIds,
  distantNodeIds,
  understandingStatesById = {},
  onNodeClick,
  onNodePositionCommit,
  onViewportActionsChange,
  autoRecenterEnabled = true,
  isMobile = false,
  hoveredEntity = null,
  onSetHover,
}) {
  const canvasShellRef = useRef(null)
  const [userMoveEndCount, setUserMoveEndCount] = useState(0)
  const [, setViewportActions] = useState({ fitGraph: null, centerSelected: null })
  const [mobileDragArmedNodeId, setMobileDragArmedNodeId] = useState(null)
  const [mobileTouchTrackingActive, setMobileTouchTrackingActive] = useState(false)
  const [isDraggingNode, setIsDraggingNode] = useState(false)
  const longPressTimerRef = useRef(null)
  const pressedNodeIdRef = useRef(null)
  const suppressClickUntilRef = useRef(0)
  const activeLayers = useMemo(
    () =>
      visibleLayers instanceof Set
        ? visibleLayers
        : new Set(nodes.map((node) => node.layer).filter((layer) => typeof layer === 'string')),
    [nodes, visibleLayers],
  )
  const activeDomains = useMemo(
    () =>
      visibleDomains instanceof Set
        ? visibleDomains
        : new Set(
            nodes
              .map((node) => node.domain)
              .filter((domain) => typeof domain === 'string'),
          ),
    [nodes, visibleDomains],
  )
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )
  const edgeById = useMemo(() => new Map(edges.map((edge) => [edge.id, edge])), [edges])
  const emphasisSelectedNodeId = selectedNode?.layer === 'concept' ? selectedNodeId : null
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])
  const frontierConceptIds = useMemo(
    () => getFrontierConceptIds(edges, nodeById, understandingStatesById),
    [edges, nodeById, understandingStatesById],
  )

  const flowNodes = useMemo(() => {
    const visibleConceptIds = new Set(
      nodes
        .filter(
          (node) =>
            node.layer === 'concept' &&
            activeLayers.has(node.layer) &&
            (typeof node.domain !== 'string' || activeDomains.has(node.domain)),
        )
        .map((node) => node.id),
    )
    const variablesLinkedToVisibleConcepts = new Set()
    for (const edge of edges) {
      const sourceNode = nodeById.get(edge.source)
      const targetNode = nodeById.get(edge.target)
      if (!sourceNode || !targetNode) {
        continue
      }
      if (
        sourceNode.layer === 'concept' &&
        targetNode.layer === 'variable' &&
        visibleConceptIds.has(sourceNode.id)
      ) {
        variablesLinkedToVisibleConcepts.add(targetNode.id)
      } else if (
        sourceNode.layer === 'variable' &&
        targetNode.layer === 'concept' &&
        visibleConceptIds.has(targetNode.id)
      ) {
        variablesLinkedToVisibleConcepts.add(sourceNode.id)
      }
    }

    const filtered = nodes.filter((node) => {
      if (!activeLayers.has(node.layer)) {
        return false
      }
      if (node.layer === 'concept') {
        return typeof node.domain !== 'string' || activeDomains.has(node.domain)
      }
      if (node.layer === 'variable') {
        return variablesLinkedToVisibleConcepts.has(node.id)
      }
      return typeof node.domain !== 'string' || activeDomains.has(node.domain)
    })
    const mapped = toFlowNodes(
      filtered,
      emphasisSelectedNodeId,
      focalNodeIds,
      neighborNodeIds,
      distantNodeIds,
      understandingStatesById,
      frontierConceptIds,
      onSetHover,
      isDraggingNode,
    )
    return mapped
  }, [
    emphasisSelectedNodeId,
    distantNodeIds,
    focalNodeIds,
    neighborNodeIds,
    nodes,
    edges,
    understandingStatesById,
    frontierConceptIds,
    isDraggingNode,
    onSetHover,
    activeDomains,
    activeLayers,
    nodeById,
  ])
  const [interactiveNodes, setInteractiveNodes, onNodesChange] = useNodesState(flowNodes)

  useEffect(() => {
    setInteractiveNodes(flowNodes)
  }, [flowNodes, setInteractiveNodes])

  const flowEdges = useMemo(() => {
    const visibleNodeIds = new Set(interactiveNodes.map((node) => node.id))
    const filtered = edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    )
    return toFlowEdges(
      filtered,
      emphasisSelectedNodeId,
      neighborNodeIds,
      understandingStatesById,
      nodeById,
      onSetHover,
      isMobile,
    )
  }, [
    edges,
    emphasisSelectedNodeId,
    interactiveNodes,
    neighborNodeIds,
    onSetHover,
    isMobile,
    understandingStatesById,
    nodeById,
  ])

  const handleNodeClick = useCallback(
    (_, rfNode) => {
      if (Date.now() < suppressClickUntilRef.current) {
        return
      }
      const atlasNode = rfNode?.data?.node
      if (atlasNode && typeof onNodeClick === 'function') {
        onNodeClick(atlasNode)
      }
    },
    [onNodeClick],
  )

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }, [])

  const isTouchLikeEvent = useCallback((event) => {
    const pointerType = event?.pointerType ?? event?.nativeEvent?.pointerType
    if (pointerType) {
      return pointerType === 'touch' || pointerType === 'pen'
    }
    const eventType = event?.type ?? event?.nativeEvent?.type
    return typeof eventType === 'string' && eventType.startsWith('touch')
  }, [])

  const disarmMobileDrag = useCallback(() => {
    clearLongPressTimer()
    pressedNodeIdRef.current = null
    setMobileTouchTrackingActive(false)
    setMobileDragArmedNodeId(null)
  }, [clearLongPressTimer])

  const handleNodeMouseDown = useCallback(
    (event, rfNode) => {
      if (!isMobile || !isTouchLikeEvent(event) || typeof rfNode?.id !== 'string') {
        return
      }
      clearLongPressTimer()
      pressedNodeIdRef.current = rfNode.id
      setMobileTouchTrackingActive(true)
      setMobileDragArmedNodeId(null)
      longPressTimerRef.current = window.setTimeout(() => {
        if (pressedNodeIdRef.current === rfNode.id) {
          setMobileDragArmedNodeId(rfNode.id)
        }
      }, MOBILE_LONG_PRESS_MS)
    },
    [clearLongPressTimer, isMobile, isTouchLikeEvent],
  )

  const handleNodeMouseUp = useCallback(
    (event) => {
      if (!isMobile || !isTouchLikeEvent(event)) {
        return
      }
      if (!mobileDragArmedNodeId) {
        clearLongPressTimer()
        pressedNodeIdRef.current = null
        setMobileTouchTrackingActive(false)
      }
    },
    [clearLongPressTimer, isMobile, isTouchLikeEvent, mobileDragArmedNodeId],
  )

  const handlePanePointerUp = useCallback(() => {
    if (!isMobile) {
      return
    }
    disarmMobileDrag()
  }, [disarmMobileDrag, isMobile])

  const handleMoveEnd = useCallback((event) => {
    // React Flow emits null/undefined event for programmatic viewport moves.
    if (!event) {
      return
    }
    if (typeof onSetHover === 'function') {
      onSetHover(null)
    }
    setUserMoveEndCount((value) => value + 1)
  }, [onSetHover])

  const handleMoveStart = useCallback(() => {
    if (typeof onSetHover === 'function') {
      onSetHover(null)
    }
  }, [onSetHover])

  const handleNodeDragStop = useCallback(
    (_, rfNode) => {
      setIsDraggingNode(false)
      if (typeof onSetHover === 'function') {
        onSetHover(null)
      }
      if (
        typeof onNodePositionCommit === 'function' &&
        typeof rfNode?.id === 'string' &&
        typeof rfNode?.position?.x === 'number' &&
        typeof rfNode?.position?.y === 'number'
      ) {
        onNodePositionCommit(rfNode.id, rfNode.position)
      }
      if (isMobile) {
        suppressClickUntilRef.current = Date.now() + CLICK_SUPPRESSION_AFTER_DRAG_MS
        disarmMobileDrag()
      }
    },
    [disarmMobileDrag, isMobile, onNodePositionCommit, onSetHover],
  )

  const handleNodeDragStart = useCallback(() => {
    setIsDraggingNode(true)
    if (typeof onSetHover === 'function') {
      onSetHover(null)
    }
    if (!isMobile) {
      return
    }
    clearLongPressTimer()
  }, [clearLongPressTimer, isMobile, onSetHover])

  const handleViewportActionsChange = useCallback(
    (actions) => {
      const safeActions =
        actions && typeof actions.fitGraph === 'function' && typeof actions.centerSelected === 'function'
          ? actions
          : { fitGraph: null, centerSelected: null }
      setViewportActions(safeActions)
      if (typeof onViewportActionsChange === 'function') {
        onViewportActionsChange(safeActions)
      }
    },
    [onViewportActionsChange],
  )

  useEffect(() => {
    if (!isMobile) {
      clearLongPressTimer()
      pressedNodeIdRef.current = null
      setMobileDragArmedNodeId(null)
      setMobileTouchTrackingActive(false)
    }
  }, [clearLongPressTimer, isMobile])

  useEffect(() => {
    return () => {
      clearLongPressTimer()
    }
  }, [clearLongPressTimer])

  const mobileDragEnabled = !isMobile || mobileTouchTrackingActive || Boolean(mobileDragArmedNodeId)
  const nodeDragThreshold = isMobile
    ? mobileDragArmedNodeId
      ? 1
      : MOBILE_IDLE_DRAG_THRESHOLD
    : 1

  return (
    <div
      ref={canvasShellRef}
      className={`relative h-screen w-screen bg-surface ${isMobile ? 'touch-none' : ''}`}
    >
      <ReactFlow
        nodes={interactiveNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={1.75}
        nodesDraggable={mobileDragEnabled}
        nodeDragThreshold={nodeDragThreshold}
        selectNodesOnDrag={false}
        panOnScroll={!isMobile}
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
        onNodeClick={handleNodeClick}
        onNodeMouseDown={handleNodeMouseDown}
        onNodeMouseUp={handleNodeMouseUp}
        onNodeMouseLeave={handleNodeMouseUp}
        onPaneClick={handlePanePointerUp}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        onMoveStart={handleMoveStart}
        onMoveEnd={handleMoveEnd}
        className={`atlas-react-flow h-full w-full ${isMobile ? 'touch-none' : ''}`}
      >
        <ViewportActionsBridge
          selectedNodeId={selectedNodeId}
          panelWidth={panelWidth}
          isPanelOpen={isPanelOpen}
          viewPanelWidth={viewPanelWidth}
          isViewPanelOpen={isViewPanelOpen}
          isMobile={isMobile}
          onActionsChange={handleViewportActionsChange}
        />
        <CameraController
          selectedNodeId={selectedNodeId}
          isPanelOpen={isPanelOpen}
          panelWidth={panelWidth}
          viewPanelWidth={viewPanelWidth}
          isViewPanelOpen={isViewPanelOpen}
          userMoveEndCount={userMoveEndCount}
          autoRecenterEnabled={autoRecenterEnabled}
          isMobile={isMobile}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          color="rgb(51 65 85 / 0.45)"
        />
        <ViewportUtilityControls isMobile={isMobile} containerRef={canvasShellRef} />
      </ReactFlow>
      <HoverCardOverlay
        hoveredEntity={hoveredEntity}
        nodeById={nodeById}
        edgeById={edgeById}
        isMobile={isMobile}
        isDraggingNode={isDraggingNode}
      />
    </div>
  )
}
