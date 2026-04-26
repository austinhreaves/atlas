import { describe, expect, it } from 'vitest'
import { getEdgeVisuals } from '../FloatingEdge'

describe('getEdgeVisuals', () => {
  it('renders definitional edges with solid stroke and equivalence glyph', () => {
    const visuals = getEdgeVisuals('definitional', 1)
    expect(visuals.strokeDasharray).toBeUndefined()
    expect(visuals.markerEnd).toBeUndefined()
    expect(visuals.targetGlyph).toBe('≡')
  })

  it('renders uses-variable edges as subdued dotted links without arrowheads', () => {
    const visuals = getEdgeVisuals('uses-variable', 0.5)
    expect(visuals.strokeDasharray).toBe('2 5')
    expect(visuals.markerEnd).toBeUndefined()
    expect(visuals.opacity).toBe(0.35)
    expect(visuals.strokeWidth).toBe(1.2)
  })
})
