# ATLAS Main Spec

## Product North Star

Atlas is an interactive physics knowledge graph for **conceptual mastery through principle application**. It is the spiritual successor to HyperPhysics: a structured, navigable map of physics knowledge that teaches students to *apply principles*, not pick equations.

### Dual mission

Atlas serves two audiences from the same artifact:

- **Public reference & exploration tool** — a free, open, web-native physics knowledge graph for any learner who would otherwise reach for HyperPhysics or Wikipedia.
- **Curriculum-aligned support tool** — referenced weekly by ASU PHY 114 / PHY 132 students and TAs alongside the lab sequence; eventual Canvas integration via LTI.

These missions stay coherent because the underlying artifact is the same: a high-quality, multi-layer, principle-first knowledge graph. The institutional layer (accounts, analytics, LTI) is built on top of the public artifact, never replaces it.

### The questions Atlas should let any student answer

- What does this concept mean?
- What should I understand first? What does it unlock next?
- *When does this principle apply, and when doesn't it?*
- *What experiment established this?*
- *What problem can I solve with this, and at what difficulty?*
- *Where does this same variable appear in other concepts?*
- *What lab activity makes this concrete?*
- *Can I build the map myself, from the bottom up, and have it agree with the canonical one?*

The italicized questions are the principle-application thesis. The final question is the constructive corollary — addressed by construction mode (see `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`). They are why Atlas is more than a formula collection.

---

## Architectural Principles

### Multi-layer graph

Atlas is not a single graph. It is a stack of co-existing graphs over a shared layout space, where each layer is a kind of first-class entity:

| Layer | Status | Description |
|---|---|---|
| Concepts | active | Laws, principles, equations, definitions, theorems |
| Variables | Phase 3a | Symbol-level identities linked across concepts |
| Problems | Phase 3b | Worked examples and practice problems |
| Labs | Phase 3b | Experimental activities (PHY 114 / PHY 132 alignment) |
| Experiments | Phase 3b | Canonical empirical results: Cavendish, double-slit, Millikan, etc. |

Layers are visually distinct (shape *and* color, not just color) and individually toggleable. Default view is concepts only. Cross-layer edges are first-class: a problem activates concepts; a concept appears in a lab; an experiment establishes a law.

### Modes of Atlas

Atlas formally has three mutually-exclusive modes of operation, each gated by URL parameter and signaled by a visible banner. Modes share the same underlying graph data but expose different interactions and produce different artifacts:

| Mode | Gate | Purpose |
|---|---|---|
| Reference | default | Browse the canonical graph — exploration and lookup |
| Author | `?edit=layout` | Edit canonical layout (positions); produces canonical-patch JSON for PR review |
| Construction | `?mode=construct[&assignment=<id>]` | Build a personal or assignment concept map; produces `.atlas-map.json` student artifacts |

Reference is the default for any visitor. Author mode is gated by URL parameter today and by accounts in Phase 4; it is the channel by which authors update the canonical graph's layout without bypassing review. Construction mode is the pedagogical primitive — students assemble their own maps from a curated node bank and exchange annotated submissions with peers and TAs.

Modes are an architectural concern, not a UI flourish. They establish persistence boundaries (each mode writes to its own localStorage scope), invariants (canonical content is read-only outside author mode; canonical edges are hidden in construction mode), and a stable vocabulary for cross-spec reasoning. The full specifications live in `ATLAS_LAYOUT_AUTHORING_SPEC.md` and `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`.

### Properties, not layers

The following are per-entity content fields, not separate node-layers. They modify but do not stand alone:

- **Applicability conditions** (concept layer) — "this applies when…" — the load-bearing field for the principle-application thesis
- **Limiting cases** (concept layer) — "as X → 0 / ∞ / classical / relativistic limits"
- **Misconceptions** (concept layer) — 2–4 known student wrong-models per concept
- **Geometries** (problem & concept tags) — cylindrical, spherical, planar, etc.
- **Difficulty** (problem layer only) — numeric 1–5, audience-tagged
- **Historical context** (concept layer) — flavor, low structural weight

### Visual encoding budget

Color and shape are scarce channels. Allocations are deliberate and singular:

- **Color** — domain (mechanics / E&M / thermo / waves / modern / math)
- **Shape** — layer (concept = circle, variable = diamond, problem = square, lab = hexagon, experiment = octagon — final glyphs TBD in Phase 3a)
- **Size** — mass (topological importance, weighted toward foundationality)
- **Saturation / fill** — understanding state
- **Stroke style & arrowhead** — edge type (foundational / supporting / lateral / definitional / isomorphic / noether-consequence)

Difficulty is *not* in the ambient visual vocabulary. It is a numeric badge on problems and a filter, never a global node color.

### Mass as in/out blend

Node visual size encodes structural importance via:

```
mass = 1.0 + α · out_foundational + β · in_foundational
```

with α > β (default α = 0.5, β = 0.2, capped at 3.0). Outgoing foundational edges (foundationality — "what depends on me") dominate; incoming foundational edges (centrality — "I synthesize many things") contribute. This means both anchor concepts (Newton's 2nd) and capstone concepts (Conservation of Energy) read as visually heavy, for different correct reasons.

### Principle-first authoring discipline

Every concept node, before it ships, must answer:

1. **What's the principle?** (one sentence, before the equation)
2. **When does it apply?** (applicability conditions)
3. **What breaks it?** (limiting cases, regime boundaries)
4. **What experiment established it?** (link to experiment layer once active)
5. **Where do students get it wrong?** (misconceptions)

Equation-and-variables-only nodes do not pass authoring review.

---

## Phase Roadmap

### Phase 1 — MVP Foundation ✅ Complete

- Flat schema, manual positions, 10 seed concepts.
- Validated the core interaction model: graph exploration + panel inspection.

### Phase 2 — Directed Learning Graph ✅ Complete (incl. Phase 2b)

- Schema v2 with directed typed prerequisites (`foundational`, `supporting`, `lateral`, `definitional`).
- Deterministic force layout with cache and pinned positions.
- Weighted, typed, directed edge rendering with floating-handle anchoring.
- Role-aware variable presentation; causal-structure semantics.
- Local understanding state (binary) with frontier visualization.
- Phase 2b: optional `variables[].id` with kebab-case enforcement; reverse prerequisite index powering `Enables` panel.

### Phase 3a — Multi-Layer Foundation (next, see ATLAS_PHASE3A_SPEC.md)

The architectural phase. Generalizes the engine from "concept graph" to "multi-layer graph." Ships variables as the first activated additional layer; lays the schema, rendering, and UI infrastructure that Phase 3b populates.

Key deliverables:

- Schema v3: layer abstraction, variables as first-class entities, cross-layer edges.
- Layer-toggle UI; per-layer visual treatment (shape + color discipline).
- Mass formula upgrade (in/out blend).
- Graduated understanding scale (seen / recognize / apply / derive) replacing binary checkbox.
- Concept-layer property additions: applicability conditions, limiting cases, misconceptions.
- Authoring workflow scaffolding (review state, attribution, versioning at the schema level).
- Migration of all 10 existing concept nodes to v3.

Phase 3a does *not* author new content. It builds the engine.

### Phase 3b — Content Layer Activation & Curriculum Expansion (see ATLAS_PHASE3B_SPEC.md)

The content phase. Populates the problem, lab, and experiment layers; expands concept count to curriculum scale; adds the unifying edge types (`isomorphic`, `noether-consequence`). Phase 3b also activates the cross-phase capability specs that turn Atlas from a reference into a learning instrument.

Key deliverables:

- 40–60 concept nodes spanning Mechanics, E&M, Optics, Waves, Thermodynamics, Modern Physics.
- Problem layer activated with worked examples + practice problems; difficulty 1–5; audience tags.
- Lab layer activated with PHY 114 and PHY 132 lab alignments.
- Experiment layer activated with canonical empirical results.
- Isomorphism edges (SHM ↔ LC oscillator ↔ pendulum, wave equation across domains).
- Symmetry anchor concepts + Noether-consequence edges to the conservation laws.
- Principle-application path visualization (problem → ordered concept traversal).
- Search across concepts / formulas / variables / tags.
- Permalinks for deep-linking entities.
- Mobile-responsive interaction model.
- TA-collaborator authoring pipeline.
- **Concept-node legibility upgrade** (per `ATLAS_NODE_AFFORDANCES_SPEC.md`): label-fitting contract, hover-peek card, in-node domain label removal. Lands before curriculum-scale expansion so new concepts ship into a layout that handles their titles correctly.
- **Interactive layout authoring** (per `ATLAS_LAYOUT_AUTHORING_SPEC.md`): draggable nodes, per-user layout persistence, author-mode canonical-patch export. Foundation for hand-placed pedagogical layouts at curriculum scale; obviates algorithmic edge-crossing minimization for graphs of Atlas's expected size.
- **Concept-map construction MVP** (per `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`): construction mode with the recover-prerequisites-untyped variant, node bank, edge drawing, submission file format, and TA review/annotation loop. The pedagogical primitive that lets construction become a regular assignment in PHY 114 / PHY 132.

### Phase 4 — Platform Layer & Instructional Intelligence

The institutional phase. Adds account-backed state, Canvas integration, and the AI tutor — without compromising the public-tool nature of the underlying artifact.

Key deliverables:

- Backend persistence; user accounts.
- **Canvas LTI integration** — Atlas reads quiz outcomes from existing PHY 114 / PHY 132 Canvas quizzes via the standard gradebook hook. Understanding state is updated by real assessment evidence, decay-aware. Atlas does *not* build a parallel quiz engine.
- Aggregated, anonymized analytics for instructors (cohort frontier views, concept-level struggle signals).
- AI tutor grounded in graph structure: RAG with the multi-layer graph as the knowledge base.
- Instructor tools: cohort assignment of nodes / problems, frontier reports.
- FERPA-grade privacy boundary between public artifact and student data.

---

## Cross-Phase Architecture Throughline

Atlas evolves in deliberate layers, each enabling the next:

1. **Phase 1–2** — Concept graph foundation; directed dependency semantics; local learning feedback.
2. **Phase 3a** — Multi-layer architecture; variable identity; principle-application properties.
3. **Phase 3b** — Content layer activation; cross-domain unifying edges; curriculum-scale graph.
4. **Phase 4** — Platform layer; assessment-driven state via Canvas; instructional intelligence.

Each phase remains backward compatible where feasible. Migrations are explicit, versioned, and gated by validator coverage.

---

## Phase-agnostic addendums

Some Atlas capabilities cut across phase boundaries — they refine an interaction or affordance that exists from Phase 2 forward and that subsequent phases extend rather than introduce. These capabilities live in dedicated specs whose requirements are self-contained and whose phase placement is annotated within. They are first-class architectural components, not appendices.

| Spec | Capability | Phase placement |
|---|---|---|
| `ATLAS_REVEAL_NEIGHBORS_SPEC.md` | Neighbor discovery, ZPD rank-ordering, latent-content indicators (halo + count badge) | Phase 3b for full ranking; stub possible alongside earlier work |
| `ATLAS_NODE_AFFORDANCES_SPEC.md` | Concept-node legibility (label-fitting, domain encoding) and hover-peek card | Move 1 immediate; Moves 2–3 before Phase 3b concept expansion |
| `ATLAS_LAYOUT_AUTHORING_SPEC.md` | Interactive node dragging, per-user layout persistence, author-mode canonical-patch export | Phase 3b foundation, lands before construction MVP |
| `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` | Construction mode — student-built concept maps with peer/TA annotation review | Phase 3b MVP (variant A); B/C/D as post-MVP |

Addendums share a common discipline:

- **Self-contained requirements.** Each addendum can be read and implemented without reference to other addendums beyond declared dependencies.
- **Explicit dependencies.** Where one addendum builds on another (e.g., construction mode depends on layout authoring), the dependency is declared at the top of the dependent spec and is enforced by sequencing.
- **Cross-spec invariant tests.** Where addendums interact (e.g., hover-peek must suppress during drag), the integration test belongs to whichever spec ships second.
- **Vocabulary alignment.** Modes, persistence keys, file formats, and store names are coordinated across addendums to avoid collisions.

The addendum pattern lets Atlas evolve specific capabilities without disturbing the phase roadmap and without sprawling those capabilities into the phase specs themselves.

---

## Data and Validation Principles

- Schema changes are **additive first**, strictness later via explicit migration windows.
- Every new field requires:
  - clear ownership of source-of-truth,
  - validation behavior,
  - display semantics in UI,
  - tests for valid and invalid cases.
- Layer schemas are versioned independently when possible (concept-v3 and variable-v3 may evolve at different paces post-3a).
- Cross-layer edges are validated against both endpoint layer schemas.
- Authoring metadata (author, review state, last-reviewed date) is a schema concern from Phase 3a forward.

---

## Authoring Discipline

Atlas content quality is the product. Authoring is therefore a first-class workflow concern, not an afterthought.

- **Source of truth**: JSON files in repo, reviewed via PR.
- **Author attribution**: every entity carries an `author` field (free string for now; account-bound in Phase 4).
- **Review state**: `draft | reviewed | published`. Only `published` entities render to the public graph by default; a `?include=draft` URL parameter exposes drafts for contributors.
- **Physics-correctness review**: every entity needs sign-off from someone with relevant subject expertise before promotion to `published`. This is a human process, not a tooling problem; the schema just records the outcome.
- **TA contributor pipeline (Phase 3b)**: TAs author drafts as a curriculum-development project; instructor (Austin) reviews and promotes. This is the primary content-production channel for Phase 3b.

---

## Current Completion Snapshot

- Phase 1: ✅ complete.
- Phase 2 core: ✅ complete.
- Phase 2b: ✅ complete (variable identity seed + bidirectional concept links).
- Phase 3a: 🔜 next — see ATLAS_PHASE3A_SPEC.md.
- Phase 3b: 📋 spec drafted — see ATLAS_PHASE3B_SPEC.md.
- Phase 4: 🪐 long-horizon; LTI architecture flagged.

---

## Out of Scope (Permanent Until Promoted)

The following will not be implemented without explicit promotion via spec amendment:

- A parallel quiz/assessment engine (use Canvas LTI in Phase 4). Construction mode (`ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`) is *not* a quiz engine — it produces constructive artifacts that humans review and grade, not auto-scored answer keys. The distinction is enforced by the construction spec's "Atlas does not auto-assign grades" rule.
- Difficulty as an ambient global visual property (badge-only on problems).
- More than ~5 simultaneously visible node-layers (UI breaks down past this).
- Symmetries as their own node-layer (handled via anchor concepts + edge type).
- Geometries as a node-layer (handled via tags).
- Server-side persistence before Phase 4. Construction-mode submissions are client-side files; they do not require backend storage to function.
- Real-time collaborative editing of any kind (canonical or construction). Single-device, multi-author file authoring is the supported pattern through Phase 4.
- Algorithmic edge-crossing minimization. Hand-placement via `ATLAS_LAYOUT_AUTHORING_SPEC.md` is the answer for graphs of Atlas's expected scale; the question may be reopened past ~150 nodes.
