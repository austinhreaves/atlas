import { useEffect, useRef } from 'react'
import { useReactFlow } from 'reactflow'

function getNodeCenter(node) {
  if (!node) {
    return null
  }

  const x = node.positionAbsolute?.x ?? node.position?.x ?? 0
  const y = node.positionAbsolute?.y ?? node.position?.y ?? 0
  const width = node.width ?? node.measured?.width ?? 0
  const height = node.height ?? node.measured?.height ?? 0

  return {
    x: x + width / 2,
    y: y + height / 2,
  }
}

const IDLE_RECENTER_MS = 4500
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

/** @param {{ selectedNodeId: string | null, panelWidth?: number, isPanelOpen?: boolean, userMoveEndCount?: number, isMobile?: boolean }} props */
export default function CameraController({
  selectedNodeId,
  panelWidth = 440,
  isPanelOpen = false,
  userMoveEndCount = 0,
  isMobile = false,
}) {
  const reactFlow = useReactFlow()
  const hasMountedRef = useRef(false)
  const idleTimerRef = useRef(null)
  const lastHandledMoveEndCountRef = useRef(0)
  const previousSelectedNodeIdRef = useRef(selectedNodeId)

  const centerOnNode = (nodeId, { duration = 380 } = {}) => {
    const node = reactFlow.getNode(nodeId)
    const center = getNodeCenter(node)
    if (!center) {
      return
    }

    const viewport = reactFlow.getViewport()
    const zoom = viewport?.zoom ?? 1
    const effectivePanelWidth = clampPanelWidth(panelWidth)
    const offsetGraphX = isPanelOpen && !isMobile ? effectivePanelWidth / (2 * zoom) : 0
    const targetX = center.x + offsetGraphX

    reactFlow.setCenter(targetX, center.y, { zoom, duration })
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    if (!selectedNodeId) {
      return
    }
    centerOnNode(selectedNodeId, { duration: 420 })
  }, [isMobile, isPanelOpen, panelWidth, selectedNodeId])

  useEffect(() => {
    const previousSelectedNodeId = previousSelectedNodeIdRef.current
    const selectionChanged = previousSelectedNodeId !== selectedNodeId
    if (selectionChanged) {
      previousSelectedNodeIdRef.current = selectedNodeId
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }
      lastHandledMoveEndCountRef.current = userMoveEndCount
    }

    if (!selectedNodeId) {
      return
    }

    if (userMoveEndCount <= lastHandledMoveEndCountRef.current) {
      return
    }
    lastHandledMoveEndCountRef.current = userMoveEndCount

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current)
    }

    idleTimerRef.current = window.setTimeout(() => {
      centerOnNode(selectedNodeId, { duration: 420 })
      idleTimerRef.current = null
    }, IDLE_RECENTER_MS)
  }, [selectedNodeId, userMoveEndCount, isMobile, isPanelOpen, panelWidth])

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current)
      }
    }
  }, [])

  return null
}
