import KatexText from './KatexText.jsx'
import { getEdgeTypeLabel } from './FloatingEdge.jsx'

const EDGE_CARD_MIN_WIDTH = 240
const EDGE_CARD_MAX_WIDTH = 300
const CONCEPT_CARD_MIN_WIDTH = 280
const CONCEPT_CARD_MAX_WIDTH = 320
const VARIABLE_CARD_MIN_WIDTH = 220
const VARIABLE_CARD_MAX_WIDTH = 260
const CARD_OFFSET_PX = 12

function getNodeTitle(node) {
  return typeof node?.title === 'string' && node.title.length > 0
    ? node.title
    : typeof node?.name === 'string' && node.name.length > 0
      ? node.name
      : typeof node?.id === 'string'
        ? node.id
        : 'Untitled'
}

function getEdgeTitles(edge, nodeById) {
  const sourceNode = nodeById.get(edge?.source)
  const targetNode = nodeById.get(edge?.target)
  return {
    sourceTitle: getNodeTitle(sourceNode),
    targetTitle: getNodeTitle(targetNode),
  }
}

function truncateLine(value, maxChars = 110) {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  if (trimmed.length <= maxChars) {
    return trimmed
  }
  return `${trimmed.slice(0, maxChars - 1)}…`
}

export function getVerticalPlacement(screenY) {
  return screenY < 120 ? 'below' : 'above'
}

function baseCardClassName(widthPx) {
  return `rounded-xl border border-slate-700/70 bg-slate-900/90 p-3 text-slate-100 shadow-xl shadow-black/40 backdrop-blur-sm ${widthPx}`
}

function renderConceptCard(node) {
  const principleLine = truncateLine(node?.principle, 120)

  return (
    <div className={baseCardClassName('w-[300px]')}>
      <div className="text-base font-semibold leading-tight text-slate-50">{getNodeTitle(node)}</div>
      {typeof node?.domain === 'string' && node.domain.length > 0 ? (
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-300">{node.domain}</p>
      ) : null}
      {typeof node?.formula === 'string' && node.formula.length > 0 ? (
        <div className="mt-2 text-sm text-cyan-100">
          <KatexText math={node.formula} />
        </div>
      ) : null}
      {principleLine ? <p className="mt-2 text-xs text-slate-200">{principleLine}</p> : null}
    </div>
  )
}

function renderVariableCard(node) {
  const symbol = node?.canonical_symbol ?? node?.symbol ?? node?.title ?? node?.name ?? '?'
  const name = getNodeTitle(node)

  return (
    <div className={baseCardClassName('w-[240px]')}>
      <div className="text-lg font-semibold text-slate-50">
        <KatexText math={symbol} />
      </div>
      <p className="mt-1 text-sm text-slate-200">{name}</p>
      {typeof node?.dimension === 'string' && node.dimension.length > 0 ? (
        <p className="mt-1 text-xs text-slate-300">Dimension: {node.dimension}</p>
      ) : null}
    </div>
  )
}

function renderEdgeCard(edge, nodeById) {
  const typeLabel = getEdgeTypeLabel(edge?.type)
  const { sourceTitle, targetTitle } = getEdgeTitles(edge, nodeById)
  const rationale = truncateLine(edge?.rationale, 220)

  return (
    <div className={baseCardClassName('w-[270px]')}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{typeLabel}</p>
      <p className="mt-1 text-sm text-slate-100">
        {sourceTitle} {'\u2192'} {targetTitle}
      </p>
      {rationale ? <p className="mt-2 text-xs text-slate-200">{rationale}</p> : null}
    </div>
  )
}

export default function HoverCardOverlay({
  hoveredEntity,
  nodeById,
  edgeById,
  isMobile = false,
  isDraggingNode = false,
}) {
  if (isMobile || isDraggingNode || !hoveredEntity) {
    return null
  }

  const screenX = Number.isFinite(hoveredEntity.screenX) ? hoveredEntity.screenX : 0
  const screenY = Number.isFinite(hoveredEntity.screenY) ? hoveredEntity.screenY : 0
  const placement = getVerticalPlacement(screenY)
  const translateY = placement === 'above' ? `calc(-100% - ${CARD_OFFSET_PX}px)` : `${CARD_OFFSET_PX}px`
  const style = {
    left: `${screenX}px`,
    top: `${screenY}px`,
    transform: `translate(-50%, ${translateY})`,
  }

  let content = null

  if (hoveredEntity.kind === 'node') {
    const node = nodeById.get(hoveredEntity.id)
    if (!node) {
      return null
    }
    if (node.layer === 'variable') {
      content = renderVariableCard(node)
    } else {
      content = renderConceptCard(node)
    }
  } else if (hoveredEntity.kind === 'edge') {
    const edge = edgeById.get(hoveredEntity.id)
    if (!edge) {
      return null
    }
    content = renderEdgeCard(edge, nodeById)
  }

  if (!content) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
      <div className="absolute" style={style}>
        {content}
      </div>
    </div>
  )
}

export {
  EDGE_CARD_MAX_WIDTH,
  EDGE_CARD_MIN_WIDTH,
  CONCEPT_CARD_MAX_WIDTH,
  CONCEPT_CARD_MIN_WIDTH,
  VARIABLE_CARD_MAX_WIDTH,
  VARIABLE_CARD_MIN_WIDTH,
}
