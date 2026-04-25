import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import NodePanelHeader from './NodePanelHeader'
import ConceptPrincipleSection from './sections/ConceptPrincipleSection'
import ConceptFormulaSection from './sections/ConceptFormulaSection'
import ConceptVariablesSection from './sections/ConceptVariablesSection'
import ConceptApplicabilitySection from './sections/ConceptApplicabilitySection'
import ConceptLimitingCasesSection from './sections/ConceptLimitingCasesSection'
import ConceptAssumptionsSection from './sections/ConceptAssumptionsSection'
import ConceptDescriptionSection from './sections/ConceptDescriptionSection'
import ConceptMisconceptionsSection from './sections/ConceptMisconceptionsSection'
import ConceptHistorySection from './sections/ConceptHistorySection'
import ConceptLinksSection from './sections/ConceptLinksSection'
import ConceptVisualSceneSection from './sections/ConceptVisualSceneSection'

const MIN_PANEL_WIDTH = 360

function getPanelWidthBounds() {
  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth
  const maxWidth = Math.max(1, Math.floor(viewportWidth * 0.55))
  const minWidth = Math.min(MIN_PANEL_WIDTH, maxWidth)
  return { minWidth, maxWidth }
}

function clampPanelWidth(width) {
  const { minWidth, maxWidth } = getPanelWidthBounds()
  return Math.min(maxWidth, Math.max(minWidth, width))
}

/** @param {{ selectedNode: any, panelWidth?: number, onPanelWidthChange?: (width: number) => void, prerequisiteLinks?: any[], enablesLinks?: any[], onClose: () => void, onUnderstandingChange?: () => void }} props */
export default function NodePanel({
  selectedNode,
  panelWidth = 440,
  onPanelWidthChange,
  prerequisiteLinks = [],
  enablesLinks = [],
  onClose,
  onUnderstandingChange,
}) {
  const [showIdealizedAssumptions, setShowIdealizedAssumptions] = useState(false)
  const dragStateRef = useRef(null)

  const variableRows = selectedNode?.variables ?? []
  const applicabilityConditions = Array.isArray(selectedNode?.applicability_conditions)
    ? selectedNode.applicability_conditions
    : []
  const limitingCases = Array.isArray(selectedNode?.limiting_cases) ? selectedNode.limiting_cases : []
  const misconceptions = Array.isArray(selectedNode?.misconceptions) ? selectedNode.misconceptions : []

  const idealizations = selectedNode?.idealizations ?? []
  const visibleIdealizations = useMemo(
    () => idealizations.filter((idealization) => idealization.scope !== 'idealized'),
    [idealizations],
  )
  const idealizedAssumptions = useMemo(
    () => idealizations.filter((idealization) => idealization.scope === 'idealized'),
    [idealizations],
  )

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
        <div className="pointer-events-none fixed bottom-4 right-4 z-20 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
          Select a node to inspect details
        </div>
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-30 h-screen w-full border-l border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm transition-transform duration-300 ease-out ${
          selectedNode ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: `${clampPanelWidth(panelWidth)}px` }}
        aria-hidden={!selectedNode}
      >
        {selectedNode ? (
          <div className="flex h-full flex-col">
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
            <NodePanelHeader
              selectedNode={selectedNode}
              onClose={onClose}
              onUnderstandingChange={onUnderstandingChange}
            />

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <ConceptPrincipleSection principle={selectedNode.principle} />
              <ConceptFormulaSection formula={selectedNode.formula} />
              <ConceptVariablesSection selectedNode={selectedNode} variableRows={variableRows} />
              <ConceptApplicabilitySection
                selectedNodeId={selectedNode.id}
                applicabilityConditions={applicabilityConditions}
              />
              <ConceptLimitingCasesSection
                selectedNodeId={selectedNode.id}
                limitingCases={limitingCases}
              />
              <ConceptAssumptionsSection
                selectedNodeId={selectedNode.id}
                visibleIdealizations={visibleIdealizations}
                idealizedAssumptions={idealizedAssumptions}
                showIdealizedAssumptions={showIdealizedAssumptions}
                setShowIdealizedAssumptions={setShowIdealizedAssumptions}
              />
              <ConceptDescriptionSection description={selectedNode.description} />
              <ConceptMisconceptionsSection
                selectedNodeId={selectedNode.id}
                misconceptions={misconceptions}
              />
              <ConceptHistorySection historicalContext={selectedNode.historical_context} />
              <ConceptLinksSection
                selectedNodeId={selectedNode.id}
                prerequisiteLinks={prerequisiteLinks}
                enablesLinks={enablesLinks}
              />
              <ConceptVisualSceneSection selectedNode={selectedNode} />
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
