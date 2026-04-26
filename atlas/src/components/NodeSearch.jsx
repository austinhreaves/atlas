import { useEffect, useMemo, useRef, useState } from 'react'
import KatexText from './KatexText.jsx'

const MAX_RESULTS = 8

function toSearchableText(value) {
  return typeof value === 'string' ? value.toLowerCase() : ''
}

function getNodeDisplayTitle(node) {
  if (typeof node?.title === 'string' && node.title.trim().length > 0) {
    return node.title
  }
  return node?.id ?? ''
}

/** @param {{ nodes: Array<{ id: string, title?: string, layer: string, domain?: string, canonical_symbol?: string, keywordSearchText?: string }>, onSelectNode: (nodeId: string) => void, isMobile?: boolean }} props */
export default function NodeSearch({ nodes = [], onSelectNode, isMobile = false }) {
  const containerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return []
    }
    return nodes
      .filter((node) => {
        const titleMatch = toSearchableText(node.title).includes(normalizedQuery)
        const idMatch = toSearchableText(node.id).includes(normalizedQuery)
        const symbolMatch =
          node.layer === 'variable' &&
          toSearchableText(node.canonical_symbol).includes(normalizedQuery)
        const keywordMatch = toSearchableText(node.keywordSearchText).includes(normalizedQuery)
        return titleMatch || idMatch || symbolMatch || keywordMatch
      })
      .slice(0, MAX_RESULTS)
  }, [nodes, normalizedQuery])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handlePointerDown = (event) => {
      if (containerRef.current?.contains(event.target)) {
        return
      }
      setIsOpen(false)
      setHighlightedIndex(0)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [normalizedQuery])

  const hasResults = results.length > 0
  const shouldShowDropdown = isOpen && hasResults

  const selectNode = (nodeId) => {
    if (typeof onSelectNode === 'function') {
      onSelectNode(nodeId)
    }
    setQuery('')
    setIsOpen(false)
    setHighlightedIndex(0)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      setIsOpen(false)
      setHighlightedIndex(0)
      return
    }
    if (!hasResults) {
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((current) => (current + 1) % results.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((current) => (current - 1 + results.length) % results.length)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const selectedResult = results[highlightedIndex]
      if (selectedResult) {
        selectNode(selectedResult.id)
      }
    }
  }

  const inputId = isMobile ? 'node-search-input-mobile' : 'node-search-input-desktop'

  return (
    <section
      ref={containerRef}
      className="pointer-events-auto relative rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm"
    >
      <label htmlFor={inputId} className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        Search
      </label>
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(event.target.value.trim().length > 0)
        }}
        onFocus={() => {
          if (normalizedQuery.length > 0) {
            setIsOpen(true)
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          isMobile ? 'Search by title, id, symbol, keywords' : 'Search by title, id, symbol, or keywords'
        }
        aria-expanded={shouldShowDropdown}
        aria-label="Search nodes"
        className="w-full rounded-md border border-slate-600 bg-slate-800/90 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60"
      />
      {shouldShowDropdown ? (
        <ul
          role="listbox"
          aria-label="Node search results"
          className="absolute left-2 right-2 top-[66px] z-50 max-h-72 overflow-auto rounded-md border border-slate-700 bg-slate-950/95 p-1 shadow-2xl shadow-black/70"
        >
          {results.map((node, index) => {
            const isActive = index === highlightedIndex
            const optionLabel = node.layer === 'variable' ? node.canonical_symbol ?? node.id : getNodeDisplayTitle(node)
            return (
              <li key={node.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectNode(node.id)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition ${
                    isActive ? 'bg-cyan-500/20 text-cyan-100' : 'text-slate-200 hover:bg-slate-800/90'
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {node.layer === 'variable' ? (
                      <KatexText math={optionLabel} />
                    ) : (
                      getNodeDisplayTitle(node)
                    )}
                  </span>
                  <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wide text-slate-400">
                    {node.layer}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
