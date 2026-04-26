# Chapter 4 — Dynamics: Force and Newton's Laws of Motion

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 4.1 Development of Force Concept · 4.2 Newton's First Law (Inertia) · 4.3 Newton's Second Law · 4.4 Newton's Third Law · 4.5 Normal, Tension, and Other Forces · 4.6 Problem-Solving Strategies · 4.7 Further Applications · 4.8 The Four Basic Forces

**Domain:** mechanics
**Suggested shared metadata:**

```yaml
layer: concept
domain: mechanics
chapter: 4
idealizations:
  - {name: "Friction", scope: "idealized"}
  - {name: "Air resistance", scope: "idealized"}
  - {name: "Massless, inextensible strings", scope: "idealized"}
  - {name: "Rigid bodies", scope: "idealized"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
```

---

## Chapter Overview

Where Ch 2–3 described motion, Ch 4 explains it. Newton's three laws connect **forces** (the causes) to **acceleration** (the effect) via mass (the proportionality constant). The chapter introduces the free-body diagram as the central problem-solving tool: identify every force on the system, sum them as vectors, and apply F_net = ma. Specific force types (weight, normal, tension, friction) are catalogued. Closes with the four fundamental forces — a teaser for unification.

---

## Concept Nodes

### 1. Net External Force

- **id:** `force-net-external`
- **title:** Net External Force on a System
- **formula:** `\vec{F}_{net} = \sum_i \vec{F}_{ext,i}`
- **principle:** The net force on a system is the vector sum of all *external* forces; internal forces (between parts of the system) cancel by Newton's third law.
- **causal:** symmetric (definitional)
- **vars:**
  - `\vec{F}_{ext,i}` — driver, N: each external force acting on the system
  - `\vec{F}_{net}` — response, N: net (resultant) external force
- **limits:**
  - Single force → F_net = that force
  - Forces in equilibrium → F_net = 0 (static or dynamic)
  - System boundary choice changes which forces count as "external" — choose deliberately
- **misconceptions:**
  - ❌ Internal forces (e.g., between train cars) affect F_net → ✓ They cancel pairwise; only externals matter
  - ❌ "Net force" means largest force → ✓ Net = vector sum, can be smaller than any single force
- **prereqs:**
  - `vector-addition-analytical` (weight 0.9)
- **tags:** [dynamics, force, newton, system]

---

### 2. Newton's First Law (Inertia)

- **id:** `newtons-first-law`
- **title:** Newton's First Law of Motion (Law of Inertia)
- **formula:** `\vec{F}_{net} = 0 \implies \vec{v} = \text{const}`
- **principle:** A body at rest stays at rest, and a body in motion stays in motion at constant velocity, unless acted on by a net external force.
- **causal:** asymmetric (absence of force → constancy of velocity)
- **vars:**
  - `\vec{F}_{net}` — driver, N: net external force on the body
  - `\vec{v}` — response, m/s: velocity (constant when F_net = 0)
- **limits:**
  - Holds only in **inertial reference frames** — frames not accelerating relative to "the fixed stars"
  - Friction and air drag are forces; "things slow down on their own" only because of these forces
- **misconceptions:**
  - ❌ A force is required to maintain motion → ✓ A force is required only to *change* motion (Aristotelian → Galilean shift)
  - ❌ Heavy objects "want" to be at rest → ✓ They resist *changes* in velocity equally well whether at rest or moving
- **prereqs:**
  - `force-net-external` (weight 0.85)
- **tags:** [dynamics, newton, inertia, foundational]

---

### 3. Mass as Inertia

- **id:** `mass-inertia`
- **title:** Mass as a Measure of Inertia
- **principle:** Mass quantifies a body's resistance to acceleration; it is an intrinsic property independent of location or gravitational field.
- **causal:** symmetric (definitional)
- **vars:**
  - `m` — parameter, kg: inertial mass
- **limits:**
  - Distinguish from **weight** (a force, frame-dependent in non-inertial fields)
  - At relativistic speeds, *relativistic mass* increases with v (treated in modern physics)
- **misconceptions:**
  - ❌ Mass and weight are the same → ✓ Mass is invariant (kg); weight is a force (N) that varies with g
  - ❌ Mass disappears in free fall → ✓ Astronauts in orbit are "weightless" but still have mass — push one and they accelerate
- **prereqs:**
  - `newtons-first-law` (weight 0.7)
- **tags:** [dynamics, mass, inertia, foundational]

---

### 4. Newton's Second Law

- **id:** `newtons-second-law`
- **title:** Newton's Second Law of Motion
- **formula:** `\vec{F}_{net} = m\vec{a}`
- **principle:** The acceleration of a system is directly proportional to the net external force, parallel to it, and inversely proportional to the system's mass.
- **causal:** asymmetric (force → acceleration, mediated by mass)
- **vars:**
  - `\vec{F}_{net}` — driver, N: net external force
  - `m` — parameter, kg: mass of the system
  - `\vec{a}` — response, m/s²: acceleration of the system
- **limits:**
  - F_net = 0 → a = 0 (recovers Newton's first law as a special case)
  - m → ∞ with finite F → a → 0 (immovable object limit)
  - Constant m only; if m changes, use the momentum form: F = dp/dt
  - Inertial frame required
- **misconceptions:**
  - ❌ Force causes velocity → ✓ Force causes *acceleration* (change in velocity)
  - ❌ Direction of motion = direction of force → ✓ Direction of *acceleration* = direction of net force; v can be perpendicular or antiparallel to F (e.g., a ball at apex of throw)
  - ❌ Doubling mass halves the force → ✓ Doubling mass halves the *acceleration* for the same applied force
- **prereqs:**
  - `force-net-external` (weight 0.95)
  - `mass-inertia` (weight 0.85)
  - `average-acceleration` (weight 0.85)
- **tags:** [dynamics, newton, foundational, force]

---

### 5. Weight (Gravitational Force)

- **id:** `weight-gravitational-force`
- **title:** Weight as a Gravitational Force
- **formula:** `\vec{w} = m\vec{g}`
- **principle:** Weight is the gravitational force on a body of mass m in a gravitational field g; near Earth's surface, w points downward with magnitude mg.
- **causal:** asymmetric (mass + field → force)
- **vars:**
  - `m` — parameter, kg: mass of the body
  - `\vec{g}` — parameter, m/s²: local gravitational field (≈ 9.80 m/s² downward at Earth's surface)
  - `\vec{w}` — response, N: weight (force)
- **limits:**
  - On Moon: g ≈ 1.67 m/s² → weight is ~1/6 of Earth weight; mass unchanged
  - In free fall (orbit): apparent weight = 0, but true weight ≠ 0 — gravity still acts
  - Far from massive bodies → g → 0 → w → 0
- **misconceptions:**
  - ❌ Weight is measured in kg → ✓ Weight is a force (N); the kg reading on a bathroom scale assumes Earth's g
  - ❌ Astronauts in orbit have no gravity → ✓ They have ~89% of surface g; they're in *continuous free fall* around Earth
- **prereqs:**
  - `newtons-second-law` (weight 0.85)
  - `free-fall` (weight 0.85)
- **tags:** [dynamics, gravity, weight, force]

---

### 6. Newton's Third Law

- **id:** `newtons-third-law`
- **title:** Newton's Third Law of Motion (Action–Reaction)
- **formula:** `\vec{F}_{A\,on\,B} = -\vec{F}_{B\,on\,A}`
- **principle:** Whenever one body exerts a force on a second body, the second body exerts an equal-magnitude, opposite-direction force on the first.
- **causal:** symmetric (mutual interaction; the two forces are simultaneous and inseparable)
- **vars:**
  - `\vec{F}_{A\,on\,B}` — driver, N: force from A acting on B
  - `\vec{F}_{B\,on\,A}` — response, N: reaction force from B on A
- **limits:**
  - Always holds; no exceptions in classical mechanics
  - The pair acts on **different bodies** — they never cancel on a free-body diagram of one body
- **misconceptions:**
  - ❌ The two forces cancel → ✓ They act on different bodies, so they don't sum on either body's free-body diagram
  - ❌ The bigger object exerts the bigger force (truck vs. mosquito) → ✓ Forces are equal and opposite; *accelerations* differ because masses differ (a = F/m)
  - ❌ Pulling on a wall: the wall doesn't pull back unless it's about to fall → ✓ The wall pulls back with equal force at all times
- **prereqs:**
  - `newtons-second-law` (weight 0.75)
- **tags:** [dynamics, newton, foundational, force-pairs]

---

### 7. Normal Force (Flat Surface)

- **id:** `normal-force`
- **title:** Normal Force from a Surface
- **formula:** `N = mg\cos\theta` *(on an incline of angle θ from horizontal; N = mg on flat ground)*
- **principle:** A solid surface exerts a contact force on a body perpendicular to the surface, of whatever magnitude is required to prevent interpenetration.
- **causal:** asymmetric (constraint → reaction force; magnitude is set by other forces in the perpendicular direction)
- **vars:**
  - `m` — parameter, kg: mass of the object
  - `g` — parameter, m/s²: gravitational acceleration
  - `\theta` — driver, rad or deg: incline angle from horizontal
  - `N` — response, N: normal force magnitude
- **limits:**
  - θ = 0 (flat ground, no other vertical forces) → N = mg
  - θ = 90° (vertical wall) → N from the floor = 0; object would be in free fall along the surface
  - Additional vertical forces (push down or lift) → N adjusts accordingly: N = mg − F_lift
  - N ≥ 0; surface can push but not pull (else the object leaves the surface)
- **misconceptions:**
  - ❌ Normal force always equals mg → ✓ Only on a flat surface with no other vertical forces; otherwise N adjusts to maintain contact
  - ❌ Normal force is the third-law reaction to gravity → ✓ The reaction to gravity is the body pulling on Earth; N's third-law partner is the body pushing on the surface
- **prereqs:**
  - `newtons-second-law` (weight 0.9)
  - `weight-gravitational-force` (weight 0.85)
  - `vector-decomposition` (weight 0.7)
- **tags:** [dynamics, contact-force, normal-force, constraint]

---

### 8. Tension in a Flexible Connector

- **id:** `tension-flexible-connector`
- **title:** Tension in a Massless, Inextensible Connector
- **formula:** `T_{A} = T_{B} = T \quad \text{(uniform along an ideal rope/string)}`
- **principle:** A flexible connector (rope, string, cable) transmits force only along its length, pulling equally on the objects at each end with magnitude T.
- **causal:** asymmetric (constraint → equal-and-opposite pulls)
- **vars:**
  - `T` — response, N: tension magnitude (uniform along the rope in the ideal case)
  - `m_{rope}` — parameter, kg: rope mass (assumed = 0 in the ideal case)
- **limits:**
  - Ideal rope: massless and inextensible → T uniform; objects share acceleration
  - Real rope with mass → T varies along length (heavier-supporting end has more tension)
  - Rope cannot push (T ≥ 0); if "tension" goes negative, the rope goes slack and the constraint releases
  - Pulleys (ideal): redirect tension without changing magnitude
- **misconceptions:**
  - ❌ The rope pulls harder on the heavier object → ✓ T is the same on both ends (ideal rope)
  - ❌ Tension is a vector along one direction → ✓ Tension at each end pulls the attached object *toward* the rope's center; it's two opposite force vectors, one on each end
- **prereqs:**
  - `newtons-third-law` (weight 0.85)
  - `newtons-second-law` (weight 0.85)
- **tags:** [dynamics, contact-force, tension, constraint]

---

### 9. Tension Supporting a Perpendicular Load

- **id:** `tension-perpendicular-load`
- **title:** Tension in a Sagging Wire Supporting a Perpendicular Load
- **formula:** `T = \frac{mg}{2\sin\theta}`
- **principle:** A wire stretched between two supports and carrying a transverse weight at its midpoint develops large tension when the sag angle θ is small — the closer to horizontal, the larger T.
- **causal:** asymmetric (geometry + load → tension)
- **vars:**
  - `m` — driver, kg: mass of the load
  - `g` — parameter, m/s²: gravitational acceleration
  - `\theta` — driver, rad or deg: sag angle of the wire from horizontal at the support
  - `T` — response, N: tension in each half of the wire
- **limits:**
  - θ → 0 → T → ∞: a perfectly horizontal wire cannot support any transverse load
  - θ = 90° (vertical) → T = mg/2: the wire just hangs straight, each side carries half
- **misconceptions:**
  - ❌ A tighter rope is safer → ✓ Tighter (smaller θ) means larger tension for the same load — counterintuitive but mechanically dangerous
  - ❌ Walking a tightrope across a perfectly horizontal wire is possible in principle → ✓ Any non-zero load forces some sag; perfectly horizontal carries infinite tension
- **prereqs:**
  - `tension-flexible-connector` (weight 0.95)
  - `vector-decomposition` (weight 0.85)
- **tags:** [dynamics, tension, geometry, statics]

---

### 10. Resolving Weight on an Incline

- **id:** `weight-on-incline`
- **title:** Components of Weight on an Inclined Plane
- **formula:** `w_\parallel = mg\sin\theta,\quad w_\perp = mg\cos\theta`
- **principle:** On an incline of angle θ, gravity decomposes into a component along the surface (driving sliding) and a component perpendicular to the surface (balanced by the normal force).
- **causal:** symmetric (geometric decomposition)
- **vars:**
  - `m` — parameter, kg: mass of the object
  - `g` — parameter, m/s²: gravitational acceleration
  - `\theta` — driver, rad or deg: incline angle from horizontal
  - `w_\parallel` — response, N: weight component along the incline (down-slope)
  - `w_\perp` — response, N: weight component perpendicular to the incline
- **limits:**
  - θ = 0 (flat) → w_∥ = 0, w_⊥ = mg
  - θ = 90° (vertical drop) → w_∥ = mg, w_⊥ = 0 (free fall)
  - Frictionless and no other forces → a = g sin θ down the slope
- **misconceptions:**
  - ❌ Use sin for the perpendicular component → ✓ The perpendicular component is mg cos θ (the component along the surface gets sin θ when θ is measured from horizontal)
  - ❌ Steeper incline means smaller acceleration → ✓ Steeper means *larger* acceleration along the slope (a = g sin θ increases with θ)
- **prereqs:**
  - `vector-decomposition` (weight 0.95)
  - `weight-gravitational-force` (weight 0.9)
  - `normal-force` (weight 0.7)
- **tags:** [dynamics, incline, gravity, decomposition]

---

### 11. Free-Body Diagram (Method)

- **id:** `free-body-diagram`
- **title:** Free-Body Diagram as Problem-Solving Method
- **principle:** Isolate the system, draw every external force as a labeled vector originating at the object, choose convenient axes, and decompose; then apply Newton's second law axis by axis.
- **causal:** asymmetric (representation → algebraic equations)
- **vars:**
  - System boundary (choice)
  - External force list (identified)
  - Coordinate axes (chosen)
- **limits:**
  - Internal forces are intentionally omitted — that's the point of the system boundary
  - Choose axes aligned with motion (or with the most forces) to minimize decomposition algebra
  - For multiple bodies connected by constraints, draw a separate FBD for each
- **misconceptions:**
  - ❌ Show the force the body exerts on its surroundings on its own FBD → ✓ FBDs show forces *acting on* the body, not forces it exerts
  - ❌ Velocity is a force / draw a "force of motion" → ✓ Velocity is not a force; only physical interactions (gravity, contact, friction, etc.) appear
  - ❌ Normal force always points up → ✓ Normal force is perpendicular to the contact surface, in the direction the surface pushes
- **prereqs:**
  - `force-net-external` (weight 0.9)
  - `vector-decomposition` (weight 0.9)
  - `newtons-second-law` (weight 0.95)
- **tags:** [dynamics, method, free-body-diagram, problem-solving]

---

### 12. Four Fundamental Forces

- **id:** `four-fundamental-forces`
- **title:** The Four Fundamental Forces of Nature
- **principle:** All known interactions reduce to four fundamental forces: gravitational, electromagnetic, weak nuclear, and strong nuclear — distinguished by relative strength, range, and the particles that mediate them.
- **causal:** symmetric (taxonomy)
- **vars:**
  - Force type, relative strength, range, mediating particle (carrier)
- **limits:**
  - Gravitational: long range (∞), weakest (~10⁻³⁸ relative), graviton (hypothetical), dominates at large scale
  - Electromagnetic: long range (∞), strong (~10⁻², relative), photon, dominates everyday matter behavior
  - Weak nuclear: short range (~10⁻¹⁸ m), ~10⁻¹³ relative, W and Z bosons, governs beta decay
  - Strong nuclear: short range (~10⁻¹⁵ m), strongest (≡ 1), gluons, binds nuclei
  - Electroweak unification (1970s) merged EM and weak above ~100 GeV; further unification is a major goal of modern physics
- **misconceptions:**
  - ❌ Friction, normal force, and tension are fundamental forces → ✓ All are *manifestations* of the electromagnetic force at the atomic level
  - ❌ Gravity is the strongest force → ✓ It's the *weakest* by ~36 orders of magnitude; it dominates at large scale only because it's always attractive and unscreened
- **prereqs:**
  - `force-net-external` (weight 0.5)
- **tags:** [forces, fundamental, taxonomy, modern-physics]

---

## Pedagogical Notes (for downstream LLM context)

- The **free-body diagram is non-negotiable**. Insist students draw one even for "trivial" problems — the procedural muscle pays off in coupled-body problems and circular motion (Ch 6).
- Newton's third law is the most misunderstood law in intro physics. The horse-and-cart paradox ("if they pull equally on each other, why does the cart move?") is worth class time — the resolution is that the *cart's* motion depends on the net force *on the cart*, which includes friction with the ground, not the horse–cart pair.
- "Tension is the same throughout an ideal rope" is a wonderful place to introduce the idea of an idealization with explicit limits — what changes when m_rope ≠ 0?
- The horizontal-wire-with-load problem (T = mg / 2 sin θ) is a great real-world hook (towing cars out of ditches, slacklines, transmission line sag) and pairs nicely with PHY 132's coverage of vector resolution.
- Save the four fundamental forces section for the last 10 minutes of lecture or as a "looking ahead" appendix — students engage with it more as a story than as material to test.
- Connect inertia (Ch 4) → momentum (Ch 8) → conservation laws as a continuing theme: Newton's laws are equivalent to "momentum is conserved when F_ext = 0."

