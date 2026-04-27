import { useCallback, useMemo, useRef, useState } from 'react'
import ConstructionCanvas from './ConstructionCanvas.jsx'
import LibraryBrowser from './LibraryBrowser.jsx'
import {
  createConstructionSession,
  deserializeConstructionFile,
} from '../lib/construction/constructionFile'
import {
  listConstructionSessions,
  loadConstructionSession,
  saveConstructionSession,
} from '../lib/construction/constructionStore'
import { validateConstructionFile } from '../lib/construction/validateConstructionFile'
import { buildTopicCatalog, fetchInstructorManifest, fetchInstructorMapFile } from '../lib/construction/libraryCatalog'
import {
  buildSessionFromBlankTemplate,
  buildSessionFromInstructorMap,
  buildSessionFromTopicSubgraph,
} from '../lib/construction/librarySessionBuilders'

function formatModifiedAt(iso) {
  if (typeof iso !== 'string') {
    return 'Unknown'
  }
  const millis = Date.parse(iso)
  if (!Number.isFinite(millis)) {
    return 'Unknown'
  }
  return new Date(millis).toLocaleString()
}

export default function ConstructionApp() {
  const fileInputRef = useRef(null)
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [sessions, setSessions] = useState(() => listConstructionSessions())
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [instructorEntries, setInstructorEntries] = useState([])
  const [instructorUnavailable, setInstructorUnavailable] = useState(false)
  const topicCatalog = useMemo(() => buildTopicCatalog(), [])

  const refreshSessions = useCallback(() => {
    setSessions(listConstructionSessions())
  }, [])

  const commitAndOpenSession = useCallback((session) => {
    saveConstructionSession(session)
    refreshSessions()
    setActiveSessionId(session.id)
  }, [refreshSessions])

  const openSessionById = useCallback((sessionId) => {
    const loaded = loadConstructionSession(sessionId)
    if (!loaded) {
      window.alert('Could not load that session.')
      return
    }
    setActiveSessionId(loaded.id)
  }, [])

  const handleStartFromScratch = useCallback(() => {
    const nextSession = createConstructionSession({
      title: 'Untitled concept map',
      librarySource: null,
    })
    commitAndOpenSession(nextSession)
  }, [commitAndOpenSession])

  const handleImportMap = useCallback(async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    let parsed
    try {
      const raw = await file.text()
      parsed = deserializeConstructionFile(raw)
    } catch {
      window.alert('Invalid JSON in import file.')
      return
    }

    const result = validateConstructionFile(parsed)
    if (result.errors.length > 0) {
      window.alert(`Import blocked:\n- ${result.errors.join('\n- ')}`)
      return
    }
    if (result.warnings.length > 0) {
      const proceed = window.confirm(
        `This file has ${result.warnings.length} warning(s):\n- ${result.warnings.join('\n- ')}\n\nContinue import?`,
      )
      if (!proceed) {
        return
      }
    }

    commitAndOpenSession(result.file)
  }, [commitAndOpenSession])

  const handleOpenLibrary = useCallback(async () => {
    setIsLibraryOpen(true)
    const manifest = await fetchInstructorManifest()
    setInstructorEntries(manifest.entries)
    setInstructorUnavailable(manifest.unavailable)
  }, [])

  const handleLoadInstructor = useCallback(async (entry) => {
    try {
      const mapFile = await fetchInstructorMapFile(entry.file)
      const session = buildSessionFromInstructorMap(mapFile, entry)
      commitAndOpenSession(session)
      setIsLibraryOpen(false)
    } catch {
      window.alert('Could not load instructor map.')
    }
  }, [commitAndOpenSession])

  const handleLoadTopicSubgraph = useCallback((topic) => {
    const session = buildSessionFromTopicSubgraph(topic)
    commitAndOpenSession(session)
    setIsLibraryOpen(false)
  }, [commitAndOpenSession])

  const handleLoadBlankTemplate = useCallback((topic) => {
    const session = buildSessionFromBlankTemplate(topic)
    commitAndOpenSession(session)
    setIsLibraryOpen(false)
  }, [commitAndOpenSession])

  const hasSessions = sessions.length > 0
  const sortedSessions = useMemo(() => sessions, [sessions])

  if (activeSessionId) {
    return <ConstructionCanvas sessionId={activeSessionId} onBackToLanding={() => setActiveSessionId(null)} />
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl">
          <h1 className="text-2xl font-bold">Atlas Construction Mode</h1>
          <p className="mt-2 text-sm text-slate-300">
            Build your own concept map from scratch, imports, or library templates.
          </p>
        </header>

        <section className="rounded-xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">My maps</h2>
          {!hasSessions ? (
            <p className="mt-3 text-sm text-slate-400">No saved maps yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sortedSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-xs text-slate-400">
                      Last modified: {formatModifiedAt(session.modifiedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openSessionById(session.id)}
                    className="rounded-md border border-cyan-500/70 bg-cyan-700/30 px-3 py-1.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-700/50"
                  >
                    Continue
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 shadow-xl">
            <h3 className="text-base font-semibold">Start from scratch</h3>
            <p className="mt-2 text-sm text-slate-400">Create an empty construction session.</p>
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="mt-4 rounded-md border border-emerald-500/70 bg-emerald-700/30 px-3 py-1.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-700/50"
            >
              Start
            </button>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 shadow-xl">
            <h3 className="text-base font-semibold">Import a map</h3>
            <p className="mt-2 text-sm text-slate-400">Import a `.atlas-map.json` file from disk.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-md border border-indigo-500/70 bg-indigo-700/30 px-3 py-1.5 text-sm font-semibold text-indigo-100 hover:bg-indigo-700/50"
            >
              Choose file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".atlas-map.json,.json,application/json"
              className="hidden"
              onChange={handleImportMap}
            />
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 shadow-xl">
            <h3 className="text-base font-semibold">Load from library</h3>
            <p className="mt-2 text-sm text-slate-400">Load instructor maps, topic subgraphs, or blank templates.</p>
            <button
              type="button"
              onClick={handleOpenLibrary}
              className="mt-4 rounded-md border border-cyan-500/70 bg-cyan-700/30 px-3 py-1.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-700/50"
            >
              Open library
            </button>
          </div>
        </section>
      </div>
      <LibraryBrowser
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        instructorEntries={instructorEntries}
        instructorUnavailable={instructorUnavailable}
        topicCatalog={topicCatalog}
        onLoadInstructor={handleLoadInstructor}
        onLoadTopicSubgraph={handleLoadTopicSubgraph}
        onLoadBlankTemplate={handleLoadBlankTemplate}
      />
    </main>
  )
}
