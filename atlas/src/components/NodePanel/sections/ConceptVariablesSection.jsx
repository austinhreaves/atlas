import KatexText from '../../KatexText'
import {
  getCausalStructureLabel,
  getVariableRowClass,
} from '../nodePanel.utils'

export default function ConceptVariablesSection({ selectedNode, variableRows }) {
  const isConceptNode = selectedNode?.layer === 'concept'
  const hasUnifiedConservedBand =
    selectedNode?.causal_structure === 'symmetric' &&
    variableRows.length > 0 &&
    variableRows.every((variable) => variable.role === 'conserved')
  const causalStructureLabel = getCausalStructureLabel(selectedNode?.causal_structure)
  const isAsymmetric = selectedNode?.causal_structure === 'asymmetric'

  return (
    <section>
      {isConceptNode ? (
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Variables</h3>
      ) : null}
      {isConceptNode ? (
        <div className="mb-2">
          <span className="inline-flex rounded-md border border-slate-600/70 bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-300">
            {isAsymmetric ? (
              <>
                <span>driver(s)</span>
                <span className="mx-1.5">→</span>
                <span>response via parameter(s)</span>
              </>
            ) : (
              causalStructureLabel
            )}
          </span>
        </div>
      ) : null}
      <div className="space-y-2">
        {variableRows.map((variable) => (
          <div
            key={`${selectedNode.id}-${variable.symbol}`}
            className={`rounded-lg border px-3 py-2 text-xs text-slate-200 ${getVariableRowClass(variable.role, hasUnifiedConservedBand)}`}
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-cyan-200">
                <KatexText math={variable.symbol} />
              </span>
              <span className="rounded border border-slate-500/60 bg-slate-900/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                {variable.role}
              </span>
              <span className="font-semibold text-slate-100">{variable.name}</span>
              <span className="text-slate-400">
                (<KatexText math={variable.unit} />)
              </span>
            </div>
            <p className="leading-relaxed text-slate-300">{variable.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
