import { useCallback, useState } from 'react'
import GraphCanvas from './components/GraphCanvas.jsx'
import NodePanel from './components/NodePanel.jsx'

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null)

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null)
  }, [])

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <GraphCanvas onNodeClick={handleNodeClick} />
      <NodePanel selectedNode={selectedNode} onClose={handleClosePanel} />
    </main>
  )
}
