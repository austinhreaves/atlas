# Cursor prompt — Hover cards (node + edge) + zoom-stable labels

You are implementing two related Atlas UX improvements in a single PR. **Read the cited spec sections in full before writing any code**, and confirm your file plan against the architecture below before starting.

Cited specs you must read first:
- `ATLAS_NODE_AFFORDANCES_SPEC.md` — entire file, with particular attention to Move 3 (hover-peek card overlay).
- `ATLAS_REVEAL_NEIGHBORS_SPEC.md` §"What This Is Not" — the `hover ≠ select` rule.
- `ATLAS_MAIN_SPEC.md` §"Visual encoding budget".
- `ATLAS_UX_IMPROVEMENTS_SPEC.md` §"Session 5 — Edge hover tooltips" — context for what is being replaced.
- `ATLAS_LAYOUT_AUTHORING_SPEC.md` — relevant sections on drag interactions (hover must suppress during drag).

---

## Goal

Solve the "I am zoomed out and I cannot tell which node is which" problem with two complementary affordances that ship together because they share viewport plumbing:

1. **Instant hover cards** for both concept nodes and edges. The current SVG `<title>` tooltip on edges has a multi-hundred-millisecond OS-default delay that makes the affordance feel broken. Replace it with React-controlled, instantly-rendered, stylized overlays. Add an analogous overlay for node hover. Both share state.
2. **Zoom-stable node labels.** Below a configurable zoom threshold, node labels stop scaling with the node circle and instead render at a fixed screen-pixel size, so labels remain readable when zoomed far out.

---

## Inherited constraints (do not violate)

- **Layer = shape, domain = color, size = mass, saturation = understanding, stroke = edge type.** Hover cards must not introduce a new visual channel that competes with these.
- **Hover ≠ select.** Hovering a node MUST NOT mutate `selectedNodeId`, MUST NOT alter focal/neighbor/distant emphasis, MUST NOT open or close the detail panel.
- **Hover suppresses during drag.** When a node drag is in progress, the hover overlay is hidden.
- **Mobile has no hover.** On touch devices (`isMobile === true`), the overlay never renders.
- **`ATLAS_NODE_AFFORDANCES_SPEC.md` Move 3 is the floor for the node-side card.** Read its contract; this prompt extends it with edge cards and the explicit shared-state architecture below.

---

## Architecture

### 1. Shared hover state at App level

In `atlas/src/App.jsx`:

```js
const [hoveredEntity, setHoveredEntity] = useState(null)
// Shape:
//   { kind: 'node', id: string, screenX: number, screenY: number }
//   { kind: 'edge', id: string, screenX: number, screenY: number }
//   null
```

Pass `hoveredEntity` and a stable `handleSetHover` callback down through `GraphCanvas` to `ConceptNode`, `VariableNode`, and `FloatingEdge`. **One state, one card visible at a time.** This prevents competing tooltips when grazing an edge near a node.

Hover state is cleared when:
- Cursor leaves the entity (`onMouseLeave`).
- A node drag begins (`onNodeDragStart` in `GraphCanvas.jsx`).
- The viewport pans or zooms (the cached screen coordinates are now stale; let the user re-hover to refresh).

### 2. Portaled overlay layer

Create `atlas/src/components/HoverCardOverlay.jsx`. Render it as a **sibling of `<ReactFlow>`** inside `GraphCanvas` (not as a React Flow node — that would inherit zoom transforms and clip behavior we do not want). Position it absolutely in screen pixels via `position: fixed` or `position: absolute` against the canvas container.

Reads `hoveredEntity` and renders one of two card variants:

**Node card (concept layer):**
- Title (large, KaTeX-rendered if symbolic).
- Domain label (plain text below title).
- Formula if present (KaTeX, prominent).
- One-line principle if available (truncated).
- Width 280–320px. Anchored above the node by default; flips below if too close to the top edge of the viewport.

**Node card (variable layer):**
- Symbol (large, KaTeX) and name.
- Dimension if present.
- Width 220–260px. Same flip behavior.

**Edge card:**
- Edge type label (use the existing `getEdgeTypeLabel` from `FloatingEdge.jsx`; do not duplicate the mapping).
- Source title → arrow → target title.
- The new authored `rationale` field if present (see schema addition below). When absent, render only the type and endpoints.
- Width 240–300px. Anchored at the edge midpoint with the same flip-on-edge logic.

Both cards reuse existing chrome styling: `rounded-xl border border-slate-700/70 bg-slate-900/90 shadow-xl shadow-black/40 backdrop-blur-sm`. Match the visual weight of `DomainFilterPanel`.

### 3. Edge schema addition: `rationale`

Add an optional `rationale: string` field on prerequisite entries:

```json
"prerequisites": [
  {
    "id": "newtons-second-law",
    "type": "foundational",
    "weight": 0.9,
    "rationale": "Free-body analysis is a direct application of F = ma to bodies in equilibrium or under constraint."
  }
]
```

- Schema-additive; `rationale` is optional. When absent, the edge card simply omits the rationale paragraph.
- Update `atlas/src/data/edges.js` (`buildEdges`) to thread the field through onto each edge object's `data` property.
- Update the concept validator to accept `rationale: string` on prerequisite entries; do not yet require it.
- No content migration is required by this PR. Authored rationales can be added incrementally per concept.

### 4. Hover instrumentation on nodes

In `ConceptNode.jsx` and `VariableNode.jsx`:

- Add `onMouseEnter` / `onMouseLeave` handlers on the outermost node element.
- On enter: call `handleSetHover({ kind: 'node', id, screenX: event.clientX, screenY: event.clientY })`. The screen coordinates anchor the card.
- On leave: call `handleSetHover(null)`.
- Suppress hover when a drag is in progress on this node (read from React Flow's drag state via `useStore` or via a prop threaded from `GraphCanvas`).

### 5. Hover instrumentation on edges

In `FloatingEdge.jsx`:

- Add a near-invisible thicker hit-area `<path>` rendered behind the visible edge: `stroke="transparent"`, `strokeWidth={12}`, `pointerEvents="stroke"`. Edges are only 1–4 px wide in normal rendering and native SVG hover targeting at that width is unreliable.
- Wire `onMouseEnter` / `onMouseLeave` on the hit-area path. Capture client coordinates from the event.
- **Remove the existing `<title>` element** from the edge `<g>`. The portaled card replaces it.
- For accessibility, add an `aria-label={edgeLabel}` on the visible `<BaseEdge>` path.

---

## Zoom-stable labels

In `ConceptNode.jsx` (and analogously `VariableNode.jsx`):

- Subscribe to viewport zoom via React Flow's store: `const zoom = useStore(state => state.transform[2])`. This pattern is already in use in `FloatingEdge.jsx`.
- Define module-level constants:
  - `LABEL_PIN_ZOOM = 0.6` — below this zoom level, counter-scale the label.
  - `LABEL_MAX_ZOOM = 1.5` — above this zoom level, also do not counter-scale (let labels grow with the node when zoomed in; that is intentional).
- Counter-scaling: when `zoom < LABEL_PIN_ZOOM`, apply `transform: scale(${1 / zoom})` to the label container with `transform-origin: center`. The node circle continues to scale normally; only the label is counter-scaled, keeping its rendered screen-pixel size approximately constant as the user zooms out.
- The label remains anchored to the node center.
- Above `LABEL_PIN_ZOOM` and below `LABEL_MAX_ZOOM`, behavior is unchanged from today.

Counter-scaled labels can overlap each other when zoomed far out. **That is acceptable for this PR.** Collision avoidance is a follow-up. Note this explicitly in the test file as known-fine behavior.

---

## File footprint

- `atlas/src/App.jsx` — `hoveredEntity` state, `handleSetHover` callback, prop threading.
- `atlas/src/components/GraphCanvas.jsx` — accept and forward hover props, render `HoverCardOverlay` as sibling of `<ReactFlow>`, suppress during drag.
- `atlas/src/components/HoverCardOverlay.jsx` — **new file**.
- `atlas/src/components/FloatingEdge.jsx` — add hit-area overlay path, hover handlers, remove `<title>`, add `aria-label`.
- `atlas/src/components/nodes/ConceptNode.jsx` — hover handlers, zoom-stable label logic.
- `atlas/src/components/nodes/VariableNode.jsx` — same.
- `atlas/src/data/edges.js` — pass `rationale` through `buildEdges`.
- `atlas/src/lib/validators/concept.js` (or wherever the prerequisite validator lives) — accept optional `rationale`.
- `atlas/src/components/__tests__/HoverCardOverlay.test.jsx` — **new**.
- `atlas/src/components/__tests__/FloatingEdge.test.jsx` — extend.
- `atlas/src/components/__tests__/GraphCanvas.test.jsx` — extend.
- `atlas/src/__tests__/App.visibility.test.jsx` — extend with hover-state plumbing tests.

---

## Acceptance criteria

1. Hovering a concept node produces a card within ~16 ms (one frame), not after an OS-default delay.
2. Hovering an edge produces a card within ~16 ms.
3. Hovering one entity, then immediately another, swaps the card content without any flash of empty state.
4. Starting a node drag clears any active hover card.
5. Hovering a node does NOT change `selectedNodeId`, panel state, or focal-emphasis styling.
6. At zoom 0.3, concept node labels are readable (≥ 11 screen pixels), centered on their nodes.
7. At zoom 1.0, labels render unchanged from current behavior.
8. At zoom 1.6 (above `LABEL_MAX_ZOOM`), labels grow with the node as they do today.
9. An edge with no `rationale` field still hovers correctly; the card shows only the edge type label and source/target titles.
10. The existing `getEdgeTypeLabel` function and its mapping table are reused, not duplicated.
11. Mobile (`isMobile === true`): no hover overlay renders. Existing tap → select behavior unchanged.
12. No regression in `App.visibility.test.jsx`, `GraphCanvas.test.jsx`, `FloatingEdge.test.jsx`, or any other existing test.

---

## Out of scope (do not implement)

- Mobile/touch hover equivalents. Touch devices have no hover; the overlay simply never renders on mobile.
- AND-style multi-hover (e.g., "show paths between hovered nodes"). One entity at a time.
- Label collision avoidance at low zoom.
- Animated card enter/exit. **Instant on/off only.** Animation will mask perceived latency rather than eliminate it.
- Pinning a hover card open (turning it into a quasi-selection). Hover is hover; selection is selection.
- Variable-node hover-peek beyond what `ATLAS_NODE_AFFORDANCES_SPEC.md` already implies. If unclear, ship the minimal symbol+name+dimension card and flag it for follow-up.

---

## Test discipline

Every new component or substantive change ships with at least one test. Test names describe behavior, not implementation. Use existing `GraphCanvas.test.jsx` and `FloatingEdge.test.jsx` as models. Do not stub out the React Flow viewport bridge unless absolutely necessary; the existing tests show how to render with the provider intact.

---

## Commit hygiene

One commit per substantive concern, in this order:

1. `feat(schema): add optional rationale to prerequisite entries`
2. `feat(hover): shared hoveredEntity state at App level`
3. `feat(hover): HoverCardOverlay component (node + edge variants)`
4. `feat(hover): instant hover instrumentation on nodes and edges`
5. `feat(zoom): zoom-stable node labels below LABEL_PIN_ZOOM`
6. `test: hover and zoom-label coverage`

Squash-merge or rebase-merge to main, your call, but keep the commit boundaries on the branch so a later bisect can land on a meaningful boundary.
