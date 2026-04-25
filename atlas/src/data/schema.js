const REQUIRED_FIELDS = [
  'id',
  'title',
  'type',
  'domain',
  'formula',
  'causal_structure',
  'variables',
  'description',
  'prerequisites',
  'visual',
  'tags',
]

const ALLOWED_TYPES = ['law', 'equation', 'principle', 'definition', 'theorem']
const ALLOWED_VISUAL_TYPES = ['phet', 'video', 'widget', 'none']
const ALLOWED_CAUSAL_STRUCTURES = ['asymmetric', 'symmetric', 'contextual']
const ALLOWED_VARIABLE_ROLES = [
  'driver',
  'response',
  'parameter',
  'covariate',
  'conserved',
]
const ALLOWED_PREREQUISITE_TYPES = ['foundational', 'supporting', 'lateral']
const ALLOWED_IDEALIZATION_SCOPES = ['idealized', 'noted', 'primary']
const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateNode(node) {
  const errors = []

  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return ['Node must be an object.']
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in node)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (!isNonEmptyString(node.id)) {
    errors.push('id must be a non-empty string.')
  } else if (!KEBAB_CASE_PATTERN.test(node.id)) {
    errors.push('id must be kebab-case.')
  }

  if (!isNonEmptyString(node.title)) {
    errors.push('title must be a non-empty string.')
  }

  if (!ALLOWED_TYPES.includes(node.type)) {
    errors.push(`type must be one of: ${ALLOWED_TYPES.join(', ')}`)
  }

  if (!isNonEmptyString(node.domain)) {
    errors.push('domain must be a non-empty string.')
  }

  if (!isNonEmptyString(node.formula)) {
    errors.push('formula must be a non-empty string.')
  }

  if (!ALLOWED_CAUSAL_STRUCTURES.includes(node.causal_structure)) {
    errors.push(
      `causal_structure must be one of: ${ALLOWED_CAUSAL_STRUCTURES.join(', ')}`,
    )
  }

  if (!Array.isArray(node.variables) || node.variables.length === 0) {
    errors.push('variables must be a non-empty array.')
  } else {
    node.variables.forEach((variable, index) => {
      if (!variable || typeof variable !== 'object' || Array.isArray(variable)) {
        errors.push(`variables[${index}] must be an object.`)
        return
      }

      for (const key of ['symbol', 'role', 'name', 'unit', 'description']) {
        if (!isNonEmptyString(variable[key])) {
          errors.push(`variables[${index}].${key} must be a non-empty string.`)
        }
      }

      if (
        typeof variable.role === 'string' &&
        !ALLOWED_VARIABLE_ROLES.includes(variable.role)
      ) {
        errors.push(
          `variables[${index}].role must be one of: ${ALLOWED_VARIABLE_ROLES.join(', ')}`,
        )
      }
    })
  }

  if (node.causal_structure === 'symmetric' && Array.isArray(node.variables)) {
    node.variables.forEach((variable, index) => {
      if (variable?.role !== 'conserved') {
        errors.push(
          `variables[${index}].role must be "conserved" when causal_structure is "symmetric".`,
        )
      }
    })
  }

  if (node.causal_structure === 'contextual' && Array.isArray(node.variables)) {
    const invalidRoles = node.variables
      .filter((variable) => variable?.role === 'driver' || variable?.role === 'response')
      .map((variable) => variable.symbol)
    if (invalidRoles.length > 0) {
      errors.push(
        `contextual nodes cannot have driver/response roles: ${invalidRoles.join(', ')}`,
      )
    }
  }

  if (!isNonEmptyString(node.description)) {
    errors.push('description must be a non-empty string.')
  }

  if ('connections' in node) {
    errors.push('connections is not allowed. Use prerequisites instead.')
  }

  if (!Array.isArray(node.prerequisites)) {
    errors.push('prerequisites must be an array.')
  } else {
    node.prerequisites.forEach((prerequisite, index) => {
      if (!prerequisite || typeof prerequisite !== 'object' || Array.isArray(prerequisite)) {
        errors.push(`prerequisites[${index}] must be an object.`)
        return
      }

      if (!isNonEmptyString(prerequisite.id)) {
        errors.push(`prerequisites[${index}].id must be a non-empty string.`)
      }

      if (!ALLOWED_PREREQUISITE_TYPES.includes(prerequisite.type)) {
        errors.push(
          `prerequisites[${index}].type must be one of: ${ALLOWED_PREREQUISITE_TYPES.join(', ')}`,
        )
      }

      if (
        typeof prerequisite.weight !== 'number' ||
        Number.isNaN(prerequisite.weight) ||
        prerequisite.weight < 0 ||
        prerequisite.weight > 1
      ) {
        errors.push(`prerequisites[${index}].weight must be a number between 0 and 1.`)
      }
    })
  }

  if ('idealizations' in node) {
    if (!Array.isArray(node.idealizations)) {
      errors.push('idealizations must be an array when provided.')
    } else {
      node.idealizations.forEach((idealization, index) => {
        if (!idealization || typeof idealization !== 'object' || Array.isArray(idealization)) {
          errors.push(`idealizations[${index}] must be an object.`)
          return
        }

        if (!isNonEmptyString(idealization.name)) {
          errors.push(`idealizations[${index}].name must be a non-empty string.`)
        }

        if (!ALLOWED_IDEALIZATION_SCOPES.includes(idealization.scope)) {
          errors.push(
            `idealizations[${index}].scope must be one of: ${ALLOWED_IDEALIZATION_SCOPES.join(', ')}`,
          )
        }

        if (!('note' in idealization)) {
          return
        }

        if (!(typeof idealization.note === 'string' && idealization.note.trim().length > 0)) {
          errors.push(`idealizations[${index}].note must be a non-empty string when provided.`)
        }
      })
    }
  }

  if ('mass' in node) {
    if (!(node.mass === null || typeof node.mass === 'number')) {
      errors.push('mass must be a number or null.')
    } else if (typeof node.mass === 'number' && (Number.isNaN(node.mass) || node.mass <= 0)) {
      errors.push('mass must be greater than 0 when provided as a number.')
    }
  }

  if (!node.visual || typeof node.visual !== 'object' || Array.isArray(node.visual)) {
    errors.push('visual must be an object.')
  } else {
    if (!ALLOWED_VISUAL_TYPES.includes(node.visual.type)) {
      errors.push(`visual.type must be one of: ${ALLOWED_VISUAL_TYPES.join(', ')}`)
    }

    if (!(typeof node.visual.url === 'string' || node.visual.url === null)) {
      errors.push('visual.url must be a string or null.')
    }
  }

  if (!Array.isArray(node.tags)) {
    errors.push('tags must be an array of strings.')
  } else if (node.tags.some((tag) => typeof tag !== 'string')) {
    errors.push('tags must be an array of strings.')
  }

  if ('position' in node && node.position !== null) {
    if (typeof node.position !== 'object' || Array.isArray(node.position)) {
      errors.push('position must be null or an object with numeric x and y.')
    } else {
      if (typeof node.position.x !== 'number' || Number.isNaN(node.position.x)) {
        errors.push('position.x must be a number.')
      }
      if (typeof node.position.y !== 'number' || Number.isNaN(node.position.y)) {
        errors.push('position.y must be a number.')
      }
      if ('pinned' in node.position && typeof node.position.pinned !== 'boolean') {
        errors.push('position.pinned must be a boolean when provided.')
      }
    }
  }

  return errors
}
