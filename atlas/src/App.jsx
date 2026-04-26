import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import DesktopControlsPanel from './components/DesktopControlsPanel.jsx'
import GraphCanvas from './components/GraphCanvas.jsx'
import MobileControlsOverlay from './components/MobileControlsOverlay.jsx'
import NodePanel from './components/NodePanel.jsx'
import { computeAppearsIn, getAllEntities } from './data'
import { buildEdges, normalizePrerequisiteWeight } from './data/edges'
import { LAYERS } from './data/layers'
import useIsMobile, { MOBILE_BREAKPOINT_PX } from './hooks/useIsMobile'
import { computeLayout } from './lib/layout'
import { resolveRenderPosition } from './lib/resolveRenderPosition'
import { getAllStates, setState } from './lib/understanding'
import {
  buildLayoutExportPayload,
  clearUserLayoutStore,
  computeCorpusHash,
  createUserLayoutStore,
  downloadLayoutPayload,
  getUserLayoutStore,
  parseLayoutImportPayload,
  removeUserLayoutPosition,
  saveUserLayoutStore,
  setUserLayoutPosition,
  validateLayoutImportPayload,
} from './lib/userLayout'

const LAYOUT_CACHE_KEY = 'atlas_layout_v1'
const LAYER_VISIBILITY_KEY = 'atlas_layers_v1'
const LEGEND_VISIBILITY_KEY = 'atlas_legend_v1'
const AUTO_RECENTER_KEY = 'atlas_auto_recenter_v1'
const PANEL_WIDTH_KEY = 'atlas_panel_width_v1'
const DEFAULT_PANEL_WIDTH_FALLBACK = 440
const DESKTOP_MIN_PANEL_WIDTH = 360
const ATLAS_CORPUS_VERSION = import.meta.env.VITE_ATLAS_CORPUS_VERSION ?? 'unknown'
const DRAFT_BANNER_TEXT = 'Showing draft content'
const DEFAULT_MASS = 1
const MAX_MASS = 3

const layerEntries = Object.entries(LAYERS)
const allLayerIds = layerEntries.map(([layerId]) => layerId)

function getDefaultVisibleLayers() {
  return allLayerIds.filter((layerId) => LAYERS[layerId]?.default_visible === true)
}

function readInitialVisibleLayers() {
  if (typeof window === 'undefined') {
    return new Set(getDefaultVisibleLayers())
  }

  const fallback = new Set(getDefaultVisibleLayers())
  try {
    const raw = window.localStorage.getItem(LAYER_VISIBILITY_KEY)
    if (!raw) {
      return fallback
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return fallback
    }
    const validLayers = parsed.filter((layerId) => allLayerIds.includes(layerId))
    return validLayers.length > 0 ? new Set(validLayers) : fallback
  } catch {
    return fallback
  }
}

function readInitialLegendCollapsed() {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    return window.localStorage.getItem(LEGEND_VISIBILITY_KEY) === 'collapsed'
  } catch {
    return false
  }
}

function readInitialAutoRecenterEnabled() {
  if (typeof window === 'undefined') {
    return true
  }
  try {
    const stored = window.localStorage.getItem(AUTO_RECENTER_KEY)
    if (stored === 'on') {
      return true
    }
    if (stored === 'off') {
      return false
    }
    return true
  } catch {
    return true
  }
}

function getInitialPanelWidth() {
  if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX) {
    return DEFAULT_PANEL_WIDTH_FALLBACK
  }
  const maxWidth =
    typeof window === 'undefined'
      ? DEFAULT_PANEL_WIDTH_FALLBACK
      : Math.max(1, Math.floor(window.innerWidth * 0.55))
  const minWidth = Math.min(DESKTOP_MIN_PANEL_WIDTH, maxWidth)
  return Math.min(maxWidth, Math.max(minWidth, DEFAULT_PANEL_WIDTH_FALLBACK))
}

function clampPanelWidth(width) {
  if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX) {
    return DEFAULT_PANEL_WIDTH_FALLBACK
  }
  const baseWidth = typeof width === 'number' && Number.isFinite(width) ? width : getInitialPanelWidth()
  const maxWidth =
    typeof window === 'undefined'
      ? DEFAULT_PANEL_WIDTH_FALLBACK
      : Math.max(1, Math.floor(window.innerWidth * 0.55))
  const minWidth = Math.min(DESKTOP_MIN_PANEL_WIDTH, maxWidth)
  return Math.min(maxWidth, Math.max(minWidth, Math.round(baseWidth)))
}

function readInitialPanelWidth() {
  if (typeof window === 'undefined') {
    return getInitialPanelWidth()
  }
  try {
    const stored = window.localStorage.getItem(PANEL_WIDTH_KEY)
    if (!stored) {
      return getInitialPanelWidth()
    }
    const parsed = Number(stored)
    return clampPanelWidth(parsed)
  } catch {
    return getInitialPanelWidth()
  }
}

function isEditableElement(target) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  if (target.isContentEditable) {
    return true
  }
  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select'
}

function getNodeIdSet(nodes) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join('|')
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function computeMassByNodeId(nodes, edges) {
  const foundationalOutgoingBySourceId = new Map()
  for (const edge of Array.isArray(edges) ? edges : []) {
    if (edge?.type !== 'foundational' || typeof edge?.source !== 'string') {
      continue
    }
    foundationalOutgoingBySourceId.set(
      edge.source,
      (foundationalOutgoingBySourceId.get(edge.source) ?? 0) + 1,
    )
  }

  const massByNodeId = new Map()
  for (const node of Array.isArray(nodes) ? nodes : []) {
    if (typeof node?.id !== 'string') {
      continue
    }

    if (typeof node.mass === 'number') {
      massByNodeId.set(node.id, node.mass)
      continue
    }

    const foundationalOutgoingCount = foundationalOutgoingBySourceId.get(node.id) ?? 0
    massByNodeId.set(
      node.id,
      clamp(DEFAULT_MASS + 0.5 * foundationalOutgoingCount, DEFAULT_MASS, MAX_MASS),
    )
  }

  return massByNodeId
}

function shouldIncludeDraftContent() {
  if (typeof window === 'undefined') {
    return false
  }
  const params = new URLSearchParams(window.location.search)
  return params.get('include') === 'draft'
}

function getReviewState(entity) {
  return typeof entity?.review_state === 'string' ? entity.review_state : 'published'
}

function getLayoutPositions(nodes, edges) {
  const nodeIdSet = getNodeIdSet(nodes)
  if (typeof window === 'undefined') {
    return computeLayout(nodes, edges)
  }

  try {
    const raw = window.localStorage.getItem(LAYOUT_CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.nodeIdSet === nodeIdSet && parsed?.positions) {
        return parsed.positions
      }
    }
  } catch {
    // Ignore cache parsing errors and recompute below.
  }

  const positions = computeLayout(nodes, edges)

  try {
    window.localStorage.setItem(
      LAYOUT_CACHE_KEY,
      JSON.stringify({ nodeIdSet, positions }),
    )
  } catch {
    // Ignore cache write failures.
  }

  return positions
}

export default function App() {
  const isMobile = useIsMobile()
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [hoveredEntity, setHoveredEntity] = useState(null)
  const [understandingVersion, setUnderstandingVersion] = useState(0)
  const [panelWidth, setPanelWidth] = useState(() => readInitialPanelWidth())
  const [userLayoutStore, setUserLayoutStore] = useState(() => getUserLayoutStore())
  const [atlasCorpusHash, setAtlasCorpusHash] = useState(
    () => getUserLayoutStore().metadata.atlas_corpus_hash,
  )
  const [visibleLayers, setVisibleLayers] = useState(() => readInitialVisibleLayers())
  const [legendCollapsed, setLegendCollapsed] = useState(() => readInitialLegendCollapsed())
  const [autoRecenterEnabled, setAutoRecenterEnabled] = useState(() =>
    readInitialAutoRecenterEnabled(),
  )
  const [viewportActions, setViewportActions] = useState({ fitGraph: null, centerSelected: null })
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)
  const isPanelOpen = Boolean(selectedNodeId)
  const includeDraftContent = useMemo(() => shouldIncludeDraftContent(), [])
  const rawEntities = useMemo(() => getAllEntities(), [])
  const allEntities = useMemo(
    () =>
      rawEntities.filter((entity) => {
        const state = getReviewState(entity)
        if (state === 'published') {
          return true
        }
        return includeDraftContent && (state === 'draft' || state === 'reviewed')
      }),
    [includeDraftContent, rawEntities],
  )
  const conceptEntities = useMemo(
    () => allEntities.filter((entity) => entity.layer === 'concept'),
    [allEntities],
  )
  const variableEntities = useMemo(
    () => allEntities.filter((entity) => entity.layer === 'variable'),
    [allEntities],
  )
  const edges = useMemo(() => {
    return buildEdges(allEntities)
  }, [allEntities])
  const massByNodeId = useMemo(() => computeMassByNodeId(allEntities, edges), [allEntities, edges])
  const nodeById = useMemo(() => new Map(allEntities.map((node) => [node.id, node])), [allEntities])
  const conceptById = useMemo(
    () => new Map(conceptEntities.map((concept) => [concept.id, concept])),
    [conceptEntities],
  )
  const appearsInByVariableId = useMemo(
    () => computeAppearsIn(variableEntities, conceptEntities),
    [conceptEntities, variableEntities],
  )
  const understandingStatesById = useMemo(() => getAllStates(), [understandingVersion])
  const allDomains = useMemo(
    () =>
      [...new Set(allEntities.map((entity) => entity.domain).filter((domain) => typeof domain === 'string'))]
        .sort(),
    [allEntities],
  )
  const [visibleDomains, setVisibleDomains] = useState(() => new Set(allDomains))

  useEffect(() => {
    setVisibleDomains((current) => {
      const next = new Set([...current].filter((domain) => allDomains.includes(domain)))
      for (const domain of allDomains) {
        if (!current.has(domain)) {
          next.add(domain)
        }
      }
      return next
    })
  }, [allDomains])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(LAYER_VISIBILITY_KEY, JSON.stringify(Array.from(visibleLayers)))
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [visibleLayers])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(LEGEND_VISIBILITY_KEY, legendCollapsed ? 'collapsed' : 'expanded')
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [legendCollapsed])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(AUTO_RECENTER_KEY, autoRecenterEnabled ? 'on' : 'off')
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [autoRecenterEnabled])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(PANEL_WIDTH_KEY, String(clampPanelWidth(panelWidth)))
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [panelWidth])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || !selectedNodeId || isEditableElement(event.target)) {
        return
      }
      setSelectedNodeId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedNodeId])

  useEffect(() => {
    if (!isMobile && mobileControlsOpen) {
      setMobileControlsOpen(false)
    }
  }, [isMobile, mobileControlsOpen])

  useEffect(() => {
    if (isMobile && hoveredEntity) {
      setHoveredEntity(null)
    }
  }, [hoveredEntity, isMobile])

  useEffect(() => {
    if (selectedNodeId && mobileControlsOpen) {
      setMobileControlsOpen(false)
    }
  }, [mobileControlsOpen, selectedNodeId])

  useEffect(() => {
    setHoveredEntity(null)
  }, [selectedNodeId])

  useEffect(() => {
    let isActive = true
    computeCorpusHash(allEntities.map((entity) => entity.id))
      .then((hash) => {
        if (!isActive) {
          return
        }
        setAtlasCorpusHash(hash)
      })
      .catch(() => {
        if (!isActive) {
          return
        }
        setAtlasCorpusHash((current) => current ?? null)
      })
    return () => {
      isActive = false
    }
  }, [allEntities])


  const positionedNodes = useMemo(() => {
    const computedPositions = getLayoutPositions(allEntities, edges)
    return allEntities.map((node) => ({
      ...node,
      mass: massByNodeId.get(node.id) ?? DEFAULT_MASS,
      position: resolveRenderPosition({
        entityId: node.id,
        userPositions: userLayoutStore.positions,
        canonicalPosition: node.position,
        computedPositions,
        warnOnMissingComputed: import.meta.env.DEV,
      }),
    }))
  }, [allEntities, edges, massByNodeId, userLayoutStore.positions])

  const handleNodeClick = useCallback((node) => {
    setSelectedNodeId(node?.id ?? null)
  }, [])
  const handleSelectEntity = useCallback((entityId) => {
    setSelectedNodeId(typeof entityId === 'string' ? entityId : null)
  }, [])
  const handleSetHover = useCallback((nextHover) => {
    setHoveredEntity(nextHover ?? null)
  }, [])

  const toggleDomain = useCallback((domain) => {
    setVisibleDomains((current) => {
      const next = new Set(current)
      if (next.has(domain)) {
        next.delete(domain)
      } else {
        next.add(domain)
      }
      return next
    })
  }, [])

  const toggleLayer = useCallback((layerId) => {
    if (typeof LAYERS[layerId]?.schema_validator !== 'function') {
      return
    }
    setVisibleLayers((current) => {
      const next = new Set(current)
      if (next.has(layerId)) {
        next.delete(layerId)
      } else {
        next.add(layerId)
      }
      return next
    })
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const handleUnderstandingStateChange = useCallback((entityId, nextState) => {
    if (typeof entityId !== 'string' || entityId.length === 0) {
      return
    }
    setState(entityId, nextState)
    setUnderstandingVersion((value) => value + 1)
  }, [])

  const handlePanelWidthChange = useCallback((nextWidth) => {
    setPanelWidth(clampPanelWidth(nextWidth))
  }, [])

  const toggleMobileControls = useCallback(() => {
    setMobileControlsOpen((value) => !value)
  }, [])
  const handleAutoRecenterToggle = useCallback((enabled) => {
    setAutoRecenterEnabled(enabled)
  }, [])
  const handleViewportActionsChange = useCallback((actions) => {
    const safeActions =
      actions && typeof actions.fitGraph === 'function' && typeof actions.centerSelected === 'function'
        ? actions
        : { fitGraph: null, centerSelected: null }
    setViewportActions(safeActions)
  }, [])

  const persistNextUserLayoutStore = useCallback((nextStore) => {
    saveUserLayoutStore(nextStore)
    setUserLayoutStore(nextStore)
  }, [])

  const handleNodePositionCommit = useCallback(
    (nodeId, position) => {
      const nextStore = setUserLayoutPosition(
        userLayoutStore,
        nodeId,
        position,
        atlasCorpusHash ?? userLayoutStore.metadata.atlas_corpus_hash,
      )
      persistNextUserLayoutStore(nextStore)
    },
    [atlasCorpusHash, persistNextUserLayoutStore, userLayoutStore],
  )

  const handleResetToCanonical = useCallback(() => {
    const confirmed = window.confirm(
      'Reset your layout to canonical positions? This clears all saved node positions.',
    )
    if (!confirmed) {
      return
    }

    clearUserLayoutStore()
    const nextStore = createUserLayoutStore({
      atlasCorpusHash: atlasCorpusHash ?? userLayoutStore.metadata.atlas_corpus_hash,
    })
    startTransition(() => {
      persistNextUserLayoutStore(nextStore)
    })
  }, [atlasCorpusHash, persistNextUserLayoutStore, userLayoutStore.metadata.atlas_corpus_hash])

  const handleResetSelected = useCallback(() => {
    if (!selectedNodeId) {
      return
    }

    const nextStore = removeUserLayoutPosition(
      userLayoutStore,
      selectedNodeId,
      atlasCorpusHash ?? userLayoutStore.metadata.atlas_corpus_hash,
    )
    persistNextUserLayoutStore(nextStore)
  }, [
    atlasCorpusHash,
    persistNextUserLayoutStore,
    selectedNodeId,
    userLayoutStore,
  ])

  const handleExportLayout = useCallback(() => {
    const payload = buildLayoutExportPayload({
      positions: userLayoutStore.positions,
      atlasCorpusHash: atlasCorpusHash ?? userLayoutStore.metadata.atlas_corpus_hash,
      atlasCorpusVersion: ATLAS_CORPUS_VERSION,
      userNote: userLayoutStore.metadata.user_note,
    })
    downloadLayoutPayload(payload)
  }, [atlasCorpusHash, userLayoutStore])

  const handleImportLayout = useCallback(
    async (file) => {
      if (!file) {
        return
      }

      const text = await file.text()
      const parsed = parseLayoutImportPayload(text)
      const validation = validateLayoutImportPayload(parsed)
      if (!validation.valid) {
        window.alert(validation.reason ?? 'Invalid layout file.')
        return
      }

      const activeHash = atlasCorpusHash ?? userLayoutStore.metadata.atlas_corpus_hash
      const incomingHash = validation.atlasCorpusHash
      if (activeHash && incomingHash && activeHash !== incomingHash) {
        const proceed = window.confirm(
          'This layout was exported from a different corpus hash. Import anyway?',
        )
        if (!proceed) {
          return
        }
      }

      const nextStore = createUserLayoutStore({
        positions: validation.positions,
        atlasCorpusHash: incomingHash ?? activeHash,
        userNote: validation.userNote,
      })
      persistNextUserLayoutStore(nextStore)
    },
    [atlasCorpusHash, persistNextUserLayoutStore, userLayoutStore.metadata.atlas_corpus_hash],
  )

  const focalNodeIds = useMemo(
    () => (selectedNodeId ? new Set([selectedNodeId]) : new Set()),
    [selectedNodeId],
  )

  const neighborNodeIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set()
    }
    const ids = new Set()
    for (const edge of edges) {
      if (edge.source === selectedNodeId) {
        ids.add(edge.target)
      } else if (edge.target === selectedNodeId) {
        ids.add(edge.source)
      }
    }
    return ids
  }, [edges, nodeById, selectedNodeId])

  const distantNodeIds = useMemo(() => {
    const ids = new Set()
    for (const node of positionedNodes) {
      if (!focalNodeIds.has(node.id) && !neighborNodeIds.has(node.id)) {
        ids.add(node.id)
      }
    }
    return ids
  }, [focalNodeIds, neighborNodeIds, positionedNodes])

  const selectedNode = useMemo(
    () => positionedNodes.find((node) => node.id === selectedNodeId) ?? null,
    [positionedNodes, selectedNodeId],
  )
  const visibleConceptRows = useMemo(() => {
    const counts = new Map()
    for (const entity of positionedNodes) {
      if (entity.layer !== 'concept') {
        continue
      }
      if (!visibleLayers.has(entity.layer)) {
        continue
      }
      if (typeof entity.domain === 'string' && !visibleDomains.has(entity.domain)) {
        continue
      }
      const domain = typeof entity.domain === 'string' ? entity.domain : 'other'
      counts.set(domain, (counts.get(domain) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => a.domain.localeCompare(b.domain))
  }, [positionedNodes, visibleDomains, visibleLayers])

  const enablesByNodeId = useMemo(() => {
    const map = new Map()
    for (const node of conceptEntities) {
      for (const prerequisite of node.prerequisites ?? []) {
        if (!map.has(prerequisite.id)) {
          map.set(prerequisite.id, [])
        }
        map.get(prerequisite.id).push({
          id: node.id,
          title: node.title,
          type: prerequisite.type,
          weight: normalizePrerequisiteWeight(prerequisite.type, prerequisite.weight),
        })
      }
    }

    for (const dependents of map.values()) {
      dependents.sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title))
    }
    return map
  }, [conceptEntities])

  const prerequisiteLinks = useMemo(() => {
    if (!selectedNode) {
      return []
    }

    return (selectedNode.prerequisites ?? [])
      .map((prerequisite) => {
        const prerequisiteNode = nodeById.get(prerequisite.id)
        return {
          id: prerequisite.id,
          title: prerequisiteNode?.title ?? prerequisiteNode?.name ?? prerequisite.id,
          type: prerequisite.type,
          weight: normalizePrerequisiteWeight(prerequisite.type, prerequisite.weight),
        }
      })
      .sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title))
  }, [nodeById, selectedNode])

  const enablesLinks = useMemo(() => {
    if (!selectedNodeId) {
      return []
    }
    return enablesByNodeId.get(selectedNodeId) ?? []
  }, [enablesByNodeId, selectedNodeId])

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {includeDraftContent ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-md border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-100">
          {DRAFT_BANNER_TEXT}
        </div>
      ) : null}
      {!isMobile ? (
        <DesktopControlsPanel
          layerEntries={layerEntries}
          visibleLayers={visibleLayers}
          onToggleLayer={toggleLayer}
          allDomains={allDomains}
          visibleDomains={visibleDomains}
          onToggleDomain={toggleDomain}
          visibleConceptRows={visibleConceptRows}
          legendCollapsed={legendCollapsed}
          onToggleLegendCollapsed={() => setLegendCollapsed((value) => !value)}
          selectedNodeId={selectedNodeId}
          onResetToCanonical={handleResetToCanonical}
          onResetSelected={handleResetSelected}
          onExportLayout={handleExportLayout}
          onImportLayout={handleImportLayout}
          onFitGraph={viewportActions.fitGraph}
          onCenterSelected={viewportActions.centerSelected}
          autoRecenterEnabled={autoRecenterEnabled}
          onToggleAutoRecenter={handleAutoRecenterToggle}
        />
      ) : (
        <MobileControlsOverlay
          isOpen={mobileControlsOpen}
          onToggleOpen={toggleMobileControls}
          layerEntries={layerEntries}
          visibleLayers={visibleLayers}
          onToggleLayer={toggleLayer}
          allDomains={allDomains}
          visibleDomains={visibleDomains}
          onToggleDomain={toggleDomain}
          visibleConceptRows={visibleConceptRows}
          legendCollapsed={legendCollapsed}
          onToggleLegendCollapsed={() => setLegendCollapsed((value) => !value)}
          selectedNodeId={selectedNodeId}
          onResetToCanonical={handleResetToCanonical}
          onResetSelected={handleResetSelected}
          onExportLayout={handleExportLayout}
          onImportLayout={handleImportLayout}
          onFitGraph={viewportActions.fitGraph}
          onCenterSelected={viewportActions.centerSelected}
          autoRecenterEnabled={autoRecenterEnabled}
          onToggleAutoRecenter={handleAutoRecenterToggle}
        />
      )}
      <GraphCanvas
        nodes={positionedNodes}
        edges={edges}
        visibleLayers={visibleLayers}
        visibleDomains={visibleDomains}
        selectedNodeId={selectedNodeId}
        isPanelOpen={isPanelOpen}
        panelWidth={panelWidth}
        focalNodeIds={focalNodeIds}
        neighborNodeIds={neighborNodeIds}
        distantNodeIds={distantNodeIds}
        understandingStatesById={understandingStatesById}
        onNodeClick={handleNodeClick}
        onNodePositionCommit={handleNodePositionCommit}
        onViewportActionsChange={handleViewportActionsChange}
        autoRecenterEnabled={autoRecenterEnabled}
        isMobile={isMobile}
        hoveredEntity={hoveredEntity}
        onSetHover={handleSetHover}
      />
      <NodePanel
        selectedNode={selectedNode}
        panelWidth={panelWidth}
        isMobile={isMobile}
        onPanelWidthChange={handlePanelWidthChange}
        prerequisiteLinks={prerequisiteLinks}
        enablesLinks={enablesLinks}
        onClose={handleClosePanel}
        onUnderstandingStateChange={handleUnderstandingStateChange}
        onSelectEntity={handleSelectEntity}
        conceptById={conceptById}
        appearsInByVariableId={appearsInByVariableId}
        understandingStatesById={understandingStatesById}
      />
    </main>
  )
}
