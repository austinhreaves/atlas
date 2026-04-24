import { describe, expect, it } from 'vitest'
import nodes from './nodes.json'
import { validateNode } from './schema'

describe('validateNode', () => {
  it('returns no errors for a valid seeded node', () => {
    const errors = validateNode(nodes[0])
    expect(errors).toEqual([])
  })

  it('reports missing required fields', () => {
    const { id, ...nodeWithoutId } = nodes[0]
    const errors = validateNode(nodeWithoutId)
    expect(errors).toContain('Missing required field: id')
  })

  it('rejects non-kebab-case ids', () => {
    const badNode = { ...nodes[0], id: 'NewtonSecondLaw' }
    const errors = validateNode(badNode)
    expect(errors).toContain('id must be kebab-case.')
  })

  it('rejects empty variables array', () => {
    const badNode = { ...nodes[0], variables: [] }
    const errors = validateNode(badNode)
    expect(errors).toContain('variables must be a non-empty array.')
  })

  it('rejects invalid variable entries', () => {
    const badNode = {
      ...nodes[0],
      variables: [{ symbol: '', name: 'Force', unit: 'N', description: 'x' }],
    }
    const errors = validateNode(badNode)
    expect(errors).toContain('variables[0].symbol must be a non-empty string.')
  })

  it('rejects invalid visual metadata', () => {
    const badNode = {
      ...nodes[0],
      visual: { type: 'image', url: 123, caption: null },
    }
    const errors = validateNode(badNode)
    expect(errors).toContain('visual.type must be one of: phet, video, widget, none')
    expect(errors).toContain('visual.url must be a string or null.')
  })

  it('rejects invalid position values', () => {
    const badNode = {
      ...nodes[0],
      position: { x: 'left', y: null },
    }
    const errors = validateNode(badNode)
    expect(errors).toContain('position.x must be a number.')
    expect(errors).toContain('position.y must be a number.')
  })
})
