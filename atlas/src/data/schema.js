const REQUIRED_FIELDS = [
  'id',
  'title',
  'type',
  'domain',
  'formula',
  'variables',
  'description',
  'connections',
  'visual',
  'tags',
  'position',
]

const ALLOWED_TYPES = ['law', 'equation', 'principle', 'definition', 'theorem']
const ALLOWED_VISUAL_TYPES = ['phet', 'video', 'widget', 'none']
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

  if (!Array.isArray(node.variables) || node.variables.length === 0) {
    errors.push('variables must be a non-empty array.')
  } else {
    node.variables.forEach((variable, index) => {
      if (!variable || typeof variable !== 'object' || Array.isArray(variable)) {
        errors.push(`variables[${index}] must be an object.`)
        return
      }

      for (const key of ['symbol', 'name', 'unit', 'description']) {
        if (!isNonEmptyString(variable[key])) {
          errors.push(`variables[${index}].${key} must be a non-empty string.`)
        }
      }
    })
  }

  if (!isNonEmptyString(node.description)) {
    errors.push('description must be a non-empty string.')
  }

  if (!Array.isArray(node.connections)) {
    errors.push('connections must be an array of strings.')
  } else if (node.connections.some((connection) => typeof connection !== 'string')) {
    errors.push('connections must be an array of strings.')
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

  if (!node.position || typeof node.position !== 'object' || Array.isArray(node.position)) {
    errors.push('position must be an object with numeric x and y.')
  } else {
    if (typeof node.position.x !== 'number' || Number.isNaN(node.position.x)) {
      errors.push('position.x must be a number.')
    }
    if (typeof node.position.y !== 'number' || Number.isNaN(node.position.y)) {
      errors.push('position.y must be a number.')
    }
  }

  return errors
}
