import { getAllEntities } from '../../data'
import { resolveRenderPosition } from '../resolveRenderPosition'
import { createConstructionSession } from './constructionFile'
import { validateConstructionFile } from './validateConstructionFile'

function nowIso() {
  return new Date().toISOString()
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getPublishedEntities() {
  return getAllEntities().filter((entity) => (entity?.review_state ?? 'published') === 'published')
}

export function buildSessionFromInstructorMap(mapFile, manifestEntry = null) {
  const parsed = clone(mapFile)
  const validated = validateConstructionFile(parsed)
  if (validated.errors.length > 0) {
    throw new Error(`Instructor map validation failed: ${validated.errors.join(' | ')}`)
  }

  const session = createConstructionSession({
    title: typeof validated.file?.title === 'string' ? validated.file.title : manifestEntry?.title ?? 'Library map',
    librarySource: {
      type: 'instructor-map',
      topic: Array.isArray(manifestEntry?.topic_tags)
        ? manifestEntry.topic_tags[0] ?? null
        : Array.isArray(manifestEntry?.topics)
          ? manifestEntry.topics[0] ?? null
          : null,
      loaded_at: nowIso(),
    },
  })

  return {
    ...session,
    title: typeof validated.file?.title === 'string' ? validated.file.title : session.title,
    atlas_corpus_hash: validated.file?.atlas_corpus_hash ?? null,
    atlas_corpus_version: validated.file?.atlas_corpus_version ?? null,
    authors: Array.isArray(validated.file?.authors) ? validated.file.authors : [],
    exporter: isObject(validated.file?.exporter) ? validated.file.exporter : { role: 'instructor' },
    student_nodes: Array.isArray(validated.file?.student_nodes) ? validated.file.student_nodes : [],
    positions: isObject(validated.file?.positions) ? validated.file.positions : {},
    edges: Array.isArray(validated.file?.edges) ? validated.file.edges : [],
    annotations: Array.isArray(validated.file?.annotations) ? validated.file.annotations : [],
    canonical_nodes: Array.isArray(validated.file?.canonical_nodes) ? validated.file.canonical_nodes : [],
    submission: {
      submitted: false,
      submitted_at: null,
      self_review_complete: false,
      peer_reviews: [],
    },
    modified_at: nowIso(),
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function buildTopicPositions(topic) {
  const positions = {}
  const entities = getPublishedEntities()
  for (const entity of entities) {
    const tags = Array.isArray(entity?.tags) ? entity.tags : []
    if (!tags.includes(topic)) {
      continue
    }

    positions[entity.id] = resolveRenderPosition({
      entityId: entity.id,
      userPositions: {},
      canonicalPosition: entity.position ?? null,
      computedPositions: {},
      fallbackPosition: { x: 0, y: 0 },
      warnOnMissingComputed: false,
    })
  }
  return positions
}

export function buildSessionFromTopicSubgraph(topic) {
  const session = createConstructionSession({
    title: `Topic subgraph: ${topic}`,
    librarySource: {
      type: 'topic-subgraph',
      topic,
      loaded_at: nowIso(),
    },
  })
  const positions = buildTopicPositions(topic)
  return {
    ...session,
    positions,
    canonical_nodes: Object.keys(positions),
    edges: [],
    modified_at: nowIso(),
  }
}

export function buildSessionFromBlankTemplate(topic) {
  return {
    ...createConstructionSession({
      title: `Blank template: ${topic}`,
      librarySource: {
        type: 'blank-template',
        topic,
        loaded_at: nowIso(),
      },
    }),
    edges: [],
    positions: {},
    canonical_nodes: [],
    modified_at: nowIso(),
  }
}
