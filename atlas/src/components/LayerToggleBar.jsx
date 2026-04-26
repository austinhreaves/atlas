function formatLayerLabel(layerId) {
  if (typeof layerId !== 'string' || layerId.length === 0) {
    return ''
  }
  return layerId.charAt(0).toUpperCase() + layerId.slice(1)
}

function LayerShapeGlyph({ shape }) {
  if (shape === 'diamond') {
    return <span className="inline-block h-3 w-3 rotate-45 rounded-[2px] border border-current" />
  }
  if (shape === 'square') {
    return <span className="inline-block h-3 w-3 rounded-[2px] border border-current" />
  }
  if (shape === 'hexagon') {
    return (
      <span
        className="inline-block h-3 w-3 border border-current"
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
      />
    )
  }
  if (shape === 'octagon') {
    return (
      <span
        className="inline-block h-3 w-3 border border-current"
        style={{
          clipPath:
            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        }}
      />
    )
  }
  return <span className="inline-block h-3 w-3 rounded-full border border-current" />
}

export default function LayerToggleBar({
  layerEntries,
  allLayerKeys = new Set(layerEntries.map(([layerId]) => layerId)),
  visibleLayers,
  onToggleLayer,
  onSelectAllLayers,
  onClearAllLayers,
}) {
  const enabledLayerIds = layerEntries
    .filter(([, layer]) => typeof layer?.schema_validator === 'function')
    .map(([layerId]) => layerId)
  const hasLayers = allLayerKeys.size > 0
  const allEnabledVisible =
    enabledLayerIds.length > 0 && enabledLayerIds.every((layerId) => visibleLayers.has(layerId))
  const noneVisible = visibleLayers.size === 0

  return (
    <section className="pointer-events-auto rounded-xl border border-slate-700/70 bg-slate-900/90 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Layers</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelectAllLayers}
          disabled={!hasLayers}
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            !hasLayers
              ? 'cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500'
              : allEnabledVisible
                ? 'border-slate-700 bg-slate-800/70 text-slate-500'
                : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={onClearAllLayers}
          disabled={!hasLayers}
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            !hasLayers
              ? 'cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500'
              : noneVisible
                ? 'border-slate-700 bg-slate-800/70 text-slate-500'
                : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
          }`}
        >
          None
        </button>
        {layerEntries.map(([layerId, layer]) => {
          const isEnabled = typeof layer?.schema_validator === 'function'
          const isActive = visibleLayers.has(layerId)
          return (
            <button
              key={layerId}
              type="button"
              disabled={!isEnabled}
              onClick={() => onToggleLayer(layerId)}
              className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide transition ${
                isEnabled
                  ? isActive
                    ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                    : 'border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700/90'
                  : 'cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500'
              }`}
              aria-label={`Toggle ${layerId} layer`}
            >
              <LayerShapeGlyph shape={layer?.shape} />
              <span>{formatLayerLabel(layerId)}</span>
              {!isEnabled ? (
                <span className="rounded border border-slate-600/80 px-1 py-0 text-[9px] uppercase tracking-wider text-slate-400">
                  Phase 3b
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
