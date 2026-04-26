import { useCallback, useState } from 'react'
import DomainFilterPanel from './DomainFilterPanel.jsx'
import DomainLegend from './DomainLegend.jsx'
import LayerToggleBar from './LayerToggleBar.jsx'
import NodeSearch from './NodeSearch.jsx'
import TagFilterPanel from './TagFilterPanel.jsx'
import LayoutControls from './graph/LayoutControls.jsx'

/** @param {{ isOpen?: boolean, panelWidth?: number, onToggleOpen?: () => void, onPanelWidthChange?: (width: number) => void, searchNodes?: Array<{ id: string, title?: string, layer: string, domain?: string, canonical_symbol?: string, keywordSearchText?: string }>, onSelectSearchNode?: (nodeId: string) => void, isMobile?: boolean, layerEntries: [string, object][], allLayerKeys?: Set<string>, visibleLayers: Set<string>, onToggleLayer: (layerId: string) => void, onSelectAllLayers?: () => void, onClearAllLayers?: () => void, allDomains: string[], allDomainKeys?: Set<string>, visibleDomains: Set<string>, onToggleDomain: (domain: string) => void, onSelectAllDomains?: () => void, onClearAllDomains?: () => void, tags?: Array<{id: string, label: string, description: string, review_state: string}>, includeDraftContent?: boolean, activeTags?: Set<string>, onToggleTag?: (tagId: string) => void, onSelectAllTags?: () => void, onClearAllTags?: () => void, visibleConceptRows: {domain: string, count: number}[], legendCollapsed: boolean, onToggleLegendCollapsed: () => void, selectedNodeId: string | null, onResetToCanonical?: () => void, onResetSelected?: () => void, onExportLayout?: () => void, onImportLayout?: (file: File) => void | Promise<void>, onFitGraph?: () => void, onCenterSelected?: () => void, autoRecenterEnabled?: boolean, onToggleAutoRecenter?: (enabled: boolean) => void }} props */
export default function DesktopControlsPanel({
  isOpen = false,
  panelWidth = 360,
  onToggleOpen,
  onPanelWidthChange,
  searchNodes = [],
  onSelectSearchNode,
  isMobile = false,
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
  const [layersOpen, setLayersOpen] = useState(true)
  const handleResizePointerDown = useCallback(
    (event) => {
      if (typeof onPanelWidthChange !== 'function') {
        return
      }
      const startX = event.clientX
      const startWidth = panelWidth

      const handlePointerMove = (moveEvent) => {
        const nextWidth = startWidth + (moveEvent.clientX - startX)
        onPanelWidthChange(nextWidth)
      }
      const stopDragging = () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', stopDragging)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', stopDragging)
    },
    [onPanelWidthChange, panelWidth],
  )

  return (
    <>
      <div
        className="pointer-events-none fixed left-4 top-4 z-40 transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? `translateX(${panelWidth + 8}px)` : 'translateX(0px)' }}
      >
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls="desktop-view-controls-aside"
          className="pointer-events-auto rounded-lg border border-slate-600/70 bg-slate-900/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 shadow-xl shadow-black/50 backdrop-blur-sm transition hover:bg-slate-800/95"
        >
          {isOpen ? 'Close view' : 'View'}
        </button>
      </div>

      <aside
        id="desktop-view-controls-aside"
        data-testid="desktop-view-controls-aside"
        className={`fixed left-0 top-0 z-30 h-screen border-r border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-black/60 backdrop-blur-sm transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: `${panelWidth}px` }}
        aria-hidden={!isOpen}
      >
        <div className="relative h-full">
          <button
            type="button"
            aria-label="Resize view panel"
            data-testid="desktop-view-panel-resize-handle"
            onPointerDown={handleResizePointerDown}
            title="Drag to resize view panel"
            className="group absolute right-0 top-0 z-40 h-full w-4 translate-x-2 cursor-col-resize"
          />
          <div className="pointer-events-none absolute right-0 top-0 z-30 flex h-full w-4 translate-x-2 items-center justify-center">
            <div className="h-20 w-2 rounded-full border border-cyan-300/35 bg-slate-900/85 shadow-[0_0_14px_rgba(34,211,238,0.18)]">
              <div className="mt-1 grid h-full place-items-center text-[9px] tracking-tight text-cyan-200/85">
                <span>::</span>
                <span>::</span>
                <span>::</span>
              </div>
            </div>
          </div>

          <div className="h-full space-y-3 overflow-y-auto p-3">
            <NodeSearch
              nodes={searchNodes}
              onSelectNode={onSelectSearchNode}
              isMobile={isMobile}
            />
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
                  allLayerKeys={allLayerKeys}
                  visibleLayers={visibleLayers}
                  onToggleLayer={onToggleLayer}
                  onSelectAllLayers={onSelectAllLayers}
                  onClearAllLayers={onClearAllLayers}
                />
              </div>
            ) : null}

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
      </aside>
    </>
  )
}
