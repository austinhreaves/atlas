import KatexText from '../KatexText'
import { getVariableTypeLabel } from './nodePanel.utils'

const UNDERSTANDING_OPTIONS = [
  { value: 'seen', label: 'Seen' },
  { value: 'recognize', label: 'Recognize' },
  { value: 'apply', label: 'Apply' },
  { value: 'derive', label: 'Derive' },
]

function TypeBadge({ type }) {
  return (
    <span className="rounded-md border border-slate-500/60 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200">
      {type}
    </span>
  )
}

export default function NodePanelHeader({
  selectedNode,
  onClose,
  understandingState = 'unseen',
  isVariableKnown = false,
  onUnderstandingStateChange,
}) {
  const title = selectedNode?.title ?? selectedNode?.name ?? ''
  const badgeLabel =
    selectedNode?.layer === 'variable'
      ? getVariableTypeLabel(selectedNode?.variable_type)
      : selectedNode?.type
  const formulaInTitle =
    selectedNode?.formula && title.includes(selectedNode.formula) ? selectedNode.formula : null
  const titleParts = formulaInTitle ? title.split(formulaInTitle) : [title]

  return (
    <header className="border-b border-slate-700/80 px-5 py-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            {formulaInTitle ? (
              <>
                {titleParts[0]}
                <KatexText math={formulaInTitle} />
                {titleParts.slice(1).join(formulaInTitle)}
              </>
            ) : (
              title
            )}
          </h2>
          {typeof selectedNode?.domain === 'string' ? (
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{selectedNode.domain}</p>
          ) : null}
          {selectedNode?.layer === 'concept' ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Understanding
              </span>
              <div
                className="inline-flex overflow-hidden rounded-md border border-slate-600/70"
                role="group"
                aria-label="Concept understanding"
              >
                {UNDERSTANDING_OPTIONS.map((option) => {
                  const selected = understandingState === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onUnderstandingStateChange?.(selectedNode.id, option.value)}
                      aria-pressed={selected}
                      className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide transition ${
                        selected
                          ? 'bg-cyan-500/25 text-cyan-100'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() => onUnderstandingStateChange?.(selectedNode.id, 'unseen')}
                className="rounded border border-slate-600/70 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-slate-800/85"
              >
                Reset
              </button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-slate-400">Status: </span>
              {isVariableKnown ? 'Known' : 'Unfamiliar'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-200 transition hover:bg-slate-700"
        >
          Close
        </button>
      </div>
      <TypeBadge type={badgeLabel} />
    </header>
  )
}
