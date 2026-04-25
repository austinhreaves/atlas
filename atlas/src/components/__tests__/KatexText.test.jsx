import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import KatexText from '../KatexText'

describe('KatexText', () => {
  it('includes katex class for valid latex', () => {
    const markup = renderToStaticMarkup(<KatexText math="E=mc^2" />)

    expect(markup).toContain('katex')
  })

  it('includes katex-display class when displayMode is true', () => {
    const markup = renderToStaticMarkup(<KatexText math="E=mc^2" displayMode />)

    expect(markup).toContain('katex-display')
  })

  it('renders invalid latex without crashing when throwOnError is false', () => {
    const renderMalformed = () => renderToStaticMarkup(<KatexText math={'\\frac{1'} />)

    expect(renderMalformed).not.toThrow()
    expect(renderMalformed()).toContain('katex-error')
  })
})
