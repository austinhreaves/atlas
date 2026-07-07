import { beforeEach, describe, expect, it } from 'vitest'
import {
  PROGRESS_STORAGE_KEY,
  getAllProgress,
  getProgress,
  isProgressAtLeast,
  isProgressAtMost,
  setProgress,
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

describe('progress storage helpers', () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock()
  })

  it('setProgress persists and round-trips using the v1 progress payload', () => {
    setProgress('newtons-second-law', 88)
    setProgress('ohms-law', 34)
    const allProgress = getAllProgress()

    expect(allProgress['newtons-second-law']).toBe(88)
    expect(allProgress['ohms-law']).toBe(34)
    expect(getProgress('newtons-second-law')).toBe(88)

    const stored = JSON.parse(globalThis.localStorage.getItem(PROGRESS_STORAGE_KEY))
    expect(stored.state_schema_version).toBe(1)
    expect(stored.progress_by_id['newtons-second-law']).toBe(88)
  })

  it('migrates legacy v1 understood ids to 100 progress', () => {
    globalThis.localStorage.setItem(
      'atlas_understood_v1',
      JSON.stringify(['newtons-second-law', 'ohms-law']),
    )

    const allProgress = getAllProgress()
    expect(allProgress['newtons-second-law']).toBe(100)
    expect(allProgress['ohms-law']).toBe(100)
    expect(globalThis.localStorage.getItem('atlas_understood_v1')).toBeNull()
    expect(globalThis.localStorage.getItem(PROGRESS_STORAGE_KEY)).not.toBeNull()
  })

  it('migrates legacy v2 understanding states to numeric anchors', () => {
    globalThis.localStorage.setItem(
      'atlas_understanding_v2',
      JSON.stringify({
        'newtons-second-law': 'apply',
        'ohms-law': 'recognize',
        'coulombs-law': 'seen',
      }),
    )

    const allProgress = getAllProgress()
    expect(allProgress['newtons-second-law']).toBe(100)
    expect(allProgress['ohms-law']).toBe(66)
    expect(allProgress['coulombs-law']).toBe(33)
  })

  it('defaults unknown ids to 0 and supports numeric threshold comparisons', () => {
    expect(getProgress('gauss-law')).toBe(0)
    expect(isProgressAtLeast(90, 66)).toBe(true)
    expect(isProgressAtLeast(33, 66)).toBe(false)
    expect(isProgressAtMost(20, 33)).toBe(true)
    expect(isProgressAtMost(70, 33)).toBe(false)
  })
})
