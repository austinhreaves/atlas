import { useCallback, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
} from 'reactflow'
import FloatingEdge from './FloatingEdge.jsx'

const domainCardClass = {
  mechanics:
    'border-cyan-500/45 bg-slate-950/85 text-slate-100 shadow-[0_0_28px_-6px_rgba(34,211,238,0.28)]',
  electromagnetism:
    'border-violet-500/45 bg-slate-950/85 text-slate-100 shadow-[0_0_28px_-6px_rgba(167,139,250,0.28)]',
}

const domainBadgeClass = {
  mechanics: 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/35',
  electromagnetism: 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/35',
}
const floatingHandleClass =
  '!h-0 !w-0 !border-0 !bg-transparent !opacity-0 !pointer-events-none'

function AtlasNode({ data, selected }) {
  const domain = data.domain
  const card =
    domainCardClass[domain] ??
    'border-slate-600/50 bg-slate-950/85 text-slate-100 shadow-lg shadow-black/40'
  const badge =
    domainBadgeClass[domain] ?? 'bg-slate-700/40 text-slate-300 ring-1 ring-slate-500/40'
  const mass = Math.max(1, Math.min(3, typeof data.mass === 'number' ? data.mass : 1))
  const diameter = 80 + (mass - 1) * 20
  const visualState = data.visualState ?? 'base'
  const scale = visualState === 'focal' ? 1.1 : visualState === 'neighbor' ? 1.06 : 1
  const selectionActive = visualState !== 'base'
  const isUnderstood = data.isUnderstood === true
  const opacity = selectionActive ? (visualState === 'distant' ? 0.3 : 1) : isUnderstood ? 0.7 : 1
  const accentRing = visualState === 'focal'
  const filter = !selectionActive && isUnderstood ? 'saturate(0.3)' : undefined

  return (
    <div
      className={`relative rounded-full border px-3 py-2.5 backdrop-blur-sm transition-[box-shadow,transform,opacity,filter] duration-300 ease-out ${
        selected || accentRing ? 'ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-slate-950' : ''
      } ${card}`}
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        filter,
      }}
    >
      {isUnderstood ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-500/80 text-[10px] font-bold text-slate-950">
          ✓
        </span>
      ) : null}
      <Handle id="target-top" type="target" position={Position.Top} className={floatingHandleClass} />
      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        className={floatingHandleClass}
      />
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        className={floatingHandleClass}
      />
      <Handle id="target-left" type="target" position={Position.Left} className={floatingHandleClass} />
      <Handle id="source-top" type="source" position={Position.Top} className={floatingHandleClass} />
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        className={floatingHandleClass}
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        className={floatingHandleClass}
      />
      <Handle id="source-left" type="source" position={Position.Left} className={floatingHandleClass} />
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-slate-50">
          {data.title}
        </p>
        <p
          className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge}`}
        >
          {data.domain}
        </p>
      </div>
    </div>
  )
}

const nodeTypes = { atlasNode: AtlasNode }
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
      type: 'atlasNode',
      position: { x: nodeX, y: nodeY },
      data: {
        title: node.title,
        domain: node.domain,
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

/** @param {{ nodes: object[], edges: object[], selectedNodeId: string | null, focalNodeIds: Set<string>, neighborNodeIds: Set<string>, distantNodeIds: Set<string>, understoodNodeIds: Set<string>, onNodeClick?: (node: object) => void }} props */
export default function GraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  focalNodeIds,
  neighborNodeIds,
  distantNodeIds,
  understoodNodeIds,
  onNodeClick,
}) {
  const domains = useMemo(
    () => [...new Set(nodes.map((node) => node.domain))].sort(),
    [nodes],
  )
  const [visibleDomains, setVisibleDomains] = useState(() => new Set(domains))

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
    const filtered = nodes.filter((node) => visibleDomains.has(node.domain))
    return toFlowNodes(
      filtered,
      selectedNodeId,
      focalNodeIds,
      neighborNodeIds,
      distantNodeIds,
      understoodNodeIds,
    )
  }, [
    distantNodeIds,
    focalNodeIds,
    neighborNodeIds,
    nodes,
    selectedNodeId,
    understoodNodeIds,
    visibleDomains,
  ])

  const flowEdges = useMemo(() => {
    const visibleNodeIds = new Set(flowNodes.map((node) => node.id))
    const filtered = edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    )
    return toFlowEdges(filtered, selectedNodeId, neighborNodeIds, understoodNodeIds)
  }, [edges, flowNodes, neighborNodeIds, selectedNodeId, understoodNodeIds])

  const handleNodeClick = useCallback(
    (_, rfNode) => {
      const atlasNode = rfNode?.data?.node
      if (atlasNode && typeof onNodeClick === 'function') {
        onNodeClick(atlasNode)
      }
    },
    [onNodeClick],
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
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={1.75}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
        onNodeClick={handleNodeClick}
        className="atlas-react-flow h-full w-full"
      >
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
