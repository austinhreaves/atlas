import KatexText from '../../KatexText'

export default function ConceptFormulaSection({ formula }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Formula</h3>
      <div className="rounded-lg border border-slate-700/80 bg-slate-950/70 p-3 text-slate-100">
        <KatexText math={formula} displayMode />
      </div>
    </section>
  )
}
