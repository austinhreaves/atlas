// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import GraphCanvas from '../GraphCanvas.jsx'

const reactFlowState = vi.hoisted(() => ({
  getNode: vi.fn(),
  getViewport: vi.fn(),
  setCenter: vi.fn(),
}))
const reactFlowHandlers = vi.hoisted(() => ({
  onMoveEnd: null,
}))

vi.mock('reactflow', () => {
  return {
    ReactFlow: ({ children, onMoveEnd }) => {
      reactFlowHandlers.onMoveEnd = onMoveEnd
      return <div data-testid="react-flow-root">{children}</div>
    },
    Background: () => null,
    Controls: () => null,
    Handle: () => null,
    Position: {
      Top: 'top',
      Right: 'right',
      Bottom: 'bottom',
      Left: 'left',
    },
    BackgroundVariant: {
      Dots: 'dots',
    },
    useReactFlow: () => reactFlowState,
  }
})

function createProps(overrides = {}) {
  return {
    nodes: [
      {
        id: 'n1',
        title: 'Node One',
        domain: 'mechanics',
        mass: 1,
        position: { x: 100, y: 200 },
      },
      {
        id: 'n2',
        title: 'Node Two',
        domain: 'mechanics',
        mass: 1,
        position: { x: 300, y: 250 },
      },
    ],
    edges: [],
    selectedNodeId: null,
    isPanelOpen: false,
    panelWidth: 440,
    focalNodeIds: new Set(),
    neighborNodeIds: new Set(),
    distantNodeIds: new Set(),
    understoodNodeIds: new Set(),
    onNodeClick: vi.fn(),
    ...overrides,
  }
}

function emitMoveEnd(event = {}) {
  if (typeof reactFlowHandlers.onMoveEnd === 'function') {
    act(() => {
      reactFlowHandlers.onMoveEnd(event)
    })
  }
}

describe('GraphCanvas camera behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    reactFlowState.getNode.mockReset()
    reactFlowState.getViewport.mockReset()
    reactFlowState.setCenter.mockReset()
    reactFlowHandlers.onMoveEnd = null
    reactFlowState.getViewport.mockReturnValue({ zoom: 1.25 })
    reactFlowState.getNode.mockReturnValue({
      id: 'n1',
      position: { x: 100, y: 200 },
      positionAbsolute: { x: 100, y: 200 },
      width: 40,
      height: 60,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not recenter on initial mount', () => {
    render(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)

    expect(reactFlowState.setCenter).not.toHaveBeenCalled()
  })

  it('recenters when selection changes after mount', () => {
    const { rerender } = render(<GraphCanvas {...createProps()} />)

    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)

    expect(reactFlowState.setCenter).toHaveBeenCalledTimes(1)
  })

  it('centers on node midpoint instead of raw node origin', () => {
    const { rerender } = render(<GraphCanvas {...createProps()} />)

    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)

    const [targetX, targetY] = reactFlowState.setCenter.mock.calls[0]
    expect(targetX).toBe(120)
    expect(targetY).toBe(230)
  })

  it('applies panel offset to X target when panel is open', () => {
    const { rerender } = render(<GraphCanvas {...createProps()} />)

    rerender(
      <GraphCanvas
        {...createProps({
          selectedNodeId: 'n1',
          isPanelOpen: true,
          panelWidth: 500,
        })}
      />,
    )

    const [targetX] = reactFlowState.setCenter.mock.calls[0]
    expect(targetX).toBe(120 + 500 / (2 * 1.25))
  })

  it('does not schedule idle recenter when no node is selected', () => {
    render(<GraphCanvas {...createProps({ selectedNodeId: null })} />)

    emitMoveEnd({})
    act(() => {
      vi.advanceTimersByTime(4600)
    })

    expect(reactFlowState.setCenter).not.toHaveBeenCalled()
  })

  it('resets idle timer across repeated user pans and recenters once', () => {
    const { rerender } = render(<GraphCanvas {...createProps()} />)
    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)
    reactFlowState.setCenter.mockClear()

    emitMoveEnd({})
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    emitMoveEnd({})
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(reactFlowState.setCenter).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1600)
    })
    expect(reactFlowState.setCenter).toHaveBeenCalledTimes(1)
  })

  it('does not queue idle recenter for programmatic move-end events', () => {
    const { rerender } = render(<GraphCanvas {...createProps()} />)
    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)
    reactFlowState.setCenter.mockClear()

    emitMoveEnd(null)
    act(() => {
      vi.advanceTimersByTime(4600)
    })

    expect(reactFlowState.setCenter).not.toHaveBeenCalled()
  })

  it('cleans up pending idle recenter timer on unmount', () => {
    const { rerender, unmount } = render(<GraphCanvas {...createProps()} />)
    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)
    reactFlowState.setCenter.mockClear()

    emitMoveEnd({})
    unmount()
    act(() => {
      vi.advanceTimersByTime(4600)
    })

    expect(reactFlowState.setCenter).not.toHaveBeenCalled()
  })

  it('cancels previous idle timer when selection changes before next drag', () => {
    const { rerender } = render(<GraphCanvas {...createProps()} />)

    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n1' })} />)
    emitMoveEnd({})
    act(() => {
      vi.advanceTimersByTime(2500)
    })

    rerender(<GraphCanvas {...createProps({ selectedNodeId: 'n2' })} />)
    reactFlowState.setCenter.mockClear()
    emitMoveEnd({})
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(reactFlowState.setCenter).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2100)
    })
    expect(reactFlowState.setCenter).toHaveBeenCalledTimes(1)
  })
})
