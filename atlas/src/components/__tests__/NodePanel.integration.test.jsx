// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, cleanup } from '@testing-library/react'
import NodePanel from '../NodePanel'
import nodes from '../../data/concepts.json'
import variables from '../../data/variables.json'

describe('NodePanel formula rendering - integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  function setViewportWidth(width) {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    })
  }

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

  it('hides formula section and uses definition copy for variable nodes', () => {
    const variableNode = variables[0]
    const { container } = render(<NodePanel selectedNode={variableNode} onClose={() => {}} />)
    const text = container.textContent || ''

    expect(text).not.toContain('Formula')
    expect(text).toContain('I understand this definition.')
    expect(text).toContain('Description')
    expect(text).toContain(variableNode.description)
    expect(text).not.toContain('Variables')
    expect(text).not.toContain('driver(s)')
    expect(text).not.toContain('response via parameter(s)')
  })

  it('renders asymmetric causal arrow and variable units with KaTeX', () => {
    const node = nodes.find((candidate) => candidate.id === 'ohms-law')
    expect(node).toBeDefined()

    const { container } = render(<NodePanel selectedNode={node} onClose={() => {}} />)
    const text = container.textContent || ''

    expect(text).toContain('driver(s)')
    expect(text).toContain('→')
    expect(text).toContain('response via parameter(s)')
    expect(container.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(1 + node.variables.length)
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

  it('renders Phase 3a concept sections when data is present', () => {
    const node = nodes.find((candidate) => candidate.id === 'newtons-second-law')
    expect(node).toBeDefined()

    const { container } = render(<NodePanel selectedNode={node} onClose={() => {}} />)
    const text = container.textContent || ''

    expect(text).toContain('Principle')
    expect(text).toContain(node.principle)
    expect(text).toContain('Applies When')
    expect(text).toContain('Limiting Cases')
    expect(text).toContain('Common Misconceptions')
    expect(text).toContain('Historical Context')
    expect(text).toContain('Wrong model:')
    expect(text).toContain('Correction:')
  })

  it('omits optional Phase 3a section shells when data is absent', () => {
    const node = nodes.find((candidate) => candidate.id === 'work-energy-theorem')
    expect(node).toBeDefined()

    const { container } = render(<NodePanel selectedNode={node} onClose={() => {}} />)
    const text = container.textContent || ''

    expect(text).toContain('Principle')
    expect(text).toContain('Limiting Cases')
    expect(text).not.toContain('Applies When')
    expect(text).not.toContain('Common Misconceptions')
    expect(text).not.toContain('Historical Context')
  })

  it('renders limiting-case case text as plain text or KaTeX based on content', () => {
    const plainNode = nodes.find((candidate) => candidate.id === 'conservation-of-momentum')
    const mathNode = nodes.find((candidate) => candidate.id === 'newtons-second-law')
    expect(plainNode).toBeDefined()
    expect(mathNode).toBeDefined()

    const plainRender = render(<NodePanel selectedNode={plainNode} onClose={() => {}} />)
    const plainSection = Array.from(plainRender.container.querySelectorAll('section')).find((section) =>
      section.textContent?.includes('Limiting Cases'),
    )
    expect(plainSection).toBeDefined()

    const plainCaseSpan = Array.from(plainSection.querySelectorAll('span')).find(
      (span) => span.textContent === 'Perfectly isolated system',
    )
    expect(plainCaseSpan).toBeDefined()
    expect(plainCaseSpan.querySelector('.katex')).toBeNull()

    const mathRender = render(<NodePanel selectedNode={mathNode} onClose={() => {}} />)
    const mathSection = Array.from(mathRender.container.querySelectorAll('section')).find((section) =>
      section.textContent?.includes('Limiting Cases'),
    )
    expect(mathSection).toBeDefined()

    const mathCaseCell = Array.from(mathSection.querySelectorAll('div')).find((node) =>
      node.textContent?.includes('m'),
    )
    expect(mathCaseCell?.querySelector('.katex')).not.toBeNull()
  })

  it('renders resize handle only when panel is open', () => {
    const node = nodes[0]
    const panel = render(<NodePanel selectedNode={null} onClose={() => {}} />)
    expect(panel.queryByTestId('node-panel-resize-handle')).toBeNull()

    panel.rerender(<NodePanel selectedNode={node} onClose={() => {}} />)
    expect(panel.getByTestId('node-panel-resize-handle')).not.toBeNull()
  })

  it('renders bottom-sheet mode and hides resize affordance on mobile', () => {
    setViewportWidth(375)
    const node = nodes[0]
    const panel = render(<NodePanel selectedNode={node} isMobile onClose={() => {}} />)

    expect(panel.queryByTestId('node-panel-resize-handle')).toBeNull()
    const sheet = panel.container.querySelector('aside')
    expect(sheet).not.toBeNull()
    expect(sheet.className).toContain('inset-x-0')
    expect(sheet.className).toContain('translate-y-0')
  })

  it('bypasses desktop min-width clamp logic in mobile mode', () => {
    setViewportWidth(375)
    const node = nodes[0]
    const panel = render(
      <NodePanel selectedNode={node} panelWidth={920} isMobile onClose={() => {}} />,
    )

    const sheet = panel.container.querySelector('aside')
    expect(sheet).not.toBeNull()
    expect(sheet.style.width).toBe('')
  })

  it('dragging resize handle updates width with right-anchored directionality', () => {
    setViewportWidth(1200)
    const node = nodes[0]
    const onPanelWidthChange = vi.fn()
    const { getByTestId } = render(
      <NodePanel
        selectedNode={node}
        panelWidth={440}
        onPanelWidthChange={onPanelWidthChange}
        onClose={() => {}}
      />,
    )

    const handle = getByTestId('node-panel-resize-handle')
    fireEvent.pointerDown(handle, { clientX: 1000 })
    fireEvent.pointerMove(window, { clientX: 900 })
    fireEvent.pointerMove(window, { clientX: 1100 })

    expect(onPanelWidthChange).toHaveBeenNthCalledWith(1, 540)
    expect(onPanelWidthChange).toHaveBeenNthCalledWith(2, 360)
  })

  it('clamps width at bounds including narrow viewport edge case', () => {
    const node = nodes[0]
    const onPanelWidthChange = vi.fn()
    const { getByTestId, rerender } = render(
      <NodePanel
        selectedNode={node}
        panelWidth={440}
        onPanelWidthChange={onPanelWidthChange}
        onClose={() => {}}
      />,
    )
    const handle = getByTestId('node-panel-resize-handle')

    setViewportWidth(1200)
    fireEvent.pointerDown(handle, { clientX: 1000 })
    fireEvent.pointerMove(window, { clientX: 0 })
    fireEvent.pointerMove(window, { clientX: 2000 })
    fireEvent.pointerUp(window)
    expect(onPanelWidthChange).toHaveBeenNthCalledWith(1, 660)
    expect(onPanelWidthChange).toHaveBeenNthCalledWith(2, 360)

    onPanelWidthChange.mockClear()
    setViewportWidth(500)
    rerender(
      <NodePanel
        selectedNode={node}
        panelWidth={440}
        onPanelWidthChange={onPanelWidthChange}
        onClose={() => {}}
      />,
    )
    fireEvent.pointerDown(handle, { clientX: 1000 })
    fireEvent.pointerMove(window, { clientX: 0 })
    expect(onPanelWidthChange).toHaveBeenCalledWith(275)
  })

  it('cleans up drag listeners on pointer release and unmount', () => {
    setViewportWidth(1200)
    const node = nodes[0]
    const onPanelWidthChange = vi.fn()
    const { getByTestId, unmount } = render(
      <NodePanel
        selectedNode={node}
        panelWidth={440}
        onPanelWidthChange={onPanelWidthChange}
        onClose={() => {}}
      />,
    )
    const handle = getByTestId('node-panel-resize-handle')

    fireEvent.pointerDown(handle, { clientX: 1000 })
    fireEvent.pointerMove(window, { clientX: 900 })
    fireEvent.pointerUp(window)
    const releaseCallCount = onPanelWidthChange.mock.calls.length
    fireEvent.pointerMove(window, { clientX: 800 })
    expect(onPanelWidthChange.mock.calls.length).toBe(releaseCallCount)

    fireEvent.pointerDown(handle, { clientX: 1000 })
    unmount()
    const unmountCallCount = onPanelWidthChange.mock.calls.length
    fireEvent.pointerMove(window, { clientX: 700 })
    expect(onPanelWidthChange.mock.calls.length).toBe(unmountCallCount)
  })

  it('shows fullscreen toggle only for PhET visuals', () => {
    const phetNode = nodes.find((candidate) => candidate.visual?.type === 'phet' && candidate.visual?.url)
    const nonPhetNode = nodes.find(
      (candidate) => candidate.visual?.type !== 'phet' || !candidate.visual?.url,
    )
    expect(phetNode).toBeDefined()
    expect(nonPhetNode).toBeDefined()

    const panel = render(<NodePanel selectedNode={phetNode} onClose={() => {}} />)
    expect(panel.queryByRole('button', { name: 'Fullscreen' })).not.toBeNull()

    panel.rerender(<NodePanel selectedNode={nonPhetNode} onClose={() => {}} />)
    expect(panel.queryByRole('button', { name: 'Fullscreen' })).toBeNull()
  })

  it('invokes request and exit fullscreen from toggle', () => {
    const phetNode = nodes.find((candidate) => candidate.visual?.type === 'phet' && candidate.visual?.url)
    expect(phetNode).toBeDefined()

    let fullscreenElement = null
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    })

    const requestFullscreenMock = vi.fn(function requestFullscreen() {
      fullscreenElement = this
      document.dispatchEvent(new Event('fullscreenchange'))
      return Promise.resolve()
    })
    const exitFullscreenMock = vi.fn(() => {
      fullscreenElement = null
      document.dispatchEvent(new Event('fullscreenchange'))
      return Promise.resolve()
    })
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreenMock,
    })
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFullscreenMock,
    })

    const panel = render(<NodePanel selectedNode={phetNode} onClose={() => {}} />)
    fireEvent.click(panel.getByRole('button', { name: 'Fullscreen' }))
    expect(requestFullscreenMock).toHaveBeenCalledTimes(1)
    expect(panel.queryByRole('button', { name: 'Exit fullscreen' })).not.toBeNull()

    fireEvent.click(panel.getByRole('button', { name: 'Exit fullscreen' }))
    expect(exitFullscreenMock).toHaveBeenCalledTimes(1)
  })

  it('syncs fullscreen label with fullscreenchange events', () => {
    const phetNode = nodes.find((candidate) => candidate.visual?.type === 'phet' && candidate.visual?.url)
    expect(phetNode).toBeDefined()

    let fullscreenElement = null
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    })
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: vi.fn(() => Promise.resolve()),
    })
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn(() => Promise.resolve()),
    })

    const panel = render(<NodePanel selectedNode={phetNode} onClose={() => {}} />)
    const target = panel.getByRole('button', { name: 'Fullscreen' }).parentElement
    expect(target).not.toBeNull()

    fullscreenElement = target
    fireEvent(document, new Event('fullscreenchange'))
    expect(panel.queryByRole('button', { name: 'Exit fullscreen' })).not.toBeNull()

    fullscreenElement = null
    fireEvent(document, new Event('fullscreenchange'))
    expect(panel.queryByRole('button', { name: 'Fullscreen' })).not.toBeNull()
  })

  it('applies fullscreen sizing and restores inline sizing on exit', () => {
    const phetNode = nodes.find((candidate) => candidate.visual?.type === 'phet' && candidate.visual?.url)
    expect(phetNode).toBeDefined()

    let fullscreenElement = null
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    })
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: vi.fn(() => Promise.resolve()),
    })
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn(() => Promise.resolve()),
    })

    const panel = render(<NodePanel selectedNode={phetNode} onClose={() => {}} />)
    const shell = panel.getByTestId('phet-visual-shell')
    const iframe = panel.getByTestId('phet-visual-iframe')

    expect(shell.className).toContain('rounded-lg')
    expect(shell.className).not.toContain('h-screen')
    expect(iframe.className).toContain('h-[260px]')

    fullscreenElement = shell
    fireEvent(document, new Event('fullscreenchange'))
    expect(shell.className).toContain('h-screen')
    expect(shell.className).toContain('rounded-none')
    expect(iframe.className).toContain('h-full')

    fullscreenElement = null
    fireEvent(document, new Event('fullscreenchange'))
    expect(shell.className).toContain('rounded-lg')
    expect(shell.className).not.toContain('h-screen')
    expect(iframe.className).toContain('h-[260px]')
  })
})
