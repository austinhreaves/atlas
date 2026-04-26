export const USER_LAYOUT_STORAGE_KEY = 'atlas_user_layout_v1'
const USER_LAYOUT_VERSION = 1

const LAYOUT_FORMAT = 'atlas-layout'
const LAYOUT_FORMAT_VERSION = 1

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }
  return null
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

function toNullableString(value) {
  return typeof value === 'string' ? value : null
}

function getIsoTimestamp() {
  return new Date().toISOString()
}

export function createUserLayoutStore({
  positions = {},
  atlasCorpusHash = null,
  userNote = null,
  savedAt = getIsoTimestamp(),
} = {}) {
  return {
    version: USER_LAYOUT_VERSION,
    saved_at: typeof savedAt === 'string' ? savedAt : getIsoTimestamp(),
    positions: toPositionMap(positions),
    metadata: {
      atlas_corpus_hash: toNullableString(atlasCorpusHash),
      user_note: toNullableString(userNote),
    },
  }
}

export function getUserLayoutStore() {
  const storage = getStorage()
  if (!storage) {
    return createUserLayoutStore()
  }

  try {
    const raw = storage.getItem(USER_LAYOUT_STORAGE_KEY)
    if (!raw) {
      return createUserLayoutStore()
    }
    const parsed = JSON.parse(raw)
    return createUserLayoutStore({
      positions: parsed?.positions,
      atlasCorpusHash: parsed?.metadata?.atlas_corpus_hash,
      userNote: parsed?.metadata?.user_note,
      savedAt: parsed?.saved_at,
    })
  } catch {
    return createUserLayoutStore()
  }
}

export function saveUserLayoutStore(store) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(
      USER_LAYOUT_STORAGE_KEY,
      JSON.stringify(
        createUserLayoutStore({
          positions: store?.positions,
          atlasCorpusHash: store?.metadata?.atlas_corpus_hash,
          userNote: store?.metadata?.user_note,
          savedAt: store?.saved_at,
        }),
      ),
    )
  } catch {
    // Ignore storage write failures.
  }
}

export function clearUserLayoutStore() {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.removeItem(USER_LAYOUT_STORAGE_KEY)
  } catch {
    // Ignore storage clear failures.
  }
}

export function setUserLayoutPosition(store, entityId, position, atlasCorpusHash = null) {
  const next = createUserLayoutStore({
    ...store,
    atlasCorpusHash: atlasCorpusHash ?? store?.metadata?.atlas_corpus_hash ?? null,
  })
  if (typeof entityId !== 'string' || typeof position?.x !== 'number' || typeof position?.y !== 'number') {
    return next
  }

  next.positions[entityId] = { x: position.x, y: position.y }
  next.saved_at = getIsoTimestamp()
  return next
}

export function removeUserLayoutPosition(store, entityId, atlasCorpusHash = null) {
  const next = createUserLayoutStore({
    ...store,
    atlasCorpusHash: atlasCorpusHash ?? store?.metadata?.atlas_corpus_hash ?? null,
  })
  if (typeof entityId !== 'string') {
    return next
  }

  if (entityId in next.positions) {
    delete next.positions[entityId]
    next.saved_at = getIsoTimestamp()
  }
  return next
}

export function buildLayoutExportPayload({
  positions = {},
  atlasCorpusHash = null,
  atlasCorpusVersion = 'unknown',
  userNote = null,
  exportedAt = getIsoTimestamp(),
  userId = null,
} = {}) {
  return {
    format: LAYOUT_FORMAT,
    format_version: LAYOUT_FORMAT_VERSION,
    exported_at: typeof exportedAt === 'string' ? exportedAt : getIsoTimestamp(),
    atlas_corpus_hash: toNullableString(atlasCorpusHash),
    atlas_corpus_version: typeof atlasCorpusVersion === 'string' ? atlasCorpusVersion : 'unknown',
    positions: toPositionMap(positions),
    user_note: toNullableString(userNote),
    exporter: {
      type: 'user',
      user_id: toNullableString(userId),
    },
  }
}

export function downloadLayoutPayload(payload, filename = `atlas-layout-${Date.now()}.atlas-layout.json`) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(url)
}

export function parseLayoutImportPayload(rawText) {
  try {
    return JSON.parse(rawText)
  } catch {
    return null
  }
}

export function validateLayoutImportPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, reason: 'Layout file must be a JSON object.' }
  }
  if (payload.format !== LAYOUT_FORMAT) {
    return { valid: false, reason: 'Unsupported layout format.' }
  }
  if (payload.format_version !== LAYOUT_FORMAT_VERSION) {
    return { valid: false, reason: 'Unsupported layout format version.' }
  }
  if (!payload.positions || typeof payload.positions !== 'object') {
    return { valid: false, reason: 'Layout file is missing positions.' }
  }

  const positions = toPositionMap(payload.positions)
  const inputCount = Object.keys(payload.positions).length
  const outputCount = Object.keys(positions).length
  if (inputCount !== outputCount) {
    return { valid: false, reason: 'Layout file contains invalid position entries.' }
  }

  return {
    valid: true,
    positions,
    atlasCorpusHash: toNullableString(payload.atlas_corpus_hash),
    userNote: toNullableString(payload.user_note),
  }
}

export async function computeCorpusHash(entityIds) {
  const normalized = Array.isArray(entityIds)
    ? entityIds.filter((id) => typeof id === 'string').sort()
    : []
  const payload = normalized.join('|')
  const encoder = new TextEncoder()
  const data = encoder.encode(payload)

  if (typeof crypto !== 'undefined' && crypto.subtle?.digest) {
    const digest = await crypto.subtle.digest('SHA-256', data)
    const hash = [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('')
    return `sha256:${hash}`
  }

  // Fallback for environments without Web Crypto.
  let seed = 2166136261
  for (let i = 0; i < payload.length; i += 1) {
    seed ^= payload.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }
  return `sha256:fallback-${(seed >>> 0).toString(16).padStart(8, '0')}`
}
