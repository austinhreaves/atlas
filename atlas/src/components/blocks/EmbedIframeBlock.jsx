import { validateEmbedUrl } from '../../lib/embedAllowlist'

export default function EmbedIframeBlock({ data }) {
  const title = typeof data?.title === 'string' && data.title.trim().length > 0 ? data.title : 'Embedded content'
  const result = validateEmbedUrl(data?.url)

  if (!result.ok) {
    return (
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
        Embed blocked: {result.reason}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-900/70">
      <iframe
        title={title}
        src={result.normalizedUrl}
        className="h-72 w-full"
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

