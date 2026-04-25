import { describe, expect, it } from 'vitest'
import { getEdgeVisuals } from '../FloatingEdge'

describe('getEdgeVisuals', () => {
  it('renders definitional edges with solid stroke and equivalence glyph', () => {
    const visuals = getEdgeVisuals('definitional', 1)
    expect(visuals.strokeDasharray).toBeUndefined()
    expect(visuals.markerEnd).toBeUndefined()
    expect(visuals.targetGlyph).toBe('≡')
  })
})
