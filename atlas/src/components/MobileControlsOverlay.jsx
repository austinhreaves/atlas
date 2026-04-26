import DomainFilterPanel from './DomainFilterPanel.jsx'
import DomainLegend from './DomainLegend.jsx'
import LayerToggleBar from './LayerToggleBar.jsx'
import LayoutControls from './graph/LayoutControls.jsx'

/** @param {{ isOpen: boolean, onToggleOpen: () => void, layerEntries: [string, object][], visibleLayers: Set<string>, onToggleLayer: (layerId: string) => void, allDomains: string[], visibleDomains: Set<string>, onToggleDomain: (domain: string) => void, visibleConceptRows: {domain: string, count: number}[], legendCollapsed: boolean, onToggleLegendCollapsed: () => void, selectedNodeId: string | null, onResetToCanonical?: () => void, onResetSelected?: () => void, onExportLayout?: () => void, onImportLayout?: (file: File) => void | Promise<void> }} props */
export default function MobileControlsOverlay({
  isOpen,
  onToggleOpen,
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
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleOpen}
        className="fixed bottom-4 left-4 z-40 rounded-full border border-slate-600/70 bg-slate-900/95 px-4 py-2 text-sm font-semibold tracking-wide text-slate-100 shadow-xl shadow-black/50 backdrop-blur-sm"
      >
        {isOpen ? 'Close filters' : 'Filters'}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-30 flex items-end bg-black/45 backdrop-blur-[1px]">
          <div className="max-h-[82vh] w-full overflow-y-auto rounded-t-2xl border-t border-slate-700/80 bg-slate-950/95 p-3 pb-24 shadow-2xl shadow-black/70">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                View controls
              </h2>
              <button
                type="button"
                onClick={onToggleOpen}
                className="rounded-md border border-slate-600 bg-slate-800/85 px-2.5 py-1 text-xs font-semibold text-slate-100"
              >
                Done
              </button>
            </div>

            <div className="space-y-3">
              <LayerToggleBar
                layerEntries={layerEntries}
                visibleLayers={visibleLayers}
                onToggleLayer={onToggleLayer}
              />
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
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
