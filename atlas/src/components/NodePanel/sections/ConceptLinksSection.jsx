import { formatWeight } from '../nodePanel.utils'

export default function ConceptLinksSection({ selectedNodeId, prerequisiteLinks, enablesLinks }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Concept Links</h3>
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            Prerequisites
          </h4>
          {prerequisiteLinks.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-200">
              {prerequisiteLinks.map((link) => (
                <li
                  key={`prerequisite-${selectedNodeId}-${link.id}-${link.type}`}
                  className="flex items-center justify-between gap-3 rounded border border-slate-700/70 bg-slate-900/40 px-2 py-1.5"
                >
                  <span className="truncate">{link.title}</span>
                  <span className="shrink-0 text-slate-400">{`<- (${formatWeight(link.weight)})`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No prerequisite concepts.</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">Enables</h4>
          {enablesLinks.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-200">
              {enablesLinks.map((link) => (
                <li
                  key={`enables-${selectedNodeId}-${link.id}-${link.type}`}
                  className="flex items-center justify-between gap-3 rounded border border-slate-700/70 bg-slate-900/40 px-2 py-1.5"
                >
                  <span className="truncate">{link.title}</span>
                  <span className="shrink-0 text-slate-400">{`(${formatWeight(link.weight)})`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No downstream concepts unlocked yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
