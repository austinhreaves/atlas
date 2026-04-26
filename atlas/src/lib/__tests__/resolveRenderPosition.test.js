import { describe, expect, it, vi } from 'vitest'
import { resolveRenderPosition } from '../resolveRenderPosition'

describe('resolveRenderPosition', () => {
  it('returns computed position when no canonical or user override exists', () => {
    const position = resolveRenderPosition({
      entityId: 'n1',
      computedPositions: { n1: { x: 10, y: 20 } },
    })

    expect(position).toEqual({ x: 10, y: 20 })
  })

  it('returns canonical position when user override is missing', () => {
    const position = resolveRenderPosition({
      entityId: 'n1',
      canonicalPosition: { x: 100, y: 200 },
      computedPositions: { n1: { x: 10, y: 20 } },
    })

    expect(position).toEqual({ x: 100, y: 200 })
  })

  it('returns user position when both canonical and computed exist', () => {
    const position = resolveRenderPosition({
      entityId: 'n1',
      userPositions: { n1: { x: 300, y: 400 } },
      canonicalPosition: { x: 100, y: 200 },
      computedPositions: { n1: { x: 10, y: 20 } },
    })

    expect(position).toEqual({ x: 300, y: 400 })
  })

  it('returns user position when only user override exists', () => {
    const position = resolveRenderPosition({
      entityId: 'n1',
      userPositions: { n1: { x: -30, y: 45 } },
      computedPositions: {},
    })

    expect(position).toEqual({ x: -30, y: 45 })
  })

  it('falls back to default and warns in dev mode when computed is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const position = resolveRenderPosition({
      entityId: 'n1',
      computedPositions: {},
      warnOnMissingComputed: true,
    })

    expect(position).toEqual({ x: 0, y: 0 })
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })
})
