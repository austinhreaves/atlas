// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import VariableNode from '../nodes/VariableNode.jsx'

vi.mock('reactflow', () => ({
  Handle: () => <div data-testid="rf-handle" />,
  useStore: () => 1,
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
}))

function renderVariableNode(progress = 0) {
  return render(
    <VariableNode
      selected={false}
      data={{
        title: 'Mass',
        canonicalSymbol: 'm',
        visualState: 'base',
        progress,
      }}
    />,
  )
}

describe('VariableNode visuals', () => {
  it('renders no arc and no understood badge', () => {
    const { container } = renderVariableNode(100)

    expect(container.querySelector('svg')).toBeNull()
    expect(container.textContent?.includes('✓')).toBe(false)
  })

  it('keeps identical base opacity/filter across progress levels', () => {
    const unseen = renderVariableNode(0)
    const derive = renderVariableNode(100)

    const unseenRoot = unseen.container.firstElementChild
    const deriveRoot = derive.container.firstElementChild
    expect(unseenRoot?.style.opacity).toBe('1')
    expect(deriveRoot?.style.opacity).toBe('1')
    expect(unseenRoot?.style.filter ?? '').not.toContain('saturate')
    expect(deriveRoot?.style.filter ?? '').not.toContain('saturate')
  })
})
