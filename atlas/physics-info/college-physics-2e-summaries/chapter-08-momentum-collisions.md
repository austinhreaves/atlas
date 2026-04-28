# Chapter 8 — Linear Momentum and Collisions

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 8.1 Linear Momentum and Force · 8.2 Impulse · 8.3 Conservation of Momentum · 8.4 Elastic Collisions in 1D · 8.5 Inelastic Collisions in 1D · 8.6 Collisions in 2D · 8.7 Rocket Propulsion

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 8
idealizations:
  - {name: "Point particles", scope: "idealized"}
  - {name: "Negligible external forces during collision", scope: "limiting-case"}
  - {name: "Instantaneous collisions", scope: "idealized"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
```

---

## Chapter Overview

Momentum (p = mv) is the second great conserved quantity of mechanics, partner to energy. Newton's second law in its most general form is F_net = dp/dt — F = ma is just the constant-mass special case. The chapter develops impulse (the time-integral of force = change in momentum), the conservation of momentum (when external forces are absent), and applies it to collisions: **elastic** (KE conserved), **inelastic** (KE not conserved), and **perfectly inelastic** (objects stick together — maximum KE loss consistent with momentum conservation). Closes with rocket propulsion as an application of variable-mass momentum analysis.

---

## Concept Nodes

### 1. Linear Momentum

- **id:** `linear-momentum`
- **title:** Linear Momentum
- **formula:** `\vec{p} = m\vec{v}`
- **principle:** The linear momentum of a body is the product of its mass and its velocity; it is a vector quantity carrying both magnitude and direction.
- **causal:** symmetric (definitional)
- **vars:**
  - `m` — parameter, kg: mass
  - `\vec{v}` — driver, m/s: velocity
  - `\vec{p}` — response, kg·m/s: momentum
- **limits:**
  - At v ≪ c → matches relativistic momentum γmv (γ ≈ 1)
  - At relativistic speeds → use p = γmv (Ch 28)
  - Frame-dependent: p depends on choice of reference frame
- **misconceptions:**
  - ❌ Momentum is just another name for KE → ✓ p is a vector (kg·m/s); KE is a scalar (J); p ∝ v, KE ∝ v²
  - ❌ A heavy slow object has more momentum than a light fast one → ✓ Depends on the product mv; a 0.41 kg ball at 25 m/s has |p| ≈ 10 kg·m/s; a 110 kg player at 8 m/s has |p| ≈ 880 kg·m/s
- **prereqs:**
  - `mass-inertia` (weight 0.7)
  - `average-velocity` (weight 0.7)
- **tags:** [momentum, vectors, foundational, mechanics]

---

### 2. Newton's Second Law (Momentum Form)

- **id:** `newtons-second-law-momentum-form`
- **title:** Newton's Second Law in Momentum Form
- **formula:** `\vec{F}_{net} = \frac{d\vec{p}}{dt}`
- **principle:** The net external force on a system equals the time rate of change of its momentum; this is more general than F = ma because it remains valid when mass varies (rockets, accreting bodies).
- **causal:** asymmetric (force → rate of momentum change)
- **vars:**
  - `\vec{F}_{net}` — driver, N: net external force
  - `\vec{p}` — response, kg·m/s: momentum
  - `t` — driver, s: time
- **limits:**
  - Constant m → reduces to F = ma (Ch 4 form)
  - Variable m (rockets, conveyor accumulating sand) → must use the momentum form
  - Inertial frame required
- **misconceptions:**
  - ❌ F = ma is the most general form of Newton's 2nd law → ✓ F = dp/dt is more general; F = ma is a constant-mass special case
  - ❌ Newton stated his second law as F = ma → ✓ He actually stated it in momentum form ("change in motion ∝ impressed force")
- **prereqs:**
  - `linear-momentum` (weight 0.95)
  - `newtons-second-law` (weight 0.85)
- **tags:** [momentum, newton, foundational, force]

---

### 3. Impulse

- **id:** `impulse-momentum-theorem`
- **title:** Impulse-Momentum Theorem
- **formula:** `\vec{J} = \vec{F}_{net,\text{avg}}\,\Delta t = \Delta\vec{p}`
- **principle:** The impulse delivered to a system — the time integral (or average force × duration) of the net external force — equals the change in the system's momentum.
- **causal:** asymmetric (force × time → momentum change)
- **vars:**
  - `\vec{F}_{net,\text{avg}}` — driver, N: time-averaged net force
  - `\Delta t` — driver, s: duration over which force acts
  - `\vec{J}` — response, N·s (= kg·m/s): impulse
  - `\Delta\vec{p}` — response, kg·m/s: change in momentum
- **limits:**
  - For variable F: J = ∫F dt = area under F vs. t curve
  - Same Δp can be achieved with large F over small Δt or small F over large Δt — this is the airbag principle
  - Crumple zones, padded helmets, knee bending on landing: all extend Δt to reduce peak F
- **misconceptions:**
  - ❌ Impulse and momentum have different units → ✓ Same units (kg·m/s = N·s)
  - ❌ Airbags reduce the change in momentum → ✓ Δp is the same with or without; airbags reduce *peak force* by extending Δt
- **prereqs:**
  - `linear-momentum` (weight 0.95)
  - `newtons-second-law-momentum-form` (weight 0.95)
- **tags:** [momentum, impulse, force, applied-safety]

---

### 4. Conservation of Linear Momentum

- **id:** `conservation-of-momentum`
- **title:** Conservation of Linear Momentum
- **formula:** `\vec{F}_{net,\text{ext}} = 0 \implies \vec{p}_{total} = \text{const}`
- **principle:** When the net external force on a system is zero, the total momentum of the system is conserved; internal forces (e.g., between colliding objects) cannot change the system's total momentum.
- **causal:** asymmetric (zero net external force → conserved momentum)
- **vars:**
  - `\vec{F}_{net,\text{ext}}` — driver, N: net external force on the system
  - `\vec{p}_{total}` — response, kg·m/s: total momentum (vector sum of all parts)
- **limits:**
  - During short collisions, "external" forces (gravity, friction) typically deliver negligible impulse → momentum is approximately conserved even if F_ext ≠ 0
  - Component-wise: if F_ext is zero in only one direction (e.g., x), then p_x is conserved while p_y might not be
  - Rooted in spatial-translation symmetry (Noether's theorem)
- **misconceptions:**
  - ❌ Momentum is conserved only in elastic collisions → ✓ Conserved in *all* collisions (elastic, inelastic, perfectly inelastic) as long as no external impulse acts
  - ❌ Internal forces can change total momentum → ✓ They appear in equal-and-opposite pairs (Newton's 3rd) and cancel
  - ❌ "Isolated system" means no forces at all → ✓ Means no *external* forces; internal forces are fine
- **prereqs:**
  - `newtons-second-law-momentum-form` (weight 0.95)
  - `newtons-third-law` (weight 0.85)
- **tags:** [momentum, conservation, foundational, symmetry]

---

### 5. Elastic Collision (1D)

- **id:** `elastic-collision-1d`
- **title:** Elastic Collision in One Dimension
- **formula:** `m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2',\quad \tfrac{1}{2}m_1 v_1^2 + \tfrac{1}{2}m_2 v_2^2 = \tfrac{1}{2}m_1 v_1'^2 + \tfrac{1}{2}m_2 v_2'^2`
- **principle:** In an elastic collision, both total momentum and total kinetic energy are conserved; the two equations together determine the final velocities of the two bodies.
- **causal:** asymmetric (initial velocities + mass ratio → final velocities)
- **vars:**
  - `m_1, m_2` — parameters, kg: masses of the two bodies
  - `v_1, v_2` — drivers, m/s: initial velocities (signed in 1D)
  - `v_1', v_2'` — response, m/s: final velocities
- **limits:**
  - Truly elastic only at subatomic scale; macroscopic collisions are at best *nearly* elastic (steel balls, billiard balls, springy bumpers)
  - Equal masses, one initially at rest → moving body stops; struck body takes off with original velocity (Newton's cradle)
  - Light hits heavy at rest → light bounces back at nearly original speed; heavy barely moves
  - Heavy hits light at rest → heavy continues at nearly original speed; light shoots off at ~2v_1
- **misconceptions:**
  - ❌ Elastic = bouncy in everyday sense → ✓ Elastic specifically means *KE is conserved*; some bouncy collisions still lose KE to sound/heat
  - ❌ The equal-mass-stops-the-other result is a coincidence → ✓ It's algebraically required by simultaneous momentum + KE conservation
- **prereqs:**
  - `conservation-of-momentum` (weight 0.95)
  - `kinetic-energy` (weight 0.95)
  - `conservation-mechanical-energy` (weight 0.7)
- **tags:** [collision, elastic, momentum, energy, conservation]

---

### 6. Inelastic and Perfectly Inelastic Collisions

- **id:** `inelastic-collision`
- **title:** Inelastic Collision (Including Perfectly Inelastic)
- **formula:** `m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'\quad\text{(perfectly inelastic: } v_1' = v_2' = v')`
- **principle:** In an inelastic collision, momentum is conserved but kinetic energy is not — some KE is converted to heat, sound, or deformation; in a perfectly inelastic collision, the bodies stick together and the maximum amount of KE consistent with momentum conservation is lost.
- **causal:** asymmetric (collision type → KE loss; momentum still conserved)
- **vars:**
  - `m_1, m_2` — parameters, kg: masses
  - `v_1, v_2` — drivers, m/s: initial velocities
  - `v'` — response, m/s: shared final velocity (perfectly inelastic case)
  - `\Delta KE` — response, J: kinetic energy lost (negative)
- **limits:**
  - Most everyday collisions are inelastic to some degree (cars crashing, clay hitting wall)
  - Perfectly inelastic: clay-clay collision, coupling train cars, bullet embedding in wood
  - Equal masses, equal opposite v → v' = 0 → all initial KE converted to heat/deformation
  - "Explosion" is the time-reverse of a perfectly inelastic collision (one body splits into two with conserved momentum)
- **misconceptions:**
  - ❌ Momentum is lost in inelastic collisions → ✓ Only KE is lost; momentum is still conserved
  - ❌ Perfectly inelastic means total energy is destroyed → ✓ Only mechanical (kinetic) energy; the "lost" KE becomes heat, sound, deformation — total energy is still conserved
- **prereqs:**
  - `conservation-of-momentum` (weight 0.95)
  - `kinetic-energy` (weight 0.85)
  - `elastic-collision-1d` (weight 0.7)
- **tags:** [collision, inelastic, momentum, energy, dissipation]

---

### 7. Collisions in Two Dimensions

- **id:** `collision-2d`
- **title:** Collisions in Two Dimensions
- **formula:** `p_{x,total} = \text{const},\quad p_{y,total} = \text{const}\quad \text{(plus KE conservation if elastic)}`
- **principle:** Conservation of momentum applies independently to each coordinate axis; in 2D, two scalar momentum equations replace the single 1D equation, and 2D problems are typically set up by aligning one axis with the incoming velocity.
- **causal:** asymmetric (initial 2D conditions + collision type → 2D final state)
- **vars:**
  - `p_{x,total}, p_{y,total}` — drivers, kg·m/s: total momentum components
  - For each body: `m_i, \vec{v}_i, \vec{v}_i'`
  - Scattering angles `\theta_1, \theta_2` (typical unknowns)
- **limits:**
  - Glancing collision of equal masses, one initially at rest → if elastic, the two bodies separate at 90° (a useful billiards/Newton's-cradle check)
  - For 2D elastic collision of two unknown bodies: 4 unknowns (v_1', v_2', θ_1, θ_2), 3 equations (p_x, p_y, KE) → typically need extra information (e.g., one scattering angle measured)
- **misconceptions:**
  - ❌ A glancing elastic collision conserves momentum only along the line of impact → ✓ Momentum conserved in *every* direction; the two scalar equations decouple cleanly when axes are well-chosen
- **prereqs:**
  - `conservation-of-momentum` (weight 0.95)
  - `vector-addition-analytical` (weight 0.85)
  - `elastic-collision-1d` (weight 0.85)
- **tags:** [collision, 2d, vectors, momentum, scattering]

---

### 8. Rocket Propulsion (Variable Mass)

- **id:** `rocket-propulsion`
- **title:** Rocket Propulsion (Variable-Mass Acceleration)
- **formula:** `a = \frac{v_e}{m}\,\frac{\Delta m}{\Delta t} - g`
- **principle:** A rocket accelerates by ejecting mass backward at high speed; the thrust equals the exhaust velocity times the mass-ejection rate, and the rocket's acceleration depends on its current (decreasing) mass.
- **causal:** asymmetric (mass ejection rate + exhaust velocity → thrust → acceleration)
- **vars:**
  - `v_e` — parameter, m/s: exhaust velocity (relative to rocket)
  - `m` — driver, kg: current mass of the rocket (decreases as fuel burns)
  - `\Delta m / \Delta t` — driver, kg/s: mass-ejection rate
  - `g` — parameter, m/s²: gravitational acceleration (only when launching against gravity)
  - `a` — response, m/s²: rocket acceleration
  - `T = v_e (\Delta m/\Delta t)` — response, N: thrust
- **limits:**
  - Conventional chemical exhaust velocities ~2.5 km/s (limit of hot-gas propulsion)
  - Rocket acceleration *increases* over flight as m decreases (peak just before fuel exhaustion)
  - Final velocity (no gravity, no air): v_f = v_e ln(m_0/m_r) — Tsiolkovsky equation
  - To reach Earth escape (v ≈ 11.2 km/s) with v_e ≈ 2.5 km/s → m_0/m_r ≈ e^4.5 ≈ 90 → ~99% of liftoff mass must be fuel
- **misconceptions:**
  - ❌ Rocket exhaust pushes against the ground or atmosphere → ✓ Rockets work in vacuum; thrust is the Newton's-3rd-law reaction to ejecting mass
  - ❌ Rockets accelerate at a constant rate → ✓ Acceleration grows as m decreases; this is why early flight is the slowest part
- **prereqs:**
  - `newtons-second-law-momentum-form` (weight 0.95)
  - `conservation-of-momentum` (weight 0.95)
  - `newtons-third-law` (weight 0.85)
- **tags:** [momentum, propulsion, variable-mass, applied, rockets]

---

## Pedagogical Notes (for downstream LLM context)

- The **single most useful framing** of momentum vs. energy: both are conserved, but they're different conserved quantities with different uses. Momentum (vector) decides direction and "how hard the hit"; energy (scalar) decides "how much got dissipated." Many collision problems require both equations.
- The Venus Williams tennis serve example (Ex 8.2) — 58 m/s ball, 5 ms contact → ~660 N average force — is a perfect "F = dp/dt" demo. Same impulse can be delivered by huge F over tiny Δt or modest F over long Δt.
- Airbags / crumple zones / catching a softball with give in your wrist are all *the same physics*: extend Δt to reduce peak F for a given Δp. Hammer this every time you teach impulse.
- The "equal mass elastic collision" result (Newton's cradle) trips up students who don't believe two simultaneous conservation laws can pin down the answer that hard. Walk the algebra slowly.
- Perfectly inelastic ≠ "lost momentum." It's "lost KE, conserved momentum." The distinction is the most common student error in this chapter.
- Rocket propulsion is genuinely a variable-mass problem and lives outside F = ma. PHY 132 students should see at least the setup and the Tsiolkovsky equation; PHY 114 can stop at "thrust = v_e (Δm/Δt)" and skip the integration.
- The 90° rule for equal-mass 2D elastic collisions is a great billiards demo and a fast sanity check on student algebra.
- This chapter is the springboard to Ch 10 (angular momentum), where the conservation argument repeats but for rotation. Flag the connection now: momentum-of-translation pairs with momentum-of-rotation, and both come from symmetries of space.
