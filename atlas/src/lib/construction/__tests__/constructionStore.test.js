import { beforeEach, describe, expect, it } from 'vitest'
import {
  CONSTRUCTION_KEY_PREFIX,
  deleteConstructionSession,
  listConstructionSessions,
  loadConstructionSession,
  saveConstructionSession,
} from '../constructionStore'

function createLocalStorageMock() {
  const store = new Map()
  return {
    get length() {
      return store.size
    },
    key(index) {
      return [...store.keys()][index] ?? null
    },
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

function createSession(id, modifiedAt) {
  return {
    id,
    title: `Session ${id}`,
    created_at: '2026-04-26T08:00:00.000Z',
    modified_at: modifiedAt,
    submission: { submitted: false },
  }
}

describe('constructionStore', () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock()
  })

  it('saves, loads, lists, and deletes construction sessions', () => {
    const session = createSession('session-a', '2026-04-26T09:00:00.000Z')
    saveConstructionSession(session)

    const loaded = loadConstructionSession('session-a')
    expect(loaded?.id).toBe('session-a')

    const listed = listConstructionSessions()
    expect(listed).toEqual([
      {
        id: 'session-a',
        title: 'Session session-a',
        modifiedAt: '2026-04-26T09:00:00.000Z',
        submitted: false,
      },
    ])

    deleteConstructionSession('session-a')
    expect(loadConstructionSession('session-a')).toBeNull()
  })

  it('sorts listed sessions by modifiedAt descending', () => {
    saveConstructionSession(createSession('session-old', '2026-04-25T09:00:00.000Z'))
    saveConstructionSession(createSession('session-new', '2026-04-27T09:00:00.000Z'))

    const listed = listConstructionSessions()
    expect(listed.map((item) => item.id)).toEqual(['session-new', 'session-old'])
  })

  it('skips malformed stored values safely', () => {
    globalThis.localStorage.setItem(`${CONSTRUCTION_KEY_PREFIX}bad_v1`, '{not-json')
    saveConstructionSession(createSession('session-good', '2026-04-27T09:00:00.000Z'))

    const listed = listConstructionSessions()
    expect(listed.map((item) => item.id)).toEqual(['session-good'])
  })
})
