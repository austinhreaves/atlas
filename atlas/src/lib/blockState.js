const BLOCK_STATE_STORAGE_KEY = 'atlas:state:v1:blocks'

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }
  return null
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeStateMap(rawStateMap) {
  if (!isPlainObject(rawStateMap)) {
    return {}
  }

  const sanitizedByNodeId = {}
  for (const [nodeId, nodeState] of Object.entries(rawStateMap)) {
    if (typeof nodeId !== 'string' || nodeId.length === 0 || !isPlainObject(nodeState)) {
      continue
    }

    const sanitizedByBlockId = {}
    for (const [blockId, blockState] of Object.entries(nodeState)) {
      if (typeof blockId !== 'string' || blockId.length === 0 || !isPlainObject(blockState)) {
        continue
      }
      sanitizedByBlockId[blockId] = blockState
    }

    sanitizedByNodeId[nodeId] = sanitizedByBlockId
  }

  return sanitizedByNodeId
}

function parseStoredState(rawValue) {
  if (!rawValue) {
    return {}
  }

  try {
    return sanitizeStateMap(JSON.parse(rawValue))
  } catch {
    return {}
  }
}

export function getAllBlockStates() {
  const storage = getStorage()
  if (!storage) {
    return {}
  }
  return parseStoredState(storage.getItem(BLOCK_STATE_STORAGE_KEY))
}

export function getBlockState(nodeId, blockId) {
  if (typeof nodeId !== 'string' || nodeId.length === 0) {
    return {}
  }
  if (typeof blockId !== 'string' || blockId.length === 0) {
    return {}
  }

  const stateMap = getAllBlockStates()
  if (!isPlainObject(stateMap[nodeId])) {
    return {}
  }
  const blockState = stateMap[nodeId][blockId]
  return isPlainObject(blockState) ? blockState : {}
}

export function setBlockState(nodeId, blockId, nextBlockState) {
  if (typeof nodeId !== 'string' || nodeId.length === 0) {
    return
  }
  if (typeof blockId !== 'string' || blockId.length === 0) {
    return
  }
  if (!isPlainObject(nextBlockState)) {
    return
  }

  const storage = getStorage()
  if (!storage) {
    return
  }

  const stateMap = getAllBlockStates()
  const priorNodeState = isPlainObject(stateMap[nodeId]) ? stateMap[nodeId] : {}

  const nextStateMap = {
    ...stateMap,
    [nodeId]: {
      ...priorNodeState,
      [blockId]: nextBlockState,
    },
  }

  try {
    storage.setItem(BLOCK_STATE_STORAGE_KEY, JSON.stringify(nextStateMap))
  } catch {
    // Ignore storage write failures.
  }
}

export { BLOCK_STATE_STORAGE_KEY }

