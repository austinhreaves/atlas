# Cursor prompt — Session 2: All/None batch toggles + domain re-sync fix + domain persistence

You are implementing Session 2 of `ATLAS_UX_IMPROVEMENTS_SPEC.md` plus two adjacent fixes that share the same surface area. **Read the cited spec sections in full before writing any code.**

Cited specs you must read first:
- `ATLAS_UX_IMPROVEMENTS_SPEC.md` §"Session 2 — All / None batch toggles for domains and layers" — the primary contract.
- `ATLAS_UX_IMPROVEMENTS_SPEC.md` §"Cross-session conventions" → "Persistence keys" — for the localStorage naming convention.
- `ATLAS_UX_IMPROVEMENTS_SPEC.md` §"Cross-session conventions" → "Mobile parity" — the parity rule.
- `ATLAS_MAIN_SPEC.md` §"Visual encoding budget" — context only; this PR does not touch encoding.

---

## Goal

Three changes that ship in a single PR because they touch the same files and share state:

1. **Session 2: All / None batch toggles.** Add prefix `All` and `None` chips to `DomainFilterPanel` and `LayerToggleBar`, with desktop and mobile parity.
2. **Bug fix: domain re-sync effect silently un-hides hidden domains.** The current effect at `atlas/src/App.jsx` lines 259–269 unconditionally re-adds every domain in `allDomains` that isn't in the current `visibleDomains` set. This is benign today because `allDomains` rarely changes, but it will misbehave the moment Session 2's `None` button lands (the next entity reload will silently un-hide everything the user just hid).
3. **Persist `visibleDomains` to localStorage** under `atlas_domains_v1`, mirroring the pattern used by `atlas_layers_v1`.

These ship together because (1) is the trigger that exposes (2), and (3) is the natural place to store the bug-fix state that distinguishes "domain is genuinely new" from "user explicitly hid it".

---

## Inherited constraints (do not violate)

- **Visual encoding budget unchanged.** This PR does not touch node geometry, color, or any encoding.
- **Mobile parity.** Every visible affordance has a mobile surface inside `MobileControlsOverlay`.
- **Phase 3b lockout for layers.** Layers without a `schema_validator` (problem / lab / experiment today) MUST remain disabled regardless of `All`. Clicking `All` MUST NOT flip a disabled layer on.
- **localStorage convention.** New keys use `atlas_<feature>_v1`. Reads wrap in `try`/`catch` and fall back to a sensible default.
- **No layout recomputation.** This PR is filter-state only.

---

## Architecture

### 1. Session 2 — All / None batch toggles

#### Component changes

**`atlas/src/components/DomainFilterPanel.jsx`:**
- Two new leading buttons before the per-domain chip list: `All` and `None`.
- New props: `allDomains: string[]` (already passed today), `onSetAllDomains: () => void`, `onClearAllDomains: () => void`.
- The `All` button is visually muted (lower opacity, no hover styling) when `visibleDomains.size === allDomains.length`.
- The `None` button is visually muted when `visibleDomains.size === 0`.
- Buttons are visually distinct from per-domain chips: label-only, no color swatch, slightly different border treatment so they do not get mistaken for a domain.

**`atlas/src/components/LayerToggleBar.jsx`:**
- Same two buttons in the same leading position.
- New props: `enabledLayerIds: string[]` (the subset of layers with a `schema_validator`), `onSetAllLayers: () => void`, `onClearAllLayers: () => void`.
- `All` for layers sets `visibleLayers` to the set of `enabledLayerIds` only — disabled layers do NOT flip on.
- `None` for layers sets `visibleLayers` to the empty set; existing per-chip disabled state is preserved.
- The `All` button is muted when `visibleLayers` equals the full `enabledLayerIds` set.
- The `None` button is muted when `visibleLayers.size === 0`.

#### App-level wiring

**`atlas/src/App.jsx`:**

- New memos:
  ```js
  const allDomainKeys = useMemo(() => allDomains, [allDomains])
  const enabledLayerIds = useMemo(
    () =>
      layerEntries
        .filter(([, layer]) => typeof layer?.schema_validator === 'function')
        .map(([layerId]) => layerId),
    [],
  )
  ```
  Note: `allDomains` is already memoized; rename or pass-through is fine.
- New callbacks:
  ```js
  const handleSetAllDomains = useCallback(() => {
    setVisibleDomains(new Set(allDomainKeys))
  }, [allDomainKeys])
  const handleClearAllDomains = useCallback(() => {
    setVisibleDomains(new Set())
  }, [])
  const handleSetAllLayers = useCallback(() => {
    setVisibleLayers(new Set(enabledLayerIds))
  }, [enabledLayerIds])
  const handleClearAllLayers = useCallback(() => {
    setVisibleLayers(new Set())
  }, [])
  ```
- Pass all four callbacks plus `enabledLayerIds` into `DomainFilterPanel`, `LayerToggleBar`, and `MobileControlsOverlay`.

**`atlas/src/components/MobileControlsOverlay.jsx`:**
- Accept and forward the four new callbacks plus `enabledLayerIds` to its inline copies of `DomainFilterPanel` and `LayerToggleBar`.
- No new visual structure; this is plumbing only.

### 2. Bug fix — domain re-sync effect

The current effect at `atlas/src/App.jsx` lines 259–269 has this shape:

```js
useEffect(() => {
  setVisibleDomains((current) => {
    const next = new Set([...current].filter((d) => allDomains.includes(d)))
    for (const d of allDomains) {
      if (!current.has(d)) {
        next.add(d)   // <-- bug: re-adds anything the user has hidden
      }
    }
    return next
  })
}, [allDomains])
```

The fix needs to distinguish "domain is genuinely new to the corpus this session" from "user has explicitly hidden it". The cleanest minimal change is to track a separate **seen-domains** set and only auto-add domains that are new relative to it.

#### New state

```js
const [seenDomains, setSeenDomains] = useState(() => readInitialSeenDomains())
```

`seenDomains` is the set of domain IDs the user has been exposed to in any prior session. It persists alongside `visibleDomains` in the new `atlas_domains_v1` key (see §3 below).

#### Replace the existing effect with this logic:

```js
useEffect(() => {
  const allDomainSet = new Set(allDomains)
  const newDomains = allDomains.filter((d) => !seenDomains.has(d))
  const removedDomains = [...seenDomains].filter((d) => !allDomainSet.has(d))

  if (newDomains.length === 0 && removedDomains.length === 0) {
    return
  }

  setVisibleDomains((current) => {
    const next = new Set([...current].filter((d) => allDomainSet.has(d)))
    for (const d of newDomains) {
      next.add(d)
    }
    return next
  })

  setSeenDomains(allDomainSet)
}, [allDomains, seenDomains])
```

This:
- Adds **only genuinely new** domains to `visibleDomains` (preserving the user's hidden set).
- Removes domains from `visibleDomains` that no longer exist in the corpus.
- Updates `seenDomains` to mirror the current corpus.

### 3. Persist `visibleDomains` and `seenDomains`

Single localStorage key: `atlas_domains_v1`. Stored value is a JSON object:

```json
{
  "visible": ["mechanics", "electromagnetism"],
  "seen":    ["mechanics", "electromagnetism", "thermodynamics"]
}
```

#### New helpers in `App.jsx`:

```js
const DOMAINS_KEY = 'atlas_domains_v1'

function readPersistedDomains() {
  if (typeof window === 'undefined') {
    return { visible: null, seen: null }
  }
  try {
    const raw = window.localStorage.getItem(DOMAINS_KEY)
    if (!raw) return { visible: null, seen: null }
    const parsed = JSON.parse(raw)
    const visible = Array.isArray(parsed?.visible)
      ? new Set(parsed.visible.filter((d) => typeof d === 'string'))
      : null
    const seen = Array.isArray(parsed?.seen)
      ? new Set(parsed.seen.filter((d) => typeof d === 'string'))
      : null
    return { visible, seen }
  } catch {
    return { visible: null, seen: null }
  }
}
```

#### Initial state derivation:

The `visibleDomains` and `seenDomains` initializers consume the persisted snapshot but defer the "fill from `allDomains`" decision until after the first render, because `allDomains` is itself a `useMemo` derived from entity load. The simplest correct shape:

- On mount, read `{ visible, seen } = readPersistedDomains()`.
- Initialize `seenDomains` to `seen ?? new Set()`.
- Initialize `visibleDomains` to `visible ?? new Set()`. If `visible` is `null` (first ever load), the existing re-sync effect (now corrected per §2) will populate it from `allDomains` on first run, since every domain will be "new".

#### Write-on-change effect:

```js
useEffect(() => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      DOMAINS_KEY,
      JSON.stringify({
        visible: [...visibleDomains],
        seen: [...seenDomains],
      }),
    )
  } catch {
    // Ignore write failures in constrained environments.
  }
}, [seenDomains, visibleDomains])
```

#### Edge cases:

- A persisted domain that no longer exists in `allDomains` is silently dropped on next render (the corrected re-sync effect handles this).
- A first-ever load with no persisted state results in all domains visible (current behavior preserved).
- A reload while `visibleDomains` is empty (user clicked `None`) restores the empty set — this is intentional.

---

## File footprint

- `atlas/src/App.jsx` — `seenDomains` state, four new batch-toggle callbacks, `enabledLayerIds` memo, persistence helpers + effect, corrected re-sync effect, prop threading.
- `atlas/src/components/DomainFilterPanel.jsx` — two new buttons, two new props, muted-state logic.
- `atlas/src/components/LayerToggleBar.jsx` — two new buttons, two new props, `enabledLayerIds` prop, muted-state logic.
- `atlas/src/components/MobileControlsOverlay.jsx` — pass-through plumbing for the four callbacks + `enabledLayerIds`.
- `atlas/src/components/__tests__/DomainFilterPanel.test.jsx` — **new** (or extend if a test file is added during this PR).
- `atlas/src/components/__tests__/LayerToggleBar.test.jsx` — **new** (or extend if a test file is added during this PR).
- `atlas/src/__tests__/App.visibility.test.jsx` — extend with re-sync, persistence, and batch-toggle behavior tests.

---

## Acceptance criteria

### Session 2

1. Clicking `All` on domains makes every domain visible regardless of prior state.
2. Clicking `None` on domains hides every domain. Per existing visibility rules in `GraphCanvas.jsx`, this also hides all variable nodes that lack a visible-concept neighbor.
3. Clicking `All` on layers sets `visibleLayers` to the enabled-layer set only — `problem`, `lab`, `experiment` chips remain disabled and OFF.
4. Clicking `None` on layers hides every layer.
5. Calling `None` then `All` on layers does NOT flip a disabled layer on.
6. Per-chip toggles continue to function after batch operations.
7. The `All` button is visually muted when the relevant set is already complete; the `None` button is visually muted when the set is empty.
8. Mobile: same four buttons render inside `MobileControlsOverlay` and behave identically.

### Bug fix

9. Hide a domain (e.g., `mechanics`), then trigger an entity-driven re-render (a `seenDomains`-changing or `allDomains`-changing event). `mechanics` MUST remain hidden.
10. Add a hypothetical new domain to the corpus that was not previously in `seenDomains`. It MUST appear in `visibleDomains` automatically.
11. Remove a domain from the corpus. It MUST be pruned from both `visibleDomains` and `seenDomains`.

### Persistence

12. Reload preserves `visibleDomains` exactly as the user left it, including the empty-set case (after `None`).
13. Reload preserves `seenDomains`.
14. A persisted domain that no longer exists in `allDomains` is dropped silently on reload.
15. A first-ever load (no `atlas_domains_v1` entry) results in all domains visible — current behavior preserved.

---

## Out of scope (do not implement)

- A "previous selection" undo for filter changes. Spec out-of-scope; ship later if asked.
- Persistence for `visibleLayers` — that's already in place via `atlas_layers_v1`.
- Any URL-parameter integration for filters. That overlaps with `ATLAS_UX_IMPROVEMENTS_SPEC.md` Session 6 and ships separately.
- Tag-filter integration. That belongs to `ATLAS_TAGS_SPEC.md`.
- Visual redesign of the chip components.

---

## Test discipline

Every new component or substantive change ships with at least one test. Test names describe behavior, not implementation. Use existing `App.visibility.test.jsx` as the model for App-level state tests and create lightweight component tests for the two filter panels (render the component with mock props and assert on rendered chip labels and click handlers).

Suggested concrete tests:

- `App.visibility.test.jsx`:
  - `restores visibleDomains from atlas_domains_v1 on mount`
  - `persists visibleDomains and seenDomains on change`
  - `keeps a hidden domain hidden across an allDomains-driven re-sync`
  - `adds a genuinely new domain to visibleDomains automatically`
  - `prunes a removed domain from visibleDomains and seenDomains`
  - `All chip on domains sets visibleDomains to all`
  - `None chip on domains sets visibleDomains to empty`
  - `All chip on layers does not flip a disabled layer on`

- `DomainFilterPanel.test.jsx`:
  - renders `All` and `None` chips
  - calls `onSetAllDomains` when `All` is clicked
  - calls `onClearAllDomains` when `None` is clicked
  - mutes `All` when `visibleDomains.size === allDomains.length`
  - mutes `None` when `visibleDomains.size === 0`

- `LayerToggleBar.test.jsx`:
  - parallel four cases, plus: `All` only toggles enabled layers on.

---

## Commit hygiene

Suggested boundaries for a clean bisect:

1. `fix(domains): preserve hidden domains across allDomains re-sync`
2. `feat(persist): atlas_domains_v1 localStorage for visibleDomains and seenDomains`
3. `feat(filters): All/None batch toggles for domains and layers`
4. `feat(mobile): pass batch toggles through MobileControlsOverlay`
5. `test: re-sync, persistence, and batch-toggle coverage`

Squash-merge or rebase-merge to main, your call, but keep these boundaries on the branch.
