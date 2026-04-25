import { BaseEdge, MarkerType, Position, getBezierPath, useStore } from 'reactflow'

const EDGE_STROKE = '#94a3b8'
const BRIGHT_EDGE_STROKE = '#cbd5e1'

function getEdgeVisuals(edgeType, weight) {
  const clampedWeight = Math.max(0, Math.min(1, typeof weight === 'number' ? weight : 0))

  if (edgeType === 'foundational') {
    return {
      strokeDasharray: undefined,
      strokeWidth: 1.5 + 2.5 * clampedWeight,
      opacity: 0.5 + 0.5 * clampedWeight,
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_STROKE },
    }
  }

  if (edgeType === 'supporting') {
    return {
      strokeDasharray: undefined,
      strokeWidth: 1.0 + 1.5 * clampedWeight,
      opacity: 0.4 + 0.4 * clampedWeight,
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_STROKE },
    }
  }

  return {
    strokeDasharray: '4 4',
    strokeWidth: 1.0 + 1.0 * clampedWeight,
    opacity: 0.3 + 0.3 * clampedWeight,
    markerEnd: undefined,
  }
}

function getNodeRect(node) {
  const width = node?.width ?? node?.measured?.width ?? 0
  const height = node?.height ?? node?.measured?.height ?? 0
  const x = node?.positionAbsolute?.x ?? node?.position?.x ?? 0
  const y = node?.positionAbsolute?.y ?? node?.position?.y ?? 0
  return {
    left: x,
    right: x + width,
    top: y,
    bottom: y + height,
    width,
    height,
    centerX: x + width / 2,
    centerY: y + height / 2,
  }
}

function getIntersectionPoint(sourceNode, targetNode) {
  const source = getNodeRect(sourceNode)
  const target = getNodeRect(targetNode)

  const dx = target.centerX - source.centerX
  const dy = target.centerY - source.centerY
  const radiusX = source.width / 2 || 1
  const radiusY = source.height / 2 || 1
  const scale = 1 / Math.sqrt((dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) || 1)

  const x = source.centerX + dx * scale
  const y = source.centerY + dy * scale

  return { x, y }
}

function getEdgePosition(node, point) {
  const rect = getNodeRect(node)
  const dx = point.x - rect.centerX
  const dy = point.y - rect.centerY
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Position.Right : Position.Left
  }
  return dy > 0 ? Position.Bottom : Position.Top
}

function offsetPointOutward(node, point, distance) {
  const rect = getNodeRect(node)
  const dx = point.x - rect.centerX
  const dy = point.y - rect.centerY
  const length = Math.hypot(dx, dy)

  if (length === 0) {
    return point
  }

  return {
    x: point.x + (dx / length) * distance,
    y: point.y + (dy / length) * distance,
  }
}

export default function FloatingEdge({ id, source, target, data }) {
  const sourceNode = useStore((store) => store.nodeInternals.get(source))
  const targetNode = useStore((store) => store.nodeInternals.get(target))

  if (!sourceNode || !targetNode) {
    return null
  }

  const visuals = getEdgeVisuals(data?.type, data?.weight)
  const emphasis = data?.emphasis ?? 'base'
  const isFrontier = data?.isFrontier === true
  const isFocal = emphasis === 'focal'
  const isDistant = emphasis === 'distant'
  const shouldPulse = isFrontier && !isFocal
  const frontierStrokeWidth = isFrontier ? visuals.strokeWidth + 0.5 : visuals.strokeWidth
  const frontierOpacity = isFrontier
    ? Math.max(0, Math.min(1, visuals.opacity + 0.2))
    : visuals.opacity
  const strokeWidth = isFocal ? frontierStrokeWidth + 1 : frontierStrokeWidth
  const opacity = isFocal ? 1 : isDistant ? 0.15 : frontierOpacity
  const stroke = isFocal ? BRIGHT_EDGE_STROKE : EDGE_STROKE
  const markerEnd =
    visuals.markerEnd && isFocal
      ? { ...visuals.markerEnd, color: BRIGHT_EDGE_STROKE }
      : visuals.markerEnd
  const pulseMin = Math.max(0, opacity - 0.1)
  const pulseMax = Math.min(1, opacity + 0.1)
  const endpointOffset = strokeWidth / 2

  const sourcePoint = offsetPointOutward(
    sourceNode,
    getIntersectionPoint(sourceNode, targetNode),
    endpointOffset,
  )
  const targetPoint = offsetPointOutward(
    targetNode,
    getIntersectionPoint(targetNode, sourceNode),
    endpointOffset,
  )
  const sourcePosition = getEdgePosition(sourceNode, sourcePoint)
  const targetPosition = getEdgePosition(targetNode, targetPoint)

  const [path] = getBezierPath({
    sourceX: sourcePoint.x,
    sourceY: sourcePoint.y,
    targetX: targetPoint.x,
    targetY: targetPoint.y,
    sourcePosition,
    targetPosition,
  })

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      className={shouldPulse ? 'atlas-frontier-edge' : undefined}
      style={{
        stroke,
        strokeWidth,
        opacity,
        strokeDasharray: visuals.strokeDasharray,
        '--atlas-frontier-opacity-min': String(pulseMin),
        '--atlas-frontier-opacity-max': String(pulseMax),
      }}
    />
  )
}
