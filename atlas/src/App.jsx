import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DesktopControlsPanel from './components/DesktopControlsPanel.jsx'
import GraphCanvas from './components/GraphCanvas.jsx'
import MobileControlsOverlay from './components/MobileControlsOverlay.jsx'
import NodePanel from './components/NodePanel.jsx'
import { computeAppearsIn, getAllEntities } from './data'
import { buildEdges, normalizePrerequisiteWeight } from './data/edges'
import { LAYERS } from './data/layers'
import {
  getSubdomainDescription,
  getSubdomainLabel,
  getSubdomainRegistry,
  getVisibleSubdomainRegistry,
} from './data/subdomains'
import { getVisibleSubjectRegistry } from './data/subjects'
import { getTagDescription, getTagLabel, getVisibleTagRegistry } from './data/tags'
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
const SUBDOMAIN_VISIBILITY_KEY = 'atlas_active_subdomains_v1'
const LEGEND_VISIBILITY_KEY = 'atlas_legend_v1'
const AUTO_RECENTER_KEY = 'atlas_auto_recenter_v1'
const PANEL_WIDTH_KEY = 'atlas_panel_width_v1'
const VIEW_PANEL_WIDTH_KEY = 'atlas_view_panel_width_v1'
const VIEW_PANEL_OPEN_KEY = 'atlas_view_panel_open_v1'
const DEFAULT_PANEL_WIDTH_FALLBACK = 440
const DESKTOP_MIN_PANEL_WIDTH = 360
const DEFAULT_VIEW_PANEL_WIDTH_FALLBACK = 360
const DESKTOP_MIN_VIEW_PANEL_WIDTH = 300
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

function readInitialActiveSubdomains(defaultVisibleSubdomainIds) {
  if (typeof window === 'undefined') {
    return new Set(defaultVisibleSubdomainIds)
  }

  const fallback = new Set(defaultVisibleSubdomainIds)
  try {
    const raw = window.localStorage.getItem(SUBDOMAIN_VISIBILITY_KEY)
    if (!raw) {
      return fallback
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return fallback
    }
    const validSubdomains = parsed.filter(
      (subdomainId) => typeof subdomainId === 'string' && defaultVisibleSubdomainIds.includes(subdomainId),
    )
    if (validSubdomains.length === 0) {
      return fallback
    }
    return new Set(validSubdomains)
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

function getInitialViewPanelWidth() {
  if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX) {
    return DEFAULT_VIEW_PANEL_WIDTH_FALLBACK
  }
  const maxWidth =
    typeof window === 'undefined'
      ? DEFAULT_VIEW_PANEL_WIDTH_FALLBACK
      : Math.max(1, Math.floor(window.innerWidth * 0.55))
  const minWidth = Math.min(DESKTOP_MIN_VIEW_PANEL_WIDTH, maxWidth)
  return Math.min(maxWidth, Math.max(minWidth, DEFAULT_VIEW_PANEL_WIDTH_FALLBACK))
}

function clampViewPanelWidth(width) {
  if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX) {
    return DEFAULT_VIEW_PANEL_WIDTH_FALLBACK
  }
  const baseWidth =
    typeof width === 'number' && Number.isFinite(width) ? width : getInitialViewPanelWidth()
  const maxWidth =
    typeof window === 'undefined'
      ? DEFAULT_VIEW_PANEL_WIDTH_FALLBACK
      : Math.max(1, Math.floor(window.innerWidth * 0.55))
  const minWidth = Math.min(DESKTOP_MIN_VIEW_PANEL_WIDTH, maxWidth)
  return Math.min(maxWidth, Math.max(minWidth, Math.round(baseWidth)))
}

function readInitialViewPanelWidth() {
  if (typeof window === 'undefined') {
    return getInitialViewPanelWidth()
  }
  try {
    const stored = window.localStorage.getItem(VIEW_PANEL_WIDTH_KEY)
    if (!stored) {
      return getInitialViewPanelWidth()
    }
    const parsed = Number(stored)
    return clampViewPanelWidth(parsed)
  } catch {
    return getInitialViewPanelWidth()
  }
}

function readInitialViewPanelOpen() {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    return window.localStorage.getItem(VIEW_PANEL_OPEN_KEY) === 'open'
  } catch {
    return false
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

function readNodeIdFromSearch(searchString) {
  const params = new URLSearchParams(typeof searchString === 'string' ? searchString : '')
  const nodeId = params.get('node')
  return typeof nodeId === 'string' && nodeId.length > 0 ? nodeId : null
}

function getCurrentNodeIdFromLocation() {
  if (typeof window === 'undefined') {
    return null
  }
  return readNodeIdFromSearch(window.location.search)
}

function buildHrefWithNode(nodeId) {
  if (typeof window === 'undefined') {
    return '/'
  }
  const url = new URL(window.location.href)
  if (typeof nodeId === 'string' && nodeId.length > 0) {
    url.searchParams.set('node', nodeId)
  } else {
    url.searchParams.delete('node')
  }
  const search = url.searchParams.toString()
  return `${url.pathname}${search ? `?${search}` : ''}${url.hash}`
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

function buildKeywordSearchText(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return ''
  }
  return tags
    .filter((id) => typeof id === 'string' && id.length > 0)
    .map((id) => `${id} ${getTagLabel(id)}`.trim().toLowerCase())
    .join(' ')
}

export default function App() {
  const isMobile = useIsMobile()
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [hoveredEntity, setHoveredEntity] = useState(null)
  const [understandingVersion, setUnderstandingVersion] = useState(0)
  const [panelWidth, setPanelWidth] = useState(() => readInitialPanelWidth())
  const [viewPanelWidth, setViewPanelWidth] = useState(() => readInitialViewPanelWidth())
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(() => readInitialViewPanelOpen())
  const [userLayoutStore, setUserLayoutStore] = useState(() => getUserLayoutStore())
  const [atlasCorpusHash, setAtlasCorpusHash] = useState(
    () => getUserLayoutStore().metadata.atlas_corpus_hash,
  )
  const [visibleLayers, setVisibleLayers] = useState(() => readInitialVisibleLayers())
  const [legendCollapsed, setLegendCollapsed] = useState(() => readInitialLegendCollapsed())
  const [autoRecenterEnabled, setAutoRecenterEnabled] = useState(() =>
    readInitialAutoRecenterEnabled(),
  )
  const hasHydratedNodeSelectionFromUrlRef = useRef(false)
  const hasWrittenNodeUrlRef = useRef(false)
  const skipNextNodeUrlSyncRef = useRef(false)
  const knownNodeIdsRef = useRef(new Set())
  const [viewportActions, setViewportActions] = useState({ fitGraph: null, centerSelected: null })
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)
  const isPanelOpen = Boolean(selectedNodeId)
  const includeDraftContent = useMemo(() => shouldIncludeDraftContent(), [])
  const allRegistrySubdomains = useMemo(() => getSubdomainRegistry(), [])
  const visibleSubdomainEntries = useMemo(
    () => getVisibleSubdomainRegistry(includeDraftContent),
    [includeDraftContent],
  )
  const publishedSubdomainIds = useMemo(
    () =>
      allRegistrySubdomains
        .filter((subdomain) => subdomain.review_state === 'published')
        .map((subdomain) => subdomain.id),
    [allRegistrySubdomains],
  )
  const visibleSubdomainIds = useMemo(
    () => visibleSubdomainEntries.map((subdomain) => subdomain.id),
    [visibleSubdomainEntries],
  )
  const visibleSubdomainIdSet = useMemo(() => new Set(visibleSubdomainIds), [visibleSubdomainIds])
  const [activeSubdomains, setActiveSubdomains] = useState(() =>
    readInitialActiveSubdomains(publishedSubdomainIds),
  )
  const visibleSubjectEntries = useMemo(
    () => getVisibleSubjectRegistry(includeDraftContent),
    [includeDraftContent],
  )
  const visibleSubjectIds = useMemo(
    () => visibleSubjectEntries.map((subject) => subject.id),
    [visibleSubjectEntries],
  )
  const visibleSubjectIdSet = useMemo(() => new Set(visibleSubjectIds), [visibleSubjectIds])
  const [visibleSubjects, setVisibleSubjects] = useState(() => new Set(visibleSubjectIds))
  const visibleKeywordTagEntries = useMemo(
    () => getVisibleTagRegistry(includeDraftContent),
    [includeDraftContent],
  )
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
  const knownNodeIds = useMemo(
    () =>
      new Set(
        allEntities
          .map((entity) => entity?.id)
          .filter((entityId) => typeof entityId === 'string' && entityId.length > 0),
      ),
    [allEntities],
  )
  const conceptEntities = useMemo(
    () => allEntities.filter((entity) => entity.layer === 'concept'),
    [allEntities],
  )
  const activeVisibleSubdomainIdSet = useMemo(
    () =>
      new Set(
        [...activeSubdomains].filter((subdomainId) => visibleSubdomainIdSet.has(subdomainId)),
      ),
    [activeSubdomains, visibleSubdomainIdSet],
  )
  const subdomainFilterIsBypassed =
    visibleSubdomainIds.length === 0 ||
    activeVisibleSubdomainIdSet.size === visibleSubdomainIdSet.size
  const subjectFilterIsBypassed = visibleSubjectIds.length <= 1
  const filteredConceptEntities = useMemo(() => {
    return conceptEntities.filter((entity) => {
      if (!subjectFilterIsBypassed) {
        if (typeof entity.subject !== 'string' || !visibleSubjects.has(entity.subject)) {
          return false
        }
      }
      if (subdomainFilterIsBypassed) {
        return true
      }
      if (!Array.isArray(entity.sub_domains) || entity.sub_domains.length === 0) {
        return false
      }
      return entity.sub_domains.some((subdomainId) => activeVisibleSubdomainIdSet.has(subdomainId))
    })
  }, [
    activeVisibleSubdomainIdSet,
    conceptEntities,
    subdomainFilterIsBypassed,
    subjectFilterIsBypassed,
    visibleSubjects,
  ])
  const allEntitiesForGraph = useMemo(() => {
    const visibleConceptIds = new Set(filteredConceptEntities.map((entity) => entity.id))
    return allEntities.filter(
      (entity) => entity.layer !== 'concept' || visibleConceptIds.has(entity.id),
    )
  }, [allEntities, filteredConceptEntities])
  const searchableNodes = useMemo(
    () =>
      allEntitiesForGraph
        .filter((entity) => entity.layer === 'concept' || entity.layer === 'variable')
        .map((entity) => ({
          id: entity.id,
          title: typeof entity.title === 'string' ? entity.title : entity.name,
          layer: entity.layer,
          domain: entity.domain,
          canonical_symbol: entity.canonical_symbol,
          keywordSearchText: buildKeywordSearchText(entity.tags),
        })),
    [allEntitiesForGraph],
  )
  const variableEntities = useMemo(
    () => allEntitiesForGraph.filter((entity) => entity.layer === 'variable'),
    [allEntitiesForGraph],
  )
  const edges = useMemo(() => {
    return buildEdges(allEntitiesForGraph)
  }, [allEntitiesForGraph])
  const massByNodeId = useMemo(
    () => computeMassByNodeId(allEntitiesForGraph, edges),
    [allEntitiesForGraph, edges],
  )
  const nodeById = useMemo(
    () => new Map(allEntitiesForGraph.map((node) => [node.id, node])),
    [allEntitiesForGraph],
  )
  const conceptById = useMemo(
    () => new Map(filteredConceptEntities.map((concept) => [concept.id, concept])),
    [filteredConceptEntities],
  )
  const appearsInByVariableId = useMemo(
    () => computeAppearsIn(variableEntities, filteredConceptEntities),
    [filteredConceptEntities, variableEntities],
  )
  const understandingStatesById = useMemo(() => getAllStates(), [understandingVersion])
  const allDomains = useMemo(
    () =>
      [
        ...new Set(
          allEntities
            .map((entity) => entity.domain)
            .filter((domain) => typeof domain === 'string'),
        ),
      ]
        .sort(),
    [allEntities],
  )
  const allDomainKeys = useMemo(() => new Set(allDomains), [allDomains])
  const allLayerKeys = useMemo(() => new Set(allLayerIds), [])
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
    setVisibleSubjects((current) => {
      const next = new Set([...current].filter((subjectId) => visibleSubjectIdSet.has(subjectId)))
      for (const subjectId of visibleSubjectIds) {
        if (!current.has(subjectId)) {
          next.add(subjectId)
        }
      }
      if (next.size === current.size) {
        return current
      }
      return next
    })
  }, [visibleSubjectIdSet, visibleSubjectIds])

  useEffect(() => {
    setActiveSubdomains((current) => {
      const next = new Set(
        [...current].filter((subdomainId) => visibleSubdomainIdSet.has(subdomainId)),
      )
      if (next.size === current.size) {
        return current
      }
      return next
    })
  }, [visibleSubdomainIdSet])

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
      window.localStorage.setItem(
        SUBDOMAIN_VISIBILITY_KEY,
        JSON.stringify(Array.from(activeSubdomains)),
      )
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [activeSubdomains])

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
    try {
      window.localStorage.setItem(VIEW_PANEL_WIDTH_KEY, String(clampViewPanelWidth(viewPanelWidth)))
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [viewPanelWidth])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(VIEW_PANEL_OPEN_KEY, isViewPanelOpen ? 'open' : 'closed')
    } catch {
      // Ignore write failures in constrained environments.
    }
  }, [isViewPanelOpen])

  useEffect(() => {
    knownNodeIdsRef.current = knownNodeIds
  }, [knownNodeIds])

  useEffect(() => {
    if (typeof window === 'undefined' || hasHydratedNodeSelectionFromUrlRef.current) {
      return
    }

    const nodeIdFromUrl = getCurrentNodeIdFromLocation()
    if (nodeIdFromUrl && knownNodeIds.has(nodeIdFromUrl)) {
      setSelectedNodeId(nodeIdFromUrl)
    }
    skipNextNodeUrlSyncRef.current = true
    hasHydratedNodeSelectionFromUrlRef.current = true
  }, [knownNodeIds])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!hasHydratedNodeSelectionFromUrlRef.current) {
      return
    }

    if (skipNextNodeUrlSyncRef.current) {
      skipNextNodeUrlSyncRef.current = false
      return
    }

    const selectedNodeIdForUrl =
      typeof selectedNodeId === 'string' && knownNodeIds.has(selectedNodeId) ? selectedNodeId : null
    const nextHref = buildHrefWithNode(selectedNodeIdForUrl)
    const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (nextHref === currentHref) {
      return
    }

    const historyState = { nodeId: selectedNodeIdForUrl }
    if (!hasWrittenNodeUrlRef.current) {
      window.history.replaceState(historyState, '', nextHref)
      hasWrittenNodeUrlRef.current = true
      return
    }
    window.history.pushState(historyState, '', nextHref)
  }, [knownNodeIds, selectedNodeId])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handlePopState = () => {
      const nodeIdFromUrl = getCurrentNodeIdFromLocation()
      const nextSelectedNodeId =
        nodeIdFromUrl && knownNodeIdsRef.current.has(nodeIdFromUrl) ? nodeIdFromUrl : null
      skipNextNodeUrlSyncRef.current = true
      setSelectedNodeId(nextSelectedNodeId)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

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
    const computedPositions = getLayoutPositions(allEntitiesForGraph, edges)
    return allEntitiesForGraph.map((node) => ({
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
  }, [allEntitiesForGraph, edges, massByNodeId, userLayoutStore.positions])

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
  const selectAllDomains = useCallback(() => {
    setVisibleDomains(new Set(allDomainKeys))
  }, [allDomainKeys])
  const clearAllDomains = useCallback(() => {
    setVisibleDomains(new Set())
  }, [])

  const toggleSubdomain = useCallback((subdomainId) => {
    setActiveSubdomains((current) => {
      const next = new Set(current)
      if (next.has(subdomainId)) {
        next.delete(subdomainId)
      } else {
        next.add(subdomainId)
      }
      return next
    })
  }, [])

  const selectAllSubdomains = useCallback(() => {
    setActiveSubdomains(new Set(visibleSubdomainIds))
  }, [visibleSubdomainIds])

  const clearAllSubdomains = useCallback(() => {
    setActiveSubdomains(new Set())
  }, [])

  const focusSingleSubdomain = useCallback((subdomainId) => {
    if (!visibleSubdomainIdSet.has(subdomainId)) {
      return
    }
    setActiveSubdomains(new Set([subdomainId]))
  }, [visibleSubdomainIdSet])

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
  const selectAllLayers = useCallback(() => {
    const enabledLayerIds = layerEntries
      .filter(([, layer]) => typeof layer?.schema_validator === 'function')
      .map(([layerId]) => layerId)
    setVisibleLayers(new Set(enabledLayerIds))
  }, [])
  const clearAllLayers = useCallback(() => {
    setVisibleLayers(new Set())
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
  const handleViewPanelWidthChange = useCallback((nextWidth) => {
    setViewPanelWidth(clampViewPanelWidth(nextWidth))
  }, [])
  const toggleViewPanelOpen = useCallback(() => {
    setIsViewPanelOpen((value) => !value)
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

  const subdomainLabelById = useMemo(
    () =>
      Object.fromEntries(
        allRegistrySubdomains.map((subdomain) => [subdomain.id, getSubdomainLabel(subdomain.id)]),
      ),
    [allRegistrySubdomains],
  )
  const subdomainDescriptionById = useMemo(
    () =>
      Object.fromEntries(
        allRegistrySubdomains.map((subdomain) => [
          subdomain.id,
          getSubdomainDescription(subdomain.id),
        ]),
      ),
    [allRegistrySubdomains],
  )
  const tagLabelById = useMemo(
    () => Object.fromEntries(visibleKeywordTagEntries.map((tag) => [tag.id, getTagLabel(tag.id)])),
    [visibleKeywordTagEntries],
  )
  const tagDescriptionById = useMemo(
    () =>
      Object.fromEntries(
        visibleKeywordTagEntries.map((tag) => [tag.id, getTagDescription(tag.id)]),
      ),
    [visibleKeywordTagEntries],
  )

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {includeDraftContent ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-md border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-100">
          {DRAFT_BANNER_TEXT}
        </div>
      ) : null}
      {!isMobile ? (
        <DesktopControlsPanel
          isOpen={isViewPanelOpen}
          panelWidth={viewPanelWidth}
          onToggleOpen={toggleViewPanelOpen}
          onPanelWidthChange={handleViewPanelWidthChange}
          searchNodes={searchableNodes}
          onSelectSearchNode={handleSelectEntity}
          isMobile={false}
          layerEntries={layerEntries}
          allLayerKeys={allLayerKeys}
          visibleLayers={visibleLayers}
          onToggleLayer={toggleLayer}
          onSelectAllLayers={selectAllLayers}
          onClearAllLayers={clearAllLayers}
          allDomains={allDomains}
          allDomainKeys={allDomainKeys}
          visibleDomains={visibleDomains}
          onToggleDomain={toggleDomain}
          onSelectAllDomains={selectAllDomains}
          onClearAllDomains={clearAllDomains}
          tags={allRegistrySubdomains}
          includeDraftContent={includeDraftContent}
          activeTags={activeVisibleSubdomainIdSet}
          onToggleTag={toggleSubdomain}
          onSelectAllTags={selectAllSubdomains}
          onClearAllTags={clearAllSubdomains}
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
          searchNodes={searchableNodes}
          onSelectSearchNode={handleSelectEntity}
          isMobile
          layerEntries={layerEntries}
          allLayerKeys={allLayerKeys}
          visibleLayers={visibleLayers}
          onToggleLayer={toggleLayer}
          onSelectAllLayers={selectAllLayers}
          onClearAllLayers={clearAllLayers}
          allDomains={allDomains}
          allDomainKeys={allDomainKeys}
          visibleDomains={visibleDomains}
          onToggleDomain={toggleDomain}
          onSelectAllDomains={selectAllDomains}
          onClearAllDomains={clearAllDomains}
          tags={allRegistrySubdomains}
          includeDraftContent={includeDraftContent}
          activeTags={activeVisibleSubdomainIdSet}
          onToggleTag={toggleSubdomain}
          onSelectAllTags={selectAllSubdomains}
          onClearAllTags={clearAllSubdomains}
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
        viewPanelWidth={viewPanelWidth}
        isViewPanelOpen={isViewPanelOpen}
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
        onSubdomainClick={focusSingleSubdomain}
        subdomainLabelById={subdomainLabelById}
        subdomainDescriptionById={subdomainDescriptionById}
        tagLabelById={tagLabelById}
        tagDescriptionById={tagDescriptionById}
        conceptById={conceptById}
        appearsInByVariableId={appearsInByVariableId}
        understandingStatesById={understandingStatesById}
      />
    </main>
  )
}
