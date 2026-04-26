import DomainFilterPanel from './DomainFilterPanel.jsx'
import DomainLegend from './DomainLegend.jsx'
import LayerToggleBar from './LayerToggleBar.jsx'
import NodeSearch from './NodeSearch.jsx'
import TagFilterPanel from './TagFilterPanel.jsx'
import LayoutControls from './graph/LayoutControls.jsx'

/** @param {{ isOpen: boolean, onToggleOpen: () => void, searchNodes?: Array<{ id: string, title?: string, layer: string, domain?: string, canonical_symbol?: string, keywordSearchText?: string }>, onSelectSearchNode?: (nodeId: string) => void, isMobile?: boolean, layerEntries: [string, object][], allLayerKeys?: Set<string>, visibleLayers: Set<string>, onToggleLayer: (layerId: string) => void, onSelectAllLayers?: () => void, onClearAllLayers?: () => void, allDomains: string[], allDomainKeys?: Set<string>, visibleDomains: Set<string>, onToggleDomain: (domain: string) => void, onSelectAllDomains?: () => void, onClearAllDomains?: () => void, tags?: Array<{id: string, label: string, description: string, review_state: string}>, includeDraftContent?: boolean, activeTags?: Set<string>, onToggleTag?: (tagId: string) => void, onSelectAllTags?: () => void, onClearAllTags?: () => void, visibleConceptRows: {domain: string, count: number}[], legendCollapsed: boolean, onToggleLegendCollapsed: () => void, selectedNodeId: string | null, onResetToCanonical?: () => void, onResetSelected?: () => void, onExportLayout?: () => void, onImportLayout?: (file: File) => void | Promise<void>, onFitGraph?: () => void, onCenterSelected?: () => void, autoRecenterEnabled?: boolean, onToggleAutoRecenter?: (enabled: boolean) => void }} props */
export default function MobileControlsOverlay({
  isOpen,
  onToggleOpen,
  searchNodes = [],
  onSelectSearchNode,
  isMobile = true,
  layerEntries,
  allLayerKeys,
  visibleLayers,
  onToggleLayer,
  onSelectAllLayers,
  onClearAllLayers,
  allDomains,
  allDomainKeys,
  visibleDomains,
  onToggleDomain,
  onSelectAllDomains,
  onClearAllDomains,
  tags = [],
  includeDraftContent = false,
  activeTags = new Set(),
  onToggleTag,
  onSelectAllTags,
  onClearAllTags,
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
              <NodeSearch
                nodes={searchNodes}
                onSelectNode={onSelectSearchNode}
                isMobile={isMobile}
              />
              <LayerToggleBar
                layerEntries={layerEntries}
                allLayerKeys={allLayerKeys}
                visibleLayers={visibleLayers}
                onToggleLayer={onToggleLayer}
                onSelectAllLayers={onSelectAllLayers}
                onClearAllLayers={onClearAllLayers}
              />
              <DomainFilterPanel
                allDomains={allDomains}
                allDomainKeys={allDomainKeys}
                visibleDomains={visibleDomains}
                onToggleDomain={onToggleDomain}
                onSelectAllDomains={onSelectAllDomains}
                onClearAllDomains={onClearAllDomains}
              />
              <TagFilterPanel
                tags={tags}
                includeDraftContent={includeDraftContent}
                activeTags={activeTags}
                onToggleTag={onToggleTag}
                onSelectAllTags={onSelectAllTags}
                onClearAllTags={onClearAllTags}
                title="Sub-domains"
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
          </div>
        </div>
      ) : null}
    </>
  )
}
