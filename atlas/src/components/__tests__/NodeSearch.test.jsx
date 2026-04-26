// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NodeSearch from '../NodeSearch.jsx'

const baseNodes = [
  { id: 'concept-newton-law', title: "Newton's laws", layer: 'concept', domain: 'mechanics' },
  { id: 'concept-ohm-law', title: "Ohm's law", layer: 'concept', domain: 'electromagnetism' },
  {
    id: 'variable-current',
    title: 'Electric current',
    layer: 'variable',
    canonical_symbol: 'I',
  },
  {
    id: 'variable-displacement',
    title: 'Displacement',
    layer: 'variable',
    canonical_symbol: '\\Delta x',
  },
]

describe('NodeSearch', () => {
  afterEach(() => {
    cleanup()
  })

  it('matches by title, id, and canonical symbol', () => {
    render(<NodeSearch nodes={baseNodes} onSelectNode={vi.fn()} />)
    const input = screen.getByLabelText('Search nodes')

    fireEvent.change(input, { target: { value: 'newton' } })
    expect(screen.getByRole('option', { name: /Newton's laws/i })).not.toBeNull()

    fireEvent.change(input, { target: { value: 'concept-ohm' } })
    expect(screen.getByRole('option', { name: /Ohm's law/i })).not.toBeNull()

    fireEvent.change(input, { target: { value: '\\delta' } })
    expect(screen.getByRole('option', { name: /variable/i })).not.toBeNull()
  })

  it('caps results at 8', () => {
    const manyNodes = Array.from({ length: 12 }, (_, index) => ({
      id: `concept-node-${index}`,
      title: `Node ${index}`,
      layer: 'concept',
      domain: 'mechanics',
    }))
    render(<NodeSearch nodes={manyNodes} onSelectNode={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Search nodes'), { target: { value: 'node' } })
    expect(screen.getAllByRole('option').length).toBe(8)
  })

  it('wraps arrow navigation and selects highlighted row on Enter', () => {
    const onSelectNode = vi.fn()
    render(<NodeSearch nodes={baseNodes} onSelectNode={onSelectNode} />)
    const input = screen.getByLabelText('Search nodes')

    fireEvent.change(input, { target: { value: 'law' } })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSelectNode).toHaveBeenCalledWith('concept-ohm-law')
    expect(input.value).toBe('')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes on Escape without selecting a node', () => {
    const onSelectNode = vi.fn()
    render(<NodeSearch nodes={baseNodes} onSelectNode={onSelectNode} />)
    const input = screen.getByLabelText('Search nodes')

    fireEvent.change(input, { target: { value: 'law' } })
    expect(screen.getByRole('listbox')).not.toBeNull()

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(onSelectNode).not.toHaveBeenCalled()
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
