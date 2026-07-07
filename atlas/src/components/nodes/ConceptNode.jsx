import { Handle, Position, useStore } from 'reactflow'
import { getConceptDomainCardClass } from './domainVisuals'

// Domain is never rendered as text (see ATLAS_NODE_AFFORDANCES_SPEC.md): encode via
// fill/glow (domain) plus border style (mechanics = solid, electromagnetism = dashed).
const floatingHandleClass =
  '!h-0 !w-0 !border-0 !bg-transparent !opacity-0 !pointer-events-none'
const LABEL_PIN_ZOOM = 0.6
const LABEL_MAX_ZOOM = 1.5

export default function ConceptNode({ data, selected }) {
  const zoom = useStore((state) => state.transform[2])
  const domain = data.domain
  const card = getConceptDomainCardClass(domain)
  const mass = Math.max(1, Math.min(3, typeof data.mass === 'number' ? data.mass : 1))
  const diameter = 80 + (mass - 1) * 20
  const visualState = data.visualState ?? 'base'
  const scale = visualState === 'focal' ? 1.1 : visualState === 'neighbor' ? 1.06 : 1
  const selectionActive = visualState !== 'base'
  const opacity = selectionActive && visualState === 'distant' ? 0.3 : 1
  const accentRing = visualState === 'focal'
  const progress = typeof data.progress === 'number' ? data.progress : 0
  const arcProgress = Math.min(1, Math.max(0, progress / 100))
  const arcStrokeWidth = 3
  const arcInset = 8
  const arcSvgSize = diameter + arcInset * 2
  const arcCenter = arcSvgSize / 2
  const arcRadius = diameter / 2 + 4
  const arcCircumference = 2 * Math.PI * arcRadius
  const arcDashoffset = arcCircumference * (1 - arcProgress)
  const isFrontierConcept = data.isFrontierConcept === true
  const isDraggingNode = data.isDraggingNode === true
  const onSetHover = typeof data.onSetHover === 'function' ? data.onSetHover : null
  const safeZoom = typeof zoom === 'number' && zoom > 0 ? zoom : 1
  const counterScale =
    safeZoom < LABEL_PIN_ZOOM ? 1 / safeZoom : safeZoom > LABEL_MAX_ZOOM ? 1 : 1

  const handleMouseEnter = (event) => {
    if (isDraggingNode || !onSetHover) {
      return
    }
    onSetHover({
      kind: 'node',
      id: data.node?.id ?? '',
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
    <div
      className={`relative rounded-full px-3 py-2.5 backdrop-blur-sm transition-[box-shadow,transform,opacity,filter] duration-300 ease-out ${
        selected || accentRing ? 'ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-slate-950' : ''
      } ${card}`}
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 overflow-visible"
        width={arcSvgSize}
        height={arcSvgSize}
        viewBox={`0 0 ${arcSvgSize} ${arcSvgSize}`}
        style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
      >
        <circle
          cx={arcCenter}
          cy={arcCenter}
          r={arcRadius}
          fill="none"
          stroke="rgb(71 85 105 / 0.45)"
          strokeWidth={arcStrokeWidth}
        />
        {isFrontierConcept ? (
          <circle
            cx={arcCenter}
            cy={arcCenter}
            r={arcRadius}
            fill="none"
            stroke="rgb(34 211 238 / 0.75)"
            strokeWidth={arcStrokeWidth}
            className="atlas-frontier-concept-arc"
          />
        ) : null}
        {arcProgress > 0 ? (
          <circle
            cx={arcCenter}
            cy={arcCenter}
            r={arcRadius}
            fill="none"
            stroke="rgb(34 211 238 / 0.95)"
            strokeWidth={arcStrokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcCircumference}
            strokeDashoffset={arcDashoffset}
          />
        ) : null}
      </svg>
      <Handle id="target-top" type="target" position={Position.Top} className={floatingHandleClass} />
      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        className={floatingHandleClass}
      />
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        className={floatingHandleClass}
      />
      <Handle id="target-left" type="target" position={Position.Left} className={floatingHandleClass} />
      <Handle id="source-top" type="source" position={Position.Top} className={floatingHandleClass} />
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        className={floatingHandleClass}
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        className={floatingHandleClass}
      />
      <Handle id="source-left" type="source" position={Position.Left} className={floatingHandleClass} />
      <div
        className="flex h-full flex-col items-center justify-center text-center"
        style={{
          transform: `scale(${counterScale})`,
          transformOrigin: 'center',
        }}
      >
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-slate-50">
          {data.title}
        </p>
      </div>
    </div>
  )
}
