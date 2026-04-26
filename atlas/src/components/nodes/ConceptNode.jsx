import { Handle, Position } from 'reactflow'

// Domain is never rendered as text (see ATLAS_NODE_AFFORDANCES_SPEC.md): encode via
// fill/glow (domain) plus border style (mechanics = solid, electromagnetism = dashed).
const domainCardClass = {
  mechanics:
    'border-2 border-solid border-cyan-500/45 bg-slate-950/85 text-slate-100 shadow-[0_0_28px_-6px_rgba(34,211,238,0.28)]',
  electromagnetism:
    'border-2 border-dashed border-violet-500/55 bg-slate-950/85 text-slate-100 shadow-[0_0_28px_-6px_rgba(167,139,250,0.28)]',
}

const floatingHandleClass =
  '!h-0 !w-0 !border-0 !bg-transparent !opacity-0 !pointer-events-none'

export default function ConceptNode({ data, selected }) {
  const domain = data.domain
  const card =
    domainCardClass[domain] ??
    'border-2 border-dotted border-slate-500/50 bg-slate-950/85 text-slate-100 shadow-lg shadow-black/40'
  const mass = Math.max(1, Math.min(3, typeof data.mass === 'number' ? data.mass : 1))
  const diameter = 80 + (mass - 1) * 20
  const visualState = data.visualState ?? 'base'
  const scale = visualState === 'focal' ? 1.1 : visualState === 'neighbor' ? 1.06 : 1
  const selectionActive = visualState !== 'base'
  const isUnderstood = data.isUnderstood === true
  const opacity = selectionActive ? (visualState === 'distant' ? 0.3 : 1) : isUnderstood ? 0.7 : 1
  const accentRing = visualState === 'focal'
  const filter = !selectionActive && isUnderstood ? 'saturate(0.3)' : undefined

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
        filter,
      }}
    >
      {isUnderstood ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-500/80 text-[10px] font-bold text-slate-950">
          ✓
        </span>
      ) : null}
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
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-slate-50">
          {data.title}
        </p>
      </div>
    </div>
  )
}
