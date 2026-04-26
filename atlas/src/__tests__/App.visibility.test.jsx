// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

const appState = vi.hoisted(() => ({
  graphProps: null,
}))

vi.mock('../components/GraphCanvas.jsx', () => ({
  default: (props) => {
    appState.graphProps = props
    return <div data-testid="graph-canvas-mock" />
  },
}))

vi.mock('../components/NodePanel.jsx', () => ({
  default: () => <div data-testid="node-panel-mock" />,
}))

vi.mock('../data', () => ({
  getAllEntities: () => [
    {
      id: 'concept-mechanics',
      layer: 'concept',
      title: 'Mechanics Concept',
      domain: 'mechanics',
      prerequisites: [],
      position: { x: 0, y: 0 },
    },
    {
      id: 'concept-electromagnetism',
      layer: 'concept',
      title: 'EM Concept',
      domain: 'electromagnetism',
      prerequisites: [],
      position: { x: 20, y: 20 },
    },
    {
      id: 'variable-mass',
      layer: 'variable',
      name: 'Mass',
      canonical_symbol: 'm',
      position: { x: 40, y: 40 },
    },
  ],
}))

vi.mock('../data/edges', () => ({
  buildEdges: () => [],
  normalizePrerequisiteWeight: () => 0.85,
}))

vi.mock('../lib/layout', () => ({
  computeLayout: () => ({
    'concept-mechanics': { x: 0, y: 0 },
    'concept-electromagnetism': { x: 20, y: 20 },
    'variable-mass': { x: 40, y: 40 },
  }),
  computeMass: () => 1,
}))

vi.mock('../lib/resolveRenderPosition', () => ({
  resolveRenderPosition: ({ canonicalPosition }) => canonicalPosition,
}))

vi.mock('../lib/understanding', () => ({
  getUnderstood: () => new Set(),
}))

vi.mock('../lib/userLayout', () => ({
  buildLayoutExportPayload: () => ({}),
  clearUserLayoutStore: vi.fn(),
  computeCorpusHash: () => Promise.resolve('hash-123'),
  createUserLayoutStore: ({ positions = {}, atlasCorpusHash = 'hash-123', userNote = '' } = {}) => ({
    positions,
    metadata: { atlas_corpus_hash: atlasCorpusHash, user_note: userNote },
  }),
  downloadLayoutPayload: vi.fn(),
  getUserLayoutStore: () => ({
    positions: {},
    metadata: { atlas_corpus_hash: 'hash-123', user_note: '' },
  }),
  parseLayoutImportPayload: vi.fn(),
  removeUserLayoutPosition: (store) => store,
  saveUserLayoutStore: vi.fn(),
  setUserLayoutPosition: (store) => store,
  validateLayoutImportPayload: vi.fn(),
}))

describe('App visibility controls', () => {
  beforeEach(() => {
    window.localStorage.clear()
    appState.graphProps = null
  })

  afterEach(() => {
    cleanup()
    appState.graphProps = null
  })

  it('persists layer visibility and legend collapse state to localStorage', async () => {
    render(<App />)

    await waitFor(() => {
      expect(window.localStorage.getItem('atlas_layers_v1')).toBe(JSON.stringify(['concept']))
      expect(window.localStorage.getItem('atlas_legend_v1')).toBe('expanded')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Toggle variable layer' }))
    fireEvent.click(screen.getAllByRole('button', { name: /Domain Legend/i })[0])

    await waitFor(() => {
      const storedLayers = JSON.parse(window.localStorage.getItem('atlas_layers_v1') ?? '[]')
      expect(storedLayers).toContain('concept')
      expect(storedLayers).toContain('variable')
      expect(window.localStorage.getItem('atlas_legend_v1')).toBe('collapsed')
    })
  })

  it('restores visibility state and derives legend rows from visible concepts', async () => {
    window.localStorage.setItem('atlas_layers_v1', JSON.stringify(['concept', 'variable']))
    window.localStorage.setItem('atlas_legend_v1', 'collapsed')

    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
      expect(appState.graphProps.visibleLayers.has('concept')).toBe(true)
      expect(appState.graphProps.visibleLayers.has('variable')).toBe(true)
    })

    expect(screen.getAllByRole('button', { name: /Domain Legend/i })[0].textContent).toContain('Show')

    fireEvent.click(screen.getAllByRole('button', { name: /Domain Legend/i })[0])
    expect(screen.queryAllByText('mechanics').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('electromagnetism').length).toBeGreaterThan(0)

    fireEvent.click(screen.getAllByRole('button', { name: 'electromagnetism' })[0])
    expect(screen.queryAllByText('electromagnetism').length).toBe(1)
    expect(screen.queryAllByText('mechanics').length).toBeGreaterThan(0)
  })
})
