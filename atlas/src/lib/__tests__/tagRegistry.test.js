import { describe, expect, it } from 'vitest'
import { validateTagRegistry } from '../../data/tags'

function createValidRegistry() {
  return {
    tags: [
      {
        id: 'orbital-mechanics',
        label: 'Orbital mechanics',
        description: 'Central-force orbital motion topics.',
        audience_relevance: ['phy-132', 'ap-physics'],
        review_state: 'published',
      },
      {
        id: 'ac-circuits',
        label: 'AC circuits',
        description: 'Alternating-current and impedance topics.',
        review_state: 'draft',
      },
    ],
  }
}

describe('validateTagRegistry', () => {
  it('accepts a well-formed registry', () => {
    expect(validateTagRegistry(createValidRegistry())).toEqual([])
  })

  it('rejects duplicate ids', () => {
    const registry = createValidRegistry()
    registry.tags.push({
      id: 'orbital-mechanics',
      label: 'Duplicate orbital mechanics',
      description: 'Duplicate id for failure coverage.',
      review_state: 'published',
    })
    expect(validateTagRegistry(registry)).toContain(
      'tags[].id values must be unique: orbital-mechanics',
    )
  })

  it('rejects non-kebab-case ids', () => {
    const registry = createValidRegistry()
    registry.tags[0].id = 'OrbitalMechanics'
    expect(validateTagRegistry(registry)).toContain(
      'tags[0].id must match /^[a-z][a-z0-9-]*$/.',
    )
  })

  it('rejects missing required fields', () => {
    const registry = createValidRegistry()
    delete registry.tags[0].description
    expect(validateTagRegistry(registry)).toContain('tags[0].description must be a non-empty string.')
  })

  it('rejects unknown audience_relevance values', () => {
    const registry = createValidRegistry()
    registry.tags[0].audience_relevance = ['phy-999']
    expect(validateTagRegistry(registry)).toContain(
      'tags[0].audience_relevance[0] must be one of: general, phy-114, phy-132, ap-physics, upper-division',
    )
  })
})
