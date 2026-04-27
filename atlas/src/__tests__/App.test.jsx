// @vitest-environment jsdom
import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

const appState = vi.hoisted(() => ({
  constructionRendered: false,
  referenceRendered: false,
}))

const userLayoutMocks = vi.hoisted(() => ({
  getUserLayoutStore: vi.fn(),
  saveUserLayoutStore: vi.fn(),
  clearUserLayoutStore: vi.fn(),
}))

vi.mock('../construction/ConstructionApp.jsx', () => ({
  default: () => {
    appState.constructionRendered = true
    return <div data-testid="construction-app-mock" />
  },
}))

vi.mock('../reference/ReferenceApp.jsx', () => ({
  default: () => {
    appState.referenceRendered = true
    userLayoutMocks.getUserLayoutStore()
    userLayoutMocks.saveUserLayoutStore()
    userLayoutMocks.clearUserLayoutStore()
    return <div data-testid="reference-app-mock" />
  },
}))

describe('App mode routing', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    appState.constructionRendered = false
    appState.referenceRendered = false
    userLayoutMocks.getUserLayoutStore.mockClear()
    userLayoutMocks.saveUserLayoutStore.mockClear()
    userLayoutMocks.clearUserLayoutStore.mockClear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders construction mode for mode=construct and keeps reference layout paths untouched', async () => {
    window.history.replaceState({}, '', '/?mode=construct')
    render(<App />)

    await waitFor(() => {
      expect(appState.constructionRendered).toBe(true)
      expect(appState.referenceRendered).toBe(false)
      expect(userLayoutMocks.getUserLayoutStore).not.toHaveBeenCalled()
      expect(userLayoutMocks.saveUserLayoutStore).not.toHaveBeenCalled()
      expect(userLayoutMocks.clearUserLayoutStore).not.toHaveBeenCalled()
    })
  })

  it('renders reference mode when construct mode is absent', async () => {
    render(<App />)

    await waitFor(() => {
      expect(appState.referenceRendered).toBe(true)
      expect(appState.constructionRendered).toBe(false)
      expect(userLayoutMocks.getUserLayoutStore).toHaveBeenCalled()
    })
  })
})
