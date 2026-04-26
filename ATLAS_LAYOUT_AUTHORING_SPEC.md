# Atlas — Interactive Layout Authoring & Per-User Layout Persistence

> This is a phase-agnostic addendum. Requirements are self-contained.
> Cursor: read this document in full before implementing any part of it.
> Phase placement: Move 1 lands before Phase 3b's curriculum-scale concept
> expansion. Move 2 follows immediately after. This spec is the foundation
> on top of which `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` (forthcoming)
> builds the student-construction pedagogical primitive.

---

## Problem statement

The Atlas graph layout is currently produced by a deterministic force
simulation at session load, with optional per-node `position` overrides
in the entity JSON (introduced in Phase 2). The simulation does an
acceptable job at 10 concepts. It will not at 60. As Phase 3b expands
the concept graph to curriculum scale, three connected pressures
emerge:

1. **Edge crossings increase non-linearly with node count.** Force-
   directed layouts do not minimize crossings. Atlas's planned mix of
   prerequisite, isomorphism, and Noether-consequence edges at 60+
   nodes will produce a visually noisy graph regardless of force
   parameters.
2. **Pedagogical placement matters.** Some nodes (Newton's 2nd,
   Conservation of Energy, Maxwell's equations) are gravitational
   centers of their domains. The force algorithm doesn't know that.
   Hand-placement by an author who *does* know that produces a more
   readable, more pedagogically loaded layout than any heuristic.
3. **Per-user layout state is a foundation other features need.**
   The forthcoming construction-mode spec — students rearranging the
   graph and drawing their own edges as a graded assignment — depends
   on layout serialization, persistence, and import/export. Building
   that infrastructure for author use first lets construction mode
   inherit it cleanly.

Algorithmic edge-crossing minimization is NP-hard in the general case.
For a graph at Atlas's scale (10–150 nodes) with pedagogical-quality
constraints, hand-placement by an authoring human is faster, cheaper,
and produces a better artifact than any tractable algorithm. This spec
formalizes hand-placement as a first-class workflow.

---

## Design constraints inherited from the corpus

- **Layout is computed once per session and cached**
  (`ATLAS_PHASE3A_SPEC.md` Cursor notes; `ATLAS_REVEAL_NEIGHBORS_SPEC.md`
  §"Layout Model"). Drag-driven position changes update the cache key
  and invalidate cached force-layout outputs for affected nodes only.
  Selection, hover, and panel browsing MUST NOT trigger layout
  recomputation; only explicit drag interactions or pin/unpin actions
  do.
- **`position` is the existing pin field.** Phase 2 introduced
  `position: { x, y }` on concept nodes as an authored override.
  `ATLAS_PHASE3A_SPEC.md` says: *"`position` from Phase 2 is preserved
  as an optional pin."* This spec extends the meaning of `position` —
  authored value is the canonical pin; user-dragged values live
  separately and override at runtime without mutating canonical JSON.
- **Floating-edge math is circle-centric** (`ATLAS_PHASE3A_SPEC.md`
  Session 3 + 7 notes). Drag updates a node's position; edges
  re-anchor automatically via the existing floating-handle nearest-
  border logic. No additional edge work required.
- **The graph is for students, not for the LLM**
  (`ATLAS_AUTHORING_SPEC.md` §"Core principles"). User-modified layouts
  must not affect what the eventual AI tutor RAG-grounds on. Provenance-
  marked canonical positions are the only positions the tutor sees.
- **Mass and shape encode meaning** (`ATLAS_MAIN_SPEC.md`). Drag changes
  position only. It does not change diameter, shape, layer, or any
  visual encoding. A user cannot "resize" a node by dragging.
- **Public-tool ethos** (`ATLAS_VISION.md`). Per-user layouts are
  optional, opt-in, and never gate access to canonical content. A user
  with no saved layout sees the canonical layout, full stop.

---

## Conceptual model: three layout states

Atlas tracks three distinct sources of layout truth, in increasing
precedence:

1. **Computed** — output of the force simulation. The default for any
   node lacking a more authoritative source. Cached at session load.
2. **Canonical pin** — `position` field on the entity JSON, authored
   and reviewed. Overrides computed for that node. Visible to all
   users by default.
3. **User layout** — per-user position overrides stored client-side
   (localStorage). Overrides canonical pin and computed for that user
   only. Never written back to entity JSON automatically.

Author-mode (defined below) is the mechanism by which a user with
authoring privileges can promote their user-layout positions to
canonical pins via an explicit export → JSON-PR step. There is no
auto-promotion; canonical changes always pass through human review
the same way any other entity field does.

---

## Move 1 — Drag interaction & per-user persistence

### Drag interaction

- Concept and variable nodes are draggable in normal mode.
  React Flow's `nodesDraggable` is set to `true`; this is the existing
  default but must be made explicit in `GraphCanvas.jsx` so it is not
  inadvertently changed.
- Drag updates the node's position in React Flow's internal node
  state. On `onNodeDragStop`, the new position is committed to the
  user-layout store (see below).
- Drag does not interact with selection: starting a drag does NOT
  select the node, completing a drag does NOT change `selectedId`.
  Selection remains a click action.
- Multi-node drag (selecting multiple nodes and dragging as a group)
  is not in scope for this spec; React Flow's default single-node
  drag is sufficient. Group operations are a Phase 4-or-later
  concern.

### User-layout persistence

A per-user layout store, distinct from understanding state and layer
visibility persistence:

- **Storage:** `localStorage`, key `atlas_user_layout_v1`.
- **Shape:**

```json
{
  "version": 1,
  "saved_at": "2026-04-25T12:34:56.000Z",
  "positions": {
    "newtons-second-law": { "x": 120.5, "y": -340.2 },
    "ohms-law":           { "x": 480.0, "y": 220.0 }
  },
  "metadata": {
    "atlas_corpus_hash": "sha256:abcd1234...",
    "user_note": null
  }
}
```

- **`positions`** maps entity ID → `{x, y}`. Only nodes the user has
  moved appear here. Unmoved nodes fall through to canonical or
  computed.
- **`atlas_corpus_hash`** is a hash of the published-entity ID set,
  computed at session load. Used to detect "the corpus has changed
  since you saved this layout" and warn the user (some IDs in their
  layout may no longer exist; some new entities have no user
  position). Resolution is non-destructive — orphaned entries are
  retained but flagged; missing entries fall through to canonical.
- **`user_note`** is reserved for the construction-mode spec;
  unused in Move 1.

### Resolution order at render time

For each entity, compute its render-time position by:

1. If user-layout has a position for this entity, use it.
2. Else if entity JSON has a `position` field set, use it.
3. Else use the cached force-simulation position.

This composes cleanly with the existing layout cache: the cache stores
computed positions only. User-layout and canonical pins are applied as
overrides at the `toFlowNodes` stage, not in the cache.

### Layout controls UI

A small "Layout" control surface, visible in normal mode at a fixed
canvas position (top-right, alongside the existing React Flow
`<Controls />` widget or as a sibling group):

- **Reset to canonical** — discards the user-layout store, returns
  every node to its canonical or computed position. Confirmation
  prompt before destructive action.
- **Reset selected** — if a node is selected, returns just that node
  to its canonical or computed position. Useful for backing out a
  single mis-drag without losing the rest.
- **Export layout** — downloads a `.atlas-layout.json` file
  containing the user-layout store payload. File format is the
  store shape above plus a few additional fields for portability:

```json
{
  "format": "atlas-layout",
  "format_version": 1,
  "exported_at": "2026-04-25T12:34:56.000Z",
  "atlas_corpus_hash": "sha256:abcd1234...",
  "atlas_corpus_version": "v3.0.0",
  "positions": { ... },
  "user_note": null,
  "exporter": {
    "type": "user",
    "user_id": null
  }
}
```

- **Import layout** — opens a file picker for `.atlas-layout.json`,
  validates the file against a JSON schema, warns on corpus-hash
  mismatch (with options to proceed/cancel), and writes the imported
  positions into the user-layout store. Existing user-layout is
  replaced wholesale, not merged — merge semantics are deferred to
  the construction-mode spec where they have meaning.

Export and import are the foundation that the construction-mode spec
extends. Move 1 ships the file format with `user_note: null` and
`exporter.type: "user"`; construction mode adds richer fields under
the same format banner.

### Acceptance for Move 1

- `nodesDraggable: true` is set explicitly in `GraphCanvas.jsx`.
- Dragging a node persists its new position to localStorage at
  `atlas_user_layout_v1`, in the documented shape.
- Reloading the page restores user-layout positions.
- Reset-to-canonical and reset-selected work as specified.
- Export produces a valid `.atlas-layout.json` file matching the
  documented format.
- Import accepts a valid file, validates it, applies it, and warns on
  corpus-hash mismatch.
- Drag does not change `selectedId`. Selection is unaffected.
- A user with no user-layout sees the existing canonical/computed
  layout — i.e., zero behavioral change for users who never drag.

---

## Move 2 — Author mode & canonical pin promotion

The user-facing artifact in Move 1 is per-user; canonical content does
not change. Move 2 adds the pathway by which an author (Austin,
designated reviewer) promotes their dragged positions to canonical
pins in the entity JSON.

### Author-mode entry

- URL parameter `?edit=layout` enables author mode for the current
  session. No accounts in 3b; the URL parameter is the gate. This
  matches the existing `?include=draft` pattern from Phase 3a Session
  7.
- Author mode is visible — a banner at the top of the canvas reads
  "Author mode — layout edits affect the canonical graph upon
  export." This is the same pattern as the draft-content banner.
- Author mode activates a second persistence target: an *author-
  layout store* in localStorage at `atlas_author_layout_v1`,
  separate from the user-layout store. Author drags write here, not
  to the user-layout store.

### Why two stores

User and author layouts must not interfere. A reviewer who has been
exploring Atlas as a regular user has a user-layout reflecting their
personal arrangement. When they enter author mode to fix a node
position canonically, they must not accidentally promote their
personal arrangement to canonical, nor should entering author mode
discard their personal layout.

The two stores share the same shape; they're addressed by separate
keys and surfaced through separate UI affordances.

### Author-mode controls

In addition to all Move 1 controls, author mode adds:

- **Export to canonical JSON patch** — produces a `.json`-style patch
  describing the position changes against the current entity JSON,
  ready to paste into a PR. The format is one entry per modified
  entity:

```json
{
  "format": "atlas-canonical-patch",
  "format_version": 1,
  "generated_at": "2026-04-25T12:34:56.000Z",
  "atlas_corpus_version": "v3.0.0",
  "patches": [
    {
      "entity_id": "newtons-second-law",
      "field": "position",
      "old_value": null,
      "new_value": { "x": 120.5, "y": -340.2 }
    },
    {
      "entity_id": "ohms-law",
      "field": "position",
      "old_value": { "x": 100, "y": 200 },
      "new_value": { "x": 480.0, "y": 220.0 }
    }
  ]
}
```

  This is a paste-ready artifact; the human applies it to the
  appropriate JSON files in a PR. No auto-write to JSON files in
  Move 2. (Auto-write is a Phase 4 CMS concern; Phase 3b retains JSON-
  via-PR as the canonical authoring channel per
  `ATLAS_AUTHORING_SPEC.md`.)
- **Diff view** — a panel listing every author-layout position change
  vs. canonical. Each row: entity ID, old position, new position,
  Δx/Δy magnitude. Clicking a row pans/zooms to that node. Enables
  the author to review their changes before exporting.
- **Discard author edits** — clears the author-layout store without
  affecting the user-layout store.

### Validator integration

`validateConceptNode` and `validateVariableNode` already accept
`position` as an optional field (Phase 2 / 3a). Move 2 adds:

- A unit test that round-trips an `atlas-canonical-patch` through a
  test fixture: apply the patch to a fixture entity, validate, assert
  the validator passes and the position is updated correctly.
- A unit test that the patch generator produces deterministic output
  given the same author-layout store and same canonical state.

No new schema fields are required.

### Acceptance for Move 2

- `?edit=layout` enables author mode and renders the author-mode
  banner.
- Drags in author mode write to `atlas_author_layout_v1`, leaving
  `atlas_user_layout_v1` untouched.
- Export-to-canonical-patch produces a valid patch file matching the
  documented format.
- Diff view accurately reflects all pending author-layout changes
  vs. canonical.
- Discard author edits clears author-layout but not user-layout.
- Round-trip test (apply patch → validate → assert) passes.

---

## Interactions with other specs

### `ATLAS_NODE_AFFORDANCES_SPEC.md`

The hover-peek card opens on hover, regardless of drag state. During
an active drag (mouse held down on a node), the card MUST NOT open —
suppress hover-card triggers while a drag is in progress. This is
straightforward in React Flow's event model (`onNodeDragStart` /
`onNodeDragStop` bracket the drag).

### `ATLAS_REVEAL_NEIGHBORS_SPEC.md`

Layout cache invariants from that spec are preserved. The cache key
is unchanged (entity-id-set across all layers); user-layout and
author-layout are post-cache overrides. Halo and count-badge rendering
are position-anchored — they move with the node during drag without
special handling.

### `ATLAS_AUTHORING_SPEC.md`

Position changes are not currently provenance-tracked at the field
level. The canonical-patch export is the closest analog: it produces
a human-readable artifact that becomes the PR's diff, and the PR's
git history is the provenance. No `provenance.position_history`
field is added in this spec; if it becomes necessary in Phase 4 (e.g.,
as part of the CMS), it is added then.

### Forthcoming `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`

Construction mode extends the file format defined here:

- `format: "atlas-layout"` is a superset shared with construction-mode
  files; construction mode adds `format: "atlas-concept-map"` (or a
  versioned discriminator within the same format) and additional
  top-level fields for student-drawn edges, assignment context, and
  submission metadata.
- The user-layout store is the substrate construction mode operates
  on; construction mode adds a parallel "construction store" that
  also tracks edges-drawn-by-student.
- The import/export plumbing in Move 1 is reused by construction mode
  with extended validation rules.

This spec deliberately reserves the `user_note` field and the
`exporter.type` enum so construction mode can extend without bumping
`format_version`. Construction mode will set
`exporter.type: "student-construction"` and populate `user_note` with
assignment context.

---

## Tests

### T1 — Drag persists to user-layout store

Integration test (React Testing Library + jsdom):

- Render `GraphCanvas` with a fixture set of nodes, none with
  canonical positions.
- Simulate a drag on one node.
- Assert localStorage at `atlas_user_layout_v1` contains the dragged
  position for that node.
- Assert no other node has an entry in the store.
- Reload (re-render), assert the dragged node renders at the new
  position.

### T2 — Resolution order

Unit test of the position-resolution function:

- Entity with no canonical, no user-layout → returns computed.
- Entity with canonical, no user-layout → returns canonical.
- Entity with canonical and user-layout → returns user-layout.
- Entity with no canonical, user-layout → returns user-layout.
- Entity not in computed cache, no canonical, no user-layout → returns
  fallback default and emits a dev-mode warning.

### T3 — Reset-to-canonical and reset-selected

Integration tests:

- After dragging three nodes, reset-to-canonical clears all three from
  the user-layout store and re-renders at canonical/computed positions.
- After dragging three nodes, reset-selected on one of them clears
  only that node's entry from the store; the other two remain.

### T4 — Export/import round-trip

Unit test:

- Populate user-layout store with N entries.
- Export to file (in-memory blob).
- Validate file against the documented JSON schema.
- Reset user-layout.
- Import the file.
- Assert user-layout store matches the pre-export state.
- Assert corpus-hash mismatch is detected when importing against a
  modified corpus.

### T5 — Author mode isolation

Integration test:

- Populate user-layout store.
- Enter author mode (`?edit=layout`).
- Drag a node; assert author-layout store updated, user-layout store
  unchanged.
- Exit author mode (drop URL param, reload).
- Assert user-layout positions render, not author-layout positions.

### T6 — Canonical-patch generation

Unit test:

- Populate author-layout store with three node moves.
- Generate canonical-patch.
- Validate against documented patch format.
- Apply patch to a fixture entity-set programmatically.
- Validate the patched entities pass `validateConceptNode` /
  `validateVariableNode`.
- Assert patched positions match expected.

### T7 — Drag does not change selection

Integration test:

- Render with a node selected.
- Drag a *different* node.
- Assert `selectedId` is unchanged after drag start, drag move, and
  drag stop.
- Assert the selected node's panel is still open.

### T8 — Hover card suppressed during drag

Integration test:

- Render `GraphCanvas` with hover-card affordance from
  `ATLAS_NODE_AFFORDANCES_SPEC.md` enabled.
- Begin dragging node A.
- While drag is in progress, hover node B.
- Assert hover card does NOT open.
- Drop the drag.
- Hover node B again, assert hover card now opens normally.

---

## Sequencing

1. **Move 1, MVP** — drag persists to user-layout, reset-to-canonical,
   reset-selected, T1–T3, T7. ~half a day. Ships immediate visual win
   (users can rearrange) without authoring complexity.
2. **Move 1, full** — export/import, corpus-hash detection, T4. ~half
   a day on top of MVP.
3. **Move 2** — author mode, two-store discipline, canonical-patch
   export, diff view, T5–T6. ~half a day on top of Move 1 full.
4. **Hover-card integration test (T8)** — when both this spec and
   `ATLAS_NODE_AFFORDANCES_SPEC.md` Move 3 are implemented. Owner is
   whichever spec ships second.

Total estimate: ~1.5 days for full implementation across both Moves,
plus ~half a day for thorough testing and edge cases. Construction
mode (separate spec) builds on top.

---

## What this spec is not

- **Not a layout algorithm change.** The force simulation continues to
  produce the computed layer of the layout. This spec adds an override
  layer above it, not a replacement.
- **Not a multi-user collaboration feature.** User-layouts are local
  to a single browser. Sharing requires explicit export/import. There
  is no real-time co-editing, no server-mediated layout sync, no
  account-bound layout state. (Phase 4 may revisit; Phase 3b does not.)
- **Not a CMS.** Author mode produces a paste-ready patch artifact;
  it does not write to JSON files. JSON-via-PR remains the canonical
  authoring channel, per `ATLAS_AUTHORING_SPEC.md`.
- **Not a concept-map construction tool.** That is the forthcoming
  `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`. This spec provides the
  layout-state and serialization plumbing that construction mode
  extends; it does not include student-drawn edges, assignment
  context, grading affordances, or any of the pedagogical-primitive
  surface area.
- **Not a node creation/deletion mechanism.** Users cannot add nodes,
  remove nodes, or change the entity set via this spec. They can only
  reposition existing nodes. Construction mode addresses node
  inclusion/exclusion separately.
- **Not a substitute for algorithmic crossing minimization in
  perpetuity.** It is, in practice, a substitute *for Atlas at the
  scales we expect through Phase 3b and Phase 4*. If Atlas grows past
  ~150 nodes and hand-placement becomes infeasible, the question can
  be reopened; until then, hand-placement is the answer.

---

## Open questions

1. **Variable-node draggability.** Variables are activated in
   Phase 3a. Do users (and authors) drag variable nodes the same way
   as concept nodes? Default answer in this spec: yes, identical
   behavior. Reconsider if variable-node placement turns out to have
   different pedagogical constraints (e.g., always proximate to the
   concept that defines them).
2. **Drag affordance discoverability.** Users who have never
   encountered dragging in Atlas may not realize it's available. Do
   we need a one-time hint, a cursor change on hover, or both?
   Implementation discretion; not a load-bearing decision.
3. **Mobile drag.** Touch-drag-vs-touch-tap disambiguation works in
   React Flow's defaults but is finicky. Phase 3b's mobile responsive
   work owns the final UX decision; this spec defers.
4. **Author-mode authentication.** `?edit=layout` is a soft gate
   suitable for solo / small-team authoring. If multiple authors with
   different scopes emerge before Phase 4, a stronger gate may be
   needed. Out of scope here.
5. **Canonical-patch automation.** Move 2 deliberately stops at
   "paste-ready patch artifact." A future enhancement could write
   directly to the local JSON files via a dev-server endpoint, but
   that introduces filesystem-write semantics that don't belong in
   the public web app and are better solved by Phase 4 CMS work.
