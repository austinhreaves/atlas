import { describe, expect, it } from 'vitest'
import { getEdgeVisuals, resolveEdgeStyle } from '../FloatingEdge'

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

describe('resolveEdgeStyle', () => {
  it('keeps uses-variable stroke color when focal', () => {
    const visuals = getEdgeVisuals('uses-variable', 0.8)

    const style = resolveEdgeStyle(visuals, {
      isFrontier: false,
      isFocal: true,
      isDistant: false,
      isVariableEdge: true,
    })

    expect(style.stroke).toBe(visuals.stroke)
  })

  it('uses bright stroke for focal non-variable edges', () => {
    const visuals = getEdgeVisuals('foundational', 0.8)

    const style = resolveEdgeStyle(visuals, {
      isFrontier: false,
      isFocal: true,
      isDistant: false,
      isVariableEdge: false,
    })

    expect(style.stroke).toBe('#cbd5e1')
  })
})
