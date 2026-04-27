export const CONSTRUCTION_KEY_PREFIX = 'atlas_construction_'
const CONSTRUCTION_KEY_SUFFIX = '_v1'

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }
  return null
}

function buildSessionKey(sessionId) {
  return `${CONSTRUCTION_KEY_PREFIX}${sessionId}${CONSTRUCTION_KEY_SUFFIX}`
}

function readSessionSummary(session) {
  return {
    id: session.id,
    title: typeof session.title === 'string' && session.title.trim() ? session.title : 'Untitled concept map',
    modifiedAt:
      typeof session.modified_at === 'string' && session.modified_at.length > 0
        ? session.modified_at
        : session.created_at ?? null,
    submitted: Boolean(session?.submission?.submitted),
  }
}

export function listConstructionSessions() {
  const storage = getStorage()
  if (!storage) {
    return []
  }

  const sessions = []
  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (typeof key !== 'string' || !key.startsWith(CONSTRUCTION_KEY_PREFIX)) {
        continue
      }

      const raw = storage.getItem(key)
      if (!raw) {
        continue
      }

      try {
        const parsed = JSON.parse(raw)
        if (typeof parsed?.id !== 'string') {
          continue
        }
        sessions.push(readSessionSummary(parsed))
      } catch {
        // Ignore malformed entries.
      }
    }
  } catch {
    return []
  }

  return sessions.sort((left, right) => {
    const leftTime = Date.parse(left.modifiedAt ?? '')
    const rightTime = Date.parse(right.modifiedAt ?? '')
    return (Number.isFinite(rightTime) ? rightTime : 0) - (Number.isFinite(leftTime) ? leftTime : 0)
  })
}

export function loadConstructionSession(sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    return null
  }
  const storage = getStorage()
  if (!storage) {
    return null
  }

  try {
    const raw = storage.getItem(buildSessionKey(sessionId))
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function saveConstructionSession(session) {
  if (!session || typeof session !== 'object' || typeof session.id !== 'string' || session.id.length === 0) {
    return
  }
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(buildSessionKey(session.id), JSON.stringify(session))
  } catch {
    // Ignore write failures.
  }
}

export function deleteConstructionSession(sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    return
  }
  const storage = getStorage()
  if (!storage) {
    return
  }
  try {
    storage.removeItem(buildSessionKey(sessionId))
  } catch {
    // Ignore deletion failures.
  }
}
