import { describe, expect, it } from 'vitest'
import katex from 'katex'
import concepts from '../concepts.json'
import variables from '../variables.json'
import { buildEdges } from '../edges'
import { validateEntity } from '../schema'
import { computeAppearsIn, getAllEntities } from '../index'

describe('entities data integrity', () => {
  it('contains exactly 10 concepts', () => {
    expect(concepts).toHaveLength(10)
  })

  it('every prerequisite id resolves to a real concept id', () => {
    const conceptIds = new Set(concepts.map((concept) => concept.id))
    const missingPrerequisites = concepts.flatMap((node) =>
      node.prerequisites
        .filter((prerequisite) => !conceptIds.has(prerequisite.id))
        .map((prerequisite) => `${prerequisite.id}->${node.id}`),
    )

    expect(missingPrerequisites).toEqual([])
  })

  it('has unique concept ids', () => {
    const ids = concepts.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique variable ids', () => {
    const ids = variables.map((variable) => variable.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all entities pass validateEntity with zero errors', () => {
    const allEntities = getAllEntities()
    const errors = allEntities.flatMap((entity) =>
      validateEntity(entity).map((message) => `${entity.id}: ${message}`),
    )
    expect(errors).toEqual([])
  })

  it('every concept variable reference resolves to a variable entity', () => {
    const variableIds = new Set(variables.map((variable) => variable.id))
    const missingReferences = concepts.flatMap((concept) =>
      (concept.variables ?? [])
        .filter((variableRef) => !variableIds.has(variableRef.id))
        .map((variableRef) => `${concept.id}->${variableRef.id}`),
    )
    expect(missingReferences).toEqual([])
  })

  it('every variable appears in at least one concept', () => {
    const appearsIn = computeAppearsIn(variables, concepts)
    const orphans = Object.entries(appearsIn)
      .filter(([, conceptIds]) => conceptIds.length === 0)
      .map(([variableId]) => variableId)
    expect(orphans).toEqual([])
  })

  it('every law/principle has applicability conditions', () => {
    const invalidConcepts = concepts
      .filter((concept) => concept.type === 'law' || concept.type === 'principle')
      .filter(
        (concept) =>
          !Array.isArray(concept.applicability_conditions) ||
          concept.applicability_conditions.length === 0,
      )
      .map((concept) => concept.id)
    expect(invalidConcepts).toEqual([])
  })

  it('required concepts include misconceptions entries', () => {
    const requiredIds = new Set([
      'newtons-second-law',
      'ohms-law',
      'coulombs-law',
      'gauss-law',
      'conservation-of-momentum',
    ])
    const missing = concepts
      .filter((concept) => requiredIds.has(concept.id))
      .filter(
        (concept) => !Array.isArray(concept.misconceptions) || concept.misconceptions.length === 0,
      )
      .map((concept) => concept.id)
    expect(missing).toEqual([])
  })

  it('buildEdges deduplicates exact duplicate edges only', () => {
    const edges = buildEdges(getAllEntities(), { strict: true })
    const exactKeys = edges.map((edge) => `${edge.source}->${edge.target}:${edge.type}`)
    expect(new Set(exactKeys).size).toBe(exactKeys.length)
  })

  it('buildEdges(getAllEntities) includes prerequisite and uses-variable counts', () => {
    const allEntities = getAllEntities()
    const edges = buildEdges(allEntities, { strict: true })
    const prerequisiteCount = concepts.reduce(
      (count, concept) => count + (concept.prerequisites?.length ?? 0),
      0,
    )
    const usesVariableCount = concepts.reduce(
      (count, concept) => count + (concept.variables?.length ?? 0),
      0,
    )
    expect(edges).toHaveLength(prerequisiteCount + usesVariableCount)
  })

  it('buildEdges produces no self-referencing edges', () => {
    const edges = buildEdges(getAllEntities(), { strict: true })
    const selfEdges = edges.filter((edge) => edge.source === edge.target)
    expect(selfEdges).toEqual([])
  })

  it('every phet concept has a non-null visual.url', () => {
    const invalidPhetNodes = concepts.filter(
      (node) => node.visual.type === 'phet' && node.visual.url === null,
    )
    expect(invalidPhetNodes).toEqual([])
  })

  it('every concept has at least one tag', () => {
    const taglessNodes = concepts.filter(
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
    const invalidRoles = concepts.flatMap((node) =>
      node.variables
        .filter((variable) => !allowedRoles.has(variable.role))
        .map((variable) => `${node.id}:${variable.symbol}`),
    )

    expect(invalidRoles).toEqual([])
  })

  it('symmetric nodes use conserved role for all variables', () => {
    const invalidSymmetricNodes = concepts
      .filter((node) => node.causal_structure === 'symmetric')
      .flatMap((node) =>
        node.variables
          .filter((variable) => variable.role !== 'conserved')
          .map((variable) => `${node.id}:${variable.symbol}`),
      )

    expect(invalidSymmetricNodes).toEqual([])
  })

  it('no node contains legacy connections field', () => {
    const legacyNodes = concepts.filter((node) => 'connections' in node).map((node) => node.id)
    expect(legacyNodes).toEqual([])
  })

  it('buildEdges carries type and weight from prerequisites', () => {
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

  it('buildEdges defaults definitional edge weight to 1 when omitted', () => {
    const syntheticEntities = [
      { id: 'source', layer: 'concept', prerequisites: [] },
      { id: 'target', layer: 'concept', prerequisites: [{ id: 'source', type: 'definitional' }] },
    ]
    const edges = buildEdges(syntheticEntities, { strict: false })
    expect(edges).toEqual([
      {
        id: 'source__definitional__target',
        source: 'source',
        target: 'target',
        type: 'definitional',
        weight: 1,
        layer_pair: 'concept-concept',
      },
    ])
  })

  it('every node formula parses with KaTeX', () => {
    const formulaErrors = concepts.flatMap((node) => {
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
