export default function FileAttachmentBlock({ data }) {
  const url = typeof data?.url === 'string' ? data.url : ''
  const label = typeof data?.label === 'string' ? data.label : 'Open attachment'
  const description = typeof data?.description === 'string' ? data.description : ''

  if (!url) {
    return <p className="text-sm text-slate-400">Attachment URL is missing.</p>
  }

  return (
    <div className="rounded-lg border border-slate-700/80 bg-slate-900/60 p-3">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-cyan-200 underline-offset-2 hover:underline"
      >
        {label}
      </a>
      {description ? <p className="mt-2 text-xs text-slate-400">{description}</p> : null}
    </div>
  )
}

