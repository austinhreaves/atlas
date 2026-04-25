import { useEffect, useMemo, useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import katex from 'katex'
import { isUnderstood, setUnderstood } from '../lib/understanding'

function TypeBadge({ type }) {
  return (
    <span className="rounded-md border border-slate-500/60 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200">
      {type}
    </span>
  )
}

/** @param {{ selectedNode: any, onClose: () => void, onUnderstandingChange?: () => void }} props */
export default function NodePanel({ selectedNode, onClose, onUnderstandingChange }) {
  const [showIdealizedAssumptions, setShowIdealizedAssumptions] = useState(false)
  const [katexFontVersion, setKatexFontVersion] = useState(0)
  const debugRunId = import.meta.env.DEV ? 'dev' : 'preview'

  function sendDebugLog(hypothesisId, location, message, data) {
    // #region agent log
    fetch('http://127.0.0.1:7345/ingest/ca2f758a-0dbe-41e4-ae1c-34dcf25cdf07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0c833b'},body:JSON.stringify({sessionId:'0c833b',runId:debugRunId,hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{})
    // #endregion
  }

  useEffect(() => {
    if (!selectedNode?.formula) {
      return
    }

    const formula = selectedNode.formula
    sendDebugLog('H1/H3', 'src/components/NodePanel.jsx:formula-input', 'Formula passed to BlockMath', {
      nodeId: selectedNode.id,
      title: selectedNode.title,
      formula,
      length: formula.length,
      charCodes: Array.from(formula).map((char) => char.charCodeAt(0)),
    })

    try {
      katex.renderToString(formula, { throwOnError: true, displayMode: true })
      sendDebugLog('H2/H4', 'src/components/NodePanel.jsx:katex-parse', 'KaTeX parse success', {
        nodeId: selectedNode.id,
        title: selectedNode.title,
      })
    } catch (error) {
      sendDebugLog('H2/H4', 'src/components/NodePanel.jsx:katex-parse', 'KaTeX parse error', {
        nodeId: selectedNode.id,
        title: selectedNode.title,
        errorName: error?.name ?? 'UnknownError',
        errorMessage: error?.message ?? 'Unknown message',
        formula,
      })
    }
  }, [selectedNode, debugRunId])

  useEffect(() => {
    if (!selectedNode?.formula || !document.fonts?.load) {
      return
    }

    const formulasThatNeedSizeFonts = selectedNode.formula.includes('\\frac')
    if (!formulasThatNeedSizeFonts) {
      return
    }

    sendDebugLog('H10', 'src/components/NodePanel.jsx:katex-font-load', 'Starting explicit KaTeX font preload', {
      nodeId: selectedNode.id,
      title: selectedNode.title,
      host: window.location.host,
    })

    Promise.all([
      document.fonts.load('16px KaTeX_Main'),
      document.fonts.load('16px KaTeX_Math'),
      document.fonts.load('16px KaTeX_Size1'),
      document.fonts.load('16px KaTeX_Size2'),
      document.fonts.load('16px KaTeX_Size3'),
      document.fonts.load('16px KaTeX_Size4'),
    ]).then(() => {
      sendDebugLog('H10', 'src/components/NodePanel.jsx:katex-font-load', 'Finished explicit KaTeX font preload', {
        nodeId: selectedNode.id,
        title: selectedNode.title,
        kaTeXMainReady: document.fonts.check('16px KaTeX_Main'),
        kaTeXMathReady: document.fonts.check('16px KaTeX_Math'),
        kaTeXSize1Ready: document.fonts.check('16px KaTeX_Size1'),
        kaTeXSize2Ready: document.fonts.check('16px KaTeX_Size2'),
        kaTeXSize3Ready: document.fonts.check('16px KaTeX_Size3'),
        kaTeXSize4Ready: document.fonts.check('16px KaTeX_Size4'),
        host: window.location.host,
      })
      setKatexFontVersion((value) => value + 1)
    })
  }, [selectedNode, debugRunId])

  useEffect(() => {
    if (!selectedNode?.formula) {
      return
    }

    const container = document.querySelector('aside')
    const katexElement = container?.querySelector('.katex') ?? null
    const katexMathml = container?.querySelector('.katex-mathml') ?? null
    const katexHtml = container?.querySelector('.katex-html') ?? null
    const fracLine = container?.querySelector('.katex .frac-line') ?? null

    if (!katexElement || !katexMathml || !katexHtml) {
      sendDebugLog(
        'H6/H8',
        'src/components/NodePanel.jsx:katex-dom',
        'KaTeX DOM structure missing in panel',
        {
          nodeId: selectedNode.id,
          title: selectedNode.title,
          hasKatex: Boolean(katexElement),
          hasMathml: Boolean(katexMathml),
          hasHtmlLayer: Boolean(katexHtml),
          stylesheetCount: Array.from(document.styleSheets).length,
          host: window.location.host,
        },
      )
      return
    }

    const mathmlStyle = window.getComputedStyle(katexMathml)
    const htmlStyle = window.getComputedStyle(katexHtml)
    const styleSheetHrefs = Array.from(document.styleSheets)
      .map((styleSheet) => styleSheet.href)
      .filter(Boolean)
      .slice(0, 20)

    sendDebugLog(
      'H6/H8',
      'src/components/NodePanel.jsx:katex-dom',
      'KaTeX DOM and stylesheet state',
      {
        nodeId: selectedNode.id,
        title: selectedNode.title,
        mathmlDisplay: mathmlStyle.display,
        mathmlPosition: mathmlStyle.position,
        htmlDisplay: htmlStyle.display,
        htmlWhiteSpace: htmlStyle.whiteSpace,
        hasKatexStylesheet: styleSheetHrefs.some((href) => href.includes('index-') || href.includes('katex')),
        styleSheetHrefs,
        host: window.location.host,
      },
    )

    if (fracLine) {
      const fracLineStyle = window.getComputedStyle(fracLine)
      sendDebugLog(
        'H9',
        'src/components/NodePanel.jsx:katex-frac-line',
        'KaTeX fraction line computed style',
        {
          nodeId: selectedNode.id,
          title: selectedNode.title,
          borderBottomStyle: fracLineStyle.borderBottomStyle,
          borderBottomWidth: fracLineStyle.borderBottomWidth,
          minHeight: fracLineStyle.minHeight,
          height: fracLineStyle.height,
          display: fracLineStyle.display,
          host: window.location.host,
        },
      )
    }

    if (document.fonts?.check) {
      sendDebugLog(
        'H7',
        'src/components/NodePanel.jsx:katex-fonts',
        'KaTeX font readiness',
        {
          nodeId: selectedNode.id,
          title: selectedNode.title,
          kaTeXMainReady: document.fonts.check('16px KaTeX_Main'),
          kaTeXMathReady: document.fonts.check('16px KaTeX_Math'),
          kaTeXSizeReady: document.fonts.check('16px KaTeX_Size1'),
          host: window.location.host,
        },
      )
    }
  }, [selectedNode, debugRunId])

  const variableRows = selectedNode?.variables ?? []
  const hasUnifiedConservedBand =
    selectedNode?.causal_structure === 'symmetric' &&
    variableRows.length > 0 &&
    variableRows.every((variable) => variable.role === 'conserved')

  const idealizations = selectedNode?.idealizations ?? []
  const visibleIdealizations = useMemo(
    () => idealizations.filter((idealization) => idealization.scope !== 'idealized'),
    [idealizations],
  )
  const idealizedAssumptions = useMemo(
    () => idealizations.filter((idealization) => idealization.scope === 'idealized'),
    [idealizations],
  )

  const causalStructureLabel =
    selectedNode?.causal_structure === 'symmetric'
      ? 'Conservation law'
      : selectedNode?.causal_structure === 'contextual'
        ? 'Bidirectional relationship'
        : 'driver(s) -> response via parameter(s)'

  function getVariableRowClass(role) {
    if (hasUnifiedConservedBand) {
      return 'border-emerald-400/25 bg-emerald-500/10'
    }
    if (role === 'driver') {
      return 'border-amber-400/30 bg-amber-500/10'
    }
    if (role === 'response') {
      return 'border-sky-400/30 bg-sky-500/10'
    }
    if (role === 'covariate') {
      return 'border-slate-500/40 bg-slate-800/40 italic text-slate-300'
    }
    if (role === 'conserved') {
      return 'border-emerald-400/25 bg-emerald-500/10'
    }
    return 'border-slate-600/50 bg-slate-800/40'
  }

  function getScopeBadgeClass(scope) {
    if (scope === 'primary') {
      return 'border-amber-400/30 bg-amber-500/15 text-amber-200'
    }
    if (scope === 'noted') {
      return 'border-sky-400/30 bg-sky-500/15 text-sky-200'
    }
    return 'border-slate-600/60 bg-slate-800/70 text-slate-300'
  }

  return (
    <>
      {!selectedNode ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-20 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
          Select a node to inspect details
        </div>
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-30 h-screen w-full max-w-[440px] border-l border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm transition-transform duration-300 ease-out ${
          selectedNode ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!selectedNode}
      >
        {selectedNode ? (
          <div className="flex h-full flex-col">
            <header className="border-b border-slate-700/80 px-5 py-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-100">
                    {selectedNode.title}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {selectedNode.domain}
                  </p>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isUnderstood(selectedNode.id)}
                      onChange={(event) => {
                        setUnderstood(selectedNode.id, event.target.checked)
                        if (typeof onUnderstandingChange === 'function') {
                          onUnderstandingChange()
                        }
                      }}
                      className="h-3.5 w-3.5 rounded border-slate-500 bg-slate-800 text-cyan-400 focus:ring-cyan-400/60"
                    />
                    <span>I understand this concept.</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
              <TypeBadge type={selectedNode.type} />
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Formula
                </h3>
                <div className="rounded-lg border border-slate-700/80 bg-slate-950/70 p-3 text-slate-100">
                  <BlockMath key={`${selectedNode.id}-${katexFontVersion}`} math={selectedNode.formula} />
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Variables
                </h3>
                <div className="mb-2">
                  <span className="inline-flex rounded-md border border-slate-600/70 bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    {causalStructureLabel}
                  </span>
                </div>
                <div className="space-y-2">
                  {variableRows.map((variable) => (
                    <div
                      key={`${selectedNode.id}-${variable.symbol}`}
                      className={`rounded-lg border px-3 py-2 text-xs text-slate-200 ${getVariableRowClass(variable.role)}`}
                    >
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-cyan-200">
                          <InlineMath math={variable.symbol} />
                        </span>
                        <span className="rounded border border-slate-500/60 bg-slate-900/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                          {variable.role}
                        </span>
                        <span className="font-semibold text-slate-100">{variable.name}</span>
                        <span className="text-slate-400">({variable.unit})</span>
                      </div>
                      <p className="leading-relaxed text-slate-300">{variable.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {idealizations.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                    Simplifying assumptions
                  </h3>
                  <div className="space-y-2">
                    {visibleIdealizations.map((idealization) => (
                      <div
                        key={`${selectedNode.id}-idealization-${idealization.name}`}
                        className="rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2 text-xs text-slate-200"
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-100">{idealization.name}</span>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getScopeBadgeClass(idealization.scope)}`}
                          >
                            {idealization.scope}
                          </span>
                        </div>
                        {idealization.note ? (
                          <p className="leading-relaxed text-slate-300">{idealization.note}</p>
                        ) : null}
                      </div>
                    ))}

                    {idealizedAssumptions.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setShowIdealizedAssumptions((value) => !value)}
                        className="text-xs font-semibold text-slate-400 underline decoration-slate-600 underline-offset-2 transition hover:text-slate-300"
                      >
                        Show simplifying assumptions ({idealizedAssumptions.length})
                      </button>
                    ) : null}

                    {showIdealizedAssumptions
                      ? idealizedAssumptions.map((idealization) => (
                          <div
                            key={`${selectedNode.id}-idealized-assumption-${idealization.name}`}
                            className="rounded-lg border border-slate-700/60 bg-slate-950/40 px-3 py-2 text-xs italic text-slate-400"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-semibold">{idealization.name}</span>
                              <span className="rounded border border-slate-600/60 bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {idealization.scope}
                              </span>
                            </div>
                            {idealization.note ? (
                              <p className="leading-relaxed">{idealization.note}</p>
                            ) : null}
                          </div>
                        ))
                      : null}
                  </div>
                </section>
              ) : null}

              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Description
                </h3>
                <p className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3 text-sm leading-relaxed text-slate-200">
                  {selectedNode.description}
                </p>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Visual Scene
                </h3>
                {selectedNode.visual.type === 'phet' && selectedNode.visual.url ? (
                  <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/60">
                    <iframe
                      title={`${selectedNode.title} visual scene`}
                      src={selectedNode.visual.url}
                      className="h-[260px] w-full"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      referrerPolicy="no-referrer"
                    />
                    {selectedNode.visual.caption ? (
                      <p className="border-t border-slate-700 px-3 py-2 text-xs text-slate-400">
                        {selectedNode.visual.caption}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-600 bg-slate-950/50 p-4 text-sm text-slate-400">
                    Visual scene coming soon
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
