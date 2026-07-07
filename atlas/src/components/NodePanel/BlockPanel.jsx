import { useEffect, useMemo, useState } from 'react'
import { getBlockDefinition, validateBlockRecord } from '../../data/blockRegistry'
import { getBlockState, setBlockState } from '../../lib/blockState'

function getBlockDisplayTitle(block, index) {
  if (typeof block?.title === 'string' && block.title.trim().length > 0) {
    return block.title
  }
  return `Block ${index + 1}`
}

export default function BlockPanel({ selectedNode }) {
  const blocks = useMemo(
    () => (Array.isArray(selectedNode?.blocks) ? selectedNode.blocks : []),
    [selectedNode?.blocks],
  )

  const [interactiveStateByBlockId, setInteractiveStateByBlockId] = useState({})

  useEffect(() => {
    if (!selectedNode?.id) {
      setInteractiveStateByBlockId({})
      return
    }

    const nextByBlockId = {}
    blocks.forEach((block) => {
      if (typeof block?.block_id !== 'string' || block.block_id.length === 0) {
        return
      }
      nextByBlockId[block.block_id] = getBlockState(selectedNode.id, block.block_id)
    })
    setInteractiveStateByBlockId(nextByBlockId)
  }, [blocks, selectedNode?.id])

  if (blocks.length === 0) {
    return <p className="text-sm text-slate-400">No blocks available for this node.</p>
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const validationErrors = validateBlockRecord(block)
        const definition = getBlockDefinition(block?.type)
        const blockId = typeof block?.block_id === 'string' ? block.block_id : ''
        const userState = blockId ? interactiveStateByBlockId[blockId] ?? {} : {}

        if (validationErrors.length > 0 || !definition) {
          return (
            <section
              key={blockId || `invalid-${index}`}
              className="rounded-lg border border-amber-600/50 bg-amber-500/10 p-4"
            >
              <h3 className="text-sm font-semibold text-amber-100">{getBlockDisplayTitle(block, index)}</h3>
              <p className="mt-2 text-xs text-amber-200">
                This block cannot be rendered: {validationErrors.join(' ')}
              </p>
            </section>
          )
        }

        const RenderComponent = definition.Render
        const EditorComponent = definition.Editor

        return (
          <section
            key={block.block_id}
            className="space-y-3 rounded-lg border border-slate-700/80 bg-slate-900/65 p-4"
          >
            <h3 className="text-sm font-semibold tracking-wide text-slate-100">
              {getBlockDisplayTitle(block, index)}
            </h3>

            {EditorComponent ? (
              <EditorComponent
                data={block.data}
                userState={userState}
                onUserStateChange={(nextState) => {
                  if (!selectedNode?.id || !blockId) {
                    return
                  }
                  setBlockState(selectedNode.id, blockId, nextState)
                  setInteractiveStateByBlockId((previous) => ({
                    ...previous,
                    [blockId]: nextState,
                  }))
                }}
              />
            ) : (
              <RenderComponent data={block.data} userState={userState} />
            )}
          </section>
        )
      })}
    </div>
  )
}

