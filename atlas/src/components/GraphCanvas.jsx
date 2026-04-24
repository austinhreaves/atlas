import { useCallback, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
} from 'reactflow'

import nodesData from '../data/nodes.json'
import edgesData from '../data/edges.json'

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

function AtlasNode({ data, selected }) {
  const domain = data.domain
  const card =
    domainCardClass[domain] ??
    'border-slate-600/50 bg-slate-950/85 text-slate-100 shadow-lg shadow-black/40'
  const badge =
    domainBadgeClass[domain] ?? 'bg-slate-700/40 text-slate-300 ring-1 ring-slate-500/40'

  return (
    <div
      className={`min-w-[200px] max-w-[260px] rounded-xl border px-3 py-2.5 backdrop-blur-sm transition-[box-shadow,transform] duration-200 ${
        selected ? 'ring-2 ring-sky-400/60 ring-offset-2 ring-offset-slate-950' : ''
      } ${card}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border !border-slate-600 !bg-slate-800"
      />
      <p className="text-[13px] font-semibold leading-snug tracking-tight text-slate-50">
        {data.title}
      </p>
      <p
        className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge}`}
      >
        {data.domain}
      </p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border !border-slate-600 !bg-slate-800"
      />
    </div>
  )
}

const nodeTypes = { atlasNode: AtlasNode }

function toFlowNodes(nodes) {
  return nodes.map((node) => ({
    id: node.id,
    type: 'atlasNode',
    position: { x: node.position.x, y: node.position.y },
    data: {
      title: node.title,
      domain: node.domain,
      node,
    },
  }))
}

function toFlowEdges(edges) {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  }))
}

/** @param {{ onNodeClick?: (node: object) => void }} props */
export default function GraphCanvas({ onNodeClick }) {
  const domains = useMemo(
    () => [...new Set(nodesData.map((node) => node.domain))].sort(),
    [],
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
    const filtered = nodesData.filter((node) => visibleDomains.has(node.domain))
    return toFlowNodes(filtered)
  }, [visibleDomains])

  const flowEdges = useMemo(() => {
    const visibleNodeIds = new Set(flowNodes.map((node) => node.id))
    const filtered = edgesData.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    )
    return toFlowEdges(filtered)
  }, [flowNodes])

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
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={1.75}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { stroke: '#64748b', strokeWidth: 1.5 },
        }}
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
