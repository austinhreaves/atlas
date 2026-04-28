import KatexText from '../KatexText'
import { LAYERS } from '../../data/layers'
import { getVariableTypeLabel } from './nodePanel.utils'

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
  progress = 0,
  isVariableKnown = false,
  onProgressChange,
  onSubdomainClick,
  subdomainLabelById = {},
  subdomainDescriptionById = {},
  tagLabelById = {},
  tagDescriptionById = {},
}) {
  const title = selectedNode?.title ?? selectedNode?.name ?? ''
  const badgeLabel =
    selectedNode?.layer === 'variable'
      ? getVariableTypeLabel(selectedNode?.variable_type)
      : selectedNode?.type
  const formulaInTitle =
    selectedNode?.formula && title.includes(selectedNode.formula) ? selectedNode.formula : null
  const titleParts = formulaInTitle ? title.split(formulaInTitle) : [title]
  const conceptSubdomains =
    selectedNode?.layer === 'concept' && Array.isArray(selectedNode?.sub_domains)
      ? selectedNode.sub_domains
      : []
  const conceptTags =
    selectedNode?.layer === 'concept' && Array.isArray(selectedNode?.tags)
      ? selectedNode.tags
      : []
  const progressLabel =
    typeof LAYERS[selectedNode?.layer]?.progress_label === 'string'
      ? LAYERS[selectedNode.layer].progress_label
      : 'Progress'
  const progressValue =
    typeof progress === 'number' && Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 0

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
          {typeof selectedNode?.domain === 'string' || typeof selectedNode?.subject === 'string' ? (
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
              {[selectedNode?.subject, selectedNode?.domain].filter(Boolean).join(' / ')}
            </p>
          ) : null}
          {conceptSubdomains.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {conceptSubdomains.map((subdomainId) => (
                <button
                  key={subdomainId}
                  type="button"
                  onClick={() => onSubdomainClick?.(subdomainId)}
                  title={subdomainDescriptionById[subdomainId] ?? ''}
                  className="rounded border border-slate-600/70 bg-slate-800/85 px-2 py-0.5 text-[11px] font-medium capitalize tracking-wide text-slate-300 transition hover:bg-slate-700/90"
                >
                  {subdomainLabelById[subdomainId] ?? subdomainId}
                </button>
              ))}
            </div>
          ) : null}
          {conceptTags.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {conceptTags.map((tagId) => (
                <span
                  key={tagId}
                  title={tagDescriptionById[tagId] ?? ''}
                  className="rounded border border-slate-700/80 bg-slate-900/70 px-2 py-0.5 text-[11px] font-medium tracking-wide text-slate-400"
                >
                  {tagLabelById[tagId] ?? tagId}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {progressLabel}
              </span>
              <span className="text-xs font-semibold text-cyan-200">{progressValue}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={progressValue}
                onChange={(event) =>
                  onProgressChange?.(selectedNode.id, Number.parseInt(event.target.value, 10))
                }
                aria-label={`${progressLabel} progress`}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-400"
              />
              <button
                type="button"
                onClick={() => onProgressChange?.(selectedNode.id, 0)}
                className="rounded border border-slate-600/70 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-slate-800/85"
              >
                Reset
              </button>
            </div>
          </div>
          {selectedNode?.layer === 'variable' ? (
            <p className="mt-3 text-xs text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-slate-400">Status: </span>
              {isVariableKnown ? 'Known' : 'Unfamiliar'}
            </p>
          ) : null}
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
