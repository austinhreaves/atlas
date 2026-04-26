const DEFAULT_POSITION = { x: 0, y: 0 }

function hasNumericXY(position) {
  return typeof position?.x === 'number' && typeof position?.y === 'number'
}

/**
 * @param {{
 *   entityId: string,
 *   userPositions?: Record<string, {x:number,y:number}>,
 *   canonicalPosition?: {x:number,y:number} | null,
 *   computedPositions?: Record<string, {x:number,y:number}>,
 *   fallbackPosition?: {x:number,y:number},
 *   warnOnMissingComputed?: boolean,
 * }} args
 */
export function resolveRenderPosition({
  entityId,
  userPositions = {},
  canonicalPosition = null,
  computedPositions = {},
  fallbackPosition = DEFAULT_POSITION,
  warnOnMissingComputed = false,
}) {
  if (hasNumericXY(userPositions?.[entityId])) {
    return userPositions[entityId]
  }

  if (hasNumericXY(canonicalPosition)) {
    return canonicalPosition
  }

  if (hasNumericXY(computedPositions?.[entityId])) {
    return computedPositions[entityId]
  }

  if (warnOnMissingComputed && typeof console !== 'undefined') {
    console.warn(`Missing computed position for node "${entityId}". Falling back to default.`)
  }

  if (hasNumericXY(fallbackPosition)) {
    return fallbackPosition
  }

  return DEFAULT_POSITION
}
