// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DomainFilterPanel from '../DomainFilterPanel.jsx'

describe('DomainFilterPanel', () => {
  afterEach(() => {
    cleanup()
  })

  it('calls All and None handlers', () => {
    const onSelectAllDomains = vi.fn()
    const onClearAllDomains = vi.fn()

    render(
      <DomainFilterPanel
        allDomains={['mechanics', 'thermodynamics']}
        allDomainKeys={new Set(['mechanics', 'thermodynamics'])}
        visibleDomains={new Set(['mechanics'])}
        onToggleDomain={vi.fn()}
        onSelectAllDomains={onSelectAllDomains}
        onClearAllDomains={onClearAllDomains}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    fireEvent.click(screen.getByRole('button', { name: 'None' }))
    expect(onSelectAllDomains).toHaveBeenCalledTimes(1)
    expect(onClearAllDomains).toHaveBeenCalledTimes(1)
  })

  it('keeps per-domain toggles working after batch actions', () => {
    const onToggleDomain = vi.fn()

    render(
      <DomainFilterPanel
        allDomains={['mechanics', 'thermodynamics']}
        allDomainKeys={new Set(['mechanics', 'thermodynamics'])}
        visibleDomains={new Set(['mechanics'])}
        onToggleDomain={onToggleDomain}
        onSelectAllDomains={vi.fn()}
        onClearAllDomains={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'None' }))
    fireEvent.click(screen.getByRole('button', { name: 'mechanics' }))
    expect(onToggleDomain).toHaveBeenCalledWith('mechanics')
  })
})
