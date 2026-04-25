import { useMemo } from 'react'
import katex from 'katex'

/**
 * Single source of truth for formula rendering in Atlas.
 *
 * All formulas currently come from src/data/concepts.json and are TRUSTED CONTENT
 * (hand-authored, code-reviewed, and committed to this repository).
 *
 * Any future caller that renders formulas from outside concepts.json must pass
 * source: "user" once that prop is implemented.
 */
export default function KatexText({ math, displayMode = false, className }) {
  const rendered = useMemo(() => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        strict: 'warn',
        displayMode,
        output: 'html',
      })
    } catch {
      return `<span class="katex-error">${math}</span>`
    }
  }, [displayMode, math])

  // PHASE 4: user-generated content hardening plan.
  //
  // When Atlas starts rendering formulas from user-controlled sources
  // (localStorage notes, student-authored nodes, API payloads, etc), this
  // component must become the enforcement chokepoint:
  //
  // 1) Add a source prop:
  //    source: "trusted" | "user" (default "trusted").
  //
  // 2) For source === "user", force stricter KaTeX behavior:
  //    - strict: "error"
  //    - trust: false (explicit)
  //    - keep throwOnError behavior aligned with product UX, but never allow
  //      trusted-mode fallthrough to silently permit unsafe constructs.
  //
  // 3) Reject high-risk macros before/at render:
  //    \href, \includegraphics, \input, \def, \newcommand, \renewcommand
  //    via KaTeX macro policy and/or pre-render regex validation.
  //
  // 4) If richer user math features are needed later, consider rendering
  //    user-generated formulas in a sandboxed iframe boundary.
  //
  // 5) Never treat formulas from localStorage notes, student-authored nodes,
  //    or any future API input as trusted unless explicitly marked as such
  //    through source and validated accordingly.
  return <span className={className} dangerouslySetInnerHTML={{ __html: rendered }} />
}
