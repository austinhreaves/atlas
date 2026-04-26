// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

const appState = vi.hoisted(() => ({
  graphProps: null,
  nodePanelProps: null,
}))

vi.mock('../components/GraphCanvas.jsx', () => ({
  default: (props) => {
    appState.graphProps = props
    return <div data-testid="graph-canvas-mock" />
  },
}))

vi.mock('../components/NodePanel.jsx', () => ({
  default: (props) => {
    appState.nodePanelProps = props
    return (
      <div data-testid="node-panel-mock">
        <button type="button" onClick={() => props.onPanelWidthChange?.(512)}>
          Set panel width 512
        </button>
      </div>
    )
  },
}))

vi.mock('../data', () => ({
  getAllEntities: () => [
    {
      id: 'concept-mechanics',
      layer: 'concept',
      review_state: 'published',
      subject: 'physics',
      title: 'Mechanics Concept',
      domain: 'mechanics',
      sub_domains: ['kinematics'],
      tags: ['kw-mechanics'],
      prerequisites: [],
      position: { x: 0, y: 0 },
    },
    {
      id: 'concept-electromagnetism',
      layer: 'concept',
      review_state: 'published',
      subject: 'physics',
      title: 'EM Concept',
      domain: 'electromagnetism',
      sub_domains: ['electrostatics'],
      tags: ['kw-electromagnetism'],
      prerequisites: [],
      position: { x: 20, y: 20 },
    },
    {
      id: 'variable-mass',
      layer: 'variable',
      review_state: 'published',
      name: 'Mass',
      canonical_symbol: 'm',
      position: { x: 40, y: 40 },
    },
    {
      id: 'concept-draft',
      layer: 'concept',
      review_state: 'draft',
      subject: 'physics',
      title: 'Draft Concept',
      domain: 'mechanics',
      sub_domains: ['dynamics'],
      tags: ['kw-mechanics'],
      prerequisites: [],
      position: { x: 60, y: 60 },
    },
    {
      id: 'variable-reviewed',
      layer: 'variable',
      review_state: 'reviewed',
      name: 'Reviewed Variable',
      canonical_symbol: 'x',
      position: { x: 80, y: 80 },
    },
  ],
  computeAppearsIn: () => ({
    'variable-mass': ['concept-mechanics'],
    'variable-reviewed': ['concept-draft'],
  }),
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
    'concept-draft': { x: 60, y: 60 },
    'variable-reviewed': { x: 80, y: 80 },
  }),
  computeMass: () => 1,
}))

vi.mock('../lib/resolveRenderPosition', () => ({
  resolveRenderPosition: ({ canonicalPosition }) => canonicalPosition,
}))

vi.mock('../lib/understanding', () => ({
  getAllStates: () => ({}),
  setState: vi.fn(),
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
  function setViewportWidth(width) {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    })
    window.dispatchEvent(new Event('resize'))
  }

  beforeEach(() => {
    setViewportWidth(1280)
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
    appState.graphProps = null
    appState.nodePanelProps = null
  })

  afterEach(() => {
    cleanup()
    appState.graphProps = null
    appState.nodePanelProps = null
  })

  it('persists layer visibility and legend collapse state to localStorage', async () => {
    render(<App />)

    await waitFor(() => {
      expect(window.localStorage.getItem('atlas_layers_v1')).toBe(JSON.stringify(['concept']))
      expect(window.localStorage.getItem('atlas_legend_v1')).toBe('expanded')
    })

    expect(screen.queryByRole('button', { name: 'Toggle variable layer' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'View' }))
    const expandLayersButton = screen.queryByRole('button', { name: 'Layers' })
    if (expandLayersButton) {
      fireEvent.click(expandLayersButton)
    }
    fireEvent.click(screen.getByRole('button', { name: 'Toggle variable layer' }))
    fireEvent.click(screen.getAllByRole('button', { name: /Domain Legend/i })[0])

    await waitFor(() => {
      const storedLayers = JSON.parse(window.localStorage.getItem('atlas_layers_v1') ?? '[]')
      expect(storedLayers).toContain('concept')
      expect(storedLayers).toContain('variable')
      expect(window.localStorage.getItem('atlas_legend_v1')).toBe('collapsed')
    })
  })

  it('opens a desktop left view panel and persists open/closed state', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View' })).not.toBeNull()
      expect(window.localStorage.getItem('atlas_view_panel_open_v1')).toBe('closed')
    })

    fireEvent.click(screen.getByRole('button', { name: 'View' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Close view' })).not.toBeNull()
      expect(window.localStorage.getItem('atlas_view_panel_open_v1')).toBe('open')
      expect(screen.getByTestId('desktop-view-controls-aside').getAttribute('aria-hidden')).toBe(
        'false',
      )
      expect(screen.getByRole('button', { name: 'Close view' }).parentElement?.getAttribute('style')).toContain(
        'translateX(',
      )
    })

    fireEvent.click(screen.getByRole('button', { name: 'Close view' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View' })).not.toBeNull()
      expect(window.localStorage.getItem('atlas_view_panel_open_v1')).toBe('closed')
      expect(screen.getByTestId('desktop-view-controls-aside').getAttribute('aria-hidden')).toBe(
        'true',
      )
      expect(screen.getByRole('button', { name: 'View' }).parentElement?.getAttribute('style')).toContain(
        'translateX(0px)',
      )
    })
  })

  it('restores and persists desktop left view panel width', async () => {
    window.localStorage.setItem('atlas_view_panel_width_v1', '420')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View' })).not.toBeNull()
    })
    fireEvent.click(screen.getByRole('button', { name: 'View' }))

    const aside = screen.getByTestId('desktop-view-controls-aside')
    expect(aside.getAttribute('style')).toContain('420px')

    const handle = screen.getByTestId('desktop-view-panel-resize-handle')
    fireEvent.pointerDown(handle, { clientX: 120 })
    fireEvent.pointerMove(window, { clientX: 220 })
    fireEvent.pointerUp(window)

    await waitFor(() => {
      expect(window.localStorage.getItem('atlas_view_panel_width_v1')).toBe('520')
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

    fireEvent.click(screen.getByRole('button', { name: 'View' }))
    expect(screen.getAllByRole('button', { name: /Domain Legend/i })[0].textContent).toContain('Show')

    fireEvent.click(screen.getAllByRole('button', { name: /Domain Legend/i })[0])
    expect(screen.queryAllByText('mechanics').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('electromagnetism').length).toBeGreaterThan(0)

    fireEvent.click(screen.getAllByRole('button', { name: 'electromagnetism' })[0])
    expect(screen.queryAllByText('electromagnetism').length).toBe(1)
    expect(screen.queryAllByText('mechanics').length).toBeGreaterThan(0)
  })

  it('uses a mobile filters overlay and hides desktop control stacks', async () => {
    setViewportWidth(375)
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Filters' })).not.toBeNull()
    })
    expect(screen.queryByRole('button', { name: 'Toggle variable layer' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
    fireEvent.click(screen.getByRole('button', { name: 'Toggle variable layer' }))
    fireEvent.click(screen.getByRole('button', { name: /Domain Legend/i }))

    await waitFor(() => {
      const storedLayers = JSON.parse(window.localStorage.getItem('atlas_layers_v1') ?? '[]')
      expect(storedLayers).toContain('variable')
      expect(window.localStorage.getItem('atlas_legend_v1')).toBe('collapsed')
    })
  })

  it('filters out draft and reviewed entities by default', async () => {
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    const renderedNodeIds = appState.graphProps.nodes.map((node) => node.id)
    expect(renderedNodeIds).toContain('concept-mechanics')
    expect(renderedNodeIds).toContain('concept-electromagnetism')
    expect(renderedNodeIds).toContain('variable-mass')
    expect(renderedNodeIds).not.toContain('concept-draft')
    expect(renderedNodeIds).not.toContain('variable-reviewed')
    expect(screen.queryByText('Showing draft content')).toBeNull()
  })

  it('includes draft and reviewed entities when include=draft is present', async () => {
    window.history.replaceState({}, '', '/?include=draft')
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    const renderedNodeIds = appState.graphProps.nodes.map((node) => node.id)
    expect(renderedNodeIds).toContain('concept-draft')
    expect(renderedNodeIds).toContain('variable-reviewed')
    expect(screen.getByText('Showing draft content')).not.toBeNull()
  })

  it('persists panel width and restores a stored value on load', async () => {
    window.localStorage.setItem('atlas_panel_width_v1', '490')
    render(<App />)

    await waitFor(() => {
      expect(appState.nodePanelProps?.panelWidth).toBe(490)
    })

    fireEvent.click(screen.getByRole('button', { name: 'Set panel width 512' }))
    await waitFor(() => {
      expect(window.localStorage.getItem('atlas_panel_width_v1')).toBe('512')
    })
  })

  it('clamps invalid stored panel widths to viewport limits', async () => {
    window.localStorage.setItem('atlas_panel_width_v1', '9999')
    setViewportWidth(1000)
    render(<App />)

    await waitFor(() => {
      expect(appState.nodePanelProps?.panelWidth).toBe(550)
    })
  })

  it('closes selection on Escape when focus is not in an editable field', async () => {
    render(<App />)
    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-mechanics' })
    })
    await waitFor(() => {
      expect(appState.graphProps.selectedNodeId).toBe('concept-mechanics')
    })

    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => {
      expect(appState.graphProps.selectedNodeId).toBeNull()
    })
  })

  it('does not close selection on Escape while typing in an input', async () => {
    render(<App />)
    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-mechanics' })
    })
    await waitFor(() => {
      expect(appState.graphProps.selectedNodeId).toBe('concept-mechanics')
    })

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    fireEvent.keyDown(input, { key: 'Escape' })
    await waitFor(() => {
      expect(appState.graphProps.selectedNodeId).toBe('concept-mechanics')
    })
    document.body.removeChild(input)
  })

  it('threads shared hoveredEntity state through GraphCanvas props', async () => {
    render(<App />)
    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
      expect(appState.graphProps.hoveredEntity).toBeNull()
      expect(typeof appState.graphProps.onSetHover).toBe('function')
    })

    act(() => {
      appState.graphProps.onSetHover({
        kind: 'node',
        id: 'concept-mechanics',
        screenX: 120,
        screenY: 240,
      })
    })

    await waitFor(() => {
      expect(appState.graphProps.hoveredEntity).toEqual({
        kind: 'node',
        id: 'concept-mechanics',
        screenX: 120,
        screenY: 240,
      })
      expect(appState.graphProps.selectedNodeId).toBeNull()
    })
  })

  it('filters concepts by active sub-domains when a subset is active', async () => {
    render(<App />)
    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    fireEvent.click(screen.getByRole('button', { name: 'View' }))
    const tagToggleButton = screen.getByRole('button', { name: /Sub-domains \(/i })
    fireEvent.click(tagToggleButton)
    const tagPanel = tagToggleButton.closest('section')
    if (!tagPanel) {
      throw new Error('Expected Sub-domains panel container to exist')
    }
    fireEvent.click(within(tagPanel).getByRole('button', { name: 'None' }))
    fireEvent.click(within(tagPanel).getByRole('button', { name: 'Kinematics' }))

    expect(screen.getByRole('button', { name: 'mechanics' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'electromagnetism' })).not.toBeNull()

    await waitFor(() => {
      const renderedNodeIds = appState.graphProps.nodes.map((node) => node.id)
      expect(renderedNodeIds).toContain('concept-mechanics')
      expect(renderedNodeIds).not.toContain('concept-electromagnetism')
    })
  })

  it('round-trips active sub-domains through localStorage and drops unknown ids', async () => {
    window.localStorage.setItem(
      'atlas_active_subdomains_v1',
      JSON.stringify(['kinematics', 'definitely-old-tag']),
    )
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
      const stored = JSON.parse(window.localStorage.getItem('atlas_active_subdomains_v1') ?? '[]')
      expect(stored).toContain('kinematics')
      expect(stored).not.toContain('definitely-old-tag')
    })
  })
})
