# Atlas Phase 3a — Multi-Layer Foundation & Cursor Build Plan

> Phase 3a is the architectural lift. Atlas generalizes from a *concept graph* into a *multi-layer graph engine*. Variables ship as the first activated additional layer; Phase 3b populates the rest (problems, labs, experiments) on top of this foundation.

---

## Scope summary

Phase 3a converts every "concept-specific" assumption in the codebase into a generic "layer-aware" implementation, then activates the variable layer as the first new layer. Concept nodes also gain principle-application properties (applicability conditions, limiting cases, misconceptions). Understanding state moves from binary checkbox to a graduated 4-state scale.

### In scope

- Schema v3: layer abstraction, variable entities as first-class addressable nodes, cross-layer edges.
- Migration of 10 existing concept nodes to v3 with stable variable IDs.
- Layer-aware rendering: per-layer shape, color discipline, visual treatment.
- Layer toggle UI (default: concepts only).
- Cross-layer edges with their own type vocabulary (`uses-variable`, `defines-variable`, etc.).
- Mass formula upgrade: weighted in/out blend.
- Concept-layer property additions:
  - `applicability_conditions` (required on laws and principles)
  - `limiting_cases` (optional but encouraged on laws)
  - `misconceptions` (optional but encouraged)
  - `historical_context` (optional, flavor)
  - `geometries` (tag-style, multi-valued)
- Variable layer activation: variable detail panel, "appears in" cross-references.
- Graduated understanding scale: `unseen | seen | recognize | apply | derive`.
- Authoring metadata in schema: `author`, `review_state`, `last_reviewed`.
- `?include=draft` URL param to expose draft entities.
- Full validator coverage and test suite for the above.

### Explicitly out of scope for Phase 3a

- Problem, lab, experiment layer **content** — Phase 3b. (Their *schemas* may be sketched; their content is not authored here.)
- Isomorphism and Noether-consequence edges — Phase 3b.
- Search, permalinks, mobile — Phase 3b.
- Authoring UI / CMS — schema-level metadata only in 3a.
- Backend, accounts, Canvas LTI — Phase 4.
- Assessment-driven understanding updates — Phase 4 via LTI. Graduated scale in 3a remains self-report.

---

## Schema v3

### Concept node example

```json
{
  "id": "ohms-law",
  "layer": "concept",
  "title": "Ohm's Law",
  "type": "law",
  "domain": "electromagnetism",
  "formula": "V = IR",
  "causal_structure": "asymmetric",
  "principle": "For ohmic conductors, current is linearly proportional to applied voltage; the proportionality constant (resistance) characterizes the conductor.",
  "applicability_conditions": [
    "Conductor is ohmic (linear V-I relationship)",
    "Temperature is approximately constant",
    "Steady-state current (no rapid transients)"
  ],
  "limiting_cases": [
    { "case": "R → 0", "result": "ideal conductor / short circuit; V → 0 for any finite I" },
    { "case": "R → ∞", "result": "ideal insulator / open circuit; I → 0 for any finite V" }
  ],
  "misconceptions": [
    {
      "wrong_model": "Current is 'used up' by resistors.",
      "correction": "Current is conserved through a series element. Resistors dissipate energy (as heat), not charge."
    },
    {
      "wrong_model": "Voltage flows through a circuit.",
      "correction": "Voltage is a potential difference between two points. Current flows; voltage exists across."
    }
  ],
  "historical_context": "Georg Ohm published the relationship in 1827; initially controversial, accepted after independent verification.",
  "geometries": [],
  "variables": [
    { "id": "voltage", "symbol": "V", "role": "driver", "name": "Applied voltage", "unit": "V" },
    { "id": "current", "symbol": "I", "role": "response", "name": "Current", "unit": "A" },
    { "id": "resistance", "symbol": "R", "role": "parameter", "name": "Resistance", "unit": "Ω" }
  ],
  "covariates": [
    { "name": "Temperature", "scope": "ignored", "note": "R varies with T; assumed constant for ohmic conductors at room temperature" }
  ],
  "description": "Plain-language conceptual explanation...",
  "prerequisites": [
    { "id": "electric-field", "type": "foundational", "weight": 0.9 },
    { "id": "coulombs-law",   "type": "lateral",      "weight": 0.2 }
  ],
  "mass": null,
  "visual": {
    "type": "phet",
    "url": "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html",
    "caption": "Build circuits and observe Ohm's Law."
  },
  "tags": ["electromagnetism", "circuits", "resistance"],
  "position": null,
  "author": "austin",
  "review_state": "published",
  "last_reviewed": "2026-04-15"
}
```

Note: `variables[]` no longer requires `description` per-occurrence — descriptive content lives on the variable entity itself (see below). The per-occurrence object now carries only what's specific to *this concept's use of the variable*: `id`, `symbol`, `role`, optionally `name` and `unit` overrides if context demands.

### Variable entity example (new in v3)

```json
{
  "id": "current",
  "layer": "variable",
  "canonical_symbol": "I",
  "name": "Electric current",
  "unit": "A",
  "dimension": "[charge]/[time]",
  "description": "The rate of charge flow through a surface or cross-section.",
  "vector_or_scalar": "scalar",
  "sign_convention": "Conventional current: direction of positive charge flow.",
  "common_aliases": [
    { "symbol": "i", "context": "AC analysis (time-varying)" },
    { "symbol": "j", "context": "current density per unit area" }
  ],
  "appears_in": [],
  "tags": ["electromagnetism", "transport"],
  "author": "austin",
  "review_state": "published",
  "last_reviewed": "2026-04-15"
}
```

`appears_in` is computed at runtime from concept nodes that reference this variable's `id`. It is not authored.

### Layer registry

Each entity carries a `layer` field. The layer registry (`src/data/layers.js`) declares the known layers and their visual treatment:

```js
export const LAYERS = {
  concept: {
    shape: "circle",
    default_visible: true,
    schema_validator: validateConceptNode,
  },
  variable: {
    shape: "diamond",
    default_visible: false,
    schema_validator: validateVariableNode,
  },
  problem: {     // Phase 3b activation
    shape: "square",
    default_visible: false,
    schema_validator: null,  // not implemented in 3a
  },
  lab: {         // Phase 3b activation
    shape: "hexagon",
    default_visible: false,
    schema_validator: null,
  },
  experiment: {  // Phase 3b activation
    shape: "octagon",
    default_visible: false,
    schema_validator: null,
  },
};
```

Phase 3a registers all five layers but only activates `concept` and `variable`. Other layers' shapes and toggles exist but their content arrays are empty.

### Edges in v3

Edges gain a `layer_pair` derived field for convenience and become more general:

- **Within-concept edges**: existing prerequisite edges from Phase 2 (`foundational | supporting | lateral | definitional`).
- **Cross-layer edges (new)**:
  - `concept → variable`: type `uses-variable`. Auto-generated from concept's `variables[]`.
  - `variable → variable`: type `equivalent-to` (e.g., velocity in two notations) — optional, sparse, hand-authored.
- Phase 3b will add `problem → concept` (type `applies`), `lab → concept` (type `instantiates`), `experiment → concept` (type `establishes`), and `concept ↔ concept` types `isomorphic` and `noether-consequence`.

Edge IDs become `${source}__${type}__${target}` to allow multiple edge types between the same pair across layers.

### Authoring metadata

Every entity (concept, variable, and future layers) carries:

- `author`: string, free-form (will become user-id-bound in Phase 4).
- `review_state`: `"draft" | "reviewed" | "published"`. Default `"draft"` for new entities.
- `last_reviewed`: ISO date string or null.

Default rendering filters to `review_state === "published"`. URL parameter `?include=draft` includes draft and reviewed states. This gives TAs and contributors a way to see in-progress entities without polluting the public graph.

### Mass formula update

```js
function computeMass(node, edges) {
  if (node.mass !== null) return node.mass;
  const out_foundational = edges.filter(e => e.source === node.id && e.type === "foundational").length;
  const in_foundational  = edges.filter(e => e.target === node.id && e.type === "foundational").length;
  const mass = 1.0 + 0.5 * out_foundational + 0.2 * in_foundational;
  return Math.min(mass, 3.0);
}
```

Variables get a separate, simpler mass: `1.0 + 0.3 * appears_in.length`, capped at 2.5.

### Understanding scale

Replace boolean with enum:

```ts
type UnderstandingState = "unseen" | "seen" | "recognize" | "apply" | "derive";
```

Persistence still in localStorage under key `atlas_understanding_v2` (note version bump). Migration: existing `atlas_understood_v1` Set entries map to `"apply"` state; everything else is `"unseen"`.

Visual mapping:

- `unseen` — base rendering.
- `seen` — subtle dot indicator, no desaturation.
- `recognize` — small filled indicator, slight desaturation (~0.85).
- `apply` — clear indicator, moderate desaturation (~0.6).
- `derive` — full indicator, strong desaturation (~0.4) plus checkmark glyph.

Frontier visualization rule from Phase 2 updates: "frontier" = source has state ≥ `apply`, target has state ≤ `seen`, edge type is `foundational`.

---

## Stack additions

| Layer | Choice | Reason |
|---|---|---|
| Shape rendering | Custom React Flow node components per layer | No new dep needed |
| URL params | `URLSearchParams` (native) | No router yet |

No new runtime dependencies. d3-force, KaTeX, React Flow remain.

---

## Cursor Session Plan

Run sessions in order. Tests must be green before proceeding.

---

### Session 1 — Schema v3 layer abstraction & validators

```
Migrate Atlas to schema v3 with multi-layer support.

1. Create src/data/layers.js exporting the LAYERS registry as specified in
   ATLAS_PHASE3A_SPEC.md. Five entries: concept, variable, problem, lab,
   experiment. Only concept and variable have schema_validator set in this
   session.

2. Refactor src/data/schema.js:

   - Rename existing validateNode → validateConceptNode. Update it to v3:
     * Required new fields: layer (must be "concept"), principle (non-empty
       string), author, review_state.
     * Optional new fields: applicability_conditions, limiting_cases,
       misconceptions, historical_context, geometries, last_reviewed.
     * variables[] items: id is now REQUIRED (kebab-case), symbol/role required,
       name/unit optional (fall back to variable entity).
     * applicability_conditions: array of strings.
     * limiting_cases: array of { case: string, result: string }.
     * misconceptions: array of { wrong_model: string, correction: string }.
     * geometries: array of strings from a controlled vocabulary
       (cylindrical, spherical, planar, axial, none, other).
     * review_state: "draft" | "reviewed" | "published".
     * For nodes of type "law" or "principle", applicability_conditions must
       have at least one entry. (Equations, definitions, theorems may omit.)

   - Add validateVariableNode for variable entities:
     * Required: id (kebab-case), layer ("variable"), canonical_symbol, name,
       unit, dimension, description, vector_or_scalar, author, review_state.
     * Optional: sign_convention, common_aliases, tags, last_reviewed.
     * vector_or_scalar: "scalar" | "vector" | "tensor".
     * common_aliases: array of { symbol: string, context: string }.

   - Add validateEntity(entity) that dispatches on entity.layer to the right
     validator. Returns errors array.

3. Update src/data/edges.js:

   - buildEdges(entities) now operates on the full entity array regardless of
     layer.
   - Concept-level prerequisite edges work as before.
   - Auto-generate "uses-variable" edges: for every concept node, for every
     entry in variables[], emit { id, source: concept.id, target: variable.id,
     type: "uses-variable", weight: 0.5, layer_pair: "concept-variable" }.
   - Edge IDs become `${source}__${type}__${target}` so multiple edge types
     between the same pair are allowed.
   - Self-edges still rejected.
   - Cross-layer edges to variables that don't exist as entities should produce
     a validation error (raised by buildEdges in dev / test mode).

4. Update src/data/__tests__/:

   - Add tests for validateConceptNode covering all new fields and the
     law/principle applicability_conditions requirement.
   - Add tests for validateVariableNode.
   - Add tests for validateEntity dispatch.
   - Add tests for buildEdges:
     * uses-variable edges generated for every concept variable reference.
     * variables referenced but not present as entities raise validation errors.
     * Edge ID format includes type.

   Do not migrate node data yet — Session 2.
```

---

### Session 2 — Migrate 10 concept nodes & seed variable entities

```
Migrate Atlas data to schema v3.

1. Create src/data/variables.json:
   Author the variable entities for every distinct variable across the 10
   concept nodes. Expected canonical IDs include (non-exhaustive):
   force-net, mass, acceleration, velocity, time, position, momentum, energy,
   work, height, gravitational-acceleration, charge, voltage, current,
   resistance, electric-field, electric-flux, magnetic-flux, ...

   Each entity must pass validateVariableNode. Assign:
   - canonical_symbol: the most common notation (F, m, a, v, ...).
   - dimension: in [LMT] or [MLT2I] notation as appropriate.
   - vector_or_scalar: physically correct (force is vector, mass is scalar, ...).
   - sign_convention where meaningful (current, voltage, displacement).
   - description: 1–2 sentence physical meaning.
   - review_state: "published".
   - author: "austin".

2. Update src/data/nodes.json (rename to concepts.json for clarity):
   For each of the 10 nodes:
   - Add layer: "concept".
   - Add principle: one-sentence explanation of what the law claims, in plain
     language, before the equation.
   - Add applicability_conditions: required for laws and principles. Be
     pedagogically honest — Newton's 2nd applies in inertial frames at v << c
     and m >> atomic scale. Ohm's law applies for ohmic conductors at
     approximately constant temperature. Etc.
   - Add limiting_cases where pedagogically valuable (most laws).
   - Add misconceptions for at least these nodes: newtons-second, ohms-law,
     coulombs-law, gauss-law, conservation-of-momentum. (Others optional.)
   - Add historical_context where you have it; otherwise omit.
   - Add geometries where relevant ("spherical" for Coulomb's, Gauss's;
     "planar" for parallel plates if present; etc.). Empty array otherwise.
   - Update variables[]: each item must have a kebab-case id matching a
     variable entity in variables.json. Drop per-occurrence description (it
     lives on the entity now). Keep symbol, role, optional name/unit overrides.
   - Add author: "austin", review_state: "published",
     last_reviewed: today's date.

3. Update src/data/index.js (or wherever data is loaded):
   - Export getAllEntities() = [...concepts, ...variables].
   - Export getEntitiesByLayer(layerName).
   - Export computeAppearsIn(variables, concepts) returning a map
     { variableId: [conceptId, ...] } for use in the variable detail panel.

4. Tests:
   - All entities pass validateEntity.
   - Every variable referenced from a concept exists in variables.json.
   - Every variable in variables.json appears in at least one concept.
     (Reject orphans in 3a; we'll relax this in 3b if standalone variables
     become useful.)
   - Every law/principle has at least one applicability condition.
   - buildEdges(getAllEntities()) generates the expected count of
     prerequisite + uses-variable edges with no validation errors.

All tests must pass before Session 3.
```

---

### Session 3 — Layer-aware rendering & per-layer node shapes

```
Render entities differently by layer.

1. Create src/components/nodes/ConceptNode.jsx:
   - The existing custom node component, refactored. Circle shape (use SVG
     <circle> inside a foreignObject-wrapped Tailwind container, OR keep the
     existing div + border-radius: 50% approach). Domain → color via existing
     mapping. Mass-driven size from existing computeMass.

2. Create src/components/nodes/VariableNode.jsx:
   - Diamond shape (rotated square via CSS transform: rotate(45deg) on outer
     container; inner content counter-rotated). Default size 70px (smaller
     than concepts). Display canonical_symbol in KaTeX, name below.
   - Color: a single neutral "variable" color (slate or indigo) — variables
     do NOT inherit domain color, since variables span domains.

3. Update GraphCanvas:
   - nodeTypes = { concept: ConceptNode, variable: VariableNode }.
   - Map every entity to its React Flow node with type = entity.layer.

4. Floating edges (carry over from Phase 2's AtlasEdge / FloatingEdge):
   - Update the floating-handle nearest-border math to handle non-circular
     shapes correctly (diamond border intersection is different from circle).
     Acceptable approximation: treat diamond as inscribed circle for handle
     math in 3a. Refine in 3b if it looks bad.

5. Cross-layer edge styling (uses-variable):
   - Distinct from prerequisite edges. Suggested: thin dotted stroke, low
     opacity (~0.35), no arrowhead, neutral slate color. Visible enough to
     show the connection when variable layer is on, never dominant.

6. Manual test:
   - With variable layer toggle (Session 4) off, graph looks identical to
     Phase 2.
   - With variable layer on, diamond variable nodes appear, connected to
     their host concepts via thin dotted lines.
   - Pan/zoom/select still work for both node types.
```

---

### Session 4 — Layer toggle UI + domain legend

> **Pre-session state check.** Before starting, verify the following are
> already in place from Sessions 1–3 and NA-M1:
> - `src/data/layers.js` exports `LAYERS` with five entries (concept,
>   variable, problem, lab, experiment).
> - `src/components/nodes/ConceptNode.jsx` renders domain via border-style
>   only — no domain text inside the node. The `domainCardClass` map already
>   encodes `mechanics` as solid border, `electromagnetism` as dashed, others
>   as dotted fallback.
> - No `DomainLegend` component exists yet — it was deferred from NA-M1 and
>   ships here alongside the layer toggle bar so the two can share top-left
>   canvas real estate cleanly.

```
Add layer-toggle controls and the domain legend to Atlas.

1. Add layer visibility state to App.jsx:
   - visibleLayers: Set<string>, initialized from LAYERS registry's
     default_visible flags. (Phase 3a default: { "concept" }.)
   - Pass visibleLayers and a setVisibleLayers callback down to
     LayerToggleBar and GraphCanvas.

2. Create src/components/LayerToggleBar.jsx:
   - Renders one toggle per registered layer in LAYERS.
   - For layers without an active schema_validator (problem, lab, experiment
     in 3a), render the toggle disabled with a small "Phase 3b" badge.
   - Toggle includes the layer's shape glyph (circle for concept, diamond
     for variable) + label.
   - Position: top-left of canvas. LayerToggleBar and DomainLegend (below)
     stack vertically in this corner; keep them visually distinct but
     adjacent.

3. Create src/components/DomainLegend.jsx:
   - Derives the domain list from the currently visible concept entities
     (not hardcoded), so the legend stays accurate as the corpus grows.
   - One row per domain: color swatch + domain name + count of currently
     visible concepts in that domain.
   - The color swatch MUST match the fill/glow color used in ConceptNode's
     domainCardClass for that domain (cyan-500 for mechanics, violet-500 for
     electromagnetism, slate-500 for unknown/fallback).
   - The border-style secondary channel is shown on the swatch as well
     (solid / dashed / dotted border on the swatch itself), matching
     ConceptNode's per-domain border.
   - Collapsible (chevron toggle); defaults to expanded on first load.
   - Collapse state persists to localStorage under "atlas_legend_v1".
   - Position: top-left, directly below LayerToggleBar. Together they form
     a single control cluster.

4. Wire visibleLayers into GraphCanvas:
   - Filter entities to those whose layer is in visibleLayers.
   - Filter edges to those whose source and target are both in the visible
     entity set.

5. Persist visibleLayers to localStorage under "atlas_layers_v1" so reloads
   preserve the user's layer choices.

6. Domain filter and layer filter compose: an entity renders iff its layer
   is in visibleLayers AND (its domain is in the active domain filter OR it
   has no domain — variables have no domain). Variables are always shown
   when the variable layer is on, regardless of domain filter state.
   NOTE: If no domain filter UI exists yet, skip composition logic and leave
   a TODO comment. Do not create a domain filter UI in this session.

7. Tests:
   - visibleLayers round-trips through localStorage at "atlas_layers_v1".
   - DomainLegend collapse state round-trips through "atlas_legend_v1".
   - With only concept layer visible, the visible entity set contains the 10
     concept nodes and zero variable nodes; edge set matches the Phase 2
     prerequisite-only set.
   - With concept + variable visible, the visible entity set contains 10 +
     N_variables entities and includes uses-variable edges.
   - DomainLegend derives domain list dynamically: a test with a synthetic
     entity set (3 mechanics, 2 electromagnetism) renders 2 legend rows with
     correct counts.
   - T5 from ATLAS_NODE_AFFORDANCES_SPEC.md (lint test asserting ConceptNode
     does not render data.domain as text) should already pass; confirm it
     does and do not break it.

All tests must pass before Session 5.
```

---

### Session 5 — Variable detail panel

```
Add variable detail rendering to NodePanel.

1. Refactor NodePanel.jsx into a dispatcher:
   - If selectedEntity.layer === "concept", render ConceptPanel (the existing
     panel, extracted).
   - If selectedEntity.layer === "variable", render VariablePanel.

2. Create src/components/panels/VariablePanel.jsx:
   - Header: canonical_symbol in BlockMath + name.
   - Metadata block: unit, dimension, vector_or_scalar.
   - Description paragraph.
   - Sign convention (if present).
   - Common aliases table (if non-empty): symbol + context.
   - Appears In section: list of concepts that reference this variable.
     Each row clickable — selects that concept node, navigating focus.
     Group rows by domain. Sort by concept title within group.
   - Close button (existing onClose pattern).

3. Update ConceptPanel:
   - Add "Principle" block at the top, above the formula — the new principle
     field renders as a single emphasized sentence.
   - Add "Applies When" section rendering applicability_conditions as a
     bulleted list. Place between description and variables.
   - Add "Limiting Cases" section rendering limiting_cases as a small table.
     Place after applicability conditions.
   - Add "Common Misconceptions" section as expandable/collapsible (default
     collapsed) rendering misconceptions. Italicize wrong_model in muted red
     accent; correction in default text. Place near the bottom, before
     visual scene.
   - Add "Historical Context" section if present (collapsed by default).
   - Variable rows in the variable table become clickable: clicking navigates
     selection to that variable entity (opens VariablePanel).
   - Reserve a Nearby-section mount point for future off-layer discovery UI,
     but keep it hidden in 3a (problem/lab/experiment content is 3b).

4. Cross-panel navigation:
   - Clicking a variable row in ConceptPanel selects the variable entity.
   - Clicking a concept row in VariablePanel's "Appears In" selects that
     concept.
   - Selection state lives in App.jsx as before; both panels read selectedId
     and the corresponding entity from getAllEntities().

5. Manual test:
   - Click Newton's 2nd → ConceptPanel with principle, applicability, etc.
   - Click "F" in the variable table → VariablePanel for force-net entity,
     with Newton's 2nd in Appears In.
   - Click Newton's 2nd in Appears In → back to ConceptPanel for Newton's 2nd.
```

---

### Session 6 — Graduated understanding scale & frontier update

```
Replace binary understanding state with graduated 4-state scale.

1. Update src/lib/understanding.js:
   - State type: "unseen" | "seen" | "recognize" | "apply" | "derive".
   - Storage: localStorage key "atlas_understanding_v2", value
     { [entityId]: state }.
   - Migration: on load, if "atlas_understood_v1" exists and v2 doesn't,
     migrate every entry to "apply" and delete v1.
   - Export getState(id), setState(id, state), getAllStates().

2. Update ConceptPanel:
   - Replace checkbox with a 4-position segmented control (or radio group):
     Seen | Recognize | Apply | Derive. Plus an "Reset" affordance.
   - Selecting a state writes via setState and triggers GraphCanvas re-render.
   - Default state for an entity never touched: "unseen".
   - Expose understanding state via shared selectors/utilities so future
     concept-adjacent UI (for example, Nearby rank ordering in 3b) can consume
     the same state source without duplicating logic.

3. Update node rendering visuals per the spec table:
   - unseen: base.
   - seen: 2px filled dot top-right corner.
   - recognize: small filled circle indicator, saturate(0.85).
   - apply: larger indicator + saturate(0.6).
   - derive: full indicator + saturate(0.4) + checkmark glyph.

4. Update frontier edge highlighting:
   - Frontier rule: source state >= "apply" AND target state <= "seen" AND
     edge type === "foundational".
   - Existing pulse animation retained.

5. Variable entities also accept understanding state — students can mark a
   variable "apply" if they understand the symbol's meaning across contexts.
   Same visual mapping (with variable's diamond shape).

6. Tests:
   - State round-trips localStorage at v2 key.
   - v1 → v2 migration: pre-existing understood ids map to "apply".
   - getAllStates returns map keyed by id.
   - Frontier rule unit-tested with state combinations.

7. Manual test:
   - Set Newton's 2nd to "Apply"; outgoing foundational edges to unknown
     concepts pulse. Set to "Derive"; node further desaturates, edges still
     pulse. Set a previously-pulsing target to "Seen" — pulse stops (since
     target is no longer ≤ "seen"... wait, "seen" IS ≤ "seen" — pulse remains
     until target is >= recognize). Verify rule matches code.
```

---

### Session 7 — Authoring metadata, draft visibility, polish, deploy

```
Wrap Phase 3a.

1. Authoring metadata:
   - Validators enforce author + review_state + last_reviewed (last_reviewed
     optional but if set must be a valid ISO date).
   - GraphCanvas filters by review_state === "published" by default.
   - Read URL: if `?include=draft` is present, include draft + reviewed
     entities. Render a small banner at the top of the canvas: "Showing draft
     content" so contributors don't forget what they're looking at.
   - No edit UI in 3a — all authoring is JSON edits + PR.

2. README update:
   - Document the layer architecture, variable entity model, graduated
     understanding scale, and how to author new content (JSON file conventions
     + review state lifecycle).

3. Cleanup:
   - All tests green (npm test).
   - No console warnings or errors.
   - No dead Phase 2 code paths assuming binary understanding.
   - Verify domain filter + layer toggle + understanding scale + selection
     emphasis all compose correctly with no visual conflicts.

4. Visual polish:
   - Variable layer toggle on/off transition smooth (entities fade in/out;
     edges follow).
   - Diamond shape renders cleanly at all zoom levels.
   - Floating edges anchor correctly to diamond borders (or acceptable
     approximation per Session 3 note).
   - Cross-panel navigation feels instant, no stale state.

5. Deploy to Vercel.
   - Confirm build passes.
   - Provide live URL.
   - Smoke test the `?include=draft` parameter on the deployed site.

Do not implement Phase 3b features (problem/lab/experiment content,
isomorphism edges, search, permalinks, mobile).
```

---

## Notes for Cursor

- **Session 1 + 2 are the load-bearing wall.** The schema and migration must be airtight before any UI work begins. If migration of existing nodes uncovers schema gaps (e.g., a concept that resists `applicability_conditions`), raise it — do not silently relax validation.
- The variable entity authoring in Session 2 is content work, not infrastructure. Quality matters; a misclassified `vector_or_scalar` or a wrong dimension propagates everywhere.
- `applicability_conditions` is the most pedagogically important new field. It is the principle-application thesis made structural. Do not skip it for a node by claiming "it's obvious."
- `position` from Phase 2 is preserved as an optional pin. The layout cache key must include the full entity-id-set across all layers (layer-set may be included as a convenience), and must recompute whenever that id-set changes.
- Floating-edge math for non-circular shapes is a known tweak. If the diamond approximation looks bad at v0.3a, escalate to a full polygon-edge intersection routine — but not before 3b unless it's egregious.
- Reverse-derived `appears_in` is computed at runtime, never authored. Same pattern as Phase 2's `Enables`.
- All styling Tailwind. No new dependencies.
- Authoring metadata (`author`, `review_state`, `last_reviewed`) is the schema scaffolding for Phase 4's account-bound authorship. It does not need a UI in 3a — JSON + PR is fine.
- The graduated understanding scale is *self-report* in 3a. It will be supplemented by Canvas-LTI evidence in Phase 4. The schema does not need to know about that yet, but resist any temptation to overload "apply" with "passed a quiz" — that's a different signal type and gets its own field later.
