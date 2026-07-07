export function PromptResponseBlockRender({ data, userState }) {
  const prompt = typeof data?.prompt === 'string' ? data.prompt : ''
  const responseText = typeof userState?.responseText === 'string' ? userState.responseText : ''

  if (!prompt) {
    return <p className="text-sm text-slate-400">Prompt is missing.</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-100">{prompt}</p>
      <div className="rounded-lg border border-slate-700/80 bg-slate-900/60 p-3 text-sm text-slate-200">
        {responseText || <span className="text-slate-400">No response yet.</span>}
      </div>
    </div>
  )
}

export function PromptResponseBlockEditor({ data, userState, onUserStateChange }) {
  const prompt = typeof data?.prompt === 'string' ? data.prompt : ''
  const responseText = typeof userState?.responseText === 'string' ? userState.responseText : ''
  const placeholder =
    typeof data?.placeholder === 'string' && data.placeholder.trim().length > 0
      ? data.placeholder
      : 'Write your response'

  if (!prompt) {
    return <p className="text-sm text-slate-400">Prompt is missing.</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-100">{prompt}</p>
      <textarea
        value={responseText}
        placeholder={placeholder}
        onChange={(event) => {
          onUserStateChange?.({ responseText: event.target.value })
        }}
        className="min-h-28 w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
      />
    </div>
  )
}

