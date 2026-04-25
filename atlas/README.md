# Atlas

Atlas is an interactive dark-theme knowledge graph for foundational physics concepts, visualizing mechanics and electromagnetism nodes with connected relationships, equation-focused detail panels, and embedded visual scenes to support concept exploration in a single React Flow canvas.

## Phase 3A (Session 1)

Phase 3A Session 1 introduces schema v3 infrastructure for a multi-layer graph engine.

- Schema v3 validator surface:
  - `validateConceptNode()` for concept-layer entities
  - `validateVariableNode()` for variable-layer entities
  - `validateEntity()` dispatches by `entity.layer`
- Concept schema additions (validator-enforced):
  - required: `layer`, `principle`, `author`, `review_state`
  - optional: `applicability_conditions`, `limiting_cases`, `misconceptions`, `historical_context`, `geometries`, `last_reviewed`
  - `law` and `principle` concepts must provide at least one `applicability_conditions` entry
- Variable schema (new entity type):
  - required: `id`, `layer`, `canonical_symbol`, `name`, `unit`, `dimension`, `description`, `vector_or_scalar`, `author`, `review_state`
  - optional: `sign_convention`, `common_aliases`, `tags`, `last_reviewed`
- Layer registry:
  - `src/data/layers.js` defines `concept`, `variable`, `problem`, `lab`, `experiment`
  - only `concept` and `variable` are validator-wired in Session 1
- Edge derivation:
  - `buildEdges(entities)` now accepts the full entity array
  - concept prerequisites remain directed typed edges
  - concept variable references auto-generate `uses-variable` edges
  - edge ids use `${source}__${type}__${target}`

## Phase 3A (Session 2)

Session 2 migrates authored data to the new multi-layer model.

- Data files:
  - concepts now live in `src/data/concepts.json` (replacing `nodes.json`)
  - variable entities live in `src/data/variables.json`
- Runtime data helpers (`src/data/index.js`):
  - `getAllEntities()`
  - `getEntitiesByLayer(layerName)`
  - `computeAppearsIn(variables, concepts)` reverse index
- Integrity guarantees (enforced by tests):
  - every concept and variable passes `validateEntity`
  - every concept variable reference resolves to an existing variable entity
  - every variable appears in at least one concept (no orphans in 3A)
  - every `law`/`principle` concept includes `applicability_conditions`
  - `buildEdges(getAllEntities())` yields prerequisite + `uses-variable` edges without strict-mode errors

## KaTeX Rendering Safety

- Node formulas are rendered through `src/components/KatexText.jsx`.
- This is safe for the current app because formulas come from trusted `concepts.json` content.
- If formulas ever become user-generated input, route them through the Phase 4 hardening path documented in `KatexText.jsx`.
