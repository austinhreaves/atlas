import { describe, expect, it } from 'vitest'
import nodes from './nodes.json'
import edges from './edges.json'
import { validateNode } from './schema'

describe('data layer integrity', () => {
  it('contains exactly 10 nodes', () => {
    expect(nodes).toHaveLength(10)
  })

  it('has schema-valid nodes', () => {
    const allErrors = nodes.flatMap((node) =>
      validateNode(node).map((error) => `${node.id}: ${error}`),
    )
    expect(allErrors).toEqual([])
  })

  it('has unique node ids', () => {
    const ids = nodes.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only references existing nodes in connections', () => {
    const ids = new Set(nodes.map((node) => node.id))
    const missingRefs = nodes.flatMap((node) =>
      node.connections
        .filter((connectionId) => !ids.has(connectionId))
        .map((connectionId) => `${node.id}->${connectionId}`),
    )

    expect(missingRefs).toEqual([])
  })

  it('contains unique edges and valid source/target ids', () => {
    const edgePairs = edges.map((edge) => `${edge.source}->${edge.target}`)
    expect(new Set(edgePairs).size).toBe(edgePairs.length)

    const ids = new Set(nodes.map((node) => node.id))
    const invalidEdges = edges.filter(
      (edge) => !ids.has(edge.source) || !ids.has(edge.target),
    )
    expect(invalidEdges).toEqual([])
  })

  it('matches edges exactly to node connections', () => {
    const expectedPairs = new Set(
      nodes.flatMap((node) =>
        node.connections.map((connectionId) => `${node.id}->${connectionId}`),
      ),
    )
    const actualPairs = new Set(edges.map((edge) => `${edge.source}->${edge.target}`))

    expect(actualPairs).toEqual(expectedPairs)
  })
})
