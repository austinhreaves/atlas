import { describe, expect, it } from 'vitest'
import {
  validateConceptNode,
  validateEntity,
  validateLabQuestionNode,
  validateSopNode,
  validateTaCheckpointNode,
  validateVariableNode,
} from './schema'

const validConcept = {
  id: 'ohms-law',
  layer: 'concept',
  subject: 'physics',
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
  sub_domains: [],
  tags: ['kw-electromagnetism'],
  blocks: [
    {
      block_id: 'overview',
      type: 'markdown-katex',
      data: { markdown: "Ohm's law overview." },
    },
  ],
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
  blocks: [
    {
      block_id: 'overview',
      type: 'markdown-katex',
      data: { markdown: 'Current metadata.' },
    },
  ],
  author: 'austin',
  review_state: 'published',
}

const validSop = {
  id: 'sop-lab-intro',
  layer: 'sop',
  title: 'Lab Intro SOP',
  description: 'Standard intro SOP.',
  blocks: [
    {
      block_id: 'overview',
      type: 'markdown-katex',
      data: { markdown: 'Intro steps.' },
    },
  ],
  author: 'austin',
  review_state: 'published',
}

describe('schema v3 validators', () => {
  it('accepts a valid concept node', () => {
    expect(validateConceptNode(validConcept)).toEqual([])
  })

  it('validates applicability_conditions shape when provided', () => {
    const errors = validateConceptNode({ ...validConcept, applicability_conditions: [42] })
    expect(errors).toContain('applicability_conditions must be an array of non-empty strings.')
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

  it('rejects concept subjects that are not in the subject registry', () => {
    const errors = validateConceptNode({ ...validConcept }, {
      subjectValidationContext: {
        enforceMembership: true,
        subjectIds: new Set(['physics']),
      },
    })
    expect(errors).toEqual([])

    const invalidErrors = validateConceptNode(
      { ...validConcept, subject: 'chemistry' },
      {
        subjectValidationContext: {
          enforceMembership: true,
          subjectIds: new Set(['physics']),
        },
      },
    )
    expect(invalidErrors).toContain('subject references unknown subject id: chemistry')
  })

  it('rejects concept sub-domains not in the registry', () => {
    const errors = validateConceptNode(
      { ...validConcept, sub_domains: ['not-in-registry'] },
      {
        subdomainValidationContext: {
          enforceMembership: true,
          subdomainIds: new Set(['circuits']),
          subdomainById: new Map([['circuits', { domains: ['electromagnetism'] }]]),
        },
      },
    )
    expect(errors).toContain('sub_domains[0] references unknown sub-domain id: not-in-registry')
  })

  it('rejects domain-incompatible sub-domains', () => {
    const errors = validateConceptNode(
      { ...validConcept, domain: 'mechanics', sub_domains: ['circuits'] },
      {
        subdomainValidationContext: {
          enforceMembership: true,
          subdomainIds: new Set(['circuits']),
          subdomainById: new Map([['circuits', { domains: ['electromagnetism'] }]]),
        },
      },
    )
    expect(errors).toContain('sub_domains[0] is not allowed for domain "mechanics": circuits')
  })

  it('accepts empty concept tags', () => {
    expect(validateConceptNode({ ...validConcept, tags: [] })).toEqual([])
  })

  it('accepts concept nodes when tags field is absent', () => {
    const conceptWithoutTags = { ...validConcept }
    delete conceptWithoutTags.tags
    expect(validateConceptNode(conceptWithoutTags)).toEqual([])
  })

  it('accepts concept nodes when sub_domains is empty or absent', () => {
    expect(validateConceptNode({ ...validConcept, sub_domains: [] })).toEqual([])
    const conceptWithoutSubdomains = { ...validConcept }
    delete conceptWithoutSubdomains.sub_domains
    expect(validateConceptNode(conceptWithoutSubdomains)).toEqual([])
  })

  it('accepts a valid variable entity', () => {
    expect(validateVariableNode(validVariable)).toEqual([])
  })

  it('rejects invalid vector_or_scalar values', () => {
    const errors = validateVariableNode({ ...validVariable, vector_or_scalar: 'matrix' })
    expect(errors).toContain('vector_or_scalar must be one of: scalar, vector, tensor')
  })

  it('requires non-empty blocks on concept and variable nodes', () => {
    expect(validateConceptNode({ ...validConcept, blocks: [] })).toContain('blocks must be a non-empty array.')
    expect(validateVariableNode({ ...validVariable, blocks: [] })).toContain('blocks must be a non-empty array.')
  })

  it('rejects variable tags that are not in the registry', () => {
    const errors = validateVariableNode({ ...validVariable, tags: ['not-in-registry'] })
    expect(errors).toContain('tags[0] references unknown tag id: not-in-registry')
  })

  it('dispatches by entity.layer', () => {
    expect(validateEntity(validConcept)).toEqual([])
    expect(validateEntity(validVariable)).toEqual([])
    expect(validateEntity(validSop)).toEqual([])
    expect(
      validateEntity({
        ...validSop,
        layer: 'ta-checkpoint',
        id: 'ta-checkpoint-lab-intro',
      }),
    ).toEqual([])
    expect(
      validateEntity({
        ...validSop,
        layer: 'lab-question',
        id: 'lab-question-ohms-law',
        blocks: [{ block_id: 'prompt', type: 'prompt-and-response', data: { prompt: 'Explain.' } }],
      }),
    ).toEqual([])
    expect(validateEntity({ layer: 'unknown' })).toEqual(['Unsupported layer: unknown'])
  })

  it('validates new layer nodes through direct validator exports', () => {
    expect(validateSopNode(validSop)).toEqual([])
    expect(validateTaCheckpointNode({ ...validSop, layer: 'ta-checkpoint', id: 'ta-checkpoint-1' })).toEqual(
      [],
    )
    expect(
      validateLabQuestionNode({
        ...validSop,
        layer: 'lab-question',
        id: 'lab-question-1',
        blocks: [{ block_id: 'prompt', type: 'prompt-and-response', data: { prompt: 'Why?' } }],
      }),
    ).toEqual([])
  })

  it('enforces per-layer block allowlists', () => {
    const errors = validateEntity({
      ...validSop,
      blocks: [{ block_id: 'bad', type: 'not-allowed', data: { anything: true } }],
    })
    expect(errors).toContain('blocks[0].type is not allowed for layer "sop": not-allowed')
  })
})
