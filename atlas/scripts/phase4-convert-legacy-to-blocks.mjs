import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

function readJson(relativePath) {
  return fs.readFile(path.join(repoRoot, relativePath), 'utf8').then((text) => JSON.parse(text))
}

function writeJson(relativePath, value) {
  const output = `${JSON.stringify(value, null, 2)}\n`
  return fs.writeFile(path.join(repoRoot, relativePath), output, 'utf8')
}

function toInlineMath(value) {
  return typeof value === 'string' && value.trim().length > 0 ? `$${value}$` : ''
}

function appendBlock(blocks, seen, block) {
  let blockId = block.block_id
  let suffix = 2
  while (seen.has(blockId)) {
    blockId = `${block.block_id}-${suffix}`
    suffix += 1
  }
  seen.add(blockId)
  blocks.push({ ...block, block_id: blockId })
}

function asBulletList(items) {
  return items.map((item) => `- ${item}`).join('\n')
}

function conceptToBlocks(node) {
  const blocks = []
  const seen = new Set()

  if (typeof node.principle === 'string' && node.principle.trim().length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'principle',
      type: 'markdown-katex',
      title: 'Principle',
      data: { markdown: node.principle },
    })
  }

  if (typeof node.formula === 'string' && node.formula.trim().length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'formula',
      type: 'markdown-katex',
      title: 'Formula',
      data: { markdown: `$$\n${node.formula}\n$$` },
    })
  }

  if (Array.isArray(node.variables) && node.variables.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'variables',
      type: 'table',
      title: 'Variables',
      data: {
        columns: ['Symbol', 'Variable', 'Role', 'Unit', 'Description'],
        rows: node.variables.map((variable) => [
          toInlineMath(variable.symbol),
          variable.name ?? variable.id ?? '',
          variable.role ?? '',
          variable.unit ? toInlineMath(variable.unit) : '',
          variable.description ?? '',
        ]),
      },
    })
  }

  if (Array.isArray(node.applicability_conditions) && node.applicability_conditions.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'applies-when',
      type: 'markdown-katex',
      title: 'Applies When',
      data: { markdown: asBulletList(node.applicability_conditions) },
    })
  }

  if (Array.isArray(node.limiting_cases) && node.limiting_cases.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'limiting-cases',
      type: 'markdown-katex',
      title: 'Limiting Cases',
      data: {
        markdown: asBulletList(
          node.limiting_cases.map((item) => `${item.case ?? ''} -> ${item.result ?? ''}`),
        ),
      },
    })
  }

  if (Array.isArray(node.idealizations) && node.idealizations.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'assumptions',
      type: 'markdown-katex',
      title: 'Assumptions',
      data: {
        markdown: asBulletList(
          node.idealizations.map((item) => {
            const parts = [item.name ?? 'Unnamed assumption']
            if (item.scope) {
              parts.push(`(${item.scope})`)
            }
            if (item.note) {
              parts.push(`- ${item.note}`)
            }
            return parts.join(' ')
          }),
        ),
      },
    })
  }

  if (typeof node.description === 'string' && node.description.trim().length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'description',
      type: 'markdown-katex',
      title: 'Description',
      data: { markdown: node.description },
    })
  }

  if (Array.isArray(node.misconceptions) && node.misconceptions.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'misconceptions',
      type: 'table',
      title: 'Common Misconceptions',
      data: {
        columns: ['Wrong model', 'Correction'],
        rows: node.misconceptions.map((item) => [item.wrong_model ?? '', item.correction ?? '']),
      },
    })
  }

  if (typeof node.historical_context === 'string' && node.historical_context.trim().length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'historical-context',
      type: 'markdown-katex',
      title: 'Historical Context',
      data: { markdown: node.historical_context },
    })
  }

  if (Array.isArray(node.prerequisites) && node.prerequisites.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'prerequisites',
      type: 'markdown-katex',
      title: 'Prerequisites',
      data: {
        markdown: asBulletList(
          node.prerequisites.map((item) => {
            const weight = typeof item.weight === 'number' ? item.weight.toFixed(2) : 'n/a'
            return `${item.id ?? 'unknown'} (${item.type ?? 'unspecified'}, weight ${weight})`
          }),
        ),
      },
    })
  }

  if (node.visual?.type === 'phet' && typeof node.visual?.url === 'string' && node.visual.url.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'simulation',
      type: 'embed-iframe',
      title: 'Simulation',
      data: {
        url: node.visual.url,
        title: node.visual.caption ?? `${node.title ?? node.id} simulation`,
      },
    })
  }

  if (blocks.length === 0) {
    appendBlock(blocks, seen, {
      block_id: 'overview',
      type: 'markdown-katex',
      title: 'Overview',
      data: { markdown: node.title ?? node.id ?? 'Untitled concept' },
    })
  }

  return blocks
}

function variableToBlocks(variable) {
  const blocks = []
  const seen = new Set()

  appendBlock(blocks, seen, {
    block_id: 'symbol',
    type: 'markdown-katex',
    title: 'Symbol',
    data: {
      markdown: `**${variable.name ?? variable.id ?? 'Variable'}**\n\n${toInlineMath(variable.canonical_symbol)}`,
    },
  })

  appendBlock(blocks, seen, {
    block_id: 'metadata',
    type: 'table',
    title: 'Metadata',
    data: {
      columns: ['Field', 'Value'],
      rows: [
        ['Unit', toInlineMath(variable.unit)],
        ['Dimension', toInlineMath(variable.dimension)],
        ['Type', variable.vector_or_scalar ?? ''],
      ],
    },
  })

  if (typeof variable.description === 'string' && variable.description.trim().length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'description',
      type: 'markdown-katex',
      title: 'Description',
      data: { markdown: variable.description },
    })
  }

  if (typeof variable.sign_convention === 'string' && variable.sign_convention.trim().length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'sign-convention',
      type: 'markdown-katex',
      title: 'Sign Convention',
      data: { markdown: variable.sign_convention },
    })
  }

  if (Array.isArray(variable.common_aliases) && variable.common_aliases.length > 0) {
    appendBlock(blocks, seen, {
      block_id: 'common-aliases',
      type: 'table',
      title: 'Common Aliases',
      data: {
        columns: ['Symbol', 'Context'],
        rows: variable.common_aliases.map((alias) => [toInlineMath(alias.symbol), alias.context ?? '']),
      },
    })
  }

  return blocks
}

async function main() {
  const mechanicsPath = 'src/data/concepts/mechanics.json'
  const electromagnetismPath = 'src/data/concepts/electromagnetism.json'
  const variablesPath = 'src/data/variables.json'

  const [mechanics, electromagnetism, variables] = await Promise.all([
    readJson(mechanicsPath),
    readJson(electromagnetismPath),
    readJson(variablesPath),
  ])

  const convertNode = (node) =>
    node.layer === 'concept'
      ? { ...node, blocks: conceptToBlocks(node) }
      : node.layer === 'variable'
        ? { ...node, blocks: variableToBlocks(node) }
        : node

  await Promise.all([
    writeJson(mechanicsPath, mechanics.map(convertNode)),
    writeJson(electromagnetismPath, electromagnetism.map(convertNode)),
    writeJson(variablesPath, variables.map(convertNode)),
  ])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
