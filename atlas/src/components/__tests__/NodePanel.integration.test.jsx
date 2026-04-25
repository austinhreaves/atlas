// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import NodePanel from '../NodePanel'
import nodes from '../../data/nodes.json'

describe('NodePanel formula rendering - integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it.each(nodes.map((node) => [node.id, node]))(
    'renders formula as KaTeX HTML for node "%s"',
    (_, node) => {
      const { container } = render(<NodePanel selectedNode={node} onClose={() => {}} />)

      // KaTeX root element must exist - proves the component rendered
      // typeset math, not a raw string.
      const katexEl = container.querySelector('.katex')
      expect(
        katexEl,
        `node ${node.id} produced no .katex element - formula may be rendering as raw LaTeX`,
      ).not.toBeNull()

      // Block display wrapper must exist for formula-level rendering.
      const displayEl = container.querySelector('.katex-display')
      expect(displayEl, `node ${node.id} produced no .katex-display element`).not.toBeNull()

      // The raw LaTeX source must NOT appear as visible text content.
      // This is the exact symptom of the original production bug.
      const visibleText = container.textContent || ''
      expect(
        visibleText.includes(node.formula),
        `node ${node.id} leaked raw LaTeX into rendered output: "${node.formula}"`,
      ).toBe(false)
    },
  )

  it('renders every variable symbol as KaTeX inline math', () => {
    const node = nodes.find((candidate) => candidate.variables.length >= 3)
    expect(node).toBeDefined()

    const { container } = render(<NodePanel selectedNode={node} onClose={() => {}} />)
    const katexEls = container.querySelectorAll('.katex')
    expect(katexEls.length).toBeGreaterThanOrEqual(1 + node.variables.length)
  })

  it('renders prerequisites and enables lists when provided', () => {
    const node = nodes[0]
    const prerequisiteLinks = [
      { id: 'electric-field', title: 'Electric Field', type: 'foundational', weight: 0.9 },
    ]
    const enablesLinks = [
      { id: 'gausss-law', title: "Gauss's Law", type: 'supporting', weight: 0.7 },
      { id: 'coulomb-applications', title: "Coulomb's Law Applications", type: 'lateral', weight: 0.5 },
    ]

    const { container } = render(
      <NodePanel
        selectedNode={node}
        prerequisiteLinks={prerequisiteLinks}
        enablesLinks={enablesLinks}
        onClose={() => {}}
      />,
    )

    const text = container.textContent || ''
    expect(text).toContain('Concept Links')
    expect(text).toContain('Prerequisites')
    expect(text).toContain('Electric Field')
    expect(text).toContain('<- (0.90)')
    expect(text).toContain('Enables')
    expect(text).toContain("Gauss's Law")
    expect(text).toContain('(0.70)')
  })

  it('renders empty state text when no prerequisite or enables links are present', () => {
    const node = nodes[3]
    const { container } = render(
      <NodePanel
        selectedNode={node}
        prerequisiteLinks={[]}
        enablesLinks={[]}
        onClose={() => {}}
      />,
    )

    const text = container.textContent || ''
    expect(text).toContain('No prerequisite concepts.')
    expect(text).toContain('No downstream concepts unlocked yet.')
  })
})
