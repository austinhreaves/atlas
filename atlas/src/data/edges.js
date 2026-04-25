/**
 * Build React Flow edge objects from each node's `prerequisites` list.
 *
 * @param {Array<{ id: string, prerequisites: Array<{ id: string, type: string, weight: number }> }>} nodes
 * @returns {Array<{ id: string, source: string, target: string, type: string, weight: number }>}
 */
export function buildEdges(nodes) {
  if (!Array.isArray(nodes)) {
    return []
  }

  const seen = new Set()
  const edges = []

  for (const node of nodes) {
    if (!node || typeof node.id !== 'string' || !Array.isArray(node.prerequisites)) {
      continue
    }

    for (const prerequisite of node.prerequisites) {
      if (
        !prerequisite ||
        typeof prerequisite.id !== 'string' ||
        typeof prerequisite.type !== 'string' ||
        typeof prerequisite.weight !== 'number'
      ) {
        continue
      }

      const source = prerequisite.id
      const target = node.id

      if (source === target) {
        continue
      }

      const key = `${source}\0${target}\0${prerequisite.type}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)

      edges.push({
        id: `${source}--${target}--${prerequisite.type}`,
        source,
        target,
        type: prerequisite.type,
        weight: prerequisite.weight,
      })
    }
  }

  return edges
}
