export default function ConceptApplicabilitySection({ selectedNodeId, applicabilityConditions }) {
  if (applicabilityConditions.length === 0) {
    return null
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        Applies When
      </h3>
      <ul className="space-y-1.5 rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 text-sm text-slate-200">
        {applicabilityConditions.map((condition) => (
          <li key={`${selectedNodeId}-applicability-${condition}`} className="leading-relaxed">
            - {condition}
          </li>
        ))}
      </ul>
    </section>
  )
}
