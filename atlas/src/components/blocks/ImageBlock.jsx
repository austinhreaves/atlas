export default function ImageBlock({ data }) {
  const src = typeof data?.src === 'string' ? data.src : ''
  const alt = typeof data?.alt === 'string' ? data.alt : ''
  const caption = typeof data?.caption === 'string' ? data.caption : ''

  if (!src) {
    return <p className="text-sm text-slate-400">Image source is missing.</p>
  }

  return (
    <figure className="space-y-2">
      <img src={src} alt={alt} className="max-h-96 w-full rounded-lg border border-slate-700/70 object-contain" />
      {caption ? <figcaption className="text-xs text-slate-400">{caption}</figcaption> : null}
    </figure>
  )
}

