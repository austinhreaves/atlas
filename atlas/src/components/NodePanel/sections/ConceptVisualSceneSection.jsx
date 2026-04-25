import { useCallback, useEffect, useRef, useState } from 'react'

export default function ConceptVisualSceneSection({ selectedNode }) {
  const fullscreenTargetRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isPhetVisual = selectedNode.visual.type === 'phet' && selectedNode.visual.url

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === fullscreenTargetRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    handleFullscreenChange()
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleToggleFullscreen = useCallback(async () => {
    const target = fullscreenTargetRef.current
    if (!target) {
      return
    }

    if (document.fullscreenElement === target) {
      await document.exitFullscreen()
      return
    }

    if (!document.fullscreenElement && typeof target.requestFullscreen === 'function') {
      await target.requestFullscreen()
    }
  }, [])

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">Visual Scene</h3>
      {isPhetVisual ? (
        <div
          ref={fullscreenTargetRef}
          data-testid="phet-visual-shell"
          className={`relative overflow-hidden border border-slate-700/80 bg-slate-950/60 ${
            isFullscreen ? 'h-screen w-screen rounded-none' : 'rounded-lg'
          }`}
        >
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="absolute right-2 top-2 z-10 rounded border border-slate-600/80 bg-slate-900/85 px-2 py-1 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          </button>
          <iframe
            title={`${selectedNode.title} visual scene`}
            src={selectedNode.visual.url}
            data-testid="phet-visual-iframe"
            className={isFullscreen ? 'h-full w-full' : 'h-[260px] w-full'}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            referrerPolicy="no-referrer"
            allowFullScreen
            allow="fullscreen"
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
  )
}
