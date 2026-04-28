# Chapter 2 — Kinematics

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 2.1 Displacement · 2.2 Vectors, Scalars, and Coordinate Systems · 2.3 Time, Velocity, and Speed · 2.4 Acceleration · 2.5 Motion Equations for Constant Acceleration in 1D · 2.6 Problem-Solving Basics · 2.7 Falling Objects · 2.8 Graphical Analysis

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 2
idealizations:
  - {name: "Air resistance", scope: "idealized"}
  - {name: "Friction", scope: "idealized"}
  - {name: "Constant acceleration", scope: "limiting-case"}
```

---

## Chapter Overview

Kinematics describes 1D motion *without* asking what causes it (forces wait until Ch 4). The chapter develops the language — displacement, velocity, acceleration — and derives four kinematic equations valid only for **constant acceleration**. Free fall is the canonical application. Closes with graphical interpretation: slope of *x*–*t* = *v*; slope of *v*–*t* = *a*.

---

## Concept Nodes

### 1. Displacement (1D)

- **id:** `displacement-1d`
- **title:** Displacement in One Dimension
- **formula:** `\Delta x = x_f - x_0`
- **principle:** Displacement is the vector change in an object's position, independent of the path taken.
- **causal:** symmetric (definitional)
- **vars:**
  - `x_0` — parameter, m: initial position
  - `x_f` — parameter, m: final position
  - `\Delta x` — response, m: displacement (signed in 1D)
- **limits:**
  - `x_f = x_0` → Δx = 0 (returned to start; distance traveled may still be > 0)
- **misconceptions:**
  - ❌ Distance traveled equals displacement → ✓ Distance traveled is path length (scalar); displacement is net change in position (vector)
  - ❌ Round-trip motion has nonzero displacement → ✓ |Δx| = 0 if start and end coincide
- **prereqs:** none
- **tags:** [kinematics, vectors, position, 1d-motion]

---

### 2. Average Velocity

- **id:** `average-velocity`
- **title:** Average Velocity
- **formula:** `\bar{v} = \frac{\Delta x}{\Delta t}`
- **principle:** Average velocity is displacement per unit time elapsed.
- **causal:** symmetric (definitional)
- **vars:**
  - `\Delta x` — driver, m: displacement
  - `\Delta t` — driver, s: elapsed time
  - `\bar{v}` — response, m/s: average velocity (vector)
- **limits:**
  - Δx = 0 → v̄ = 0 even if path length > 0
  - As Δt → 0 → v̄ → instantaneous velocity v
- **misconceptions:**
  - ❌ Average velocity = average speed → ✓ Avg velocity uses displacement (signed); avg speed uses path length (scalar)
- **prereqs:**
  - `displacement-1d` (weight 0.9)
- **tags:** [kinematics, velocity, vectors]

---

### 3. Average Acceleration

- **id:** `average-acceleration`
- **title:** Average Acceleration
- **formula:** `\bar{a} = \frac{\Delta v}{\Delta t} = \frac{v_f - v_0}{\Delta t}`
- **principle:** Average acceleration is the rate of change of velocity over a time interval.
- **causal:** symmetric (definitional)
- **vars:**
  - `\Delta v` — driver, m/s: change in velocity
  - `\Delta t` — driver, s: elapsed time
  - `\bar{a}` — response, m/s²: average acceleration (vector)
- **limits:**
  - Δv = 0 → ā = 0 (motion at constant velocity, not necessarily zero velocity)
  - As Δt → 0 → ā → instantaneous acceleration a
- **misconceptions:**
  - ❌ "Deceleration" means a < 0 → ✓ Deceleration means **a opposes v**; sign of *a* depends on coordinate choice
  - ❌ Zero velocity implies zero acceleration → ✓ At apex of throw, v = 0 but a = −g
- **prereqs:**
  - `average-velocity` (weight 0.85)
- **tags:** [kinematics, acceleration, vectors]

---

### 4. Position from Average Velocity (Constant a)

- **id:** `kinematics-position-from-avg-velocity`
- **title:** Position from Average Velocity
- **formula:** `x = x_0 + \bar{v}\,t \quad \text{with}\quad \bar{v} = \tfrac{1}{2}(v_0 + v)`
- **principle:** When acceleration is constant, average velocity is the arithmetic mean of initial and final velocities, and position grows linearly with average velocity over time.
- **causal:** asymmetric
- **vars:**
  - `x_0` — parameter, m: initial position
  - `v_0` — driver, m/s: initial velocity
  - `v` — driver, m/s: final velocity
  - `t` — driver, s: elapsed time (with t₀ = 0)
  - `x` — response, m: final position
- **limits:**
  - Constant *a* required (else v̄ ≠ ½(v₀ + v))
  - v = v₀ → x = x₀ + v₀t (uniform motion)
- **misconceptions:**
  - ❌ v̄ = (v₀ + v)/2 always → ✓ Only valid for constant a
- **prereqs:**
  - `average-velocity` (weight 0.9)
- **tags:** [kinematics, constant-acceleration, position, 1d-motion]

---

### 5. Velocity vs. Time (Constant a)

- **id:** `kinematics-velocity-time`
- **title:** Kinematics — Velocity vs. Time
- **formula:** `v = v_0 + a t`
- **principle:** Under constant acceleration, velocity changes linearly with time.
- **causal:** asymmetric
- **vars:**
  - `a` — driver, m/s²: constant acceleration
  - `t` — driver, s: elapsed time
  - `v_0` — parameter, m/s: initial velocity
  - `v` — response, m/s: final velocity
- **limits:**
  - a = 0 → v = v₀ (constant velocity)
  - t = 0 → v = v₀
  - As t → ∞ with a > 0 → v → ∞ (unphysical at relativistic limit)
- **misconceptions:**
  - ❌ v depends on starting position → ✓ This equation has no x dependence
- **prereqs:**
  - `average-acceleration` (weight 0.85)
- **tags:** [kinematics, constant-acceleration, velocity, 1d-motion]

---

### 6. Position vs. Time (Constant a)

- **id:** `kinematics-position-time`
- **title:** Kinematics — Position vs. Time
- **formula:** `x = x_0 + v_0 t + \tfrac{1}{2} a t^2`
- **principle:** Under constant acceleration, position grows linearly in initial velocity and quadratically in elapsed time.
- **causal:** asymmetric
- **vars:**
  - `x_0` — parameter, m: initial position
  - `v_0` — driver, m/s: initial velocity
  - `a` — driver, m/s²: acceleration
  - `t` — driver, s: elapsed time
  - `x` — response, m: final position
- **limits:**
  - a = 0 → x = x₀ + v₀t (uniform motion)
  - v₀ = 0 → x − x₀ = ½at² (started from rest)
  - Quadratic time dependence: doubling t gives 4× displacement when v₀ = 0
- **misconceptions:**
  - ❌ Displacement scales linearly with time when accelerating → ✓ Scales with t² (when v₀ = 0)
- **prereqs:**
  - `kinematics-velocity-time` (weight 0.85)
  - `kinematics-position-from-avg-velocity` (weight 0.7)
- **tags:** [kinematics, constant-acceleration, position, 1d-motion]

---

### 7. Velocity vs. Position — "Timeless" Equation

- **id:** `kinematics-velocity-position`
- **title:** Kinematics — Timeless Equation
- **formula:** `v^2 = v_0^2 + 2 a (x - x_0)`
- **principle:** Under constant acceleration, the change in velocity squared scales linearly with displacement — useful when time is unknown.
- **causal:** asymmetric
- **vars:**
  - `v_0` — parameter, m/s: initial velocity
  - `a` — driver, m/s²: acceleration
  - `x_0` — parameter, m: initial position
  - `x` — driver, m: final position
  - `v` — response, m/s: final velocity (take signed root)
- **limits:**
  - a = 0 → v² = v₀² (no change in speed)
  - x = x₀ → v = v₀
- **misconceptions:**
  - ❌ Doubling speed doubles stopping distance → ✓ Stopping distance scales as v² → quadruples
  - ❌ The square root resolves automatically → ✓ Sign must be chosen by physical reasoning
- **prereqs:**
  - `kinematics-velocity-time` (weight 0.7)
  - `kinematics-position-time` (weight 0.7)
- **tags:** [kinematics, constant-acceleration, energy-precursor, 1d-motion]

---

### 8. Free Fall

- **id:** `free-fall`
- **title:** Free Fall (Constant Acceleration Due to Gravity)
- **formula:** `a = -g, \quad g \approx 9.80\ \text{m/s}^2`
- **principle:** Near Earth's surface, all objects in free fall (no air resistance) accelerate downward at the same rate g, regardless of mass.
- **causal:** asymmetric (gravity → acceleration)
- **vars:**
  - `g` — parameter, m/s²: magnitude of gravitational acceleration at Earth's surface (≈ 9.80)
  - `m` — parameter, kg: mass of object (does not appear in equation — that's the point)
  - `a` — response, m/s²: acceleration of falling object
- **limits:**
  - Air resistance negligible → constant a (this *is* the limit)
  - On Moon → g ≈ 1.67 m/s²; varies 9.78–9.83 m/s² across Earth's surface
  - Up = positive convention → a = −g; down = positive → a = +g
- **misconceptions:**
  - ❌ Heavier objects fall faster → ✓ All objects fall at same rate in vacuum (Galileo, Apollo 15 demo)
  - ❌ At apex of throw, a = 0 because v = 0 → ✓ a = −g throughout free fall, including the apex
  - ❌ g changes with how the object was launched → ✓ g is a property of the gravitational field, not the trajectory
- **prereqs:**
  - `kinematics-velocity-time` (weight 0.85)
  - `kinematics-position-time` (weight 0.85)
- **tags:** [kinematics, gravity, free-fall, constant-acceleration]

---

## Pedagogical Notes (for downstream LLM context)

- The four kinematic equations are best taught as a "missing variable" toolkit: pick the one that *omits* the unknown you don't care about.
- Sign convention is the #1 source of errors in 1D kinematics. Force students to commit to a positive direction *on the diagram* before writing equations.
- "Deceleration ≠ negative *a*" — define deceleration by *a opposing v*, not by sign.
- Free-fall problems should use *y* (vertical) instead of *x* to keep horizontal/vertical separable later.
- Graphical interpretation (slope ↔ derivative, area-under ↔ integral) is the conceptual on-ramp to calculus and worth investing in even for algebra-based PHY 114.
