// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { cleanup } from '@testing-library/react'
import { useCallback, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LayerToggleBar from '../LayerToggleBar.jsx'

const layerEntries = [
  ['concept', { shape: 'circle', schema_validator: () => true }],
  ['variable', { shape: 'diamond', schema_validator: () => true }],
  ['problem', { shape: 'square', schema_validator: null }],
]

describe('LayerToggleBar', () => {
  afterEach(() => {
    cleanup()
  })

  it('calls All and None handlers', () => {
    const onSelectAllLayers = vi.fn()
    const onClearAllLayers = vi.fn()

    render(
      <LayerToggleBar
        layerEntries={layerEntries}
        allLayerKeys={new Set(['concept', 'variable', 'problem'])}
        visibleLayers={new Set(['concept'])}
        onToggleLayer={vi.fn()}
        onSelectAllLayers={onSelectAllLayers}
        onClearAllLayers={onClearAllLayers}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    fireEvent.click(screen.getByRole('button', { name: 'None' }))
    expect(onSelectAllLayers).toHaveBeenCalledTimes(1)
    expect(onClearAllLayers).toHaveBeenCalledTimes(1)
  })

  it('keeps disabled layers off after None then All', () => {
    function Harness() {
      const [visibleLayers, setVisibleLayers] = useState(new Set(['concept', 'variable']))

      const handleToggleLayer = useCallback((layerId) => {
        setVisibleLayers((current) => {
          const next = new Set(current)
          if (next.has(layerId)) {
            next.delete(layerId)
          } else {
            next.add(layerId)
          }
          return next
        })
      }, [])

      const handleSelectAllLayers = useCallback(() => {
        setVisibleLayers(new Set(['concept', 'variable']))
      }, [])

      const handleClearAllLayers = useCallback(() => {
        setVisibleLayers(new Set())
      }, [])

      return (
        <>
          <LayerToggleBar
            layerEntries={layerEntries}
            allLayerKeys={new Set(['concept', 'variable', 'problem'])}
            visibleLayers={visibleLayers}
            onToggleLayer={handleToggleLayer}
            onSelectAllLayers={handleSelectAllLayers}
            onClearAllLayers={handleClearAllLayers}
          />
          <output data-testid="visible-layers">{Array.from(visibleLayers).join(',')}</output>
        </>
      )
    }

    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: 'None' }))
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByTestId('visible-layers').textContent).toBe('concept,variable')
    expect(screen.getByRole('button', { name: /Toggle problem layer/i }).hasAttribute('disabled')).toBe(
      true,
    )
  })
})
