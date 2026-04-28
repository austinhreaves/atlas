import { describe, expect, it } from 'vitest'
import { isEmbedUrlAllowed, validateEmbedUrl } from '../embedAllowlist'

describe('embed allowlist', () => {
  it('allows only exact phet host over https', () => {
    expect(isEmbedUrlAllowed('https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html')).toBe(
      true,
    )
  })

  it('rejects non-https, relative, and non-allowlisted hosts', () => {
    expect(validateEmbedUrl('http://phet.colorado.edu/sim').ok).toBe(false)
    expect(validateEmbedUrl('/relative/path').ok).toBe(false)
    expect(validateEmbedUrl('https://www.youtube.com/watch?v=test').ok).toBe(false)
    expect(validateEmbedUrl('https://foo.phet.colorado.edu/sim').ok).toBe(false)
  })
})

