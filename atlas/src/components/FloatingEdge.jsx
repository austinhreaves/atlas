import { BaseEdge, MarkerType, Position, getBezierPath, useStore } from 'reactflow'

const EDGE_STROKE = '#94a3b8'
const BRIGHT_EDGE_STROKE = '#cbd5e1'
const VARIABLE_EDGE_STROKE = '#64748b'
const EDGE_TYPE_LABELS = {
  foundational: 'Foundational principle',
  'uses-variable': 'Uses variable',
  'defines-variable': 'Defines variable',
  definitional: 'Definition',
  lateral: 'Lateral connection',
  supporting: 'Supporting concept',
  isomorphic: 'Isomorphic structure',
  'noether-consequence': 'Noether consequence',
  applies: 'Applies concept',
  instantiates: 'Instantiates concept',
  establishes: 'Establishes concept',
}

export function getEdgeTypeLabel(edgeType) {
  if (typeof edgeType !== 'string' || edgeType.length === 0) {
    return 'Relationship'
  }
  if (EDGE_TYPE_LABELS[edgeType]) {
    return EDGE_TYPE_LABELS[edgeType]
  }
  const normalized = edgeType.replace(/-/g, ' ').trim()
  if (normalized.length === 0) {
    return 'Relationship'
  }
  return normalized[0].toUpperCase() + normalized.slice(1)
}

export function getEdgeVisuals(edgeType, weight) {
  const clampedWeight = Math.max(0, Math.min(1, typeof weight === 'number' ? weight : 0))

  if (edgeType === 'uses-variable') {
    return {
      strokeDasharray: '2 5',
      strokeWidth: 1.2,
      opacity: 0.35,
      markerEnd: undefined,
      stroke: VARIABLE_EDGE_STROKE,
    }
  }

  if (edgeType === 'foundational') {
    return {
      strokeDasharray: undefined,
      strokeWidth: 1.5 + 2.5 * clampedWeight,
      opacity: 0.5 + 0.5 * clampedWeight,
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_STROKE },
      stroke: EDGE_STROKE,
    }
  }

  if (edgeType === 'supporting') {
    return {
      strokeDasharray: undefined,
      strokeWidth: 1.0 + 1.5 * clampedWeight,
      opacity: 0.4 + 0.4 * clampedWeight,
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_STROKE },
      stroke: EDGE_STROKE,
    }
  }

  if (edgeType === 'definitional') {
    return {
      strokeDasharray: undefined,
      strokeWidth: 1.8 + 1.4 * clampedWeight,
      opacity: 0.7 + 0.3 * clampedWeight,
      markerEnd: undefined,
      targetGlyph: '≡',
      stroke: EDGE_STROKE,
    }
  }

  return {
    strokeDasharray: '4 4',
    strokeWidth: 1.0 + 1.0 * clampedWeight,
    opacity: 0.3 + 0.3 * clampedWeight,
    markerEnd: undefined,
    stroke: EDGE_STROKE,
  }
}

export function resolveEdgeStyle(visuals, { isFrontier, isFocal, isDistant, isVariableEdge }) {
  const frontierStrokeWidth =
    isFrontier && !isVariableEdge ? visuals.strokeWidth + 0.5 : visuals.strokeWidth
  const frontierOpacity = isFrontier
    ? Math.max(0, Math.min(1, visuals.opacity + 0.2))
    : visuals.opacity
  const strokeWidth = isFocal
    ? isVariableEdge
      ? frontierStrokeWidth + 0.8
      : frontierStrokeWidth + 1
    : frontierStrokeWidth
  const opacity = isVariableEdge
    ? isDistant
      ? 0.15
      : frontierOpacity
    : isFocal
      ? 1
      : isDistant
        ? 0.15
        : frontierOpacity
  const stroke =
    isFocal && !isVariableEdge ? BRIGHT_EDGE_STROKE : visuals.stroke ?? EDGE_STROKE
  const markerEnd =
    visuals.markerEnd && isFocal
      ? { ...visuals.markerEnd, color: BRIGHT_EDGE_STROKE }
      : visuals.markerEnd

  return { strokeWidth, opacity, stroke, markerEnd }
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
  const isVariableEdge = data?.type === 'uses-variable'
  const shouldPulse = isFrontier && !isFocal
  const { strokeWidth, opacity, stroke, markerEnd } = resolveEdgeStyle(visuals, {
    isFrontier,
    isFocal,
    isDistant,
    isVariableEdge,
  })
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

  const dx = targetPoint.x - sourcePoint.x
  const dy = targetPoint.y - sourcePoint.y
  const length = Math.hypot(dx, dy)
  const unitX = length > 0 ? dx / length : 0
  const unitY = length > 0 ? dy / length : 0
  const glyphInset = 10 + strokeWidth / 2
  const glyphX = targetPoint.x - unitX * glyphInset
  const glyphY = targetPoint.y - unitY * glyphInset
  const edgeLabel = getEdgeTypeLabel(data?.type)
  const onSetHover = typeof data?.onSetHover === 'function' ? data.onSetHover : null
  const isMobile = data?.isMobile === true

  const handleMouseEnter = (event) => {
    if (isMobile || !onSetHover) {
      return
    }
    onSetHover({
      kind: 'edge',
      id,
      screenX: event.clientX,
      screenY: event.clientY,
    })
  }

  const handleMouseLeave = () => {
    if (!onSetHover) {
      return
    }
    onSetHover(null)
  }

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        style={{ pointerEvents: 'stroke' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        aria-label={edgeLabel}
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
      {visuals.targetGlyph ? (
        <text
          x={glyphX}
          y={glyphY}
          fill={stroke}
          opacity={opacity}
          fontSize={14}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {visuals.targetGlyph}
        </text>
      ) : null}
    </g>
  )
}
