import { beforeEach, describe, expect, it } from 'vitest'
import { getUnderstood, isUnderstood, setUnderstood } from '../understanding'

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

  it('setUnderstood persists and round-trips via localStorage', () => {
    setUnderstood('newtons-second-law', true)
    const understood = getUnderstood()

    expect(understood.has('newtons-second-law')).toBe(true)
  })

  it('multiple setUnderstood calls accumulate understood ids', () => {
    setUnderstood('newtons-second-law', true)
    setUnderstood('ohms-law', true)
    const understood = getUnderstood()

    expect(understood.has('newtons-second-law')).toBe(true)
    expect(understood.has('ohms-law')).toBe(true)
  })

  it('isUnderstood returns false for never-set ids', () => {
    expect(isUnderstood('gauss-law')).toBe(false)
  })
})
