import KatexText from '../../KatexText'

function buildAppearsInGroups(selectedNode, appearsInByVariableId, conceptById) {
  const conceptIds = appearsInByVariableId?.[selectedNode.id] ?? []
  const grouped = new Map()

  for (const conceptId of conceptIds) {
    const concept = conceptById.get(conceptId)
    if (!concept) {
      continue
    }
    const domain = typeof concept.domain === 'string' ? concept.domain : 'other'
    if (!grouped.has(domain)) {
      grouped.set(domain, [])
    }
    grouped.get(domain).push({
      id: concept.id,
      title: concept.title ?? concept.id,
    })
  }

  return [...grouped.entries()]
    .map(([domain, concepts]) => ({
      domain,
      concepts: concepts.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain))
}

export default function VariablePanel({
  selectedNode,
  conceptById,
  appearsInByVariableId,
  onSelectEntity,
}) {
  const aliases = Array.isArray(selectedNode.common_aliases) ? selectedNode.common_aliases : []
  const appearsInGroups = buildAppearsInGroups(selectedNode, appearsInByVariableId, conceptById)

  return (
    <>
      <section className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Symbol</h3>
        <div className="text-lg font-semibold text-cyan-200">
          <KatexText math={selectedNode.canonical_symbol} displayMode />
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-100">{selectedNode.name}</p>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Metadata</h3>
        <div className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 text-xs text-slate-200">
          <p>
            <span className="font-semibold text-slate-300">Unit:</span>{' '}
            <KatexText math={selectedNode.unit} />
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-300">Dimension:</span>{' '}
            <KatexText math={selectedNode.dimension} />
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-300">Type:</span> {selectedNode.vector_or_scalar}
          </p>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Description</h3>
        <p className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 text-sm leading-relaxed text-slate-200">
          {selectedNode.description}
        </p>
      </section>

      {selectedNode.sign_convention ? (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Sign Convention
          </h3>
          <p className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 text-xs leading-relaxed text-slate-200">
            {selectedNode.sign_convention}
          </p>
        </section>
      ) : null}

      {aliases.length > 0 ? (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Common Aliases
          </h3>
          <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/50">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="border-b border-slate-700/70 bg-slate-900/60">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-300">Symbol</th>
                  <th className="px-3 py-2 font-semibold text-slate-300">Context</th>
                </tr>
              </thead>
              <tbody>
                {aliases.map((alias, index) => (
                  <tr key={`${selectedNode.id}-alias-${index}`} className="border-b border-slate-800/80">
                    <td className="px-3 py-2">
                      <KatexText math={alias.symbol} />
                    </td>
                    <td className="px-3 py-2 text-slate-300">{alias.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Appears In</h3>
        {appearsInGroups.length > 0 ? (
          <div className="space-y-3">
            {appearsInGroups.map((group) => (
              <div
                key={`${selectedNode.id}-appears-${group.domain}`}
                className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3"
              >
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.domain}
                </h4>
                <ul className="space-y-1.5">
                  {group.concepts.map((concept) => (
                    <li key={`${selectedNode.id}-appears-${concept.id}`}>
                      <button
                        type="button"
                        onClick={() => onSelectEntity(concept.id)}
                        className="w-full rounded border border-slate-700/70 bg-slate-900/40 px-2 py-1.5 text-left text-xs text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-800/70"
                      >
                        {concept.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-slate-700/80 bg-slate-950/50 p-3 text-xs text-slate-400">
            No linked concepts found for this variable.
          </p>
        )}
      </section>
    </>
  )
}
