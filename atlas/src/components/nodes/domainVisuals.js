export const DOMAIN_VISUALS = {
  mechanics: {
    cardClass:
      'border-2 border-solid border-cyan-500/45 bg-slate-950/85 text-slate-100 shadow-[0_0_28px_-6px_rgba(34,211,238,0.28)]',
  },
  electromagnetism: {
    cardClass:
      'border-2 border-dashed border-violet-500/55 bg-slate-950/85 text-slate-100 shadow-[0_0_28px_-6px_rgba(167,139,250,0.28)]',
  },
}

export const FALLBACK_DOMAIN_CARD_CLASS =
  'border-2 border-dotted border-slate-500/50 bg-slate-950/85 text-slate-100 shadow-lg shadow-black/40'

export function getConceptDomainCardClass(domain) {
  return DOMAIN_VISUALS[domain]?.cardClass ?? FALLBACK_DOMAIN_CARD_CLASS
}
