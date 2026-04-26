import { useEffect, useRef, useState } from 'react'
import DomainFilterPanel from './DomainFilterPanel.jsx'
import DomainLegend from './DomainLegend.jsx'
import LayerToggleBar from './LayerToggleBar.jsx'
import LayoutControls from './graph/LayoutControls.jsx'

/** @param {{ layerEntries: [string, object][], visibleLayers: Set<string>, onToggleLayer: (layerId: string) => void, allDomains: string[], visibleDomains: Set<string>, onToggleDomain: (domain: string) => void, visibleConceptRows: {domain: string, count: number}[], legendCollapsed: boolean, onToggleLegendCollapsed: () => void, selectedNodeId: string | null, onResetToCanonical?: () => void, onResetSelected?: () => void, onExportLayout?: () => void, onImportLayout?: (file: File) => void | Promise<void>, onFitGraph?: () => void, onCenterSelected?: () => void, autoRecenterEnabled?: boolean, onToggleAutoRecenter?: (enabled: boolean) => void }} props */
export default function DesktopControlsPanel({
  layerEntries,
  visibleLayers,
  onToggleLayer,
  allDomains,
  visibleDomains,
  onToggleDomain,
  visibleConceptRows,
  legendCollapsed,
  onToggleLegendCollapsed,
  selectedNodeId,
  onResetToCanonical,
  onResetSelected,
  onExportLayout,
  onImportLayout,
  onFitGraph,
  onCenterSelected,
  autoRecenterEnabled = true,
  onToggleAutoRecenter,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [layersOpen, setLayersOpen] = useState(false)
  const shellRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (!(event.target instanceof Node) || !shellRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setLayersOpen(false)
    }
  }, [isOpen])

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-30" ref={shellRef}>
      <div className="pointer-events-auto flex max-w-[360px] flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls="desktop-view-controls-panel"
          className="rounded-lg border border-slate-600/70 bg-slate-900/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 shadow-xl shadow-black/50 backdrop-blur-sm transition hover:bg-slate-800/95"
        >
          {isOpen ? 'Close view' : 'View'}
        </button>

        {isOpen ? (
          <div
            id="desktop-view-controls-panel"
            data-testid="desktop-view-controls-panel"
            className="w-[360px] space-y-3 rounded-xl border border-slate-700/70 bg-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setLayersOpen((value) => !value)}
              aria-expanded={layersOpen}
              className="w-full rounded-md border border-slate-600 bg-slate-800/85 px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-slate-700/90"
            >
              {layersOpen ? 'Hide layers' : 'Layers'}
            </button>
            {layersOpen ? (
              <div className="rounded-lg border border-slate-700/70 bg-slate-900/55 p-2">
                <LayerToggleBar
                  layerEntries={layerEntries}
                  visibleLayers={visibleLayers}
                  onToggleLayer={onToggleLayer}
                />
              </div>
            ) : null}

            <DomainFilterPanel
              allDomains={allDomains}
              visibleDomains={visibleDomains}
              onToggleDomain={onToggleDomain}
            />
            <DomainLegend
              rows={visibleConceptRows}
              collapsed={legendCollapsed}
              onToggleCollapsed={onToggleLegendCollapsed}
            />
            <LayoutControls
              inline
              selectedNodeId={selectedNodeId}
              onResetToCanonical={onResetToCanonical}
              onResetSelected={onResetSelected}
              onExportLayout={onExportLayout}
              onImportLayout={onImportLayout}
              onFitGraph={onFitGraph}
              onCenterSelected={onCenterSelected}
              autoRecenterEnabled={autoRecenterEnabled}
              onToggleAutoRecenter={onToggleAutoRecenter}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
