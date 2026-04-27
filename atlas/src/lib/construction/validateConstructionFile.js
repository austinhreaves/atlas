import { getAllEntities } from '../../data'
import { computeExplanationFilled } from './constructionFile'

const VALID_FORMAT = 'atlas-concept-map'
const VALID_FORMAT_VERSION = 2
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isIsoTimestamp(value) {
  if (typeof value !== 'string') {
    return false
  }
  return Number.isFinite(Date.parse(value))
}

function getKnownCanonicalIds() {
  return new Set(getAllEntities().map((entity) => entity.id))
}

function deriveCanonicalFromPositions(positions) {
  if (!isObject(positions)) {
    return []
  }
  return Object.keys(positions).filter((id) => !id.startsWith('student-'))
}

function sameStringSet(left, right) {
  if (left.length !== right.length) {
    return false
  }
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
}

export function validateConstructionFile(file, options = {}) {
  const errors = []
  const warnings = []

  if (!isObject(file)) {
    return {
      errors: ['File must be a JSON object.'],
      warnings,
      file,
    }
  }

  if (file.format !== VALID_FORMAT || file.format_version !== VALID_FORMAT_VERSION) {
    errors.push('format / format_version unrecognized')
  }

  if (!Array.isArray(file.authors) || file.authors.length === 0) {
    errors.push('authors empty or no primary')
  } else {
    const primaryCount = file.authors.filter((author) => author?.role === 'primary').length
    if (primaryCount !== 1) {
      errors.push('authors empty or no primary')
    }
  }

  const knownCanonicalIds = getKnownCanonicalIds()
  const derivedCanonicalNodes = deriveCanonicalFromPositions(file.positions)
  const currentCanonicalNodes = Array.isArray(file.canonical_nodes) ? file.canonical_nodes : []
  if (!sameStringSet(currentCanonicalNodes, derivedCanonicalNodes)) {
    warnings.push('canonical_nodes diverges from positions keys')
    file.canonical_nodes = [...derivedCanonicalNodes]
  }

  for (const nodeId of file.canonical_nodes) {
    if (!knownCanonicalIds.has(nodeId)) {
      warnings.push(`orphaned canonical node ID (not in current corpus): ${nodeId}`)
    }
  }

  const studentNodes = Array.isArray(file.student_nodes) ? file.student_nodes : []
  const studentIds = []
  for (let index = 0; index < studentNodes.length; index += 1) {
    const node = studentNodes[index]
    if (typeof node?.id !== 'string' || !node.id.startsWith('student-')) {
      errors.push('student_nodes[].id not unique or wrong prefix')
      continue
    }
    studentIds.push(node.id)
    if (typeof node.title !== 'string' || node.title.trim().length === 0) {
      errors.push('student_nodes[].title empty')
    }
  }

  if (new Set(studentIds).size !== studentIds.length) {
    errors.push('student_nodes[].id not unique or wrong prefix')
  }

  const nodeSet = new Set([...file.canonical_nodes, ...studentIds])

  if (isObject(file.positions)) {
    for (const positionId of Object.keys(file.positions)) {
      if (!nodeSet.has(positionId)) {
        errors.push(`positions contains unknown node id: ${positionId}`)
      }
    }
  }

  const edges = Array.isArray(file.edges) ? file.edges : []
  const seenUndirectedPairs = new Set()
  for (let index = 0; index < edges.length; index += 1) {
    const edge = edges[index]
    if (!nodeSet.has(edge?.source) || !nodeSet.has(edge?.target)) {
      errors.push('edges[].source or edges[].target not in node set')
      continue
    }

    if (edge.source === edge.target) {
      errors.push('self-loop edge (source === target)')
    }

    const sortedPair = [edge.source, edge.target].sort().join('|')
    if (seenUndirectedPairs.has(sortedPair)) {
      errors.push('duplicate edge (same unordered node pair)')
    } else {
      seenUndirectedPairs.add(sortedPair)
    }

    const explanationFilled = computeExplanationFilled(edge.explanation)
    if (edge.explanation_filled !== explanationFilled) {
      warnings.push('explanation_filled inconsistent with explanation')
      edge.explanation_filled = explanationFilled
    }
  }

  const edgeIds = new Set(edges.map((edge) => edge?.id).filter((id) => typeof id === 'string'))
  const annotations = Array.isArray(file.annotations) ? file.annotations : []
  for (const annotation of annotations) {
    if (annotation?.target?.kind === 'map') {
      continue
    }
    if (annotation?.target?.kind === 'edge') {
      if (!edgeIds.has(annotation?.target?.id)) {
        errors.push('annotations[].target.id does not resolve')
      }
      continue
    }
    if (!nodeSet.has(annotation?.target?.id)) {
      errors.push('annotations[].target.id does not resolve')
    }
  }

  if (file?.submission?.submitted === true && !isIsoTimestamp(file?.submission?.submitted_at)) {
    errors.push('submission.submitted: true without valid timestamp')
  }

  const expectedAtlasCorpusHash = options.atlasCorpusHash
  if (typeof expectedAtlasCorpusHash === 'string' && file.atlas_corpus_hash !== expectedAtlasCorpusHash) {
    warnings.push('atlas_corpus_hash mismatch')
  } else if (typeof file.atlas_corpus_hash === 'string' && !SHA256_PATTERN.test(file.atlas_corpus_hash)) {
    warnings.push('atlas_corpus_hash mismatch')
  }

  return {
    errors,
    warnings,
    file,
  }
}
