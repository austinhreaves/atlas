# Atlas — Neighbor Discovery, ZPD Rank-Ordering & Collapsed State Indicators

> This is a phase-agnostic addendum. Requirements are self-contained.
> Cursor: read this document in full before implementing any part of it.
> Phase placement resolved — see Interaction with Understanding State section.

---

## Concept

When a student selects a concept node, the detail panel surfaces connected
entities from other layers (problems, labs, experiments) as a rank-ordered list,
sorted by how actionable each item is given the student's current understanding
state. No dynamic layout recomputation occurs — the graph layout is stable and
fixed at session load. "Zoom" is a viewport move, not a layout event.

Concept nodes passively display a faint halo and count badge when they have
connected content in off-layers, giving students a legible signal of depth before
they click.

ZPD spatial encoding — where orbital distance in the graph encodes prerequisite
distance from the student's current state — is an explicitly deferred feature.
The rank-order list delivers the same pedagogical signal through a simpler
mechanism. Spatial encoding is worth revisiting when content density (problems
per concept, variance in prerequisite depth) justifies the added layout
complexity.

---

## Layout Model

All entities — concepts, variables, problems, labs, experiments — have their
positions computed once at session load by the force layout. Problem, lab, and
experiment nodes are not rendered in the graph by default (their layers are
globally off). Their positions are computed and cached but they are not mounted
as React Flow nodes until their layer is toggled on globally or until they are
surfaced via the panel list.

This means:
- No layout recomputation when a student selects a node or browses panel content.
- No ephemeral node materialization or retraction animations in the graph canvas.
- Viewport panning/zooming is the only spatial change triggered by interaction.

The layout cache key must include the full entity-id-set across all layers so
that cached positions remain valid when layers are toggled on.

---

## Panel: Rank-Ordered Neighbor List

When a concept node is selected, the detail panel gains a **Nearby** section
below the existing content sections. It lists connected entities from off-layers,
grouped by layer type (Problems, Labs, Experiments), and sorted within each group
by ZPD rank.

### ZPD Rank Formula

```
unmet_prereqs(item) =
  count of concept IDs in item.concept_path
  whose understanding state < "recognize",
  excluding the currently-selected concept itself
```

Items with fewer unmet prerequisites sort to the top. Within the same unmet
count, sort alphabetically by title as a stable tiebreaker.

For items without a `concept_path` (e.g., labs linked directly to a concept
without an ordered traversal), treat `unmet_prereqs` as 0 and surface them at
the top of their group. Do not omit them.

### List item display

Each row shows:
- Layer shape glyph (■ problem, ⬡ lab, ◉ experiment) + item title.
- Difficulty badge (problems only, numeric 1–5).
- Unmet prereq count if > 0: a muted label such as "2 concepts to revisit."
- Clicking a row selects that entity, opens its detail panel, and pans the
  viewport to its position in the graph (if its layer is globally on) or
  highlights it in the list only (if layer is off).

### Section visibility

The Nearby section renders only if at least one connected entity exists across
any off-layer. If all connected layers are empty, the section is omitted
entirely — no empty state chrome.

---

## Collapsed State: Halo + Count Badge

Concept nodes passively indicate latent content depth at all times, regardless
of selection state.

### Halo

- A faint outer ring rendered just outside the node border.
- Color: neutral slate — does not inherit domain color, to avoid conflicting
  with the domain color encoding.
- Opacity: ~0.25–0.35. Present on inspection, not attention-grabbing.
- Renders whenever the node has at least one connected entity in any off-layer,
  regardless of selection state.
- Does not render if all connected layers have zero authored entities (registry
  presence alone does not trigger the halo).

### Count badge

- A small pill badge at the upper-right of the node, consistent position across
  all concept nodes.
- Content: total count of connected entities across all off-layers with at least
  one authored entity.
- Visible on hover or selection only — not ambient, to avoid visual noise at
  graph scale.
- On hover/select: badge expands inline to a per-layer breakdown using layer
  shape glyphs and counts. Example: ■3 ⬡1 (three problems, one lab).
  Use glyphs from the LAYERS registry — do not hardcode.

---

## Principle-Application Path Highlighting

When a problem entity is selected (from the panel list or directly in the graph
if its layer is on), the graph highlights the `concept_path` traversal:

- Each concept node in the path receives a distinct highlight stroke (a
  dedicated path color, e.g., amber — not domain color).
- Edges between consecutive concepts in the path are temporarily bolded.
- Highlight persists while the problem is selected; clears on deselect.

This makes the cross-concept traversal that a problem requires spatially legible
before the student commits to it — the "jump across galactic arms" is shown on
the map.

Implementation authority: this path-highlighting behavior is canonically
specified in `ATLAS_PHASE3B_SPEC.md` Session 5 ("Problem layer content +
principle-application path view"). This document serves as a UX addendum.

---

## Interaction with Understanding State

The rank order in the Nearby panel is live: if the student updates their
understanding state while the panel is open, the list re-sorts. Items can move
up as prerequisites are marked met.

This is the core feedback loop in list form: the panel visibly reorganizes around
the student's self-reported mastery without touching the graph layout.

### Phase placement decision

- Nearby and halo/badge land in Phase 3b.
- A stub Nearby (problems-only, unranked) may ship with 3b Session 1 once
  `applies` edges exist.
- Full ZPD ranking depends on graduated understanding state from 3a Session 6.
- Principle-application path highlighting ships with 3b Session 5.

---

## What This Is Not

- The graph layout does **not** recompute when a student selects a node,
  browses the panel, or updates understanding state.
- This is **not** a separate zoom mode. Viewport changes are camera moves only.
- This is **not** a recommendation engine. The rank formula is deterministic and
  transparent; the student can see exactly why an item is ranked where it is.
- This is **not** a replacement for the layer toggle. The toggle is global ("show
  all problems everywhere in the graph"). The Nearby panel is local ("show what's
  connected to this node, ranked for me"). Both can coexist without conflict.

---

## ZPD Spatial Encoding — Deferred

Spatial encoding of ZPD distance (orbital distance from concept node reflects
unmet prerequisite count) is a deliberate future feature, not a current
requirement.

**Why deferred:** the rank-order list delivers equivalent pedagogical signal
without dynamic layout complexity. Spatial encoding earns its cost when content
is dense enough that visual distance carries more information than a sorted list
— roughly, when a concept node has 8+ connected problems with meaningful variance
in prerequisite depth. That threshold is not met in Phase 3a or early Phase 3b.

**What to preserve for later:** the `unmet_prereqs` formula defined above is the
same formula that would drive orbital band assignment. Implementing the rank-order
list now does not foreclose spatial encoding later — the computation is identical,
only the presentation changes.

---

## Resolved Decisions

1. **Nearby section cap**: use a capped list with progressive disclosure.
   Show top 5 ranked items per group by default, with "Show N more."

2. **Badge count scope**: count only connected authored entities.
   Registry presence alone does not trigger halo/badge.

3. **Viewport pan on panel row click**: when target layer is globally off,
   open/select in panel only; do not pan viewport.
