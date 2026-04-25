export default function ConceptDescriptionSection({ description }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Description</h3>
      <p className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3 text-sm leading-relaxed text-slate-200">
        {description}
      </p>
    </section>
  )
}
