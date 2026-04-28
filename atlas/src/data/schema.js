import { getSubdomainValidationContext } from './subdomains'
import { getSubjectValidationContext } from './subjects'
import { getTagValidationContext } from './tags'

const REQUIRED_CONCEPT_FIELDS = [
  'id',
  'layer',
  'subject',
  'title',
  'type',
  'domain',
  'formula',
  'causal_structure',
  'principle',
  'variables',
  'description',
  'prerequisites',
  'visual',
  'author',
  'review_state',
]
const REQUIRED_VARIABLE_FIELDS = [
  'id',
  'layer',
  'canonical_symbol',
  'name',
  'unit',
  'dimension',
  'description',
  'vector_or_scalar',
  'author',
  'review_state',
]

const ALLOWED_TYPES = ['law', 'equation', 'principle', 'definition', 'theorem']
const ALLOWED_VISUAL_TYPES = ['phet', 'video', 'widget', 'none']
const ALLOWED_CAUSAL_STRUCTURES = ['asymmetric', 'symmetric', 'contextual']
const ALLOWED_VARIABLE_ROLES = ['driver', 'response', 'parameter', 'covariate', 'conserved']
const ALLOWED_PREREQUISITE_TYPES = ['foundational', 'supporting', 'lateral', 'definitional']
const ALLOWED_IDEALIZATION_SCOPES = ['idealized', 'noted', 'primary']
const ALLOWED_REVIEW_STATES = ['draft', 'reviewed', 'published']
const ALLOWED_VECTOR_OR_SCALAR = ['scalar', 'vector', 'tensor']
const ALLOWED_VARIABLE_TYPES = ['constant', 'fundamental', 'derived', 'quantity']
const ALLOWED_GEOMETRIES = ['cylindrical', 'spherical', 'planar', 'axial', 'none', 'other']
const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateLastReviewed(value, errors) {
  if (value == null) {
    return
  }

  if (!isNonEmptyString(value) || !ISO_DATE_PATTERN.test(value)) {
    errors.push('last_reviewed must be an ISO date string (YYYY-MM-DD) or null.')
    return
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    errors.push('last_reviewed must be an ISO date string (YYYY-MM-DD) or null.')
  }
}

function validateMetadata(entity, errors) {
  if (!isNonEmptyString(entity.author)) {
    errors.push('author must be a non-empty string.')
  }

  if (!ALLOWED_REVIEW_STATES.includes(entity.review_state)) {
    errors.push(`review_state must be one of: ${ALLOWED_REVIEW_STATES.join(', ')}`)
  }

  if ('last_reviewed' in entity) {
    validateLastReviewed(entity.last_reviewed, errors)
  }
}

function validateBlocksWhenPresent(node, errors) {
  if (!('blocks' in node)) {
    return
  }

  if (!Array.isArray(node.blocks)) {
    errors.push('blocks must be an array when provided.')
    return
  }

  const seenBlockIds = new Set()
  node.blocks.forEach((block, index) => {
    if (!block || typeof block !== 'object' || Array.isArray(block)) {
      errors.push(`blocks[${index}] must be an object.`)
      return
    }

    if (!isNonEmptyString(block.block_id)) {
      errors.push(`blocks[${index}].block_id must be a non-empty string.`)
    } else if (seenBlockIds.has(block.block_id)) {
      errors.push(`blocks[].block_id values must be unique within a node: ${block.block_id}`)
    } else {
      seenBlockIds.add(block.block_id)
    }

    if (!isNonEmptyString(block.type)) {
      errors.push(`blocks[${index}].type must be a non-empty string.`)
    }

    if (!('data' in block) || !block.data || typeof block.data !== 'object' || Array.isArray(block.data)) {
      errors.push(`blocks[${index}].data must be an object.`)
    }
  })
}

function validateRegistryIdArray({
  entity,
  fieldPath,
  required,
  errors,
  validationContext,
  idSetKey,
  unknownIdErrorLabel,
  onValidateId,
}) {
  const hasField = fieldPath in entity
  if (!hasField) {
    if (required) {
      errors.push(`${fieldPath} must be an array of strings.`)
    }
    return
  }

  const value = entity[fieldPath]
  if (!Array.isArray(value) || value.some((tag) => !isNonEmptyString(tag))) {
    errors.push(`${fieldPath} must be an array of strings.`)
    return
  }

  if (!validationContext?.enforceMembership) {
    return
  }

  const allowedIds = validationContext[idSetKey] instanceof Set ? validationContext[idSetKey] : new Set()
  value.forEach((id, index) => {
    if (!allowedIds.has(id)) {
      errors.push(`${fieldPath}[${index}] references unknown ${unknownIdErrorLabel} id: ${id}`)
      return
    }

    if (typeof onValidateId === 'function') {
      onValidateId({ id, index, errors, entity, validationContext })
    }
  })
}

function validateTagsField(args) {
  validateRegistryIdArray({
    ...args,
    idSetKey: 'tagIds',
    unknownIdErrorLabel: 'tag',
  })
}

function validateSubdomainsField(args) {
  validateRegistryIdArray({
    ...args,
    idSetKey: 'subdomainIds',
    unknownIdErrorLabel: 'sub-domain',
    onValidateId: ({ id, index, errors, entity, validationContext }) => {
      const subdomainById =
        validationContext.subdomainById instanceof Map ? validationContext.subdomainById : new Map()
      const subdomainEntry = subdomainById.get(id)
      if (!subdomainEntry || !Array.isArray(subdomainEntry.domains) || subdomainEntry.domains.length === 0) {
        return
      }
      if (!subdomainEntry.domains.includes(entity.domain)) {
        errors.push(`sub_domains[${index}] is not allowed for domain "${entity.domain}": ${id}`)
      }
    },
  })
}

function validateSubjectField({ entity, fieldPath, errors, validationContext }) {
  if (!isNonEmptyString(entity[fieldPath])) {
    errors.push(`${fieldPath} must be a non-empty string.`)
    return
  }

  if (!validationContext?.enforceMembership) {
    return
  }

  const subjectIds = validationContext.subjectIds instanceof Set ? validationContext.subjectIds : new Set()
  if (!subjectIds.has(entity[fieldPath])) {
    errors.push(`${fieldPath} references unknown subject id: ${entity[fieldPath]}`)
  }
}

export function validateConceptNode(node, options = {}) {
  const errors = []
  const tagValidationContext = options.tagValidationContext ?? getTagValidationContext()
  const subdomainValidationContext =
    options.subdomainValidationContext ?? getSubdomainValidationContext()
  const subjectValidationContext = options.subjectValidationContext ?? getSubjectValidationContext()

  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return ['Node must be an object.']
  }

  for (const field of REQUIRED_CONCEPT_FIELDS) {
    if (!(field in node)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (!isNonEmptyString(node.id)) {
    errors.push('id must be a non-empty string.')
  } else if (!KEBAB_CASE_PATTERN.test(node.id)) {
    errors.push('id must be kebab-case.')
  }

  if (node.layer !== 'concept') {
    errors.push('layer must be "concept".')
  }

  validateSubjectField({
    entity: node,
    fieldPath: 'subject',
    errors,
    validationContext: subjectValidationContext,
  })

  if (!isNonEmptyString(node.title)) {
    errors.push('title must be a non-empty string.')
  }

  if (!ALLOWED_TYPES.includes(node.type)) {
    errors.push(`type must be one of: ${ALLOWED_TYPES.join(', ')}`)
  }

  if (!isNonEmptyString(node.domain)) {
    errors.push('domain must be a non-empty string.')
  }

  // The formula field is TRUSTED CONTENT in the current Atlas data model.
  // It is rendered through <KatexText /> using trusted defaults.
  if (!isNonEmptyString(node.formula)) {
    errors.push('formula must be a non-empty string.')
  }

  if (!ALLOWED_CAUSAL_STRUCTURES.includes(node.causal_structure)) {
    errors.push(`causal_structure must be one of: ${ALLOWED_CAUSAL_STRUCTURES.join(', ')}`)
  }

  if (!isNonEmptyString(node.principle)) {
    errors.push('principle must be a non-empty string.')
  }

  if (!Array.isArray(node.variables) || node.variables.length === 0) {
    errors.push('variables must be a non-empty array.')
  } else {
    const variableIds = new Set()

    node.variables.forEach((variable, index) => {
      if (!variable || typeof variable !== 'object' || Array.isArray(variable)) {
        errors.push(`variables[${index}] must be an object.`)
        return
      }

      if (!isNonEmptyString(variable.id)) {
        errors.push(`variables[${index}].id must be a non-empty string.`)
      } else if (!KEBAB_CASE_PATTERN.test(variable.id)) {
        errors.push(`variables[${index}].id must be kebab-case.`)
      } else if (variableIds.has(variable.id)) {
        errors.push(`variables[].id values must be unique within a node: ${variable.id}`)
      } else {
        variableIds.add(variable.id)
      }

      if (!isNonEmptyString(variable.symbol)) {
        errors.push(`variables[${index}].symbol must be a non-empty string.`)
      }

      if (!ALLOWED_VARIABLE_ROLES.includes(variable.role)) {
        errors.push(`variables[${index}].role must be one of: ${ALLOWED_VARIABLE_ROLES.join(', ')}`)
      }

      if ('name' in variable && !isNonEmptyString(variable.name)) {
        errors.push(`variables[${index}].name must be a non-empty string when provided.`)
      }

      if ('unit' in variable && !isNonEmptyString(variable.unit)) {
        errors.push(`variables[${index}].unit must be a non-empty string when provided.`)
      }

      if ('description' in variable && !isNonEmptyString(variable.description)) {
        errors.push(`variables[${index}].description must be a non-empty string when provided.`)
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
      errors.push(`contextual nodes cannot have driver/response roles: ${invalidRoles.join(', ')}`)
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

      const hasExplicitWeight = typeof prerequisite.weight === 'number'
      const effectiveWeight =
        hasExplicitWeight
          ? prerequisite.weight
          : prerequisite.weight == null && prerequisite.type === 'definitional'
            ? 1
            : NaN
      if (Number.isNaN(effectiveWeight) || effectiveWeight < 0 || effectiveWeight > 1) {
        errors.push(`prerequisites[${index}].weight must be a number between 0 and 1.`)
      }

      if (
        'rationale' in prerequisite &&
        !(typeof prerequisite.rationale === 'string' && prerequisite.rationale.trim().length > 0)
      ) {
        errors.push(`prerequisites[${index}].rationale must be a non-empty string when provided.`)
      }
    })
  }

  if (
    (node.type === 'law' || node.type === 'principle') &&
    (!Array.isArray(node.applicability_conditions) || node.applicability_conditions.length === 0)
  ) {
    errors.push('applicability_conditions must contain at least one entry for law/principle nodes.')
  }

  if ('applicability_conditions' in node) {
    if (
      !Array.isArray(node.applicability_conditions) ||
      node.applicability_conditions.some((item) => !isNonEmptyString(item))
    ) {
      errors.push('applicability_conditions must be an array of non-empty strings.')
    }
  }

  if ('limiting_cases' in node) {
    if (!Array.isArray(node.limiting_cases)) {
      errors.push('limiting_cases must be an array when provided.')
    } else {
      node.limiting_cases.forEach((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`limiting_cases[${index}] must be an object.`)
          return
        }

        if (!isNonEmptyString(item.case)) {
          errors.push(`limiting_cases[${index}].case must be a non-empty string.`)
        }

        if (!isNonEmptyString(item.result)) {
          errors.push(`limiting_cases[${index}].result must be a non-empty string.`)
        }
      })
    }
  }

  if ('misconceptions' in node) {
    if (!Array.isArray(node.misconceptions)) {
      errors.push('misconceptions must be an array when provided.')
    } else {
      node.misconceptions.forEach((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`misconceptions[${index}] must be an object.`)
          return
        }

        if (!isNonEmptyString(item.wrong_model)) {
          errors.push(`misconceptions[${index}].wrong_model must be a non-empty string.`)
        }

        if (!isNonEmptyString(item.correction)) {
          errors.push(`misconceptions[${index}].correction must be a non-empty string.`)
        }
      })
    }
  }

  if ('historical_context' in node && !isNonEmptyString(node.historical_context)) {
    errors.push('historical_context must be a non-empty string when provided.')
  }

  if ('geometries' in node) {
    if (!Array.isArray(node.geometries)) {
      errors.push('geometries must be an array when provided.')
    } else {
      node.geometries.forEach((geometry, index) => {
        if (!ALLOWED_GEOMETRIES.includes(geometry)) {
          errors.push(
            `geometries[${index}] must be one of: ${ALLOWED_GEOMETRIES.join(', ')}`,
          )
        }
      })
    }
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

        if ('note' in idealization && !isNonEmptyString(idealization.note)) {
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

  validateSubdomainsField({
    entity: node,
    fieldPath: 'sub_domains',
    required: false,
    errors,
    validationContext: subdomainValidationContext,
  })

  validateTagsField({
    entity: node,
    fieldPath: 'tags',
    required: false,
    errors,
    validationContext: tagValidationContext,
  })

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

  validateMetadata(node, errors)
  validateBlocksWhenPresent(node, errors)
  return errors
}

export function validateVariableNode(variable, options = {}) {
  const errors = []
  const tagValidationContext = options.tagValidationContext ?? getTagValidationContext()

  if (!variable || typeof variable !== 'object' || Array.isArray(variable)) {
    return ['Node must be an object.']
  }

  for (const field of REQUIRED_VARIABLE_FIELDS) {
    if (!(field in variable)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (!isNonEmptyString(variable.id)) {
    errors.push('id must be a non-empty string.')
  } else if (!KEBAB_CASE_PATTERN.test(variable.id)) {
    errors.push('id must be kebab-case.')
  }

  if (variable.layer !== 'variable') {
    errors.push('layer must be "variable".')
  }

  if (!isNonEmptyString(variable.canonical_symbol)) {
    errors.push('canonical_symbol must be a non-empty string.')
  }

  if (!isNonEmptyString(variable.name)) {
    errors.push('name must be a non-empty string.')
  }

  if (!isNonEmptyString(variable.unit)) {
    errors.push('unit must be a non-empty string.')
  }

  if (!isNonEmptyString(variable.dimension)) {
    errors.push('dimension must be a non-empty string.')
  }

  if (!isNonEmptyString(variable.description)) {
    errors.push('description must be a non-empty string.')
  }

  if (!ALLOWED_VECTOR_OR_SCALAR.includes(variable.vector_or_scalar)) {
    errors.push(`vector_or_scalar must be one of: ${ALLOWED_VECTOR_OR_SCALAR.join(', ')}`)
  }

  if (
    'variable_type' in variable &&
    !ALLOWED_VARIABLE_TYPES.includes(variable.variable_type)
  ) {
    errors.push(`variable_type must be one of: ${ALLOWED_VARIABLE_TYPES.join(', ')}`)
  }

  if ('sign_convention' in variable && !isNonEmptyString(variable.sign_convention)) {
    errors.push('sign_convention must be a non-empty string when provided.')
  }

  if ('common_aliases' in variable) {
    if (!Array.isArray(variable.common_aliases)) {
      errors.push('common_aliases must be an array when provided.')
    } else {
      variable.common_aliases.forEach((alias, index) => {
        if (!alias || typeof alias !== 'object' || Array.isArray(alias)) {
          errors.push(`common_aliases[${index}] must be an object.`)
          return
        }

        if (!isNonEmptyString(alias.symbol)) {
          errors.push(`common_aliases[${index}].symbol must be a non-empty string.`)
        }

        if (!isNonEmptyString(alias.context)) {
          errors.push(`common_aliases[${index}].context must be a non-empty string.`)
        }
      })
    }
  }

  validateTagsField({
    entity: variable,
    fieldPath: 'tags',
    required: false,
    errors,
    validationContext: tagValidationContext,
  })

  validateMetadata(variable, errors)
  validateBlocksWhenPresent(variable, errors)
  return errors
}

export function validateEntity(entity, options = {}) {
  const tagValidationContext = options.tagValidationContext ?? getTagValidationContext()
  const subdomainValidationContext =
    options.subdomainValidationContext ?? getSubdomainValidationContext()
  const subjectValidationContext = options.subjectValidationContext ?? getSubjectValidationContext()
  if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
    return ['Node must be an object.']
  }

  if (!isNonEmptyString(entity.layer)) {
    return ['Missing required field: layer']
  }

  if (entity.layer === 'concept') {
    return validateConceptNode(entity, {
      tagValidationContext,
      subdomainValidationContext,
      subjectValidationContext,
    })
  }

  if (entity.layer === 'variable') {
    return validateVariableNode(entity, { tagValidationContext })
  }

  return [`Unsupported layer: ${entity.layer}`]
}

// Backward-compat alias during v2->v3 transition.
export const validateNode = validateConceptNode
