export default function DomainFilterPanel({ allDomains, visibleDomains, onToggleDomain }) {
  return (
    <section className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Domains</div>
      <div className="flex flex-wrap gap-2">
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
