import KatexText from '../../KatexText'

function isMathLikeCaseText(value) {
  if (typeof value !== 'string') {
    return false
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }

  // Heuristic: treat obvious LaTeX, operators, arrows, and symbolic forms as math.
  return /\\[a-zA-Z]+|[_^{}]|->|=>|[=+\-*/<>]|[0-9]/.test(trimmed)
}

export default function ConceptLimitingCasesSection({ selectedNodeId, limitingCases }) {
  if (limitingCases.length === 0) {
    return null
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        Limiting Cases
      </h3>
      <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/50">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] border-b border-slate-700/70 bg-slate-900/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
          <span>Case</span>
          <span>Result</span>
        </div>
        <div className="divide-y divide-slate-800/80">
          {limitingCases.map((limitingCase) => {
            const renderAsMath = isMathLikeCaseText(limitingCase.case)

            return (
              <div
                key={`${selectedNodeId}-limiting-case-${limitingCase.case}`}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 px-3 py-2 text-xs text-slate-200"
              >
                <span className="font-mono text-cyan-200">
                  {renderAsMath ? (
                    <KatexText math={limitingCase.case} />
                  ) : (
                    <span>{limitingCase.case}</span>
                  )}
                </span>
                <span className="leading-relaxed text-slate-300">{limitingCase.result}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
