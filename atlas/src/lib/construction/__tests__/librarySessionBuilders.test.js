import { describe, expect, it, vi } from 'vitest'
import * as data from '../../../data'
import {
  buildSessionFromBlankTemplate,
  buildSessionFromInstructorMap,
  buildSessionFromTopicSubgraph,
} from '../librarySessionBuilders'

describe('librarySessionBuilders', () => {
  it('builds instructor map session with a fresh session identity', () => {
    const source = {
      format: 'atlas-concept-map',
      format_version: 2,
      id: 'original-id',
      title: 'Library Source',
      created_at: '2026-04-26T08:00:00.000Z',
      modified_at: '2026-04-26T08:00:00.000Z',
      atlas_corpus_hash: `sha256:${'a'.repeat(64)}`,
      authors: [{ name: 'Instructor', role: 'primary' }],
      canonical_nodes: [],
      student_nodes: [],
      positions: {},
      edges: [],
      annotations: [],
      submission: { submitted: false, submitted_at: null, self_review_complete: false, peer_reviews: [] },
    }
    const session = buildSessionFromInstructorMap(source, { topic_tags: ['topic-a'] })
    expect(session.id).not.toBe('original-id')
    expect(session.library_source?.type).toBe('instructor-map')
    expect(session.library_source?.topic).toBe('topic-a')
  })

  it('builds topic subgraph session with canonical positions and no edges', () => {
    const spy = vi.spyOn(data, 'getAllEntities').mockReturnValue([
      { id: 'node-1', tags: ['topic-a'], domain: 'mechanics', position: { x: 10, y: 20 }, review_state: 'published' },
      { id: 'node-2', tags: ['topic-b'], domain: 'mechanics', position: { x: 30, y: 40 }, review_state: 'published' },
    ])
    const session = buildSessionFromTopicSubgraph('topic-a')
    expect(session.canonical_nodes).toEqual(['node-1'])
    expect(session.positions['node-1']).toEqual({ x: 10, y: 20 })
    expect(session.edges).toEqual([])
    spy.mockRestore()
  })

  it('builds blank template session with no placed nodes', () => {
    const session = buildSessionFromBlankTemplate('topic-a')
    expect(session.positions).toEqual({})
    expect(session.canonical_nodes).toEqual([])
    expect(session.library_source?.type).toBe('blank-template')
  })

  it('documents fallback position for nodes without a canonical position', () => {
    const spy = vi.spyOn(data, 'getAllEntities').mockReturnValue([
      { id: 'no-pos-node', tags: ['topic-fallback'], domain: 'mechanics', review_state: 'published' },
    ])
    const session = buildSessionFromTopicSubgraph('topic-fallback')
    // resolveRenderPosition falls back to { x: 0, y: 0 } when no canonical or computed position is available.
    expect(session.positions['no-pos-node']).toEqual({ x: 0, y: 0 })
    spy.mockRestore()
  })
})
