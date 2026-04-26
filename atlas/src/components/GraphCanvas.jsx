import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useNodesState,
} from 'reactflow'
import FloatingEdge from './FloatingEdge.jsx'
import CameraController from './graph/CameraController.jsx'
import LayoutControls from './graph/LayoutControls.jsx'
import ConceptNode from './nodes/ConceptNode.jsx'
import VariableNode from './nodes/VariableNode.jsx'

const nodeTypes = { concept: ConceptNode, variable: VariableNode }
const edgeTypes = { atlas: FloatingEdge }

function toFlowNodes(
  nodes,
  selectedNodeId,
  focalNodeIds,
  neighborNodeIds,
  distantNodeIds,
  understoodNodeIds,
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
        isUnderstood: understoodNodeIds.has(node.id),
        node,
      },
    }
  })
}

function toFlowEdges(edges, selectedNodeId, neighborNodeIds, understoodNodeIds) {
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
      isFrontier:
        edge.type === 'foundational' &&
        understoodNodeIds.has(edge.source) &&
        !understoodNodeIds.has(edge.target),
    },
  }))
}

/** @param {{ nodes: object[], edges: object[], selectedNodeId: string | null, isPanelOpen?: boolean, panelWidth?: number, focalNodeIds: Set<string>, neighborNodeIds: Set<string>, distantNodeIds: Set<string>, understoodNodeIds: Set<string>, onNodeClick?: (node: object) => void, onNodePositionCommit?: (nodeId: string, position: {x:number,y:number}) => void, onResetToCanonical?: () => void, onResetSelected?: () => void, onExportLayout?: () => void, onImportLayout?: (file: File) => void | Promise<void> }} props */
export default function GraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  isPanelOpen = false,
  panelWidth = 440,
  focalNodeIds,
  neighborNodeIds,
  distantNodeIds,
  understoodNodeIds,
  onNodeClick,
  onNodePositionCommit,
  onResetToCanonical,
  onResetSelected,
  onExportLayout,
  onImportLayout,
}) {
  const domains = useMemo(
    () =>
      [...new Set(nodes.map((node) => node.domain).filter((domain) => typeof domain === 'string'))]
        .sort(),
    [nodes],
  )
  const [visibleDomains, setVisibleDomains] = useState(() => new Set(domains))
  const [userMoveEndCount, setUserMoveEndCount] = useState(0)
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )
  const emphasisSelectedNodeId = selectedNode?.layer === 'concept' ? selectedNodeId : null

  const toggleDomain = useCallback((domain) => {
    setVisibleDomains((current) => {
      const next = new Set(current)
      if (next.has(domain)) {
        next.delete(domain)
      } else {
        next.add(domain)
      }
      return next
    })
  }, [])

  const flowNodes = useMemo(() => {
    const filtered = nodes.filter(
      (node) => typeof node.domain !== 'string' || visibleDomains.has(node.domain),
    )
    const mapped = toFlowNodes(
      filtered,
      emphasisSelectedNodeId,
      focalNodeIds,
      neighborNodeIds,
      distantNodeIds,
      understoodNodeIds,
    )
    return mapped
  }, [
    emphasisSelectedNodeId,
    distantNodeIds,
    focalNodeIds,
    neighborNodeIds,
    nodes,
    selectedNode,
    selectedNodeId,
    understoodNodeIds,
    visibleDomains,
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
    return toFlowEdges(filtered, emphasisSelectedNodeId, neighborNodeIds, understoodNodeIds)
  }, [edges, emphasisSelectedNodeId, interactiveNodes, neighborNodeIds, understoodNodeIds])

  const handleNodeClick = useCallback(
    (_, rfNode) => {
      const atlasNode = rfNode?.data?.node
      if (atlasNode && typeof onNodeClick === 'function') {
        onNodeClick(atlasNode)
      }
    },
    [onNodeClick],
  )

  const handleMoveEnd = useCallback((event) => {
    // React Flow emits null/undefined event for programmatic viewport moves.
    if (!event) {
      return
    }
    setUserMoveEndCount((value) => value + 1)
  }, [])

  const handleNodeDragStop = useCallback(
    (_, rfNode) => {
      if (
        typeof onNodePositionCommit === 'function' &&
        typeof rfNode?.id === 'string' &&
        typeof rfNode?.position?.x === 'number' &&
        typeof rfNode?.position?.y === 'number'
      ) {
        onNodePositionCommit(rfNode.id, rfNode.position)
      }
    },
    [onNodePositionCommit],
  )

  return (
    <div className="h-screen w-screen bg-surface">
      <div className="pointer-events-none absolute left-4 top-4 z-20">
        <div className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Domains
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => {
              const active = visibleDomains.has(domain)
              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide transition ${
                    active
                      ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                      : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
                  }`}
                >
                  {domain}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <LayoutControls
        selectedNodeId={selectedNodeId}
        onResetToCanonical={onResetToCanonical}
        onResetSelected={onResetSelected}
        onExportLayout={onExportLayout}
        onImportLayout={onImportLayout}
      />
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
        nodesDraggable
        selectNodesOnDrag={false}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onMoveEnd={handleMoveEnd}
        className="atlas-react-flow h-full w-full"
      >
        <CameraController
          selectedNodeId={selectedNodeId}
          isPanelOpen={isPanelOpen}
          panelWidth={panelWidth}
          userMoveEndCount={userMoveEndCount}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          color="rgb(51 65 85 / 0.45)"
        />
        <Controls
          className="!m-3 !overflow-hidden !rounded-lg !border !border-slate-600/60 !bg-slate-900/95 !shadow-xl !shadow-black/50 [&_button]:!border-slate-600/50 [&_button]:!bg-slate-800/90 [&_button]:!fill-slate-200 [&_button:hover]:!bg-slate-700/90"
        />
      </ReactFlow>
    </div>
  )
}
