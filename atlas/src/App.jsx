import { useCallback, useEffect, useMemo, useState } from 'react'
import GraphCanvas from './components/GraphCanvas.jsx'
import NodePanel from './components/NodePanel.jsx'
import { getAllEntities } from './data'
import { buildEdges, normalizePrerequisiteWeight } from './data/edges'
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
const DEFAULT_PANEL_WIDTH_FALLBACK = 440
const ATLAS_CORPUS_VERSION = import.meta.env.VITE_ATLAS_CORPUS_VERSION ?? 'unknown'

function getInitialPanelWidth() {
  if (typeof window === 'undefined') {
    return DEFAULT_PANEL_WIDTH_FALLBACK
  }
  return Math.max(1, Math.floor(window.innerWidth * 0.55))
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
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [understandingVersion, setUnderstandingVersion] = useState(0)
  const [panelWidth, setPanelWidth] = useState(() => getInitialPanelWidth())
  const [userLayoutStore, setUserLayoutStore] = useState(() => getUserLayoutStore())
  const [atlasCorpusHash, setAtlasCorpusHash] = useState(
    () => getUserLayoutStore().metadata.atlas_corpus_hash,
  )
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

  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const handleUnderstandingChange = useCallback(() => {
    setUnderstandingVersion((value) => value + 1)
  }, [])

  const handlePanelWidthChange = useCallback((nextWidth) => {
    setPanelWidth(nextWidth)
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
      <GraphCanvas
        nodes={positionedNodes}
        edges={edges}
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
      />
      <NodePanel
        selectedNode={selectedNode}
        panelWidth={panelWidth}
        onPanelWidthChange={handlePanelWidthChange}
        prerequisiteLinks={prerequisiteLinks}
        enablesLinks={enablesLinks}
        onClose={handleClosePanel}
        onUnderstandingChange={handleUnderstandingChange}
      />
    </main>
  )
}
