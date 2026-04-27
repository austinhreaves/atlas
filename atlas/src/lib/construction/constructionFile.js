const CONSTRUCTION_FORMAT = 'atlas-concept-map'
const CONSTRUCTION_FORMAT_VERSION = 2
const DEFAULT_TITLE = 'Untitled concept map'

function createUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function getIsoTimestamp() {
  return new Date().toISOString()
}

function toNullableString(value) {
  return typeof value === 'string' ? value : null
}

function toLibrarySource(value) {
  if (!value || typeof value !== 'object') {
    return null
  }

  const next = {
    type: toNullableString(value.type),
    topic: toNullableString(value.topic),
    loaded_at: toNullableString(value.loaded_at) ?? getIsoTimestamp(),
  }

  if (!next.type) {
    return null
  }

  return next
}

function toPositionMap(input) {
  if (!input || typeof input !== 'object') {
    return {}
  }

  return Object.entries(input).reduce((next, [id, value]) => {
    if (typeof id === 'string' && typeof value?.x === 'number' && typeof value?.y === 'number') {
      next[id] = { x: value.x, y: value.y }
    }
    return next
  }, {})
}

function deriveCanonicalNodes(positions) {
  return Object.keys(positions).filter((id) => !id.startsWith('student-'))
}

export function computeExplanationFilled(explanation) {
  return typeof explanation === 'string' && explanation.trim().length > 0
}

export function createConstructionSession({ title, librarySource } = {}) {
  const timestamp = getIsoTimestamp()

  return {
    format: CONSTRUCTION_FORMAT,
    format_version: CONSTRUCTION_FORMAT_VERSION,
    id: `session-${createUuid()}`,
    title: typeof title === 'string' && title.trim() ? title.trim() : DEFAULT_TITLE,
    created_at: timestamp,
    modified_at: timestamp,
    exported_at: null,
    atlas_corpus_hash: null,
    atlas_corpus_version: null,
    library_source: toLibrarySource(librarySource),
    authors: [],
    exporter: { role: 'student' },
    canonical_nodes: [],
    student_nodes: [],
    positions: {},
    edges: [],
    annotations: [],
    submission: {
      submitted: false,
      submitted_at: null,
      self_review_complete: false,
      peer_reviews: [],
    },
  }
}

export function serializeConstructionFile(session) {
  const now = getIsoTimestamp()
  const parsed = session && typeof session === 'object' ? JSON.parse(JSON.stringify(session)) : createConstructionSession()
  const positions = toPositionMap(parsed.positions)

  return {
    ...parsed,
    positions,
    canonical_nodes: deriveCanonicalNodes(positions),
    exported_at: now,
  }
}

export function deserializeConstructionFile(raw) {
  return JSON.parse(raw)
}
