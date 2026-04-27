import { useMemo, useState } from 'react'

/** @param {{ isOpen: boolean, onClose: () => void, instructorEntries: Array<any>, instructorUnavailable?: boolean, topicCatalog: Array<any>, onLoadInstructor: (entry: any) => void | Promise<void>, onLoadTopicSubgraph: (topic: string) => void, onLoadBlankTemplate: (topic: string) => void }} props */
export default function LibraryBrowser({
  isOpen,
  onClose,
  instructorEntries,
  instructorUnavailable = false,
  topicCatalog,
  onLoadInstructor,
  onLoadTopicSubgraph,
  onLoadBlankTemplate,
}) {
  const [activeTab, setActiveTab] = useState('instructor')
  const groupedTopics = useMemo(() => topicCatalog, [topicCatalog])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
      <div className="w-full max-w-5xl rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Load from library</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-100 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <button type="button" onClick={() => setActiveTab('instructor')} className="rounded-md border border-slate-600 px-3 py-1 text-sm text-slate-100">Instructor maps</button>
          <button type="button" onClick={() => setActiveTab('subgraph')} className="rounded-md border border-slate-600 px-3 py-1 text-sm text-slate-100">Topic subgraphs</button>
          <button type="button" onClick={() => setActiveTab('blank')} className="rounded-md border border-slate-600 px-3 py-1 text-sm text-slate-100">Blank templates</button>
        </div>

        {activeTab === 'instructor' ? (
          <div className="grid gap-3 md:grid-cols-2">
            {instructorUnavailable ? <p className="text-sm text-slate-400">No instructor maps available.</p> : null}
            {!instructorUnavailable && instructorEntries.length === 0 ? (
              <p className="text-sm text-slate-400">No instructor maps available.</p>
            ) : null}
            {instructorEntries.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="font-semibold text-slate-100">{entry.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{entry.description ?? 'No description'}</p>
                <p className="mt-1 text-xs text-slate-400">Author: {entry.author}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Nodes: {entry.node_count ?? 'n/a'} | Edges: {entry.edge_count ?? 'n/a'}
                </p>
                <button type="button" onClick={() => onLoadInstructor(entry)} className="mt-3 rounded-md border border-cyan-500/60 bg-cyan-700/30 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-700/50">
                  Load
                </button>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'subgraph' ? (
          <div className="grid gap-3 md:grid-cols-2">
            {groupedTopics.map((topic) => (
              <article key={`${topic.domain}-${topic.topic}-sub`} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="font-semibold text-slate-100">{topic.topic}</h3>
                <p className="mt-1 text-xs text-slate-400">{topic.domain}</p>
                <p className="mt-1 text-xs text-slate-400">{topic.nodeCount} nodes</p>
                <button type="button" onClick={() => onLoadTopicSubgraph(topic.topic)} className="mt-3 rounded-md border border-cyan-500/60 bg-cyan-700/30 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-700/50">
                  Load
                </button>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'blank' ? (
          <div className="grid gap-3 md:grid-cols-2">
            {groupedTopics.map((topic) => (
              <article key={`${topic.domain}-${topic.topic}-blank`} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="font-semibold text-slate-100">{topic.topic}</h3>
                <p className="mt-1 text-xs text-slate-400">{topic.domain}</p>
                <p className="mt-1 text-xs text-slate-400">{topic.nodeCount} nodes available</p>
                <button type="button" onClick={() => onLoadBlankTemplate(topic.topic)} className="mt-3 rounded-md border border-cyan-500/60 bg-cyan-700/30 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-700/50">
                  Load
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
