import { beforeEach, describe, expect, it } from 'vitest'
import {
  USER_LAYOUT_STORAGE_KEY,
  buildLayoutExportPayload,
  computeCorpusHash,
  createUserLayoutStore,
  getUserLayoutStore,
  parseLayoutImportPayload,
  saveUserLayoutStore,
  validateLayoutImportPayload,
} from '../userLayout'

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

describe('user layout helpers', () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock()
  })

  it('exports and imports layout payload round-trip', () => {
    const store = createUserLayoutStore({
      positions: {
        'newtons-second-law': { x: 120.5, y: -340.2 },
        'ohms-law': { x: 480.0, y: 220.0 },
      },
      atlasCorpusHash: 'sha256:abc123',
      userNote: null,
      savedAt: '2026-04-25T12:34:56.000Z',
    })
    saveUserLayoutStore(store)

    const reloaded = getUserLayoutStore()
    const payload = buildLayoutExportPayload({
      positions: reloaded.positions,
      atlasCorpusHash: reloaded.metadata.atlas_corpus_hash,
      atlasCorpusVersion: 'v3.0.0',
      userNote: reloaded.metadata.user_note,
      exportedAt: '2026-04-25T13:34:56.000Z',
    })

    const parsed = parseLayoutImportPayload(JSON.stringify(payload))
    const validated = validateLayoutImportPayload(parsed)

    expect(validated.valid).toBe(true)
    expect(validated.positions).toEqual(store.positions)
    expect(validated.atlasCorpusHash).toBe('sha256:abc123')
    expect(validated.userNote).toBe(null)
  })

  it('detects corpus hash mismatch during import comparison', () => {
    const payload = buildLayoutExportPayload({
      positions: { node: { x: 1, y: 2 } },
      atlasCorpusHash: 'sha256:incoming',
      atlasCorpusVersion: 'v3.0.0',
    })
    const validated = validateLayoutImportPayload(payload)

    expect(validated.valid).toBe(true)
    expect(validated.atlasCorpusHash).not.toBe('sha256:current')
  })

  it('rejects invalid import payload structure', () => {
    const validated = validateLayoutImportPayload({
      format: 'atlas-layout',
      format_version: 1,
      positions: { bad: { x: '1', y: 2 } },
    })

    expect(validated.valid).toBe(false)
    expect(validated.reason).toContain('invalid position')
  })

  it('computes deterministic corpus hash from entity ids', async () => {
    const first = await computeCorpusHash(['b', 'a', 'c'])
    const second = await computeCorpusHash(['c', 'b', 'a'])
    expect(first).toBe(second)
    expect(first.startsWith('sha256:')).toBe(true)
  })

  it('stores to atlas_user_layout_v1 key', () => {
    const store = createUserLayoutStore({
      positions: { a: { x: 1, y: 2 } },
      atlasCorpusHash: 'sha256:test',
    })
    saveUserLayoutStore(store)

    expect(globalThis.localStorage.getItem(USER_LAYOUT_STORAGE_KEY)).not.toBeNull()
  })
})
