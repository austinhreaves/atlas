# ATLAS Activity Mode Specification

Status: Draft (Adversarial-client baseline)  
Owner: Atlas project  
Depends on: `ATLAS_MAIN_SPEC.md`, `ATLAS_CONCEPT_MAP_CONSTRUCTION_SPEC.md`

## 1) Purpose

Activity Mode is the assignment-facing runtime where students complete guided learning activities that produce reviewable artifacts and evidence for mastery progression.

This specification assumes clients are adversarial. The system is designed so:

- Local files can be edited, replayed, reordered, and forged by users.
- Unlock and mastery changes are only accepted when backed by server-signed authority.
- Reference Mode remains unrestricted and never blocked by assignment gates.

## 2) Scope and Non-goals

### In scope

- Activity Mode assignment gate behavior.
- Artifact schema for attempts, attestations, and unlock state.
- Deterministic canonicalization + SHA-256 hashing.
- Server signature envelope and verification rules.
- Minimal server interaction protocol.
- Replay, stale state, and key rotation handling.

### Explicit non-goals

- Zero-server trust model for assignment authorization.
- Trusting client-side secrets for authorization.
- Real-time anti-cheat enforcement from browser telemetry.
- Replacing TA/instructor judgment with auto-grade logic.

## 3) Trust Model (Adversarial Client)

### Security assumptions

- Client code, localStorage, and exported JSON are user-controllable.
- Users can run modified clients and script file generation.
- Network channel to server is TLS-protected.
- Server private signing keys are not available to clients.

### Security guarantees

- Any single-byte modification of signed payloads invalidates signature verification.
- Unlock/mastery state cannot advance without a valid server-issued attestation.
- Replay of old attestations is rejected via version + nonce + expiry checks.

### Non-guarantees

- Offline clients cannot self-authorize unlocks.
- Client-only hashes (even with hidden "spice") are not accepted as authority.
- The platform cannot prevent all copied work; it can only enforce provenance integrity and review accountability.

## 4) Mode and Gate Contract

Atlas runs three mode classes relevant to this spec:

- **Reference Mode** (default): always accessible, no assignment gate.
- **Construction Mode**: existing behavior (unchanged by this spec).
- **Activity Mode** (`?mode=activity&assignment=<id>`): assignment policy applies.

Gate rules:

- Assignment gate applies only to Activity Mode.
- Reference Mode is always open, including when Activity Mode is locked.
- Activity Mode lock state is computed from the latest verified `unlock_state` snapshot and server-signed attestations.

## 5) Data Model

Activity Mode introduces three first-class artifacts.

### 5.1 `activity_attempt` (client-authored, unsigned authority)

Student work log and current draft state. This is evidence input, not authorization.

```json
{
  "format": "atlas-activity-attempt",
  "format_version": 1,
  "assignment_id": "phy132-lab4-rc",
  "attempt_id": "attempt-01JXYZ...",
  "student_ref": "student-hash-or-anon-ref",
  "created_at": "2026-04-27T00:00:00.000Z",
  "modified_at": "2026-04-27T00:10:00.000Z",
  "base_unlock_version": 7,
  "events": [
    {
      "event_id": "evt-001",
      "event_type": "response_saved",
      "occurred_at": "2026-04-27T00:01:02.000Z",
      "payload": { "section_id": "prediction-1", "value": "..." },
      "prev_event_hash": null,
      "event_hash": "sha256:..."
    }
  ],
  "draft_state": {
    "answers": {},
    "notes": {}
  }
}
```

### 5.2 `ta_attestation` (server-signed authority record)

Authoritative statement that a reviewer approved evidence and issued progression.

```json
{
  "type": "ta_attestation",
  "version": 1,
  "assignment_id": "phy132-lab4-rc",
  "student_ref": "student-hash-or-anon-ref",
  "attestation_id": "att-01JXYZ...",
  "issued_at": "2026-04-27T00:20:00.000Z",
  "expires_at": "2026-06-01T00:00:00.000Z",
  "reviewer": { "id": "ta-17", "role": "ta" },
  "review_basis": {
    "attempt_hash": "sha256:...",
    "checkpoint_nonce": "nonce-abc...",
    "base_unlock_version": 7
  },
  "grants": {
    "unlock_nodes": ["node-rc-time-constant"],
    "mastery_updates": [
      { "node_id": "node-capacitance", "from": "recognize", "to": "apply" }
    ]
  },
  "signature": {
    "alg": "ed25519",
    "kid": "atlas-activity-k-2026q2",
    "sig": "base64..."
  }
}
```

### 5.3 `unlock_state` (server-signed snapshot)

Current authoritative gate state for a student-assignment pair.

```json
{
  "type": "unlock_state",
  "version": 1,
  "assignment_id": "phy132-lab4-rc",
  "student_ref": "student-hash-or-anon-ref",
  "unlock_version": 8,
  "issued_at": "2026-04-27T00:20:00.000Z",
  "locks": { "node-rc-time-constant": "unlocked" },
  "mastery": { "node-capacitance": "apply" },
  "attestation_ids": ["att-01JXYZ..."],
  "signature": {
    "alg": "ed25519",
    "kid": "atlas-activity-k-2026q2",
    "sig": "base64..."
  }
}
```

## 6) Canonical Hashing Rules

All signed payloads and event hashes use deterministic canonical bytes.

### 6.1 Canonicalization profile

- UTF-8 encoding.
- Object keys sorted lexicographically.
- No insignificant whitespace.
- Numbers serialized in normalized JSON form.
- Arrays preserve order.
- No implicit defaults during canonicalization.

The canonicalization algorithm must be fixed and versioned as:

- `canonicalization_profile: "atlas-jcs-v1"`

### 6.2 Hash format

- SHA-256 digest over canonical bytes.
- Wire form: `sha256:<64 lowercase hex chars>`.

### 6.3 Event chain integrity

- `event_hash` is SHA-256 of canonical event payload excluding `event_hash`.
- `prev_event_hash` links each event to prior event hash.
- Chain break marks attempt as tampered for review; attempt may still be opened read-only.

## 7) Signature and Verification Rules

### 7.1 Algorithms

- Default signature algorithm: Ed25519.
- Each signature includes `kid` (key ID).

### 7.2 Verification inputs

To verify a signed artifact:

1. Remove `signature` object.
2. Canonicalize payload with `atlas-jcs-v1`.
3. Verify signature bytes using public key from `kid`.

### 7.3 Public key distribution

Clients cache a signed keyset:

- `activity_jwks` or equivalent key manifest.
- Keyset itself is signed by a long-lived Atlas root key.

Clients may verify attestations offline when keyset is cached and not expired.

### 7.4 Expiry and freshness

- `ta_attestation.expires_at` is mandatory.
- `unlock_state.unlock_version` must monotonically increase.
- `checkpoint_nonce` must be one-time and tied to a server-issued challenge.

## 8) Minimal Server Interaction Lifecycle

Server interactions are minimized to two required moments and one optional refresh.

### 8.1 Required: bootstrap

At assignment open (or first online opportunity), client fetches:

- Current signed `unlock_state`.
- Signed keyset (if missing/stale).
- Optional assignment policy metadata.

### 8.2 Required: checkpoint submit

When student requests progression review (or periodic policy checkpoint):

Client submits:

- Canonical `activity_attempt` hash and selected evidence.
- Latest `unlock_version`.

Server returns:

- Optional `ta_attestation` (if review completed and approved).
- New signed `unlock_state` (version incremented if grants applied).

### 8.3 Optional: lightweight key refresh

Client may refresh keyset on TTL expiry without submitting attempt data.

## 9) Offline Behavior

Offline is drafting-only:

- Student can continue editing attempt events and draft answers.
- Client can validate local hash chain integrity.
- Client cannot issue local unlocks or mastery promotions.
- Any UI progression requiring unlock must show "pending verification" until next successful checkpoint.

## 10) Export/Import Contract

### 10.1 Export artifacts

Client can export:

- `activity_attempt` file (draft evidence).
- Bundle export including latest signed `unlock_state` and any `ta_attestation`s.

### 10.2 Import validation order

On import, validate in strict order:

1. Parse + schema validate.
2. Canonical hash format checks.
3. Event chain verification for `activity_attempt`.
4. Signature verification for each signed artifact.
5. Freshness checks (`expires_at`, `unlock_version`, nonce replay).
6. Assignment/student identity binding checks.

### 10.3 Failure semantics

- Signature failure on `unlock_state` or `ta_attestation`: hard fail for authorization; open attempt in read-only evidence mode.
- Chain failure on attempt: warning + mark as tampered; do not auto-apply progression.
- Expired attestation: ignore grant and require new server checkpoint.
- Stale `unlock_version`: accept attempt as draft input but do not regress local authoritative state.

## 11) Replay and Staleness Defenses

Required controls:

- `unlock_version` monotonicity per `(assignment_id, student_ref)`.
- Unique `attestation_id` and one-time `checkpoint_nonce`.
- Nonce replay store server-side with bounded retention window.
- Server rejects attestations referencing mismatched `base_unlock_version`.

## 12) Key Rotation Policy

### 12.1 Rotation cadence

- Regular rotation at least quarterly.
- Emergency rotation on compromise suspicion.

### 12.2 Overlap window

- New keys begin signing immediately.
- Prior key remains verify-only for a configured overlap window.
- Keyset includes `not_before` and `not_after` metadata per key.

### 12.3 Revocation

- Revoked `kid`s are listed in signed keyset revocation list.
- Clients must deny signatures from revoked keys after keyset refresh.

## 13) Why Shared Client "Secret Spice" Is Rejected

A client-resident shared secret (or obfuscated periodic "spice") does not survive adversarial execution:

- The secret can be extracted from shipped code or runtime memory.
- Once extracted, users can forge valid-looking client hashes at scale.
- Rotating the secret only increases operational churn; it does not establish authority.

The correct use of a secret spice is server-only (for example, internal HMAC of checkpoint records). Client authorization must rely on server signatures, not client-kept secrets.

## 14) Validation Matrix

- **Tamper evidence**: hash chain + canonical SHA-256.
- **Authorization**: server-signed `ta_attestation` + signed `unlock_state`.
- **Gating decision**: only signed, fresh, monotonic authorization artifacts affect lock/mastery.
- **Reference access**: never gated by assignment authorization state.

## 15) Implementation Notes (Phase-fit)

- Keep this protocol additive: do not break existing Construction artifact handling.
- Store Activity Mode local data under a dedicated namespace (separate from reference and construction stores).
- Reuse existing Atlas review vocabulary (TA/instructor roles, annotation provenance), but do not treat annotations as unlock authority unless wrapped in signed attestations.
