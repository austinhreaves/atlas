import { describe, expect, it } from 'vitest'
import nodes from '../nodes.json'
import { validateNode } from '../schema'

describe('validateNode unit tests', () => {
  it('returns errors for a node missing required fields', () => {
    const { id, ...missingId } = nodes[0]
    const errors = validateNode(missingId)
    expect(errors).toContain('Missing required field: id')
  })

  it('returns errors for invalid type value', () => {
    const invalidTypeNode = { ...nodes[0], type: 'rule' }
    const errors = validateNode(invalidTypeNode)
    expect(errors.some((error) => error.startsWith('type must be one of:'))).toBe(true)
  })

  it('returns errors for empty variables array', () => {
    const invalidVariablesNode = { ...nodes[0], variables: [] }
    const errors = validateNode(invalidVariablesNode)
    expect(errors).toContain('variables must be a non-empty array.')
  })

  it('returns errors for visual.type not in allowed set', () => {
    const invalidVisualTypeNode = {
      ...nodes[0],
      visual: { ...nodes[0].visual, type: 'image' },
    }
    const errors = validateNode(invalidVisualTypeNode)
    expect(errors.some((error) => error.startsWith('visual.type must be one of:'))).toBe(
      true,
    )
  })

  it('returns empty array for a fully valid node', () => {
    const errors = validateNode(nodes[0])
    expect(errors).toEqual([])
  })
})
