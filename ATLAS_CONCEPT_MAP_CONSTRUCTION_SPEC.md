# Atlas — Concept Map Construction Mode (Pedagogical Primitive)

> This is a phase-agnostic addendum. Requirements are self-contained.
> Cursor: read this document in full before implementing any part of it.
> Phase placement: MVP lands in Phase 3b, after
> `ATLAS_LAYOUT_AUTHORING_SPEC.md` is implemented. This spec depends on
> that one for layout state, file format, and serialization plumbing.

---

## Problem statement

Atlas's reference and exploration modes treat the canonical graph as the
artifact a student consumes. Concept-map research from physics education
(Novak; Mintzes, Wandersee, Novak; PER concept-mapping literature)
establishes that the *act of constructing* a map of conceptual
relationships is itself a high-leverage learning activity — students who
build their own maps and then compare them to canonical references retain
structural understanding measurably better than students who only read
canonical maps.

Atlas is uniquely positioned to operationalize this. Phase 3a's
multi-layer corpus, Phase 3b's curriculum-scale concept set, and the
layout-authoring infrastructure from
`ATLAS_LAYOUT_AUTHORING_SPEC.md` together provide the substrate for a
*construction mode*: students drag a curated set of concepts into a
spatial arrangement that makes sense to them, draw the connections they
believe exist, and submit the resulting map as evidence of their
conceptual organization. Peer and TA review of the submission — with
inline annotations — is where the most important learning happens.

This spec defines that mode.

---

## Pedagogical thesis

Construction mode operationalizes three claims:

1. **Mental models are spatial.** Students who can produce a coherent
   spatial arrangement of related concepts have a more durable grasp of
   the conceptual structure than students who only recognize one when
   shown.
2. **Drawing the edges is harder than recognizing them.** A student who
   can identify a prerequisite relationship in canonical content may
   still fail to draw it from scratch. The asymmetry is diagnostic.
3. **The discussion is the learning.** Comparing maps — student-to-
   canonical, student-to-peer, student-to-TA-annotation — surfaces
   misconceptions and structural gaps in a way no closed-form quiz
   does. The submission is a discussion artifact, not a final answer.

Construction mode is engineered around these claims. Every design
decision below is downstream of them.

---

## Design constraints inherited from the corpus

- **Depends on `ATLAS_LAYOUT_AUTHORING_SPEC.md`** for: drag interaction,
  position resolution order, file-format scaffold (`format:
  "atlas-layout"` versioning), import/export plumbing, localStorage
  conventions. This spec extends those primitives; it does not redefine
  them.
- **Layer = shape, domain = color**
  (`ATLAS_MAIN_SPEC.md` §"Visual encoding budget"). Construction mode
  operates on existing concept and variable nodes; it does not add new
  shapes, layers, or colors.
- **Layout is computed once per session and cached**
  (`ATLAS_PHASE3A_SPEC.md`). Construction mode does NOT run the force
  simulation against student-drawn edges; the edges are pure overlays.
  Node positions are student-authored from initial node-bank state, not
  force-computed.
- **The canonical graph is never mutated by student activity.**
  (`ATLAS_VISION.md`, `ATLAS_AUTHORING_SPEC.md`.) Construction mode is
  read-only against canonical entity JSON. Student-drawn edges, student
  positions, and student annotations live entirely in
  construction-mode files and stores; canonical never reads from them.
- **The graph is for students, not for the LLM**
  (`ATLAS_AUTHORING_SPEC.md`). The eventual AI tutor RAG-grounds on
  canonical content only. Construction-mode submissions are NOT
  ingested as content, ever.
- **Public-tool ethos** (`ATLAS_VISION.md`). A user without an
  assignment can still enter construction mode for self-study. No
  account or institutional gate.
- **Hover ≠ select; selection is sacred**
  (`ATLAS_REVEAL_NEIGHBORS_SPEC.md`,
  `ATLAS_NODE_AFFORDANCES_SPEC.md`). Construction-mode interaction
  preserves these invariants.
- **No backend, no accounts, no LTI** (Phase 3b out-of-scope per
  `ATLAS_PHASE3B_SPEC.md`). Submissions are files; Canvas is the
  delivery channel via standard file submission.

---

## The three modes of Atlas

This spec formalizes Atlas as having three distinct modes, with explicit
URL gates and visible mode banners:

| Mode | Gate | Banner | Purpose |
|---|---|---|---|
| Reference | default | none | Browse the canonical graph (current Atlas) |
| Author | `?edit=layout` | "Author mode" | Edit canonical layout (per layout-authoring spec) |
| Construction | `?mode=construct[&assignment=<id>]` | "Construction mode — your work, not the canonical graph" | Build a personal/assignment concept map |

Modes are mutually exclusive within a session. Entering construction
mode hides canonical edges, swaps to the construction UI, and switches
the persistence target. Exiting (clearing the URL param + reload)
restores canonical view. The user's construction-mode work persists in
localStorage across mode switches.

---

## Conceptual model: the construction file

A construction-mode session produces a single artifact — a
`.atlas-map.json` file (extension TBD; see Open Questions). The file is
a superset of the layout-authoring file format:

```json
{
  "format": "atlas-concept-map",
  "format_version": 1,
  "extends": "atlas-layout/1",
  "exported_at": "2026-04-25T12:34:56.000Z",
  "atlas_corpus_hash": "sha256:abcd1234...",
  "atlas_corpus_version": "v3.0.0",

  "exercise_variant": "recover-prerequisites-untyped",

  "assignment": {
    "id": "phy132-w04-rc-circuits",
    "title": "PHY 132 Week 4 — RC Circuit Concept Map",
    "instructor": "austin",
    "due_at": "2026-05-01T23:59:00.000Z",
    "node_set": ["ohms-law", "rc-circuits", "exponential-decay", "..."],
    "rubric_url": null,
    "instructions": "Free-text instructions authored with the assignment.",
    "context_hash": "sha256:efgh5678..."
  },

  "authors": [
    { "name": "Student A", "role": "primary" },
    { "name": "Student B", "role": "collaborator" }
  ],

  "node_bank": {
    "available": ["ohms-law", "rc-circuits", "..."],
    "placed":    ["ohms-law", "rc-circuits"]
  },

  "positions": {
    "ohms-law":     { "x": 100, "y": 200 },
    "rc-circuits":  { "x": 280, "y": 200 }
  },

  "edges": [
    {
      "id": "user-edge-1",
      "source": "ohms-law",
      "target": "rc-circuits",
      "type": "foundational",
      "label": null,
      "confidence": null
    }
  ],

  "annotations": [
    {
      "id": "ann-1",
      "target": { "kind": "edge", "id": "user-edge-1" },
      "author": "ta-jane",
      "role": "ta",
      "created_at": "2026-04-26T10:00:00.000Z",
      "body": "Why foundational and not lateral? What does RC require that Ohm's Law provides?",
      "resolved": false
    }
  ],

  "submission": {
    "submitted": false,
    "submitted_at": null,
    "self_review_complete": false,
    "peer_reviews": []
  },

  "exporter": {
    "type": "student-construction",
    "user_id": null
  }
}
```

The shape above is the full file at submission time. Earlier
construction states (mid-edit, no annotations yet) include only the
fields populated so far; the file is forward-compatible with empty
arrays / null fields.

### Field semantics

- **`exercise_variant`** — one of:
  - `recover-prerequisites-untyped` (MVP)
  - `recover-prerequisites-typed`
  - `recover-prerequisites-typed-directed`
  - `build-novel-connections`

  Defines validation rules, comparison semantics, and grading metrics.
  See "Exercise variants" below.

- **`assignment`** — present when entered via `?assignment=<id>`;
  absent (or null) for unscoped self-study sessions. `node_set` is
  the active-node list; `context_hash` covers the assignment's
  authored content so submissions can be matched to the assignment
  version they were drafted against.

- **`authors`** — at least one entry; first entry is `role: "primary"`.
  Additional collaborators added via the "Add Collaborator" button
  carry `role: "collaborator"`. Names are free-text strings, no
  account binding. All names appear in the export.

- **`node_bank.available`** — entity IDs the student can place.
  **`node_bank.placed`** — entity IDs the student has dragged onto
  the workspace (subset of `available`). Entities in `available`
  but not `placed` render in the bank UI; entities in `placed` render
  on the canvas.

- **`positions`** — entity ID → coordinates. Same shape as
  layout-authoring spec. Only placed entities appear here.

- **`edges`** — student-drawn edges. `type` is constrained per
  `exercise_variant`: untyped variant emits `type: "untyped"`; typed
  variants accept the canonical edge-type vocabulary (`foundational |
  supporting | lateral | definitional`); novel-connections variant
  accepts arbitrary string types and a `label` field.

- **`annotations`** — comments on nodes or edges, authored during
  review. `target.kind` is `"edge" | "node" | "map"` (map-level for
  global comments). `role` is `"self" | "peer" | "ta" |
  "instructor"`. `resolved` allows back-and-forth without losing
  history.

- **`submission`** — submission lifecycle metadata. `submitted: true`
  freezes the file as the official submission; further edits produce
  a *new* file with `parent_id` (deferred to a later version of this
  spec). `peer_reviews` is an array of imported peer-review files
  that have been merged into this submission's annotations.

### Validator rules

A `validateConstructionFile(file)` validator covers:

- Format / version fields present and recognized.
- `atlas_corpus_hash` is a valid SHA-256 string; mismatch with current
  corpus is a warning, not an error.
- `exercise_variant` is one of the four enumerated values.
- If `assignment` is present, every `node_bank.available` entry
  matches the assignment's `node_set`.
- Every `node_bank.placed` entry is in `node_bank.available`.
- Every `positions` key is in `node_bank.placed`.
- Every `edges[].source` and `edges[].target` is in `node_bank.placed`.
- `edges[].type` matches the exercise variant's allowed types.
- `annotations[].target.id` resolves to an edge or node in the file
  (or, for `kind: "map"`, no resolution required).
- `authors` is non-empty; exactly one entry has `role: "primary"`.

Validator runs at import time, at export time, and when files cross the
review boundary (TA imports a student file → validate before
annotating).

---

## Exercise variants

Four variants, sharing the same infrastructure. Each is a parameter on
the construction-mode UI and the validator; they are not separate code
paths.

### A — Recover prerequisites, untyped (MVP)

Student is given a node bank. They place nodes and draw edges
indicating "this concept is a prerequisite of that one." Edge type
is uniform (`untyped`); direction may or may not be expected
(implementation chooses one — this MVP requires direction, with the
expected rendering being source → target as "is prerequisite of").

**Comparison:** student edges are matched against canonical
prerequisite edges among the same node set, ignoring canonical edge
type. Metrics: recall, precision, F1.

**Why MVP:** simplest validator rules, cleanest auto-metrics, exercises
every piece of the infrastructure (node bank, drag, edge drawing,
review annotations) without the cognitive overhead of typing or the
interpretive complexity of novel connections. Maps cleanly onto a
weekly assignment.

### B — Recover prerequisites, typed

As variant A, but student must also assign each edge a type from the
canonical vocabulary (`foundational | supporting | lateral |
definitional`). Edge direction still required.

**Comparison:** matched edges are scored on type accuracy in addition
to presence. Metrics gain per-type recall/precision and a
type-confusion matrix.

### C — Recover prerequisites, typed and directed

As variant B, but direction is explicitly graded. Student must commit
to direction before the edge is registered. Reverse-direction edges
score zero on canonical match (not a partial credit case — getting
direction wrong on a foundational relationship is a real
misunderstanding worth detecting).

**Comparison:** strict canonical match required. Reverse-direction
edges are flagged in the diff as "direction-inverted" rather than
"missing."

### D — Build novel connections

No canonical comparison. Student places nodes, draws edges, and labels
each edge with their own description of the relationship. Optional
type from a free-text or controlled list.

**Comparison:** no automated grading. Self/peer/TA annotation is the
entire signal. Metrics are descriptive only (edge count, average
degree, clustering coefficient — for instructor cohort views in
Phase 4, not for individual grading).

**Pedagogical use:** advanced or open-ended assignments;
in-class brainstorming; pre-instruction concept inventories.

---

## Construction-mode UI

### Entry

Student visits a URL with `?mode=construct&assignment=<id>` (assignment
mode) or `?mode=construct` (unscoped self-study). On entry:

- The construction-mode banner renders at the top of the canvas: "You
  are working on your own concept map. The canonical graph is hidden."
- Canonical edges are hidden.
- Canonical positions are ignored — the canvas starts empty (no node
  is "placed" until the student drags it).
- The node bank panel opens on the left side of the canvas (or a
  drawer at narrow widths).
- An assignment-context panel renders at the top (collapsed by
  default after first read) showing title, instructions, due date.
- An author/collaborator widget is visible: shows current authors,
  with "Add Collaborator" button.

### Node bank

A vertical scrollable list along the canvas's left edge. Each row:

- Layer shape glyph (concept circle, variable diamond) + entity title.
- A small drag handle / "Place" affordance.
- Domain color swatch (per `ATLAS_NODE_AFFORDANCES_SPEC.md` Move 1's
  legend pattern).
- Entities already placed render as dimmed in the bank.

The bank's contents:

- Assignment-scoped: exactly the entities listed in
  `assignment.node_set`.
- Unscoped self-study: entities determined by the user's filter
  selections (domain toggles + tag filters + manual entity-picker).
  This filter UI is a small extension of the existing domain filter
  bar.

Drag a row from the bank onto the canvas → entity becomes "placed,"
appears at the drop position, removed from the active bank list (or
shown dimmed).

Drag a placed entity off the canvas back to the bank (or click an
"unplace" affordance on the node) → removes from `placed` and
removes any edges touching it (with confirmation prompt).

### Edge drawing

Click-and-drag from the border of one placed node to the border of
another draws an edge. React Flow supports edge-creation natively;
construction mode enables it (it is disabled in reference and author
modes).

The interaction:

1. Hover near a node's border → a small handle appears.
2. Click and drag from the handle → an in-progress edge follows the
   cursor.
3. Drop on another node's border → an edge is created.

For typed/directed variants, an edge-properties popover appears on
edge creation: type picker, direction confirmation (default = drag
direction). For untyped MVP, no popover; edges are created as
`type: "untyped"` with direction = drag direction.

Edges are deletable (click an edge → keyboard delete, or right-click →
delete).

### Saving

Construction-mode work persists continuously to localStorage, key
`atlas_construction_<assignment_id_or_unscoped>_v1`. Format matches
the file format above. Auto-save on every state change.

The user can have multiple assignments in progress simultaneously;
each lives at its own localStorage key. A "My Maps" panel lists all
in-progress maps with title, last-modified, and a switch-to button.

### Submitting

Clicking "Submit" (or "Export submission" — they are aliases):

1. Runs the validator. If errors, surfaces them and blocks submission.
2. Prompts the student to confirm authors are correct.
3. Marks the file `submission.submitted: true`,
   `submission.submitted_at: <now>`.
4. Triggers download of the `.atlas-map.json` file.

The student uploads the file to Canvas via the standard file-submission
mechanism. Atlas does not communicate with Canvas in 3b. (Phase 4 LTI
work owns automation.)

The local store is preserved after submission so the student retains a
working copy. A submitted file is not editable in-place — re-opening
and editing produces a new file with no submission flag.

### Adding collaborators

The author widget shows the primary author by default (auto-populated
from a one-time prompt at first construction-mode entry, stored in
localStorage at `atlas_user_identity_v1` as `{ name }`). An "Add
Collaborator" button prompts for a name and adds an entry with
`role: "collaborator"`.

Collaborators are file metadata only; there is no permissions model,
no real-time collab, no per-author tracking of which edges or
annotations belong to which collaborator. (That last would be useful
and is deferred to a future spec extension; flagged in Open Questions.)

---

## Review and annotation

### Importing for review

A reviewer (peer, TA, instructor) imports a student's `.atlas-map.json`
via the existing import affordance from `ATLAS_LAYOUT_AUTHORING_SPEC.md`
Move 1, plus a "Open as review" mode flag. The construction-mode UI
opens with the imported file's state, plus a review-mode banner: "You
are reviewing [Student A]'s submission. Your edits will be saved as
annotations."

In review mode:

- Node bank is read-only (cannot place/unplace).
- Existing edges are read-only (cannot create/delete).
- Existing positions are read-only (cannot drag).
- Annotation tools are enabled: clicking any node, edge, or empty
  canvas area opens an annotation composer.

The reviewer's name is captured at the start of the review (default
from `atlas_user_identity_v1`, prompt to confirm).

### Annotation composer

A small inline panel anchored to the annotation target:

- Free-text body (markdown supported, KaTeX permitted).
- Save / Cancel.
- For existing annotations: Reply (creates a child annotation linked
  to the parent), Resolve (sets `resolved: true`), Edit (own
  annotations only).

Annotations render as small numbered pins on their target. Hovering
shows a count badge; clicking opens a thread panel with the full
annotation conversation.

### Exporting after review

The reviewer clicks "Export annotated submission" → downloads a new
`.atlas-map.json` with `annotations[]` populated. The reviewer sends
this file back to the student through whatever channel the assignment
uses (Canvas message, email, in-class file share).

### Returning a review to the student

The student imports the annotated file. Atlas detects new annotations
(comparing to the local store's annotation set) and surfaces a
notification: "3 new annotations from ta-jane." The student can:

- View each annotation.
- Reply to annotations (adds a new annotation with the reply body).
- Resolve annotations.
- Re-export the file with their replies, sending it back.

This is the back-and-forth review loop. Each round produces a new file
with growing `annotations[]`. The assignment can require N rounds, M
annotations resolved, etc. — that is rubric design, not Atlas spec.

### Self-review

Self-review is structurally identical to peer/TA review: the student
imports their own submitted file in review mode and adds annotations
with `role: "self"`. The pedagogical purpose is the cooling-off pass
— rereading their own work after time has passed and questioning
their own choices.

### Peer review

Two students exchange `.atlas-map.json` files. Each opens the other's
in review mode, annotates, and sends back. Same machinery; only the
annotation `role` differs.

For in-class small-group activities, the most efficient pattern is one
device with multiple authors collaborating on a single map (no
exchange needed); peer review is the homework / between-class pattern.

---

## Automated metrics

For variants A, B, and C, Atlas computes objective metrics on demand
when a submission file is loaded in review mode. Metrics surface in a
"Diff vs. canonical" panel, accessible to TAs and instructors during
review.

### Variant A metrics (untyped)

- **Canonical edges in scope** — count of canonical prerequisite
  edges among `node_bank.available`.
- **Recovered** — count of student edges matching a canonical edge
  (regardless of type).
- **Missed** — count of canonical edges with no student match.
- **Invented** — count of student edges with no canonical match.
- **Recall** = Recovered / Canonical-in-scope.
- **Precision** = Recovered / (Recovered + Invented).
- **F1** = harmonic mean of recall and precision.
- **Direction-inverted** — count of student edges matching a canonical
  edge in reverse direction (informational; not penalized in untyped
  MVP but flagged for discussion).

### Variant B metrics (typed)

All variant A metrics, plus:

- **Type accuracy** = (count of recovered edges with correct type) /
  Recovered.
- **Type-confusion matrix** — 4×4 matrix of canonical type vs. student
  type for recovered edges.

### Variant C metrics (typed + directed)

All variant B metrics, computed against strict directional match.
Direction-inverted edges count as "Missed" for the canonical edge and
"Invented" for the student edge — they are real errors, not partials.

### Variant D

No automated comparison metrics. Descriptive metrics only:

- Edge count, node count.
- Average node degree.
- Clustering coefficient.
- Largest connected component size.

These are useful for instructors comparing across cohorts, not for
grading individuals.

### Metrics rendering

The Diff panel shows:

- Numerical metrics at the top.
- A list of edges, each tagged ✔ Recovered / ✗ Missed / ⚠ Invented /
  ↺ Inverted, with click-to-highlight on the canvas.
- A "Highlight differences" toggle on the canvas: missed edges render
  as faint ghost edges (canonical, not in submission); invented edges
  highlight in a distinct color.

Metrics are advisory — the rubric is owned by the instructor, who
combines metrics with annotation-based qualitative review. Atlas does
NOT auto-assign grades.

---

## Tests

### T1 — Construction file format round-trip

Unit test: create a fixture construction state programmatically, export
to JSON, validate against schema, re-import, assert state matches.

### T2 — Validator rules

Unit tests covering each rule in "Validator rules" above. Each rule
gets a positive and negative case (file passing / failing).

### T3 — Node bank state transitions

Integration test: assignment-scoped node bank renders the correct
entities; placing moves an entity from available-only to placed;
unplacing moves it back and removes touching edges (with confirmation
mocked to accept).

### T4 — Edge creation per variant

Integration tests, one per variant:

- A: edge created with `type: "untyped"`, no popover.
- B: edge creation opens type popover; selecting "foundational"
  records type.
- C: as B, plus direction confirmation.
- D: edge creation prompts for free-text label.

### T5 — Auto-save and restore

Integration test: make changes, simulate page reload, assert state
restored from localStorage.

### T6 — Submission lifecycle

Integration test: fill a fixture map, click submit, assert validator
runs, assert downloaded file has `submission.submitted: true` and
proper timestamp, assert local store retains a working copy.

### T7 — Authors and collaborators

Integration test: default identity prompt populates primary author;
"Add Collaborator" appends a collaborator entry; export contains both
in `authors[]`.

### T8 — Review-mode import

Integration test: import a fixture submission file in review mode,
assert read-only locks (cannot place/unplace, cannot drag, cannot
draw edges), assert annotation composer opens on click.

### T9 — Annotation lifecycle

Integration tests:

- Create an annotation on a node, edge, and the map; assert each
  serializes with correct `target.kind`.
- Reply to an annotation; assert child annotation links to parent.
- Resolve an annotation; assert `resolved: true`.
- Export annotated file; re-import as student; assert new annotations
  detected and surfaced.

### T10 — Metrics correctness (variants A, B, C)

Unit tests with hand-crafted fixtures:

- Perfect recovery: recall = precision = F1 = 1.0.
- All inverted: zero correct in C; informational only in A.
- Half recovered, no invented: recall = 0.5, precision = 1.0.
- All invented: recall = 0, precision = 0.
- Type-accuracy edge cases for B.
- Type-confusion matrix correctness.

### T11 — Mode isolation

Integration tests:

- Author mode (`?edit=layout`) and construction mode
  (`?mode=construct`) cannot be active simultaneously; the URL
  param parser resolves to one mode (construction wins if both are
  present, with a warning).
- Construction-mode store does not write to layout-authoring stores.
- Exiting construction mode (clear URL, reload) restores reference
  view; reentering restores construction state.

### T12 — Cross-spec invariants

Integration tests asserting:

- Hover-card from `ATLAS_NODE_AFFORDANCES_SPEC.md` works in
  construction mode (peek without commit) and is suppressed during
  edge-drawing drag.
- Drag from `ATLAS_LAYOUT_AUTHORING_SPEC.md` works in construction
  mode for placed nodes (positions persist in construction store, not
  layout stores).
- Layout cache invariants: no recomputation on selection, hover, or
  edge creation.

---

## Sequencing

### Pre-MVP — foundation

`ATLAS_LAYOUT_AUTHORING_SPEC.md` Move 1 must be implemented and
shipped before any work in this spec begins. Move 2 (author mode) is
not strictly required but should land in parallel.

### MVP scope

The MVP ships variant A only, with the architecture explicitly
accommodating B/C/D. Specifically:

- Construction file format supports all four `exercise_variant` values
  (validator accepts all; UI exposes only A).
- Edge data model supports `type` and `label` fields (variant A emits
  `"untyped"` and `null`).
- Metrics module is structured per-variant with A as the only
  implemented variant.

### Implementation order

1. **Construction file format & validator.** Schema, validator, fixture
   round-trip tests (T1, T2). ~half day.
2. **Construction-mode entry & banner.** URL param parsing, mode
   switching, banner, store-key separation. (T11.) ~half day.
3. **Node bank UI.** Available/placed state, drag-from-bank
   interaction, unplace, dimming. (T3.) ~1 day.
4. **Edge drawing (variant A).** Click-drag edge creation, edge data
   model, edge deletion. (T4-A.) ~1 day.
5. **Auto-save & restore.** localStorage persistence, multi-map
   support, "My Maps" panel. (T5.) ~half day.
6. **Submission flow.** Validator wiring, submit button, file
   download, identity/collaborator widget. (T6, T7.) ~half day.
7. **Review mode.** Read-only locks, annotation composer, annotation
   data model. (T8, T9.) ~1.5 days.
8. **Annotation back-and-forth.** Reply, resolve, new-annotation
   detection on re-import. (T9.) ~half day.
9. **Metrics (variant A).** Diff computation, Diff panel UI, canvas
   highlight toggle. (T10.) ~1 day.
10. **Cross-spec integration tests.** (T12.) ~half day.

**MVP total estimate: ~7 days of engineering**, plus design / iteration
overhead. Treat the calendar estimate as 2 weeks for a polished ship.

### Post-MVP

- Variant B (typed edges + popover, type-accuracy metrics).
  ~1.5 days.
- Variant C (directed, strict matching, inverted-edge handling).
  ~1 day.
- Variant D (free-text labels, no canonical comparison, descriptive
  metrics).  ~1 day.
- Additional refinements identified in deployment (see Open Questions).

---

## Interactions with other specs

### `ATLAS_LAYOUT_AUTHORING_SPEC.md`

Hard dependency. Construction mode reuses drag, position persistence,
file-format scaffold, import/export plumbing. Construction-mode files
share the `format_version` banner with layout-authoring files,
discriminated by the `format` field.

### `ATLAS_NODE_AFFORDANCES_SPEC.md`

Hover-peek card behaves identically in construction mode (peek
without commit). Hover suppresses during edge-drawing drag (same
mechanism as suppression during node-drag from layout-authoring spec).

### `ATLAS_REVEAL_NEIGHBORS_SPEC.md`

Halo + count badge are HIDDEN in construction mode. The "this concept
has connected content in other layers" signal is a canonical-graph
affordance; it has no meaning in a student's construction. Nearby
panel is similarly disabled.

### `ATLAS_AUTHORING_SPEC.md`

Construction-mode submissions are explicitly *not* author content.
They do not flow into the canonical entity JSON, do not get
provenance.draft_source promotion, and are not RAG-grounded for the
eventual AI tutor. Provenance discipline applies to canonical
content; construction-mode files have their own (lighter) provenance
in `authors[]` and `submission` metadata.

### Phase 4 LTI

Phase 4 may add Canvas-LTI hooks for direct submission. Construction
file format is designed to survive that transition unchanged: the
Canvas-LTI integration would consume `.atlas-map.json` files server-
side rather than client-uploaded, but the file content is the same.

---

## What this spec is not

- **Not a quiz engine.** Construction is a constructive exercise, not a
  closed-form assessment. Atlas does not auto-grade in the strict sense;
  it computes metrics that inform a human grader.
- **Not a real-time collaboration tool.** Multi-author maps are
  serialized via "Add Collaborator" name entries; only one person edits
  at a time per device. Real-time co-editing is not in scope.
- **Not an LMS.** No assignment management UI, no class roster, no
  gradebook. Atlas authors assignments as JSON files (TBD format —
  see Open Questions); LMS-side workflow remains in Canvas.
- **Not a content-authoring tool for canonical graph.** Construction
  mode produces student artifacts. Author mode (separate spec)
  produces canonical artifacts. They never cross over.
- **Not an LLM tutor.** Atlas does not auto-generate annotations,
  suggest edges, or provide feedback during construction. The whole
  point is the student's own work. (Future LLM tutor in Phase 4 is a
  separate primitive grounded in canonical content.)
- **Not a long-term submission archive.** Submissions live in user
  filesystems and Canvas; Atlas does not store a server-side history.
  Phase 4 may revisit; Phase 3b explicitly does not.

---

## Open questions

1. **Assignment authoring format.** Assignments are referenced by ID
   in `?assignment=<id>` and in submission files. Where is the
   assignment definition stored? Options: (a) JSON files in the Atlas
   repo at `/assignments/<id>.json`, served as static content;
   (b) a separate Atlas-assignments repo; (c) inlined in the
   construction-mode URL via base64-encoded payload. Option (a) is
   cheapest and matches existing JSON-via-PR conventions; (c) avoids
   the need for any backend at all. Probably (a) for instructor-
   authored assignments and (c) for ad-hoc in-class assignments.
   Decide before implementation.
2. **Per-author edge attribution in collaborative maps.** Currently
   all edges are attributed to the file as a whole, not individual
   collaborators. For in-class small-group work this is fine; for
   homework-as-pair work it loses individual signal. Possible
   extension: per-edge `created_by` field referencing
   `authors[].name`. Defer until requested; the file format can
   accept it as an additive change.
3. **Submission versioning.** Re-exporting after a submission produces
   a new file. Should it carry `parent_id` linking to the original
   submission, building a chain? Useful for instructor visibility into
   revision history; complicates the file format. Defer; revisit if
   the assignment design pattern requires it.
4. **Pre-construction concept inventory.** Variant D (build novel
   connections) could be deployed at the *start* of a unit as a
   diagnostic — students draw what they think they know, instructor
   compares to canonical to identify what to teach. This is a
   pedagogical use case, not a spec change, but the spec should
   confirm the variant supports it (it does — empty-canonical-edge-set
   in metrics).
5. **Annotation export format for grading rubrics.** A TA might want
   to bulk-export annotations across N student submissions for
   gradebook entry. Format: CSV? JSON? Defer until grading workflow
   is real and pain points are concrete.
6. **Canvas LTI integration shape.** When Phase 4 lands LTI, the
   submission flow may shift from client-side file download to
   direct server-side post-back. The construction-mode spec should
   not preclude this; the current file-based workflow is forward-
   compatible.
7. **Anonymization for research.** If construction submissions become a
   PER research dataset, anonymization and consent need explicit
   design. Not in scope here; flagged so it isn't an afterthought.
