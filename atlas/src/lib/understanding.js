const STORAGE_KEY_V3 = 'atlas:state:v1:progress'
const STORAGE_KEY_V2 = 'atlas_understanding_v2'
const STORAGE_KEY_V1 = 'atlas_understood_v1'
const STATE_SCHEMA_VERSION = 1
const DEFAULT_PROGRESS = 0
const PROGRESS_MIN = 0
const PROGRESS_MAX = 100
const VARIABLE_KNOWN_THRESHOLD = 66

const LEGACY_STATE_TO_PROGRESS = {
  unseen: 0,
  seen: 33,
  recognize: 66,
  apply: 100,
  derive: 100,
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

function clampProgress(value) {
  return Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, value))
}

function normalizeProgress(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_PROGRESS
  }
  return clampProgress(Math.round(value))
}

function parseProgressMap(raw) {
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    if ('state_schema_version' in parsed || 'progress_by_id' in parsed) {
      if (
        parsed.state_schema_version !== STATE_SCHEMA_VERSION ||
        !parsed.progress_by_id ||
        typeof parsed.progress_by_id !== 'object' ||
        Array.isArray(parsed.progress_by_id)
      ) {
        return {}
      }
      const entries = Object.entries(parsed.progress_by_id).filter(
        ([entityId, progress]) =>
          typeof entityId === 'string' &&
          entityId.length > 0 &&
          typeof progress === 'number' &&
          Number.isFinite(progress),
      )
      return Object.fromEntries(
        entries.map(([entityId, progress]) => [entityId, normalizeProgress(progress)]),
      )
    }

    const entries = Object.entries(parsed).filter(
      ([entityId, progress]) =>
        typeof entityId === 'string' &&
        entityId.length > 0 &&
        typeof progress === 'number' &&
        Number.isFinite(progress),
    )
    return Object.fromEntries(
      entries.map(([entityId, progress]) => [entityId, normalizeProgress(progress)]),
    )
  } catch {
    return {}
  }
}

function parseLegacyStateMap(raw) {
  if (!raw) {
    return {}
  }
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }
    const entries = Object.entries(parsed).filter(
      ([entityId, state]) =>
        typeof entityId === 'string' &&
        entityId.length > 0 &&
        typeof state === 'string' &&
        state in LEGACY_STATE_TO_PROGRESS,
    )
    return Object.fromEntries(entries.map(([entityId, state]) => [entityId, LEGACY_STATE_TO_PROGRESS[state]]))
  } catch {
    return {}
  }
}

function writeProgressMap(storage, progressById) {
  storage.setItem(
    STORAGE_KEY_V3,
    JSON.stringify({
      state_schema_version: STATE_SCHEMA_VERSION,
      progress_by_id: progressById,
    }),
  )
}

function migrateLegacyState(storage) {
  if (!storage) {
    return {}
  }

  const existingV3Raw = storage.getItem(STORAGE_KEY_V3)
  if (existingV3Raw !== null) {
    return parseProgressMap(existingV3Raw)
  }

  const legacyV2Raw = storage.getItem(STORAGE_KEY_V2)
  if (legacyV2Raw !== null) {
    const migratedFromV2 = parseLegacyStateMap(legacyV2Raw)
    writeProgressMap(storage, migratedFromV2)
    storage.removeItem(STORAGE_KEY_V2)
    return migratedFromV2
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
      .map((entityId) => [entityId, 100])
    const migrated = Object.fromEntries(migratedEntries)

    writeProgressMap(storage, migrated)
    storage.removeItem(STORAGE_KEY_V1)
    return migrated
  } catch {
    return {}
  }
}

export function getAllProgress() {
  const storage = getStorage()
  if (!storage) {
    return {}
  }

  const migrated = migrateLegacyState(storage)
  if (Object.keys(migrated).length > 0) {
    return migrated
  }
  return parseProgressMap(storage.getItem(STORAGE_KEY_V3))
}

export function getProgress(entityId) {
  if (typeof entityId !== 'string' || entityId.length === 0) {
    return DEFAULT_PROGRESS
  }
  const allProgress = getAllProgress()
  return normalizeProgress(allProgress[entityId])
}

export function setProgress(entityId, progress) {
  if (typeof entityId !== 'string' || entityId.length === 0) {
    return
  }

  const storage = getStorage()
  if (!storage) {
    return
  }

  const normalized = normalizeProgress(progress)
  const next = { ...getAllProgress() }
  if (normalized <= DEFAULT_PROGRESS) {
    delete next[entityId]
  } else {
    next[entityId] = normalized
  }

  try {
    writeProgressMap(storage, next)
  } catch {
    // Ignore storage write failures.
  }
}

export function isProgressAtLeast(progress, threshold) {
  return normalizeProgress(progress) >= normalizeProgress(threshold)
}

export function isProgressAtMost(progress, threshold) {
  return normalizeProgress(progress) <= normalizeProgress(threshold)
}

export { STATE_SCHEMA_VERSION, STORAGE_KEY_V3 as PROGRESS_STORAGE_KEY, VARIABLE_KNOWN_THRESHOLD }

// Backward-compatible aliases during Phase 5 migration.
export const getAllStates = getAllProgress
export const getState = getProgress
export const setState = setProgress
export const isStateAtLeast = isProgressAtLeast
export const isStateAtMost = isProgressAtMost
