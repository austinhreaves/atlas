import { getConceptDomainCardClass } from './nodes/domainVisuals'

export default function DomainLegend({ rows, collapsed, onToggleCollapsed }) {
  return (
    <section className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="flex w-full items-center justify-between rounded-md border border-slate-700/60 bg-slate-800/70 px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-300 transition hover:bg-slate-700/80"
        aria-expanded={!collapsed}
      >
        <span>Domain Legend</span>
        <span>{collapsed ? 'Show' : 'Hide'}</span>
      </button>
      {!collapsed ? (
        <div className="mt-2 space-y-2">
          {rows.length === 0 ? (
            <p className="text-xs text-slate-400">No visible concepts.</p>
          ) : (
            rows.map((row) => (
              <div
                key={row.domain}
                className="flex items-center justify-between rounded-md border border-slate-700/60 bg-slate-800/50 px-2 py-1.5 text-xs text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-3 w-3 rounded-sm ${getConceptDomainCardClass(
                      row.domain,
                    )}`}
                  />
                  <span className="capitalize">{row.domain}</span>
                </div>
                <span className="rounded border border-slate-600/80 px-1.5 py-0.5 text-[10px] text-slate-300">
                  {row.count}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </section>
  )
}
