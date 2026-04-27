import { getAllEntities } from '../../data'

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isPublishedEntity(entity) {
  return (entity?.review_state ?? 'published') === 'published'
}

function toInstructorEntry(entry, index) {
  if (!isObject(entry)) {
    console.warn(`[atlas] Skipping malformed instructor manifest entry at index ${index}.`)
    return null
  }

  const file = typeof entry.file === 'string' ? entry.file : null
  const title = typeof entry.title === 'string' ? entry.title : null
  if (!file || !title) {
    console.warn(`[atlas] Skipping malformed instructor manifest entry at index ${index}.`)
    return null
  }

  return {
    id: typeof entry.id === 'string' ? entry.id : `${title}-${index}`,
    title,
    file,
    description: typeof entry.description === 'string' ? entry.description : null,
    topics: Array.isArray(entry.topic_tags)
      ? entry.topic_tags.filter((topic) => typeof topic === 'string')
      : Array.isArray(entry.topics)
        ? entry.topics.filter((topic) => typeof topic === 'string')
        : [],
    node_count: typeof entry.node_count === 'number' ? entry.node_count : null,
    edge_count: typeof entry.edge_count === 'number' ? entry.edge_count : null,
    author: typeof entry.author === 'string' ? entry.author : 'Unknown',
  }
}

export async function fetchInstructorManifest() {
  try {
    const response = await fetch('/library/instructor/manifest.json')
    if (!response.ok) {
      return { entries: [], unavailable: true }
    }

    const payload = await response.json()
    const rawEntries = Array.isArray(payload?.entries)
      ? payload.entries
      : Array.isArray(payload?.maps)
        ? payload.maps
        : []
    const entries = rawEntries
      .map((entry, index) => toInstructorEntry(entry, index))
      .filter((entry) => entry !== null)

    return { entries, unavailable: false }
  } catch {
    return { entries: [], unavailable: true }
  }
}

export async function fetchInstructorMapFile(filePath) {
  const response = await fetch(`/library/instructor/${filePath}`)
  if (!response.ok) {
    throw new Error(`Could not load instructor map file: ${filePath}`)
  }
  return response.json()
}

export function buildTopicCatalog() {
  const entities = getAllEntities().filter(isPublishedEntity)
  const topicRows = new Map()

  for (const entity of entities) {
    const tags = Array.isArray(entity?.tags) ? entity.tags : []
    for (const topic of tags) {
      if (typeof topic !== 'string' || topic.length === 0) {
        continue
      }
      const key = `${entity.domain ?? 'other'}::${topic}`
      if (!topicRows.has(key)) {
        topicRows.set(key, {
          domain: typeof entity.domain === 'string' ? entity.domain : 'other',
          topic,
          nodeCount: 0,
          nodeIds: [],
        })
      }
      const row = topicRows.get(key)
      row.nodeCount += 1
      row.nodeIds.push(entity.id)
    }
  }

  return [...topicRows.values()].sort((left, right) => {
    if (left.domain === right.domain) {
      return left.topic.localeCompare(right.topic)
    }
    return left.domain.localeCompare(right.domain)
  })
}
