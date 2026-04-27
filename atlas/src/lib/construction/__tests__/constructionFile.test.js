import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  computeExplanationFilled,
  createConstructionSession,
  deserializeConstructionFile,
  serializeConstructionFile,
} from '../constructionFile'

describe('constructionFile helpers', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a default construction session', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-26T10:00:00.000Z'))

    const session = createConstructionSession({
      title: 'RC Circuits - Week 4',
      librarySource: {
        type: 'topic-subgraph',
        topic: 'rc-circuits',
        loaded_at: '2026-04-26T09:30:00.000Z',
      },
    })

    expect(session.format).toBe('atlas-concept-map')
    expect(session.format_version).toBe(2)
    expect(session.id.startsWith('session-')).toBe(true)
    expect(session.title).toBe('RC Circuits - Week 4')
    expect(session.library_source).toEqual({
      type: 'topic-subgraph',
      topic: 'rc-circuits',
      loaded_at: '2026-04-26T09:30:00.000Z',
    })
    expect(session.canonical_nodes).toEqual([])
    expect(session.submission).toEqual({
      submitted: false,
      submitted_at: null,
      self_review_complete: false,
      peer_reviews: [],
    })
  })

  it('serializes and deserializes construction session round-trip', () => {
    const session = createConstructionSession({
      title: 'Session T1',
      librarySource: { type: 'blank-template', topic: null, loaded_at: '2026-04-26T08:00:00.000Z' },
    })

    session.authors = [{ name: 'Student A', role: 'primary' }]
    session.positions = {
      'ohms-law': { x: 100, y: 200 },
      capacitance: { x: 220, y: 260 },
      resistance: { x: 320, y: 320 },
      'student-a1': { x: 140, y: 80 },
      'student-a2': { x: 390, y: 120 },
    }
    session.student_nodes = [
      {
        id: 'student-a1',
        title: 'RC Time Constant',
        created_at: '2026-04-26T10:15:00.000Z',
        modified_at: '2026-04-26T11:00:00.000Z',
        content: {
          notes: 'tau = RC',
          formula: '\\tau = RC',
          description: null,
          simplifying_assumption: null,
          applicability: null,
          misconception: null,
        },
        color: null,
      },
      {
        id: 'student-a2',
        title: 'Charging Curve',
        created_at: '2026-04-26T10:16:00.000Z',
        modified_at: '2026-04-26T11:01:00.000Z',
        content: {
          notes: 'Exponential rise',
          formula: null,
          description: null,
          simplifying_assumption: null,
          applicability: null,
          misconception: null,
        },
        color: null,
      },
    ]
    session.edges = [
      { id: 'edge-1', source: 'ohms-law', target: 'capacitance', explanation: "Ohm's Law drives current.", explanation_filled: true, created_at: '2026-04-26T10:05:00.000Z' },
      { id: 'edge-2', source: 'capacitance', target: 'resistance', explanation: 'RC constant relation.', explanation_filled: true, created_at: '2026-04-26T10:06:00.000Z' },
      { id: 'edge-3', source: 'resistance', target: 'student-a1', explanation: null, explanation_filled: false, created_at: '2026-04-26T10:07:00.000Z' },
      { id: 'edge-4', source: 'student-a1', target: 'student-a2', explanation: '', explanation_filled: false, created_at: '2026-04-26T10:08:00.000Z' },
    ]

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-26T12:00:00.000Z'))
    const serialized = serializeConstructionFile(session)
    const roundTripped = deserializeConstructionFile(JSON.stringify(serialized))

    expect(roundTripped).toEqual(serialized)
    expect(roundTripped.canonical_nodes).toEqual(['ohms-law', 'capacitance', 'resistance'])
    expect(roundTripped.exported_at).toBe('2026-04-26T12:00:00.000Z')
  })

  it('throws on invalid JSON during deserialize', () => {
    expect(() => deserializeConstructionFile('{not json')).toThrow()
  })

  it('computes explanation filled based on non-empty text', () => {
    expect(computeExplanationFilled('A link explanation')).toBe(true)
    expect(computeExplanationFilled('')).toBe(false)
    expect(computeExplanationFilled('   ')).toBe(false)
    expect(computeExplanationFilled(null)).toBe(false)
  })
})
