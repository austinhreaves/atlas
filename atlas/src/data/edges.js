/**
 * Build React Flow edge objects from each node's `connections` list.
 *
 * @param {Array<{ id: string, connections: string[] }>} nodes
 * @returns {Array<{ id: string, source: string, target: string }>}
 */
export function buildEdges(nodes) {
  if (!Array.isArray(nodes)) {
    return []
  }

  const seen = new Set()
  const edges = []

  for (const node of nodes) {
    if (!node || typeof node.id !== 'string' || !Array.isArray(node.connections)) {
      continue
    }

    for (const otherId of node.connections) {
      if (typeof otherId !== 'string') {
        continue
      }

      const a = node.id < otherId ? node.id : otherId
      const b = node.id < otherId ? otherId : node.id
      const key = `${a}\0${b}`

      if (seen.has(key)) {
        continue
      }
      seen.add(key)

      edges.push({
        id: `${a}--${b}`,
        source: a,
        target: b,
      })
    }
  }

  return edges
}
