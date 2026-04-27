import { Handle, Position } from 'reactflow'

const handleClassName =
  '!h-2.5 !w-2.5 !border !border-cyan-200/90 !bg-cyan-500/70 !opacity-0 group-hover:!opacity-100 !pointer-events-auto transition-opacity'

export default function StudentNode({ data, selected }) {
  const title = typeof data?.title === 'string' && data.title.trim().length > 0 ? data.title : 'Untitled student node'
  const color = typeof data?.color === 'string' && data.color.trim().length > 0 ? data.color : null
  const borderClass = color
    ? 'border-2 border-dashed border-cyan-400/70'
    : 'border-2 border-dashed border-slate-400/65'
  const backgroundStyle = color
    ? { backgroundColor: `${color}22` }
    : undefined

  return (
    <div
      className={`group relative min-h-[56px] min-w-[150px] rounded-lg px-3 py-2 shadow-lg ${
        selected ? 'ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-slate-950' : ''
      } ${borderClass} bg-slate-900 text-slate-100`}
      style={backgroundStyle}
    >
      <Handle id="target-top" type="target" position={Position.Top} className={handleClassName} />
      <Handle id="target-right" type="target" position={Position.Right} className={handleClassName} />
      <Handle id="target-bottom" type="target" position={Position.Bottom} className={handleClassName} />
      <Handle id="target-left" type="target" position={Position.Left} className={handleClassName} />
      <Handle id="source-top" type="source" position={Position.Top} className={handleClassName} />
      <Handle id="source-right" type="source" position={Position.Right} className={handleClassName} />
      <Handle id="source-bottom" type="source" position={Position.Bottom} className={handleClassName} />
      <Handle id="source-left" type="source" position={Position.Left} className={handleClassName} />
      <span
        className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded border border-slate-500/80 bg-slate-800 text-[10px]"
        aria-hidden="true"
      >
        ✎
      </span>
      <p className="pr-6 text-xs font-semibold uppercase tracking-wide text-slate-300">Student node</p>
      <p className="mt-1 text-sm font-semibold leading-snug">{title}</p>
    </div>
  )
}
