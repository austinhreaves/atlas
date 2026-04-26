import { useCallback, useEffect, useMemo, useState } from 'react'
import DomainFilterPanel from './components/DomainFilterPanel.jsx'
import DomainLegend from './components/DomainLegend.jsx'
import GraphCanvas from './components/GraphCanvas.jsx'
import LayerToggleBar from './components/LayerToggleBar.jsx'
import MobileControlsOverlay from './components/MobileControlsOverlay.jsx'
import NodePanel from './components/NodePanel.jsx'
import { getAllEntities } from './data'
import { buildEdges, normalizePrerequisiteWeight } from './data/edges'
import { LAYERS } from './data/layers'
import useIsMobile, { MOBILE_BREAKPOINT_PX } from './hooks/useIsMobile'
import { computeLayout, computeMass } from './lib/layout'
import { resolveRenderPosition } from './lib/resolveRenderPosition'
import { getUnderstood } from './lib/understanding'
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
const DEFAULT_PANEL_WIDTH_FALLBACK = 440
const DESKTOP_MIN_PANEL_WIDTH = 360
const ATLAS_CORPUS_VERSION = import.meta.env.VITE_ATLAS_CORPUS_VERSION ?? 'unknown'

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

function getInitialPanelWidth() {
  if (typeof window === 'undefined') {
    return DEFAULT_PANEL_WIDTH_FALLBACK
  }
  if (window.innerWidth < MOBILE_BREAKPOINT_PX) {
    return DEFAULT_PANEL_WIDTH_FALLBACK
  }
  return Math.max(DESKTOP_MIN_PANEL_WIDTH, Math.floor(window.innerWidth * 0.55))
}

function getNodeIdSet(nodes) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join('|')
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
  const [understandingVersion, setUnderstandingVersion] = useState(0)
  const [panelWidth, setPanelWidth] = useState(() => getInitialPanelWidth())
  const [userLayoutStore, setUserLayoutStore] = useState(() => getUserLayoutStore())
  const [atlasCorpusHash, setAtlasCorpusHash] = useState(
    () => getUserLayoutStore().metadata.atlas_corpus_hash,
  )
  const [visibleLayers, setVisibleLayers] = useState(() => readInitialVisibleLayers())
  const [legendCollapsed, setLegendCollapsed] = useState(() => readInitialLegendCollapsed())
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)
  const isPanelOpen = Boolean(selectedNodeId)
  const allEntities = useMemo(() => getAllEntities(), [])
  const conceptEntities = useMemo(
    () => allEntities.filter((entity) => entity.layer === 'concept'),
    [allEntities],
  )
  const edges = useMemo(() => {
    return buildEdges(allEntities)
  }, [allEntities])
  const nodeById = useMemo(() => new Map(allEntities.map((node) => [node.id, node])), [allEntities])
  const understoodNodeIds = useMemo(() => getUnderstood(), [understandingVersion])
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
    if (!isMobile && mobileControlsOpen) {
      setMobileControlsOpen(false)
    }
  }, [isMobile, mobileControlsOpen])

  useEffect(() => {
    if (selectedNodeId && mobileControlsOpen) {
      setMobileControlsOpen(false)
    }
  }, [mobileControlsOpen, selectedNodeId])

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
      mass: computeMass(node, edges),
      position: resolveRenderPosition({
        entityId: node.id,
        userPositions: userLayoutStore.positions,
        canonicalPosition: node.position,
        computedPositions,
        warnOnMissingComputed: import.meta.env.DEV,
      }),
    }))
  }, [allEntities, edges, userLayoutStore.positions])

  const handleNodeClick = useCallback((node) => {
    setSelectedNodeId(node?.id ?? null)
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

  const handleUnderstandingChange = useCallback(() => {
    setUnderstandingVersion((value) => value + 1)
  }, [])

  const handlePanelWidthChange = useCallback((nextWidth) => {
    setPanelWidth(nextWidth)
  }, [])

  const toggleMobileControls = useCallback(() => {
    setMobileControlsOpen((value) => !value)
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
    persistNextUserLayoutStore(nextStore)
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
      {!isMobile ? (
        <div className="pointer-events-none absolute left-4 top-4 z-20 flex w-[360px] flex-col gap-2">
          <LayerToggleBar
            layerEntries={layerEntries}
            visibleLayers={visibleLayers}
            onToggleLayer={toggleLayer}
          />
          <DomainFilterPanel
            allDomains={allDomains}
            visibleDomains={visibleDomains}
            onToggleDomain={toggleDomain}
          />
          <DomainLegend
            rows={visibleConceptRows}
            collapsed={legendCollapsed}
            onToggleCollapsed={() => setLegendCollapsed((value) => !value)}
          />
        </div>
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
        understoodNodeIds={understoodNodeIds}
        onNodeClick={handleNodeClick}
        onNodePositionCommit={handleNodePositionCommit}
        onResetToCanonical={handleResetToCanonical}
        onResetSelected={handleResetSelected}
        onExportLayout={handleExportLayout}
        onImportLayout={handleImportLayout}
        isMobile={isMobile}
      />
      <NodePanel
        selectedNode={selectedNode}
        panelWidth={panelWidth}
        isMobile={isMobile}
        onPanelWidthChange={handlePanelWidthChange}
        prerequisiteLinks={prerequisiteLinks}
        enablesLinks={enablesLinks}
        onClose={handleClosePanel}
        onUnderstandingChange={handleUnderstandingChange}
      />
    </main>
  )
}
