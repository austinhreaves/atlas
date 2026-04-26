import { Handle, Position, useStore } from 'reactflow'
import KatexText from '../KatexText.jsx'

const floatingHandleClass =
  '!h-0 !w-0 !border-0 !bg-transparent !opacity-0 !pointer-events-none'

const VARIABLE_BASE_SIZE = 70
const LABEL_PIN_ZOOM = 0.6
const LABEL_MAX_ZOOM = 1.5

export default function VariableNode({ data, selected }) {
  const zoom = useStore((state) => state.transform[2])
  const visualState = data.visualState ?? 'base'
  const scale = visualState === 'focal' ? 1.08 : visualState === 'neighbor' ? 1.04 : 1
  const opacity = visualState === 'distant' ? 0.3 : 1
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
      className={`relative transition-[transform,opacity] duration-300 ease-out ${
        selected || visualState === 'focal' ? 'drop-shadow-[0_0_10px_rgba(148,163,184,0.75)]' : ''
      }`}
      style={{
        width: `${VARIABLE_BASE_SIZE}px`,
        height: `${VARIABLE_BASE_SIZE}px`,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full rotate-45 rounded-md border border-indigo-300/40 bg-slate-900/90 shadow-[0_0_24px_-8px_rgba(99,102,241,0.42)]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{
          transform: `scale(${counterScale})`,
          transformOrigin: 'center',
        }}
      >
        <KatexText
          math={data.canonicalSymbol ?? data.title ?? '?'}
          className="text-[14px] font-semibold text-slate-50"
        />
        <p className="mt-1 max-w-[64px] rotate-0 text-[9px] font-semibold uppercase tracking-wide text-slate-300">
          {data.title}
        </p>
      </div>
    </div>
  )
}
