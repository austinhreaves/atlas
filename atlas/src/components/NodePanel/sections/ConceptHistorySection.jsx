export default function ConceptHistorySection({ historicalContext }) {
  if (!historicalContext) {
    return null
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        Historical Context
      </h3>
      <p className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 text-sm leading-relaxed text-slate-300">
        {historicalContext}
      </p>
    </section>
  )
}
