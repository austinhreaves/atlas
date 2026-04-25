export default function ConceptMisconceptionsSection({ selectedNodeId, misconceptions }) {
  if (misconceptions.length === 0) {
    return null
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        Common Misconceptions
      </h3>
      <div className="space-y-2">
        {misconceptions.map((misconception) => (
          <div
            key={`${selectedNodeId}-misconception-${misconception.wrong_model}`}
            className="rounded-lg border border-rose-500/30 bg-rose-950/15 px-3 py-2 text-xs text-slate-200"
          >
            <p className="leading-relaxed text-rose-200">
              <span className="font-semibold italic">Wrong model:</span> {misconception.wrong_model}
            </p>
            <p className="mt-1 leading-relaxed text-slate-200">
              <span className="font-semibold text-emerald-200">Correction:</span>{' '}
              {misconception.correction}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
