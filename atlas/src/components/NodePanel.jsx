import { BlockMath } from 'react-katex'

function TypeBadge({ type }) {
  return (
    <span className="rounded-md border border-slate-500/60 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200">
      {type}
    </span>
  )
}

/** @param {{ selectedNode: any, onClose: () => void }} props */
export default function NodePanel({ selectedNode, onClose }) {
  return (
    <>
      {!selectedNode ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-20 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
          Select a node to inspect details
        </div>
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-30 h-screen w-full max-w-[440px] border-l border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm transition-transform duration-300 ease-out ${
          selectedNode ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!selectedNode}
      >
        {selectedNode ? (
          <div className="flex h-full flex-col">
            <header className="border-b border-slate-700/80 px-5 py-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-100">
                    {selectedNode.title}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {selectedNode.domain}
                  </p>
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

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Formula
                </h3>
                <div className="rounded-lg border border-slate-700/80 bg-slate-950/70 p-3 text-slate-100">
                  <BlockMath math={selectedNode.formula} />
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Variables
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-700/80">
                  <table className="min-w-full divide-y divide-slate-700 text-left text-xs">
                    <thead className="bg-slate-800/80 text-slate-300">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Symbol</th>
                        <th className="px-3 py-2 font-semibold">Name</th>
                        <th className="px-3 py-2 font-semibold">Unit</th>
                        <th className="px-3 py-2 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/70 text-slate-200">
                      {selectedNode.variables.map((variable) => (
                        <tr key={`${selectedNode.id}-${variable.symbol}`}>
                          <td className="whitespace-nowrap px-3 py-2 font-mono text-cyan-200">
                            {variable.symbol}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">{variable.name}</td>
                          <td className="whitespace-nowrap px-3 py-2">{variable.unit}</td>
                          <td className="px-3 py-2">{variable.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Description
                </h3>
                <p className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3 text-sm leading-relaxed text-slate-200">
                  {selectedNode.description}
                </p>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Visual Scene
                </h3>
                {selectedNode.visual.type === 'phet' && selectedNode.visual.url ? (
                  <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/60">
                    <iframe
                      title={`${selectedNode.title} visual scene`}
                      src={selectedNode.visual.url}
                      className="h-[260px] w-full"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      referrerPolicy="no-referrer"
                    />
                    {selectedNode.visual.caption ? (
                      <p className="border-t border-slate-700 px-3 py-2 text-xs text-slate-400">
                        {selectedNode.visual.caption}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-600 bg-slate-950/50 p-4 text-sm text-slate-400">
                    Visual scene coming soon
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
