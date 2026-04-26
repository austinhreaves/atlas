// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TagFilterPanel from '../TagFilterPanel.jsx'

const registryTags = [
  {
    id: 'mechanics',
    label: 'Mechanics',
    description: 'Mechanics concepts and topics.',
    review_state: 'published',
  },
  {
    id: 'orbital-mechanics',
    label: 'Orbital mechanics',
    description: 'Orbital dynamics topics.',
    review_state: 'draft',
  },
]

describe('TagFilterPanel', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders published tags by default', () => {
    render(
      <TagFilterPanel
        tags={registryTags}
        includeDraftContent={false}
        activeTags={new Set(['mechanics'])}
        onToggleTag={vi.fn()}
        onSelectAllTags={vi.fn()}
        onClearAllTags={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Tags \(1\/1\)/i }))
    expect(screen.getByRole('button', { name: 'Mechanics' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Orbital mechanics' })).toBeNull()
  })

  it('includes draft tags when includeDraftContent is true', () => {
    const view = render(
      <TagFilterPanel
        tags={registryTags}
        includeDraftContent
        activeTags={new Set(['mechanics', 'orbital-mechanics'])}
        onToggleTag={vi.fn()}
        onSelectAllTags={vi.fn()}
        onClearAllTags={vi.fn()}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: /Tags \(2\/2\)/i }))
    expect(view.getByRole('button', { name: 'Mechanics' })).not.toBeNull()
    expect(view.getByRole('button', { name: 'Orbital mechanics' })).not.toBeNull()
  })

  it('calls onToggleTag when a tag is clicked', () => {
    const onToggleTag = vi.fn()
    const view = render(
      <TagFilterPanel
        tags={registryTags}
        activeTags={new Set(['mechanics'])}
        onToggleTag={onToggleTag}
        onSelectAllTags={vi.fn()}
        onClearAllTags={vi.fn()}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: /Tags \(1\/1\)/i }))
    fireEvent.click(view.getByRole('button', { name: 'Mechanics' }))
    expect(onToggleTag).toHaveBeenCalledWith('mechanics')
  })

  it('calls All and None handlers', () => {
    const onSelectAllTags = vi.fn()
    const onClearAllTags = vi.fn()
    const view = render(
      <TagFilterPanel
        tags={registryTags}
        activeTags={new Set()}
        onToggleTag={vi.fn()}
        onSelectAllTags={onSelectAllTags}
        onClearAllTags={onClearAllTags}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: /Tags \(0\/1\)/i }))
    fireEvent.click(view.getByRole('button', { name: 'All' }))
    fireEvent.click(view.getByRole('button', { name: 'None' }))
    expect(onSelectAllTags).toHaveBeenCalledTimes(1)
    expect(onClearAllTags).toHaveBeenCalledTimes(1)
  })

  it('hides the panel when the visible registry is empty', () => {
    const { container } = render(
      <TagFilterPanel
        tags={[{ ...registryTags[1], review_state: 'draft' }]}
        includeDraftContent={false}
        activeTags={new Set()}
        onToggleTag={vi.fn()}
        onSelectAllTags={vi.fn()}
        onClearAllTags={vi.fn()}
      />,
    )
    expect(container.textContent?.trim()).toBe('')
  })
})
