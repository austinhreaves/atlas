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

The italicized questions are the principle-application thesis. They are why Atlas is more than a formula collection.

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

The content phase. Populates the problem, lab, and experiment layers; expands concept count to curriculum scale; adds the unifying edge types (`isomorphic`, `noether-consequence`).

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

- A parallel quiz/assessment engine (use Canvas LTI in Phase 4).
- Difficulty as an ambient global visual property (badge-only on problems).
- More than ~5 simultaneously visible node-layers (UI breaks down past this).
- Symmetries as their own node-layer (handled via anchor concepts + edge type).
- Geometries as a node-layer (handled via tags).
- Server-side persistence before Phase 4.
