import { describe, expect, it } from 'vitest'
import { computeLayout, computeMass } from '../layout'

describe('layout helpers', () => {
  const nodes = [
    { id: 'a', mass: null, position: null },
    { id: 'b', mass: null, position: null },
    { id: 'c', mass: null, position: null },
  ]

  const edges = [
    { source: 'a', target: 'b', type: 'foundational', weight: 0.9 },
    { source: 'a', target: 'c', type: 'foundational', weight: 0.8 },
    { source: 'b', target: 'c', type: 'supporting', weight: 0.5 },
  ]

  it('computeLayout returns positions for every input node', () => {
    const positions = computeLayout(nodes, edges)
    expect(Object.keys(positions).sort()).toEqual(['a', 'b', 'c'])
    for (const value of Object.values(positions)) {
      expect(typeof value.x).toBe('number')
      expect(typeof value.y).toBe('number')
    }
  })

  it('computeLayout is deterministic for identical input', () => {
    const first = computeLayout(nodes, edges)
    const second = computeLayout(nodes, edges)
    expect(first).toEqual(second)
  })

  it('pinned nodes retain declared positions', () => {
    const pinnedNodes = [
      { id: 'a', mass: null, position: { x: 120, y: -45, pinned: true } },
      { id: 'b', mass: null, position: null },
    ]
    const pinnedEdges = [{ source: 'a', target: 'b', type: 'foundational', weight: 0.8 }]
    const positions = computeLayout(pinnedNodes, pinnedEdges)

    expect(positions.a).toEqual({ x: 120, y: -45 })
  })

  it('computeMass returns explicit node.mass when provided', () => {
    const node = { id: 'x', mass: 2.4 }
    expect(computeMass(node, edges)).toBe(2.4)
  })

  it('computeMass computes from foundational outgoing edges', () => {
    const node = { id: 'a', mass: null }
    expect(computeMass(node, edges)).toBe(2)
  })
})
