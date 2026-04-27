import rawSubjectRegistry from './subjects.json'

const SUBJECT_ID_PATTERN = /^[a-z][a-z0-9-]*$/
const ALLOWED_REVIEW_STATES = ['draft', 'reviewed', 'published']

function validateSubjectEntry(subject, index) {
  const errors = []
  if (!subject || typeof subject !== 'object' || Array.isArray(subject)) {
    return [`subjects[${index}] must be an object.`]
  }

  if (typeof subject.id !== 'string' || !SUBJECT_ID_PATTERN.test(subject.id)) {
    errors.push(`subjects[${index}].id must match ${SUBJECT_ID_PATTERN}.`)
  }
  if (typeof subject.label !== 'string' || subject.label.trim().length === 0) {
    errors.push(`subjects[${index}].label must be a non-empty string.`)
  }
  if (typeof subject.description !== 'string' || subject.description.trim().length === 0) {
    errors.push(`subjects[${index}].description must be a non-empty string.`)
  }
  if (!ALLOWED_REVIEW_STATES.includes(subject.review_state)) {
    errors.push(
      `subjects[${index}].review_state must be one of: ${ALLOWED_REVIEW_STATES.join(', ')}`,
    )
  }

  return errors
}

export function validateSubjectRegistry(registry) {
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    return ['Subject registry must be an object with a subjects array.']
  }

  if (!Array.isArray(registry.subjects)) {
    return ['Subject registry must contain a subjects array.']
  }

  const errors = []
  const seenIds = new Set()
  registry.subjects.forEach((subject, index) => {
    errors.push(...validateSubjectEntry(subject, index))
    if (typeof subject?.id === 'string') {
      if (seenIds.has(subject.id)) {
        errors.push(`subjects[].id values must be unique: ${subject.id}`)
      }
      seenIds.add(subject.id)
    }
  })
  return errors
}

function buildSubjectRegistrySnapshot(registry) {
  const errors = validateSubjectRegistry(registry)
  if (errors.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(
        '[atlas] subjects registry invalid; proceeding with no configured subjects.',
        errors.join(' | '),
      )
    }
    return {
      subjects: [],
      subjectById: new Map(),
      configured: false,
      validationErrors: errors,
    }
  }

  const subjects = registry.subjects.map((subject) => ({
    id: subject.id,
    label: subject.label,
    description: subject.description,
    review_state: subject.review_state,
  }))
  return {
    subjects,
    subjectById: new Map(subjects.map((subject) => [subject.id, subject])),
    configured: true,
    validationErrors: [],
  }
}

const registrySnapshot = buildSubjectRegistrySnapshot(rawSubjectRegistry)

export function getSubjectRegistry() {
  return registrySnapshot.subjects
}

export function getVisibleSubjectRegistry(includeDraftContent = false) {
  return registrySnapshot.subjects.filter((subject) => {
    if (subject.review_state === 'published') {
      return true
    }
    return (
      includeDraftContent &&
      (subject.review_state === 'draft' || subject.review_state === 'reviewed')
    )
  })
}

export function getSubjectById(subjectId) {
  return registrySnapshot.subjectById.get(subjectId) ?? null
}

export function getSubjectValidationContext() {
  const publishedSubjectIds = new Set(
    registrySnapshot.subjects
      .filter((subject) => subject.review_state === 'published')
      .map((subject) => subject.id),
  )
  return {
    enforceMembership: registrySnapshot.configured,
    subjectIds: publishedSubjectIds,
  }
}

export function getSubjectLabel(subjectId) {
  return getSubjectById(subjectId)?.label ?? subjectId
}

export function getSubjectDescription(subjectId) {
  return getSubjectById(subjectId)?.description ?? ''
}

export { SUBJECT_ID_PATTERN, ALLOWED_REVIEW_STATES }
