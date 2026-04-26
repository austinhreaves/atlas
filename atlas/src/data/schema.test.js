import { describe, expect, it } from 'vitest'
import { validateConceptNode, validateEntity, validateVariableNode } from './schema'

const validConcept = {
  id: 'ohms-law',
  layer: 'concept',
  title: "Ohm's Law",
  type: 'law',
  domain: 'electromagnetism',
  formula: 'I = V/R',
  causal_structure: 'asymmetric',
  principle: 'Current scales with voltage for ohmic materials.',
  applicability_conditions: ['ohmic conductor', 'steady-state current'],
  variables: [
    { id: 'voltage', symbol: 'V', role: 'driver' },
    { id: 'current', symbol: 'I', role: 'response' },
    { id: 'resistance', symbol: 'R', role: 'parameter' },
  ],
  description: 'Linear relation between V and I with R constant.',
  prerequisites: [],
  visual: { type: 'none', url: null, caption: null },
  tags: ['circuits'],
  author: 'austin',
  review_state: 'published',
}

const validVariable = {
  id: 'current',
  layer: 'variable',
  canonical_symbol: 'I',
  name: 'Current',
  unit: 'A',
  dimension: 'Q/T',
  description: 'Rate of charge flow.',
  vector_or_scalar: 'scalar',
  author: 'austin',
  review_state: 'published',
}

describe('schema v3 validators', () => {
  it('accepts a valid concept node', () => {
    expect(validateConceptNode(validConcept)).toEqual([])
  })

  it('requires applicability conditions on laws', () => {
    const errors = validateConceptNode({ ...validConcept, applicability_conditions: [] })
    expect(errors).toContain(
      'applicability_conditions must contain at least one entry for law/principle nodes.',
    )
  })

  it('accepts optional prerequisite rationale when provided as a string', () => {
    const errors = validateConceptNode({
      ...validConcept,
      prerequisites: [
        {
          id: 'charge-conservation',
          type: 'foundational',
          weight: 0.8,
          rationale: 'Charge conservation motivates current continuity.',
        },
      ],
    })
    expect(errors).toEqual([])
  })

  it('rejects non-string prerequisite rationale values', () => {
    const errors = validateConceptNode({
      ...validConcept,
      prerequisites: [
        {
          id: 'charge-conservation',
          type: 'foundational',
          weight: 0.8,
          rationale: 17,
        },
      ],
    })
    expect(errors).toContain('prerequisites[0].rationale must be a non-empty string when provided.')
  })

  it('rejects concept tags that are not in the registry', () => {
    const errors = validateConceptNode({ ...validConcept, tags: ['not-in-registry'] })
    expect(errors).toContain('tags[0] references unknown tag id: not-in-registry')
  })

  it('accepts empty concept tags', () => {
    expect(validateConceptNode({ ...validConcept, tags: [] })).toEqual([])
  })

  it('accepts concept nodes when tags field is absent', () => {
    const conceptWithoutTags = { ...validConcept }
    delete conceptWithoutTags.tags
    expect(validateConceptNode(conceptWithoutTags)).toEqual([])
  })

  it('accepts a valid variable entity', () => {
    expect(validateVariableNode(validVariable)).toEqual([])
  })

  it('rejects invalid vector_or_scalar values', () => {
    const errors = validateVariableNode({ ...validVariable, vector_or_scalar: 'matrix' })
    expect(errors).toContain('vector_or_scalar must be one of: scalar, vector, tensor')
  })

  it('rejects variable tags that are not in the registry', () => {
    const errors = validateVariableNode({ ...validVariable, tags: ['not-in-registry'] })
    expect(errors).toContain('tags[0] references unknown tag id: not-in-registry')
  })

  it('dispatches by entity.layer', () => {
    expect(validateEntity(validConcept)).toEqual([])
    expect(validateEntity(validVariable)).toEqual([])
    expect(validateEntity({ layer: 'lab' })).toEqual(['Unsupported layer: lab'])
  })
})
