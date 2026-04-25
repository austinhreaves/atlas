export default function ConceptPrincipleSection({ principle }) {
  if (!principle) {
    return null
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Principle</h3>
      <p className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-3 text-sm leading-relaxed text-cyan-100">
        {principle}
      </p>
    </section>
  )
}
