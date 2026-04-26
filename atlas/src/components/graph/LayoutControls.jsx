import { useCallback, useMemo, useRef } from 'react'

/** @param {{ selectedNodeId: string | null, onResetToCanonical?: () => void, onResetSelected?: () => void, onExportLayout?: () => void, onImportLayout?: (file: File) => void | Promise<void>, onFitGraph?: () => void, onCenterSelected?: () => void, autoRecenterEnabled?: boolean, onToggleAutoRecenter?: (enabled: boolean) => void, inline?: boolean }} props */
export default function LayoutControls({
  selectedNodeId,
  onResetToCanonical,
  onResetSelected,
  onExportLayout,
  onImportLayout,
  onFitGraph,
  onCenterSelected,
  autoRecenterEnabled = true,
  onToggleAutoRecenter,
  inline = false,
}) {
  const fileInputRef = useRef(null)
  const canFitGraph = typeof onFitGraph === 'function'
  const canCenterSelected = useMemo(
    () => Boolean(selectedNodeId) && typeof onCenterSelected === 'function',
    [onCenterSelected, selectedNodeId],
  )

  const openImportPicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0]
      if (!file || typeof onImportLayout !== 'function') {
        return
      }
      await onImportLayout(file)
      event.target.value = ''
    },
    [onImportLayout],
  )

  return (
    <div className={inline ? '' : 'pointer-events-none absolute right-4 top-4 z-20'}>
      <div className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onFitGraph}
            disabled={!canFitGraph}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-200 transition enabled:hover:bg-slate-700/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Fit graph
          </button>
          <button
            type="button"
            onClick={onCenterSelected}
            disabled={!canCenterSelected}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-200 transition enabled:hover:bg-slate-700/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Center selected
          </button>
          <button
            type="button"
            onClick={onResetToCanonical}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-200 transition hover:bg-slate-700/90"
          >
            Reset to canonical
          </button>
          <button
            type="button"
            onClick={onResetSelected}
            disabled={!selectedNodeId}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-200 transition enabled:hover:bg-slate-700/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset selected
          </button>
          <button
            type="button"
            onClick={onExportLayout}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-200 transition hover:bg-slate-700/90"
          >
            Export layout
          </button>
          <button
            type="button"
            onClick={openImportPicker}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-200 transition hover:bg-slate-700/90"
          >
            Import layout
          </button>
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-200">
          <input
            type="checkbox"
            checked={autoRecenterEnabled}
            onChange={(event) => onToggleAutoRecenter?.(event.target.checked)}
            className="h-3.5 w-3.5"
          />
          Auto-recenter on idle
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".atlas-layout.json,.json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
