// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import NodePanel from '../NodePanel'
import { concepts as nodes } from '../../data'
import variables from '../../data/variables.json'
import { getBlockState } from '../../lib/blockState'

describe('NodePanel block-only integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  function setViewportWidth(width) {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    })
  }

  it('renders block content for concept nodes and avoids legacy shells', () => {
    const node = nodes.find((candidate) => candidate.id === 'newtons-second-law')
    expect(node).toBeDefined()

    const panel = render(<NodePanel selectedNode={node} onClose={() => {}} />)
    const text = panel.container.textContent || ''

    expect(text).toContain('Principle')
    expect(text).toContain('Formula')
    expect(text).not.toContain('Concept Links')
    expect(text).not.toContain('No prerequisite concepts.')
  })

  it('renders block content for variable nodes via the same path', () => {
    const variableNode = variables.find((candidate) => candidate.id === 'force-net')
    expect(variableNode).toBeDefined()

    const panel = render(<NodePanel selectedNode={variableNode} onClose={() => {}} />)
    const text = panel.container.textContent || ''

    expect(text).toContain('Symbol')
    expect(text).toContain('Metadata')
    expect(text).toContain('Description')
    expect(text).not.toContain('Appears In')
  })

  it('shows no-blocks state when selected node lacks blocks', () => {
    const panel = render(
      <NodePanel selectedNode={{ ...nodes[0], id: 'legacy-node', blocks: [] }} onClose={() => {}} />,
    )
    expect(panel.container.textContent || '').toContain('No blocks available for this node.')
  })

  it('persists interactive checklist block state by node and block id', () => {
    const blockNode = {
      ...nodes[0],
      id: 'block-checklist-node',
      blocks: [
        {
          block_id: 'check-1',
          type: 'checklist',
          title: 'Steps',
          data: {
            items: [{ id: 'step-1', text: 'Connect probes' }],
          },
        },
      ],
    }

    const panel = render(<NodePanel selectedNode={blockNode} onClose={() => {}} />)
    fireEvent.click(panel.container.querySelector('input[type="checkbox"]'))

    expect(getBlockState('block-checklist-node', 'check-1')).toEqual({
      checkedByItemId: { 'step-1': true },
    })
  })

  it('writes concept progress via slider and reset', () => {
    const node = nodes.find((candidate) => candidate.id === 'newtons-second-law')
    const onProgressChange = vi.fn()
    expect(node).toBeDefined()

    const panel = render(
      <NodePanel
        selectedNode={node}
        progressById={{ 'newtons-second-law': 35 }}
        onProgressChange={onProgressChange}
        onClose={() => {}}
      />,
    )

    fireEvent.change(panel.getByRole('slider', { name: 'Mastery progress' }), {
      target: { value: '72' },
    })
    expect(onProgressChange).toHaveBeenCalledWith('newtons-second-law', 72)

    fireEvent.click(panel.getByRole('button', { name: 'Reset' }))
    expect(onProgressChange).toHaveBeenCalledWith('newtons-second-law', 0)
  })

  it('renders variable known indicator as read-only when linked concept progress is high', () => {
    const variableNode = variables.find((candidate) => candidate.id === 'force-net')
    expect(variableNode).toBeDefined()

    const panel = render(
      <NodePanel
        selectedNode={variableNode}
        appearsInByVariableId={{ 'force-net': ['newtons-second-law'] }}
        progressById={{ 'newtons-second-law': 66 }}
        onClose={() => {}}
      />,
    )

    expect(panel.container.textContent || '').toContain('Known')
    expect(panel.getByRole('button', { name: 'Reset' })).not.toBeNull()
    expect(panel.getByRole('slider', { name: 'Mastery progress' })).not.toBeNull()
  })

  it('renders resize handle only when panel is open', () => {
    const panel = render(<NodePanel selectedNode={null} onClose={() => {}} />)
    expect(panel.queryByTestId('node-panel-resize-handle')).toBeNull()

    panel.rerender(<NodePanel selectedNode={nodes[0]} onClose={() => {}} />)
    expect(panel.getByTestId('node-panel-resize-handle')).not.toBeNull()
  })

  it('renders bottom-sheet mode and hides resize affordance on mobile', () => {
    setViewportWidth(375)
    const panel = render(<NodePanel selectedNode={nodes[0]} isMobile onClose={() => {}} />)

    expect(panel.queryByTestId('node-panel-resize-handle')).toBeNull()
    const sheet = panel.container.querySelector('aside')
    expect(sheet).not.toBeNull()
    expect(sheet.className).toContain('inset-x-0')
    expect(sheet.className).toContain('translate-y-0')
  })
})
