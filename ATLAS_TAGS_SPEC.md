# Atlas — Tags: Cross-Cutting Categorization

> Phase-agnostic addendum. Read in full before implementation.
> Phase placement: schema additions and filter UI MVP can ship at any time;
> URL-param integration overlaps with `ATLAS_UX_IMPROVEMENTS_SPEC.md`
> Session 6 and harmonizes with that work when it lands.
>
> Update note: Atlas now separates topical taxonomy from keyword tags.
> `sub_domains` are registry-backed topical filters on concepts; `tags` are keyword metadata.
> Domain remains the color channel.

---

## Problem statement

Atlas concepts live in a single canonical *domain* (mechanics, electromagnetism, thermodynamics, waves, optics, modern, math). Domain is the color channel and the load-bearing rule of the visual encoding budget (`ATLAS_MAIN_SPEC.md` §"Visual encoding budget"): **layer = shape, domain = color**.

But pedagogically, concepts cluster along axes that are not fundamental physics domains. "Orbital mechanics" is not a separate domain — it is an applied topic that draws on Newton's laws, central forces, conservation of angular momentum, and Kepler's laws. Same for "AC circuits", "thin lens systems", "rotational dynamics", "thermal radiation", "PHY 132 Lab 4". A student who wants to study orbital mechanics needs to see exactly that subset of the graph; a student studying mechanics writ large needs the parent set; both need the same Kepler-node, in the same color, at the same place in the layout.

Two approaches were considered and rejected:

1. **Multi-domain assignment.** Letting a concept belong to multiple domains forces a coloring decision (which domain wins?), burns or compounds the saturation channel currently used for understanding state, and lies about underlying structure: Kepler's laws is a mechanics concept that gets *applied to* orbital problems, not a concept that "is" two domains.
2. **Hierarchical sub-domains.** Inherits all of (1)'s coloring problems plus a tree-structure complexity that the rest of Atlas has carefully avoided. Atlas is a graph, not a tree.

The right answer is **tags**: an additive, registry-controlled vocabulary that groups entities along curricular or topical axes without consuming any visual channel. Tags are filters and panel labels, not colors.

---

## Design constraints inherited from the corpus

This spec MUST preserve:

- **Visual encoding budget** (`ATLAS_MAIN_SPEC.md` §"Visual encoding budget"). Tags do not consume color, shape, size, saturation, or stroke. Tag membership is filter-only and panel-displayed.
- **Layer abstraction** (`ATLAS_PHASE3A_SPEC.md`). Tags apply to entities within layers; they are a per-entity property, not a new layer.
- **Authoring discipline** (`ATLAS_MAIN_SPEC.md` §"Authoring Discipline"). Tag values are validated against a registry; unknown tags fail entity validation.
- **Phase 3b problem schema** (`ATLAS_PHASE3B_SPEC.md` §"Problem entity"). Problems already declare a `tags` array. This spec generalizes that pattern across layers and constrains it to a shared registry.
- **Mobile parity** (`ATLAS_PHASE3B_SPEC.md` §"In scope"). The tag filter has a mobile surface inside `MobileControlsOverlay`.

---

## Schema

### Tag registry (new file)

`atlas/data/tags.json`:

```json
{
  "tags": [
    {
      "id": "orbital-mechanics",
      "label": "Orbital mechanics",
      "description": "Concepts and problems involving gravitational orbits, Kepler's laws, and central-force motion.",
      "audience_relevance": ["phy-132", "ap-physics"],
      "review_state": "published"
    },
    {
      "id": "ac-circuits",
      "label": "AC circuits",
      "description": "Alternating current, RLC resonance, impedance, and AC power.",
      "audience_relevance": ["phy-114", "phy-132"],
      "review_state": "published"
    }
  ]
}
```

Field rules:

- `id` is kebab-case, regex `^[a-z][a-z0-9-]*$`, globally unique.
- `label` is human-readable; author-chosen casing.
- `description` is required and is what authors and TAs see when adding tags to entities.
- `audience_relevance` is optional, drawn from the same enum as `audience` on problems (`general | phy-114 | phy-132 | ap-physics | upper-division`). Used by future audience-cross-tag UX; not required for MVP filter behavior.
- `review_state` follows the entity ladder (`draft | reviewed | published`). Only `published` tags appear in the public filter UI by default; `?include=draft` reveals drafts.

### Entity additions

All entity layers gain an optional `tags: string[]` field:

```json
{
  "id": "keplers-laws",
  "layer": "concept",
  "domain": "mechanics",
  "tags": ["orbital-mechanics", "central-forces", "conservation-laws"],
  ...
}
```

- `tags` defaults to `[]` if absent.
- Each value MUST resolve to a `tag.id` in the loaded registry. Unknown tags fail entity validation.
- `tags` is **additive**; it does not replace `domain` or any existing categorization.
- The Phase 3b problem schema's existing `tags` field is retroactively constrained to this registry. Existing problem tag values that do not appear in the registry fail validation on next migration; the migration step is to either add them to the registry as `published` tags or remove them from the entity.

### Audience field harmonization (non-breaking)

Problems already carry `audience: string[]`. Audience and tags are kept distinct:

- **Audience** is a stable, exhaustive enum tied to courses/contexts. Each problem belongs to one or more audience cohorts; the enum changes rarely.
- **Tags** are an open vocabulary tied to topics. The set grows and shrinks as content evolves.

Both can be filter axes in the same UI. Do not collapse one into the other.

### Validator changes

- `atlas/src/lib/validators/concept.js` (and its siblings for `variable`, `problem`, `lab`, `experiment`) add a `tags` clause: array of strings, each present in the loaded tag registry.
- New `atlas/src/lib/validators/tag.js` validates the registry file itself: unique IDs, required fields, valid `audience_relevance` values, kebab-case IDs.
- A registry load failure (file missing, malformed) downgrades to "no tags configured" rather than crashing the app: the filter UI hides itself, and entities with non-empty `tags` arrays are still rendered (with a console warning in dev).

---

## Filter UI

### Component

A new `TagFilterPanel` component renders in the left chrome stack in `App.jsx`, immediately below `DomainFilterPanel`. Visibility:

- Default: panel rendered, tag list collapsed (single-line summary like "Tags (12)" with a chevron). Prevents chrome bloat at small viewport heights and at registries with many tags.
- Expanded: chip list of all `published` tags (and `draft` tags when `?include=draft`), each with active/inactive treatment matching `DomainFilterPanel`.
- The two prefix chips from `ATLAS_UX_IMPROVEMENTS_SPEC.md` Session 2 (`All` / `None`) MUST be present here, same contract as for domains.

### State and logic

`activeTags: Set<string>` is a separate piece of App state from `visibleDomains` and `visibleLayers`.

- Default value on first load: the full set of `published` tag IDs (i.e., no filtering).
- A node passes the tag filter iff:
  - `activeTags` equals the full registry set (no filtering), OR
  - `node.tags` intersects `activeTags` (OR-mode).
- A node with empty `tags` passes when `activeTags` is the full set; when `activeTags` is a proper subset, untagged nodes are hidden.

This is OR-mode by design; AND-mode (require all selected) is a refinement that becomes useful at large corpus size and is deferred.

### Composition with existing filters

Tag filtering AND-composes with domain and layer filters: a node is visible iff it passes all three. Variable-node visibility continues to be derived from "linked to a visible concept" per the existing rule in `GraphCanvas.jsx`; the tag filter applies to the concept layer first, and variables follow.

### Persistence

`atlas_active_tags_v1` localStorage key. JSON-serialized array of tag IDs. Read on mount with the same try/catch pattern as `atlas_layers_v1`. Falls back to "all published tags" on parse failure or first load. On registry change (a tag is removed or renamed), unknown IDs are dropped silently from the persisted set.

### URL parameter (conditional)

If `ATLAS_UX_IMPROVEMENTS_SPEC.md` Session 6 has shipped, this spec extends the URL shape to include `?tags=orbital-mechanics,kepler`. If Session 6 has not shipped, defer URL integration to that work; the localStorage layer alone is sufficient for the filter to be useful day one.

### Mobile parity

`TagFilterPanel` renders inside `MobileControlsOverlay`, between `LayerToggleBar` and `DomainFilterPanel`. Same collapsed-by-default behavior, same `All`/`None` chips, same persistence.

---

## Panel display

The existing `NodePanel` for a selected concept gains a `tags` row below the domain row in `NodePanelHeader`:

- Renders only if `selectedNode.tags?.length > 0`.
- Each tag renders as a small clickable chip; clicking calls a handler that:
  - Sets `activeTags` to a single-element set containing that tag (i.e., "show me only this tag").
  - **Does not close the panel.** The selected concept remains the user's anchor; the surrounding graph filters around it. If the selected concept has the clicked tag (which it must, by construction), the concept itself does not get filtered out.
- Tag chip styling matches the domain chip's visual weight — small, muted, capitalized. Differentiated from the domain chip by the absence of a domain color swatch.
- Hovering a tag chip surfaces the tag's `description` via the standard hover-card system once that ships (see Atlas hover-card work) or the OS-default `<title>` until then.

---

## Tag governance

- The tag registry file is reviewed via PR like any other content.
- Adding a tag is a single-file PR (registry entry only) and does not require a content migration.
- Removing a tag requires first removing it from all entities that reference it; the validator catches orphans before merge.
- Renaming a tag is a registry change plus a search-and-replace across entity files. This spec does not mandate alias support; if rename frequency becomes annoying, add an `aliases: string[]` field to the registry entry as a follow-up.

### Tag taxonomy guidance (non-normative)

- Prefer **applied-topic** tags over **structural** tags. "Orbital mechanics" yes; "uses-vector-calculus" no — that's a structural query better served by content fields.
- Prefer **course-aligned** tags when relevant (`phy-114-week-3`, `phy-132-lab-4`) so TAs can filter to "what's in front of students this week." These coexist with topical tags.
- Avoid tags that are 1-to-1 with a domain. `mechanics-tag` is redundant; use the domain.
- Avoid tags that are 1-to-1 with a single concept. If a tag has only one member, it is a label, not a category.
- A reasonable target for the registry at Phase 3b launch is 10–25 tags. Past ~50, consider splitting into multiple registries (`topic-tags.json`, `course-tags.json`) if authoring feedback supports it.

---

## Tests

New test file: `atlas/src/lib/__tests__/tagRegistry.test.js`:

- Registry validator rejects duplicate IDs, missing fields, non-kebab-case IDs, and unknown `audience_relevance` values.
- Registry validator accepts a well-formed registry.

Extensions to existing entity validator tests:

- Concept with unknown tag fails validation.
- Concept with valid tag passes.
- Concept with `tags: []` passes.
- Concept with no `tags` field passes (treated as `[]`).

New `atlas/src/components/__tests__/TagFilterPanel.test.jsx`:

- Renders all `published` tags by default.
- Includes `draft` tags when `includeDraftContent` prop is true.
- Toggling a tag adds/removes it from `activeTags`.
- `All` / `None` batch chips behave as in `DomainFilterPanel`.
- Empty registry hides the panel chrome entirely.

Extensions to `App.visibility.test.jsx`:

- Filtering to a single tag hides concepts without that tag.
- Filtering to a tag that intersects no visible domains produces an empty graph but does not crash.
- `activeTags` round-trips through `atlas_active_tags_v1` localStorage.
- A persisted tag ID that is no longer in the registry is silently dropped on load.

---

## Acceptance criteria

- A concept with `tags: ["orbital-mechanics"]` is visible when `activeTags` contains `"orbital-mechanics"`, hidden when `activeTags` is a proper subset that excludes it.
- A concept with no `tags` is visible when `activeTags` is the full set, hidden when `activeTags` is a proper subset.
- The visual encoding budget is unchanged: every concept renders in its single canonical domain color regardless of how many tags it carries.
- The selected-concept panel surfaces the concept's tags as clickable chips that filter the graph to that single tag.
- Adding a tag to the registry and assigning it to a concept does not require any UI code changes.
- Removing a tag from the registry while it is still referenced by a concept fails validation at content-load time with a clear error.

---

## Out of scope

- **Hierarchical tags / sub-tags.** Flat namespace only. If a real need arises, add `parent_tag: string | null` later; do not introduce hierarchy upfront.
- **AND-mode tag filtering.** OR-only for MVP. Revisit when the registry exceeds ~25 tags or authoring feedback requests it explicitly.
- **AI-suggested tags during authoring.** Phase 4 territory.
- **Tag-based concept-map construction prompts** (e.g., "build the orbital-mechanics map from scratch"). That is an extension of `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`, not this spec.
- **"Show untagged" chip.** Defer until untagged-content noise becomes a real complaint.
- **Multi-domain coloring.** Permanently out of scope; see Problem Statement §1.
- **Tag aliases / rename support.** Out of scope until rename pain is observed.
- **Per-user custom tags.** Tags are canonical content, not personal annotations. Personal tagging belongs in construction-mode artifacts, not the canonical graph.
