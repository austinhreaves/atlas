import { describe, expect, it } from 'vitest'
import { validateSubdomainRegistry } from '../../data/subdomains'

function createValidRegistry() {
  return {
    sub_domains: [
      {
        id: 'kinematics',
        label: 'Kinematics',
        description: 'Motion descriptions without force causality.',
        domains: ['mechanics'],
        audience_relevance: ['phy-114'],
        review_state: 'published',
      },
      {
        id: 'orbital-mechanics',
        label: 'Orbital mechanics',
        description: 'Central-force orbit and Kepler-law applications.',
        review_state: 'draft',
      },
    ],
  }
}

describe('validateSubdomainRegistry', () => {
  it('accepts a well-formed registry', () => {
    expect(validateSubdomainRegistry(createValidRegistry())).toEqual([])
  })

  it('rejects duplicate ids', () => {
    const registry = createValidRegistry()
    registry.sub_domains.push({
      id: 'kinematics',
      label: 'Duplicate',
      description: 'Duplicate id for failure coverage.',
      review_state: 'published',
    })
    expect(validateSubdomainRegistry(registry)).toContain(
      'sub_domains[].id values must be unique: kinematics',
    )
  })

  it('rejects invalid domain ids in domains arrays', () => {
    const registry = createValidRegistry()
    registry.sub_domains[0].domains = ['Mechanics']
    expect(validateSubdomainRegistry(registry)).toContain(
      'sub_domains[0].domains[0] must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/.',
    )
  })
})
