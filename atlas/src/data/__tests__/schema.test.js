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

  it('returns errors when legacy connections field is present', () => {
    const legacyNode = { ...nodes[0], connections: ['other-node'] }
    const errors = validateNode(legacyNode)
    expect(errors).toContain('connections is not allowed. Use prerequisites instead.')
  })

  it('accepts idealizations with idealized scope', () => {
    const idealizationsNode = {
      ...nodes[0],
      idealizations: [
        { name: 'Friction', scope: 'idealized', note: 'Idealized away in intro model.' },
      ],
    }
    const idealizationErrors = validateNode(idealizationsNode)
    expect(
      idealizationErrors.some((error) => error.includes('idealizations')),
    ).toBe(false)
  })

  it('returns errors for invalid variable role', () => {
    const invalidRoleNode = {
      ...nodes[0],
      variables: [{ ...nodes[0].variables[0], role: 'cause' }],
    }
    const errors = validateNode(invalidRoleNode)
    expect(errors.some((error) => error.startsWith('variables[0].role must be one of:'))).toBe(
      true,
    )
  })

  it('accepts missing variables[].id for backward compatibility', () => {
    const nodeWithoutVariableIds = {
      ...nodes[0],
      variables: nodes[0].variables.map(({ symbol, role, name, unit, description }) => ({
        symbol,
        role,
        name,
        unit,
        description,
      })),
    }
    const errors = validateNode(nodeWithoutVariableIds)
    expect(errors).toEqual([])
  })

  it('accepts kebab-case variables[].id when provided', () => {
    const nodeWithVariableIds = {
      ...nodes[0],
      variables: nodes[0].variables.map((variable, index) => ({
        ...variable,
        id: `${nodes[0].id}-${index + 1}`,
      })),
    }
    const errors = validateNode(nodeWithVariableIds)
    expect(errors).toEqual([])
  })

  it('rejects non-kebab-case variables[].id', () => {
    const invalidVariableIdNode = {
      ...nodes[0],
      variables: [{ ...nodes[0].variables[0], id: 'ForceMagnitude' }],
    }
    const errors = validateNode(invalidVariableIdNode)
    expect(errors).toContain('variables[0].id must be kebab-case when provided.')
  })

  it('rejects duplicate variables[].id values in a node', () => {
    const duplicateVariableIdNode = {
      ...nodes[0],
      variables: [
        { ...nodes[0].variables[0], id: 'force-magnitude' },
        { ...nodes[0].variables[1], id: 'force-magnitude' },
      ],
    }
    const errors = validateNode(duplicateVariableIdNode)
    expect(errors).toContain('variables[].id values must be unique within a node: force-magnitude')
  })

  it('accepts definitional prerequisites without explicit weight', () => {
    const definitionalNode = {
      ...nodes[0],
      prerequisites: [{ id: nodes[3].id, type: 'definitional' }],
    }
    const errors = validateNode(definitionalNode)
    expect(errors).toEqual([])
  })

  it('rejects missing weight for non-definitional prerequisites', () => {
    const missingWeightNode = {
      ...nodes[0],
      prerequisites: [{ id: nodes[3].id, type: 'foundational' }],
    }
    const errors = validateNode(missingWeightNode)
    expect(errors).toContain('prerequisites[0].weight must be a number between 0 and 1.')
  })

  it("rejects variable with role 'contextual'", () => {
    const minimalValidNode = {
      id: 'test-node',
      title: 'Test Node',
      type: 'law',
      domain: 'mechanics',
      formula: 'F = ma',
      causal_structure: 'asymmetric',
      variables: [
        {
          symbol: 'F',
          role: 'contextual',
          name: 'Force',
          unit: 'N',
          description: 'Force variable.',
        },
      ],
      description: 'Valid node except for role value.',
      prerequisites: [],
      visual: { type: 'none', url: null, caption: null },
      tags: ['test'],
      mass: null,
      position: null,
    }
    const errors = validateNode(minimalValidNode)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('enforces conserved variables for symmetric causal structure', () => {
    const invalidSymmetricNode = {
      ...nodes[0],
      causal_structure: 'symmetric',
      variables: [{ ...nodes[0].variables[0], role: 'driver' }],
    }
    const errors = validateNode(invalidSymmetricNode)
    expect(errors).toContain(
      'variables[0].role must be "conserved" when causal_structure is "symmetric".',
    )
  })

  it('forbids driver/response roles for contextual causal structure', () => {
    const invalidContextualNode = {
      ...nodes[0],
      causal_structure: 'contextual',
      variables: [{ ...nodes[0].variables[0], role: 'driver', symbol: 'X' }],
    }
    const errors = validateNode(invalidContextualNode)
    expect(errors).toContain('contextual nodes cannot have driver/response roles: X')
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
