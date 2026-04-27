// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ConstructionEdge from '../ConstructionEdge.jsx'

vi.mock('reactflow', () => ({
  BaseEdge: ({ style }) => (
    <div
      data-testid="base-edge"
      data-stroke-dasharray={style?.strokeDasharray ?? ''}
      data-stroke-width={style?.strokeWidth ?? ''}
    />
  ),
  getBezierPath: () => ['M0,0 C 0,0 10,10 10,10'],
}))

describe('ConstructionEdge', () => {
  it('renders dashed stroke when explanation is empty', () => {
    render(
      <svg>
        <ConstructionEdge
          id="edge-empty"
          sourceX={0}
          sourceY={0}
          targetX={10}
          targetY={10}
          sourcePosition="right"
          targetPosition="left"
          data={{ explanation: null }}
        />
      </svg>,
    )

    expect(screen.getAllByTestId('base-edge').at(-1)?.dataset.strokeDasharray).toBe('6 6')
  })

  it('renders solid stroke when explanation is filled', () => {
    render(
      <svg>
        <ConstructionEdge
          id="edge-filled"
          sourceX={0}
          sourceY={0}
          targetX={10}
          targetY={10}
          sourcePosition="right"
          targetPosition="left"
          data={{ explanation: 'Connected by dependency.' }}
        />
      </svg>,
    )

    expect(screen.getAllByTestId('base-edge').at(-1)?.dataset.strokeDasharray).toBe('')
  })
})
