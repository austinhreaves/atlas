import { getScopeBadgeClass } from '../nodePanel.utils'

export default function ConceptAssumptionsSection({
  selectedNodeId,
  visibleIdealizations,
  idealizedAssumptions,
  showIdealizedAssumptions,
  setShowIdealizedAssumptions,
}) {
  if (visibleIdealizations.length === 0 && idealizedAssumptions.length === 0) {
    return null
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        Simplifying assumptions
      </h3>
      <div className="space-y-2">
        {visibleIdealizations.map((idealization) => (
          <div
            key={`${selectedNodeId}-idealization-${idealization.name}`}
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
            {idealization.note ? <p className="leading-relaxed text-slate-300">{idealization.note}</p> : null}
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
                key={`${selectedNodeId}-idealized-assumption-${idealization.name}`}
                className="rounded-lg border border-slate-700/60 bg-slate-950/40 px-3 py-2 text-xs italic text-slate-400"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold">{idealization.name}</span>
                  <span className="rounded border border-slate-600/60 bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {idealization.scope}
                  </span>
                </div>
                {idealization.note ? <p className="leading-relaxed">{idealization.note}</p> : null}
              </div>
            ))
          : null}
      </div>
    </section>
  )
}
