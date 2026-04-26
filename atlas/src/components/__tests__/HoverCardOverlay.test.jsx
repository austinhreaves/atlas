// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import HoverCardOverlay, { getVerticalPlacement } from '../HoverCardOverlay'

afterEach(() => {
  cleanup()
})

function createNodeMap() {
  return new Map([
    [
      'concept-1',
      {
        id: 'concept-1',
        layer: 'concept',
        title: "Newton's Second Law",
        domain: 'mechanics',
        formula: 'F = ma',
        principle: 'Net force causes acceleration proportional to inverse mass.',
      },
    ],
    [
      'variable-1',
      {
        id: 'variable-1',
        layer: 'variable',
        name: 'Acceleration',
        canonical_symbol: 'a',
        dimension: 'L/T^2',
      },
    ],
  ])
}

function createEdgeMap() {
  return new Map([
    [
      'edge-1',
      {
        id: 'edge-1',
        source: 'concept-1',
        target: 'variable-1',
        type: 'supporting',
        rationale: 'Dynamics links force to acceleration through mass.',
      },
    ],
    [
      'edge-2',
      {
        id: 'edge-2',
        source: 'concept-1',
        target: 'variable-1',
        type: 'supporting',
      },
    ],
  ])
}

describe('HoverCardOverlay', () => {
  it('renders a concept hover card with title, domain, formula, and principle snippet', () => {
    const { container } = render(
      <HoverCardOverlay
        hoveredEntity={{ kind: 'node', id: 'concept-1', screenX: 300, screenY: 200 }}
        nodeById={createNodeMap()}
        edgeById={createEdgeMap()}
      />,
    )

    expect(container.querySelector('.w-\\[300px\\]')).not.toBeNull()
    expect(screen.getByText(/mechanics/i)).not.toBeNull()
    expect(screen.getByText(/Net force causes acceleration/i)).not.toBeNull()
  })

  it('renders a variable hover card with symbol, name, and dimension', () => {
    render(
      <HoverCardOverlay
        hoveredEntity={{ kind: 'node', id: 'variable-1', screenX: 300, screenY: 200 }}
        nodeById={createNodeMap()}
        edgeById={createEdgeMap()}
      />,
    )

    expect(screen.getByText(/Acceleration/i)).not.toBeNull()
    expect(screen.getByText(/Dimension: L\/T\^2/i)).not.toBeNull()
  })

  it('renders an edge hover card with type and endpoints', () => {
    const { container } = render(
      <HoverCardOverlay
        hoveredEntity={{ kind: 'edge', id: 'edge-1', screenX: 300, screenY: 200 }}
        nodeById={createNodeMap()}
        edgeById={createEdgeMap()}
      />,
    )

    expect(screen.getByText(/Supporting concept/i)).not.toBeNull()
    expect(container.textContent?.includes("Newton's Second Law")).toBe(true)
    expect(container.textContent?.includes('Acceleration')).toBe(true)
    expect(screen.getByText(/Dynamics links force to acceleration/i)).not.toBeNull()
  })

  it('omits rationale text when edge rationale is missing', () => {
    render(
      <HoverCardOverlay
        hoveredEntity={{ kind: 'edge', id: 'edge-2', screenX: 300, screenY: 200 }}
        nodeById={createNodeMap()}
        edgeById={createEdgeMap()}
      />,
    )

    expect(screen.getByText(/Supporting concept/i)).not.toBeNull()
    expect(screen.queryByText(/Dynamics links force to acceleration/i)).toBeNull()
  })

  it('never renders on mobile or while dragging', () => {
    const mobile = render(
      <HoverCardOverlay
        hoveredEntity={{ kind: 'node', id: 'concept-1', screenX: 300, screenY: 200 }}
        nodeById={createNodeMap()}
        edgeById={createEdgeMap()}
        isMobile
      />,
    )
    expect(mobile.container.firstChild).toBeNull()

    const dragging = render(
      <HoverCardOverlay
        hoveredEntity={{ kind: 'node', id: 'concept-1', screenX: 300, screenY: 200 }}
        nodeById={createNodeMap()}
        edgeById={createEdgeMap()}
        isDraggingNode
      />,
    )
    expect(dragging.container.firstChild).toBeNull()
  })
})

describe('getVerticalPlacement', () => {
  it('flips below near top edge and above otherwise', () => {
    expect(getVerticalPlacement(60)).toBe('below')
    expect(getVerticalPlacement(240)).toBe('above')
  })
})
