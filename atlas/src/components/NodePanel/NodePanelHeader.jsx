import KatexText from '../KatexText'
import { isUnderstood, setUnderstood } from '../../lib/understanding'

function TypeBadge({ type }) {
  return (
    <span className="rounded-md border border-slate-500/60 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200">
      {type}
    </span>
  )
}

export default function NodePanelHeader({ selectedNode, onClose, onUnderstandingChange }) {
  const title = selectedNode?.title ?? ''
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
              selectedNode.title
            )}
          </h2>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{selectedNode.domain}</p>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={isUnderstood(selectedNode.id)}
              onChange={(event) => {
                setUnderstood(selectedNode.id, event.target.checked)
                if (typeof onUnderstandingChange === 'function') {
                  onUnderstandingChange()
                }
              }}
              className="h-3.5 w-3.5 rounded border-slate-500 bg-slate-800 text-cyan-400 focus:ring-cyan-400/60"
            />
            <span>I understand this concept.</span>
          </label>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-200 transition hover:bg-slate-700"
        >
          Close
        </button>
      </div>
      <TypeBadge type={selectedNode.type} />
    </header>
  )
}
