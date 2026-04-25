import { describe, expect, it } from 'vitest'
import nodes from './nodes.json'
import { buildEdges } from './edges'
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

  it('only references existing nodes in prerequisites', () => {
    const ids = new Set(nodes.map((node) => node.id))
    const missingRefs = nodes.flatMap((node) =>
      node.prerequisites
        .filter((prerequisite) => !ids.has(prerequisite.id))
        .map((prerequisite) => `${prerequisite.id}->${node.id}`),
    )

    expect(missingRefs).toEqual([])
  })

  it('contains unique exact edges and valid source/target ids', () => {
    const edges = buildEdges(nodes)
    const edgePairs = edges.map((edge) => `${edge.source}->${edge.target}`)
    expect(edgePairs.length).toBeGreaterThan(0)

    const ids = new Set(nodes.map((node) => node.id))
    const invalidEdges = edges.filter(
      (edge) => !ids.has(edge.source) || !ids.has(edge.target),
    )
    expect(invalidEdges).toEqual([])
  })

  it('matches edges exactly to node prerequisites including type and weight', () => {
    const edges = buildEdges(nodes)
    const expected = new Set(
      nodes.flatMap((node) =>
        node.prerequisites.map(
          (prerequisite) =>
            `${prerequisite.id}->${node.id}:${prerequisite.type}:${prerequisite.weight}`,
        ),
      ),
    )
    const actual = new Set(
      edges.map((edge) => `${edge.source}->${edge.target}:${edge.type}:${edge.weight}`),
    )

    expect(actual).toEqual(expected)
  })

  it('rejects legacy connections field on all nodes', () => {
    const legacyIds = nodes.filter((node) => 'connections' in node).map((node) => node.id)
    expect(legacyIds).toEqual([])
  })

  it('symmetric nodes contain only conserved variable roles', () => {
    const violations = nodes
      .filter((node) => node.causal_structure === 'symmetric')
      .flatMap((node) =>
        node.variables
          .filter((variable) => variable.role !== 'conserved')
          .map((variable) => `${node.id}:${variable.symbol}`),
      )
    expect(violations).toEqual([])
  })
})
