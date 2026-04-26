# About Atlas

## Vision

Atlas is the spiritual successor to HyperPhysics: a structured, explorable map of physics knowledge. Where HyperPhysics offers static images and prose, Atlas is an interactive multi-layer graph — concepts, variables, problems, labs, and the canonical experiments that established the laws — connected by typed, weighted edges and rendered with proper equations, embedded simulations, and cross-domain links. The experience is closer to exploration than reference lookup: you enter a domain, follow a connection, and find yourself deeper than you meant to be.

But Atlas is not just HyperPhysics with better graphics. It is built around a single pedagogical claim:

> Physics is too often taught as equation-picking — given a problem, find the formula that fits. It is *learned*, when it is learned at all, as principle-application — recognize the situation, identify the governing principle, decide whether it applies, derive the consequence. The gap between those two modes is where students lose the subject.

Atlas closes this gap by structuring its content around the questions principle-application thinking actually asks:

- *What does this concept mean?*
- *What should I understand first? What does it unlock next?*
- *When does this principle apply, and when doesn't it?*
- *What experiment established it?*
- *Where does this same variable appear in other concepts?*
- *What problem can I solve with it, and at what difficulty?*
- *What lab activity makes it concrete?*
- *Can I build the map myself, from the bottom up, and have it agree with the canonical one?*

The last question is the one that turns Atlas from a reference into an instrument. Reading a structured map of physics is useful; *constructing* one is where conceptual organization is forged and tested. Atlas supports both modes from the same artifact.

Every concept carries explicit applicability conditions, limiting cases, and the common student misconceptions documented in physics education research. Cross-domain isomorphism edges — SHM ↔ LC oscillator ↔ pendulum, transport laws across thermodynamics and electromagnetism, Noether-consequence links from continuous symmetries to conservation laws — show students that physics is not a list of separate topics but a small set of structures appearing in different costumes.

## Multi-layer graph

Atlas is not a single graph. It is a stack of co-existing graphs over a shared layout:

- **Concepts** — laws, principles, equations, definitions, theorems.
- **Variables** — symbol-level identities tracked across every concept they appear in.
- **Problems** — worked examples and practice problems, each with an ordered "concept path" tracing the principle-application route to the solution.
- **Labs** — experimental activities aligned to ASU's PHY 114 and PHY 132 sequences.
- **Experiments** — canonical empirical results (Cavendish, Millikan, double-slit, Michelson-Morley, Davisson-Germer) linked to the concepts they established.

Layers are individually toggleable. Default view is concepts only. Cross-layer edges are first-class: a problem activates concepts; a concept appears in a lab; an experiment establishes a law.

## Dual mission

Atlas serves two audiences from the same artifact:

- **Public reference and exploration tool** — free, open, web-native, for any learner who would otherwise reach for HyperPhysics, Wikipedia, or a textbook PDF.
- **Curriculum-aligned support tool** — referenced weekly by ASU PHY 114 and PHY 132 students and TAs alongside the lab sequence; eventually integrated with Canvas via LTI. Beyond reference, Atlas is also a *learning instrument*: students construct their own concept maps from a curated node set, draw the connections they believe exist, and exchange annotated submissions with peers and TAs. The constructive mode produces gradeable evidence of conceptual organization that no closed-form quiz can.

These missions stay coherent because the underlying graph is the same. Institutional features (accounts, analytics, assessment-driven progress) are built on top of the public artifact, never displacing it. A curious adult, an AP physics student, an ASU pre-med, and a graduate student preparing to TA all see the same graph; the institutional layer adds context without gating content.

## What Atlas is not

- **Not a quiz engine.** Atlas reads assessment outcomes from Canvas via LTI; it does not duplicate Canvas's quiz infrastructure.
- **Not a textbook replacement.** Atlas is a navigational and conceptual layer over physics knowledge, not a substitute for systematic instruction.
- **Not a black-box recommender.** Pedagogical transparency is a design constraint: students and instructors can always see why a connection exists, why a node is highlighted, and what evidence supports a claim.
- **Not an LLM-generated content farm.** LLMs accelerate first-draft authoring; every published entity is reviewed in full by a physicist. Provenance — who drafted, with what assistance, when reviewed, by whom — is public on every entity.

## Long-term north star

- Graduated student progress tracking across the multi-layer graph — self-report in early phases, assessment-driven through Canvas LTI in later phases, never fabricated by the system.
- An AI tutor grounded in the graph as a structured RAG corpus, restricted to human-reviewed content, with provenance attribution on every response.
- Instructor tools for cohort frontier views, concept-level struggle signals, and per-lab readiness reports.
- A TA-collaborator content pipeline that turns the graph itself into an ongoing curriculum-development project, with TA contributions attributed and reviewable.
- A maturing concept-map construction practice: weekly assignments, in-class small-group activities, peer-review loops, and pre-instruction diagnostic maps — all producing structured, longitudinal evidence of conceptual organization across cohorts. With opt-in consent and anonymization, these submissions form a physics-education research corpus of a kind few institutions currently possess.
- An integration surface for companion platforms — PhET simulations, lab data acquisition systems, open problem repositories, and other physics education tools that benefit from a shared structural backbone.

The constant across all of this: Atlas remains a free, open, principle-first physics knowledge graph that any student can use without an account, on any device with a browser, anywhere in the world.

## What success looks like

A student stuck on a Faraday's-law problem opens Atlas, finds the concept, reads the principle in one sentence, sees the explicit applicability conditions ("changing magnetic flux through a closed loop, in any reference frame"), notices the link to Lenz's law next door, sees that this exact integral form appears in three other places they've already studied, finds a worked example with a step-by-step concept path, and watches the principle-application animation trace the route from "loop + changing flux" to "EMF, with this sign." They close the tab, finish the problem, and remember next week not the equation but the *recognition* — that this situation calls for *that* principle. That is the artifact in *reference mode*, working as designed.

A second student — a PHY 132 lab group, three students sharing a screen — opens the week's construction-mode assignment. The node bank holds eight concepts: Ohm's law, RC circuits, capacitance, exponential decay, Kirchhoff's voltage law, current, voltage, time. They drag the concepts onto the canvas, argue briefly about whether capacitance is foundational to RC circuits or only supporting (it's foundational), draw the edges they agree on, and submit the file. Two days later their TA returns it with five inline annotations: three approving, one pointing out a missed prerequisite, one asking a leading question about whether Kirchhoff's law is really lateral or actually foundational. The group reopens the file, replies to each annotation, redraws the contested edge, and resubmits. They do not remember every detail of the resulting map. They remember the *argument* — and next month, when the exam asks them to derive the time-constant of an RC circuit from first principles, the structure of that argument is what they reach for. That is the artifact in *construction mode*, working as designed.

The same graph, the same data, two different pedagogical instruments. One artifact.

---

## Companion documents

This document is the philosophical north star. Architectural and implementation specifics live in companion documents:

- `ATLAS_MAIN_SPEC.md` — architectural principles, phase roadmap, schema and validation principles, authoring discipline.
- `ATLAS_PHASE3A_SPEC.md` and `ATLAS_PHASE3B_SPEC.md` — phase-specific build plans.
- `ATLAS_AUTHORING_SPEC.md` — the LLM-in-the-loop content pipeline and provenance discipline.

Phase-agnostic addendums refine specific capabilities across phases:

- `ATLAS_REVEAL_NEIGHBORS_SPEC.md` — neighbor discovery, ZPD rank-ordering, latent-content indicators.
- `ATLAS_NODE_AFFORDANCES_SPEC.md` — concept-node legibility, domain encoding, hover-peek affordance.
- `ATLAS_LAYOUT_AUTHORING_SPEC.md` — interactive layout authoring and per-user layout persistence.
- `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md` — the construction-mode pedagogical primitive described in this Vision.

Read this document first; read the addendums when implementing the capabilities they cover.
