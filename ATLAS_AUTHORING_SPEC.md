# Atlas Authoring Spec — LLM-in-the-Loop Content Pipeline

> Atlas Phase 3b authors hundreds of entities across five layers. LLMs can plausibly draft most of it. They can also confidently produce subtly wrong physics. This spec defines the workflow that exploits the first capability without paying the cost of the second.

---

## Purpose and scope

This spec formalizes how LLMs (Claude, GPT, etc.) participate in Atlas content authoring. It applies immediately to Phase 3b (40+ new concepts, ~120 problems, ~24 labs, ~20 experiments, plus variable expansion) and forward to Phase 4 (where Atlas becomes a RAG corpus for an AI tutor — at which point provenance discipline becomes a *correctness* concern, not just a transparency one).

It does **not** authorize unreviewed LLM content shipping to the public graph. Every entity that reaches `review_state: "published"` has been read in full by a physicist (Austin or designated reviewer) regardless of how its first draft was produced.

---

## Core principles

### 1. Humans own correctness. LLMs accelerate volume.

The reviewer's signature on `review_state: "published"` is the load-bearing claim of physics correctness. LLMs cannot make this claim, ever, no matter how good they get. The workflow is structured to free the human from low-leverage drafting work so their attention is fully available for the high-leverage correctness review.

### 2. Task-typed LLM use.

Not all authoring tasks carry equal risk. The workflow assigns review burden by task category, not uniformly. A misconception draft requires light review; a numerical answer requires rederivation; an `applicability_conditions` field requires expert judgment regardless of who drafted it.

### 3. Provenance is public.

Atlas users (students, instructors, the broader physics-education community) can see whether any given entity's content was LLM-assisted, and when it was last human-reviewed. This is non-negotiable for a public HyperPhysics successor: hidden LLM authorship would erode trust if discovered, and discovery is inevitable.

### 4. The pedagogical anchor precedes the draft.

LLMs are excellent at filling in structured detail under a clear constraint. They are mediocre at deciding what a node should teach. Every entity begins with a human-written one-paragraph **pedagogical anchor** that establishes intent. The LLM drafts *under* this anchor. The anchor is preserved in metadata.

### 5. The graph is for students, not for the LLM.

The eventual AI tutor (Phase 4) is grounded in Atlas via RAG. There is a circularity risk: LLM-drafted Atlas content trains/grounds an LLM tutor. The discipline that prevents drift here is provenance — the tutor must be configurable to ground only on `review_state: "published"` content with `human_reviewed_at` set, never on draft LLM output.

---

## Task taxonomy

LLM authoring tasks are categorized by physics-correctness risk. Each category has a different review burden, prompt strategy, and acceptance criteria.

### Category A — Low risk, high LLM leverage

LLMs reliably good; reviewer skim sufficient.

| Task | Why low risk |
|---|---|
| Common misconceptions | Well-documented in PER literature; LLM training overlaps heavily with sources like FCI, Hestenes, and physics teacher communities. |
| Historical context | Wikipedia-grade; easy to verify with single web lookup. |
| Plain-language descriptions | Stylistic, not factual; reviewer easily catches drift. |
| Variable physical descriptions | Standard textbook content; LLMs are well-calibrated. |
| Lab equipment lists | Bounded by physical reality; reviewer immediately spots fabrication. |
| Search for prerequisite candidates | LLM proposes; human accepts/rejects. Pure suggestion. |
| Tag generation | Conventional categorization. |

**Reviewer pattern**: skim; flip to `reviewed` if nothing jumps out; spot-check a sample by reading thoroughly.

### Category B — Medium risk, real LLM leverage with structured review

LLMs usually correct; reviewer must read carefully.

| Task | Why medium risk |
|---|---|
| Applicability conditions | Requires regime-boundary judgment. LLM can omit nuance ("Newton's 2nd applies in inertial frames" — true but doesn't mention v << c). |
| Limiting cases | Standard limits OK; asymptotic and singular cases unreliable. |
| Worked example solutions | Standard problems fine; LLMs drift on multi-step bookkeeping. |
| Lab learning objectives | Plausible but may not match what the lab actually does. |
| Plain-language principle statements | Style is right; the *physics claim* needs direct verification. |
| Concept_path generation for problems | LLMs propose orderings; sometimes structurally wrong. |
| Misconception correction text | Wrong-model identification reliable; correction phrasing needs care to not introduce new misconceptions. |

**Reviewer pattern**: read each field in full; verify against textbook or canonical source if uncertain; explicit acceptance per field, not per entity.

### Category C — High risk, reviewer must rederive

LLMs frequently subtly wrong; treat output as suggestion only.

| Task | Why high risk |
|---|---|
| Numerical answers | Arithmetic and algebra failures are common, even on simple problems. |
| Sign conventions | LLMs flip signs in derivations regularly. |
| Vector vs. scalar treatment | Confidently treats vectors as scalars and vice versa. |
| Dimensional analysis past the obvious | LLMs miss subtle dimension errors in derived quantities. |
| `modern_status` of experiments | Training data lag + LLMs avoid stating "this was wrong" honestly. |
| Audience calibration | LLM has no idea what PHY 114 vs PHY 132 actually covers. |
| Difficulty calibration | LLM ratings drift with no real anchor. |
| Isomorphism claims | Sometimes correct and beautiful; sometimes confidently superficial. |

**Reviewer pattern**: rederive independently; treat LLM output as a starting point for the reviewer's own work, not as the work itself.

### Category D — LLM not appropriate

| Task | Why |
|---|---|
| Final pedagogical judgment ("does this entity belong in Atlas at all") | Curriculum decision, owned by humans. |
| `review_state` promotion | The signature itself is the human commitment. |
| TA institutional knowledge in `ta_notes` | LLMs don't know your students; only TAs do. |
| Ground-truth audience tagging | Which course teaches what is institutional knowledge. |
| Resolving disagreements between authors | Editorial judgment. |

---

## Provenance schema

### Additions to every entity

```json
{
  "...": "existing fields",
  "provenance": {
    "pedagogical_anchor": "Newton's 2nd is the operational definition of force given mass and acceleration. Emphasize that net force, not motion, requires explanation; m must be inertial mass; F is a vector sum.",
    "draft_source": "llm-assisted",
    "draft_model": "claude-opus-4-7",
    "draft_date": "2026-05-15",
    "human_reviewed_at": "2026-05-16",
    "human_reviewer": "austin",
    "review_notes": "Rewrote applicability_conditions to include v<<c. Misconceptions kept verbatim from draft. Limiting cases retained but reordered."
  }
}
```

### Field semantics

- **`pedagogical_anchor`** — required, human-authored, before LLM is invoked. The intent statement that constrains the draft.
- **`draft_source`** — `"human" | "llm-assisted" | "llm-drafted"`.
  - `"human"` — no LLM involvement.
  - `"llm-assisted"` — LLM drafted some fields; human drafted others; a human shaped the structure.
  - `"llm-drafted"` — LLM drafted the entire entity from the anchor; human reviewed and edited.
- **`draft_model`** — model name + version string for reproducibility. Null if `draft_source === "human"`.
- **`draft_date`** — ISO date of LLM draft generation (or null).
- **`human_reviewed_at`** — ISO date of last full human review. Required for `review_state: "published"` if `draft_source !== "human"`.
- **`human_reviewer`** — author ID of the reviewer.
- **`review_notes`** — short free-text capture of what the reviewer changed or verified. Public-facing; helps users (and future reviewers) understand the editorial chain.

### Validator additions (Phase 3a or earlier in 3b)

- `provenance` is a required object on every entity.
- `pedagogical_anchor` is required and non-empty.
- If `draft_source !== "human"`, then `draft_model` and `draft_date` are required.
- If `review_state === "published"` and `draft_source !== "human"`, then `human_reviewed_at` and `human_reviewer` are required.
- `human_reviewed_at` must not predate `draft_date`.

### Public surfacing

In each entity panel, a small "Provenance" footer displays:

> Drafted by Claude Opus 4.7 on 2026-05-15. Reviewed by Austin on 2026-05-16. *(see review notes)*

Or, for human-authored entities:

> Authored by Austin on 2026-05-16.

Click to expand `review_notes`. This is non-negotiable transparency for a public tool.

---

## The authoring workflow

### Stage 1 — Pedagogical anchor (human, ~5 min)

The author writes a one-paragraph anchor specifying:

- What this entity should teach.
- Audience and depth (intro, calc-based, algebra-based, AP, upper-division).
- Any explicit pedagogical bets ("emphasize symmetry over force-balance," "downplay the scalar formulation").
- Required references to other Atlas entities (prerequisite concepts, related variables).

The anchor is preserved in `provenance.pedagogical_anchor`.

### Stage 2 — LLM draft (15–60 sec wall time per entity)

The author submits the anchor to an LLM via a templated prompt (see Prompt Library below). The LLM produces a candidate JSON entity matching the schema for the relevant layer.

The draft is committed as `review_state: "draft"` with `draft_source: "llm-drafted"` (or `"llm-assisted"` if the human pre-filled some fields) and full provenance metadata.

### Stage 3 — Automated drift checks (CI)

Every draft entity passes through automated checks before reviewer time is spent:

- Schema validator passes.
- Dimensional consistency: every formula's variables resolve to entries in `variables.json` with consistent dimensions on both sides of the equation. (LLMs often hallucinate variables or misuse units.)
- **Hedge-word detector**: flag any occurrence of "always," "never," "fundamental," "deep," "intuitive," "obvious," "simple," "essentially" in fields where these words signal LLM over-generalization. (Reviewer can override.)
- **Suspicious confidence**: flag claims of the form "this is the most…" or "this is a key…" without specific reference. (Reviewer override.)
- Cross-reference resolution: every prerequisite, variable, concept_path step, and edge target resolves to a real entity.
- Number sanity: in problems, units cancel correctly across the solution; numerical answers have plausible orders of magnitude.

Failed checks block the entity from human review and are reported to the author.

### Stage 4 — Adversarial LLM review (optional, recommended for Category B/C entities)

A *different* model (GPT, Gemini, or a different Claude version) is prompted:

> Review this Atlas entity for physics errors, conceptual mistakes, audience-inappropriate content, and unsupported claims. The entity is intended for [audience]. Be specific. List concrete issues; do not produce a polished critique.

The output is appended to `provenance.review_notes` as a `[adversarial-review]` annotation. The human reviewer reads this output before their own review.

This is cheap (one API call per entity) and consistently catches errors the first model missed. Multi-model disagreement is a high-signal flag for human attention.

### Stage 5 — Human review

The reviewer reads the draft with the adversarial review (if performed) alongside. Review burden by task category:

- **Category A fields**: skim for tone and obvious errors.
- **Category B fields**: read in full; verify against canonical source if uncertain.
- **Category C fields**: rederive independently; treat draft as starting point.
- **Category D fields**: replace any LLM content with the reviewer's own writing.

The reviewer edits in place, sets `human_reviewed_at`, `human_reviewer`, and `review_notes` (briefly capturing what they changed and why), and promotes to `review_state: "reviewed"` or `"published"`.

### Stage 6 — Promotion to published

`"reviewed"` entities are visible with `?include=draft` URL parameter; `"published"` entities are visible by default. The promotion to `"published"` is a deliberate second pass after a cooling-off period (≥ 24 hours) where the reviewer rereads the entity with fresh eyes. Many physics errors slip past the first read but jump out on the second.

---

## Prompt library

Templated prompts for each entity type. These live in `/authoring/prompts/` in the repo, version-controlled, and improve over time as failure modes surface.

### Concept entity prompt (template)

```
You are drafting a concept entity for Atlas, a physics knowledge graph
emphasizing principle application over equation memorization.

Pedagogical anchor (binding constraint):
"""
{ANCHOR}
"""

Audience: {AUDIENCE}
Domain: {DOMAIN}
Concept type: {law | principle | equation | definition | theorem}

Produce JSON matching the v3 concept schema. Critical requirements:

- The `principle` field must state what the law claims in one sentence,
  in plain language, BEFORE the equation. Example: "Force is the rate of
  change of momentum." NOT "F = ma."
- `applicability_conditions` must be honest and specific. State regime
  boundaries explicitly (v<<c, m>>atomic scale, classical regime, etc.).
  At least one condition. Avoid the word "always."
- `limiting_cases` should examine R→0, R→∞, m→0, t→∞, or analogous
  boundaries. State both the mathematical limit and its physical meaning.
- `misconceptions` should reference real student wrong-models documented
  in physics education research, not strawmen. If you don't know specific
  PER misconceptions for this concept, leave the array empty rather than
  inventing.
- `variables` must reference variable IDs that exist in variables.json.
  Do not invent variable IDs.
- `prerequisites` should suggest concepts but use placeholder IDs that
  the reviewer will resolve. Output prerequisite suggestions as a separate
  list outside the JSON.

Do not use the words "fundamental," "deep," "intuitive," "obvious,"
"essentially," "simply," or "of course" anywhere in the output. These are
LLM tells.

If you are uncertain about any field, output `null` and add a note in a
`questions_for_reviewer` array outside the JSON, stating the specific
uncertainty.

Output: the JSON entity, followed by a `questions_for_reviewer` list
(may be empty), followed by a `prerequisite_suggestions` list.
```

### Problem entity prompt (template)

```
You are drafting a problem entity for Atlas.

Pedagogical anchor:
"""
{ANCHOR}
"""

Activates concepts: {CONCEPT_LIST}
Audience: {AUDIENCE}
Difficulty target: {DIFFICULTY 1-5}
Problem type: {worked-example | practice | conceptual | challenge}

Produce JSON matching the v3 problem schema.

Critical:

- The `concept_path` is the ORDERED sequence of concepts a solver
  traverses. This is the most important pedagogical structure in the
  problem. Each step states what the solver does at that step.
- Show your work explicitly in the `solution` field. A reviewer will
  rederive your solution; clarity of intermediate steps is essential.
- Numerical answers: state units. State assumed values explicitly.
- `common_errors` should be REAL student errors, not generic study advice.
- `audience` tags must be honest. If the problem requires calculus, do
  not tag it as suitable for an algebra-based course.

If your numerical answer is uncertain, mark it as such and explain.

Do not invent values for physical constants you do not remember exactly;
either use a symbol (e.g. `c`, `e`, `k_B`) or state "approximately" with
a clearly-marked imprecise value for reviewer correction.

Output: JSON entity, then `questions_for_reviewer` list.
```

### Adversarial review prompt (template)

```
You are reviewing the following Atlas physics entity for errors. The
entity was drafted by another LLM for {AUDIENCE} audience.

Find errors. Be specific. Do not produce a polished review. Do not
hedge. If something is wrong, say what is wrong and why.

Categories of error to check:
1. Physics correctness (laws applied outside their regime, sign errors,
   dimensional inconsistencies, conceptual mistakes).
2. Audience inappropriateness (calculus in algebra-based content,
   advanced terminology in intro content, oversimplification of
   advanced content).
3. Misconception field: are the wrong_models real, documented student
   errors, or invented?
4. Limiting cases: do the limits actually hold, or are they
   superficially-plausible-but-wrong?
5. Variable/dimension consistency.
6. Numerical answers (rederive any).
7. Hedge words and over-generalizations.

Entity follows:

{ENTITY_JSON}

Output a numbered list of specific issues. Empty list if nothing wrong.
```

---

## Review acceleration

### Reviewer dashboard (Phase 3b deliverable, not Phase 4)

A simple `/review` route (gated by `?include=draft` or local-only access) shows:

- Entities in `review_state: "draft"` sorted by oldest draft first.
- Entities flagged by drift checks.
- Entities with adversarial review notes pending reviewer attention.
- Entities in `"reviewed"` state past the 24-hour cooling-off, ready for promotion.

Each row links to the entity's panel with edit affordances (or a "copy review template" button for now — full inline editing waits for Phase 4 CMS).

### Batch review patterns

Reviewers handle entities in domain-coherent batches (all E&M concepts together; all PHY 132 labs together) rather than mixing domains. Context-switching is the dominant cost; per-batch warmup is real.

### Sampling-based QA at scale

Once Atlas exceeds ~150 entities, full re-review every term is impractical. The QA pattern shifts to:

- Random sample 10% of `published` entities per quarter for full re-review.
- Whenever a misconception or error is found in any entity, automatically queue similar entities (same domain, same concept neighborhood) for review.
- Student-reported errors (Phase 4 feedback channel) bump the cited entity to top of review queue.

---

## Public transparency

The Atlas footer includes a link to `/about/authoring` describing this workflow in plain language. Key messages:

- Atlas content is reviewed by physicists.
- Some content is first-drafted by LLMs to scale authoring; every published entity has been read in full by a human reviewer.
- Each entity's panel shows its provenance — who drafted it, when, and when it was last reviewed.
- Errors can be reported via [contact / GitHub issues]; reported errors trigger re-review.

This is the public-tool ethos made operational. It also pre-empts the "are you sure this is correct?" question that any thoughtful student or instructor will ask.

---

## Anti-patterns

Things this spec deliberately forbids.

### Don't auto-publish LLM drafts.

No path exists, anywhere, in any pipeline, by which an LLM-drafted entity reaches `review_state: "published"` without a human reviewer's signature in `human_reviewer`. This is not a default to be overridden; it is a hard rule.

### Don't trust LLM citations.

LLMs hallucinate references. If a draft cites a paper, textbook, or specific result, the reviewer verifies the citation exists and says what the entity claims it says. No "well, it sounds plausible" promotions.

### Don't let the LLM choose what's worth teaching.

LLMs over-include. They will draft entities for "Newton's apple anecdote" or other low-pedagogical-value content if asked open-endedly. The pedagogical anchor is the constraint that prevents content sprawl.

### Don't loop LLM output into LLM input without human-in-the-middle.

Tempting workflow: "use the existing graph as context for the LLM to draft new entries consistent with the corpus." This compounds errors. A wrong applicability condition in one entity propagates to ten more if used as context. Until the corpus is fully human-reviewed, do not use it as LLM context for further drafting.

### Don't use LLMs for `ta_notes`.

TA notes capture institutional knowledge from running the lab. LLMs don't have this knowledge. Generated TA notes are confidently bland and pedagogically empty. Required: TAs author `ta_notes` from real run-of-show experience.

### Don't generate misconceptions without a PER source.

The misconceptions field is high-leverage *if real*, actively harmful if invented. LLMs can suggest plausible-sounding student wrong-models that no actual student has ever held. Reviewer rule: every published misconception either traces to a known PER source (FCI, BEMA, CSEM, or peer-reviewed PER literature) or to first-hand classroom observation. Plausibility alone does not qualify.

### Don't conflate review with editing.

Reading an LLM draft and accepting it because it sounds right is not review. Review means: did I, the reviewer, verify this claim? If the answer is no, it is not reviewed.

---

## Phase 4 implications

When Phase 4 ships the AI tutor (RAG-grounded on Atlas), the provenance schema becomes a correctness boundary:

- Tutor RAG is restricted to `review_state: "published"` entities.
- Tutor system prompt explicitly instructs the model to refuse questions whose answers depend on `"draft"` or `"reviewed"` (but not promoted) content.
- Tutor responses include provenance attribution: "This concept was last reviewed by [human_reviewer] on [date]."
- Student-reported tutor errors trigger re-review of the cited entities, not retraining.

This is how Atlas remains pedagogically trustworthy as it scales into AI-mediated student interaction. The discipline established in 3b is the foundation of 4's safety.

---

## Schema implementation timing

Provenance metadata is added in **Phase 3a Session 7** (the authoring metadata session) — earlier than Phase 3b — so that Phase 3b authoring begins with the full pipeline in place from the first new entity. The 10 existing concept nodes are migrated to include `provenance` with `draft_source: "human"` and the historical author/date. No retroactive LLM provenance is fabricated.

---

## Notes for collaborators (Austin + TAs)

- **Anchors take longer to write than expected and are worth every minute.** A weak anchor produces a weak draft no matter how good the LLM is. Five minutes on the anchor saves an hour of rewrite.
- **Trust the drift checks.** When the hedge-word detector flags "fundamental," it is almost always right that the field needs rewriting.
- **Adversarial review is cheap; use it always for Category B and C content.** Two API calls per entity is negligible cost for a meaningful error-catching boost.
- **Cooling-off discipline is real.** The 24-hour wait between `"reviewed"` and `"published"` is not bureaucracy. Errors slip past tired eyes.
- **TA contributors should start with Category A tasks** (drafting misconceptions, descriptions, lab equipment lists) until calibration with the review process is established. Category B and C tasks come after.
- **When in doubt, don't publish.** The `"reviewed"` state exists to hold content that the reviewer wants to think about more. There is no penalty for entities sitting in `"reviewed"` indefinitely.
