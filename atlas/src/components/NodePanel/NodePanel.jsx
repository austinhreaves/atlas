import { useCallback, useEffect, useRef, useState } from 'react'
import { isStateAtLeast } from '../../lib/understanding'
import NodePanelHeader from './NodePanelHeader'
import BlockPanel from './BlockPanel'
import ConceptPanel from './panels/ConceptPanel'
import VariablePanel from './panels/VariablePanel'

const DESKTOP_MIN_PANEL_WIDTH = 360

function getPanelWidthBounds() {
  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth
  const maxWidth = Math.max(1, Math.floor(viewportWidth * 0.55))
  const minWidth = Math.min(DESKTOP_MIN_PANEL_WIDTH, maxWidth)
  return { minWidth, maxWidth }
}

function clampPanelWidth(width) {
  const { minWidth, maxWidth } = getPanelWidthBounds()
  return Math.min(maxWidth, Math.max(minWidth, width))
}

/** @param {{ selectedNode: any, panelWidth?: number, isMobile?: boolean, onPanelWidthChange?: (width: number) => void, prerequisiteLinks?: any[], enablesLinks?: any[], onClose: () => void, onUnderstandingStateChange?: (entityId: string, state: string) => void, onSelectEntity?: (id: string) => void, onSubdomainClick?: (subdomainId: string) => void, subdomainLabelById?: Record<string, string>, subdomainDescriptionById?: Record<string, string>, tagLabelById?: Record<string, string>, tagDescriptionById?: Record<string, string>, conceptById?: Map<string, any>, appearsInByVariableId?: Record<string, string[]>, understandingStatesById?: Record<string, string> }} props */
export default function NodePanel({
  selectedNode,
  panelWidth = 440,
  isMobile = false,
  onPanelWidthChange,
  prerequisiteLinks = [],
  enablesLinks = [],
  onClose,
  onUnderstandingStateChange,
  onSelectEntity,
  onSubdomainClick,
  subdomainLabelById = {},
  subdomainDescriptionById = {},
  tagLabelById = {},
  tagDescriptionById = {},
  conceptById = new Map(),
  appearsInByVariableId = {},
  understandingStatesById = {},
}) {
  const understandingState = selectedNode ? understandingStatesById[selectedNode.id] ?? 'unseen' : 'unseen'
  const variableAppearsInConceptIds =
    selectedNode?.layer === 'variable' && Array.isArray(appearsInByVariableId[selectedNode.id])
      ? appearsInByVariableId[selectedNode.id]
      : []
  const isVariableKnown = variableAppearsInConceptIds.some((conceptId) =>
    isStateAtLeast(understandingStatesById[conceptId] ?? 'unseen', 'recognize'),
  )

  const [showIdealizedAssumptions, setShowIdealizedAssumptions] = useState(false)
  const dragStateRef = useRef(null)

  const handlePointerMove = useCallback(
    (event) => {
      const dragState = dragStateRef.current
      if (!dragState || typeof onPanelWidthChange !== 'function') {
        return
      }
      const nextWidth = dragState.startWidth + (dragState.startX - event.clientX)
      onPanelWidthChange(clampPanelWidth(nextWidth))
    },
    [onPanelWidthChange],
  )

  const stopDragging = useCallback(() => {
    dragStateRef.current = null
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', stopDragging)
  }, [handlePointerMove])

  const handleResizePointerDown = useCallback(
    (event) => {
      if (typeof onPanelWidthChange !== 'function') {
        return
      }
      dragStateRef.current = {
        startX: event.clientX,
        startWidth: panelWidth,
      }
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', stopDragging)
    },
    [handlePointerMove, onPanelWidthChange, panelWidth, stopDragging],
  )

  useEffect(() => stopDragging, [stopDragging])

  return (
    <>
      {!selectedNode ? (
        <div
          className={`pointer-events-none fixed z-20 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm ${
            isMobile ? 'bottom-20 left-1/2 -translate-x-1/2' : 'bottom-4 right-4'
          }`}
        >
          Select a node to inspect details
        </div>
      ) : null}

      <aside
        className={
          isMobile
            ? `fixed inset-x-0 bottom-0 z-30 h-[82vh] border-t border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm transition-transform duration-300 ease-out ${
                selectedNode ? 'translate-y-0' : 'translate-y-full'
              }`
            : `fixed right-0 top-0 z-30 h-screen w-full border-l border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm transition-transform duration-300 ease-out ${
                selectedNode ? 'translate-x-0' : 'translate-x-full'
              }`
        }
        style={isMobile ? undefined : { width: `${clampPanelWidth(panelWidth)}px` }}
        aria-hidden={!selectedNode}
      >
        {selectedNode ? (
          <div className="flex h-full flex-col">
            {!isMobile ? (
              <>
                <button
                  type="button"
                  aria-label="Resize panel"
                  data-testid="node-panel-resize-handle"
                  onPointerDown={handleResizePointerDown}
                  title="Drag to resize panel"
                  className="group absolute left-0 top-0 z-40 h-full w-4 -translate-x-2 cursor-col-resize"
                />
                <div className="pointer-events-none absolute left-0 top-0 z-30 flex h-full w-4 -translate-x-2 items-center justify-center">
                  <div className="h-20 w-2 rounded-full border border-cyan-300/35 bg-slate-900/85 shadow-[0_0_14px_rgba(34,211,238,0.18)]">
                    <div className="mt-1 grid h-full place-items-center text-[9px] tracking-tight text-cyan-200/85">
                      <span>::</span>
                      <span>::</span>
                      <span>::</span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            <NodePanelHeader
              selectedNode={selectedNode}
              onClose={onClose}
              understandingState={understandingState}
              isVariableKnown={isVariableKnown}
              onUnderstandingStateChange={onUnderstandingStateChange}
              onSubdomainClick={onSubdomainClick}
              subdomainLabelById={subdomainLabelById}
              subdomainDescriptionById={subdomainDescriptionById}
              tagLabelById={tagLabelById}
              tagDescriptionById={tagDescriptionById}
            />

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              {Array.isArray(selectedNode.blocks) && selectedNode.blocks.length > 0 ? (
                <BlockPanel selectedNode={selectedNode} />
              ) : selectedNode.layer === 'concept' ? (
                <ConceptPanel
                  selectedNode={selectedNode}
                  prerequisiteLinks={prerequisiteLinks}
                  enablesLinks={enablesLinks}
                  showIdealizedAssumptions={showIdealizedAssumptions}
                  setShowIdealizedAssumptions={setShowIdealizedAssumptions}
                  onSelectEntity={onSelectEntity}
                />
              ) : selectedNode.layer === 'variable' ? (
                <VariablePanel
                  selectedNode={selectedNode}
                  conceptById={conceptById}
                  appearsInByVariableId={appearsInByVariableId}
                  onSelectEntity={onSelectEntity}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
