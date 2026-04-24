import { describe, expect, it } from 'vitest'
import nodes from '../nodes.json'
import { validateNode } from '../schema'
import { buildEdges } from '../edges'

describe('nodes data integrity', () => {
  it('every node passes validateNode with zero errors', () => {
    const errors = nodes.flatMap((node) =>
      validateNode(node).map((message) => `${node.id}: ${message}`),
    )
    expect(errors).toEqual([])
  })

  it('every connection id resolves to a real node id', () => {
    const nodeIds = new Set(nodes.map((node) => node.id))
    const missingConnections = nodes.flatMap((node) =>
      node.connections
        .filter((connectionId) => !nodeIds.has(connectionId))
        .map((connectionId) => `${node.id}->${connectionId}`),
    )

    expect(missingConnections).toEqual([])
  })

  it('has unique node ids', () => {
    const ids = nodes.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('buildEdges produces no duplicate edges', () => {
    const edges = buildEdges(nodes)
    const pairKeys = edges.map((edge) => `${edge.source}->${edge.target}`)
    expect(new Set(pairKeys).size).toBe(pairKeys.length)
  })

  it('buildEdges produces no self-referencing edges', () => {
    const edges = buildEdges(nodes)
    const selfEdges = edges.filter((edge) => edge.source === edge.target)
    expect(selfEdges).toEqual([])
  })

  it('every phet node has a non-null visual.url', () => {
    const invalidPhetNodes = nodes.filter(
      (node) => node.visual.type === 'phet' && node.visual.url === null,
    )
    expect(invalidPhetNodes).toEqual([])
  })

  it('every node has at least one tag', () => {
    const taglessNodes = nodes.filter(
      (node) => !Array.isArray(node.tags) || node.tags.length === 0,
    )
    expect(taglessNodes).toEqual([])
  })
})
