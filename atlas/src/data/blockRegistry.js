import EmbedIframeBlock from '../components/blocks/EmbedIframeBlock'
import FileAttachmentBlock from '../components/blocks/FileAttachmentBlock'
import ImageBlock from '../components/blocks/ImageBlock'
import {
  ChecklistBlockEditor,
  ChecklistBlockRender,
} from '../components/blocks/ChecklistBlock'
import MarkdownKatexBlock from '../components/blocks/MarkdownKatexBlock'
import {
  PromptResponseBlockEditor,
  PromptResponseBlockRender,
} from '../components/blocks/PromptResponseBlock'
import TableBlock from '../components/blocks/TableBlock'

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function validateMarkdownKatex(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  if (typeof data.markdown !== 'string') {
    return ['data.markdown must be a string.']
  }
  return []
}

function validateImage(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  const errors = []
  if (typeof data.src !== 'string' || data.src.length === 0) {
    errors.push('data.src must be a non-empty string.')
  }
  if ('alt' in data && typeof data.alt !== 'string') {
    errors.push('data.alt must be a string when provided.')
  }
  if ('caption' in data && typeof data.caption !== 'string') {
    errors.push('data.caption must be a string when provided.')
  }
  return errors
}

function validateTable(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  const errors = []
  if (!Array.isArray(data.columns) || data.columns.some((column) => typeof column !== 'string')) {
    errors.push('data.columns must be an array of strings.')
  }
  if (!Array.isArray(data.rows) || data.rows.some((row) => !Array.isArray(row))) {
    errors.push('data.rows must be an array of row arrays.')
  }
  if ('caption' in data && typeof data.caption !== 'string') {
    errors.push('data.caption must be a string when provided.')
  }
  return errors
}

function validateFileAttachment(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  const errors = []
  if (typeof data.url !== 'string' || data.url.length === 0) {
    errors.push('data.url must be a non-empty string.')
  }
  if ('label' in data && typeof data.label !== 'string') {
    errors.push('data.label must be a string when provided.')
  }
  if ('description' in data && typeof data.description !== 'string') {
    errors.push('data.description must be a string when provided.')
  }
  return errors
}

function validateEmbedIframe(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  const errors = []
  if (typeof data.url !== 'string' || data.url.length === 0) {
    errors.push('data.url must be a non-empty string.')
  }
  if ('title' in data && typeof data.title !== 'string') {
    errors.push('data.title must be a string when provided.')
  }
  return errors
}

function validateChecklist(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return ['data.items must be a non-empty array.']
  }
  const errors = []
  const seenItemIds = new Set()
  data.items.forEach((item, index) => {
    if (!isPlainObject(item)) {
      errors.push(`data.items[${index}] must be an object.`)
      return
    }
    if (typeof item.id !== 'string' || item.id.length === 0) {
      errors.push(`data.items[${index}].id must be a non-empty string.`)
    } else if (seenItemIds.has(item.id)) {
      errors.push(`data.items[].id must be unique: ${item.id}`)
    } else {
      seenItemIds.add(item.id)
    }
    if (typeof item.text !== 'string') {
      errors.push(`data.items[${index}].text must be a string.`)
    }
  })
  return errors
}

function validatePromptResponse(data) {
  if (!isPlainObject(data)) {
    return ['data must be an object.']
  }
  const errors = []
  if (typeof data.prompt !== 'string' || data.prompt.length === 0) {
    errors.push('data.prompt must be a non-empty string.')
  }
  if ('placeholder' in data && typeof data.placeholder !== 'string') {
    errors.push('data.placeholder must be a string when provided.')
  }
  return errors
}

export const BLOCK_REGISTRY = {
  'markdown-katex': {
    type: 'markdown-katex',
    validator: validateMarkdownKatex,
    Render: MarkdownKatexBlock,
  },
  image: {
    type: 'image',
    validator: validateImage,
    Render: ImageBlock,
  },
  table: {
    type: 'table',
    validator: validateTable,
    Render: TableBlock,
  },
  'file-attachment': {
    type: 'file-attachment',
    validator: validateFileAttachment,
    Render: FileAttachmentBlock,
  },
  'embed-iframe': {
    type: 'embed-iframe',
    validator: validateEmbedIframe,
    Render: EmbedIframeBlock,
  },
  checklist: {
    type: 'checklist',
    validator: validateChecklist,
    Render: ChecklistBlockRender,
    Editor: ChecklistBlockEditor,
  },
  'prompt-and-response': {
    type: 'prompt-and-response',
    validator: validatePromptResponse,
    Render: PromptResponseBlockRender,
    Editor: PromptResponseBlockEditor,
  },
}

export function getBlockDefinition(type) {
  return BLOCK_REGISTRY[type] ?? null
}

export function validateBlockRecord(block) {
  if (!isPlainObject(block)) {
    return ['Block must be an object.']
  }

  const errors = []
  if (typeof block.type !== 'string' || block.type.length === 0) {
    errors.push('block.type must be a non-empty string.')
  }
  if (typeof block.block_id !== 'string' || block.block_id.length === 0) {
    errors.push('block.block_id must be a non-empty string.')
  }

  const definition = getBlockDefinition(block.type)
  if (!definition) {
    errors.push(`Unsupported block type: ${block.type}`)
    return errors
  }

  return [...errors, ...definition.validator(block.data)]
}

