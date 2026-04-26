// @vitest-environment jsdom
import { cleanup, render, waitFor } from '@testing-library/react'
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
    return <div data-testid="node-panel-mock" />
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
  ],
  computeAppearsIn: () => ({
    'variable-mass': ['concept-mechanics'],
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

describe('App URL deep linking', () => {
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
    vi.restoreAllMocks()
  })

  it('reads a valid node id from the URL on mount', async () => {
    window.history.replaceState({}, '', '/?node=concept-mechanics')
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBe('concept-mechanics')
    })
  })

  it('ignores an unknown node id from the URL on mount', async () => {
    window.history.replaceState({}, '', '/?node=does-not-exist')
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBeNull()
    })
  })

  it('uses replaceState for the first mutation and pushState afterward', async () => {
    const replaceSpy = vi.spyOn(window.history, 'replaceState')
    const pushSpy = vi.spyOn(window.history, 'pushState')

    render(<App />)
    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-mechanics' })
    })
    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBe('concept-mechanics')
      expect(replaceSpy).toHaveBeenCalled()
      expect(window.location.search).toContain('node=concept-mechanics')
    })

    const replaceCallCountAfterFirstSelection = replaceSpy.mock.calls.length
    const pushCallCountAfterFirstSelection = pushSpy.mock.calls.length

    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-electromagnetism' })
    })
    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBe('concept-electromagnetism')
      expect(replaceSpy.mock.calls.length).toBe(replaceCallCountAfterFirstSelection)
      expect(pushSpy.mock.calls.length).toBeGreaterThan(pushCallCountAfterFirstSelection)
      expect(window.location.search).toContain('node=concept-electromagnetism')
    })
  })

  it('syncs selection from popstate', async () => {
    window.history.replaceState({}, '', '/?node=concept-mechanics')
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBe('concept-mechanics')
    })

    act(() => {
      window.history.pushState({}, '', '/?node=concept-electromagnetism')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBe('concept-electromagnetism')
    })
  })

  it('dedupes repeated selection of the same node', async () => {
    const pushSpy = vi.spyOn(window.history, 'pushState')
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-mechanics' })
    })
    await waitFor(() => {
      expect(window.location.search).toContain('node=concept-mechanics')
    })

    const pushCallCountAfterFirstSelection = pushSpy.mock.calls.length
    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-mechanics' })
    })

    await waitFor(() => {
      expect(appState.graphProps?.selectedNodeId).toBe('concept-mechanics')
      expect(pushSpy.mock.calls.length).toBe(pushCallCountAfterFirstSelection)
    })
  })

  it('preserves include=draft when updating node selection in URL', async () => {
    window.history.replaceState({}, '', '/?include=draft')
    render(<App />)

    await waitFor(() => {
      expect(appState.graphProps).not.toBeNull()
    })

    act(() => {
      appState.graphProps.onNodeClick({ id: 'concept-mechanics' })
    })

    await waitFor(() => {
      expect(window.location.search).toContain('include=draft')
      expect(window.location.search).toContain('node=concept-mechanics')
    })
  })
})
