# Atlas — Node Packaging: Shareable `?nodes=` URLs

> Phase-agnostic addendum. Read in full before implementation.
> Phase placement: independent of block/panel work; touches only URL parsing,
> selection state, and one share affordance. Harmonizes with the existing
> `?node=` deep link in `ReferenceApp` and the `?mode=construct` switch in `App`.
>
> Structured as three implementation passes. Pass 1 (`?nodes=` MVP) is the
> body of this spec. Pass 2 (`?sel=` bitmask) and Pass 3 (citation codes +
> wildcards) are specified in §"Follow-up passes" and MUST NOT begin before
> Pass 1's testing gates are green.

---

## Problem statement

Atlas can export a full developer-defined container (the `atlas-layout` and
`atlas-concept-map` JSON file formats), but there is no lightweight way for a
user to package an arbitrary set of concept nodes and hand it to someone else.
Today the only shareable URL state is a single node (`?node=<id>`) and the app
mode (`?mode=construct`). A TA who wants to say "study these seven nodes before
Lab 4" must either export a JSON file (heavyweight, requires import UX) or list
node names in prose (lossy, no click-through).

This spec defines a **selection format**: a URL query parameter that encodes
*which* nodes are in a package, plus optional integrity metadata. It is
deliberately not a container format — positions, edges, annotations, and
submission state remain the business of `atlas-concept-map` files. A `?nodes=`
URL answers exactly one question: "which subset of the canonical corpus should
this session focus on?"

---

## Design constraints inherited from the corpus

This spec MUST preserve:

- **Identity primitive.** Kebab-case entity ids (`schema.js`
  `KEBAB_CASE_PATTERN`) are the only node identity. The URL format references
  ids verbatim; it never invents a parallel identifier scheme. (A hierarchical
  code scheme is explicitly future work — see §"Future work".)
- **Corpus hash machinery.** `computeCorpusHash` in `src/lib/userLayout.js`
  already fingerprints the sorted entity-id list. Staleness detection for
  shared URLs reuses it; no new hashing scheme.
- **Graceful degradation on stale imports.** Same posture as layout import
  validation (`validateLayoutImportPayload`): unknown ids are dropped with a
  visible notice, never a hard failure.
- **Visual encoding budget** (`ATLAS_MAIN_SPEC.md` §"Visual encoding budget").
  Selection membership is a filter/dim state, not a new color, shape, or size.
- **No server.** Atlas is a static client app. The URL must be self-contained;
  no shortener, no lookup table, no persistence beyond the query string.
- **Read-only reference mode semantics.** Opening a `?nodes=` URL must not
  mutate the viewer's saved layout, localStorage selection, or understanding
  state.

---

## URL format

### Parameter

```
?nodes=<id>[,<id>...][&corpus=<hash-prefix>]
```

- `nodes` — comma-separated list of entity ids. Comma is chosen because it is
  legal unencoded in a query value per RFC 3986 and survives copy-paste in
  chat clients. Order is not significant; duplicates are ignored.
- `corpus` — optional. First 8 hex characters of the corpus hash (the part
  after `sha256:`) at share time. Used only to distinguish "this link is stale"
  from "this link is wrong" in user-facing messaging.

Example:

```
https://atlas.example/?nodes=ohms-law,resistance,capacitance,rc-time-constant&corpus=a3f9c2e1
```

### Grammar and limits

- Each id MUST match `^[a-z0-9]+(?:-[a-z0-9]+)*$` (the schema kebab pattern).
  Ids failing the pattern are discarded before corpus lookup (defense against
  URL tampering; ids are used in DOM rendering paths).
- Empty segments (`,,`) are skipped silently.
- Maximum **64 ids**. Beyond that the parser truncates and surfaces a notice.
  Rationale: 64 typical ids ≈ 1–1.5 KB of URL, safely under practical URL
  limits (~2 KB conservative bound); packages larger than this are containers
  and belong in `atlas-map` files (or the future bitmask form, §"Future work").
- `nodes` composes with existing params. `?nodes=...&node=ohms-law` opens the
  package *and* the node panel for `ohms-law`. `?mode=construct&nodes=...`
  seeds the construction canvas node palette with the package (stretch goal —
  MVP may ignore `nodes` in construct mode, but MUST NOT error).

### Interaction with `?node=`

`?node=` (singular) remains the single-node deep link and is unchanged. When
both are present, `nodes` defines the visible/focused set and `node` selects
the open panel. If `node` names an id outside the package, the panel still
opens (the package is a focus lens, not an access control).

---

## Behavior

### Opening a package URL (reference mode)

1. Parse and sanitize `nodes` per the grammar above.
2. Partition ids into `known` (present in the loaded corpus) and `unknown`.
3. If `known` is empty → show the normal full graph plus a dismissible notice:
   "This shared package doesn't match any current Atlas content." Do not
   render an empty canvas.
4. If `known` is non-empty → enter **package view**:
   - Nodes in the package render normally; all other nodes and their edges
     render dimmed (same dim treatment as existing tag/domain filtering — no
     new visual channel).
   - Edges between two package members render normally; edges with one
     endpoint outside the package follow the dim state.
   - The camera fits the package bounding box on load.
   - A **package bar** appears (top of canvas, desktop and mobile): count
     ("7 concepts"), a "Show all / Focus package" toggle, and a dismiss (×)
     that exits package view and cleans `nodes`/`corpus` from the URL via
     `history.replaceState`.
5. If `unknown` is non-empty, the package bar includes a notice:
   - With `corpus` present and mismatching the current corpus-hash prefix:
     "This link was made with an older version of Atlas — N concept(s) in it
     no longer exist and were skipped."
   - Otherwise: "N concept(s) in this link were not found and were skipped."
6. Package view is ephemeral. It never writes to localStorage. Refreshing the
   URL reproduces it; dismissing it removes it.

### Creating a package URL (share affordance)

MVP entry point: a **"Copy link to selection"** action.

- Selection source: the existing multi-select mechanism if/where one exists;
  otherwise MVP ships a minimal "add to package" affordance on the node panel
  (a toggle that accumulates ids into an in-memory set, with a running count
  in the package bar).
- The action builds the URL: current origin + path, `nodes=` with the selected
  ids **sorted lexicographically** (stable URLs — same set always produces the
  same string, so links are comparable and deduplicatable), `corpus=` with the
  current 8-char hash prefix, and copies it to the clipboard.
- Draft-content rule: if the viewer has `?include=draft` active and the
  selection contains draft entities, the copied URL includes `include=draft`;
  otherwise draft ids are excluded from the copied URL with a notice. A share
  link must not silently point recipients at content they cannot see.

### Module boundary

New module `src/lib/nodePackage.js`, pure functions, no React:

```js
parseNodesParam(searchString) // → { ids: string[], corpusPrefix: string|null, truncated: boolean }
partitionPackageIds(ids, corpusIdSet) // → { known: string[], unknown: string[] }
buildPackageUrl({ ids, corpusHash, baseUrl, includeDraft }) // → string
```

URL read/write plumbing follows the existing `readNodeIdFromSearch` /
`buildHrefWithNode` pattern in `ReferenceApp.jsx` — extend that pattern, do
not introduce a router.

---

## Testing gates

Per `.cursor/rules/20-testing-gates.mdc` discipline, minimum coverage:

- `parseNodesParam`: empty param, single id, trailing/duplicate commas,
  duplicate ids, invalid-pattern ids (including `%`-encoded injection
  attempts), >64 ids truncation, `corpus` present/absent/malformed.
- `partitionPackageIds`: all known, all unknown, mixed.
- `buildPackageUrl`: sorted output stability (same set, any order → identical
  URL), draft exclusion, corpus prefix inclusion.
- Integration: opening `?nodes=` with mixed known/unknown ids renders package
  view with the correct dim set and notice; dismiss cleans the URL; no
  localStorage writes occur in package view.

---

## Out of scope

- Positions, edges, annotations, titles, or any container payload in the URL.
  Those remain `atlas-concept-map` concerns.
- Server-side link shortening or resolution.
- Editing a received package (recipients can dismiss or explore, not mutate).
- Construct-mode seeding beyond "must not error" (stretch goal, separate
  session).

---

## Follow-up passes

Each pass is a separate implementation session with its own testing gates.
Passes are ordered by dependency: Pass 2 depends on Pass 1's parse/partition
pipeline; Pass 3 depends on Pass 1's URL vocabulary and is independent of
Pass 2.

---

### Pass 2 — Bitmask form for large sets (`?sel=`)

**Problem.** Pass 1 caps packages at 64 ids to keep URLs under practical
length limits. Instructor-scale packages (a full unit, 80–200 nodes) need a
compact encoding.

**Format.**

```
?sel=<hash-prefix-8>.<base64url-bitmask>
```

- The bitmask is a bit field over the **canonical ordering**: entity ids
  sorted lexicographically — exactly the ordering `computeCorpusHash` already
  normalizes to. Bit *i* set ⇔ the *i*-th id in sorted order is a member.
- Trailing zero bytes are trimmed before encoding; the decoder treats bits
  beyond the encoded length as zero.
- Encoding is base64url (RFC 4648 §5, no padding). The `.` separator is legal
  unencoded in a query value and cannot appear in base64url output.
- The hash prefix is **load-bearing here, not advisory** (unlike `corpus` in
  Pass 1): a bitmask is meaningless against a changed ordering. On prefix
  mismatch, the link degrades to the "older version of Atlas" notice with
  **no partial recovery** — never guess membership against a shifted index.

**Behavior.**

- `?sel=` and `?nodes=` resolve through the same pipeline: both produce a
  `{ known, unknown }` partition before the UI sees them, so package view
  (§"Behavior") is unchanged. For `?sel=`, `unknown` is only ever "the whole
  link" (hash mismatch) or empty.
- If both `?sel=` and `?nodes=` are present, `nodes` wins and `sel` is
  ignored with a console warning (not a user-facing error).
- The share affordance switches encoding automatically: ≤64 ids → `?nodes=`
  (readable, corpus-churn-tolerant); >64 ids → `?sel=`. Users never choose.

**Module additions** (`src/lib/nodePackage.js`, still pure):

```js
encodeSelectionBitmask(ids, sortedCorpusIds) // → base64url string
decodeSelectionBitmask(encoded, sortedCorpusIds) // → string[] ids
parseSelParam(searchString) // → { hashPrefix, encoded } | null
```

**Testing gates.**

- Round-trip property: for random subsets of a fixture corpus,
  `decode(encode(S)) === S` (sorted).
- Trailing-byte trimming; empty selection; full-corpus selection.
- Hash mismatch → empty `known`, stale notice, no partial decode.
- Malformed base64url, missing `.` separator, oversized payload → treated as
  no package, normal graph renders.
- Precedence: `?sel=` + `?nodes=` → `nodes` wins.
- Share affordance emits `?nodes=` at 64 ids and `?sel=` at 65 (boundary
  test).

**Out of scope for Pass 2.** Any change to package-view UI; any attempt at
partial recovery across corpus versions (e.g. shipping historical orderings).

---

### Pass 3 — Hierarchical citation codes and wildcard packaging

**Problem.** Kebab ids are stable but unciteable at a whiteboard, and
enumerating a sub-domain's members in a URL is busywork. This pass gives every
node a short, sortable, human-citable code (PIRA/Dewey-style) and lets URLs
reference whole branches by prefix.

**Decision already made: codes are a citation alias, never identity.** Kebab
ids remain the only key in edges, prerequisites, positions, and storage. The
corpus is a graph (multi-valued `sub_domains`); a hierarchical code forces a
primary-classification editorial choice, and identity must not depend on an
editorial choice.

**Code format.**

```
<SUBJECT>.<DOMAIN>.<SUBDOMAIN>.<SEQ>
P.EM.CIR.014
```

- `SUBJECT` — 1–2 uppercase letters, from a new `code` field on the subjects
  registry (`P` for physics).
- `DOMAIN` — 2–3 uppercase letters, from a new `code` field on each domain
  (`ME`, `EM`, `TH`, `WA`, `OP`, `MO`, `MA`).
- `SUBDOMAIN` — 2–4 uppercase letters, from a new `code` field on each entry
  in `sub-domains.json` (`CIR`, `KIN`, `NRG`, …), unique within its domain(s).
- `SEQ` — zero-padded 3-digit sequence, unique within the
  subject.domain.subdomain branch.

**Storage: authored, not derived.** Each node gains an optional
`citation_code` field holding the full code string. Codes are assigned
**append-only per branch**: a new node takes the next free sequence number;
sequence numbers are never reclaimed or renumbered, so a cited code is stable
for the life of the corpus. A node whose primary sub-domain classification is
later revised keeps its old code as an **alias** (`citation_code_aliases:
string[]`) and gains a new primary code — old citations keep resolving.

For multi-sub-domain nodes, the branch of `citation_code` is the **primary
classification** — an explicit editorial decision recorded in the data, which
is exactly why the field is authored rather than derived.

**Schema validation additions** (`schema.js`):

- `citation_code` matches
  `^[A-Z]{1,2}\.[A-Z]{2,3}\.[A-Z]{2,4}\.\d{3}$` when present.
- The code's segments must resolve to registered subject/domain/sub-domain
  `code` values, and the sub-domain segment must correspond to an entry in
  the node's own `sub_domains` array.
- Corpus-level check (in `data.test.js`): no two nodes share a
  `citation_code`; aliases don't collide with any primary code.
- Registry `code` fields are required-unique within their registry once any
  node in that branch carries a code (incremental adoption: codes roll out
  branch by branch, not corpus-wide in one session).

**URL integration — codes and wildcards in `?nodes=`.**

The `?nodes=` grammar extends to accept three segment kinds, freely mixed:

```
?nodes=ohms-law,P.EM.CIR.014,P.EM.CIR.*
```

- **Kebab id** — as Pass 1. Unchanged.
- **Exact code** — resolved via primary codes first, then aliases. Resolves
  to one id or lands in `unknown`.
- **Prefix wildcard** — a code truncated at any dot boundary plus `.*`
  (`P.*`, `P.EM.*`, `P.EM.CIR.*`). Expands to every node whose primary code
  or alias falls under the prefix. Expansion happens **at parse time**, before
  the `{ known, unknown }` partition — package view and Pass 2 remain
  untouched. A wildcard matching zero nodes contributes to `unknown` as one
  entry for messaging ("1 group in this link matched nothing").
- Wildcard expansion counts against the 64-id ceiling *after* expansion; if
  an expansion overflows, the share/open path surfaces the same truncation
  notice as Pass 1. (Share affordance may emit `?sel=` instead per Pass 2
  rules, but a received over-large wildcard URL truncates predictably.)
- Segment disambiguation is syntactic: contains `.` → code/wildcard; else →
  kebab id. The kebab pattern forbids dots and uppercase, so the grammars
  cannot collide.

**Display.** Nodes with a `citation_code` show it in the node panel header
(copyable) and in search results as a secondary match field (typing `EM.CIR`
filters to that branch). No canvas rendering — codes consume no visual
channel.

**Module additions** (`src/lib/nodePackage.js` + new
`src/lib/citationCodes.js`):

```js
buildCodeIndex(nodes) // → { byCode: Map, byPrefix: (prefix) => string[] }
resolvePackageSegment(segment, codeIndex, corpusIdSet) // → { ids: string[], unknown: boolean }
```

**Testing gates.**

- Pattern validation: valid codes, bad padding, lowercase, wrong segment
  counts, unregistered segment values, sub-domain/`sub_domains` mismatch.
- Corpus uniqueness including alias collisions.
- Segment resolution: id vs code vs wildcard disambiguation; alias
  resolution; zero-match wildcard; mixed segment lists; post-expansion
  ceiling.
- URL stability: mixed lists still sort deterministically (sort key is the
  raw segment string).
- Search: code-fragment queries match branch members.

**Out of scope for Pass 3.** Backfilling codes across the whole corpus in one
session (adopt branch by branch); negative/exclusion syntax (`!P.EM.CIR.003`);
range syntax (`P.EM.CIR.010-020`) — revisit only if real usage demands it.

---

### Exploratory (unscheduled): PIRA DCS catalog as Atlas content

Separate from the passes above: represent the PIRA Demonstration
Classification Scheme itself in Atlas as a `demonstration` layer, where each
node is a PIRA entry (its DCS code slotting naturally into `citation_code`)
and typed edges link demonstrations to the concept nodes they illustrate.
This is a corpus-authoring project, not an engineering pass, but it would
dogfood both the layer architecture and the Pass 3 code machinery against an
externally defined taxonomy. No spec commitment yet — record findings in a
future addendum if pursued.
