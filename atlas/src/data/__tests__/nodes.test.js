import { describe, expect, it } from 'vitest'
import katex from 'katex'
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

  it('every prerequisite id resolves to a real node id', () => {
    const nodeIds = new Set(nodes.map((node) => node.id))
    const missingPrerequisites = nodes.flatMap((node) =>
      node.prerequisites
        .filter((prerequisite) => !nodeIds.has(prerequisite.id))
        .map((prerequisite) => `${prerequisite.id}->${node.id}`),
    )

    expect(missingPrerequisites).toEqual([])
  })

  it('has unique node ids', () => {
    const ids = nodes.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('buildEdges deduplicates exact duplicate edges only', () => {
    const edges = buildEdges(nodes)
    const exactKeys = edges.map((edge) => `${edge.source}->${edge.target}:${edge.type}`)
    expect(new Set(exactKeys).size).toBe(exactKeys.length)
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

  it('every variable has a valid role', () => {
    const allowedRoles = new Set([
      'driver',
      'response',
      'parameter',
      'covariate',
      'conserved',
    ])
    const invalidRoles = nodes.flatMap((node) =>
      node.variables
        .filter((variable) => !allowedRoles.has(variable.role))
        .map((variable) => `${node.id}:${variable.symbol}`),
    )

    expect(invalidRoles).toEqual([])
  })

  it('symmetric nodes use conserved role for all variables', () => {
    const invalidSymmetricNodes = nodes
      .filter((node) => node.causal_structure === 'symmetric')
      .flatMap((node) =>
        node.variables
          .filter((variable) => variable.role !== 'conserved')
          .map((variable) => `${node.id}:${variable.symbol}`),
      )

    expect(invalidSymmetricNodes).toEqual([])
  })

  it('no node contains legacy connections field', () => {
    const legacyNodes = nodes.filter((node) => 'connections' in node).map((node) => node.id)
    expect(legacyNodes).toEqual([])
  })

  it('buildEdges carries type and weight from prerequisites', () => {
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

  it('buildEdges defaults definitional edge weight to 1 when omitted', () => {
    const syntheticNodes = [
      { id: 'source', prerequisites: [] },
      { id: 'target', prerequisites: [{ id: 'source', type: 'definitional' }] },
    ]
    const edges = buildEdges(syntheticNodes)
    expect(edges).toEqual([
      { id: 'source--target--definitional', source: 'source', target: 'target', type: 'definitional', weight: 1 },
    ])
  })

  it('every node formula parses with KaTeX', () => {
    const formulaErrors = nodes.flatMap((node) => {
      try {
        katex.renderToString(node.formula, { throwOnError: true, displayMode: true })
        return []
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return [`${node.id}: ${errorMessage}`]
      }
    })

    expect(formulaErrors).toEqual([])
  })
})
