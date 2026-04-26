// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { fireEvent, screen } from '@testing-library/react'
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
  onNodeDragStop: null,
  onNodeDragStart: null,
  onNodeMouseDown: null,
  onNodeMouseUp: null,
  onNodeMouseLeave: null,
  onPaneClick: null,
  onPaneContextMenu: null,
  onNodeClick: null,
  lastProps: null,
}))

vi.mock('reactflow', () => {
  return {
    ReactFlow: ({
      children,
      onMoveEnd,
      onNodeDragStart,
      onNodeDragStop,
      onNodeMouseDown,
      onNodeMouseUp,
      onNodeMouseLeave,
      onPaneClick,
      onPaneContextMenu,
      onNodeClick,
      ...props
    }) => {
      reactFlowHandlers.onMoveEnd = onMoveEnd
      reactFlowHandlers.onNodeDragStart = onNodeDragStart
      reactFlowHandlers.onNodeDragStop = onNodeDragStop
      reactFlowHandlers.onNodeMouseDown = onNodeMouseDown
      reactFlowHandlers.onNodeMouseUp = onNodeMouseUp
      reactFlowHandlers.onNodeMouseLeave = onNodeMouseLeave
      reactFlowHandlers.onPaneClick = onPaneClick
      reactFlowHandlers.onPaneContextMenu = onPaneContextMenu
      reactFlowHandlers.onNodeClick = onNodeClick
      reactFlowHandlers.lastProps = props
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
    useNodesState: (initialNodes) => [initialNodes, vi.fn(), vi.fn()],
  }
})

function createProps(overrides = {}) {
  return {
    nodes: [
      {
        id: 'n1',
        layer: 'concept',
        title: 'Node One',
        domain: 'mechanics',
        mass: 1,
        position: { x: 100, y: 200 },
      },
      {
        id: 'n2',
        layer: 'concept',
        title: 'Node Two',
        domain: 'mechanics',
        mass: 1,
        position: { x: 300, y: 250 },
      },
    ],
    edges: [],
    visibleLayers: new Set(['concept', 'variable']),
    visibleDomains: new Set(['mechanics', 'electromagnetism']),
    selectedNodeId: null,
    isPanelOpen: false,
    panelWidth: 440,
    focalNodeIds: new Set(),
    neighborNodeIds: new Set(),
    distantNodeIds: new Set(),
    understandingStatesById: {},
    onNodeClick: vi.fn(),
    onNodePositionCommit: vi.fn(),
    onResetToCanonical: vi.fn(),
    onResetSelected: vi.fn(),
    onExportLayout: vi.fn(),
    onImportLayout: vi.fn(),
    isMobile: false,
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

function emitNodeDragStop(node) {
  if (typeof reactFlowHandlers.onNodeDragStop === 'function') {
    act(() => {
      reactFlowHandlers.onNodeDragStop({}, node)
    })
  }
}

function emitNodeDragStart(node) {
  if (typeof reactFlowHandlers.onNodeDragStart === 'function') {
    act(() => {
      reactFlowHandlers.onNodeDragStart({}, node)
    })
  }
}

function emitNodeMouseDown(node, event = { pointerType: 'touch', type: 'touchstart' }) {
  if (typeof reactFlowHandlers.onNodeMouseDown === 'function') {
    act(() => {
      reactFlowHandlers.onNodeMouseDown(event, node)
    })
  }
}

function emitNodeMouseUp(node, event = { pointerType: 'touch', type: 'touchend' }) {
  if (typeof reactFlowHandlers.onNodeMouseUp === 'function') {
    act(() => {
      reactFlowHandlers.onNodeMouseUp(event, node)
    })
  }
}

function emitNodeClick(node) {
  if (typeof reactFlowHandlers.onNodeClick === 'function') {
    act(() => {
      reactFlowHandlers.onNodeClick({}, { id: node.id, data: { node } })
    })
  }
}

function emitPaneContextMenu(event = { pointerType: 'touch', type: 'contextmenu' }) {
  if (typeof reactFlowHandlers.onPaneContextMenu === 'function') {
    act(() => {
      reactFlowHandlers.onPaneContextMenu(event)
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
    reactFlowHandlers.onNodeDragStart = null
    reactFlowHandlers.onNodeDragStop = null
    reactFlowHandlers.onNodeMouseDown = null
    reactFlowHandlers.onNodeMouseUp = null
    reactFlowHandlers.onNodeMouseLeave = null
    reactFlowHandlers.onPaneClick = null
    reactFlowHandlers.onPaneContextMenu = null
    reactFlowHandlers.onNodeClick = null
    reactFlowHandlers.lastProps = null
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

  it('maps flow nodes and node types from entity layer', () => {
    render(
      <GraphCanvas
        {...createProps({
          nodes: [
            {
              id: 'n-concept',
              layer: 'concept',
              title: 'Newton',
              domain: 'mechanics',
              mass: 1,
              position: { x: 0, y: 0 },
            },
            {
              id: 'n-variable',
              layer: 'variable',
              name: 'Mass',
              canonical_symbol: 'm',
              mass: 1,
              position: { x: 10, y: 10 },
            },
          ],
          edges: [
            {
              id: 'n-concept__uses-variable__n-variable',
              source: 'n-concept',
              target: 'n-variable',
              type: 'uses-variable',
              weight: 1,
              layer_pair: 'concept-variable',
            },
          ],
        })}
      />,
    )

    const renderedNodes = reactFlowHandlers.lastProps?.nodes ?? []
    const renderedNodeTypes = reactFlowHandlers.lastProps?.nodeTypes ?? {}
    expect(renderedNodeTypes.concept).toBeTypeOf('function')
    expect(renderedNodeTypes.variable).toBeTypeOf('function')

    const conceptFlowNode = renderedNodes.find((node) => node.id === 'n-concept')
    const variableFlowNode = renderedNodes.find((node) => node.id === 'n-variable')
    expect(conceptFlowNode?.type).toBe('concept')
    expect(variableFlowNode?.type).toBe('variable')
    expect(variableFlowNode?.data?.title).toBe('Mass')
    expect(variableFlowNode?.data?.canonicalSymbol).toBe('m')
  })

  it('sets nodesDraggable explicitly and disables drag selection', () => {
    render(<GraphCanvas {...createProps()} />)

    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(true)
    expect(reactFlowHandlers.lastProps?.selectNodesOnDrag).toBe(false)
  })

  it('uses mobile touch-safe interaction defaults on small screens', () => {
    render(<GraphCanvas {...createProps({ isMobile: true })} />)

    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(false)
    expect(reactFlowHandlers.lastProps?.panOnScroll).toBe(false)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(9999)
    expect(reactFlowHandlers.lastProps?.className).toContain('touch-none')
  })

  it('mobile short tap selects node without arming drag mode', () => {
    const onNodeClick = vi.fn()
    const node = { id: 'n1' }
    render(<GraphCanvas {...createProps({ isMobile: true, onNodeClick })} />)

    emitNodeMouseDown(node)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    emitNodeMouseUp(node)
    emitNodeClick(node)

    expect(onNodeClick).toHaveBeenCalledTimes(1)
    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(false)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(9999)
  })

  it('mobile long press arms drag mode and release before threshold cancels arming', () => {
    const node = { id: 'n1' }
    render(<GraphCanvas {...createProps({ isMobile: true })} />)

    emitNodeMouseDown(node)
    act(() => {
      vi.advanceTimersByTime(250)
    })
    emitNodeMouseUp(node)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(9999)

    emitNodeMouseDown(node)
    act(() => {
      vi.advanceTimersByTime(450)
    })
    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(true)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(1)
  })

  it('mobile drag stop commits and suppresses immediate post-drag click', () => {
    const onNodePositionCommit = vi.fn()
    const onNodeClick = vi.fn()
    const node = { id: 'n2' }
    render(<GraphCanvas {...createProps({ isMobile: true, onNodePositionCommit, onNodeClick })} />)

    emitNodeMouseDown(node)
    act(() => {
      vi.advanceTimersByTime(450)
    })
    emitNodeDragStart(node)
    emitNodeDragStop({
      id: 'n2',
      position: { x: 640, y: -120 },
    })

    emitNodeClick(node)
    expect(onNodePositionCommit).toHaveBeenCalledWith('n2', { x: 640, y: -120 })
    expect(onNodeClick).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(260)
    })
    emitNodeClick(node)
    expect(onNodeClick).toHaveBeenCalledTimes(1)
    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(false)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(9999)
  })

  it('clears pending mobile long-press timer when switching to desktop mode', () => {
    const node = { id: 'n1' }
    const { rerender } = render(<GraphCanvas {...createProps({ isMobile: true })} />)

    emitNodeMouseDown(node)
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender(<GraphCanvas {...createProps({ isMobile: false })} />)
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(true)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(1)
  })

  it('does not disarm mobile drag when pane context menu fires', () => {
    const node = { id: 'n1' }
    render(<GraphCanvas {...createProps({ isMobile: true })} />)

    emitNodeMouseDown(node)
    act(() => {
      vi.advanceTimersByTime(450)
    })
    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(true)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(1)

    emitPaneContextMenu()

    expect(reactFlowHandlers.lastProps?.nodesDraggable).toBe(true)
    expect(reactFlowHandlers.lastProps?.nodeDragThreshold).toBe(1)
  })

  it('marks uses-variable edges as focal when their concept is selected', () => {
    render(
      <GraphCanvas
        {...createProps({
          nodes: [
            {
              id: 'concept-1',
              layer: 'concept',
              title: 'Concept One',
              domain: 'mechanics',
              mass: 1,
              position: { x: 0, y: 0 },
            },
            {
              id: 'variable-1',
              layer: 'variable',
              name: 'Mass',
              canonical_symbol: 'm',
              mass: 1,
              position: { x: 10, y: 10 },
            },
          ],
          edges: [
            {
              id: 'concept-1__uses-variable__variable-1',
              source: 'concept-1',
              target: 'variable-1',
              type: 'uses-variable',
              weight: 1,
              layer_pair: 'concept-variable',
            },
          ],
          selectedNodeId: 'concept-1',
          focalNodeIds: new Set(['concept-1']),
          neighborNodeIds: new Set(['variable-1']),
          distantNodeIds: new Set(),
        })}
      />,
    )

    const renderedEdges = reactFlowHandlers.lastProps?.edges ?? []
    expect(renderedEdges).toHaveLength(1)
    expect(renderedEdges[0].data?.emphasis).toBe('focal')
  })

  it('flags foundational concept-to-concept edges as frontier when rule matches', () => {
    render(
      <GraphCanvas
        {...createProps({
          nodes: [
            {
              id: 'concept-source',
              layer: 'concept',
              title: 'Source Concept',
              domain: 'mechanics',
              mass: 1,
              position: { x: 0, y: 0 },
            },
            {
              id: 'concept-target',
              layer: 'concept',
              title: 'Target Concept',
              domain: 'mechanics',
              mass: 1,
              position: { x: 10, y: 10 },
            },
          ],
          edges: [
            {
              id: 'source__foundational__target',
              source: 'concept-source',
              target: 'concept-target',
              type: 'foundational',
              weight: 0.9,
              layer_pair: 'concept-concept',
            },
          ],
          understandingStatesById: {
            'concept-source': 'apply',
            'concept-target': 'seen',
          },
        })}
      />,
    )

    const renderedEdges = reactFlowHandlers.lastProps?.edges ?? []
    expect(renderedEdges).toHaveLength(1)
    expect(renderedEdges[0].data?.isFrontier).toBe(true)
  })

  it('never flags frontier for foundational edges that target variable nodes', () => {
    render(
      <GraphCanvas
        {...createProps({
          nodes: [
            {
              id: 'concept-source',
              layer: 'concept',
              title: 'Source Concept',
              domain: 'mechanics',
              mass: 1,
              position: { x: 0, y: 0 },
            },
            {
              id: 'variable-target',
              layer: 'variable',
              name: 'Mass',
              canonical_symbol: 'm',
              mass: 1,
              position: { x: 20, y: 20 },
            },
          ],
          edges: [
            {
              id: 'source__foundational__variable',
              source: 'concept-source',
              target: 'variable-target',
              type: 'foundational',
              weight: 0.9,
              layer_pair: 'concept-variable',
            },
          ],
          understandingStatesById: {
            'concept-source': 'derive',
            'variable-target': 'unseen',
          },
        })}
      />,
    )

    const renderedEdges = reactFlowHandlers.lastProps?.edges ?? []
    expect(renderedEdges).toHaveLength(1)
    expect(renderedEdges[0].data?.isFrontier).toBe(false)
  })

  it('applies composed layer and domain visibility to nodes and edges', () => {
    render(
      <GraphCanvas
        {...createProps({
          nodes: [
            {
              id: 'concept-mech',
              layer: 'concept',
              title: 'Mechanics Concept',
              domain: 'mechanics',
              mass: 1,
              position: { x: 0, y: 0 },
            },
            {
              id: 'concept-em',
              layer: 'concept',
              title: 'EM Concept',
              domain: 'electromagnetism',
              mass: 1,
              position: { x: 20, y: 0 },
            },
            {
              id: 'variable-1',
              layer: 'variable',
              name: 'Mass',
              canonical_symbol: 'm',
              mass: 1,
              position: { x: 40, y: 0 },
            },
          ],
          edges: [
            {
              id: 'edge-visible',
              source: 'concept-mech',
              target: 'variable-1',
              type: 'uses-variable',
              weight: 1,
              layer_pair: 'concept-variable',
            },
            {
              id: 'edge-hidden-domain',
              source: 'concept-em',
              target: 'variable-1',
              type: 'uses-variable',
              weight: 1,
              layer_pair: 'concept-variable',
            },
          ],
          visibleLayers: new Set(['concept', 'variable']),
          visibleDomains: new Set(['mechanics']),
        })}
      />,
    )

    const renderedNodes = reactFlowHandlers.lastProps?.nodes ?? []
    const renderedEdges = reactFlowHandlers.lastProps?.edges ?? []

    expect(renderedNodes.map((node) => node.id)).toEqual(['concept-mech', 'variable-1'])
    expect(renderedEdges.map((edge) => edge.id)).toEqual(['edge-visible'])
  })

  it('hides variables that are only connected to filtered-out domains', () => {
    render(
      <GraphCanvas
        {...createProps({
          nodes: [
            {
              id: 'concept-mech',
              layer: 'concept',
              title: 'Mechanics Concept',
              domain: 'mechanics',
              mass: 1,
              position: { x: 0, y: 0 },
            },
            {
              id: 'concept-em',
              layer: 'concept',
              title: 'EM Concept',
              domain: 'electromagnetism',
              mass: 1,
              position: { x: 20, y: 0 },
            },
            {
              id: 'variable-em-only',
              layer: 'variable',
              name: 'Electric Field',
              canonical_symbol: 'E',
              mass: 1,
              position: { x: 40, y: 0 },
            },
          ],
          edges: [
            {
              id: 'edge-hidden-domain-only',
              source: 'concept-em',
              target: 'variable-em-only',
              type: 'uses-variable',
              weight: 1,
              layer_pair: 'concept-variable',
            },
          ],
          visibleLayers: new Set(['concept', 'variable']),
          visibleDomains: new Set(['mechanics']),
        })}
      />,
    )

    const renderedNodes = reactFlowHandlers.lastProps?.nodes ?? []
    const renderedEdges = reactFlowHandlers.lastProps?.edges ?? []

    expect(renderedNodes.map((node) => node.id)).toEqual(['concept-mech'])
    expect(renderedEdges).toHaveLength(0)
  })

  it('commits dragged node positions on drag stop', () => {
    const onNodePositionCommit = vi.fn()
    render(<GraphCanvas {...createProps({ onNodePositionCommit })} />)

    emitNodeDragStop({
      id: 'n2',
      position: { x: 640, y: -120 },
    })

    expect(onNodePositionCommit).toHaveBeenCalledTimes(1)
    expect(onNodePositionCommit).toHaveBeenCalledWith('n2', { x: 640, y: -120 })
  })

  it('dragging a node does not trigger node click selection', () => {
    const onNodeClick = vi.fn()
    render(<GraphCanvas {...createProps({ onNodeClick, selectedNodeId: 'n1' })} />)

    emitNodeDragStop({
      id: 'n2',
      position: { x: 320, y: 80 },
    })

    expect(onNodeClick).not.toHaveBeenCalled()
  })

  it('wires layout reset actions to controls', () => {
    const onResetToCanonical = vi.fn()
    const onResetSelected = vi.fn()
    render(
      <GraphCanvas
        {...createProps({
          selectedNodeId: 'n1',
          onResetToCanonical,
          onResetSelected,
        })}
      />,
    )

    const canonicalButtons = screen.getAllByRole('button', { name: 'Reset to canonical' })
    const selectedButtons = screen.getAllByRole('button', { name: 'Reset selected' })
    fireEvent.click(canonicalButtons[canonicalButtons.length - 1])
    fireEvent.click(selectedButtons[selectedButtons.length - 1])

    expect(onResetToCanonical).toHaveBeenCalledTimes(1)
    expect(onResetSelected).toHaveBeenCalledTimes(1)
  })
})
