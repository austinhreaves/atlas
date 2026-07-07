import KatexText from '../KatexText'

function splitMathTokens(text) {
  const source = typeof text === 'string' ? text : ''
  if (!source) {
    return [{ type: 'text', value: '' }]
  }

  const regex = /(\$\$[^$]+\$\$|\$[^$\n]+\$)/g
  const segments = []
  let cursor = 0
  let match = regex.exec(source)
  while (match) {
    if (match.index > cursor) {
      segments.push({ type: 'text', value: source.slice(cursor, match.index) })
    }
    const token = match[0]
    if (token.startsWith('$$')) {
      segments.push({ type: 'math', value: token.slice(2, -2), displayMode: true })
    } else {
      segments.push({ type: 'math', value: token.slice(1, -1), displayMode: false })
    }
    cursor = match.index + token.length
    match = regex.exec(source)
  }
  if (cursor < source.length) {
    segments.push({ type: 'text', value: source.slice(cursor) })
  }
  return segments
}

function renderInline(text, keyPrefix) {
  return splitMathTokens(text).map((segment, index) =>
    segment.type === 'math' ? (
      <KatexText
        key={`${keyPrefix}-math-${index}`}
        math={segment.value}
        displayMode={segment.displayMode}
        className={segment.displayMode ? 'block py-1' : undefined}
      />
    ) : (
      <span key={`${keyPrefix}-text-${index}`}>{segment.value}</span>
    ),
  )
}

export default function MarkdownKatexBlock({ data }) {
  const markdown = typeof data?.markdown === 'string' ? data.markdown : ''
  const lines = markdown.split('\n')
  const rendered = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    if (trimmed.length === 0) {
      continue
    }

    if (trimmed.startsWith('## ')) {
      rendered.push(
        <h4 key={`h2-${index}`} className="mt-3 text-base font-semibold text-slate-100">
          {renderInline(trimmed.slice(3), `h2-${index}`)}
        </h4>,
      )
      continue
    }

    if (trimmed.startsWith('# ')) {
      rendered.push(
        <h3 key={`h1-${index}`} className="mt-3 text-lg font-semibold text-slate-100">
          {renderInline(trimmed.slice(2), `h1-${index}`)}
        </h3>,
      )
      continue
    }

    if (trimmed.startsWith('- ')) {
      const listItems = []
      let listIndex = index
      while (listIndex < lines.length && lines[listIndex].trim().startsWith('- ')) {
        listItems.push(lines[listIndex].trim().slice(2))
        listIndex += 1
      }
      rendered.push(
        <ul key={`ul-${index}`} className="ml-5 list-disc space-y-1 text-sm text-slate-200">
          {listItems.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`}>{renderInline(item, `li-${index}-${itemIndex}`)}</li>
          ))}
        </ul>,
      )
      index = listIndex - 1
      continue
    }

    rendered.push(
      <p key={`p-${index}`} className="text-sm leading-6 text-slate-200">
        {renderInline(line, `p-${index}`)}
      </p>,
    )
  }

  if (rendered.length === 0) {
    return <p className="text-sm text-slate-400">No content provided.</p>
  }

  return <div className="space-y-2">{rendered}</div>
}

