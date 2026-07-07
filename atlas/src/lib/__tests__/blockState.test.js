import { beforeEach, describe, expect, it } from 'vitest'
import {
  BLOCK_STATE_STORAGE_KEY,
  getAllBlockStates,
  getBlockState,
  setBlockState,
} from '../blockState'

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

describe('blockState storage helpers', () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock()
  })

  it('persists and reads state by node and block id', () => {
    setBlockState('node-a', 'block-1', { responseText: 'hello' })
    setBlockState('node-a', 'block-2', { checkedByItemId: { one: true } })

    expect(getBlockState('node-a', 'block-1')).toEqual({ responseText: 'hello' })
    expect(getBlockState('node-a', 'block-2')).toEqual({ checkedByItemId: { one: true } })
  })

  it('ignores malformed stored payloads and recovers to empty map', () => {
    globalThis.localStorage.setItem(BLOCK_STATE_STORAGE_KEY, '{bad-json')
    expect(getAllBlockStates()).toEqual({})
    expect(getBlockState('node-a', 'block-1')).toEqual({})
  })

  it('drops malformed nested entries while preserving valid block states', () => {
    globalThis.localStorage.setItem(
      BLOCK_STATE_STORAGE_KEY,
      JSON.stringify({
        'node-a': {
          'block-1': { responseText: 'ok' },
          'block-2': 'bad-value',
        },
        'node-b': [],
      }),
    )

    expect(getAllBlockStates()).toEqual({
      'node-a': {
        'block-1': { responseText: 'ok' },
      },
    })
  })
})

