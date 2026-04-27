# Atlas — Concept Map Construction Mode (v2)

> **This document supersedes** the original `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`.
> It also retires **Author Mode** (Move 2) from `ATLAS_LAYOUT_AUTHORING_SPEC.md`.
> See "What this retires / what it retains" below.
>
> Cursor: read this document in full before implementing any part of it.
> Phase placement: Phase 3b, sequenced after `ATLAS_LAYOUT_AUTHORING_SPEC.md`
> Move 1 is implemented.

---

## What this retires / what it retains

### Retained

**`ATLAS_LAYOUT_AUTHORING_SPEC.md` Move 1** — drag interaction, position
persistence (`atlas_user_layout_v1`), resolution order, export/import
plumbing, and the `.atlas-layout.json` file format scaffold. Construction
mode inherits all of this directly. No re-implementation needed.

### Retired

**`ATLAS_LAYOUT_AUTHORING_SPEC.md` Move 2** — Author Mode (`?edit=layout`),
the two-store discipline, and canonical-patch export. The live UI pathway
for promoting dragged positions to canonical pins is no longer planned.

**Why:** Canonical graph management returns to a direct backend workflow.
Austin builds maps in Atlas, exports them, and hands the resulting files
to Cursor for repo inclusion via standard PR review. The layout-authoring
UI was engineering overhead solving a problem that a one-person authoring
workflow doesn't actually have. The file format and drag infrastructure
from Move 1 survive intact; only the live editor interface is cut.

**`ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` (original)** — the node-bank-
only construction model, the four rigid exercise variants (A–D), and the
assignment-scoped node set. These are replaced by the more open model
below.

---

## Problem statement

The original construction mode treated the Atlas corpus as the *only*
source of building blocks: students placed canonical nodes and drew edges
between them. That model is appropriate for exercises where the goal is
to recover known relational structure. It is too narrow for the full
range of learning activities we want to support.

Two gaps:

1. **Students can't externalize synthesis.** A student who genuinely
   understands RC circuits may draw a connection between "exponential
   decay" and "time constant" using their own framing — framing that may
   not map cleanly onto any edge type in the canonical graph. Forcing
   them into canonical vocabulary suppresses the most interesting
   diagnostic signal.

2. **Instructors can't scaffold partial structures.** An instructor may
   want to hand students a partial map — a few nodes pre-placed, no
   edges drawn — and ask them to complete it. The old model had no
   mechanism for an instructor to produce and share such a scaffold.

This redesign addresses both:

- Students can build maps using **canonical nodes** (from the Atlas
  corpus), **student-created nodes** (named and populated from scratch),
  or any mix.
- Instructors author maps externally (building and exporting from Atlas
  directly) and deposit them in a **library** that students load from a
  landing page.
- The canonical graph remains accessible as a **reference** (separate
  tab), never a constraint.
- Every edge the student draws prompts them to **explain the
  connection** — the reflective step that is the pedagogical core of
  the whole activity.

---

## Pedagogical thesis

Three claims, updated:

1. **Mental models are spatial and relational.** Students who can produce
   a coherent spatial arrangement of related concepts *and* articulate
   why each connection exists have a more durable grasp of conceptual
   structure than students who only recognize one when shown.

2. **Drawing the edges — and explaining them — is harder than recognizing
   them.** A student who can identify a prerequisite relationship in
   canonical content may still fail to draw it from scratch and fail
   harder to articulate *why* it holds. The explanation prompt surfaces
   the second failure mode, which is the more diagnostic one.

3. **The discussion is the learning.** Comparing maps — student-to-
   canonical, student-to-peer, student-to-TA-annotation — surfaces
   misconceptions and structural gaps in a way no closed-form quiz does.
   The submission is a discussion artifact, not a final answer.

4. **Student-created nodes are evidence of synthesis.** A student who
   creates a node called "RC time constant" and connects it to
   "exponential decay" with the explanation "τ = RC sets the decay rate"
   has demonstrated understanding that no node-bank-only exercise could
   capture. Student-created nodes are first-class evidence, not a
   workaround.

---

## Design constraints

- **Canonical graph is never mutated by student activity.** Student-drawn
  edges, student positions, student-created nodes, and student
  annotations live entirely in construction-mode files and stores.
  Canonical entity JSON is read-only from within construction mode.

- **Canonical graph is reference, not scaffold.** Students can open the
  canonical graph in a separate tab at any time. It does not pre-populate
  edges on their canvas.

- **No backend, no accounts, no LTI (Phase 3b).** Submissions are files.
  Canvas is the delivery channel for graded assignments via standard file
  upload.

- **Layer = shape, domain = color** (`ATLAS_MAIN_SPEC.md` visual encoding
  budget). Canonical nodes in construction mode retain their canonical
  visual encoding. Student-created nodes use a distinct visual treatment
  (see "Node types" below).

- **Layout infrastructure from Move 1.** Construction mode reuses drag
  interaction, position persistence, and file-format patterns from
  `ATLAS_LAYOUT_AUTHORING_SPEC.md` Move 1. Positions for both canonical
  and student-created nodes live in the construction store, which uses
  the same shape as the user-layout store but at a distinct localStorage
  key.

- **Hover ≠ select; selection is sacred** (`ATLAS_NODE_AFFORDANCES_SPEC.md`).
  Construction-mode interaction preserves these invariants.

- **Public-tool ethos** (`ATLAS_VISION.md`). A user without an assignment
  can enter construction mode for self-study. No account or institutional
  gate.

---

## The two modes of Atlas (revised)

Author Mode is retired. Atlas now has two modes:

| Mode | Gate | Banner | Purpose |
|---|---|---|---|
| Reference | default | none | Browse the canonical graph |
| Construction | `?mode=construct` | "Construction mode — your work, not the canonical graph" | Build a personal or assignment concept map |

Modes are mutually exclusive within a session. Entering construction
mode hides canonical edges, loads the construction UI, and switches
the persistence target. Exiting (clearing the URL param + reload)
restores the canonical reference view.

---

## The landing page

When a user navigates to `?mode=construct`, before any canvas is shown,
they land on the **construction landing page** — a clean, full-screen
selection UI with three entry paths.

```
┌─────────────────────────────────────────────────────────────┐
│  ATLAS  ·  Construction Mode                                │
│  Build your own concept map.                                │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐  │
│  │  Load from       │  │  Start from      │  │  Import  │  │
│  │  library         │  │  scratch         │  │  a map   │  │
│  │                  │  │                  │  │          │  │
│  │  Instructor maps │  │  Blank canvas.   │  │  Open a  │  │
│  │  topic subgraphs │  │  All nodes       │  │  .atlas- │  │
│  │  blank templates │  │  available.      │  │  map.json│  │
│  └──────────────────┘  └──────────────────┘  └──────────┘  │
│                                                             │
│  My maps  (2 in progress)                                   │
└─────────────────────────────────────────────────────────────┘
```

A **"My maps"** row at the bottom lists any in-progress construction
sessions stored in localStorage, with title, last-modified timestamp,
and a "Continue" button for each. This is visible immediately so
returning students do not hunt for their work.

### Landing page: Load from library

Opens a library browser panel with three tabs:

**Instructor maps** — `.atlas-map.json` files authored by instructors
and deposited in the Atlas repo at `/library/instructor/`. Each entry
shows: title, author, topic tags, short description, and a node/edge
count badge. Loaded as a starting state that the student can freely
edit. The instructor's node positions, student-created nodes (if any),
and edges are all present; the student extends or modifies from there.

**Topic subgraphs** — Auto-generated at runtime from canonical data.
A topic subgraph for "RC Circuits" collects all canonical nodes tagged
with that topic and places them at their canonical positions. **No
canonical edges are rendered.** The student sees the nodes arranged
spatially (a useful starting scaffold) but must draw every connection
themselves. This is the equivalent of "here are the pieces — now
assemble them." Topic subgraphs are listed by domain and topic tag;
search is available.

**Blank topic templates** — A named blank canvas. The associated topic's
canonical nodes are loaded into the node bank (available to place) but
none are placed. The canvas is empty. Students must place nodes and
draw all edges. This is the most demanding variant — closest to a
blank-sheet recall exercise.

All three library types load into the same construction canvas. The
source is recorded in the file's `library_source` field.

### Landing page: Start from scratch

Navigates directly to the construction canvas with:
- Empty canvas (no nodes placed).
- Full canonical node bank available (all published canonical nodes,
  searchable and filterable by domain and topic tag).
- Student-node creation available immediately.

### Landing page: Import a map

Opens a file picker for `.atlas-map.json`. Validates the file, then
loads it into the construction canvas. The imported state is fully
editable — the student can add nodes, add edges, modify explanations.
This is the mechanism for:
- Opening a peer's submitted map for review.
- Opening an annotated submission returned by a TA.
- Resuming work from a file backup.

---

## Construction canvas

The canvas is the main working surface once an entry path is chosen.

### Persistent elements

- **Mode banner** (top, always visible): "Construction mode — your work,
  not the canonical graph." Includes a "View canonical reference →"
  button that opens the reference graph in a new browser tab.
- **Node bank panel** (left edge, collapsible): canonical nodes available
  to place, filtered/searched. A "+ New node" button opens the
  student-node creation panel.
- **Toolbar** (top-right): Save / Export / Submit, My Maps, author
  widget, undo/redo.
- **Edge explanation indicator**: a small count badge on the toolbar
  showing "N edges without explanations" when any unfilled edges exist.

### Canvas behaviors

- Drag a node from the bank onto the canvas → it becomes placed.
- Drag a placed node off the canvas (to a "remove" zone at the edge)
  or right-click → remove → confirmation prompt → unplaces it and
  removes touching edges.
- Drag placed nodes to reposition them. Positions persist to the
  construction store (not the user-layout store) on drag stop.
- Canonical edges are hidden. Student-drawn edges are the only edges
  rendered.
- The force simulation is not run in construction mode. Node positions
  are entirely student-authored from placement.

---

## Node types

### 1 — Canonical nodes

Nodes from the Atlas corpus. In construction mode they behave as
follows:

- **Source:** the canonical entity JSON. All published canonical concept
  and variable nodes are available in the node bank.
- **Visual encoding:** identical to reference mode — canonical shape
  (circle for concept, diamond for variable), domain color, mass-based
  size.
- **Content:** read-only. The student can open a canonical node's panel
  to read its definition, formula, applicability conditions, etc. They
  cannot edit any of those fields from within construction mode.
- **Placement:** drag from the bank to place; drag from the canvas to
  reposition.

Canonical nodes in the student's map are referenced by entity ID. They
carry no construction-mode content of their own; all construction-mode
annotations and edge explanations reference the canonical entity ID.

### 2 — Student-created nodes

Nodes the student names and populates from scratch.

- **Source:** the student. Created via the "+ New node" button in the
  node bank or via a keyboard shortcut on the canvas (double-click on
  empty canvas area).
- **Visual encoding:** distinct from all canonical shapes. Student nodes
  render as **rounded rectangles** with a **dashed border** and a small
  "student" badge (pencil glyph). Default fill is neutral gray; the
  student can optionally assign a domain color from the canonical domain
  palette (this does not declare the node "part of" that domain in any
  formal sense — it is a visual organizational aid only).
- **Content:** flexible. See "Student-created node panel" below.
- **Placement:** created directly onto the canvas at the click point
  (double-click) or placed from the bank after creation. Repositionable
  by drag.
- **Editability:** always editable. Click the node → opens the edit
  panel.

Student-created nodes are identified by `"id": "student-<uuid>"`.
Their IDs never collide with canonical entity IDs.

### Student-created node panel

The panel for a student-created node has one default field and a set
of optional fields the student can add.

**Default (always present):**

- **Title** — the node's name. Required; cannot be blank. Displayed on
  the canvas.
- **Notes** — a free-text area. Markdown supported; KaTeX permitted for
  inline math. This is the catch-all field. No minimum length.

**Optional fields (student adds any combination):**

- **Formula** — a LaTeX-rendered expression. Useful for variable-like
  or equation-like nodes.
- **Description** — a more structured prose description, separate from
  notes. Intended for "what this concept means" writing.
- **Simplifying assumption** — "this node assumes…" Useful for
  capturing regime-specific thinking.
- **Applicability** — "this applies when…" Mirrors the canonical
  applicability condition field.
- **Misconception** — "students often think…" or "I used to think…"
  High-signal reflection field.

Optional fields are added via an "+ Add field" affordance at the bottom
of the panel. Each added field is removable. The order is student-
controlled (drag to reorder).

**Design rationale:** Not every node deserves a formula. Not every
node deserves an applicability condition. The default text box captures
90% of what students actually need; the optional fields support the
students who are thinking structurally enough to use them. Forcing the
full canonical content schema onto student-created nodes would add
friction and produce mostly empty fields.

---

## Edge drawing and "Explain the connection"

### Drawing an edge

1. Hover near a placed node's border → a connection handle appears.
2. Click and drag from the handle → an in-progress edge follows the
   cursor.
3. Drop on another placed node's border → the edge is committed.

Edges can connect canonical-to-canonical, canonical-to-student,
student-to-canonical, or student-to-student nodes. There are no
restrictions based on node type.

Edges are **undirected by default** in the MVP. The student draws a
line between two concepts; direction is expressed through the
explanation text, not through an arrowhead. (Directed edge variant
is post-MVP — see "Post-MVP" in Sequencing.)

Edges are deletable: click an edge → keyboard delete, or right-click
→ delete.

### "Explain the connection" prompt

When an edge is committed, it is saved immediately. Simultaneously, the
**explanation popover** opens inline, anchored to the edge midpoint:

```
┌────────────────────────────────────────────┐
│  Explain the connection                    │
│  Ohm's Law ──── RC Circuits                │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  type your explanation here...       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [Save]  [Skip for now]                    │
└────────────────────────────────────────────┘
```

- **"Save"** — writes the explanation to the edge. Popover closes.
- **"Skip for now"** — closes the popover without writing an
  explanation. The edge is saved with `explanation: null`.

### Unfilled edge indicator

Edges with `explanation: null` render with a **dashed stroke** instead
of a solid stroke. This is the visual nudge. The dashed style persists
until an explanation is written — there is no automatic expiration or
penalty, but the visual signal is always present.

The toolbar badge "N edges without explanations" provides a count and,
when clicked, cycles through unfilled edges (pan/zoom to each in turn),
opening the explanation popover for the student to fill in.

### Editing an explanation

Click any edge (filled or unfilled) → opens the edge detail panel,
which shows the explanation text (or a prompt to add one if empty) plus
an edit button. Explanations are editable at any time before submission.

### Explanation semantics

Explanations are free text. There is no enforced vocabulary, no type
picker, no direction requirement in the MVP. The student writes whatever
they think the connection is. This is deliberate: the open-ended
explanation is the pedagogical artifact. A rubric-based review by a TA
or peer is the appropriate evaluation mechanism, not an automated
vocabulary check.

---

## Canonical reference tab

The **"View canonical reference →"** button in the mode banner opens
the Atlas canonical reference graph in a new browser tab.

This is the standard Atlas reference mode, unmodified. The student can:
- Browse the full canonical graph.
- Open any node's detail panel to read its definition, formula,
  applicability conditions, etc.
- Follow edges to understand canonical relational structure.
- Use search, filters, and the reveal-neighbors affordance.

The canonical reference tab has no connection to the student's
construction canvas. It does not highlight nodes the student has placed
or show the student's edges. It is purely a reference lookup tool.

**Why separate tab, not side panel:** A side panel showing the full
canonical graph alongside a construction canvas creates a layout cramped
enough to be unusable at typical screen sizes. More importantly,
having the canonical graph immediately visible creates a strong temptation
to copy rather than construct — the separate-tab interaction adds just
enough friction to preserve the generative intent of the exercise. The
student can still look things up; they just can't stare at the answer
while drawing.

---

## Saving and persistence

Construction-mode work persists continuously to localStorage. The key
is `atlas_construction_<session_id>_v1`, where `<session_id>` is a
short UUID assigned at canvas entry and stored in the file's `id` field.

Auto-save fires on every state change (node placed, node moved, edge
created, edge deleted, explanation saved, node content edited).

Multiple sessions can be in progress simultaneously, each at its own
localStorage key. The landing page's "My maps" row lists all active
sessions, sorted by last-modified, with title and last-modified
timestamp.

**Session identity and title:** The session title defaults to
"Untitled map — [date]" and can be edited via an inline rename in the
toolbar. For library-loaded sessions, the title defaults to the
library item's title.

---

## Authors and collaborators

The author widget is visible in the toolbar. On first construction-
mode entry, a one-time prompt captures the student's name, stored in
localStorage at `atlas_user_identity_v1` as `{ name }`.

The primary author is auto-populated from this identity. An "Add
Collaborator" button prompts for a name and adds an entry with
`role: "collaborator"`.

Collaborators are file metadata only. There is no real-time co-editing
and no per-author tracking of which nodes or edges belong to which
collaborator.

---

## Export and sharing

### Export as file

"Export map" (available at any time, not just at submission) downloads
the current construction state as a `.atlas-map.json` file. The file
is a complete snapshot of the session, including all nodes, positions,
edges, explanations, and annotations.

This is the mechanism for:
- Sharing a map with a peer for review.
- Submitting to Canvas via standard file upload.
- Handing a map to an instructor or TA.

### Submission flow

"Submit" (or "Export submission" — aliases) runs a pre-export checklist:

1. **Validator** — runs `validateConstructionFile()`. Surfaces errors
   (blocking) and warnings (non-blocking, must acknowledge).
2. **Unfilled edges warning** — if any edges have `explanation: null`,
   a non-blocking warning surfaces: "N edges are missing explanations.
   Your reviewer will see them as dashed. Submit anyway?"
3. **Author confirmation** — prompt to verify authors are correct.
4. **Marks submitted** — sets `submission.submitted: true` and
   `submission.submitted_at: <now>`.
5. **Downloads file** — triggers browser download of the
   `.atlas-map.json` file.

**Post-submission session behavior:** After submission, the local session
is flagged as `submission.submitted: true` in localStorage. In the "My
Maps" landing page row, a submitted session renders with a lock icon and
a "Submitted" badge. "Continue" on a submitted session does not reopen
the session for editing; instead, a dialog presents two options:

- **"Start a new revision"** — creates a new session (new UUID) with
  the submitted session's full state as the starting point, minus the
  submission flag and timestamp. The new session is independent; it
  does not modify the submitted record.
- **"Cancel"** — returns to the landing page.

The submitted session itself is never modified after the fact. Its
localStorage entry is retained as an immutable local record. A "Clear
completed maps" button on the My Maps panel allows bulk deletion of
submitted sessions when storage cleanup is desired.

### Instructor map authoring (canonical workflow)

Instructors author maps by working in Atlas directly (building the
arrangement they want, placing canonical nodes, creating student-created
nodes as needed), then exporting the result as `.atlas-map.json`.
The exported file is deposited in the repo at `/library/instructor/`
via standard PR, where it becomes available in the landing-page library.

This is a file-in-repo workflow — no live authoring UI, no special
author mode gate. The export format is identical to a student
submission; the only distinction is the `exporter.role: "instructor"`
field and the presence in the library path.

### Library manifest schema

The landing-page library is driven by a manifest file at
`/library/instructor/manifest.json`. The application fetches this file
at library-browser open time. The manifest lists all instructor maps;
the actual `.atlas-map.json` files are co-located in the same
directory.

```json
{
  "manifest_version": 1,
  "updated_at": "2026-04-26T00:00:00.000Z",
  "entries": [
    {
      "id": "rc-circuits-week4",
      "title": "RC Circuits — Week 4 Scaffold",
      "description": "Nodes pre-placed. Draw the connections you believe exist between charging behavior, the time constant, and the underlying circuit laws.",
      "author": "austin",
      "topic_tags": ["rc-circuits", "dc-circuits", "capacitance"],
      "domain_tags": ["E&M"],
      "file": "rc-circuits-week4.atlas-map.json",
      "format_version": 2,
      "node_count": 6,
      "edge_count": 0,
      "library_type": "instructor-map"
    }
  ]
}
```

**Required fields per entry:** `id` (unique slug), `title`, `file`
(filename relative to `/library/instructor/`), `format_version`,
`library_type` (`"instructor-map"`).

**Optional fields:** `description`, `author`, `topic_tags`,
`domain_tags`, `node_count`, `edge_count`. These populate the library
browser card UI; missing optional fields render as absent (not as
errors).

**Sorting:** entries render in manifest order. Instructors control sort
by ordering entries in the manifest file.

**Fallback for malformed entries:** if a manifest entry fails to parse
or its referenced file is missing/invalid, that entry is silently
skipped in the library browser. A dev-console warning is emitted. The
rest of the library loads normally.

Topic subgraphs and blank templates are not listed in `manifest.json`;
they are generated dynamically at runtime from the canonical corpus
using topic/domain tag queries (same tag system as the domain filter
bar in reference mode). No manifest entry is needed for them.

---

## Construction file format

A `.atlas-map.json` file captures the complete construction session.

```json
{
  "format": "atlas-concept-map",
  "format_version": 2,
  "id": "session-<uuid>",
  "title": "RC Circuits — Week 4",
  "created_at": "2026-04-26T09:00:00.000Z",
  "modified_at": "2026-04-26T14:22:00.000Z",
  "exported_at": null,

  "atlas_corpus_hash": "sha256:abcd1234...",
  "atlas_corpus_version": "v3.0.0",

  "library_source": {
    "type": "topic-subgraph",
    "topic": "rc-circuits",
    "loaded_at": "2026-04-26T09:00:00.000Z"
  },

  "authors": [
    { "name": "Student A", "role": "primary" },
    { "name": "Student B", "role": "collaborator" }
  ],

  "exporter": {
    "role": "student"
  },

  "canonical_nodes": ["ohms-law", "rc-circuits", "capacitance", "resistance"],

  "student_nodes": [
    {
      "id": "student-a1b2c3d4",
      "title": "RC Time Constant",
      "created_at": "2026-04-26T10:15:00.000Z",
      "modified_at": "2026-04-26T11:00:00.000Z",
      "content": {
        "notes": "τ = RC. This is how long it takes the circuit to charge to ~63% of V_max.",
        "formula": "\\tau = RC",
        "description": null,
        "simplifying_assumption": null,
        "applicability": "Only valid when R and C are constant (linear circuit).",
        "misconception": null
      },
      "color": null
    }
  ],

  "positions": {
    "ohms-law":         { "x": 100, "y": 200 },
    "rc-circuits":      { "x": 280, "y": 200 },
    "capacitance":      { "x": 180, "y": 320 },
    "resistance":       { "x": 360, "y": 320 },
    "student-a1b2c3d4": { "x": 220, "y": 80 }
  },

  "edges": [
    {
      "id": "edge-<uuid>",
      "source": "ohms-law",
      "target": "rc-circuits",
      "explanation": "Ohm's Law defines the voltage–current relationship that governs how the resistor limits current during RC charging.",
      "explanation_filled": true,
      "created_at": "2026-04-26T10:05:00.000Z"
    },
    {
      "id": "edge-<uuid>",
      "source": "capacitance",
      "target": "student-a1b2c3d4",
      "explanation": null,
      "explanation_filled": false,
      "created_at": "2026-04-26T10:20:00.000Z"
    }
  ],

  "annotations": [
    {
      "id": "ann-<uuid>",
      "target": { "kind": "edge", "id": "edge-<uuid>" },
      "author": "ta-jane",
      "role": "ta",
      "created_at": "2026-04-26T18:00:00.000Z",
      "body": "Good — but can you be more specific about *what* V–I relationship matters here? Is it the linearity? The instantaneous response?",
      "resolved": false,
      "parent_id": null
    }
  ],

  "submission": {
    "submitted": false,
    "submitted_at": null,
    "self_review_complete": false,
    "peer_reviews": []
  }
}
```

### Field semantics

- **`canonical_nodes`** — array of canonical entity IDs placed on the
  canvas. **This field is derived, not independently authored.** At
  serialization time, `canonical_nodes` is computed as the subset of
  `positions` keys that do *not* start with `"student-"`. It is
  written to the file as a convenience for readers and validators;
  it is never an independent source of truth. On import, the validator
  enforces that every entry in `canonical_nodes` has a corresponding
  key in `positions`. If the two are out of sync (e.g., a corrupted
  file), `positions` wins and `canonical_nodes` is recomputed.
  Canonical content is not duplicated in the file; IDs not present
  in the current corpus trigger the orphan policy (see below).

- **`student_nodes`** — array of student-created node objects. Each
  carries the full content snapshot. `id` is `"student-<uuid>"`, never
  colliding with canonical IDs.

- **`student_nodes[].content`** — all content fields. `notes` is always
  present (may be an empty string). All other fields are `null` if not
  populated.

- **`positions`** — entity ID → `{x, y}` for every placed node (both
  canonical and student-created).

- **`edges[].explanation`** — free-text string or `null`. No minimum
  length. `explanation_filled` mirrors whether `explanation` is non-null;
  it is a denormalized convenience flag for fast UI rendering.

- **`edges[].source` / `edges[].target`** — node IDs from either
  `canonical_nodes` or `student_nodes[].id`.

- **`annotations`** — same shape as the original spec. `target.kind`
  is `"edge" | "node" | "map"`. `role` is `"self" | "peer" | "ta" |
  "instructor"`. `parent_id` links replies to their parent annotation
  (null for top-level).

- **`library_source`** — present when loaded from the library; null
  for scratch-started or imported sessions. `type` is one of
  `"instructor-map" | "topic-subgraph" | "blank-template"`.

- **`exporter.role`** — `"student"` for student submissions,
  `"instructor"` for library maps.

### Validator rules

`validateConstructionFile(file)` covers:

- `format` is `"atlas-concept-map"`, `format_version` is 2.
- `atlas_corpus_hash` is a valid SHA-256 string; mismatch is a warning,
  not a block.
- `authors` is non-empty; exactly one entry has `role: "primary"`.
- `canonical_nodes` matches the subset of `positions` keys that do not
  start with `"student-"`. If they diverge, recompute `canonical_nodes`
  from `positions` and emit a warning (never a hard error).
- Every `student_nodes[].id` starts with `"student-"` and is unique
  within the file.
- `student_nodes[].title` is non-empty.
- Every key in `positions` exists in `canonical_nodes` or
  `student_nodes[].id` (i.e., no position orphans).
- Every `edges[].source` and `edges[].target` exists in `canonical_nodes`
  or `student_nodes[].id`.
- **No self-loops:** `edges[].source !== edges[].target`. A self-loop
  is a hard error; the edge is rejected at creation time in the UI and
  flagged by the validator on import.
- **No duplicate edges:** for any unordered pair `{source, target}`,
  at most one edge may exist. "A–B" and "B–A" are treated as the same
  pair (edges are undirected in MVP). A second edge between the same
  two nodes is rejected at creation time and flagged on import.
- `edges[].explanation_filled` matches whether `edges[].explanation` is
  non-null (consistency check; auto-corrected on import, not hard
  error).
- `annotations[].target.id` resolves to a known edge or node (or, for
  `kind: "map"`, no resolution required).
- `submission.submitted` is boolean; if `true`,
  `submission.submitted_at` is a valid ISO 8601 timestamp.

### Validator severity table

Every validator rule has one of two severities. This table is
exhaustive and authoritative; it governs both the import UI and the
test assertions in T2.

| Rule | Severity | Effect |
|---|---|---|
| `format` / `format_version` unrecognized | **Error** | Blocks import |
| `authors` empty or no primary | **Error** | Blocks import |
| `student_nodes[].id` not unique or wrong prefix | **Error** | Blocks import |
| `student_nodes[].title` empty | **Error** | Blocks import |
| `edges[].source` or `edges[].target` not in node set | **Error** | Blocks import |
| Self-loop edge (`source === target`) | **Error** | Blocks import |
| Duplicate edge (same unordered node pair) | **Error** | Blocks import |
| `annotations[].target.id` does not resolve | **Error** | Blocks import |
| `submission.submitted: true` without valid timestamp | **Error** | Blocks import |
| `atlas_corpus_hash` mismatch | **Warning** | Import proceeds; user must acknowledge |
| Orphaned canonical node ID (not in current corpus) | **Warning** | Import proceeds; orphan policy applies |
| `canonical_nodes` diverges from `positions` keys | **Warning** | Auto-corrected silently; no user prompt |
| `explanation_filled` inconsistent with `explanation` | **Warning** | Auto-corrected silently; no user prompt |

**Errors** block import entirely. The user sees a modal listing all
errors with the option to cancel or (for edge-policy violations) view
which edges are problematic. There is no "import anyway" path for
errors.

**Warnings** allow import to proceed. Warnings that require
acknowledgment surface in a pre-import dialog ("This file has N
issues — review before continuing"). Auto-corrected warnings are
applied silently and logged to the dev console.

Validator runs at import, export, and when a file crosses the review
boundary (TA or peer imports a student file → validate before
annotating).

### Orphaned canonical node policy

An orphaned canonical node is a node ID in `canonical_nodes` (and
therefore `positions`) that does not match any entity in the current
Atlas corpus (corpus has changed since the file was saved).

On import, orphaned nodes:

- **Render as placeholder nodes** on the canvas — same position and
  approximate size as the original, but styled with a gray fill, dashed
  border, and a warning glyph (⚠) plus the bare ID as a label.
- **Retain their edges.** Edges touching an orphaned node are preserved
  and rendered normally (still dashed if unfilled, still solid if
  filled). The student can still read and edit explanations on those
  edges.
- **Are not automatically removed.** The student sees the warning and
  decides what to do. A "Clean up orphans" button in the toolbar
  (only visible when orphans exist) removes all orphaned nodes and
  their touching edges after confirmation.
- **Do not block export or submission.** Orphaned nodes produce a
  non-blocking warning in the submission pre-flight checklist.

Rationale: silently stripping orphaned nodes would destroy student work
without warning. Preserving them as visible placeholders lets the
student understand what happened and act deliberately.

---

## Review and annotation

### Importing for review

A reviewer (peer, TA, instructor) imports a student's `.atlas-map.json`
via the landing-page "Import a map" path. The construction canvas opens
with a **review-mode banner**: "You are reviewing [Student A]'s map.
Your edits will be saved as annotations."

In review mode:

- Node placement, positions, and node content are **read-only**.
- Student-created nodes are readable but not editable.
- Existing edges are **read-only** (cannot create or delete edges).
- **Annotation tools are enabled**: clicking any node, edge, or empty
  canvas area opens the annotation composer.

**Review lock contract — exhaustive list of mutable surfaces:**
The *only* fields a reviewer may write in review mode are:

1. `annotations[]` — creating, replying to, resolving, and editing
   own annotations.
2. `reviewer_identity` — the one-time name/role capture at review start.
   Stored in localStorage at `atlas_review_identity_v1` with shape
   `{ "name": "Jane", "role": "ta" }` (same session as `atlas_user_identity_v1`
   but a distinct key, since a user may be both a student author in one
   session and a TA reviewer in another). Not written into the
   `.atlas-map.json` file directly; instead it is used to populate
   `annotations[].author` and `annotations[].role` when the first
   annotation is saved.

Everything else — `title`, `authors`, `canonical_nodes`,
`student_nodes`, `positions`, `edges`, `submission`, `library_source`,
`exporter` — is immutable for the reviewer. The UI must enforce this
at every touchpoint; the validator enforces it on re-import by the
student (any non-annotation diff between the reviewer's export and the
student's local store triggers a warning "This file was modified outside
of annotations").

The reviewer's identity is captured at the start of review (defaults
from `atlas_user_identity_v1`, prompt to confirm). Their `role`
(peer / ta / instructor) is selected from a dropdown.

### Annotation composer

Anchored to the annotation target:

- Free-text body. Markdown supported; KaTeX permitted.
- Save / Cancel.
- For existing annotations: Reply (creates a child with `parent_id` set),
  Resolve (sets `resolved: true`), Edit (own annotations only).

Annotations render as numbered pins on their target. Hovering shows a
count badge; clicking opens the full thread panel.

### Exporting after review

"Export annotated map" downloads a new `.atlas-map.json` with
`annotations[]` populated. The reviewer returns this file to the
student via whatever channel the assignment uses.

### Returning a review to the student

The student imports the annotated file via "Import a map." Atlas detects
new annotations (comparing to the local session's annotation set) and
surfaces a notification: "N new annotations from [reviewer]." The
student can view, reply to, and resolve annotations, then re-export and
return.

---

## Automated metrics

Automated metrics apply when a student's map contains canonical nodes
and an instructor or TA wants to compare student edges to canonical
relational structure. They are advisory — rubric design belongs to the
instructor.

The diff panel is available in review mode to TAs and instructors.

### Canonical edge recovery

For edges between two canonical nodes: compare the student's drawn edges
(ignoring explanation text) against the canonical prerequisite edges
among those same nodes.

- **Recovered** — student drew an edge matching a canonical edge.
- **Missed** — canonical edge exists; student drew nothing.
- **Invented** — student drew an edge with no canonical match.
- **Recall** = Recovered / Canonical-in-scope.
- **Precision** = Recovered / (Recovered + Invented).
- **F1** = harmonic mean.

### Student-created node edges

No canonical comparison is possible. These edges are surfaced in the
diff panel with their explanations for qualitative review only.

### Metrics rendering

The diff panel shows:
- Canonical-edge recovery metrics at top.
- Edge list tagged ✔ Recovered / ✗ Missed / ⚠ Invented.
- "Highlight differences" toggle: missed canonical edges render as
  faint ghost edges on the canvas; invented edges highlight in a
  distinct color.
- All student-created-node edges listed separately with their
  explanation text.

---

## Markdown, KaTeX, and content sanitization

User-generated text appears in: student node `notes`, `description`,
`simplifying_assumption`, `applicability`, and `misconception` fields;
edge `explanation`; annotation `body` fields. All of these are rendered
with Markdown and optional KaTeX support.

### Allowed syntax

- **Markdown:** standard CommonMark subset. Allowed: headings (h1–h3),
  bold, italic, inline code, code blocks, blockquotes, unordered and
  ordered lists, horizontal rules, links (href only, no event handlers).
  **Disallowed:** raw HTML tags. Any `<tag>` content in user input is
  stripped before render, not escaped — the spec intentionally does not
  render user HTML.
- **KaTeX:** inline math via `$...$` and display math via `$$...$$`.
  KaTeX renders in a sandboxed context; its output is already safe by
  construction (KaTeX does not execute arbitrary code). No additional
  restriction on KaTeX syntax beyond KaTeX's own parser.

### Sanitization policy

All user text passes through **DOMPurify** before being injected into
the DOM. Configuration:

```js
DOMPurify.sanitize(rendered_html, {
  ALLOWED_TAGS: ['p','br','strong','em','code','pre','blockquote',
                 'ul','ol','li','h1','h2','h3','hr','a',
                 'span','div'],  // span/div required: KaTeX emits these
  ALLOWED_ATTR: ['href','class','style'],  // see note below
  FORBID_TAGS: ['script','iframe','object','embed','form','input'],
  FORBID_ATTR: ['onerror','onclick','onload','onmouseover'],
  FORCE_BODY: true
});
```

**Why `style` is allowed:** KaTeX renders math by emitting inline
`style` attributes on `span` elements (e.g., `style="margin-left:
0.278em"`) to position glyphs and apply spacing. Removing `style`
from the allowlist breaks KaTeX layout. `style` is not narrowed to
specific properties because KaTeX's output vocabulary changes between
versions and maintaining a property allowlist would become a
maintenance liability.

**Why this is safe despite `style` being broad:** the `style`
attribute cannot execute code — it controls presentation only.
The actual XSS vectors (event handlers, `expression()`, `url()`
with `javascript:`) are blocked by `FORBID_ATTR` and DOMPurify's
built-in CSS sanitizer, which strips `javascript:` and `expression()`
from `style` values automatically. The residual risk is cosmetic (a
malicious `style` value could distort layout) rather than security-
critical. This is an acceptable trade-off for KaTeX support in a
local-render context with no server-side persistence of rendered HTML.

This policy is applied at render time, not at save time. The raw
user text is stored unmodified in localStorage and in the `.atlas-map.json`
file; sanitization happens on every render pass. This is the standard
pattern for content that must survive round-trips.

`href` values on links are additionally validated: only `https://` and
`http://` schemes are permitted; `javascript:` and `data:` hrefs are
stripped.

---

## Accessibility baseline

Construction mode is an interaction-heavy canvas UI. Full WCAG 2.1 AA
compliance is a long-term goal; the following are the minimum
acceptance criteria for the Phase 3b MVP.

### Keyboard: node operations

- **Tab** cycles focus through all placed nodes on the canvas.
- **Enter** on a focused placed node opens its detail/edit panel.
- **Delete** or **Backspace** on a focused placed node triggers the
  unplace confirmation dialog (same as right-click → remove).
- **Escape** closes any open panel or dialog and returns focus to the
  canvas.
- Node bank is keyboard-navigable: **Tab** moves through bank entries;
  **Enter** places the focused bank node at a default canvas position
  (center of current viewport).

### Keyboard: edge creation

- With a node focused, **E** (or a documented shortcut) enters
  "edge-drawing mode" for that node.
- In edge-drawing mode, **Tab** cycles through other placed nodes as
  potential targets; **Enter** commits the edge to the focused target.
- **Escape** cancels edge-drawing mode.

### Popovers and dialogs

- All popovers and dialogs must trap focus while open (focus cannot
  leave the popover via Tab).
- All popovers and dialogs must return focus to the triggering element
  on close.
- The explanation popover's textarea receives focus automatically on
  open.

### Screen-reader labels

- Every placed node has an `aria-label` of the form
  `"[Node title], [canonical/student-created], [N edges]"`.
- Every edge has an `aria-label` of the form
  `"Connection from [source] to [target], [filled/unfilled explanation]"`.
- Mode banner is a `role="status"` live region.
- Unfilled edge count badge is an `aria-live="polite"` region.

These are minimum criteria. They do not preclude richer keyboard flows
or screen-reader support added during implementation.

---

## Performance targets

The following are design-time targets, not hard guarantees. They define
the scale at which the construction canvas must remain fluid and at
which the test suite's fixture data should be sized.

| Dimension | Target |
|---|---|
| Placed nodes (canonical + student) | Up to 60 |
| Edges | Up to 150 |
| Annotations | Up to 200 |
| Student nodes | Up to 30 |
| My Maps sessions in localStorage | Up to 20 |
| Library entries (manifest) | Up to 50 |

These targets define two distinct performance tiers:

- **Initial render** (cold load of a saved session): canvas must be
  fully painted and interactive within **500ms** for maps at target
  scale. This is a startup budget, not a per-interaction budget.
- **Interaction fluency** (drag, edge creation, popover open): each
  discrete user action must complete within **one animation frame
  (~16ms)**. This is the per-frame budget for maintaining 60fps feel
  on interactions after the canvas is loaded.

**Test fixture scale:** T1–T14 integration test fixtures should include
at least one "large" fixture at the target scale (60 nodes, 150 edges,
200 annotations) to catch O(n²) regressions early.

**No virtualization required in MVP** for the canvas itself (React Flow
handles this natively). The My Maps list and library browser should use
windowed rendering if either exceeds ~50 items, but are unlikely to
at Phase 3b scale.

---

## Tests

### T1 — Construction file format round-trip

Unit test: create a fixture construction state with both canonical and
student-created nodes and multiple edges (some filled, some not).
Export to JSON, validate against schema, re-import, assert state
matches.

### T2 — Validator rules

Unit tests for each validator rule above. Each rule gets a positive and
negative case.

### T3 — Node bank state transitions

Integration test:
- Node bank shows all published canonical nodes by default.
- Dragging a node to canvas moves it to placed; bank shows it dimmed.
- Unplacing removes it from canvas and removes touching edges (with
  confirmation mocked to accept).
- Bank remains accessible (can place a second node from bank).

### T4 — Student node creation

Integration tests:
- Double-click on empty canvas → student-node creation panel opens.
- Enter a title, add notes → node appears on canvas at click position.
- Student node panel: "+ Add field" adds optional fields; fields are
  removable; content persists after close/reopen.
- Student node ID starts with `"student-"` in the serialized file.

### T4b — Edge policy enforcement

Integration tests:

- Attempt to create a self-loop (drag from a node back to itself) →
  edge is rejected; no entry in `edges[]`; UI shows brief inline error
  "A node cannot connect to itself."
- Place two nodes, draw an edge A→B, attempt to draw a second edge A→B
  (or B→A) → second edge is rejected; UI shows "A connection between
  these nodes already exists."
- Import a file containing a self-loop or duplicate edge → validator
  flags it; UI surfaces the error; import is blocked.

### T5 — Edge drawing and explanation

Integration tests:
- Drag from node A border to node B border → edge created with
  `explanation: null`, `explanation_filled: false`.
- Explanation popover opens automatically on edge creation.
- "Save" with text → edge updated with explanation and
  `explanation_filled: true`.
- "Skip for now" → edge stays with `explanation: null`.
- Unfilled edge renders with dashed stroke; filled edge renders solid.
- Toolbar badge reflects unfilled edge count.
- Badge click cycles to each unfilled edge and opens popover.

### T6 — Edge types (node combinations)

Integration tests: create edges for each combination:
- Canonical → canonical
- Canonical → student
- Student → canonical
- Student → student

Assert all four serialize correctly with proper source/target IDs.

### T7 — Auto-save and restore

Integration test: make changes (place nodes, draw edges, write
explanations), simulate page reload, assert state fully restored from
localStorage.

### T8 — Submission lifecycle

Integration test: fill a fixture map, click Submit, assert:
- Validator runs.
- Unfilled-edge warning appears if applicable.
- Downloaded file has `submission.submitted: true` and valid timestamp.
- Local store retains a working copy.

### T9 — Review-mode import

Integration test: import a fixture submission in review mode, assert:
- Node bank is read-only (no place/unplace).
- Existing edges are read-only (no create/delete).
- Node positions are read-only (no drag).
- Annotation composer opens on node click, edge click, and canvas click.

### T10 — Annotation lifecycle

Integration tests:
- Create annotation on a node, edge, and map. Assert correct
  `target.kind` for each.
- Reply creates a child annotation with correct `parent_id`.
- Resolve sets `resolved: true`.
- Export and re-import: student receives new annotations, notification
  fires, student can reply, re-export contains replies.

### T11 — Metrics correctness

Unit tests with hand-crafted fixtures (canonical nodes only):
- Perfect recovery: recall = precision = F1 = 1.0.
- All missed: recall = 0, precision = undefined (0 by convention), F1 = 0.
- All invented: recall = 0, precision = 0.
- Half recovered, no invented: recall = 0.5, precision = 1.0, F1 = 0.67.

### T12 — Landing page navigation

Integration tests:
- "Start from scratch" navigates to empty canvas with full node bank.
- "Load from library → topic subgraph" loads canonical nodes at
  canonical positions with no edges.
- "Load from library → blank template" loads empty canvas with topic
  node bank.
- "Import a map" accepts a valid `.atlas-map.json` and loads its state.
- "My maps" row shows in-progress sessions from localStorage; "Continue"
  loads the correct session.

### T13 — Mode isolation

Integration tests:
- `?mode=construct` loads construction landing page; reference mode
  does not.
- Clearing `?mode=construct` and reloading restores reference view;
  construction localStorage is not cleared.
- Construction store does not write to user-layout store
  (`atlas_user_layout_v1`).

### T13b — Orphan policy

Integration test: import a fixture file containing a canonical node ID
not present in the current corpus fixture. Assert:

- Orphaned node renders as a placeholder with warning glyph.
- Edges touching the orphaned node are preserved and rendered.
- "Clean up orphans" button appears in the toolbar.
- Confirming cleanup removes the orphaned node and its edges.
- Validator emits a non-blocking warning (not an error) for the orphan.

### T13c — Submission locked-state

Integration test:
- Submit a fixture session (marks `submitted: true` in store).
- Return to landing page; assert "Submitted" badge renders on session.
- Click "Continue" → assert dialog appears with "Start a new revision"
  and "Cancel" options.
- Select "Start a new revision" → assert new session created with new
  UUID, `submitted: false`, same content otherwise.
- Assert original submitted session is unchanged in localStorage.

### T13d — Sanitization

Unit tests:
- Render a node `notes` field containing `<script>alert(1)</script>`;
  assert script tag is stripped, no alert fires.
- Render a node `notes` field containing a `javascript:` href; assert
  href is stripped.
- Render a valid KaTeX expression `$\tau = RC$`; assert it renders
  without error.
- Render a Markdown-only note with headings, bold, and a list; assert
  correct HTML output with no raw tag injection.

### T13e — Accessibility baseline

Integration tests:
- Tab through placed nodes; assert each receives focus in DOM order.
- With a node focused, press Enter; assert detail panel opens.
- With a node focused, press Delete; assert confirmation dialog opens.
- Open explanation popover; assert focus is trapped within it.
- Close explanation popover; assert focus returns to the edge element.
- Assert mode banner has `role="status"`.
- Assert unfilled edge count badge has `aria-live="polite"`.

### T13f — Performance regression

Integration test with large fixture (60 nodes, 150 edges):
- Render large fixture; assert canvas renders within 500ms.
- Simulate drag on one node; assert drag-stop handler completes within
  16ms (one frame budget).
- Open explanation popover; assert popover renders within 16ms.

### T14 — Cross-spec invariants

Integration tests:
- Hover-card from `ATLAS_NODE_AFFORDANCES_SPEC.md` works for canonical
  nodes in construction mode (read-only peek); suppressed during
  edge-drawing drag.
- Student-created nodes do NOT trigger canonical hover-card; they open
  the student-node edit panel instead.
- Layout cache: no recomputation on selection, hover, or edge creation.

---

## Sequencing

### Foundation (prerequisite)

`ATLAS_LAYOUT_AUTHORING_SPEC.md` Move 1 must be implemented before this
spec begins. Move 1 provides drag, position persistence, and
import/export plumbing.

### MVP scope

The MVP ships:
- Landing page with all three entry paths.
- Canonical node placement.
- Student-created node creation and editing (all content fields).
- Undirected edge drawing with explanation prompt and unfilled
  indicator.
- Auto-save, My Maps, submission flow.
- Review mode and annotation.
- Canonical edge recovery metrics.

### Implementation order

1. **File format & validator.** Schema, validator, round-trip tests
   (T1, T2). ~half day.
2. **Landing page.** Three entry paths, My Maps row. Library browser
   with three tabs (static fixture data for instructor maps; topic-tag
   query for subgraphs and templates). (T12.) ~1 day.
3. **Canonical node bank.** Available/placed state, drag-from-bank,
   unplace. (T3.) ~half day.
4. **Student-created nodes.** Creation panel, all content fields, canvas
   rendering (distinct visual treatment). (T4.) ~1 day.
5. **Edge drawing + explanation.** Drag-to-create, popover, filled/unfilled
   state, dashed stroke, toolbar badge, badge-click cycle. (T5, T6.)
   ~1 day.
6. **Auto-save, My Maps, sessions.** localStorage persistence, session
   identity, title rename. (T7.) ~half day.
7. **Submission flow.** Validator wiring, unfilled-edge warning, author
   widget, file download. (T8.) ~half day.
8. **Review mode.** Read-only locks, annotation composer, annotation
   data model. (T9, T10.) ~1.5 days.
9. **Metrics.** Diff computation, diff panel UI, canvas highlight toggle.
   (T11.) ~1 day.
10. **Cross-spec integration tests.** (T13, T14.) ~half day.

**MVP total estimate: ~8 days of engineering.** Treat as ~2.5 weeks
calendar with design iteration and edge-case hardening.

### Post-MVP

- **Directed edges.** Edge direction becomes a commitment at creation
  time: drag direction is the default, with a confirm/flip affordance
  in the explanation popover. Direction stored as `"source_to_target" |
  "target_to_source" | "undirected"`. ~0.5 days.
- **Topic subgraph thumbnails.** Pre-rendered SVG snapshots for the
  library browser. ~0.5 days.
- **Bulk explanation fill.** A "fill all explanations" mode that cycles
  through unfilled edges without requiring the toolbar badge. ~0.5 days.
- **Per-edge author attribution.** `created_by` field on edges
  referencing `authors[].name`. Useful for group work. ~0.5 days.

---

## Interactions with other specs

### `ATLAS_LAYOUT_AUTHORING_SPEC.md`

Move 1 infrastructure is fully inherited. Construction mode uses a
separate store key (`atlas_construction_<session_id>_v1`), not
`atlas_user_layout_v1`, so the two never interfere.

### `ATLAS_NODE_AFFORDANCES_SPEC.md`

Canonical node hover-peek card works in construction mode for canonical
nodes only. Student-created nodes open the student-node edit panel on
click/hover; they do not trigger the canonical hover-card. Hover
suppresses during edge-drawing drag (same mechanism as during
node-drag).

### `ATLAS_REVEAL_NEIGHBORS_SPEC.md`

Halo and count badge are hidden in construction mode. The "connected
content in other layers" signal is a canonical-graph affordance with
no meaning in a student construction.

### `ATLAS_AUTHORING_SPEC.md`

Construction-mode submissions are not author content. They do not flow
into canonical entity JSON, do not receive provenance promotion, and
are not RAG-grounded for the AI tutor. Provenance discipline applies
to canonical content; construction-mode files have their own lighter
provenance in `authors[]` and `submission` metadata.

---

## What this spec is not

- **Not a quiz engine.** Atlas computes metrics that inform a human
  grader; it does not auto-grade or auto-score.
- **Not a real-time collaboration tool.** Multi-author maps are
  serialized via file exchange. Real-time co-editing is not in scope.
- **Not an LMS.** No assignment management UI, no class roster, no
  gradebook. Assignment context is handled in Canvas; Atlas is the
  map-building tool.
- **Not a canonical authoring interface.** Construction mode produces
  student artifacts. Canonical graph management is a backend workflow
  (build, export, PR).
- **Not an LLM tutor.** Atlas does not suggest edges, auto-generate
  explanations, or provide feedback during construction. The student's
  own work is the artifact.
- **Not a long-term submission archive.** Submissions live in student
  filesystems and Canvas. Atlas does not store server-side history.

- **Not a hyperedge system.** Edges connect exactly two nodes. The
  binary edge constraint is deliberate: it forces students to make
  atomic, articulable claims ("this specific concept depends on this
  other specific concept") rather than gesturing at clusters. The
  "Explain the connection" prompt only makes sense in a binary context.
  A student who genuinely needs to express an n-ary relationship
  (e.g., Kirchhoff's voltage law relates three voltages simultaneously)
  should create a student node for the relationship itself and connect
  each participant to it — this decomposition is the intellectual work
  the exercise is designed to surface. Hyperedges would add
  implementation complexity (React Flow does not support them natively),
  reduce pedagogical signal, and break the canonical edge recovery
  metrics. This decision is final for Phase 3b; it may be revisited
  in Phase 4 if concrete student use cases justify the cost.

---

## Open questions

1. **Student-created node shapes in typed variants (post-MVP).** When
   directed edges land, student nodes may benefit from shape-based
   type hints (concept-like vs. variable-like). Defer until the
   directed-edge variant is scoped; the current rounded-rectangle
   treatment is intentionally neutral.

2. **Assignment authoring format.** How does an instructor specify a
   "required nodes" list for a graded assignment? Options: (a) a JSON
   assignment file at `/assignments/<id>.json` in the repo, loaded via
   `?assignment=<id>`; (b) a URL-encoded payload for ad-hoc in-class
   assignments. Probably (a) for prepared assignments, (b) for impromptu
   ones. Decide before implementing assignment-scoped library entries.

3. **Library thumbnails.** The library browser works without thumbnails
   (title + tags are sufficient for selection), but thumbnails would
   improve scannability. Generating SVG snapshots of instructor maps at
   build time is the most likely approach. Defer until library UX is
   validated with real students.

4. ~~**Corpus-hash mismatch / orphan handling.**~~ Resolved. The orphan
   policy is fully specified in the "Orphaned canonical node policy"
   section: orphaned nodes render as placeholder nodes with a warning
   glyph, retain their edges, are not auto-removed, and produce a
   non-blocking warning at submission. This is no longer an open
   question.

5. **Annotation export for grading.** A TA annotating N student
   submissions may want to bulk-export annotations for gradebook entry.
   Format (CSV? JSON?) and tooling TBD. Defer until the grading workflow
   is concrete.

6. **Phase 4 Canvas LTI.** When LTI lands, submission flow shifts from
   client-side file download to direct server-side post-back. The
   `.atlas-map.json` format is designed to survive this unchanged.
   Construction mode should not preclude it.

7. **Anonymization for research.** If construction submissions become
   a PER research dataset, anonymization and consent need explicit
   design. Out of scope here; flagged so it isn't an afterthought.

---

## Cursor session prompts

Each prompt below maps to one focused implementation session. Prompts are
ordered to match the "Implementation order" section above. Run them
sequentially — each session's output is a dependency for the next.

**Before starting any session:** Read this spec in full. Also read
`ATLAS_LAYOUT_AUTHORING_SPEC.md` (Move 1 is implemented and provides
drag interaction, `userLayout.js`, export/import plumbing, and
`src/lib/resolveRenderPosition.js`). Do not re-implement anything from
Move 1; reference it.

---

### Session 1 — File format, types, and validator (T1, T2)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Construction file format",
§"Validator rules", §"Validator severity table".
Read: `src/lib/userLayout.js` (model for storage helpers).

Create `src/lib/construction/` with the following files:

**`constructionFile.js`**
- `createConstructionSession({ title, librarySource })` — returns a fresh
  session object with a new `session-<uuid>` id, timestamps, empty
  `canonical_nodes`, `student_nodes`, `positions`, `edges`, `annotations`,
  and `submission` block. All fields per the spec's JSON schema.
- `serializeConstructionFile(session)` — returns a plain object suitable
  for `JSON.stringify`. Derives `canonical_nodes` from `positions` keys
  (keys not starting with `"student-"`). Sets `exported_at` to now.
- `deserializeConstructionFile(raw)` — parses raw JSON text, returns a
  session object or throws on parse failure.
- `computeExplanationFilled(explanation)` — returns `true` iff explanation
  is a non-null, non-empty string (for `explanation_filled` denormalization).

**`validateConstructionFile.js`**
- `validateConstructionFile(file)` — returns `{ errors: string[], warnings: string[] }`.
- Implement every rule in the Validator severity table. Errors block
  import; warnings do not. See the table for the exact list.
- Auto-corrections (silent, no user prompt): recompute `canonical_nodes`
  from `positions` if they diverge; fix `explanation_filled` inconsistency.
  Apply these before returning results so the returned file object is
  already corrected.

**Tests** (put in `src/lib/construction/__tests__/`):
- T1: round-trip fixture — create a session with 3 canonical nodes,
  2 student nodes, 4 edges (2 filled, 2 not), serialize to JSON, parse
  back, assert deep equality. Confirm `canonical_nodes` is derived
  correctly.
- T2: one positive + one negative test per validator rule in the severity
  table. Assert each error rule returns the correct error string and each
  warning rule returns the correct warning string. Confirm auto-corrections
  are applied to the returned object.

---

### Session 2 — URL routing, construction landing page, and mode isolation (T12, T13)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"The two modes of Atlas",
§"The landing page", §"Saving and persistence".
Read: `src/App.jsx` (existing routing and URL param handling).
Read: `src/lib/construction/constructionFile.js` (just created).

**`App.jsx`**: add a `?mode=construct` branch. When present, render
`<ConstructionApp />` instead of the reference graph. When absent,
render the existing reference graph unchanged. Mode isolation: the
construction localStorage keys (`atlas_construction_*`) must never be
read or written by the reference-mode code path.

**`src/lib/construction/constructionStore.js`**:
- `CONSTRUCTION_KEY_PREFIX = 'atlas_construction_'`
- `listConstructionSessions()` — scans localStorage for all keys matching
  the prefix, parses each, returns an array of `{ id, title, modifiedAt,
  submitted }` summary objects sorted descending by `modifiedAt`.
- `loadConstructionSession(sessionId)` — returns full session object or null.
- `saveConstructionSession(session)` — writes to
  `atlas_construction_<session.id>_v1`.
- `deleteConstructionSession(sessionId)` — removes the key.
- All functions are localStorage-safe (guard for SSR; swallow write errors).

**`src/construction/ConstructionApp.jsx`**:
- Renders the construction landing page.
- "My maps" row: reads `listConstructionSessions()`, displays title +
  last-modified + "Continue" button for each. "Continue" loads session
  and navigates to the canvas (stub `<ConstructionCanvas />` for now).
- "Start from scratch": creates a new session via `createConstructionSession`,
  saves it, navigates to canvas.
- "Import a map": file picker for `.atlas-map.json`; validates with
  `validateConstructionFile`; on hard errors show a blocking error modal
  listing all errors; on warnings show acknowledgment dialog; on success
  load into canvas.
- "Load from library": stub — show a "Coming in Session 3" placeholder card.

**Tests** (T12 partial, T13):
- T13: `?mode=construct` renders landing page; no reference graph. Clear
  param + reload restores reference view. Construction store never writes
  to `atlas_user_layout_v1`.
- T12 partial: "Start from scratch" creates a session in localStorage and
  navigates to canvas stub. "My maps" row reflects it. "Import a map"
  accepts a valid fixture file and rejects a malformed one.

---

### Session 3 — Library browser (T12 full)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Landing page: Load from
library", §"Library manifest schema".
Read: `src/data/tags.js` and `src/data/index.js` (canonical tag and node
access patterns).

Replace the "Coming in Session 3" stub in `ConstructionApp.jsx` with a
full library browser panel (modal or slide-over). Three tabs:

**Tab 1 — Instructor maps**:
- `fetch('/library/instructor/manifest.json')` at open time. Handle
  404/network error gracefully (show "No instructor maps available").
- For each valid manifest entry, render a card: title, description (if
  present), topic tags, node/edge count badge, author.
- Malformed or file-missing entries: silently skip; emit `console.warn`.
- "Load" button: fetches the referenced `.atlas-map.json` file, validates
  it, creates a new session from it (new UUID, sets `library_source`),
  saves to localStorage, navigates to canvas.

**Tab 2 — Topic subgraphs**:
- Derive list from canonical data: collect all unique topic tags across
  published nodes. Group by domain.
- Per topic: show a card with the topic name, domain tag, and node count.
- "Load": collect all canonical nodes with that topic tag, place them at
  their canonical positions (from `resolveRenderPosition`), **no
  canonical edges**. Create session with `library_source.type:
  "topic-subgraph"`.

**Tab 3 — Blank templates**:
- Same topic list as Tab 2, same cards.
- "Load": empty canvas, but the node bank is pre-filtered to that topic's
  canonical nodes. `library_source.type: "blank-template"`.

**Tests** (T12 full):
- "Load from library → topic subgraph" fixture: assert canonical nodes
  at canonical positions, no edges.
- "Load from library → blank template": assert empty canvas, node bank
  filtered to topic.
- Manifest with a malformed entry: assert that entry is skipped, rest load.

---

### Session 4 — Construction canvas + canonical node bank (T3, T7 partial)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Construction canvas",
§"Node types" (canonical nodes subsection), §"Saving and persistence".
Read: `src/components/GraphCanvas.jsx`, `src/components/nodes/ConceptNode.jsx`,
`src/components/nodes/VariableNode.jsx` (existing React Flow setup).

**`src/construction/ConstructionCanvas.jsx`**:
- Receives `sessionId` prop; loads session from store on mount.
- Renders a React Flow instance. **Disable the force simulation** (set
  `nodesDraggable` to true but do not run `d3-force`; positions are
  entirely student-authored).
- **Mode banner** (top): "Construction mode — your work, not the canonical
  graph." Includes "View canonical reference →" that opens `window.open('/', '_blank')`.
- **Node bank panel** (left, collapsible): lists all published canonical
  nodes (ConceptNode + VariableNode). Filter by domain and topic tag.
  Search by name. Placed nodes render dimmed in the bank (not removed).
  "+ New node" button — stub for Session 5.
- **Drag from bank to canvas**: drop a bank node → adds it to
  `session.positions` at drop coordinates, writes to `canonical_nodes`
  (derived), saves session.
- **Unplace**: right-click a placed node → context menu → "Remove" →
  confirmation dialog → removes from `positions`, removes touching edges.
- **Toolbar** (top-right): session title (inline rename on click), Save
  button (explicit, in addition to auto-save), Export button (stub for
  Session 8), My Maps link.
- **Auto-save**: call `saveConstructionSession` on every state mutation
  (node placed, node moved, node removed).
- Canonical edges: hidden (do not render `edges.json` edges).

**Tests** (T3, T7 partial):
- T3: node bank lists all published nodes; drag to canvas → node appears
  placed; bank entry dims; unplace → confirmation → node removed, touching
  edges removed; bank entry un-dims.
- T7 partial: place nodes, move them, reload page → positions restored
  from localStorage.

---

### Session 5 — Student-created nodes (T4)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Node types" (student-created
nodes subsection), §"Student-created node panel".
Read: `src/construction/ConstructionCanvas.jsx` (just built).
Read: `src/components/nodes/ConceptNode.jsx` (existing visual encoding
patterns).

**Student node visual** (`src/construction/nodes/StudentNode.jsx`):
- Rounded rectangle, dashed border, neutral gray fill by default.
- Small pencil glyph badge (top-right corner).
- Displays node title.
- Optional domain color: if `color` is set, use that domain's color from
  `domainVisuals.js`; otherwise neutral gray.
- Register in React Flow `nodeTypes` as `"student"`.

**Double-click on empty canvas**: opens student-node creation panel at
the click coordinates. Panel contains: Title input (required), Notes
textarea. "Create" saves the node to the session at the click position
with `id: "student-<uuid>"`. "Cancel" dismisses.

**"+ New node" in node bank**: opens the same creation panel. Created
node appears in the bank and must be dragged to place (like canonical nodes).

**Student-node edit panel** (`src/construction/StudentNodePanel.jsx`):
- Click a placed student node → panel slides in (or modal on mobile).
- Title field (always editable).
- Notes textarea with KaTeX + Markdown preview (reuse `KatexText.jsx` pattern).
- "+ Add field" affordance at the bottom: adds optional fields one at a
  time from: Formula, Description, Simplifying assumption, Applicability,
  Misconception. Added fields are removable. Order is student-controlled
  (drag to reorder within the panel).
- All edits auto-save to session on blur.

**Serialization**: student nodes are stored in `session.student_nodes[]`
per the file format spec. `id` is always `"student-<uuid>"`.

**Tests** (T4):
- Double-click canvas → panel opens; create node → appears on canvas
  at click position; ID starts with `"student-"` in serialized file.
- "+ Add field" → each optional field appears; fields are removable; all
  content persists after close + reopen.
- Student node does NOT trigger canonical hover-card (assert canonical
  HoverCardOverlay is suppressed for student nodes).

---

### Session 6 — Edge drawing and explanation (T4b, T5, T6)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Edge drawing and Explain
the connection", §"Unfilled edge indicator", §"Editing an explanation".
Read: `src/components/FloatingEdge.jsx` (existing edge component pattern).
Read: `src/construction/ConstructionCanvas.jsx`.

**Connection handles**: add a connection handle to every placed node's
border (canonical and student). Visible on hover of the node border.
Use React Flow's `Handle` component at position `Position.Right` and
`Position.Left` (at minimum); all-sides is better.

**Edge creation**:
- Drag from handle → in-progress edge follows cursor.
- Drop on target node → edge committed: add to `session.edges[]` with
  new `"edge-<uuid>"` id, `explanation: null`, `explanation_filled: false`.
- **Self-loop guard**: if source === target, reject immediately. Show
  brief inline toast: "A node cannot connect to itself." No edge added.
- **Duplicate guard**: if an edge already exists between the same two
  nodes (in either direction), reject. Show toast: "A connection between
  these nodes already exists." No edge added.

**Explanation popover** (`src/construction/ExplanationPopover.jsx`):
- Opens automatically at the edge midpoint immediately after edge creation.
- Shows "Explain the connection" header + source–target node names.
- Textarea (focus auto-set on open; focus trapped within popover).
- "Save": writes explanation, sets `explanation_filled: true`, closes.
- "Skip for now": closes without writing. Edge stays `explanation: null`.

**Edge visuals** (`src/construction/ConstructionEdge.jsx`):
- Unfilled (`explanation: null`): dashed stroke.
- Filled: solid stroke.
- Register as React Flow edge type `"construction"`.

**Edge interaction**:
- Click an edge → opens edge detail panel (shows explanation text or
  "Add an explanation" prompt; edit button). Editable at any time.
- Delete: click an edge → press Delete/Backspace; or right-click → delete.
  No confirmation required for edges.

**Toolbar badge**:
- "N edges without explanations" when `N > 0`. When `N === 0`, badge absent.
- `aria-live="polite"`.
- Click badge → cycles through unfilled edges (pan/zoom to each); opens
  explanation popover for that edge.

**Tests** (T4b, T5, T6):
- T4b: self-loop rejected, duplicate edge rejected, import with self-loop
  blocked by validator.
- T5: edge drawn → `explanation: null`; popover opens; Save → filled;
  Skip → stays null; dashed vs solid renders correctly; badge count
  accurate; badge-click cycles.
- T6: create all four node-type combinations (canonical→canonical,
  canonical→student, student→canonical, student→student); assert correct
  source/target IDs in serialized file.

---

### Session 7 — Auto-save, My Maps, sessions, author widget (T7)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Saving and persistence",
§"Authors and collaborators".
Read: `src/lib/construction/constructionStore.js`.

This session wires up the full auto-save loop and session management UI.
Most of the auto-save calls should already exist as stubs from Sessions
4–6; verify they're consistent and test the full round-trip.

**Auto-save completeness check**: audit every mutation site in
`ConstructionCanvas.jsx` and edge/node handlers. Every state change
(node placed, moved, removed; edge created, deleted; explanation saved/
edited; student node created/edited) must call `saveConstructionSession`.

**Session title rename**: clicking the title in the toolbar makes it an
inline `<input>`. On blur or Enter, saves the new title to the session
and to localStorage. Default title: `"Untitled map — [date]"`. For
library-loaded sessions, defaults to the library item's title.

**My Maps panel** (`src/construction/MyMapsPanel.jsx`):
- Slide-over panel accessible from the toolbar.
- Lists all sessions from `listConstructionSessions()` sorted by
  `modifiedAt` desc.
- Per session: title, last-modified timestamp, submitted badge (if
  `submission.submitted: true`), "Continue" and "Delete" buttons.
- "Continue": load session → navigate to canvas.
- "Delete": confirmation → `deleteConstructionSession(id)` → remove from list.
- "Clear completed maps" button: deletes all sessions where
  `submission.submitted: true` after a single bulk-confirmation dialog.

**Author widget** (`src/construction/AuthorWidget.jsx`):
- On first construction-mode entry, a one-time prompt captures the
  student's name. Store in localStorage at `atlas_user_identity_v1`
  as `{ name }`.
- Author widget in toolbar shows the primary author name. "Edit" reopens
  the name prompt.
- "Add Collaborator" button: prompts for a name, adds entry to
  `session.authors[]` with `role: "collaborator"`. Collaborators are
  file metadata only — no per-author tracking.

**Tests** (T7 full):
- Make changes (place 3 nodes, draw 2 edges, write 1 explanation), simulate
  page reload, assert full state restores from localStorage (positions,
  edges, explanations, student nodes).
- Title rename persists across reload.
- My Maps panel: sessions appear, "Continue" loads the right one, delete
  works, submitted sessions show badge.

---

### Session 8 — Submission flow (T8, T13c)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Export and sharing",
§"Submission flow", §"Post-submission session behavior".
Read: `src/lib/userLayout.js` `downloadLayoutPayload` (download helper pattern).
Read: `src/lib/construction/validateConstructionFile.js`.

**"Export map" button** (toolbar, always available):
- Calls `serializeConstructionFile(session)`, triggers browser download
  as `<title>-<date>.atlas-map.json`. No pre-flight checklist.

**"Submit" button** (toolbar):
A modal pre-flight checklist with four steps in sequence:

1. **Validator**: run `validateConstructionFile`. If hard errors exist,
   show error list and block — no proceed button. If warnings exist, show
   warning list with "Continue anyway" button. If clean, advance automatically.
2. **Unfilled edge warning**: if `N > 0` edges have `explanation: null`,
   show "N edges are missing explanations. Your reviewer will see them
   as dashed. Submit anyway?" with Continue / Go back.
3. **Author confirmation**: show `session.authors[]` list with edit affordance.
   "Confirm and submit" button.
4. **Download**: set `submission.submitted: true`, `submission.submitted_at:
   now` on the session, save to localStorage, trigger file download, close modal.

**Post-submission locked state**:
- In My Maps panel, submitted sessions render with a lock icon and
  "Submitted" badge (already stubbed in Session 7 — wire it now).
- "Continue" on a submitted session: show dialog "This map has been
  submitted. What would you like to do?" with two buttons:
  - "Start a new revision": creates a new session (new UUID) copying the
    submitted session's full state, minus the `submission` flag and
    timestamp. Navigates to that new session.
  - "Cancel": dismiss dialog.
- The submitted session in localStorage is never modified after the fact.

**Tests** (T8, T13c):
- T8: fill fixture map → Submit → validator runs → unfilled-edge warning
  appears → downloaded file has `submission.submitted: true` and valid
  timestamp → local store retains copy.
- T13c: submit → "Submitted" badge in My Maps → "Continue" shows dialog →
  "Start new revision" creates new session with new UUID and
  `submitted: false` → original session unchanged.

---

### Session 9 — Review mode and annotation (T9, T10)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Review and annotation"
in full — especially the "Review lock contract — exhaustive list of
mutable surfaces."
Read: `src/construction/ConstructionCanvas.jsx`.

**Review mode detection**: when a file is imported via "Import a map"
and the file belongs to a different primary author than the current
`atlas_user_identity_v1`, prompt: "This map was authored by [name]. Open
for review?" with role selector (peer / TA / instructor). Confirming
enters review mode for this session. The reviewer identity is stored at
`atlas_review_identity_v1` as `{ name, role }`.

**Review-mode banner**: replaces the normal mode banner. "You are reviewing
[Student A]'s map. Your edits will be saved as annotations." Includes
same "View canonical reference →" link.

**Review locks** (enforce in canvas and all panels):
- Node bank: no place/unplace (bank hidden or all entries disabled).
- Placed nodes: no drag (positions locked).
- Student-created node panel: read-only (no editing of content).
- Edges: no creation, no deletion.
- The *only* writable surface is `annotations[]`.

**Annotation composer** (`src/construction/AnnotationComposer.jsx`):
- Clicking any placed node, any edge, or any empty canvas area in review
  mode opens the annotation composer anchored to the target.
- Fields: free-text body (Markdown + KaTeX), Save, Cancel.
- `target.kind`: `"node"` | `"edge"` | `"map"`.
- Saved annotation: `{ id: "ann-<uuid>", target, author, role, body,
  resolved: false, parent_id: null, created_at }`.

**Annotation rendering**:
- Numbered pin badges on annotated targets. Hovering shows count; clicking
  opens the annotation thread panel.
- Thread panel: shows annotation body and all replies. Reply button (creates
  child with `parent_id` set). Resolve button (sets `resolved: true`).
  Edit button (own annotations only).
- Resolved annotations render with a distinct style (grayed, strikethrough
  badge).

**"Export annotated map"** button (only in review mode): downloads the
file with `annotations[]` populated.

**Student re-import**: when a student imports a file that has annotations
not present in their local session's annotation set, surface a notification
toast: "N new annotations from [reviewer]." Student can view, reply to,
and resolve annotations.

**Validator enforcement**: before any import in review mode, run
`validateConstructionFile`. If any non-annotation diff is detected between
the reviewer's export and the student's local store, emit warning: "This
file was modified outside of annotations."

**Tests** (T9, T10):
- T9: import fixture in review mode → node bank disabled, edges read-only,
  positions locked, annotation composer opens on node/edge/canvas click.
- T10: create annotation on node/edge/map → correct `target.kind`; reply
  creates child with `parent_id`; resolve sets `resolved: true`; export
  and re-import → student receives new annotations, notification fires,
  replies serialize correctly.

---

### Session 10 — Canonical edge recovery metrics and diff panel (T11)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Automated metrics".
Read: `src/data/edges.js` or `src/data/edges.json` (canonical edge data).
Read: `src/construction/ConstructionCanvas.jsx`.

**`src/lib/construction/metrics.js`**:
- `computeEdgeMetrics({ studentEdges, canonicalEdges, placedCanonicalNodeIds })`:
  - Filter `canonicalEdges` to only those where both endpoints are in
    `placedCanonicalNodeIds` (edges "in scope").
  - Compare student edges between canonical nodes to in-scope canonical
    edges (undirected: `{A,B}` matches `{B,A}`).
  - Classify each in-scope canonical edge as Recovered or Missed.
  - Classify each student canonical-canonical edge as Recovered or Invented.
  - Compute Recall = Recovered / in-scope canonical count.
  - Compute Precision = Recovered / (Recovered + Invented).
  - Compute F1 = harmonic mean (0 if either is 0; handle division by zero).
  - Return `{ recovered, missed, invented, recall, precision, f1,
    studentNodeEdges }` where `studentNodeEdges` is the list of edges
    involving at least one student-created node (for qualitative display).

**Diff panel** (`src/construction/DiffPanel.jsx`):
- Available only in review mode, only when the reviewer's role is `"ta"`
  or `"instructor"`.
- Shows metrics summary at top: Recall / Precision / F1 as percentages.
- Edge list below: each in-scope edge tagged ✔ Recovered / ✗ Missed /
  ⚠ Invented.
- "Highlight differences" toggle: when on, missed canonical edges render
  as faint ghost edges on the canvas; invented edges highlight in a
  distinct color (use a `"ghost"` and `"invented"` edge type).
- Student-created-node edges listed in a separate section with their
  explanation text (qualitative only; no metric).
- Panel is closeable/collapsible.

**Tests** (T11 — unit tests with hand-crafted fixtures):
- Perfect recovery (all canonical edges drawn, none invented): recall =
  precision = F1 = 1.0.
- All missed (no canonical edges drawn): recall = 0, F1 = 0.
- All invented (edges drawn but no canonical matches): recall = 0,
  precision = 0.
- Half recovered, no invented: recall = 0.5, precision = 1.0,
  F1 ≈ 0.667.
- Edges between student nodes are excluded from metric computation and
  appear only in `studentNodeEdges`.

---

### Session 11 — Sanitization, accessibility, orphan policy, performance (T13b, T13d, T13e, T13f, T14)

Read: `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` §"Markdown, KaTeX, and
content sanitization", §"Accessibility baseline", §"Orphaned canonical
node policy", §"Performance targets", §"Tests" (T13b, T13d, T13e, T13f,
T14), §"Interactions with other specs".
Read: `src/components/KatexText.jsx` (existing KaTeX render pattern).
Read: `ATLAS_NODE_AFFORDANCES_SPEC.md` (hover-card suppression rules).

**Sanitization** (`src/lib/construction/renderText.js`):
- Install `dompurify` if not already present.
- `renderUserText(rawMarkdown)`: parse Markdown (use `marked` or
  `markdown-it`) → render KaTeX (`$...$` and `$$...$$`) → sanitize with
  DOMPurify using exactly the config in the spec (allowed tags/attrs,
  forbidden tags/attrs, FORCE_BODY). Validate `href` values: strip
  `javascript:` and `data:` schemes.
- Apply `renderUserText` at render time (not save time) in: student node
  Notes/Description/Assumption/Applicability/Misconception fields, edge
  explanation display, annotation body display.

**Orphan policy**:
- In `deserializeConstructionFile`, after loading, cross-reference every
  ID in `canonical_nodes` against the live canonical corpus (via
  `src/data/index.js`). IDs not found in the corpus are orphans.
- Orphaned nodes: render using a new `OrphanedNode.jsx` component — gray
  fill, dashed border, ⚠ glyph, bare ID as label.
- Edges touching orphaned nodes: preserved and rendered normally.
- "Clean up orphans" button in toolbar (only visible when orphans exist):
  confirmation → removes all orphaned nodes and their touching edges from
  the session, saves.
- Orphaned nodes produce a non-blocking `warnings[]` entry in
  `validateConstructionFile`; never an error.

**Accessibility**:
- Every placed node: `aria-label="[Node title], [canonical/student-created], [N edges]"`.
- Every construction edge: `aria-label="Connection from [source] to [target], [filled/unfilled] explanation"`.
- Mode banner: `role="status"`.
- Unfilled edge count badge: `aria-live="polite"`.
- Keyboard — placed nodes: Tab cycles focus; Enter opens detail panel;
  Delete/Backspace triggers unplace confirmation; Escape closes any open
  panel/dialog.
- Keyboard — edge creation: with node focused, **E** enters edge-drawing
  mode; Tab cycles through other placed nodes as targets; Enter commits;
  Escape cancels.
- Keyboard — node bank: Tab through entries; Enter places focused bank
  node at center of current viewport.
- All popovers and dialogs must trap focus (focus cannot leave via Tab).
  All return focus to triggering element on close. Explanation popover
  textarea receives focus automatically on open.

**Cross-spec invariants** (T14):
- Canonical node hover-card (`HoverCardOverlay.jsx`) works in construction
  mode for canonical nodes (read-only peek), but is suppressed during
  edge-drawing drag. Confirm this matches the suppression mechanism in
  `ATLAS_NODE_AFFORDANCES_SPEC.md`.
- Student-created nodes do NOT trigger the canonical hover-card; they open
  the student-node edit panel.
- Reveal-neighbors halo and count badge (`ATLAS_REVEAL_NEIGHBORS_SPEC.md`)
  are hidden in construction mode.
- Layout cache: no recomputation on selection, hover, or edge creation.

**Performance**:
- Create a large test fixture at `src/lib/construction/__tests__/fixtures/large.atlas-map.json`
  with 60 nodes (mix of canonical and student), 150 edges, and 200
  annotations (generated programmatically in a seed script).
- T13f: render large fixture → assert canvas fully painted and interactive
  within 500ms. Simulate drag on one node → assert drag-stop handler
  completes within 16ms. Open explanation popover → assert popover renders
  within 16ms.

**Tests** (T13b, T13d, T13e, T13f, T14):
- T13b orphan policy (full spec — see the test description).
- T13d: script tag stripped from notes; `javascript:` href stripped; valid
  KaTeX renders without error; Markdown with headings/bold/list renders
  correctly.
- T13e: Tab focus cycle, Enter opens panel, Delete opens confirmation,
  focus trapped in popover, focus returns on close, mode banner role and
  badge aria-live attributes present.
- T13f: large fixture renders within 500ms; drag within 16ms; popover
  within 16ms.
- T14: canonical hover-card works for canonical nodes, suppressed during
  drag; student nodes open edit panel; reveal-neighbors halo absent;
  layout cache not invalidated on hover/select/edge-create.
