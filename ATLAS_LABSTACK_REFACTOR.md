## LabStack Vibe Review

1. Intent Summary
Stripping away every implementation detail, LabStack is trying to be three things wearing one trench coat:

An authoring tool for instructors to compose typed, structured lab worksheet templates — a set of section plugins (text, prediction, response, data table, Desmos, PhET, image, free-draw, MC, panel-launch, video) with rubrics, points, hints, and pedagogically-scaffolded gating (predict-before-hint, draft-before-hint).
A student runtime that takes a template, hosts the experience, captures answers + behavioral telemetry (time-on-section, hints revealed, paste events, confidence), and produces a durable artifact (PDF) plus a server-side submission.
An instructor dashboard for reviewing submissions, telemetry, and risk signals across a large-enrollment course.

The pedagogical core — the part I genuinely care about as the designer — is the contract between a section-type's schema, its student interaction, its rubric, and the evidence it produces. Everything else (Desmos, PDF, integrity theater, panel layout) is plumbing.
2. Abstract System Model
Three first-class entities that the current code mashes together:

Template — pure, immutable instructor-authored definition. A name, course/experiment metadata, an ordered list of Sections, and configuration (paste blocking, dictation, panels). Portable as a signed JSON document. Has no student data.
Attempt — a student's stateful work against a specific Template version. Append-only event log of answers, hint reveals, focus/blur, pastes, with a derived "current value per section." Owned by the student device, replicated to server.
Section — a closed, polymorphic kind. Each kind is fully described by a small bundle of: Schema (Zod) → Editor (instructor view) → Player (student view) → Extractor (Attempt → answer payload) → Reporter (PDF/print) → Telemetry (what counts as a "revision," what counts as "complete"). Today these concerns are scattered across a 700-line SectionCard, an 1800-line page, and a 1500-line pdfExport.

Constraints worth naming out loud: ~1500 students/semester means submissions are O(10⁴) per term with a long tail of multi-MB attachments; offline tolerance is non-negotiable for a 50-min lab; instructor "anti-cheating" expectations exceed what a browser can actually deliver, so the architecture must give credible server-side provenance instead of client-side theater.
3. Key Issues Identified (informing — not constraining — the redesign)
Three structural things, not nitpicks:

Conflation of three lifecycles. Worksheet carries studentInfo, sections (template), phetSimulations (template), activeSimulationIndex (UI), digitalSignature (attempt artifact), templateIntegrity (template provenance), and a cachedScreenshot per section (transient render output). Every persistence rule has to be a special case because the data model has no spine.
Polymorphism by switch-statement. 11 section types managed via a single discriminated union that gets switch-ed in a dozen places (rendering, PDF, extraction, telemetry, completion logic). Adding a 12th type requires touching at least 7 files. The migrateSection and migrateRubric functions, two competing rubric schemas, and "downgrade-then-upgrade" round-tripping are the symptoms.
Persistence is a leaky implementation detail. LocalStorage is both the source of truth, the cache, and the offline buffer; quota overflow is handled by ad-hoc field stripping; submissions are fire-and-forget; binary blobs (image uploads, free-draw PNGs) ride along inside JSON. There is no "save" abstraction — every component calls setWorksheet(prev => …) directly and depends on a useEffect to flush.

Plus a fourth that's a category of its own: client-side integrity is theater. DevTools detection, paste blocking, JSON hash signatures — these are signals worth recording for risk scoring, but they are not enforcement and the architecture should stop pretending they are.
4. Proposed Architecture (Clean-Slate)
I want to design from three principles in order: typed pedagogical contracts, separation of authoring vs runtime vs review, honest persistence. Everything below falls out of those.
4.1 The shape
Three deployables, one shared spine:
labstack/
├── packages/
│   ├── core/              ← schema + section registry + types (no React)
│   ├── sections/          ← one folder per section kind (plugins)
│   ├── persistence/       ← storage drivers (idb, fs, http)
│   ├── pdf/               ← deterministic, section-driven renderer
│   └── integrity/         ← risk scoring + provenance (pure functions)
├── apps/
│   ├── studio/            ← instructor authoring app (was /build)
│   ├── lab/               ← student runtime app   (was /lab)
│   └── console/           ← instructor dashboard  (was /admin)
└── server/
    ├── api/               ← thin REST/RPC handlers
    └── domain/            ← submission, telemetry, risk pipelines
The three apps share the section registry via a workspace package. They do not share a 2000-line page component.
4.2 The typed contract
The single most important file in the new system is the SectionKind interface. Each section type implements it once, and every other layer in the system asks the registry rather than switch-ing on type.
ts// packages/core/section-kind.ts
export interface SectionKind<Spec, Answer, Evidence> {
  id: string;                                           // "data-table", "desmos", …
  label: string;
  icon: ComponentType;

  spec: ZodType<Spec>;                                  // instructor-authored shape
  answer: ZodType<Answer>;                              // student-produced shape
  defaults(): Spec;

  Editor: ComponentType<EditorProps<Spec>>;             // instructor view
  Player: ComponentType<PlayerProps<Spec, Answer>>;     // student view
  Print:  ComponentType<PrintProps<Spec, Answer>>;      // server/PDF view (no DOM events)

  extract(spec: Spec, answer: Answer): Evidence;        // answer → graded payload
  isComplete(answer: Answer): boolean;                  // for progress
  telemetryHooks?: SectionTelemetryHooks<Answer>;       // what counts as revision, etc.

  rubric: RubricBinding<Evidence>;                      // schema-aware rubric, see §4.4
}
That replaces the current splatted concerns: extractStudentAnswers in pdfExport.ts, the STUDENT_INPUT_SECTION_TYPES set in WorksheetBuilder, the per-section if (s.type === 'desmos') … strip-screenshot logic, and the bespoke migrateSection ladder. All of those become "the registry knows."
4.3 The three lifecycles, finally separate
ts// Template — authored once, immutable from the runtime's perspective
interface Template {
  id: TemplateId;                  // ULID
  schemaVersion: 2;
  meta: { title: string; course: string; createdAt: ISODate };
  sections: { kind: string; id: SectionId; spec: unknown }[];
  panels: PanelConfig[];           // PhET / video / desmos panels declared once
  policies: { paste: 'allow'|'flag'|'block'; dictation: boolean };
  rubric: TemplateRubric;
  provenance: { instructorId: string; signature: string };  // server-issued
}

// Attempt — student work-in-progress, append-only events + materialized state
interface Attempt {
  id: AttemptId;                   // ULID, per device session
  templateId: TemplateId;
  templateVersion: number;
  studentRef: { hash: string };    // never PII at this layer
  startedAt: ISODate;
  answers: Record<SectionId, unknown>;        // materialized
  events: AttemptEvent[];                     // append-only behavioral log
  attachments: Record<AttachmentId, BlobRef>; // images / drawings live elsewhere
  status: 'in_progress'|'submitted'|'finalized';
}

// Submission — what hits the server, immutable, server-witnessed
interface Submission {
  id: SubmissionId;
  attemptId: AttemptId;
  studentInfo: StudentInfo;        // PII enters here, server-side only
  evidence: Record<SectionId, Evidence>;
  telemetry: TelemetrySummary;
  risk: RiskScore;
  receivedAt: ISODate;
  serverSignature: string;
}
The instructor never sees an Attempt's local-only state; the student never modifies a Template; the server only ever stores Submissions and an opaque telemetry stream.
4.4 Rubric, simplified to one schema
One schema, version-tagged. No bidirectional migration. The rubric is bound to the section kind — rubric: RubricBinding<Evidence> — so a Data Table section's criteria can reference column ids, a Response section's can reference items, a Desmos section's can reference fit parameters. Migration becomes one-way only: legacy V1 → current. There is no "downgrade" code path, because the editor speaks the current schema natively. (The current downgradeToV1Rubric → migrateLegacyRubric round-trip — which is silently destroying tolerance percentages and derivation formulas — is the single biggest data-loss bug in the codebase. It deserves to be deleted, not patched.)
4.5 State management
Three layers, plain and boring:

Document store — a Zustand (or Valtio) store per app holding the current Template (Studio) or Attempt (Lab). Pure in-memory; immutable updates produce CRDT-friendly patches. Undo/redo is a generic patch stack, not a feature wedged into a hook.
Persistence driver — interface with three implementations: IDBDriver (durable local), FileDriver (download/import JSON), HTTPDriver (server). Big binary attachments are stored as Blobs in IndexedDB and referenced by hash; the JSON document carries BlobRefs, not data URLs. Quota is handled by the driver, not by every page.
Sync engine — for Lab, an outbound queue (pending → in_flight → acked) that drains every N seconds and on visibilitychange. Submissions are durable before the user sees a "submitted" toast. The PDF export is decoupled from the submission entirely — they're independent side effects, each retryable.

This kills the localStorage.setItem(JSON.stringify(worksheet)) pattern, the hand-rolled cachedScreenshot-stripping, the 5MB quota cliff, and the silent submission loss in one move.
4.6 Honest integrity
Drop the LARP. Replace with three things that actually work:

Server-issued template signatures. A template is "official" iff the server has signed its hash. Lab refuses to load unsigned templates in production. Instructors export signed JSON; integrity is a property of the artifact, not a hash recomputed on the student's machine.
Server-side submission witness. Every submission gets a server timestamp + server signature at receive time. That is the receipt. The student PDF is a courtesy, not the submission.
Telemetry-as-signals, not gates. Paste, devtools, focus loss, hint speed — all recorded, none blocking. Risk scoring (current computeRiskScore already lives server-side, which is correct) becomes the only consumer. The "DevTools watermark on the PDF" is removed because it's both bypassable and confrontational; if a paste happens, log it server-side and surface it in the Console.

4.7 The dashboards
Studio and Lab are routed separate apps, not routes inside one bundle behind a BuildGate. They have different threat models, different bundles (Lab doesn't need the rubric editor, Studio doesn't need anti-paste), and different deploy cadences. They share the section registry via the workspace package; they share nothing else. This also makes the "code is in the same repo as the answer key" smell go away — the rubric ships in the Studio bundle and on the server, never on the student device.
Console (admin) is its own app behind real auth, not "set a passphrase env var." Replace passphrase-with-'dev'-fallback with proper SSO (ASU has Shibboleth/OIDC; use it).
4.8 PDF generation
Two changes:

Section-driven, not switch-driven. pdf package walks the document and asks each section's Print component to render a deterministic React tree → react-pdf or server-rendered HTML → Chromium for PDF. Rendering a Desmos graph on the server is genuinely hard; for that case, embed the cached SVG/PNG that the Lab already captured. Either way, the layout code lives in one place per section, not in a 1500-line monolith.
Server-side rendering option. For submissions, the server can produce the canonical PDF from the Submission. Student-side PDF becomes a convenience preview; it stops being load-bearing for the integrity story.

5. Implementation Plan
I'd sequence this so the spine goes in first and the existing app keeps running until the new pieces replace it:
Phase 0 — set up the harness (1 week). Monorepo via pnpm workspaces. Add vitest + playwright (currently zero tests — this is the highest-leverage change in the entire refactor). Pick one section kind end-to-end as the worked example: probably Response, since it's the simplest.
Phase 1 — extract core + sections/response (2 weeks). Implement SectionKind, the registry, Zod schemas, and the Response section as a self-contained plugin with Editor/Player/Print/Extract/Telemetry. Wire it into the existing WorksheetBuilder as one section type only, alongside the legacy switch. Prove the contract works.
Phase 2 — port remaining 10 sections, one per PR (~3–4 weeks). Each section: schema, three components, extract, telemetry, rubric binding, smoke test. Delete the legacy switch branch as you go. By the end of this phase, WorksheetBuilder is a registry-driven loop and pdfExport.ts is a registry walk.
Phase 3 — split lifecycles (1 week). Introduce Template / Attempt / Submission types and migrate the persisted shape. One-way migration only — downgradeToV1Rubric and friends get deleted. The blob-strip hack disappears because attachments live in IndexedDB.
Phase 4 — sync engine + honest submissions (1 week). Replace fire-and-forget POST /api/submission with the durable outbound queue. Server-side signatures on templates and submissions.
Phase 5 — split the apps (1 week). Move Studio / Lab / Console to separate Vite entries. Delete the BuildGate passphrase pattern; replace with real auth.
Phase 6 — Console rewrite (2 weeks). Pagination + streaming CSV + risk-signal triage UI.
Order matters: tests → registry → sections → lifecycles → persistence → split. If you do persistence before the registry, you'll re-encode the conflated shape into the new store and have to do it twice.
A decent acceptance test for "did the redesign work?": adding a 12th section type should require touching exactly one new folder under packages/sections/ and zero existing files outside the registry.

Atlas already has a Construction Mode that produces gradeable submission artifacts, an annotation/review pipeline, a planned Lab layer in Phase 3b aligned to PHY 114/132, and an explicit long-term goal of being "an integration surface for companion platforms — PhET simulations, lab data acquisition systems, open problem repositories." So the actual question isn't "reference tool vs. lab tool." It's: do these two things share a pedagogical and architectural spine, and if so, where does each end?
1. How does LabStack compare to Atlas?
They're aimed at the same audience (PHY 114 + PHY 132 students and TAs), share a file-based no-backend-until-needed architectural posture, and both produce reviewable artifacts. But they answer fundamentally different questions about the same student.
Atlas asks: can you organize what you know? Its primary verb is construct — drag concepts, draw edges, explain each connection. The pedagogical bet is that articulating relational structure produces durable understanding that recognition-only assessment can't capture. The artifact is a graph snapshot.
LabStack asks: can you execute the procedure that produces evidence of a phenomenon? Its primary verb is perform — predict, observe, tabulate, fit, conclude. The pedagogical bet is that scaffolded data collection plus low-friction analysis tools (Desmos, calculated columns, image upload) produces honest lab work in a 50-minute window. The artifact is a worksheet with embedded data and student responses.
Architecturally, LabStack is also dramatically less mature than Atlas. Atlas has a written authoring discipline, schema-versioning principles, validator severity tables, a documented mode taxonomy, provenance fields baked into every entity, and explicit out-of-scope lists with promotion rules. LabStack has a 1964-line god component, no tests, and "anti-cheating" features that are bypassable in two browser-console keystrokes. Atlas is a project; LabStack is a heroic prototype.
2. Do their ideas overlap?
In several non-trivial places, yes — the overlap is more real than either project's framing admits.
The artifact philosophy is essentially identical. Atlas writes .atlas-map.json files that contain student work, authorship, an annotation thread, and a submission block; the file is the unit of grading and review. LabStack tries to do the same with its template-and-worksheet JSON, but conflates lifecycles (template + attempt + submission share one type) and bolts on hash-based "integrity" instead of leaning on file-as-witness.
The TA review loop is identical in shape. Atlas's annotation block — { target, author, role, body, resolved, parent_id } keyed to edges or nodes — is exactly the structure LabStack would need if it had one. LabStack today has no real review surface; the audit logs paste events and devtools-opens and shows them on an admin page, but there is no per-section TA annotation, no resolution state, no thread structure. Atlas already worked this out.
The provenance story is identical in intent. Atlas mandates author, review_state (draft|reviewed|published), and physics-correctness sign-off on every entity. LabStack reaches for the same thing through SHA-256 template signatures and a custom integrity panel, but does it client-side and incompletely. Same north star, different execution quality.
The audience and Canvas-LTI trajectory are identical. Both target ASU PHY 114/132. Both intend Canvas integration. Both refuse to be quiz engines.
The pedagogical primitive of captured process overlaps but isn't the same thing. Atlas's process capture is the "explain the connection" prompt on every edge — high-signal, content-grounded, low-volume. LabStack's process capture is keystroke-level telemetry plus paste/devtools surveillance — high-volume, low-signal, mostly defensive. They're solving the same problem (how do we know the student actually did the work?) with very different epistemics.
Where they don't overlap is the runtime surface. Atlas has nothing that resembles a Desmos calculator with auto-fit, a CSV-importable data table with calculated columns, a PhET embed, an image upload for handwritten work, or a free-draw canvas. None of these belong inside a knowledge graph, and Atlas's spec explicitly says construction-mode is not a quiz engine. The lab activity itself — the part where a student is taking voltage measurements at 1-second intervals — is genuinely outside Atlas's current scope.
3. Could they / should they integrate?
Yes — but as one ecosystem with one pedagogical philosophy and one shared spine, not a single application. Specifically: I'd rebuild LabStack's intent as a third mode of Atlas rather than as a separate app, and I'd abandon the LabStack codebase to do it.
Three reasons this works:
Atlas already has a Lab layer. Phase 3b activates lab nodes as first-class graph entities aligned to PHY 114/132, with concept-activation edges that "honestly reflect what the lab actually exercises." Right now those nodes are essentially metadata-only — they describe a lab but don't host it. Adding a runtime gives those nodes a meaningful "open" affordance and makes the concept-activation edges authoritative rather than aspirational (because the lab's own answers light up the concepts it actually exercises).
Atlas's discipline is the discipline LabStack needs. Schema versioning, additive-first migrations, validator severity tables, provenance fields, file-as-witness submission, an explicit modes taxonomy, no-backend-until-Phase-4 — these are exactly what would have prevented every P0 bug in LabStack's audit. Re-deriving these in a clean LabStack rebuild is reinventing the wheel; inheriting them from Atlas is a free 6 months of architectural work.
The student artifact ecosystem becomes coherent. Today a student in PHY 132 produces a Canvas quiz attempt, a LabStack PDF, and (in Phase 3b) an Atlas concept-map submission. Three artifacts, three pipelines, three review surfaces, three forms of academic-integrity reasoning. Fusing the lab runtime into Atlas reduces this to two artifacts (Canvas quiz + Atlas-family submission) on one review pipeline, with a single provenance story.
4. How would integration work?
A concrete sketch — and this is the part I'd actually build:
Atlas grows a third mode — Activity Mode — sibling to Reference and Construction, gated by ?mode=activity&lab=<lab-id>. The mode banner reads "Activity mode — running [lab title]." It is mutually exclusive with the other two modes and writes to its own localStorage namespace.
Lab nodes in Phase 3b's lab-layer schema gain an optional activity_bundle field — a section-typed worksheet definition using the same vocabulary LabStack tried to settle on (objective / response / data-table / desmos / image-upload / prediction / panel-launch / etc.). The bundle is authored as JSON-in-repo just like canonical concept content, reviewed via PR, and ships in the Atlas corpus rather than as a free-floating template file.
The runtime is a new Atlas package — packages/sections/ — implementing each section type as the typed plugin contract I sketched in the previous redesign: Schema, Editor, Player, Print, extract, isComplete, telemetryHooks. The section registry is the spine; everything else is registry-driven walks. This kills the LabStack god-component problem at the architectural level rather than the file level.
Submissions produce .atlas-lab-attempt.json — same outer envelope as .atlas-map.json (format, format_version, authors, exporter, annotations, submission block), with the inner payload being section-typed answers + telemetry instead of nodes/edges. A single validateAtlasArtifact() covers both file types; a single TA review surface annotates both. Canvas LTI in Phase 4 ingests both through the same channel.
Concept activation becomes self-witnessing. When a student submits a lab attempt, the concepts the lab claimed to activate are no longer aspirational — the answers themselves provide evidence. A lab claiming to exercise "RC time constant" but whose attempt files never produce a τ-shaped fit parameter is a curriculum bug Atlas can now surface. This is the kind of feedback loop that justifies fusing them rather than running them in parallel.
Process capture replaces theater with signal. Drop the devtools-watching, paste-blocking, hash-checking integrity LARP. Replace it with two things: server-witnessed submission timestamps (when Phase 4 lands), and Atlas-style "explain your reasoning" prompts on the same edges where Atlas already uses them — at the moment a student writes a prediction, at the moment they fit a curve, at the moment they conclude. The prompt-on-evidence is the academic-integrity surface; it's also the pedagogical surface. They are the same surface.
The split between modes stays clean: Construction mode is "argue for your conceptual organization." Activity mode is "execute the procedure that produces evidence." Reference mode is "look it up." All three write artifacts in the Atlas family; all three flow through the same review and Canvas-LTI pipelines.
5. So: do we abandon LabStack the codebase?
Yes. Abandon it.
Not because the intent was wrong — the intent was right and it's why you built it — but because (a) the implementation has accumulated enough structural debt that an in-place refactor is more expensive than a clean rebuild against a better foundation, and (b) that better foundation already exists and is yours, in Atlas. The right move is to take the things LabStack got pedagogically right (the section-type vocabulary, the prediction-then-reveal scaffolding, the Desmos auto-fit-with-overlay PDF idea, the data-table-to-graph linking, the progressive-hints-with-draft-gating affordance) and rebuild them as Atlas Activity Mode against Atlas's spine.
What I'd salvage from LabStack, file by file: the WorksheetSection discriminated union as a starting vocabulary for section types (not the implementation, just the shape), the PhET catalog in phetSimulations.ts, the formula parser in formulaParser.ts, the CSV parser, the auto-fit-viewport math from the Desmos component, and the rubric V2 schema (the V1 is corpse, V2 is salvageable). Total: maybe 1500 lines of pure logic that ports cleanly into a new package. Everything else — the page components, the persistence, the integrity theater, the dual rubric migration, the entire client-side surveillance apparatus — gets deleted.
The rebuild fits inside the Atlas Phase 3b/3c roadmap rather than running parallel to it. You already have a lab layer planned; adding the runtime is the natural extension of "what does it mean to open a lab node?" — a question Atlas needs to answer anyway.
The honest summary: LabStack was a separate project because Atlas wasn't far enough along to host it. That's no longer true. Phase 3b lands the lab layer; the runtime is the obvious next move; and merging the two roadmaps means you stop maintaining two architectures, two file formats, two review pipelines, and two integrity stories. 



Process is key. The future of education will not create systems in which students optimize for "earning points;" rather, students will learn skills and meet learning outcomes. Similarly, students in physics often pass the class by "picking equations" when instead they should be "applying principles." 

To capture a student's state of understanding, the process of their learning itself must become an artifact (not just the final result). 

I'm envisioning a  self-contained curriculum within Atlas where students complete activities intended by the LabStack framework, and where the results of those activities form the evidence for each concept node's mastery level advancing; after a certain mastery level, the next nodes (and their associated activities) are unlocked. 

I also think lab activities themselves can become a combination of Atlas's concept maps and LabStack's intended package (intro/sim/theory/procedure/data/graphs/answers). Within a lab activity, the student progresses through node by node in the same way as the LabStack sequence. In Atlas, the process of completing the lab itself can be represented in map form!

Voice notes should also be considered as evidence. This is generalizable across the platform. Students could complete an activity, create a node, or draw an edge; each time, they are prompted to record a short stream-of-consciousness thought accompanying it. Voice notes are flagged for later review by a human, which are appended by a voice note from the TA.



Claim 1 — "Process is the artifact"
Gold. Already half-built. Just needs naming.
This isn't a new direction for Atlas; it's the direction Atlas was already heading and hadn't quite said out loud. The construction spec already calls submissions "discussion artifacts, not final answers." The vision doc says construction-mode work produces "structured, longitudinal evidence of conceptual organization." The authoring spec puts provenance — who drafted, with what tooling, when, reviewed by whom — into the schema as a first-class concern, for canonical content. The "explain the connection" prompt on every edge is process-as-artifact in microcosm.
What's missing is the policy commitment: student work in Atlas inherits the same provenance discipline as canonical content. Every annotation a student writes, every edge they draw, every voice note (if you do them — see Claim 4), every reasoning step — gets timestamped, attributed, and preserved as part of the submission. The submission is not a snapshot of final answers; it's a transcript of the student's reasoning trajectory, with all the reasoning steps still legible.
This is also where the philosophical alignment with your principle-application thesis lives. Your prompt said "the future of education will not create systems in which students optimize for earning points; rather, students will learn skills and meet learning outcomes." That's exactly what process-as-artifact enables — it's not gradeable on a points scale because it's not a number; it's evidence that has to be read. The grading shifts from "how many points did the answer earn" to "what does this trajectory tell us about whether the student is reasoning from principles?" That's a load that humans can carry and machines cannot fake.
So: keep this. Make it explicit in a new section of the construction spec. Generalize it across all student-produced artifacts in Atlas. Fold LabStack's intent under it.
Claim 2 — "Mastery-gated curriculum where activity completion advances nodes and unlocks the next ones"
Half gold, half trash. The literal version contradicts Atlas's stated principles AND is pedagogically risky. The right version is one move away.
The Atlas specs are unusually explicit about this. ATLAS_MAIN_SPEC.md says graduated understanding scale is self-report in Phase 3a and supplemented by Canvas-LTI assessment evidence in Phase 4 — "resist any temptation to overload 'apply' with 'passed a quiz' — that's a different signal type and gets its own field later." Construction spec says explicitly: "Atlas does not auto-assign grades." The vision doc says "graduated student progress tracking ... never fabricated by the system."
These are not arbitrary constraints. They protect against three failure modes:
First, gamification capture. The moment the system says "complete activity X to unlock node Y," students stop optimizing for understanding and start optimizing for unlocks. This is exactly the failure mode you named — students optimizing for points instead of skills. Mastery-gated curricula are the highest-fidelity points system ever built, and they reproduce the pathology in a more sophisticated wrapper. Khan Academy's mastery system, ALEKS, Knewton — these have all run this experiment. The result is consistent: students learn to game the gate, not the content.
Second, correctness laundering. If completing an Atlas-internal activity automatically promotes a node from "recognize" to "apply," then Atlas is making a claim about the student's understanding based on Atlas's own auto-assessment — which Atlas's own spec correctly identifies as something Atlas is bad at and refuses to do. The schema would carry "apply" states that mean "the student clicked through enough screens," which is what you specifically said you don't want.
Third, ablation of human review. The TA-annotation loop is the pedagogical core of construction mode. Auto-mastery gates make TAs optional, which makes them get cut, which removes the only signal in the entire system that's actually grounded in human pedagogical judgment.
But there's a version of this idea that is aligned with Atlas's principles, and I think it's what you actually want once you push on the mechanism:
Suggested-readiness, not gated-access. Every node remains accessible at all times — the public-tool ethos is non-negotiable, and "you haven't unlocked this yet" violates it. Instead, evidence accumulates and the system suggests what the student is ready for next. Evidence comes from four sources, in increasing weight: self-report (free, low-fidelity), Canvas-LTI assessment (Phase 4, asymmetric — one external signal carries more weight than ten self-reports), TA-reviewed activity submission (high-weight, slow), and instructor sign-off (highest-weight, rarest). The graduated understanding scale you already have (unseen | seen | recognize | apply | derive) is the surface this evidence promotes. Activity completion produces evidence, not promotion. A TA reading the submission is what promotes "apply" → "derive."
The next-activity affordance becomes "here's what your evidence suggests you're ready for," not "you have unlocked the following content." Same UI motion, completely different epistemics. This preserves principle-application thinking, preserves the human-in-the-loop, preserves the public-tool ethos, and gives you the curriculum-progression feel you want.
Concretely: the Atlas Lab node for Lab 4 would say "Recommended after: ohms-law (apply) + capacitance (recognize). Your current state suggests you're ready for this lab." Lab 5 — the one that builds on Lab 4 — would not be hidden; it would just say "Most students benefit from completing Lab 4 first." A motivated student can skip ahead. A struggling student gets a clear signal. The system does not pretend to know better than the student about their own readiness.
That version I'd build. The auto-gated version I would not.
Claim 3 — "Lab activities themselves become a hybrid of concept-maps and LabStack worksheets; the process of completing a lab is itself a map"
Trash in the literal version. Gold in the slightly different version one inch over.
The literal version — render the lab as a graph where nodes are sections (objective → prediction → data table → analysis → conclusion) and edges are dependencies — adds visual complexity without informational gain. A typical lab worksheet has the same structure as a typical recipe: mostly linear, with maybe a branch at "if your data looks like X, do Y; otherwise do Z." Drawing a recipe as a graph is what tutorials sometimes do for pedagogical novelty, and the result is always less legible than the linear list. The pedagogical primitive being abused here is the construction-mode primitive — students argue for relational structure between concepts — and the answer to "what is the relational structure between section 3 and section 4 of a worksheet" is "section 4 comes after section 3 because the worksheet author put it there." That's not pedagogically interesting.
But the version one inch over is genuinely beautiful, and I think it's what you're actually reaching for:
The lab activity stays linear — LabStack-shaped — but produces a derived concept-trajectory map as its artifact. As the student moves through the lab, every prediction, observation, calculation, and conclusion is tagged (by the student) with the canonical concepts being applied. By the end of the lab, the system has assembled a graph: nodes are the canonical concepts the student tagged, edges are the order in which they activated them, with the student's own free-text explanation on each edge ("I used Ohm's law here because…", "this implied capacitance because…"). The lab activity generates a concept map as its byproduct.
This is the map the TA reviews. This is the artifact that captures process. The student's trajectory through canonical concepts while doing the lab is the diagnostic — and you can compare it to the lab's authored concept_path (Atlas already has this field on problem entities; extend it to labs) to see whether the student traced the principle-application route the lab was designed to elicit.
A few delicious consequences fall out:
The concept-activation field on Lab entities ("concepts_activated" in the existing Phase 3b lab schema) becomes self-witnessing and verifiable. Today it's instructor-asserted: "this lab activates Ohm's law, RC circuits, exponential decay." With student trajectories aggregated, you discover whether students actually activate those concepts when doing the lab. If the lab claims to exercise exponential decay but no student trajectory ever tags exponential decay, the lab has a curriculum bug.
The "principle-application path view" Atlas already specifies for problems extends naturally to labs. Same animation, same overlay; problem-side it shows the canonical solver's traversal, lab-side it shows the actual student's traversal alongside it.
Concept-map construction mode, lab-attempt mode, and reference mode all produce the same shape of artifact — a graph of concepts with edges-with-explanations. They differ in how the graph was assembled (free authoring vs. activity-trajectory-derived vs. canonical), but the TA review surface, the file format, and the provenance discipline are unified.
So: keep the lab linear. Keep LabStack's section-typed worksheet vocabulary intact. Add concept-tagging at every prompt where a student is reasoning. Generate the trajectory-map as a derived artifact. That's the lab-as-map idea, and it's powerful.
Claim 4 — "Voice notes as universal evidence on activities, nodes, and edges; flagged for review with TA voice replies"
Mostly gold, with three guardrails that aren't optional.
The pedagogical instinct is right. Stream-of-consciousness reasoning is among the highest-signal artifacts a student can produce — it captures hesitation, search, false starts, recognition. The barrier-to-entry is much lower than typing for some students (especially ESL students, students with fine-motor or attentional disabilities, students who write heavily-self-edited prose). And asynchronous voice-to-voice dialogue between a student and a TA is genuinely a different texture of feedback than written marginalia — closer to the way office-hours conversations actually go.
The mechanism is also a clean generalization: any place Atlas already prompts for written explanation — every "explain the connection" popover on edges, every reflection prompt on construction-mode student-created nodes, every prediction or response field in a lab activity — also offers "record a 30-second voice note instead of (or in addition to) typing." Same artifact category, same review pipeline, same provenance fields. That's a small surface extension on top of an existing pattern, not a new system.
Three things make this work or break it, depending on how you handle them:
Privacy and FERPA are non-negotiable, and they push the architecture. Voice is biometrically identifying. Atlas's "no backend until Phase 4" posture cannot host voice submissions — those need encrypted-at-rest storage, retention policy, deletion UX, and explicit consent capture. This is the first feature in Atlas that actually needs a backend before Phase 4, or it needs an explicit "voice notes are local-only and embedded base64 in the export file" implementation. The latter is feasible — a 30-second Opus-encoded voice note is around 60KB — and stays consistent with the file-as-witness pattern, but it means voice notes never leave the student's device until they choose to submit. Fine, in fact preferred, but it has to be designed, not assumed.
Voice cannot be required. Required voice creates two categories of student exclusion that you don't want: students who can't speak (mute, severely stuttering, recovering from oral surgery, in a quiet shared space without privacy), and students who simply refuse on reasonable autonomy grounds. Voice notes have to be a strict-supplement to written prompts. Every prompt that accepts voice also accepts text. The TA review pipeline treats them as alternative evidence types of equal weight, not as primary-versus-secondary.
TA review load is the one that breaks systems. The arithmetic: 100 students × 20 voice notes/lab × 24 labs/year = 48,000 voice notes per cohort per year. Even at 30 seconds each, that's 400 hours of audio. No TA can or should listen to all of it. Three things make this tractable: (1) voice notes are flagged-for-review by the student or by the system, not blanket-reviewed — the student raises a flag when they want a TA to listen, the system raises a flag for low-confidence transcripts or hesitation patterns; (2) automatic transcription (Whisper-class, on-device or behind a privacy-respecting endpoint) is the default surface — the TA reads the transcript first, listens only when the transcript is ambiguous or the student asked for it; (3) TA voice replies reach back only when the student flagged for voice; otherwise written response is the default. This keeps the pipeline at human scale.
If those three guardrails are in, voice notes are gold. If any one of them is missing, you reproduce LabStack's surveillance posture in a higher-fidelity medium — and that would be worse than not having them at all.
Consolidated proposal


## What I'd build, given all of this:


A unified Atlas with three modes — Reference, Construction, and Activity — sharing one graph, one file format family, one TA review pipeline, and one provenance discipline. Activity Mode hosts what LabStack tried to be, rebuilt as the section-plugin architecture I sketched in the previous response. Lab activities stay linear, but each prompt within them invites concept-tagging that generates a derived concept-trajectory map at submission. Voice notes are an optional, opt-in supplement to every written-reasoning prompt across all three modes, with FERPA-grade privacy, transcription-first TA review, and student-flagged voice-to-voice dialogue when warranted. The graduated understanding scale stays as Atlas designed it — promoted by self-report, Canvas-LTI evidence, and TA-reviewed submission, never by activity completion alone. The lab's concept_path is verified against actual student trajectories, exposing curriculum bugs.
LabStack-the-codebase: still abandoned. LabStack-the-intent: absorbed into Activity Mode, with the section-type vocabulary preserved and the surveillance theater discarded.
Trash, explicitly: the auto-mastery-unlock mechanism, the literal "render the lab as a graph" reading of lab-as-map, mandatory voice notes, and any version of voice that requires students to surrender voice biometrics as a condition of completing coursework.
The single most interesting consequence of this synthesis is one I want to flag: concept-map construction and lab-attempt produce structurally identical artifacts — a graph of concept nodes with explanations on the edges, plus optional voice notes attached to each node and edge. They differ only in how the graph was assembled. That means a student in PHY 132 who completes Lab 4 (RC Circuits) generates a trajectory-map of concepts they activated. That same student in week 4 of construction-mode assignments might be asked to recall a concept map of RC circuits from scratch. The two maps are directly comparable. The diagnostic is "what does the student remember versus what did they enact?" — and that's an instrument I don't think any other physics-education platform currently has.

## Activity mode security alignment note

The authoritative adversarial-client protocol for Activity Mode now lives in `ATLAS_ACTIVITY_MODE_SPEC.md`. That spec makes one hard trust-model choice: unlocks and mastery transitions require server-signed attestations, while offline clients are drafting-only.

Client-side "secret spice" hashes are explicitly rejected as authorization primitives. In an adversarial browser, any embedded or obfuscated client secret can be extracted and reused, so rotating it periodically does not establish authority. Client hashes remain useful for tamper evidence and transport integrity, but authorization is signature-based and server-issued.

