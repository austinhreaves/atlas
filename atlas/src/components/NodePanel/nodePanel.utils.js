export function getCausalStructureLabel(causalStructure) {
  if (causalStructure === 'symmetric') {
    return 'Conservation law'
  }
  if (causalStructure === 'contextual') {
    return 'Bidirectional relationship'
  }
  return 'driver(s) -> response via parameter(s)'
}

export function getVariableTypeLabel(variableType) {
  if (variableType === 'constant') return 'Constant'
  if (variableType === 'fundamental') return 'Fundamental Quantity'
  if (variableType === 'derived') return 'Derived Quantity'
  return 'Quantity'
}

export function getVariableRowClass(role, hasUnifiedConservedBand) {
  if (hasUnifiedConservedBand) {
    return 'border-emerald-400/25 bg-emerald-500/10'
  }
  if (role === 'driver') {
    return 'border-amber-400/30 bg-amber-500/10'
  }
  if (role === 'response') {
    return 'border-sky-400/30 bg-sky-500/10'
  }
  if (role === 'covariate') {
    return 'border-slate-500/40 bg-slate-800/40 italic text-slate-300'
  }
  if (role === 'conserved') {
    return 'border-emerald-400/25 bg-emerald-500/10'
  }
  return 'border-slate-600/50 bg-slate-800/40'
}

export function getScopeBadgeClass(scope) {
  if (scope === 'primary') {
    return 'border-amber-400/30 bg-amber-500/15 text-amber-200'
  }
  if (scope === 'noted') {
    return 'border-sky-400/30 bg-sky-500/15 text-sky-200'
  }
  return 'border-slate-600/60 bg-slate-800/70 text-slate-300'
}

export function formatWeight(weight) {
  if (typeof weight !== 'number' || Number.isNaN(weight)) {
    return '0.00'
  }
  return weight.toFixed(2)
}
