import { describe, expect, it } from 'vitest'
import { getAllEntities } from '../../../data'
import { validateConstructionFile } from '../validateConstructionFile'

function createValidFile() {
  const [first, second] = getAllEntities()

  return {
    format: 'atlas-concept-map',
    format_version: 2,
    id: 'session-test',
    title: 'Valid map',
    created_at: '2026-04-26T09:00:00.000Z',
    modified_at: '2026-04-26T10:00:00.000Z',
    exported_at: null,
    atlas_corpus_hash: `sha256:${'a'.repeat(64)}`,
    atlas_corpus_version: 'v3.0.0',
    library_source: null,
    authors: [{ name: 'Student A', role: 'primary' }],
    exporter: { role: 'student' },
    canonical_nodes: [first.id, second.id],
    student_nodes: [{ id: 'student-1', title: 'Student node', content: { notes: '' } }],
    positions: {
      [first.id]: { x: 1, y: 2 },
      [second.id]: { x: 3, y: 4 },
      'student-1': { x: 5, y: 6 },
    },
    edges: [
      {
        id: 'edge-1',
        source: first.id,
        target: second.id,
        explanation: 'Connects canonical concepts',
        explanation_filled: true,
        created_at: '2026-04-26T10:10:00.000Z',
      },
      {
        id: 'edge-2',
        source: second.id,
        target: 'student-1',
        explanation: null,
        explanation_filled: false,
        created_at: '2026-04-26T10:11:00.000Z',
      },
    ],
    annotations: [{ id: 'ann-1', target: { kind: 'edge', id: 'edge-1' } }],
    submission: {
      submitted: false,
      submitted_at: null,
      self_review_complete: false,
      peer_reviews: [],
    },
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

describe('validateConstructionFile', () => {
  it('returns empty errors and warnings for a valid file', () => {
    const result = validateConstructionFile(createValidFile(), {
      atlasCorpusHash: `sha256:${'a'.repeat(64)}`,
    })
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })

  it('flags unrecognized format/version as an error', () => {
    const file = createValidFile()
    file.format_version = 3
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('format / format_version unrecognized')
  })

  it('accepts valid authors with exactly one primary', () => {
    const file = createValidFile()
    file.authors.push({ name: 'Student B', role: 'collaborator' })
    const result = validateConstructionFile(file)
    expect(result.errors).not.toContain('authors empty or no primary')
  })

  it('flags empty authors or missing primary as an error', () => {
    const file = createValidFile()
    file.authors = [{ name: 'Student A', role: 'collaborator' }]
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('authors empty or no primary')
  })

  it('accepts valid student node ids and titles', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.errors).not.toContain('student_nodes[].id not unique or wrong prefix')
    expect(result.errors).not.toContain('student_nodes[].title empty')
  })

  it('flags non-unique or wrong-prefix student ids as an error', () => {
    const file = createValidFile()
    file.student_nodes = [
      { id: 'student-1', title: 'A', content: { notes: '' } },
      { id: 'bad-id', title: 'B', content: { notes: '' } },
    ]
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('student_nodes[].id not unique or wrong prefix')
  })

  it('flags empty student title as an error', () => {
    const file = createValidFile()
    file.student_nodes[0].title = '   '
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('student_nodes[].title empty')
  })

  it('accepts positions that all map to known canonical or student ids', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.errors.some((error) => error.startsWith('positions contains unknown node id:'))).toBe(false)
  })

  it('flags orphan positions as an error', () => {
    const file = createValidFile()
    file.positions['student-unknown'] = { x: 9, y: 9 }
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('positions contains unknown node id: student-unknown')
  })

  it('accepts edges whose source and target are in the node set', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.errors).not.toContain('edges[].source or edges[].target not in node set')
  })

  it('flags edges with unknown source or target as an error', () => {
    const file = createValidFile()
    file.edges[0].target = 'unknown-node'
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('edges[].source or edges[].target not in node set')
  })

  it('accepts non-self-loop edges', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.errors).not.toContain('self-loop edge (source === target)')
  })

  it('flags self-loop edges as an error', () => {
    const file = createValidFile()
    file.edges[0].target = file.edges[0].source
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('self-loop edge (source === target)')
  })

  it('accepts one edge per unordered pair', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.errors).not.toContain('duplicate edge (same unordered node pair)')
  })

  it('flags duplicate unordered pairs as an error', () => {
    const file = createValidFile()
    file.edges.push(clone(file.edges[0]))
    file.edges[2].id = 'edge-3'
    file.edges[2].source = file.edges[0].target
    file.edges[2].target = file.edges[0].source
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('duplicate edge (same unordered node pair)')
  })

  it('accepts resolvable annotation targets', () => {
    const file = createValidFile()
    file.annotations.push({ id: 'ann-map', target: { kind: 'map', id: null } })
    const result = validateConstructionFile(file)
    expect(result.errors).not.toContain('annotations[].target.id does not resolve')
  })

  it('flags unresolved annotation targets as an error', () => {
    const file = createValidFile()
    file.annotations = [{ id: 'ann-404', target: { kind: 'edge', id: 'edge-missing' } }]
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('annotations[].target.id does not resolve')
  })

  it('accepts submitted=false without timestamp', () => {
    const file = createValidFile()
    file.submission.submitted = false
    file.submission.submitted_at = null
    const result = validateConstructionFile(file)
    expect(result.errors).not.toContain('submission.submitted: true without valid timestamp')
  })

  it('flags submitted=true without valid timestamp as an error', () => {
    const file = createValidFile()
    file.submission.submitted = true
    file.submission.submitted_at = 'not-an-iso-date'
    const result = validateConstructionFile(file)
    expect(result.errors).toContain('submission.submitted: true without valid timestamp')
  })

  it('does not warn when corpus hash matches expected hash', () => {
    const file = createValidFile()
    const result = validateConstructionFile(file, {
      atlasCorpusHash: file.atlas_corpus_hash,
    })
    expect(result.warnings).not.toContain('atlas_corpus_hash mismatch')
  })

  it('warns when corpus hash mismatches expected hash', () => {
    const file = createValidFile()
    const result = validateConstructionFile(file, {
      atlasCorpusHash: `sha256:${'b'.repeat(64)}`,
    })
    expect(result.warnings).toContain('atlas_corpus_hash mismatch')
  })

  it('does not warn when canonical nodes align to positions', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.warnings).not.toContain('canonical_nodes diverges from positions keys')
  })

  it('warns and auto-corrects canonical nodes diverging from positions keys', () => {
    const file = createValidFile()
    file.canonical_nodes = ['not-in-positions']
    const result = validateConstructionFile(file)
    expect(result.warnings).toContain('canonical_nodes diverges from positions keys')
    expect(result.file.canonical_nodes).not.toContain('not-in-positions')
  })

  it('does not warn when explanation_filled matches explanation content', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.warnings).not.toContain('explanation_filled inconsistent with explanation')
  })

  it('warns and auto-corrects explanation_filled inconsistency', () => {
    const file = createValidFile()
    file.edges[1].explanation = 'Now filled'
    file.edges[1].explanation_filled = false
    const result = validateConstructionFile(file)
    expect(result.warnings).toContain('explanation_filled inconsistent with explanation')
    expect(result.file.edges[1].explanation_filled).toBe(true)
  })

  it('does not warn when canonical nodes exist in corpus', () => {
    const result = validateConstructionFile(createValidFile())
    expect(result.warnings.some((warning) => warning.startsWith('orphaned canonical node ID'))).toBe(false)
  })

  it('warns when a canonical node id is not in the current corpus', () => {
    const file = createValidFile()
    file.positions['orphan-node-id'] = { x: 50, y: 70 }
    const result = validateConstructionFile(file)
    expect(result.warnings).toContain('orphaned canonical node ID (not in current corpus): orphan-node-id')
  })
})
