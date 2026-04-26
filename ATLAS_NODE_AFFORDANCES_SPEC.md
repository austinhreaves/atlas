# Atlas — Concept Node Legibility, Domain Encoding & Hover-Peek Affordance

> This is a phase-agnostic addendum. Requirements are self-contained.
> Cursor: read this document in full before implementing any part of it.
> Phase placement: ships incrementally. Move 1 is immediate (any phase).
> Moves 2 and 3 land before Phase 3b's curriculum-scale concept expansion.

---

## Problem statement

Concept nodes presently render with two failures of legibility:

1. **Title truncation.** Titles are clipped via CSS `line-clamp-2` inside a
   fixed-diameter circle. Concepts with longer titles (e.g., "Conservation
   of Mechanical Energy," "Faraday's Law of Induction") silently lose
   trailing words. The truncation is invisible to the test suite — the
   regression has no detector.
2. **Domain label cost.** Each node renders its domain (e.g.,
   `ELECTROMAGNETISM`) as an in-circle pill, consuming ~25–30% of the
   node's vertical content area and duplicating information already
   carried by node color. Per `ATLAS_MAIN_SPEC.md` §"Visual encoding
   budget," color is the canonical channel for domain. Paying again in
   text is a redundant allocation against a scarce resource.

The label of a concept node is the primary semantic surface of the graph.
It must be complete, unambiguous, and legible at every supported zoom
level. This spec defines the contract that makes that true and the
hover-peek affordance that lets users browse neighborhoods without
collapsing the selection model.

---

## Design constraints inherited from the corpus

Solutions in this spec MUST preserve the following commitments from
existing specs. They are not negotiable here; if a proposal in this
document conflicts with one of them, this document loses.

- **Layer = shape, domain = color** (`ATLAS_MAIN_SPEC.md` §"Visual
  encoding budget"). Concept nodes are circles. Do not reshape the node
  to accommodate text. Rectangles are typographically cheaper but they
  destroy the layer-shape invariant that Phase 3a's multi-layer
  rendering depends on.
- **Floating-edge math is circle-centric** (`ATLAS_PHASE3A_SPEC.md`
  Session 3 + Session 7 notes). Silhouette changes cascade into edge
  anchoring. Diameter changes are fine; shape changes are not.
- **Layout is computed once per session and cached**
  (`ATLAS_PHASE3A_SPEC.md` Cursor notes; `ATLAS_REVEAL_NEIGHBORS_SPEC.md`
  §"Layout Model"). Hover affordances MUST NOT trigger layout
  recomputation, viewport pans, or node-position changes of any kind.
  Pure overlay rendering only.
- **Halo + count badge are reserved** for the latent-content indicator
  (`ATLAS_REVEAL_NEIGHBORS_SPEC.md` §"Collapsed State"). The hover-peek
  affordance defined here is a third visual layer; it MUST NOT collide
  visually or behaviorally with halo/badge.
- **Hover ≠ select** (`ATLAS_REVEAL_NEIGHBORS_SPEC.md` §"What This Is
  Not"). Hover is a peek; selection is a commit. A node remains selected
  while the user hovers other nodes. The user's mental model of "what am
  I currently studying" is anchored on selection alone.
- **Node visual size encodes mass**
  (`ATLAS_MAIN_SPEC.md` §"Mass as in/out blend"). Diameter is currently
  the sole expression of mass. Any diameter adjustment for typography
  fit must compose with mass-driven sizing without overwriting it.

---

## Move 1 — Remove the in-node domain label

The domain pill rendered inside each concept node is removed. Domain
remains encoded by node color (existing) and surfaced contextually
elsewhere as specified below.

### Rationale

The pill duplicates a channel (color) that already carries domain. It
costs vertical real estate inside a fixed-diameter circle that is the
node's primary semantic surface — the title. The duplication violates
the "scarce channels, deliberate allocations" discipline of
`ATLAS_MAIN_SPEC.md`.

### Replacement surfaces for domain identification

Removing the in-node label does not remove domain identifiability. It
relocates it:

- **Color → domain legend.** A small, persistent legend renders at a
  fixed position on the canvas (top-left corner, below or beside the
  layer toggle bar). One row per domain: a color swatch, the domain
  name, and (optionally) the count of concepts in that domain currently
  visible. The legend is collapsible but defaults to expanded on first
  load. It is rendered once per session, not once per node.
- **Hover card.** When the hover-peek affordance (Move 3) is active,
  the card surfaces the domain name in plain text alongside the title
  and principle. Domain identification is one click — or one hover —
  away at all times.
- **Selection panel.** Domain is already rendered in the existing
  ConceptPanel. No change.

### Color-blindness and the second channel

Per `ATLAS_MAIN_SPEC.md`, "shape *and* color, not just color" governs
**layer** encoding. Domain is currently color-only. Removing the text
label widens the gap for users with color vision deficiency.

To address this without reintroducing in-node text, add a **secondary
visual channel for domain**: per-domain border-style or stroke pattern.
Examples:

- mechanics — solid border
- electromagnetism — double-ring border or subtle dashed inner ring
- thermo / waves / modern / math — assigned as those domains activate

The secondary channel is small in pixel cost (zero content area) and
gives color-blind users a redundant cue. It is implemented in the same
PR as the label removal so the accessibility floor is never lowered.

### Acceptance

- `ConceptNode.jsx` does not render `data.domain` as text content of
  the node element.
- The domain legend component exists and renders the canonical
  domain → color mapping.
- A border-style or stroke-pattern channel encodes domain redundantly
  with color, applied per node.
- A lint test (see Tests, T5) prevents future reintroduction of the
  in-node domain label.

---

## Move 2 — Title legibility contract

Concept node titles render in full, never truncated, at all node sizes
the layout produces.

### Typography fitter

A pure function:

```
fitTitleToCircle(title: string, diameter: number, opts?) → {
  fontSize: number,        // px, within configured floor/ceiling
  diameterAdjust: number,  // additive px, ≥ 0; 0 means no adjustment needed
  willFit: boolean,        // true if the title fits in the resulting envelope
}
```

Rules:

1. The fitter measures rendered text width using a hidden canvas2D
   `measureText` (synchronous, no DOM mount required for measurement).
   Font family/weight match the node's actual rendered style.
2. The fitter solves for the largest font size in `[fontFloor,
   fontCeiling]` (default 10px / 14px) at which the title fits within
   the inscribed square of the given diameter, allowing word wrap up
   to a configured `maxLines` (default 3).
3. If even at `fontFloor` the title overflows the inscribed square,
   the fitter returns a `diameterAdjust` value such that the title
   fits at `fontFloor`, capped at `maxDiameterAdjust` (default
   `0.20 * diameter`).
4. If even at `diameter + maxDiameterAdjust` and `fontFloor` the title
   does not fit, the fitter returns `willFit: false`. This is a
   content-quality signal, not a render-time fallback. See "Authoring
   feedback loop" below.

### Composition with mass

Mass-driven diameter remains the source of truth for node size. The
fitter's `diameterAdjust` is **additive only** and applied after the
mass formula. A node never shrinks below its mass-implied diameter for
typography reasons. This preserves the visual encoding of structural
importance.

### Authoring feedback loop

The validator (`validateConceptNode`, currently implemented in
`atlas/src/data/schema.js`) gains a soft check: for every
concept node, if `fitTitleToCircle(title, mass-implied diameter)`
returns `willFit: false`, the validator emits a warning with a
suggested remediation (rename, abbreviate, or override `mass` upward).
Warnings do not block CI but are surfaced in the reviewer dashboard
(`ATLAS_AUTHORING_SPEC.md` §"Reviewer dashboard"). The author owns the
fix; the system owns the detection.

This is the future-proofing piece. As Phase 3b expands the concept
graph from 10 to 40–60 nodes, the validator will reliably catch the
new long-title cases at authoring time, not at the user's eyeballs.

### Acceptance

- `fitTitleToCircle` exists, is pure, and is unit-tested.
- `ConceptNode.jsx` calls the fitter and applies its outputs.
- `ConceptNode.jsx` does not use `line-clamp` or any CSS-based
  truncation as the primary fit strategy.
- The validator emits warnings for any concept whose title does not
  fit at its mass-implied diameter + max adjust.

---

## Move 3 — Hover-peek card overlay

Hovering over a concept node reveals a fixed-size, anchored overlay
card showing the node's essential identifying content. The card is a
**peek** — it does not change selection, does not pan the viewport,
does not modify the graph layout, and does not fully replicate the
selection panel.

### Trigger and dismissal

- **Open trigger:** `mouseenter` on the node, with no configured
  delay. Hover-peek is immediate (single-frame target) so it reads as
  responsive while scanning dense regions.
- **Close trigger:** `mouseleave` from the node OR the card. No bridge
  timeout. Card visibility follows active hover target directly.
- **Force close:** viewport pan/zoom start, node-drag start, and
  selection change to a different node.
- **Touch devices:** on touch/mobile, hover does not exist and no
  tap-and-hold surrogate is implemented in this move. Tap remains
  selection only.
- **Hover/selection contract:** hover never mutates `selectedId`.
  Selection remains click/tap commit only.

### Position and rendering

- The card renders in a portal at the React Flow viewport overlay
  layer, NOT inside the node DOM. Rendering inside the node would
  inflate the node's measured layout box and corrupt edge-anchor math.
- The hover system is single-owner state (`hoveredEntity`) at app
  level. Only one hover card can render at a time.
- The card is anchored from cached screen coordinates (`clientX`,
  `clientY`) and flips to the opposite side if the default anchor would
  clip the viewport.
- The card does NOT reposition the underlying graph, change the
  layout cache, or trigger a viewport pan. It is pure overlay.
- Hover state is cleared on viewport move start/end and drag start so
  stale coordinates are never reused.

### Node + edge shared hover architecture

Move 3's hover system is shared by node and edge surfaces; it is not
node-only state.

- **Single state owner:** App-level state
  `hoveredEntity = null | { kind: 'node' | 'edge', id, screenX, screenY }`.
- **One visible card invariant:** only one hover card is ever rendered
  at a time. Entering a new hovered entity atomically replaces the
  prior one.
- **Event source boundaries:** node components and edge components are
  producers only (publish hover enter/leave), overlay component is
  consumer only (read + render), App is coordinator.
- **Edge parity:** edge hover uses the same `hoveredEntity` channel and
  must not run a separate tooltip state machine.
- **Clear semantics:** all producers clear to `null` on leave; canvas
  orchestration clears on drag start and viewport move so stale
  coordinate anchors are never displayed.
- **Selection independence:** neither node nor edge hover paths mutate
  `selectedId`, panel state, focal/neighbor/distant emphasis, or any
  understanding-state data.
- **Mobile rule applies globally:** when `isMobile === true`, no node or
  edge hover overlay is rendered.

### Content

The card surfaces only the **identifying** content of a concept. The
selection panel remains the home for principle-application content
(applicability conditions, limiting cases, misconceptions, etc.).

Required content:

- **Title** — full, unbounded, the value the fitter is trying to fit
  in the node itself but rendered here without compromise.
- **Domain** — plain text, the surface the in-node label used to
  carry.
- **Principle** — the one-sentence `principle` field
  (`ATLAS_PHASE3A_SPEC.md` Session 5; required on all concepts).
  Truncate at ~140 characters with ellipsis if over.
- **Formula** — if present, rendered with KaTeX inline. Single line,
  scaled to fit; do not show derived forms or alternates.

Forbidden content (these belong in the selection panel only):

- Applicability conditions
- Limiting cases
- Misconceptions
- Historical context
- Variables table
- Provenance footer
- Nearby section
- Understanding-state controls

If the card replicates 70%+ of the panel, the panel loses its purpose.
The card is the headline; the panel is the article.

### Layout

- Width: ~280px fixed.
- Max height: ~6 lines of content + ~8px chrome. Card never scrolls.
  If content would exceed this, the principle is the field that
  truncates first; title and domain are always shown in full.
- Visual treatment: matches existing panel surface styling
  (slate-950/85 background, domain-tinted border accent on the
  hovered node's color), with a subtle pointer/caret toward the node
  it describes.

### Affordance to commit

The card includes a thin "Open" affordance at the bottom — a labeled
icon or "Open detail" link — that, when clicked, performs the
selection-commit equivalent of clicking the node directly. This gives
pointer users an explicit "I want to dive in" target without changing
the hover-versus-selection model.

### Coexistence with halo + count badge

- Halo continues to render on the node itself (ambient, always-on
  when latent content exists).
- Count badge expands inline on hover OR selection
  (`ATLAS_REVEAL_NEIGHBORS_SPEC.md` §"Count badge"). When the hover
  card is open, the badge expansion still happens on the node — the
  card does NOT re-render the badge. Badge lives on the node; card
  lives next to it. They are siblings in the visual hierarchy.

### Selection independence

Hover state and selection state are independent. Hovering node A
while node B is selected:

- Leaves B's selection panel open and unchanged.
- Renders the hover card anchored to A.
- Does not change `selectedId`.
- Does not collapse, swap, or re-render the panel.

This is the affordance the user requested: "have one node selected
while still browsing the nearby nodes."

### Acceptance

- The card renders in a portal at the viewport overlay, not inside the
  node element.
- The card opens on hover immediately (no timer delay) and closes
  immediately on leave.
- The card force-closes on viewport pan/zoom, drag start, and
  selection change.
- Hovering does not modify `selectedId` or the selection panel.
- The card content is constrained to title, domain, principle, and
  formula. The forbidden-content list is enforced by component
  contract and tested.
- Touch/mobile renders no hover card surface at all.

---

## Tests

Each test below MUST be in place before its corresponding Move ships.

### T1 — No-truncation invariant (Move 2)

For every entity in `concepts.json`, render `ConceptNode` headlessly
(jsdom + canvas measurement, OR Playwright snapshot+measure) at the
diameter implied by `computeMass(node, edges) + diameterAdjust`.
Assert:

- The rendered title's bounding box width ≤ inscribed-square width.
- The rendered title's bounding box height ≤ inscribed-square height.
- No descendant of the title node has `text-overflow: ellipsis`
  applied as a render-time consequence.

This test is the spec made executable. New long-titled concepts cannot
land without either fitting or producing an explicit validator
warning.

### T2 — Typography fitter unit tests (Move 2)

Pure-function tests of `fitTitleToCircle`:

- Short title at small diameter: returns `fontCeiling`,
  `diameterAdjust: 0`, `willFit: true`.
- Medium title at medium diameter: returns a font size in the floor–
  ceiling range, `diameterAdjust: 0`, `willFit: true`.
- Long title at small diameter: returns `fontFloor`, non-zero
  `diameterAdjust`, `willFit: true`.
- Pathological title at small diameter (longer than max-adjust can
  fit): returns `fontFloor`, `diameterAdjust: maxDiameterAdjust`,
  `willFit: false`.
- Title containing math symbols / unicode: measurement accounts for
  glyph width.
- Empty title: returns deterministic safe defaults; does not throw.

### T3 — Hover card behavior (Move 3)

React Testing Library integration tests:

- Hover triggers card immediately; mouseleave dismisses immediately.
- Hover does not modify `selectedId` (asserted via store/spy or
  selection-derived UI assertion).
- Starting a node drag while a card is open closes the card.
- Viewport pan/zoom while a card is open closes the card.
- Card content includes title, domain, principle. Card does NOT
  contain text matching applicability/limiting/misconception/variable
  field labels.
- Selecting another node while a card is open: card closes; new
  panel opens; previous panel state replaced normally.
- Mobile/touch rendering path never mounts the hover card.

### T4 — Visual regression (optional, Move 2 + 3)

Playwright snapshot tests covering:

- Three canonical concept titles (shortest, median, longest) at three
  mass values (1.0, 2.0, 3.0) — nine snapshots.
- Hover card open against each of the three.

Skip if Playwright is not already wired into CI; revisit at Phase 3b
mobile-responsive work, which will need Playwright anyway.

### T5 — Lint test against in-node domain label (Move 1)

A unit test that imports `ConceptNode.jsx` source as text and asserts
the string does not contain a JSX expression rendering `data.domain`
as visible text. Belt-and-suspenders against future regression. This
is intentionally crude and intentionally cheap.

### T6 — Validator warning for unfittable titles (Move 2)

For each fixture concept whose title is engineered to exceed
max-adjust at its mass-implied diameter, `validateConceptNode` emits
a warning containing the concept ID, the title, and the suggested
remediation categories.

---

## Sequencing

Ship in this order, each as its own PR:

1. **Move 1** — Remove the in-node domain label, add the legend, add
   the secondary domain channel (border style), add T5. ~1–2 hours.
   Likely resolves a meaningful share of legibility complaints on its
   own.
2. **Move 2** — Implement `fitTitleToCircle`, integrate into
   `ConceptNode.jsx`, add validator warning, add T1, T2, T6.
   Permanently closes the truncation regression class.
3. **Move 3** — Hover card overlay, immediate-open immediate-close
   behavior, T3, optionally T4. Unlocks the "browse while selected"
   affordance.

Each move is independently shippable and adds value without the next.
Order is not strictly required but is strongly recommended — Move 1
is the cheapest and biggest signal; Move 2 builds the durable
contract; Move 3 builds the new affordance on top of that contract.

---

## What this spec is not

- **Not a redesign of the selection model.** Selection panel behavior
  is unchanged. The hover card is additive.
- **Not a replacement for the Nearby panel.**
  (`ATLAS_REVEAL_NEIGHBORS_SPEC.md` Move 3 of that spec.) Nearby
  surfaces cross-layer connected entities ranked by ZPD; the hover
  card surfaces the hovered concept's own headline content. Different
  jobs, different surfaces.
- **Not a layout-engine change.** No node positions move. No edges
  re-anchor. Layout cache invariants from `ATLAS_PHASE3A_SPEC.md` are
  preserved verbatim.
- **Not a domain-encoding change.** Color → domain is unchanged. The
  border-style channel is additive redundancy, not replacement.
- **Not LLM-authored content surfacing.** Provenance display rules
  from `ATLAS_AUTHORING_SPEC.md` are unaffected; provenance lives in
  the panel only, not the card.

---

## Phase placement

- **Move 1**: any phase, immediate. No schema or layer dependencies.
- **Move 2**: before Phase 3b's concept expansion. The validator
  warning pays off as new concepts land; landing concepts before the
  warning exists is the regression case this spec is preventing.
- **Move 3**: alongside or before Phase 3b's Nearby panel work.
  Sharing of overlay/portal infrastructure is likely; coordinate
  implementation so the card and Nearby don't duplicate positioning
  primitives.

---

## Open questions

These are deferred to implementation but flagged so they don't get
silently resolved by the first reasonable-looking PR:

1. **Border-style assignments per domain.** Specific patterns for
   thermo, waves, modern, math TBD when those domains activate. Pick
   distinguishable patterns at low pixel cost; avoid anything that
   reads as decorative noise at zoomed-out scale.
2. **Card on variable nodes (Phase 3a) and other layers (Phase 3b).**
   This spec covers concept nodes only. Variable nodes have a much
   smaller content surface (symbol + name + dimension); the same
   hover-peek treatment may or may not be warranted. Decide at
   variable layer activation.
3. **Card behavior when latent-content count badge is also expanding
   on hover.** Visual choreography may need a small stagger to avoid
   simultaneous-bloom feel. Address at implementation; do not
   over-spec here.
4. **Maximum supported title length.** If most physics concepts in
   the eventual ~60-node corpus fit comfortably, the
   `maxDiameterAdjust` of 20% is sufficient. If a meaningful fraction
   triggers `willFit: false`, raise the cap or reconsider whether the
   title naming convention itself needs guidance (e.g., short
   canonical names + longer descriptive subtitles).
