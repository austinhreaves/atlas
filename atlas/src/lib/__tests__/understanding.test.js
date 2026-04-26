import { beforeEach, describe, expect, it } from 'vitest'
import {
  getAllStates,
  getState,
  isStateAtLeast,
  isStateAtMost,
  setState,
} from '../understanding'

function createLocalStorageMock() {
  const store = new Map()
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }
}

describe('understanding storage helpers', () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock()
  })

  it('setState persists and round-trips via v2 localStorage map', () => {
    setState('newtons-second-law', 'apply')
    setState('ohms-law', 'seen')
    const allStates = getAllStates()

    expect(allStates['newtons-second-law']).toBe('apply')
    expect(allStates['ohms-law']).toBe('seen')
    expect(getState('newtons-second-law')).toBe('apply')
  })

  it('migrates legacy v1 understood ids to v2 apply state', () => {
    globalThis.localStorage.setItem(
      'atlas_understood_v1',
      JSON.stringify(['newtons-second-law', 'ohms-law']),
    )

    const allStates = getAllStates()
    expect(allStates['newtons-second-law']).toBe('apply')
    expect(allStates['ohms-law']).toBe('apply')
    expect(globalThis.localStorage.getItem('atlas_understood_v1')).toBeNull()
    expect(globalThis.localStorage.getItem('atlas_understanding_v2')).not.toBeNull()
  })

  it('defaults unknown ids to unseen and supports rank comparisons', () => {
    expect(getState('gauss-law')).toBe('unseen')
    expect(isStateAtLeast('derive', 'apply')).toBe(true)
    expect(isStateAtLeast('seen', 'apply')).toBe(false)
    expect(isStateAtMost('seen', 'seen')).toBe(true)
    expect(isStateAtMost('recognize', 'seen')).toBe(false)
  })
})
