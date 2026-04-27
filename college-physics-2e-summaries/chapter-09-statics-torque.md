# Chapter 9 — Statics and Torque

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 9.1 First Condition for Equilibrium · 9.2 Second Condition for Equilibrium · 9.3 Stability · 9.4 Applications of Statics · 9.5 Simple Machines · 9.6 Forces and Torques in Muscles and Joints

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 9
idealizations:
  - {name: "Rigid bodies", scope: "idealized"}
  - {name: "Massless levers/strings", scope: "idealized"}
  - {name: "Frictionless pivots", scope: "idealized"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
```

---

## Chapter Overview

For an extended body to be in equilibrium, two conditions must hold simultaneously: the **net force** must be zero (no translation) AND the **net torque** must be zero (no rotation). Torque introduces the *where* of force application — the same force at a different lever arm produces a different rotational effect. The chapter then classifies equilibria as stable/unstable/neutral based on what happens after a small displacement, and applies torque analysis to simple machines (levers, pulleys, wheels) where mechanical advantage trades force against distance — preserving energy. Closes with biomechanics: muscles and joints as third-class levers operating at MA < 1.

---

## Concept Nodes

### 1. First Condition for Equilibrium

- **id:** `first-condition-equilibrium`
- **title:** First Condition for Equilibrium (Translational)
- **formula:** `\sum \vec{F}_{ext} = 0 \quad \Longleftrightarrow \quad \sum F_x = 0,\ \sum F_y = 0`
- **principle:** A system is in translational equilibrium when the net external force in every direction is zero — implying zero linear acceleration (either at rest or moving at constant velocity).
- **causal:** asymmetric (force balance → no translational acceleration)
- **vars:**
  - `\vec{F}_{ext,i}` — drivers, N: external forces
  - `\sum \vec{F}_{ext}` — response, N: net external force (must equal zero)
- **limits:**
  - Static equilibrium: also v = 0 (motionless)
  - Dynamic equilibrium: v = constant ≠ 0 (e.g., car at steady highway speed)
  - Necessary but *not sufficient* for full equilibrium — must also satisfy the torque condition
- **misconceptions:**
  - ❌ Equilibrium means motionless → ✓ Constant-velocity motion is also equilibrium (dynamic)
  - ❌ Zero net force is enough for equilibrium → ✓ Zero net torque is *also* required (counterexample: hockey stick on ice with two equal opposite forces at different points → translates not, but spins)
- **prereqs:**
  - `force-net-external` (weight 0.95)
  - `newtons-first-law` (weight 0.85)
- **tags:** [equilibrium, statics, force, foundational]

---

### 2. Torque

- **id:** `torque`
- **title:** Torque (Moment of Force)
- **formula:** `\tau = r F \sin\theta = r_\perp F`
- **principle:** Torque is the rotational analog of force — the effectiveness of a force at producing rotation about a chosen pivot, equal to the force times the perpendicular distance from the pivot to the line of action of the force.
- **causal:** asymmetric (force at a lever arm → torque)
- **vars:**
  - `r` — driver, m: distance from pivot to point of force application
  - `F` — driver, N: applied force magnitude
  - `\theta` — driver, rad or deg: angle between F and the position vector r
  - `r_\perp = r\sin\theta` — driver, m: perpendicular lever arm
  - `\tau` — response, N·m: torque magnitude
- **limits:**
  - θ = 90° (force perpendicular to r) → τ = rF (maximum torque)
  - θ = 0 (force along r — pushing toward or pulling away from pivot) → τ = 0
  - r = 0 (force at the pivot) → τ = 0 (door opens nothing if you push the hinge)
  - Sign convention: counterclockwise positive, clockwise negative (in 2D)
  - Torque depends on choice of pivot; same force gives different τ about different points
- **misconceptions:**
  - ❌ Torque has units of force → ✓ Torque is N·m (energy-like units, but it's *not* energy — different physical quantity, do not call it joules)
  - ❌ A bigger force always gives bigger torque → ✓ Only if the lever arm is comparable; a small force at a long arm beats a huge force right at the pivot
- **prereqs:**
  - `force-net-external` (weight 0.85)
  - `vector-decomposition` (weight 0.85)
- **tags:** [torque, rotation, moment, foundational]

---

### 3. Second Condition for Equilibrium

- **id:** `second-condition-equilibrium`
- **title:** Second Condition for Equilibrium (Rotational)
- **formula:** `\sum \tau_{ext} = 0`
- **principle:** A system is in rotational equilibrium when the net external torque about *any* chosen pivot is zero; if it holds for one pivot in an inertial frame, it holds for all.
- **causal:** asymmetric (torque balance → no angular acceleration)
- **vars:**
  - `\tau_{ext,i}` — drivers, N·m: external torques (signed by rotation direction)
  - `\sum \tau_{ext}` — response, N·m: net external torque (must equal zero)
- **limits:**
  - Static rotational equilibrium: ω = 0 (no rotation)
  - Dynamic rotational equilibrium: ω = constant (steady spin)
  - Pivot choice is arbitrary for analysis — pick one that zeroes out unknown forces (e.g., pivot at the support to eliminate the support force from the torque equation)
- **misconceptions:**
  - ❌ The pivot must be the physical hinge → ✓ Any point works mathematically; choose strategically to simplify algebra
  - ❌ Net torque depends on the choice of pivot → ✓ For systems already in translational equilibrium, net torque is the *same* about every point; if F_net ≠ 0, net τ depends on pivot
- **prereqs:**
  - `torque` (weight 0.95)
  - `first-condition-equilibrium` (weight 0.85)
- **tags:** [equilibrium, statics, torque, foundational]

---

### 4. Center of Gravity

- **id:** `center-of-gravity`
- **title:** Center of Gravity
- **principle:** The center of gravity (cg) is the single point at which the entire weight of an extended body can be considered to act for the purpose of computing torques due to gravity; for uniform g, it coincides with the center of mass.
- **causal:** asymmetric (mass distribution → cg location)
- **vars:**
  - Mass distribution of the body
  - `\vec{r}_{cg}` — response, m: position of the center of gravity
- **limits:**
  - Symmetric homogeneous body → cg at the geometric center
  - Human body: cg roughly at the level of the navel (varies with posture)
  - Hollow bodies (e.g., ring) → cg can lie outside the material of the body
  - Equivalent to center of mass when g is uniform across the body
- **misconceptions:**
  - ❌ The cg must be inside the body → ✓ It can be in empty space (donut, boomerang, human bending forward)
  - ❌ A body always topples when the cg moves → ✓ It topples only when the cg moves outside the *base of support*
- **prereqs:**
  - `weight-gravitational-force` (weight 0.7)
  - `torque` (weight 0.7)
- **tags:** [center-of-gravity, weight, statics, biomechanics]

---

### 5. Stability of Equilibrium

- **id:** `stability-equilibrium`
- **title:** Stable, Unstable, and Neutral Equilibrium
- **principle:** When displaced from equilibrium, a system is stable if forces/torques restore it, unstable if they amplify the displacement, and neutral if no net force/torque arises; the geometry of the cg relative to the base of support determines stability under gravity.
- **causal:** asymmetric (small displacement + restoring/amplifying response → stability classification)
- **vars:**
  - Displacement direction (and magnitude, for nonlinear cases)
  - Resulting force/torque sign (restoring → stable; amplifying → unstable; zero → neutral)
- **limits:**
  - Stable: marble in bowl, pencil hanging from string, person standing on flat feet
  - Unstable: pencil balanced on tip, ball on top of hill
  - Neutral: marble on flat surface, sphere on a level plane
  - Combinations (saddle point): stable in one direction, unstable in another
  - Static stability under gravity: cg over base of support → stable; cg outside base → topples
- **misconceptions:**
  - ❌ A wider base just *feels* more stable → ✓ It mathematically increases the angular displacement needed to move the cg outside the base
  - ❌ Lower cg is always more stable → ✓ Yes for small displacements, but for unstable equilibria, lowering cg doesn't fix the problem (it just changes the rate of fall)
- **prereqs:**
  - `center-of-gravity` (weight 0.95)
  - `torque` (weight 0.85)
  - `first-condition-equilibrium` (weight 0.7)
- **tags:** [equilibrium, stability, statics, biomechanics]

---

### 6. Mechanical Advantage

- **id:** `mechanical-advantage`
- **title:** Mechanical Advantage of a Simple Machine
- **formula:** `MA = \frac{F_{out}}{F_{in}} = \frac{r_{in}}{r_{out}}\quad\text{(for a lever)}`
- **principle:** A simple machine (lever, pulley, inclined plane, wheel-axle) trades input force against input distance: by applying a smaller force over a longer distance, you can deliver a larger output force over a shorter distance — energy in equals energy out (in the ideal frictionless case).
- **causal:** asymmetric (geometry → force ratio)
- **vars:**
  - `F_{in}` — driver, N: applied input force
  - `F_{out}` — response, N: output force on the load
  - `r_{in}, r_{out}` — parameters, m: perpendicular lever arms (or path lengths) of input and output
  - `MA` — response, dimensionless: mechanical advantage
- **limits:**
  - MA > 1 → force-multiplier (crowbar, nail puller, wheelbarrow)
  - MA < 1 → speed/distance-multiplier (shovel, fishing rod, biceps lifting forearm)
  - MA = 1 → just changes direction (single fixed pulley)
  - Ideal (frictionless) → energy in = energy out: F_in × d_in = F_out × d_out
  - Real machines: friction reduces useful output → η < 1
- **misconceptions:**
  - ❌ A machine with MA > 1 violates energy conservation → ✓ Force is multiplied at the cost of distance; the work is the same (or less, accounting for friction)
  - ❌ All simple machines have MA > 1 → ✓ Many human-anatomy levers (biceps-forearm) have MA < 1, trading force for speed/range
- **prereqs:**
  - `torque` (weight 0.95)
  - `second-condition-equilibrium` (weight 0.9)
  - `work-constant-force` (weight 0.7)
- **tags:** [simple-machines, mechanical-advantage, lever, applied]

---

### 7. Lever Classes (Anatomy of Force-Distance Trade)

- **id:** `lever-classes`
- **title:** Three Classes of Levers
- **principle:** Levers are classified by the relative positions of the fulcrum, load, and effort: Class 1 (fulcrum between load and effort — seesaw, crowbar), Class 2 (load between fulcrum and effort — wheelbarrow), Class 3 (effort between fulcrum and load — biceps, shovel held at end).
- **causal:** symmetric (taxonomy by geometry)
- **vars:**
  - Position of fulcrum, load, and effort along the lever
  - Resulting MA: > or < 1 depending on arm ratio
- **limits:**
  - Class 1: MA can be > 1, < 1, or = 1 depending on relative arm lengths
  - Class 2: MA always > 1 (wheelbarrow, nutcracker)
  - Class 3: MA always < 1 (biceps, fishing rod) — trades force for speed/range
  - Most muscles in the human body operate as Class 3 levers — small motion at insertion produces large motion at extremity
- **misconceptions:**
  - ❌ MA < 1 levers are useless → ✓ They trade force for *speed* — your forearm moves slowly but your fingertips can swing quickly
  - ❌ Class is determined by which side is "input" → ✓ Class is determined by *fulcrum position* relative to load and effort, not which is input
- **prereqs:**
  - `mechanical-advantage` (weight 0.95)
  - `torque` (weight 0.85)
- **tags:** [simple-machines, lever, biomechanics, taxonomy]

---

### 8. Statics Problem-Solving Method

- **id:** `statics-method`
- **title:** Statics Problem-Solving Method
- **principle:** Solve statics problems by drawing a free-body diagram, choosing a strategic pivot point, applying both equilibrium conditions (ΣF = 0 and Στ = 0), and writing one equation per unknown.
- **causal:** asymmetric (representation + procedural method → solution)
- **vars:**
  - System boundary (choice)
  - External forces (identified, with location of application)
  - Pivot for torque equation (chosen strategically — eliminate unknowns)
  - Sign convention for torques (CCW positive)
- **limits:**
  - For a rigid body in 2D: 3 equations available (ΣF_x, ΣF_y, Στ), so up to 3 unknowns solvable
  - Choosing the pivot at the location of an unknown force eliminates that force from the torque equation — almost always the smart move
  - Statically indeterminate problems (more unknowns than equations) require deformation analysis (beyond intro physics)
- **misconceptions:**
  - ❌ Always pivot at the geometric center → ✓ Pivot wherever it eliminates the most unknowns
  - ❌ Forces not on the body still appear in the FBD → ✓ Only forces *acting on* the system matter (Newton's 3rd partners are on other bodies)
- **prereqs:**
  - `free-body-diagram` (weight 0.95)
  - `first-condition-equilibrium` (weight 0.95)
  - `second-condition-equilibrium` (weight 0.95)
- **tags:** [statics, method, problem-solving, equilibrium]

---

## Pedagogical Notes (for downstream LLM context)

- The hockey-stick demo (Figure 9.5) is the canonical "ΣF = 0 is necessary but not sufficient" example. Don't skip it — it's the cleanest justification for the torque equation in the whole textbook.
- "Pick your pivot strategically" is the single most useful skill in statics. A problem with three unknowns becomes one-equation-one-unknown if you pivot at the right spot. Drill this with seesaws first, then beams with multiple supports.
- Center of gravity vs. center of mass: in intro physics they're effectively identical because g is uniform on the scale of any lab problem. Mention the distinction; don't belabor it.
- The "lean against a wall and try to touch your toes" demo (Take-Home Experiment §9.3) is a *fantastic* in-person hook for stability — students can't do it because their cg moves outside their base of support, and the wall blocks the natural counterweight motion of their hips. Bonus: works in office hours.
- Mechanical advantage as a force/distance trade is the gateway to *gear ratios* (PHY 132 students will see this in EM machines), and to **why metabolism does so much work for so little visible motion** (most muscles operate at MA ≪ 1, paying ~10× the muscle force for any motion).
- The third-class lever (biceps) example is great for pre-meds in PHY 114: a 10 kg load held in the hand is supported by the biceps with ~70 kg of muscle force, *because* the biceps has MA ~ 1/7. Drives home why we get sore.
- For PHY 132 (engineering): include at least one beam-with-two-supports problem. It's the conceptual ancestor of every statics problem in CEE 210.
- Torque has units of N·m, which numerically matches energy (J = N·m), but they are *different physical quantities*. Always write torques as N·m and energies as J to keep the distinction crisp. Bonus: torque is a vector (in 3D, via right-hand rule), energy is a scalar.
