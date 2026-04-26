import { describe, expect, it } from 'vitest'
import { buildEdges } from '../edges'

function concept(overrides = {}) {
  return {
    id: 'newtons-second-law',
    layer: 'concept',
    prerequisites: [{ id: 'kinematics', type: 'foundational', weight: 0.9 }],
    variables: [{ id: 'force-net', symbol: 'F', role: 'driver' }],
    ...overrides,
  }
}

function variable(overrides = {}) {
  return {
    id: 'force-net',
    layer: 'variable',
    ...overrides,
  }
}

describe('buildEdges', () => {
  it('threads optional prerequisite rationale onto concept edges', () => {
    const edges = buildEdges(
      [
        concept({
          prerequisites: [
            {
              id: 'kinematics',
              type: 'foundational',
              weight: 0.9,
              rationale: 'Kinematics defines acceleration that dynamics explains.',
            },
          ],
        }),
        {
          id: 'kinematics',
          layer: 'concept',
          prerequisites: [],
          variables: [],
        },
        variable(),
      ],
      { strict: true },
    )

    expect(edges).toContainEqual({
      id: 'kinematics__foundational__newtons-second-law',
      source: 'kinematics',
      target: 'newtons-second-law',
      type: 'foundational',
      weight: 0.9,
      rationale: 'Kinematics defines acceleration that dynamics explains.',
      layer_pair: 'concept-concept',
    })
  })

  it('generates uses-variable edges for concept variable references', () => {
    const edges = buildEdges([concept(), variable()], { strict: true })
    expect(edges).toContainEqual({
      id: 'newtons-second-law__uses-variable__force-net',
      source: 'newtons-second-law',
      target: 'force-net',
      type: 'uses-variable',
      weight: 0.5,
      layer_pair: 'concept-variable',
    })
  })

  it('throws when concept references a missing variable entity in strict mode', () => {
    expect(() => buildEdges([concept()], { strict: true })).toThrow(
      'Missing variable entities referenced by concepts',
    )
  })

  it('uses edge ids that include source, type, and target', () => {
    const edges = buildEdges([concept(), variable()], { strict: true })
    expect(edges.some((edge) => edge.id === `${edge.source}__${edge.type}__${edge.target}`)).toBe(
      true,
    )
  })
})
