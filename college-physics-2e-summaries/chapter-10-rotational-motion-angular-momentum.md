# Chapter 10 — Rotational Motion and Angular Momentum

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 10.1 Angular Acceleration · 10.2 Kinematics of Rotational Motion · 10.3 Dynamics: Rotational Inertia · 10.4 Rotational Kinetic Energy · 10.5 Angular Momentum and Conservation · 10.6 Collisions of Extended Bodies · 10.7 Gyroscopic Effects

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 10
idealizations:
  - {name: "Rigid bodies", scope: "idealized"}
  - {name: "Fixed axis of rotation", scope: "limiting-case"}
  - {name: "Constant moment of inertia (rigid)", scope: "limiting-case"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
```

---

## Chapter Overview

This chapter is the rotational counterpart of Ch 2 + Ch 4 + Ch 7 + Ch 8 — every translational concept gets a rotational twin. Position → angle, velocity → angular velocity, mass → moment of inertia, force → torque, momentum → angular momentum. The kinematic equations from Ch 2 carry over with letter swaps. Newton's second law becomes τ = Iα. Kinetic energy gains a rotational term ½Iω². And the conservation laws repeat — angular momentum is conserved when the net external torque is zero, explaining why ice skaters speed up when they pull in their arms (smaller I → larger ω). Closes with the vector character of angular quantities (gyroscopes, precession).

---

## Concept Nodes

### 1. Angular Acceleration

- **id:** `angular-acceleration`
- **title:** Angular Acceleration
- **formula:** `\alpha = \frac{\Delta\omega}{\Delta t}`
- **principle:** Angular acceleration is the rate of change of angular velocity; it is the rotational analog of linear acceleration.
- **causal:** symmetric (definitional)
- **vars:**
  - `\Delta\omega` — driver, rad/s: change in angular velocity
  - `\Delta t` — driver, s: elapsed time
  - `\alpha` — response, rad/s²: angular acceleration (signed; CCW positive convention)
- **limits:**
  - Constant α → angular kinematics equations apply (analogous to Ch 2)
  - α = 0 → uniform rotation (constant ω)
  - Connection to linear acceleration: tangential a_t = rα (perpendicular to a_c = rω²)
- **misconceptions:**
  - ❌ Negative α means the object is rotating clockwise → ✓ It means ω is *decreasing* (could still be CCW-rotating but slowing down)
  - ❌ Angular acceleration only matters when starting/stopping → ✓ Any change in ω (including direction reversal) involves α
- **prereqs:**
  - `angular-velocity` (weight 0.95)
  - `average-acceleration` (weight 0.85)
- **tags:** [rotation, angular-acceleration, kinematics]

---

### 2. Rotational Kinematic Equations (Constant α)

- **id:** `rotational-kinematics`
- **title:** Rotational Kinematic Equations (Constant α)
- **formula:** `\omega = \omega_0 + \alpha t,\quad \theta = \theta_0 + \omega_0 t + \tfrac{1}{2}\alpha t^2,\quad \omega^2 = \omega_0^2 + 2\alpha(\theta - \theta_0)`
- **principle:** Under constant angular acceleration, the rotational kinematics equations are formal analogs of the 1D translational kinematic equations from Ch 2 — every linear quantity replaced by its rotational twin.
- **causal:** asymmetric (initial conditions + α + t → final state)
- **vars:**
  - `\theta_0, \theta` — m: initial and final angles
  - `\omega_0, \omega` — rad/s: initial and final angular velocities
  - `\alpha` — rad/s²: constant angular acceleration
  - `t` — s: elapsed time
- **limits:**
  - Constant α only — exactly mirrors the constant-a constraint in Ch 2
  - Translation–rotation correspondence: x ↔ θ, v ↔ ω, a ↔ α
  - Linear-rotational connections: s = rθ, v = rω, a_t = rα
- **misconceptions:**
  - ❌ These equations are new physics → ✓ They're the Ch 2 equations with renamed variables; same algebra, same intuition
  - ❌ s = rθ only works for full revolutions → ✓ Works for any angle if θ is in radians
- **prereqs:**
  - `angular-acceleration` (weight 0.95)
  - `kinematics-velocity-time` (weight 0.85)
  - `kinematics-position-time` (weight 0.85)
- **tags:** [rotation, kinematics, constant-angular-acceleration]

---

### 3. Moment of Inertia (Rotational Inertia)

- **id:** `moment-of-inertia`
- **title:** Moment of Inertia (Rotational Inertia)
- **formula:** `I = \sum_i m_i r_i^2 \quad \text{(point masses);}\quad I = \int r^2\,dm \quad \text{(continuous)}`
- **principle:** Moment of inertia quantifies a body's resistance to angular acceleration; it depends not just on mass but on how that mass is distributed relative to the chosen axis of rotation.
- **causal:** asymmetric (mass distribution + axis → I)
- **vars:**
  - `m_i` — parameters, kg: point-mass elements
  - `r_i` — parameters, m: perpendicular distance from each element to the axis
  - `I` — response, kg·m²: moment of inertia about the chosen axis
- **limits:**
  - Hoop about central axis: I = MR²
  - Solid disk/cylinder about central axis: I = ½MR²
  - Solid sphere about central diameter: I = (2/5)MR²
  - Hollow sphere: I = (2/3)MR²
  - Rod about center: I = (1/12)ML²; about end: I = (1/3)ML²
  - Parallel axis theorem: I_parallel = I_cm + Md² (for axis offset d from cm)
  - I depends critically on choice of axis — the *same* body has different I about different axes
- **misconceptions:**
  - ❌ I depends only on the mass → ✓ Equally on the geometry — a hoop and a solid disk of equal mass have I differing by 2×
  - ❌ Distributing mass farther from the axis is just a small effect → ✓ It's quadratic in r — moving mass twice as far quadruples its contribution to I
  - ❌ I is fixed for an object → ✓ Changes if the object reshapes (skater pulling in arms)
- **prereqs:**
  - `mass-inertia` (weight 0.85)
  - `torque` (weight 0.7)
- **tags:** [rotation, moment-of-inertia, mass-distribution, foundational]

---

### 4. Newton's Second Law for Rotation

- **id:** `newtons-second-law-rotational`
- **title:** Newton's Second Law for Rotation
- **formula:** `\tau_{net} = I\alpha`
- **principle:** The net torque on a rigid body equals its moment of inertia times its angular acceleration — the rotational analog of F = ma.
- **causal:** asymmetric (net torque → angular acceleration via I)
- **vars:**
  - `\tau_{net}` — driver, N·m: net external torque about the axis
  - `I` — parameter, kg·m²: moment of inertia about the same axis
  - `\alpha` — response, rad/s²: angular acceleration
- **limits:**
  - Constant I (rigid body, fixed shape) — generalizes for variable I to τ = dL/dt
  - τ_net = 0 → α = 0 → constant ω (rotational equivalent of Newton's 1st)
  - Net torque must be computed about the *same* axis as I
  - Holds in inertial frames
- **misconceptions:**
  - ❌ Doubling the force doubles the angular acceleration → ✓ Only if the lever arm is unchanged; doubling the force at a closer point may reduce α
  - ❌ A heavier object always rotates more slowly → ✓ Depends on mass *distribution* — two equal-mass objects can have very different I
- **prereqs:**
  - `torque` (weight 0.95)
  - `moment-of-inertia` (weight 0.95)
  - `newtons-second-law` (weight 0.9)
- **tags:** [rotation, dynamics, newton, torque, foundational]

---

### 5. Rotational Kinetic Energy

- **id:** `rotational-kinetic-energy`
- **title:** Rotational Kinetic Energy
- **formula:** `KE_{rot} = \tfrac{1}{2} I \omega^2`
- **principle:** A rigid body rotating about a fixed axis has kinetic energy equal to half its moment of inertia times the square of its angular velocity — the rotational analog of ½mv².
- **causal:** symmetric (definitional in terms of I and ω)
- **vars:**
  - `I` — parameter, kg·m²: moment of inertia about the axis
  - `\omega` — driver, rad/s: angular velocity
  - `KE_{rot}` — response, J: rotational kinetic energy
- **limits:**
  - Pure rolling (e.g., ball down a ramp): total KE = ½mv² + ½Iω², with v = rω
  - Different rolling shapes accelerate differently down the same incline because of different I/(mr²) ratios — a hoop rolls slower than a sphere
  - Doubling ω → KE_rot quadruples (same scaling as translational KE in v)
- **misconceptions:**
  - ❌ A spinning object has no kinetic energy if its center isn't moving → ✓ It has rotational KE = ½Iω²
  - ❌ Rotational and translational KE add identically → ✓ They add as scalars *but* must both be tracked for rolling; can't ignore either
- **prereqs:**
  - `moment-of-inertia` (weight 0.95)
  - `angular-velocity` (weight 0.85)
  - `kinetic-energy` (weight 0.85)
- **tags:** [rotation, kinetic-energy, energy, rolling]

---

### 6. Angular Momentum

- **id:** `angular-momentum`
- **title:** Angular Momentum
- **formula:** `L = I\omega`
- **principle:** Angular momentum is the rotational analog of linear momentum; for a rigid body rotating about a fixed axis, it equals the moment of inertia times the angular velocity.
- **causal:** symmetric (definitional)
- **vars:**
  - `I` — parameter, kg·m²: moment of inertia about the axis
  - `\omega` — driver, rad/s: angular velocity
  - `L` — response, kg·m²/s: angular momentum
- **limits:**
  - For a point mass: L = mvr (when v is perpendicular to r)
  - In 3D, L is a vector — direction by right-hand rule (curl fingers along ω; thumb points along L)
  - At quantum scale, L is quantized in units of ℏ (Ch 30)
  - Earth's L ≈ 7.07 × 10³³ kg·m²/s (large because of its mass)
- **misconceptions:**
  - ❌ Angular momentum requires translational motion → ✓ A spinning top has L without going anywhere
  - ❌ L always points along the rotation axis → ✓ Yes for symmetric bodies and fixed-axis rotation; for general 3D rotation L can point off-axis (gyroscope precession)
- **prereqs:**
  - `moment-of-inertia` (weight 0.95)
  - `angular-velocity` (weight 0.95)
  - `linear-momentum` (weight 0.85)
- **tags:** [rotation, angular-momentum, foundational]

---

### 7. Torque-Angular Momentum Relation

- **id:** `torque-angular-momentum`
- **title:** Torque as Rate of Change of Angular Momentum
- **formula:** `\tau_{net} = \frac{dL}{dt}`
- **principle:** The net external torque on a system equals the time rate of change of its angular momentum — the most general form of Newton's second law for rotation, valid even when I varies.
- **causal:** asymmetric (torque → rate of change of L)
- **vars:**
  - `\tau_{net}` — driver, N·m: net external torque
  - `L` — response, kg·m²/s: angular momentum
  - `t` — driver, s: time
- **limits:**
  - Constant I → reduces to τ = Iα
  - Variable I (skater pulling arms in, accreting body) → must use the L form
  - τ × Δt = ΔL is the rotational impulse-momentum theorem
- **misconceptions:**
  - ❌ τ = Iα is the most general rotational law → ✓ τ = dL/dt is more general; τ = Iα is the constant-I special case
- **prereqs:**
  - `angular-momentum` (weight 0.95)
  - `newtons-second-law-rotational` (weight 0.85)
  - `newtons-second-law-momentum-form` (weight 0.7)
- **tags:** [rotation, torque, angular-momentum, foundational]

---

### 8. Conservation of Angular Momentum

- **id:** `conservation-angular-momentum`
- **title:** Conservation of Angular Momentum
- **formula:** `\tau_{net,\text{ext}} = 0 \implies L = I\omega = \text{const}`
- **principle:** When the net external torque on a system is zero, its total angular momentum is conserved — internal redistributions (changes in I) must be matched by inverse changes in ω.
- **causal:** asymmetric (zero net external torque → L conserved)
- **vars:**
  - `\tau_{net,\text{ext}}` — driver, N·m: net external torque
  - `L = I\omega` — response, kg·m²/s: angular momentum
- **limits:**
  - Skater pulls arms in → I decreases → ω increases (and KE_rot *increases* — work was done by internal muscles)
  - Earth losing rotational L slowly to tidal friction (~10⁻⁵ s/century longer days) — L is *transferred* to Moon's orbit
  - Solar system spin/orbit alignment: relic of conserved L from collapsing primordial cloud
  - In quantum mechanics: L conservation is rooted in rotational symmetry (Noether)
- **misconceptions:**
  - ❌ Skater speeding up violates energy conservation → ✓ Energy is added by the skater doing work pulling arms inward against centrifugal effect; L is what's conserved, not KE_rot
  - ❌ L is only conserved if no torques exist → ✓ Conserved if no *external* torques; internal torques (between parts of the system) cancel pairwise
- **prereqs:**
  - `torque-angular-momentum` (weight 0.95)
  - `angular-momentum` (weight 0.95)
  - `conservation-of-momentum` (weight 0.7)
- **tags:** [rotation, conservation, angular-momentum, foundational, symmetry]

---

### 9. Vector Nature of Angular Quantities (Gyroscopic Precession)

- **id:** `gyroscopic-precession`
- **title:** Vector Nature of L and Gyroscopic Precession
- **principle:** Angular velocity, torque, and angular momentum are vectors directed along the rotation axis (right-hand rule); a torque perpendicular to L doesn't change |L| but rotates its direction — producing precession in spinning gyroscopes and tops.
- **causal:** asymmetric (perpendicular torque → precession of L)
- **vars:**
  - `\vec{L}` — driver, kg·m²/s: angular momentum vector
  - `\vec{\tau}` — driver, N·m: applied torque vector
  - `d\vec{L}/dt = \vec{\tau}` — direction of L changes in the direction of τ
  - `\Omega = \tau/L` — response, rad/s: precession angular velocity
- **limits:**
  - Spinning gyroscope under gravity → torque from gravity is horizontal → L precesses around vertical axis
  - Earth's axial precession (~26,000-year cycle) due to gravitational torques from Sun and Moon on Earth's equatorial bulge
  - Bicycle stability: forward L of wheels resists tipping (gyroscopic effect — small but real contribution to stability)
- **misconceptions:**
  - ❌ A spinning top defies gravity → ✓ Gravity acts; the torque is perpendicular to L, so it changes L's *direction* (precession), not its magnitude (tipping over)
  - ❌ Bicycles balance because of gyroscopic effect alone → ✓ It contributes, but caster geometry and rider correction dominate
- **prereqs:**
  - `angular-momentum` (weight 0.95)
  - `torque-angular-momentum` (weight 0.95)
  - `vector-decomposition` (weight 0.7)
- **tags:** [rotation, gyroscope, precession, vectors, advanced]

---

## Pedagogical Notes (for downstream LLM context)

- The **single big idea** of this chapter: every translational concept has a rotational twin. Build the analogy table on Day 1 and refer to it throughout: x ↔ θ, v ↔ ω, a ↔ α, m ↔ I, F ↔ τ, p ↔ L, ½mv² ↔ ½Iω². Once students see the structural identity, the chapter halves in difficulty.
- **Moment of inertia depends on the axis** — this is the most common student error. Always specify "about which axis." A baseball bat has very different I about its long axis (small) vs. perpendicular axis (large), which is *why* you swing it the way you do.
- The skater-spinning-faster demo is the canonical L-conservation example. Quantitatively it's striking: typical I_arms-out / I_arms-in ≈ 5, so ω jumps by factor of 5, and KE_rot by factor of 5 (because KE = ½Iω², with I shrinking by 5 and ω growing by 5 → net ×5). Worth working through.
- For PHY 132: the rolling-down-incline race (hoop vs. disk vs. solid sphere vs. hollow sphere) is *the* moment-of-inertia hook. Order of finish (fastest first): solid sphere, solid cylinder, hollow sphere, hoop. Pre-calculate the result and let the demo confirm.
- For PHY 114 (pre-meds): tie I-distribution to biomechanics. Why does a runner pull her arms close to her body when sprinting? *Smaller I about her vertical axis* → less effort to swing arms. Walking with arms relaxed at sides is the slow-cadence default; sprinting brings the elbows in.
- The vector nature of L (gyroscopic precession) is the most "weird" result of the chapter — almost no other intro topic produces something so counterintuitive on the first encounter. Spend time on the right-hand rule and the direction of dL = τ dt.
- Earth's day length getting longer (~1.7 ms per century from tidal friction) is a fun "did you know" that ties this chapter to Ch 6 (gravity), Ch 8 (momentum conservation), and Ch 7 (energy dissipation). Where does the L go? To Moon's orbit, which is moving outward by ~3.8 cm/year. Beautiful conservation accounting.
- This chapter is the natural last stop in the "mechanics" arc (Ch 2–10). Ch 11 onward shifts to fluids, thermal, and waves — call out the transition explicitly so students see they've completed a coherent unit.
