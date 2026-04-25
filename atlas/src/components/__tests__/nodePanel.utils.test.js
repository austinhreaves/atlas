import { describe, expect, it } from 'vitest'
import {
  formatWeight,
  getCausalStructureLabel,
  getScopeBadgeClass,
  getVariableRowClass,
} from '../NodePanel/nodePanel.utils'

describe('nodePanel utils', () => {
  it('returns fallback formatting for invalid link weights', () => {
    expect(formatWeight(undefined)).toBe('0.00')
    expect(formatWeight(Number.NaN)).toBe('0.00')
    expect(formatWeight(0.734)).toBe('0.73')
  })

  it('maps causal structure labels and variable role classes', () => {
    expect(getCausalStructureLabel('symmetric')).toBe('Conservation law')
    expect(getCausalStructureLabel('contextual')).toBe('Bidirectional relationship')
    expect(getCausalStructureLabel('asymmetric')).toBe('driver(s) -> response via parameter(s)')
    expect(getVariableRowClass('driver', false)).toContain('amber')
    expect(getVariableRowClass('response', false)).toContain('sky')
    expect(getVariableRowClass('driver', true)).toContain('emerald')
  })

  it('maps assumptions scope classes', () => {
    expect(getScopeBadgeClass('primary')).toContain('amber')
    expect(getScopeBadgeClass('noted')).toContain('sky')
    expect(getScopeBadgeClass('idealized')).toContain('slate')
  })
})
