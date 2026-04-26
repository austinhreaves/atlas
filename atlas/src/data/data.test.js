import { describe, expect, it } from 'vitest'
import variables from './variables.json'
import { buildEdges } from './edges'
import { computeAppearsIn, concepts, getAllEntities, getEntitiesByLayer } from './index'

describe('data layer integrity', () => {
  it('contains concept entities from both domain files', () => {
    expect(concepts.length).toBeGreaterThan(0)
  })

  it('has unique concept ids', () => {
    const ids = concepts.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only references existing concepts in prerequisites', () => {
    const ids = new Set(concepts.map((node) => node.id))
    const missingRefs = concepts.flatMap((node) =>
      node.prerequisites
        .filter((prerequisite) => !ids.has(prerequisite.id))
        .map((prerequisite) => `${prerequisite.id}->${node.id}`),
    )

    expect(missingRefs).toEqual([])
  })

  it('contains unique exact edges and valid source/target ids', () => {
    const allEntities = getAllEntities()
    const edges = buildEdges(allEntities, { strict: true })
    const edgePairs = edges.map((edge) => `${edge.source}->${edge.target}`)
    expect(edgePairs.length).toBeGreaterThan(0)

    const ids = new Set(allEntities.map((entity) => entity.id))
    const invalidEdges = edges.filter(
      (edge) => !ids.has(edge.source) || !ids.has(edge.target),
    )
    expect(invalidEdges).toEqual([])
  })

  it('matches edges exactly to node prerequisites including type and weight', () => {
    const edges = buildEdges(getAllEntities(), { strict: true })
    const expected = new Set(
      concepts.flatMap((node) =>
        node.prerequisites.map(
          (prerequisite) =>
            `${prerequisite.id}->${node.id}:${prerequisite.type}:${prerequisite.weight}`,
        ),
      ),
    )
    const prerequisiteEdges = edges.filter((edge) => edge.layer_pair === 'concept-concept')
    const actual = new Set(
      prerequisiteEdges.map((edge) => `${edge.source}->${edge.target}:${edge.type}:${edge.weight}`),
    )

    expect(actual).toEqual(expected)
  })

  it('uses the v3 edge id format', () => {
    const edges = buildEdges(getAllEntities(), { strict: true })
    expect(edges.every((edge) => edge.id === `${edge.source}__${edge.type}__${edge.target}`)).toBe(
      true,
    )
  })

  it('rejects legacy connections field on all nodes', () => {
    const legacyIds = concepts.filter((node) => 'connections' in node).map((node) => node.id)
    expect(legacyIds).toEqual([])
  })

  it('symmetric nodes contain only conserved variable roles', () => {
    const violations = concepts
      .filter((node) => node.causal_structure === 'symmetric')
      .flatMap((node) =>
        node.variables
          .filter((variable) => variable.role !== 'conserved')
          .map((variable) => `${node.id}:${variable.symbol}`),
      )
    expect(violations).toEqual([])
  })

  it('returns entities grouped by layer and merged list', () => {
    expect(getEntitiesByLayer('concept')).toHaveLength(concepts.length)
    expect(getEntitiesByLayer('variable')).toHaveLength(variables.length)
    expect(getAllEntities()).toHaveLength(concepts.length + variables.length)
  })

  it('computes appears-in reverse index for all variables', () => {
    const appearsIn = computeAppearsIn(variables, concepts)
    const unknownIds = Object.keys(appearsIn).filter(
      (variableId) => !variables.some((variable) => variable.id === variableId),
    )
    expect(unknownIds).toEqual([])
  })
})
