import { useCallback, useMemo, useState } from 'react'
import GraphCanvas from './components/GraphCanvas.jsx'
import NodePanel from './components/NodePanel.jsx'
import nodesData from './data/nodes.json'
import { buildEdges } from './data/edges'
import { computeLayout, computeMass } from './lib/layout'
import { getUnderstood } from './lib/understanding'

const LAYOUT_CACHE_KEY = 'atlas_layout_v1'

function getNodeIdSet(nodes) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join('|')
}

function getLayoutPositions(nodes, edges) {
  const nodeIdSet = getNodeIdSet(nodes)
  if (typeof window === 'undefined') {
    return computeLayout(nodes, edges)
  }

  try {
    const raw = window.localStorage.getItem(LAYOUT_CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.nodeIdSet === nodeIdSet && parsed?.positions) {
        return parsed.positions
      }
    }
  } catch {
    // Ignore cache parsing errors and recompute below.
  }

  const positions = computeLayout(nodes, edges)

  try {
    window.localStorage.setItem(
      LAYOUT_CACHE_KEY,
      JSON.stringify({ nodeIdSet, positions }),
    )
  } catch {
    // Ignore cache write failures.
  }

  return positions
}

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [understandingVersion, setUnderstandingVersion] = useState(0)
  const edges = useMemo(() => buildEdges(nodesData), [])
  const understoodNodeIds = useMemo(() => getUnderstood(), [understandingVersion])

  const positionedNodes = useMemo(() => {
    const positions = getLayoutPositions(nodesData, edges)
    return nodesData.map((node) => ({
      ...node,
      mass: computeMass(node, edges),
      position: positions[node.id] ?? { x: 0, y: 0 },
    }))
  }, [edges])

  const handleNodeClick = useCallback((node) => {
    setSelectedNodeId(node?.id ?? null)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const handleUnderstandingChange = useCallback(() => {
    setUnderstandingVersion((value) => value + 1)
  }, [])

  const focalNodeIds = useMemo(
    () => (selectedNodeId ? new Set([selectedNodeId]) : new Set()),
    [selectedNodeId],
  )

  const neighborNodeIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set()
    }
    const ids = new Set()
    for (const edge of edges) {
      if (edge.source === selectedNodeId) {
        ids.add(edge.target)
      } else if (edge.target === selectedNodeId) {
        ids.add(edge.source)
      }
    }
    return ids
  }, [edges, selectedNodeId])

  const distantNodeIds = useMemo(() => {
    const ids = new Set()
    for (const node of positionedNodes) {
      if (!focalNodeIds.has(node.id) && !neighborNodeIds.has(node.id)) {
        ids.add(node.id)
      }
    }
    return ids
  }, [focalNodeIds, neighborNodeIds, positionedNodes])

  const selectedNode = useMemo(
    () => positionedNodes.find((node) => node.id === selectedNodeId) ?? null,
    [positionedNodes, selectedNodeId],
  )

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <GraphCanvas
        nodes={positionedNodes}
        edges={edges}
        selectedNodeId={selectedNodeId}
        focalNodeIds={focalNodeIds}
        neighborNodeIds={neighborNodeIds}
        distantNodeIds={distantNodeIds}
        understoodNodeIds={understoodNodeIds}
        onNodeClick={handleNodeClick}
      />
      <NodePanel
        selectedNode={selectedNode}
        onClose={handleClosePanel}
        onUnderstandingChange={handleUnderstandingChange}
      />
    </main>
  )
}
