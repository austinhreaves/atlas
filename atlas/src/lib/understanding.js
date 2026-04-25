const STORAGE_KEY = 'atlas_understood_v1'

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }
  return null
}

export function getUnderstood() {
  const storage = getStorage()
  if (!storage) {
    return new Set()
  }

  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) {
      return new Set()
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return new Set()
    }
    return new Set(parsed.filter((value) => typeof value === 'string'))
  } catch {
    return new Set()
  }
}

export function setUnderstood(nodeId, understood) {
  if (typeof nodeId !== 'string' || nodeId.length === 0) {
    return
  }

  const storage = getStorage()
  if (!storage) {
    return
  }

  const next = getUnderstood()
  if (understood) {
    next.add(nodeId)
  } else {
    next.delete(nodeId)
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  } catch {
    // Ignore storage write failures.
  }
}

export function isUnderstood(nodeId) {
  return getUnderstood().has(nodeId)
}
