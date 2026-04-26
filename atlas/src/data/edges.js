/**
 * Build React Flow edge objects from the full entity array.
 *
 * @param {Array<object>} entities
 * @param {{ strict?: boolean }} [options]
 * @returns {Array<{ id: string, source: string, target: string, type: string, weight: number, rationale?: string, layer_pair?: string }>}
 */
export function normalizePrerequisiteWeight(type, weight) {
  if (typeof weight === 'number' && !Number.isNaN(weight)) {
    return weight
  }
  return type === 'definitional' ? 1 : 0
}

function shouldUseStrictMode(strictFlag) {
  if (typeof strictFlag === 'boolean') {
    return strictFlag
  }
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
}

function isConceptEntity(entity) {
  return entity?.layer === 'concept' || Array.isArray(entity?.prerequisites)
}

function toEdgeId(source, type, target) {
  return `${source}__${type}__${target}`
}

export function buildEdges(entities, options = {}) {
  if (!Array.isArray(entities)) {
    return []
  }

  const strict = shouldUseStrictMode(options.strict)
  const seen = new Set()
  const edges = []
  const variableIds = new Set(
    entities
      .filter((entity) => entity?.layer === 'variable' && typeof entity.id === 'string')
      .map((entity) => entity.id),
  )
  const unresolvedVariableRefs = []

  for (const entity of entities) {
    if (!isConceptEntity(entity) || typeof entity.id !== 'string') {
      continue
    }

    if (Array.isArray(entity.prerequisites)) {
      for (const prerequisite of entity.prerequisites) {
        if (
          !prerequisite ||
          typeof prerequisite.id !== 'string' ||
          typeof prerequisite.type !== 'string'
        ) {
          continue
        }

        const source = prerequisite.id
        const target = entity.id

        if (source === target) {
          continue
        }

        const key = `${source}\0${target}\0${prerequisite.type}`
        if (seen.has(key)) {
          continue
        }
        seen.add(key)

        edges.push({
          id: toEdgeId(source, prerequisite.type, target),
          source,
          target,
          type: prerequisite.type,
          weight: normalizePrerequisiteWeight(prerequisite.type, prerequisite.weight),
          rationale:
            typeof prerequisite.rationale === 'string' && prerequisite.rationale.trim().length > 0
              ? prerequisite.rationale.trim()
              : undefined,
          layer_pair: 'concept-concept',
        })
      }
    }

    if (!Array.isArray(entity.variables)) {
      continue
    }

    for (const variable of entity.variables) {
      if (
        !variable ||
        typeof variable !== 'object' ||
        Array.isArray(variable) ||
        typeof variable.id !== 'string'
      ) {
        continue
      }

      if (!variableIds.has(variable.id)) {
        unresolvedVariableRefs.push(`${entity.id}->${variable.id}`)
        continue
      }

      const source = entity.id
      const target = variable.id
      if (source === target) {
        continue
      }

      const edgeType = 'uses-variable'
      const key = `${source}\0${target}\0${edgeType}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)

      edges.push({
        id: toEdgeId(source, edgeType, target),
        source,
        target,
        type: edgeType,
        weight: 0.5,
        layer_pair: 'concept-variable',
      })
    }
  }

  if (strict && unresolvedVariableRefs.length > 0) {
    throw new Error(
      `Missing variable entities referenced by concepts: ${unresolvedVariableRefs.join(', ')}`,
    )
  }

  return edges
}
