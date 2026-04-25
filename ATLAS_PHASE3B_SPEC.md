# Atlas Phase 3b — Content Layer Activation & Curriculum Expansion

> Phase 3b is the content phase. With 3a's multi-layer engine in place, 3b populates the problem, lab, and experiment layers; expands the concept graph to curriculum scale; and adds the unifying edges (isomorphism, Noether-consequence) that turn Atlas from a directory into a *theory* of physics structure.

---

## Scope summary

Phase 3b is dominated by content authoring and pedagogical decisions. The engineering work is mostly schema activation, edge type additions, and the navigation/discovery surface (search, permalinks, mobile). The *real* work is producing high-quality content across four layers and getting it through review.

### In scope

- Activate problem layer: schema, validator, rendering, panel, content.
- Activate lab layer: schema, validator, rendering, panel, content (PHY 114 + PHY 132 alignments).
- Activate experiment layer: schema, validator, rendering, panel, content.
- Cross-layer edge types: `applies` (problem → concept), `instantiates` (lab → concept), `establishes` (experiment → concept).
- Same-layer concept edges (new types):
  - `isomorphic` — non-directional structural identity (SHM ↔ LC ↔ pendulum).
  - `noether-consequence` — symmetry concept → conservation law.
- Symmetry anchor concepts: `translational-invariance`, `time-invariance`, `rotational-invariance`.
- Concept graph expansion to ~40–60 concept nodes spanning Mechanics, E&M, Optics, Waves, Thermodynamics, Modern Physics.
- Difficulty system on problems: numeric 1–5 + audience tag.
- Audience tagging: `general | phy-114 | phy-132 | ap-physics | upper-division`.
- Geometry filtering UI on problems and concepts.
- **Principle-application path** view: select a problem, see the ordered concept traversal that solves it.
- Search across all entity layers (concepts, variables, problems, labs, experiments) by title, formula, tag, variable symbol.
- Permalinks: `/entity/:id` URL routing.
- Mobile-responsive layout: graph collapses to a navigable list view at narrow widths; panel becomes full-screen sheet.
- TA contributor pipeline: documented authoring workflow + review checklist.

### Explicitly out of scope for Phase 3b

- Backend, accounts, server-side persistence — Phase 4.
- Canvas LTI integration — Phase 4.
- Assessment-driven understanding state — Phase 4.
- Aggregated analytics — Phase 4.
- AI tutor — Phase 4.
- Authoring CMS / web UI — Phase 4 if at all; JSON + PR remains the workflow.
- Custom interactive widgets beyond PhET — case-by-case, not a 3b deliverable.

---

## Schema additions

### Problem entity

```json
{
  "id": "rc-discharge-time-constant",
  "layer": "problem",
  "title": "Time to discharge to 1/e",
  "type": "worked-example",
  "domain": "electromagnetism",
  "difficulty": 2,
  "audience": ["phy-132", "general"],
  "geometries": ["none"],
  "prompt": "A capacitor C is charged to voltage V₀ and connected across a resistor R at t = 0. At what time has the capacitor voltage decayed to V₀/e?",
  "given": [
    { "symbol": "C", "value": "capacitance", "note": "" },
    { "symbol": "R", "value": "resistance", "note": "" },
    { "symbol": "V_0", "value": "initial voltage", "note": "" }
  ],
  "find": "Time t such that V(t) = V₀/e",
  "concept_path": [
    { "concept_id": "rc-circuits", "step": "Recognize this is an RC discharge problem" },
    { "concept_id": "exponential-decay", "step": "Apply V(t) = V₀ · exp(-t/RC)" },
    { "concept_id": "natural-log", "step": "Solve V₀/e = V₀ · exp(-t/RC) ⇒ t = RC" }
  ],
  "solution": "...",
  "answer": "t = RC (the time constant τ)",
  "common_errors": [
    "Forgetting that 1/e ≈ 0.368, not 0.5 (confusing with half-life).",
    "Using the charging formula V(t) = V₀(1 - exp(-t/RC)) instead of discharge."
  ],
  "uses_variables": ["voltage", "current", "resistance", "capacitance", "time"],
  "tags": ["rc-circuits", "exponential", "time-constant"],
  "author": "austin",
  "review_state": "published",
  "last_reviewed": "2026-05-01"
}
```

Problem `type`: `"worked-example" | "practice" | "conceptual" | "challenge"`.

`concept_path` is the ordered list of concepts a solver traverses. This drives the **principle-application path view**: when a problem is selected, the listed concepts highlight in order on the graph, with edges between consecutive steps drawn as a temporary path overlay. This is the single most pedagogically distinctive feature of Phase 3b.

### Lab entity

```json
{
  "id": "phy132-lab04-rc-circuits",
  "layer": "lab",
  "title": "PHY 132 Lab 4 — RC Circuits and Time Constants",
  "course": "phy-132",
  "lab_number": 4,
  "duration_minutes": 50,
  "format": "in-person",
  "learning_objectives": [
    "Measure the time constant of an RC circuit experimentally.",
    "Verify the exponential decay model.",
    "Compare measured τ with theoretical RC."
  ],
  "concepts_activated": ["ohms-law", "rc-circuits", "exponential-decay", "capacitance"],
  "equipment": ["oscilloscope", "function-generator", "resistors", "capacitors", "breadboard"],
  "prerequisite_concepts": ["ohms-law", "capacitance"],
  "summary": "Students drive an RC circuit with a square wave and measure the resulting voltage decay on the oscilloscope, extracting τ from the trace.",
  "ta_notes": "Common student trap: misreading time-base scaling on the scope. Have TAs verify scaling explicitly at the τ-measurement step.",
  "tags": ["rc-circuits", "lab", "phy-132"],
  "author": "austin",
  "review_state": "published"
}
```

`format`: `"in-person" | "online" | "hybrid"`. `course`: `"phy-114" | "phy-132" | "general"`. `ta_notes` is rendered only with `?include=ta` URL parameter (TA-facing content; not surfaced in default public view).

### Experiment entity

```json
{
  "id": "millikan-oil-drop",
  "layer": "experiment",
  "title": "Millikan Oil Drop Experiment",
  "year": 1909,
  "experimenters": ["Robert Millikan", "Harvey Fletcher"],
  "domain": "electromagnetism",
  "establishes_concepts": ["charge-quantization", "elementary-charge"],
  "method_summary": "Charged oil droplets are suspended in an electric field; balancing gravitational and electric forces yields the charge on each drop. Measured charges are integer multiples of a fundamental unit e ≈ 1.6 × 10⁻¹⁹ C.",
  "result": "Demonstrated that electric charge is quantized in units of e.",
  "significance": "First direct measurement of the elementary charge; cornerstone of atomic and particle physics.",
  "modern_status": "Result confirmed; the original analysis methodology was later criticized for selective data inclusion, but the conclusion is correct.",
  "uses_variables": ["charge", "electric-field", "mass", "gravitational-acceleration"],
  "tags": ["historical", "quantization", "fundamental-constants"],
  "author": "austin",
  "review_state": "published"
}
```

Experiment entities deliberately include `modern_status` to flag results that have been refined, superseded, or had methodological controversies — pedagogically honest physics.

### New edge types

| Type | Source layer | Target layer | Direction | Visual |
|---|---|---|---|---|
| `applies` | problem | concept | one-way | thin solid, no arrowhead, problem-accent color |
| `instantiates` | lab | concept | one-way | medium dashed, lab-accent color |
| `establishes` | experiment | concept | one-way | thick solid, experiment-accent color, distinct arrowhead |
| `isomorphic` | concept | concept | bidirectional | double-stroke, glow effect, no arrowhead |
| `noether-consequence` | concept (symmetry) | concept (conservation) | one-way | gold/special accent, distinctive arrowhead |

Visual treatments must be mutually distinguishable from the Phase 2 prerequisite types when multiple layers and edge types are visible simultaneously. Edge color is *not* domain-coded for these new types — it carries layer/edge-type meaning.

### Symmetry anchor concepts

Three new concept nodes introduced in Phase 3b expansion:

- `translational-invariance` (mechanics, principle) → `noether-consequence` → `conservation-of-momentum`
- `time-invariance` (mechanics, principle) → `noether-consequence` → `conservation-of-energy`
- `rotational-invariance` (mechanics, principle) → `noether-consequence` → `conservation-of-angular-momentum`

These nodes carry an `applicability_conditions` field declaring "smooth, continuous symmetry of the system's Lagrangian" and an honest pedagogical note: full Noether's theorem is upper-division content, but the *consequence* is intelligible at intro level — and surfacing it changes how students see the conservation laws.

### Isomorphism edges

Hand-authored, sparse, high-impact. Initial set:

- `simple-harmonic-motion` ↔ `lc-oscillator` ↔ `pendulum-small-angle`
- `wave-equation-string` ↔ `wave-equation-em` ↔ `wave-equation-sound`
- `coulombs-law` ↔ `newtons-gravitation` (both 1/r² central forces)
- `ohms-law` ↔ `fouriers-law` ↔ `ficks-law` (linear transport laws — reach into thermo)

These edges are *the* visible signature that Atlas teaches physics as unified rather than compartmentalized. The visual treatment must be unmistakable.

---

## Content targets

### Concept layer expansion

Target ~50 nodes total (10 existing + ~40 new). Distribution:

| Domain | Existing | Target | New |
|---|---|---|---|
| Mechanics | 5 | 12 | +7 (rotational, oscillations, gravitation, fluids stub) |
| E&M | 5 | 14 | +9 (capacitance, inductance, RC/RL/RLC, EM induction depth, Maxwell's) |
| Optics | 0 | 8 | +8 (geometric + wave optics) |
| Waves | 0 | 6 | +6 (wave equation, superposition, standing waves, Doppler) |
| Thermodynamics | 0 | 6 | +6 (laws of thermo, ideal gas, entropy stub) |
| Modern Physics | 0 | 4 | +4 (photoelectric, de Broglie, Bohr model, mass-energy) |

These are guideline counts. Pedagogical coherence beats hitting numbers.

### Problem layer

Target: 3 problems per major concept, weighted toward laws and principles over definitions/equations. ~120 problems in 3b. Mix:

- ~40% worked examples (full solutions visible)
- ~40% practice problems (answer + hints, full solution gated behind a "show solution" toggle)
- ~15% conceptual (no calculation, principle-application only)
- ~5% challenge (multi-concept synthesis, principle-application path spanning 4+ concepts)

Problems align with PHY 114 / PHY 132 difficulty calibration where applicable.

### Lab layer

Target: full PHY 114 lab sequence (~12 labs) + full PHY 132 lab sequence (~12 labs). Each lab:

- Aligned to existing course materials.
- TA notes captured from current run-of-show.
- Concept activations honestly reflect what the lab actually exercises (not aspirational).

Authoring channel: Austin + TAs as a curriculum-development project. This is the bulk of the institutional value of Phase 3b.

### Experiment layer

Target: ~20 canonical experiments. Initial list:

- Cavendish (gravitation)
- Galileo's inclined planes (kinematics, free-fall)
- Foucault pendulum (rotational frames)
- Coulomb's torsion balance (electrostatics)
- Oersted's compass (magnetism from current)
- Faraday's induction experiments
- Millikan oil drop (charge quantization)
- Thomson e/m (electron discovery)
- Rutherford scattering (nuclear atom)
- Photoelectric effect (Einstein 1905, Millikan verification)
- Davisson-Germer (electron diffraction)
- Stern-Gerlach (spin)
- Michelson-Morley (no luminiferous ether)
- Eddington 1919 eclipse (general relativity)
- Double-slit (wave-particle duality)
- Young's double-slit interference (light as wave)
- Fizeau / Foucault speed of light
- Cavendish (already listed, omit duplicate)
- Hertz's EM wave generation
- Planck blackbody (quantum hypothesis)
- Compton scattering

Each experiment links to the concepts it established with `establishes` edges.

---

## New UI Surfaces

### Search

- Global search bar, top of canvas. Cmd/Ctrl-K opens it.
- Searches across: entity titles, formulas (LaTeX text), tags, variable symbols and names, problem prompts.
- Results grouped by layer.
- Selecting a result selects the entity and pans the graph to it.
- Implementation: client-side fuzzy search (e.g., `fuse.js` — only new dep allowed in 3b, justify in PR).

### Permalinks

- Routes: `/entity/:id` for any entity. `/` for default view.
- Selecting an entity updates URL via `history.pushState` (no full router needed; native history API is enough).
- Permalinks include an optional `?layers=concept,variable,problem` parameter to encode visible layers in the link.

### Mobile layout

- Graph view at narrow widths becomes a *navigable list* view: layers as tabs, entities as cards, prerequisite/enables as inline links.
- Panel becomes a full-screen sheet with back navigation.
- Decision: mobile users get a different *interaction model* (list-driven traversal) over the same data, not a cramped graph. The graph experience requires desktop space.

### Principle-application path view

When a problem is selected:

1. The graph dims to a low-emphasis state.
2. Concepts in the problem's `concept_path` highlight in order, numbered 1, 2, 3 …
3. A temporary overlay path connects them in sequence, animated to draw progressively.
4. The panel shows the problem with each `concept_path` step expanded; clicking a step navigates to that concept (with the path overlay still visible).

This is the visualization that operationalizes the "principle application not equation picking" thesis. It must feel deliberate and central, not decorative.

### Geometry filter

Dropdown filter on the canvas that shows only entities tagged with selected geometries. Useful when teaching e.g. "Gauss's law for spherical geometry" — students filter to spherical-tagged problems and concepts. Tagged entities only; untagged entities pass through filter unaffected.

---

## Authoring Pipeline (TA contributor channel)

This is the institutional half of Phase 3b. It is treated as part of the deliverable, not as extracurricular.

### Workflow

1. **Author** (TA or Austin) creates an entity in the appropriate JSON file with `review_state: "draft"`.
2. **Self-review** — author runs validator + tests locally; verifies nothing is broken.
3. **Open PR** — auto-deploys to a preview URL with `?include=draft` enabled.
4. **Physics-correctness review** — Austin (or designated reviewer) checks pedagogical and physical accuracy against a content review checklist (below).
5. **Promotion** — reviewer flips `review_state` to `"reviewed"` (visible to drafts query) or `"published"` (visible by default).

### Content review checklist

Before promoting any entity to `published`, the reviewer confirms:

**For concepts:**
- [ ] Principle field exists and is a single clear sentence.
- [ ] Applicability conditions are pedagogically honest (not just "this is a law").
- [ ] At least one limiting case where physically meaningful.
- [ ] At least one misconception for laws and principles.
- [ ] Variables reference real entries in `variables.json`.
- [ ] Prerequisites are weighted per the v2 conventions and resolve to real concepts.
- [ ] Visual scene URL works, embeds correctly, and is pedagogically appropriate.

**For problems:**
- [ ] Solution is correct.
- [ ] `concept_path` actually traces a valid solution route.
- [ ] Difficulty rating is calibrated against existing problems of similar level.
- [ ] Audience tag matches the difficulty (a `phy-114` problem should not require calculus the course doesn't teach).
- [ ] Common errors are real student errors, not strawmen.

**For labs:**
- [ ] Concept activations match what the lab actually exercises.
- [ ] Equipment list is current.
- [ ] TA notes capture institutional knowledge useful to next semester's TAs.

**For experiments:**
- [ ] Date and experimenters are correct.
- [ ] `establishes` links target the concepts the experiment actually established (not aspirationally everything related).
- [ ] `modern_status` is honest where the original interpretation has been refined.

### Attribution

Every entity carries `author`. Public-facing attribution will be added as a small "Contributors" footer in 3b that lists distinct authors. This matters for TA recognition and for the open-tool ethos.

---

## Cursor Session Plan

Sessions in order. Note that sessions 4–7 are predominantly content authoring, not engineering. Allocate accordingly.

---

### Session 1 — Problem layer activation (schema + rendering)

```
Activate the problem layer.

1. Add validateProblemNode to src/data/schema.js per the schema in
   ATLAS_PHASE3B_SPEC.md. Register validator on LAYERS.problem.

2. Create src/components/nodes/ProblemNode.jsx:
   - Square shape (rounded corners, ~70px).
   - Domain color from problem.domain.
   - Difficulty badge: small filled circle in top-right with number 1–5,
     colored from a perceptually-uniform sequential ramp (viridis-style).
   - Audience indicator: small text badge (e.g., "132") if course-tagged.

3. Create src/components/panels/ProblemPanel.jsx:
   - Header: title, type badge, difficulty 1–5, audience tags.
   - Prompt section (KaTeX where math appears).
   - Given / Find table.
   - Concept path: numbered list of steps, each linking to its concept.
   - Solution: collapsed by default for "practice" type; visible for
     "worked-example".
   - Answer: highlighted block.
   - Common errors: bulleted list.

4. Update buildEdges to generate "applies" edges from problem.concept_path:
   for each concept_path step, emit edge { source: problem.id,
   target: step.concept_id, type: "applies" }.

5. Update FloatingEdge to handle the "applies" edge type per the table in
   ATLAS_PHASE3B_SPEC.md.

6. Author 3 seed problems for testing — one per type (worked-example,
   practice, conceptual). Pick existing concepts (Newton's 2nd, Ohm's law,
   Coulomb's law). These are ENGINEERING SCAFFOLDING; real authoring in
   later sessions.

7. Tests:
   - validateProblemNode covers all required fields and difficulty bounds.
   - "applies" edges generated correctly from concept_path.
   - Problem panel renders all sections.
```

---

### Session 2 — Lab and experiment layers

```
Activate the lab and experiment layers.

1. Add validateLabNode and validateExperimentNode to schema.js.
   Register on LAYERS.lab and LAYERS.experiment.

2. Create LabNode.jsx (hexagon shape) and ExperimentNode.jsx (octagon shape).
   Lab gets a course-derived accent color (PHY 114 vs 132 distinct).
   Experiment gets a "historical" muted gold or sepia tone.

3. Create LabPanel.jsx and ExperimentPanel.jsx per the schema fields.
   ?include=ta URL param exposes ta_notes block in LabPanel.

4. Cross-layer edges:
   - "instantiates" edges from lab.concepts_activated.
   - "establishes" edges from experiment.establishes_concepts.

5. Update LayerToggleBar — lab and experiment toggles enabled.

6. Seed content:
   - 1 lab entity per course (PHY 114 + PHY 132) for testing.
   - 2 experiment entities for testing.

7. Tests for all of the above. Schema validation, edge generation, panel
   rendering, layer toggle composition.
```

---

### Session 3 — Isomorphism + Noether edges + symmetry anchor concepts

```
Add the unifying edge types and symmetry concepts.

1. Schema:
   - Extend prerequisite type vocabulary or add a parallel concept_edges[]
     array. Decision: parallel array. Rationale: prerequisites are about
     learning order; isomorphism and Noether are about structural identity,
     pedagogically distinct, deserve schema separation. Add concept_edges[]
     to the concept node schema:
     { target: string, type: "isomorphic" | "noether-consequence", note?: string }

2. buildEdges generates these alongside prerequisite edges.

3. FloatingEdge / AtlasEdge handles the new types per the visual table.

4. Author the 3 symmetry anchor concepts:
   - translational-invariance, time-invariance, rotational-invariance.
   - Each with full v3 schema fields including principle, applicability,
     misconceptions.
   - Each with a noether-consequence concept_edge to the matching conservation
     law (which itself must be authored if not present — conservation-of-energy
     and conservation-of-angular-momentum may be new in 3b expansion).

5. Author the initial isomorphism edges per the spec (SHM ↔ LC ↔ pendulum,
   wave equations, 1/r² laws, transport laws). Some target concepts may not
   exist yet — flag and author the missing concepts as part of this session if
   they're already in the 3b expansion targets, or stub them with
   review_state: "draft".

6. Tests:
   - Symmetry anchors validate.
   - noether-consequence edges generated, render correctly.
   - Isomorphism edges bidirectional in rendering, do not double-count in
     computeMass.
```

---

### Session 4 — Concept layer expansion (content session)

```
Author concept node expansion.

This session is dominated by authoring. Engineering work is minimal:
verify each authored node passes validation and the graph still computes
a sensible layout.

1. Author the ~40 new concept nodes per the distribution table in
   ATLAS_PHASE3B_SPEC.md.

2. For each: every required field including principle, applicability_conditions
   (where required by type), variables referencing variables.json (extending
   variables.json as needed for new symbols).

3. Conservation-of-energy and conservation-of-angular-momentum if not
   authored in Session 3.

4. Run validators and tests after each batch of ~5 nodes — do not author 40
   in one push and discover validation issues at the end.

5. Verify layout cache invalidates correctly when entity set changes.
   Verify no node ends up isolated unless intentional.

6. Update README's content snapshot table.
```

---

### Session 5 — Problem layer content + principle-application path view

```
Author problem content and ship the path view.

1. Author ~120 problems per the distribution in ATLAS_PHASE3B_SPEC.md, in
   batches by domain. Worked examples first; practice and conceptual after.

2. For each: full schema, accurate concept_path, audience-tag-appropriate
   difficulty.

3. Implement principle-application path view in GraphCanvas:
   - When selectedEntity.layer === "problem", apply path-overlay rendering
     mode.
   - Dim all entities to opacity 0.2 except concepts in concept_path.
   - Number the path concepts 1, 2, 3, ... with badge overlays.
   - Animate a path drawing from concept 1 → 2 → 3 → ... using SVG
     stroke-dasharray + stroke-dashoffset CSS animation, 1.5s total.
   - In ProblemPanel, concept_path steps are numbered to match.
   - Clicking a numbered concept selects it but preserves path overlay.

4. Add a "Replay path" button on ProblemPanel that re-runs the animation.

5. Manual test:
   - Select a multi-step problem; path animates clearly.
   - Path remains visible while navigating to concept_path concepts.
   - Selecting a non-problem entity clears the overlay.
```

---

### Session 6 — Lab + experiment content + TA pipeline polish

```
Author lab and experiment content.

1. PHY 114 + PHY 132 lab sequences. Aligned to current course materials.
   This is collaborative with TAs — establish a shared doc / channel for
   content drafts and review notes outside the spec.

2. ~20 experiment entities per the canonical list. Honest modern_status.

3. TA-facing UX polish:
   - ?include=ta URL parameter (separate from ?include=draft).
   - TA notes section in LabPanel renders when param is set.
   - Banner at top: "TA view active" similar to draft banner.

4. Contributors footer: small footer link "Contributors" that opens a modal
   listing distinct authors across all entities.

5. Update README authoring section with the full review checklist.
```

---

### Session 7 — Search, permalinks, geometry filter

```
Discovery and navigation surfaces.

1. Search:
   - Add fuse.js (only new dep this phase). Justify in PR description.
   - Build search index across all entities at app load.
   - Cmd/Ctrl-K opens search modal.
   - Results grouped by layer with shape glyph.
   - Selecting a result selects the entity and pans graph.

2. Permalinks:
   - Use native history API; no router dependency.
   - On selection: pushState(`/entity/${id}`).
   - On load: read pathname, select matching entity if found.
   - Encode visible layers in ?layers query param when non-default.

3. Geometry filter:
   - Dropdown on canvas top-bar.
   - Multi-select from controlled vocabulary (cylindrical, spherical,
     planar, axial).
   - Filter entities tagged with at least one selected geometry; untagged
     entities unaffected.

4. Tests:
   - Search index populated for all layers.
   - Permalink round-trips: visit /entity/ohms-law → ohms-law selected;
     refresh → still selected.
   - Geometry filter composes correctly with domain and layer filters.
```

---

### Session 8 — Mobile responsive layout

```
Mobile interaction model.

1. Detect mobile breakpoint at 768px (Tailwind md).

2. Below breakpoint:
   - Hide React Flow graph.
   - Show MobileListView component:
     - Layer tabs at top (concept | variable | problem | lab | experiment).
     - Filterable, searchable list of entities in that layer.
     - Each card: title, layer glyph, domain accent, brief subtitle.
     - Tap → full-screen panel sheet for that entity.
   - Panel sheet has back button (clears selection, returns to list).
   - Cross-references in panels work: tap a prereq → opens that entity's
     sheet (push onto a shallow back stack).

3. Above breakpoint: existing desktop layout unchanged.

4. Tests:
   - Layout swaps correctly at breakpoint.
   - List view renders all entities in selected layer.
   - Panel navigation (back stack) works without losing state.
   - Search + filters work in mobile too.
```

---

### Session 9 — Polish, audit, deploy

```
Phase 3b ship.

1. Audit pass:
   - Every entity has review_state: "published" (or is intentionally draft).
   - Every concept of type "law" or "principle" has applicability_conditions.
   - Every problem has a valid concept_path with all referenced concepts
     existing.
   - Every isomorphism edge is bidirectional in rendering and authored only
     once in JSON.
   - No orphan variables (every variable.json entity appears in at least
     one concept).
   - No console warnings.
   - All tests green.

2. Performance:
   - Graph with ~50 concepts + ~120 problems + ~24 labs + ~20 experiments +
     N variables = ~250 entities.
   - Verify React Flow performance is acceptable. If lag, lazy-render
     entities outside viewport.

3. README:
   - Updated phase status.
   - Updated content snapshot.
   - Authoring + review checklist visible.
   - Contributor list.

4. Deploy to Vercel.
   - Smoke test: search, permalinks, layer toggles, principle-application
     path view, mobile layout, all panels, draft + ta URL params.
   - Provide live URL.

Do not implement Phase 4 features (backend, accounts, Canvas LTI,
analytics, AI tutor).
```

---

## Notes for Cursor

- **Sessions 4, 5, 6 are content-dominated.** Engineering reviewers should not block on volume of new entities; pedagogical reviewers should. The right reviewer for the bulk of 3b is a physicist, not a software engineer.
- **The principle-application path view in Session 5 is the marquee feature.** Do not let it become a polish item. It is the operationalization of the entire Phase 3b thesis.
- **Isomorphism edges are author-sparse on purpose.** Resist the temptation to add 50 of them. The first 6–8 chosen ones carry the unifying message; over-authoring dilutes it.
- **TA collaboration on lab content (Session 6) needs out-of-band coordination.** Establish review cadence before authoring; don't let drafts pile up unreviewed.
- **fuse.js is the only new runtime dep.** Justify in PR. No other deps without flagging.
- **Mobile is a real interaction model, not a fallback.** The list view should feel deliberate, not apologetic.
- **review_state hygiene matters more as content scales.** Random sampling of "published" entities for the review checklist is a reasonable QA practice once node count exceeds ~100.
- **Phase 3b ends with the artifact ready for institutional pilot.** Phase 4's account / LTI work begins on a corpus that has already been used by a real cohort. That's the right sequencing.
