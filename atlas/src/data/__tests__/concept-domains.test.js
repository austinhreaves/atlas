import { describe, expect, it } from 'vitest'
import electromagnetismConcepts from '../concepts/electromagnetism.json'
import mechanicsConcepts from '../concepts/mechanics.json'
import { concepts } from '../index'

describe('concept domain file split integrity', () => {
  it('preserves total concept count after per-domain split', () => {
    expect(concepts).toHaveLength(10)
  })

  it('keeps each concept in the file matching its domain', () => {
    expect(mechanicsConcepts.every((concept) => concept.domain === 'mechanics')).toBe(true)
    expect(electromagnetismConcepts.every((concept) => concept.domain === 'electromagnetism')).toBe(
      true,
    )
  })

  it('contains no duplicated concept ids across domain files', () => {
    const allIds = [...electromagnetismConcepts, ...mechanicsConcepts].map((concept) => concept.id)
    expect(new Set(allIds).size).toBe(allIds.length)
  })
})
