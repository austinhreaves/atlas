# Atlas

Atlas is an interactive dark-theme knowledge graph for foundational physics concepts, visualizing mechanics and electromagnetism nodes with connected relationships, equation-focused detail panels, and embedded visual scenes to support concept exploration in a single React Flow canvas.

## Phase 2

Phase 2 turns Atlas into a weighted, directed concept graph with deterministic force layout and student-progress frontier cues.

- Schema v2 data model:
  - `prerequisites[]` replaces flat `connections[]`
  - typed and weighted directed dependency edges (`foundational`, `supporting`, `lateral`)
  - role-aware variables and causal structure per node
  - `idealizations[]` with scope values (`idealized`, `noted`, `primary`)
- Force-directed layout:
  - deterministic `d3-force` simulation
  - cached positions in localStorage (`atlas_layout_v1`)
  - pinned nodes supported via `position.pinned`
- Edge rendering:
  - weighted/typed/directed visual mapping
  - floating edge handles anchored to nearest node border point
- Detail panel:
  - role-aware variable presentation
  - simplifying assumptions section
- Understanding state:
  - localStorage-backed understanding tracking (`atlas_understood_v1`)
  - understood-node dimming/check indicators
  - foundational frontier pulse into unknown concepts

## KaTeX Rendering Safety

- Node formulas are rendered directly with `katex.renderToString(...)` in `NodePanel`.
- The rendered HTML is injected with `dangerouslySetInnerHTML` to display KaTeX output.
- This is safe for the current app because formulas come from trusted `nodes.json` content.
- If formulas ever become user-generated input, sanitize or strictly validate input before rendering.
