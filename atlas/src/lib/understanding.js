const STORAGE_KEY_V2 = 'atlas_understanding_v2'
const STORAGE_KEY_V1 = 'atlas_understood_v1'

export const UNDERSTANDING_STATES = ['unseen', 'seen', 'recognize', 'apply', 'derive']

const UNDERSTANDING_RANK = {
  unseen: 0,
  seen: 1,
  recognize: 2,
  apply: 3,
  derive: 4,
}

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }
  return null
}

function isUnderstandingState(value) {
  return typeof value === 'string' && UNDERSTANDING_STATES.includes(value)
}

function normalizeState(value) {
  return isUnderstandingState(value) ? value : 'unseen'
}

function parseStateMap(raw) {
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    const entries = Object.entries(parsed).filter(
      ([entityId, state]) => typeof entityId === 'string' && entityId.length > 0 && isUnderstandingState(state),
    )
    return Object.fromEntries(entries)
  } catch {
    return {}
  }
}

function migrateLegacyUnderstoodSet(storage) {
  if (!storage) {
    return {}
  }

  const existingV2Raw = storage.getItem(STORAGE_KEY_V2)
  if (existingV2Raw !== null) {
    return parseStateMap(existingV2Raw)
  }

  try {
    const legacyRaw = storage.getItem(STORAGE_KEY_V1)
    if (!legacyRaw) {
      return {}
    }

    const legacyParsed = JSON.parse(legacyRaw)
    if (!Array.isArray(legacyParsed)) {
      return {}
    }

    const migratedEntries = legacyParsed
      .filter((value) => typeof value === 'string' && value.length > 0)
      .map((entityId) => [entityId, 'apply'])
    const migrated = Object.fromEntries(migratedEntries)

    storage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated))
    storage.removeItem(STORAGE_KEY_V1)
    return migrated
  } catch {
    return {}
  }
}

export function getAllStates() {
  const storage = getStorage()
  if (!storage) {
    return {}
  }

  const migrated = migrateLegacyUnderstoodSet(storage)
  if (Object.keys(migrated).length > 0) {
    return migrated
  }
  return parseStateMap(storage.getItem(STORAGE_KEY_V2))
}

export function getState(entityId) {
  if (typeof entityId !== 'string' || entityId.length === 0) {
    return 'unseen'
  }
  const allStates = getAllStates()
  return normalizeState(allStates[entityId])
}

export function setState(entityId, state) {
  if (typeof entityId !== 'string' || entityId.length === 0) {
    return
  }

  const storage = getStorage()
  if (!storage) {
    return
  }

  const normalized = normalizeState(state)
  const next = { ...getAllStates() }
  if (normalized === 'unseen') {
    delete next[entityId]
  } else {
    next[entityId] = normalized
  }

  try {
    storage.setItem(STORAGE_KEY_V2, JSON.stringify(next))
  } catch {
    // Ignore storage write failures.
  }
}

export function getUnderstandingRank(state) {
  return UNDERSTANDING_RANK[normalizeState(state)]
}

export function isStateAtLeast(state, threshold) {
  return getUnderstandingRank(state) >= getUnderstandingRank(threshold)
}

export function isStateAtMost(state, threshold) {
  return getUnderstandingRank(state) <= getUnderstandingRank(threshold)
}
