import { BaseEdge, getBezierPath } from 'reactflow'

function toEdgeStyle(explanation) {
  const isFilled = typeof explanation === 'string' && explanation.trim().length > 0
  return {
    stroke: '#94a3b8',
    strokeWidth: 2,
    strokeDasharray: isFilled ? undefined : '6 6',
  }
}

export default function ConstructionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })
  const style = toEdgeStyle(data?.explanation)

  const handleClick = (event) => {
    event.stopPropagation()
    if (typeof data?.onClick === 'function') {
      data.onClick(id)
    }
  }

  const handleContextMenu = (event) => {
    if (typeof data?.onContextMenu !== 'function') {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    data.onContextMenu(id, { x: event.clientX, y: event.clientY })
  }

  return (
    <g onClick={handleClick} onContextMenu={handleContextMenu}>
      <path d={path} fill="none" stroke="transparent" strokeWidth={14} style={{ pointerEvents: 'stroke' }} />
      <BaseEdge id={id} path={path} style={style} />
    </g>
  )
}
