import { describe, expect, it, vi } from 'vitest'
import * as data from '../../../data'
import { buildTopicCatalog, fetchInstructorManifest } from '../libraryCatalog'

describe('libraryCatalog', () => {
  it('parses instructor manifest and skips malformed entries', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          manifest_version: 1,
          entries: [
            { title: 'Valid', file: 'valid.atlas-map.json', id: 'v1', topic_tags: ['topic-a'] },
            { id: 'broken' },
          ],
        }),
      }),
    )
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await fetchInstructorManifest()
    expect(result.unavailable).toBe(false)
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0].title).toBe('Valid')
    expect(result.entries[0].topics).toEqual(['topic-a'])
    expect(warnSpy).toHaveBeenCalled()
  })

  it('supports legacy manifest shape with maps/topics keys', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          maps: [{ title: 'Legacy', file: 'legacy.atlas-map.json', topics: ['legacy-topic'] }],
        }),
      }),
    )
    const result = await fetchInstructorManifest()
    expect(result.unavailable).toBe(false)
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0].topics).toEqual(['legacy-topic'])
  })

  it('returns unavailable when manifest fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    const result = await fetchInstructorManifest()
    expect(result).toEqual({ entries: [], unavailable: true })
  })

  it('builds topic catalog from published entities', () => {
    const spy = vi.spyOn(data, 'getAllEntities').mockReturnValue([
      { id: 'a', tags: ['topic-a'], domain: 'mechanics', review_state: 'published' },
      { id: 'b', tags: ['topic-a', 'topic-b'], domain: 'mechanics', review_state: 'published' },
      { id: 'c', tags: ['topic-c'], domain: 'mechanics', review_state: 'draft' },
    ])
    const rows = buildTopicCatalog()
    expect(rows.some((row) => row.topic === 'topic-a' && row.nodeCount === 2)).toBe(true)
    expect(rows.some((row) => row.topic === 'topic-c')).toBe(false)
    spy.mockRestore()
  })
})
