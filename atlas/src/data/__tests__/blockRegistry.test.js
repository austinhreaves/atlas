import { describe, expect, it } from 'vitest'
import { getBlockDefinition, validateBlockRecord } from '../blockRegistry'

describe('block registry', () => {
  it('registers all v1 block types', () => {
    expect(getBlockDefinition('markdown-katex')).not.toBeNull()
    expect(getBlockDefinition('image')).not.toBeNull()
    expect(getBlockDefinition('table')).not.toBeNull()
    expect(getBlockDefinition('file-attachment')).not.toBeNull()
    expect(getBlockDefinition('embed-iframe')).not.toBeNull()
    expect(getBlockDefinition('checklist')).not.toBeNull()
    expect(getBlockDefinition('prompt-and-response')).not.toBeNull()
  })

  it('validates minimal valid payload for each registered type', () => {
    const validBlocks = [
      {
        block_id: 'b1',
        type: 'markdown-katex',
        data: { markdown: 'Text with $E=mc^2$' },
      },
      { block_id: 'b2', type: 'image', data: { src: 'https://example.com/x.png', alt: 'alt' } },
      {
        block_id: 'b3',
        type: 'table',
        data: { columns: ['A'], rows: [['1']] },
      },
      {
        block_id: 'b4',
        type: 'file-attachment',
        data: { url: 'https://example.com/file.pdf', label: 'File' },
      },
      {
        block_id: 'b5',
        type: 'embed-iframe',
        data: { url: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html' },
      },
      {
        block_id: 'b6',
        type: 'checklist',
        data: { items: [{ id: 'item-1', text: 'Do thing' }] },
      },
      {
        block_id: 'b7',
        type: 'prompt-and-response',
        data: { prompt: 'Explain reasoning' },
      },
    ]

    validBlocks.forEach((block) => {
      expect(validateBlockRecord(block)).toEqual([])
    })
  })

  it('rejects unsupported block types', () => {
    expect(validateBlockRecord({ block_id: 'x', type: 'unknown', data: {} })).toContain(
      'Unsupported block type: unknown',
    )
  })
})

