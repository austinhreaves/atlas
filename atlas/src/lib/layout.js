import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'

const DEFAULT_MASS = 1
const MAX_MASS = 3
const LAYOUT_TICKS = 300

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function createSeededRandom(seedText) {
  let seed = 2166136261
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }

  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function getLinkTypeScale(type) {
  if (type === 'foundational') {
    return 0.8
  }
  if (type === 'supporting') {
    return 1
  }
  return 1.25
}

function getLinkStrength(type) {
  if (type === 'foundational') {
    return 0.2
  }
  if (type === 'supporting') {
    return 0.12
  }
  return 0.08
}

export function computeMass(node, edges) {
  if (typeof node?.mass === 'number') {
    return node.mass
  }

  const foundationalOutgoingCount = Array.isArray(edges)
    ? edges.filter((edge) => edge?.source === node?.id && edge?.type === 'foundational').length
    : 0

  return clamp(DEFAULT_MASS + 0.5 * foundationalOutgoingCount, DEFAULT_MASS, MAX_MASS)
}

export function computeLayout(nodes, edges) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return {}
  }

  const seedText = [
    ...nodes.map((node) => node.id).sort(),
    ...((Array.isArray(edges) ? edges : [])
      .map((edge) => `${edge.source}:${edge.target}:${edge.type}:${edge.weight}`)
      .sort()),
  ].join('|')

  const random = createSeededRandom(seedText)
  const simulationNodes = nodes.map((node) => {
    const pinned = node?.position?.pinned === true
    const initialX = pinned && typeof node?.position?.x === 'number' ? node.position.x : random() * 800 - 400
    const initialY = pinned && typeof node?.position?.y === 'number' ? node.position.y : random() * 800 - 400

    return {
      id: node.id,
      mass: computeMass(node, edges),
      x: initialX,
      y: initialY,
      fx: pinned ? node.position.x : null,
      fy: pinned ? node.position.y : null,
    }
  })

  const validNodeIds = new Set(simulationNodes.map((node) => node.id))
  const simulationEdges = (Array.isArray(edges) ? edges : [])
    .filter((edge) => validNodeIds.has(edge.source) && validNodeIds.has(edge.target))
    .map((edge) => ({ ...edge }))

  const simulation = forceSimulation(simulationNodes)
    .randomSource(random)
    .force(
      'link',
      forceLink(simulationEdges)
        .id((node) => node.id)
        .distance((edge) => {
          const weight = clamp(
            typeof edge.weight === 'number' ? edge.weight : 0.5,
            0.05,
            1,
          )
          return (220 / weight) * getLinkTypeScale(edge.type)
        })
        .strength((edge) => getLinkStrength(edge.type)),
    )
    .force('charge', forceManyBody().strength((node) => -180 * node.mass))
    .force('center', forceCenter(0, 0))
    .force('collision', forceCollide().radius((node) => 24 + node.mass * 16))

  for (let i = 0; i < LAYOUT_TICKS; i += 1) {
    simulation.tick()
  }
  simulation.stop()

  return simulationNodes.reduce((positions, node) => {
    positions[node.id] = { x: node.x, y: node.y }
    return positions
  }, {})
}
