import { useMemo, useState } from 'react'

function Chevron({ expanded }) {
  return (
    <span
      className={`inline-block text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      ▾
    </span>
  )
}

/** @param {{ tags?: Array<{id: string, label: string, description: string, review_state: string}>, includeDraftContent?: boolean, activeTags: Set<string>, onToggleTag: (tagId: string) => void, onSelectAllTags: () => void, onClearAllTags: () => void, title?: string }} props */
export default function TagFilterPanel({
  tags = [],
  includeDraftContent = false,
  activeTags = new Set(),
  onToggleTag,
  onSelectAllTags,
  onClearAllTags,
  title = 'Tags',
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleTags = useMemo(
    () =>
      tags.filter((tag) => {
        if (tag.review_state === 'published') {
          return true
        }
        return includeDraftContent && (tag.review_state === 'draft' || tag.review_state === 'reviewed')
      }),
    [includeDraftContent, tags],
  )
  const totalCount = visibleTags.length
  const activeCount = useMemo(
    () => visibleTags.filter((tag) => activeTags.has(tag.id)).length,
    [activeTags, visibleTags],
  )

  if (totalCount === 0) {
    return null
  }

  return (
    <section className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between rounded-md px-1 py-1 text-left transition hover:bg-slate-800/80"
        aria-expanded={expanded}
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          {title} ({activeCount}/{totalCount})
        </span>
        <Chevron expanded={expanded} />
      </button>
      {expanded ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSelectAllTags}
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              activeCount === totalCount
                ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={onClearAllTags}
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              activeCount === 0
                ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
            }`}
          >
            None
          </button>
          {visibleTags.map((tag) => {
            const isActive = activeTags.has(tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onToggleTag?.(tag.id)}
                title={tag.description}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                    : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
                }`}
              >
                {tag.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
