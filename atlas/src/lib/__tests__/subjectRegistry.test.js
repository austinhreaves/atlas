import { describe, expect, it } from 'vitest'
import { validateSubjectRegistry } from '../../data/subjects'

function createValidRegistry() {
  return {
    subjects: [
      {
        id: 'physics',
        label: 'Physics',
        description: 'Physics concept graph.',
        review_state: 'published',
      },
      {
        id: 'chemistry',
        label: 'Chemistry',
        description: 'Chemistry concept graph.',
        review_state: 'draft',
      },
    ],
  }
}

describe('validateSubjectRegistry', () => {
  it('accepts a well-formed registry', () => {
    expect(validateSubjectRegistry(createValidRegistry())).toEqual([])
  })

  it('rejects duplicate ids', () => {
    const registry = createValidRegistry()
    registry.subjects.push({
      id: 'physics',
      label: 'Duplicate',
      description: 'Duplicate id for failure coverage.',
      review_state: 'published',
    })
    expect(validateSubjectRegistry(registry)).toContain(
      'subjects[].id values must be unique: physics',
    )
  })

  it('rejects invalid ids', () => {
    const registry = createValidRegistry()
    registry.subjects[0].id = 'Physics'
    expect(validateSubjectRegistry(registry)).toContain(
      'subjects[0].id must match /^[a-z][a-z0-9-]*$/.',
    )
  })
})
