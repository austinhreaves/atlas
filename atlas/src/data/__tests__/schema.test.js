import { describe, expect, it } from 'vitest'
import { validateConceptNode, validateEntity, validateVariableNode } from '../schema'

function createValidConcept(overrides = {}) {
  return {
    id: 'newtons-second-law',
    layer: 'concept',
    subject: 'physics',
    title: "Newton's Second Law",
    type: 'law',
    domain: 'mechanics',
    formula: 'F = ma',
    causal_structure: 'asymmetric',
    principle: 'Acceleration is caused by net force on mass.',
    applicability_conditions: ['inertial reference frame'],
    limiting_cases: [{ case: 'm -> infinity', result: 'a -> 0 for fixed force' }],
    misconceptions: [
      { wrong_model: 'Force keeps motion going.', correction: 'Force changes velocity.' },
    ],
    historical_context: 'Published in 1687.',
    geometries: ['none'],
    variables: [
      { id: 'force-net', symbol: 'F', role: 'driver', name: 'Net force', unit: 'N' },
      { id: 'mass', symbol: 'm', role: 'parameter' },
      { id: 'acceleration', symbol: 'a', role: 'response', unit: 'm/s^2' },
    ],
    description: 'Net force determines acceleration.',
    prerequisites: [{ id: 'kinematics-velocity-time', type: 'foundational', weight: 0.9 }],
    mass: null,
    visual: { type: 'none', url: null, caption: null },
    sub_domains: [],
    tags: ['kw-mechanics'],
    position: null,
    author: 'austin',
    review_state: 'published',
    last_reviewed: '2026-04-25',
    ...overrides,
  }
}

function createValidVariable(overrides = {}) {
  return {
    id: 'acceleration',
    layer: 'variable',
    canonical_symbol: 'a',
    name: 'Acceleration',
    unit: 'm/s^2',
    dimension: 'L/T^2',
    description: 'Rate of change of velocity.',
    vector_or_scalar: 'vector',
    sign_convention: 'Positive along chosen axis.',
    common_aliases: [{ symbol: 'a_x', context: 'x-component in 1D projections' }],
    tags: ['kw-mechanics'],
    author: 'austin',
    review_state: 'published',
    last_reviewed: '2026-04-25',
    ...overrides,
  }
}

describe('validateConceptNode', () => {
  it('accepts a fully valid concept node', () => {
    expect(validateConceptNode(createValidConcept())).toEqual([])
  })

  it('requires applicability_conditions for laws and principles', () => {
    const errors = validateConceptNode(createValidConcept({ applicability_conditions: [] }))
    expect(errors).toContain(
      'applicability_conditions must contain at least one entry for law/principle nodes.',
    )
  })

  it('allows equations without applicability_conditions', () => {
    const equation = createValidConcept({
      type: 'equation',
      applicability_conditions: undefined,
    })
    delete equation.applicability_conditions
    expect(validateConceptNode(equation)).toEqual([])
  })

  it('requires kebab-case variable ids', () => {
    const errors = validateConceptNode(
      createValidConcept({
        variables: [{ id: 'ForceNet', symbol: 'F', role: 'driver' }],
      }),
    )
    expect(errors).toContain('variables[0].id must be kebab-case.')
  })

  it('accepts optional prerequisite rationale when provided as a string', () => {
    const errors = validateConceptNode(
      createValidConcept({
        prerequisites: [
          {
            id: 'kinematics-velocity-time',
            type: 'foundational',
            weight: 0.9,
            rationale: 'Velocity-time relationships ground acceleration reasoning.',
          },
        ],
      }),
    )
    expect(errors).toEqual([])
  })

  it('rejects non-string prerequisite rationale values', () => {
    const errors = validateConceptNode(
      createValidConcept({
        prerequisites: [
          {
            id: 'kinematics-velocity-time',
            type: 'foundational',
            weight: 0.9,
            rationale: 42,
          },
        ],
      }),
    )
    expect(errors).toContain('prerequisites[0].rationale must be a non-empty string when provided.')
  })

  it('rejects concept tags that are not in the registry', () => {
    const errors = validateConceptNode(createValidConcept({ tags: ['not-in-registry'] }))
    expect(errors).toContain('tags[0] references unknown tag id: not-in-registry')
  })

  it('rejects concept subjects that are not in the subject registry', () => {
    const errors = validateConceptNode(createValidConcept(), {
      subjectValidationContext: {
        enforceMembership: true,
        subjectIds: new Set(['physics']),
      },
    })
    expect(errors).toEqual([])

    const invalidErrors = validateConceptNode(createValidConcept({ subject: 'chemistry' }), {
      subjectValidationContext: {
        enforceMembership: true,
        subjectIds: new Set(['physics']),
      },
    })
    expect(invalidErrors).toContain('subject references unknown subject id: chemistry')
  })

  it('rejects concept sub-domains that are not in the registry', () => {
    const errors = validateConceptNode(createValidConcept({ sub_domains: ['not-in-registry'] }), {
      subdomainValidationContext: {
        enforceMembership: true,
        subdomainIds: new Set(['kinematics']),
        subdomainById: new Map([['kinematics', { domains: ['mechanics'] }]]),
      },
    })
    expect(errors).toContain('sub_domains[0] references unknown sub-domain id: not-in-registry')
  })

  it('rejects sub-domains that are invalid for the concept domain', () => {
    const errors = validateConceptNode(createValidConcept({ sub_domains: ['circuits'] }), {
      subdomainValidationContext: {
        enforceMembership: true,
        subdomainIds: new Set(['circuits']),
        subdomainById: new Map([['circuits', { domains: ['electromagnetism'] }]]),
      },
    })
    expect(errors).toContain('sub_domains[0] is not allowed for domain "mechanics": circuits')
  })

  it('accepts empty sub_domains and missing sub_domains field', () => {
    expect(validateConceptNode(createValidConcept({ sub_domains: [] }))).toEqual([])
    const conceptWithoutSubdomains = createValidConcept()
    delete conceptWithoutSubdomains.sub_domains
    expect(validateConceptNode(conceptWithoutSubdomains)).toEqual([])
  })

  it('accepts concept tags as an empty array', () => {
    expect(validateConceptNode(createValidConcept({ tags: [] }))).toEqual([])
  })

  it('accepts concept nodes with no tags field', () => {
    const conceptWithoutTags = createValidConcept()
    delete conceptWithoutTags.tags
    expect(validateConceptNode(conceptWithoutTags)).toEqual([])
  })

  it('rejects invalid geometries vocabulary values', () => {
    const errors = validateConceptNode(createValidConcept({ geometries: ['torus'] }))
    expect(errors).toContain(
      'geometries[0] must be one of: cylindrical, spherical, planar, axial, none, other',
    )
  })

  it('rejects invalid metadata for concept nodes', () => {
    const errors = validateConceptNode(
      createValidConcept({
        author: '',
        review_state: 'in-review',
        last_reviewed: '2026/04/25',
      }),
    )
    expect(errors).toContain('author must be a non-empty string.')
    expect(errors).toContain('review_state must be one of: draft, reviewed, published')
    expect(errors).toContain('last_reviewed must be an ISO date string (YYYY-MM-DD) or null.')
  })
})

describe('validateVariableNode', () => {
  it('accepts a fully valid variable entity', () => {
    expect(validateVariableNode(createValidVariable())).toEqual([])
  })

  it('requires vector_or_scalar in allowed set', () => {
    const errors = validateVariableNode(createValidVariable({ vector_or_scalar: 'matrix' }))
    expect(errors).toContain('vector_or_scalar must be one of: scalar, vector, tensor')
  })

  it('validates common_aliases shape', () => {
    const errors = validateVariableNode(
      createValidVariable({
        common_aliases: [{ symbol: '', context: 'invalid empty symbol' }],
      }),
    )
    expect(errors).toContain('common_aliases[0].symbol must be a non-empty string.')
  })

  it('rejects variable tags that are not in the registry', () => {
    const errors = validateVariableNode(createValidVariable({ tags: ['not-in-registry'] }))
    expect(errors).toContain('tags[0] references unknown tag id: not-in-registry')
  })

  it('rejects invalid metadata for variable entities', () => {
    const errors = validateVariableNode(
      createValidVariable({
        author: ' ',
        review_state: 'qa',
        last_reviewed: '04-25-2026',
      }),
    )
    expect(errors).toContain('author must be a non-empty string.')
    expect(errors).toContain('review_state must be one of: draft, reviewed, published')
    expect(errors).toContain('last_reviewed must be an ISO date string (YYYY-MM-DD) or null.')
  })
})

describe('validateEntity', () => {
  it('dispatches concept entities to validateConceptNode', () => {
    expect(validateEntity(createValidConcept())).toEqual([])
  })

  it('dispatches variable entities to validateVariableNode', () => {
    expect(validateEntity(createValidVariable())).toEqual([])
  })

  it('returns errors for unsupported layers', () => {
    expect(validateEntity({ layer: 'problem' })).toEqual(['Unsupported layer: problem'])
  })
})
