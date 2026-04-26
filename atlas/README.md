# Atlas

Atlas is an interactive physics knowledge map built with React Flow and KaTeX.  
Phase 3A evolves Atlas from a concept-only graph into a multi-layer entity graph where concepts and variables are first-class nodes with cross-layer edges.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Flow
- KaTeX
- d3-force
- Vitest

No backend is used in Phase 3A. Persistence is localStorage-only.

## Data Model

### Layer Architecture

Layer definitions live in `src/data/layers.js`.

- Active in Phase 3A:
  - `concept`
  - `variable`
- Registered for later phases (not populated in 3A):
  - `problem`
  - `lab`
  - `experiment`

Each entity in Atlas includes a `layer` field and is validated by the schema validator assigned to that layer.

### Entity Files

- Concepts: `src/data/concepts/*.json` (one file per domain)
- Variables: `src/data/variables.json`

Runtime helpers in `src/data/index.js`:

- `getAllEntities()`
- `getEntitiesByLayer(layerName)`
- `computeAppearsIn(variables, concepts)` (reverse-derived map from variable ID to concept IDs)

`appears_in` is not authored directly in variable JSON. It is computed from concept variable references.

### Authoring Metadata Lifecycle

All entities include authoring metadata:

- `author` (required, non-empty string)
- `review_state` (required): `draft | reviewed | published`
- `last_reviewed` (optional): ISO date `YYYY-MM-DD` or omitted/null

Default runtime rendering shows only `published` entities.

Use `?include=draft` in the URL to include `draft` and `reviewed` content for contributor review.  
When enabled, Atlas shows the banner text: `Showing draft content`.

## Understanding Scale

Atlas tracks understanding with an enum (not a boolean):

- `unseen`
- `seen`
- `recognize`
- `apply`
- `derive`

State is stored under localStorage key `atlas_understanding_v2` as an object map:

```json
{
  "entity-id": "apply"
}
```

Migration from legacy `atlas_understood_v1` is handled in `src/lib/understanding.js`.

## Edge Model

Edges are derived in `src/data/edges.js`:

- Concept prerequisite edges (`foundational`, `supporting`, `lateral`, `definitional`)
- Cross-layer `uses-variable` edges generated from concept `variables[]` references

Edge IDs use:

```text
${source}__${type}__${target}
```

## Authoring Conventions

- Add or edit content in JSON source files under `src/data/`.
- Keep variable IDs stable and kebab-case.
- For concept `type` of `law` or `principle`, include at least one `applicability_conditions` entry.
- Keep `review_state` accurate through the lifecycle:
  - new/incomplete work: `draft`
  - validated by reviewer/TA: `reviewed`
  - ready for student-facing default graph: `published`

## Development

From `atlas/`:

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run test
npm run lint
```
