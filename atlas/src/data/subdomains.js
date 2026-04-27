import rawSubdomainRegistry from './sub-domains.json'

const SUBDOMAIN_ID_PATTERN = /^[a-z][a-z0-9-]*$/
const DOMAIN_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
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

function validateSubdomainEntry(subDomain, index) {
  const errors = []
  if (!subDomain || typeof subDomain !== 'object' || Array.isArray(subDomain)) {
    return [`sub_domains[${index}] must be an object.`]
  }

  if (typeof subDomain.id !== 'string' || !SUBDOMAIN_ID_PATTERN.test(subDomain.id)) {
    errors.push(`sub_domains[${index}].id must match ${SUBDOMAIN_ID_PATTERN}.`)
  }
  if (typeof subDomain.label !== 'string' || subDomain.label.trim().length === 0) {
    errors.push(`sub_domains[${index}].label must be a non-empty string.`)
  }
  if (typeof subDomain.description !== 'string' || subDomain.description.trim().length === 0) {
    errors.push(`sub_domains[${index}].description must be a non-empty string.`)
  }
  if (!ALLOWED_REVIEW_STATES.includes(subDomain.review_state)) {
    errors.push(
      `sub_domains[${index}].review_state must be one of: ${ALLOWED_REVIEW_STATES.join(', ')}`,
    )
  }

  if ('audience_relevance' in subDomain) {
    if (!Array.isArray(subDomain.audience_relevance)) {
      errors.push(`sub_domains[${index}].audience_relevance must be an array when provided.`)
    } else {
      subDomain.audience_relevance.forEach((audience, audienceIndex) => {
        if (!ALLOWED_AUDIENCES.includes(audience)) {
          errors.push(
            `sub_domains[${index}].audience_relevance[${audienceIndex}] must be one of: ${ALLOWED_AUDIENCES.join(', ')}`,
          )
        }
      })
    }
  }

  if ('domains' in subDomain) {
    if (!Array.isArray(subDomain.domains)) {
      errors.push(`sub_domains[${index}].domains must be an array when provided.`)
    } else {
      subDomain.domains.forEach((domain, domainIndex) => {
        if (typeof domain !== 'string' || !DOMAIN_ID_PATTERN.test(domain)) {
          errors.push(
            `sub_domains[${index}].domains[${domainIndex}] must match ${DOMAIN_ID_PATTERN}.`,
          )
        }
      })
    }
  }

  return errors
}

export function validateSubdomainRegistry(registry) {
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    return ['Sub-domain registry must be an object with a sub_domains array.']
  }

  if (!Array.isArray(registry.sub_domains)) {
    return ['Sub-domain registry must contain a sub_domains array.']
  }

  const errors = []
  const seenIds = new Set()
  registry.sub_domains.forEach((subDomain, index) => {
    errors.push(...validateSubdomainEntry(subDomain, index))
    if (typeof subDomain?.id === 'string') {
      if (seenIds.has(subDomain.id)) {
        errors.push(`sub_domains[].id values must be unique: ${subDomain.id}`)
      }
      seenIds.add(subDomain.id)
    }
  })
  return errors
}

function normalizeSubdomainEntry(subDomain) {
  return {
    id: subDomain.id,
    label: subDomain.label,
    description: subDomain.description,
    audience_relevance: Array.isArray(subDomain.audience_relevance)
      ? [...subDomain.audience_relevance]
      : [],
    review_state: subDomain.review_state,
    domains: Array.isArray(subDomain.domains) ? [...subDomain.domains] : [],
  }
}

function buildSubdomainRegistrySnapshot(registry) {
  const errors = validateSubdomainRegistry(registry)
  if (errors.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(
        '[atlas] sub-domains registry invalid; proceeding with no configured sub-domains.',
        errors.join(' | '),
      )
    }
    return {
      subDomains: [],
      subDomainById: new Map(),
      configured: false,
      validationErrors: errors,
    }
  }

  const subDomains = registry.sub_domains.map(normalizeSubdomainEntry)
  return {
    subDomains,
    subDomainById: new Map(subDomains.map((subDomain) => [subDomain.id, subDomain])),
    configured: true,
    validationErrors: [],
  }
}

const registrySnapshot = buildSubdomainRegistrySnapshot(rawSubdomainRegistry)

export function getSubdomainRegistry() {
  return registrySnapshot.subDomains
}

export function getVisibleSubdomainRegistry(includeDraftContent = false) {
  return registrySnapshot.subDomains.filter((subDomain) => {
    if (subDomain.review_state === 'published') {
      return true
    }
    return (
      includeDraftContent &&
      (subDomain.review_state === 'draft' || subDomain.review_state === 'reviewed')
    )
  })
}

export function getSubdomainById(subdomainId) {
  return registrySnapshot.subDomainById.get(subdomainId) ?? null
}

export function getSubdomainValidationContext() {
  return {
    enforceMembership: registrySnapshot.configured,
    subdomainIds: new Set(registrySnapshot.subDomains.map((subDomain) => subDomain.id)),
    subdomainById: registrySnapshot.subDomainById,
  }
}

export function getSubdomainLabel(subdomainId) {
  return getSubdomainById(subdomainId)?.label ?? toLabelFromId(subdomainId)
}

export function getSubdomainDescription(subdomainId) {
  return getSubdomainById(subdomainId)?.description ?? ''
}

export { ALLOWED_AUDIENCES, ALLOWED_REVIEW_STATES, SUBDOMAIN_ID_PATTERN }
