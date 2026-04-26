// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('reactflow', () => ({
  BaseEdge: ({ id, path, markerEnd, className, style, ...props }) => (
    <path
      data-testid="base-edge"
      data-edge-id={id}
      d={path}
      className={className}
      style={style}
      markerEnd={markerEnd ? JSON.stringify(markerEnd) : undefined}
      {...props}
    />
  ),
  MarkerType: { ArrowClosed: 'arrowclosed' },
  Position: { Top: 'top', Right: 'right', Bottom: 'bottom', Left: 'left' },
  getBezierPath: () => ['M 0 0 C 20 0, 80 100, 100 100'],
  useStore: (selector) =>
    selector({
      nodeInternals: new Map([
        [
          'source',
          { id: 'source', width: 40, height: 40, positionAbsolute: { x: 0, y: 0 } },
        ],
        [
          'target',
          { id: 'target', width: 40, height: 40, positionAbsolute: { x: 120, y: 80 } },
        ],
      ]),
    }),
}))

import FloatingEdge, { getEdgeTypeLabel, getEdgeVisuals, resolveEdgeStyle } from '../FloatingEdge'

afterEach(() => {
  cleanup()
})

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

describe('getEdgeTypeLabel', () => {
  it('returns friendly labels for known edge types', () => {
    expect(getEdgeTypeLabel('foundational')).toBe('Foundational principle')
    expect(getEdgeTypeLabel('uses-variable')).toBe('Uses variable')
    expect(getEdgeTypeLabel('definitional')).toBe('Definition')
  })

  it('falls back to a humanized label for unknown edge types', () => {
    expect(getEdgeTypeLabel('novel-link-type')).toBe('Novel link type')
  })
})

describe('FloatingEdge component', () => {
  it('exposes accessible label and clears legacy title tooltip', () => {
    render(
      <svg>
        <FloatingEdge
          id="edge-1"
          source="source"
          target="target"
          data={{ type: 'foundational', weight: 0.9 }}
        />
      </svg>,
    )

    const edgePath = screen.getByTestId('base-edge')
    expect(edgePath.getAttribute('aria-label')).toBe('Foundational principle')
    expect(document.querySelector('title')).toBeNull()
  })

  it('publishes shared hover state from the invisible hit path', () => {
    const onSetHover = vi.fn()
    render(
      <svg>
        <FloatingEdge
          id="edge-1"
          source="source"
          target="target"
          data={{ type: 'supporting', weight: 0.5, onSetHover, isMobile: false }}
        />
      </svg>,
    )

    const hitPath = document.querySelector('path[stroke="transparent"]')
    expect(hitPath).not.toBeNull()
    fireEvent.mouseEnter(hitPath, { clientX: 222, clientY: 144 })
    fireEvent.mouseLeave(hitPath)

    expect(onSetHover).toHaveBeenNthCalledWith(1, {
      kind: 'edge',
      id: 'edge-1',
      screenX: 222,
      screenY: 144,
    })
    expect(onSetHover).toHaveBeenNthCalledWith(2, null)
  })
})
