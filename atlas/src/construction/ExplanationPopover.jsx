import { useEffect, useMemo, useRef, useState } from 'react'

function getNodeLabel(nodeLike) {
  if (!nodeLike || typeof nodeLike !== 'object') {
    return 'Unknown'
  }
  if (typeof nodeLike.title === 'string' && nodeLike.title.trim().length > 0) {
    return nodeLike.title
  }
  if (typeof nodeLike.name === 'string' && nodeLike.name.trim().length > 0) {
    return nodeLike.name
  }
  return typeof nodeLike.id === 'string' ? nodeLike.id : 'Unknown'
}

function readFocusable(container) {
  if (!container) {
    return []
  }
  const focusables = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  return [...focusables].filter((element) => !element.hasAttribute('disabled'))
}

export default function ExplanationPopover({
  edge,
  sourceNode,
  targetNode,
  position,
  onSave,
  onSkip,
}) {
  const [draft, setDraft] = useState(typeof edge?.explanation === 'string' ? edge.explanation : '')
  const panelRef = useRef(null)
  const textareaRef = useRef(null)
  const sourceLabel = useMemo(() => getNodeLabel(sourceNode), [sourceNode])
  const targetLabel = useMemo(() => getNodeLabel(targetNode), [targetNode])

  useEffect(() => {
    setDraft(typeof edge?.explanation === 'string' ? edge.explanation : '')
  }, [edge?.id, edge?.explanation])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [edge?.id])

  function handleKeyDown(event) {
    if (event.key !== 'Tab') {
      return
    }
    const focusables = readFocusable(panelRef.current)
    if (focusables.length < 2) {
      return
    }
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
  }

  function handleSave() {
    if (typeof onSave === 'function') {
      onSave(draft)
    }
  }

  function handleSkip() {
    if (typeof onSkip === 'function') {
      onSkip()
    }
  }

  return (
    <section
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Explain the connection"
      onKeyDown={handleKeyDown}
      className="absolute z-50 w-[340px] rounded-xl border border-slate-600 bg-slate-900/95 p-4 shadow-2xl"
      style={{
        left: Math.max(16, (position?.x ?? 0) - 170),
        top: Math.max(16, (position?.y ?? 0) - 105),
      }}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">Explain the connection</h2>
      <p className="mt-1 text-xs text-slate-400">
        {sourceLabel} - {targetLabel}
      </p>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="mt-3 min-h-[112px] w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
        placeholder="Type your explanation here..."
        aria-label="Edge explanation"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleSkip}
          className="rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded border border-cyan-500/70 bg-cyan-700/30 px-3 py-1.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-700/50"
        >
          Save
        </button>
      </div>
    </section>
  )
}
