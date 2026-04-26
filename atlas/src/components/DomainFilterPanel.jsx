export default function DomainFilterPanel({
  allDomains,
  allDomainKeys = new Set(allDomains),
  visibleDomains,
  onToggleDomain,
  onSelectAllDomains,
  onClearAllDomains,
}) {
  const hasDomains = allDomains.length > 0
  const allVisible =
    hasDomains &&
    Array.from(allDomainKeys).every((domain) => visibleDomains.has(domain))
  const noneVisible = visibleDomains.size === 0

  return (
    <section className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Domains</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelectAllDomains}
          disabled={!hasDomains}
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            !hasDomains
              ? 'cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500'
              : allVisible
                ? 'border-slate-700 bg-slate-800/70 text-slate-500'
                : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={onClearAllDomains}
          disabled={!hasDomains}
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            !hasDomains
              ? 'cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500'
              : noneVisible
                ? 'border-slate-700 bg-slate-800/70 text-slate-500'
                : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
          }`}
        >
          None
        </button>
        {allDomains.map((domain) => {
          const active = visibleDomains.has(domain)
          return (
            <button
              key={domain}
              type="button"
              onClick={() => onToggleDomain(domain)}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize tracking-wide transition ${
                active
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                  : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
              }`}
            >
              {domain}
            </button>
          )
        })}
      </div>
    </section>
  )
}
