import rawTagRegistry from './tags.json'

const TAG_ID_PATTERN = /^[a-z][a-z0-9-]*$/
const ALLOWED_AUDIENCES = ['general', 'phy-114', 'phy-132', 'ap-physics', 'upper-division']
const ALLOWED_REVIEW_STATES = ['draft', 'reviewed', 'published']

function toLabelFromId(id) {
  if (typeof id !== 'string') {
    return ''
  }
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function validateTagEntry(tag, index) {
  const errors = []
  if (!tag || typeof tag !== 'object' || Array.isArray(tag)) {
    return [`tags[${index}] must be an object.`]
  }

  if (typeof tag.id !== 'string' || !TAG_ID_PATTERN.test(tag.id)) {
    errors.push(`tags[${index}].id must match ${TAG_ID_PATTERN}.`)
  }
  if (typeof tag.label !== 'string' || tag.label.trim().length === 0) {
    errors.push(`tags[${index}].label must be a non-empty string.`)
  }
  if (typeof tag.description !== 'string' || tag.description.trim().length === 0) {
    errors.push(`tags[${index}].description must be a non-empty string.`)
  }
  if (!ALLOWED_REVIEW_STATES.includes(tag.review_state)) {
    errors.push(
      `tags[${index}].review_state must be one of: ${ALLOWED_REVIEW_STATES.join(', ')}`,
    )
  }

  if ('audience_relevance' in tag) {
    if (!Array.isArray(tag.audience_relevance)) {
      errors.push(`tags[${index}].audience_relevance must be an array when provided.`)
    } else {
      tag.audience_relevance.forEach((audience, audienceIndex) => {
        if (!ALLOWED_AUDIENCES.includes(audience)) {
          errors.push(
            `tags[${index}].audience_relevance[${audienceIndex}] must be one of: ${ALLOWED_AUDIENCES.join(', ')}`,
          )
        }
      })
    }
  }

  return errors
}

export function validateTagRegistry(registry) {
  const errors = []
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    return ['Tag registry must be an object with a tags array.']
  }

  if (!Array.isArray(registry.tags)) {
    return ['Tag registry must contain a tags array.']
  }

  const seenIds = new Set()
  registry.tags.forEach((tag, index) => {
    errors.push(...validateTagEntry(tag, index))
    if (typeof tag?.id === 'string') {
      if (seenIds.has(tag.id)) {
        errors.push(`tags[].id values must be unique: ${tag.id}`)
      }
      seenIds.add(tag.id)
    }
  })
  return errors
}

function normalizeTagEntry(tag) {
  return {
    id: tag.id,
    label: tag.label,
    description: tag.description,
    audience_relevance: Array.isArray(tag.audience_relevance) ? [...tag.audience_relevance] : [],
    review_state: tag.review_state,
  }
}

function buildTagRegistrySnapshot(registry) {
  const errors = validateTagRegistry(registry)
  if (errors.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(
        '[atlas] tags registry invalid; proceeding with no configured tags.',
        errors.join(' | '),
      )
    }
    return {
      tags: [],
      tagById: new Map(),
      configured: false,
      validationErrors: errors,
    }
  }

  const tags = registry.tags.map(normalizeTagEntry)
  const tagById = new Map(tags.map((tag) => [tag.id, tag]))
  return {
    tags,
    tagById,
    configured: true,
    validationErrors: [],
  }
}

const registrySnapshot = buildTagRegistrySnapshot(rawTagRegistry)

export function getTagRegistry() {
  return registrySnapshot.tags
}

export function getTagById(tagId) {
  return registrySnapshot.tagById.get(tagId) ?? null
}

export function getVisibleTagRegistry(includeDraftContent = false) {
  return registrySnapshot.tags.filter((tag) => {
    if (tag.review_state === 'published') {
      return true
    }
    return includeDraftContent && (tag.review_state === 'draft' || tag.review_state === 'reviewed')
  })
}

export function getTagValidationContext() {
  return {
    enforceMembership: registrySnapshot.configured,
    tagIds: new Set(registrySnapshot.tags.map((tag) => tag.id)),
  }
}

export function getTagLabel(tagId) {
  return getTagById(tagId)?.label ?? toLabelFromId(tagId)
}

export function getTagDescription(tagId) {
  return getTagById(tagId)?.description ?? ''
}

export function isTagRegistryConfigured() {
  return registrySnapshot.configured
}

export { ALLOWED_AUDIENCES, ALLOWED_REVIEW_STATES, TAG_ID_PATTERN }
