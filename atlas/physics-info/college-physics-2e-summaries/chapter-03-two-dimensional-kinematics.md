# Chapter 3 — Two-Dimensional Kinematics

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 3.1 Kinematics in 2D: An Introduction · 3.2 Vector Addition & Subtraction: Graphical · 3.3 Vector Addition & Subtraction: Analytical · 3.4 Projectile Motion · 3.5 Addition of Velocities

**Domain:** mechanics
**Suggested shared metadata:**

```yaml
layer: concept
domain: mechanics
chapter: 3
idealizations:
  - {name: "Air resistance", scope: "idealized"}
  - {name: "Flat Earth (locally)", scope: "idealized"}
  - {name: "Constant g", scope: "limiting-case"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
```

---

## Chapter Overview

Generalizes Ch 2's 1D kinematics to 2D by introducing **vectors** and the **independence of perpendicular motion**. The decomposition into x- and y-components turns every 2D problem into a pair of 1D problems solved with the Ch 2 toolkit. Projectile motion is the canonical application: horizontal motion is uniform, vertical motion is free fall, and they share only one variable — time. Closes with relative velocity (Galilean addition).

---

## Concept Nodes

### 1. Vector Decomposition into Components

- **id:** `vector-decomposition`
- **title:** Resolving a Vector into Perpendicular Components
- **formula:** `A_x = A\cos\theta,\quad A_y = A\sin\theta`
- **principle:** Any 2D vector can be uniquely expressed as the sum of two perpendicular components along chosen coordinate axes.
- **causal:** symmetric (definitional/geometric)
- **vars:**
  - `A` — driver, [units of A]: magnitude of the vector
  - `\theta` — driver, rad or deg: angle measured **from the +x axis**, counterclockwise positive
  - `A_x` — response, [units of A]: x-component (signed)
  - `A_y` — response, [units of A]: y-component (signed)
- **limits:**
  - θ = 0 → A_x = A, A_y = 0 (vector lies along +x)
  - θ = 90° → A_x = 0, A_y = A
  - θ in (90°, 180°) → A_x < 0; signs encode direction
- **misconceptions:**
  - ❌ Always use sine for the "vertical" piece → ✓ Which trig function applies depends on which angle you're measuring; sin/cos pair to the angle's location relative to the axis
  - ❌ Components are scalars → ✓ Components are signed; the sign IS the directional information
- **prereqs:**
  - `displacement-1d` (weight 0.6)
- **tags:** [vectors, components, trigonometry, 2d-motion]

---

### 2. Vector Magnitude from Components

- **id:** `vector-magnitude-from-components`
- **title:** Magnitude of a Vector from Its Components
- **formula:** `A = \sqrt{A_x^2 + A_y^2}`
- **principle:** The magnitude of a 2D vector equals the Pythagorean combination of its perpendicular components.
- **causal:** symmetric (geometric identity)
- **vars:**
  - `A_x` — driver, [units of A]: x-component
  - `A_y` — driver, [units of A]: y-component
  - `A` — response, [units of A]: magnitude (always ≥ 0)
- **limits:**
  - A_y = 0 → A = |A_x|
  - Either component → ∞ → A → ∞
- **misconceptions:**
  - ❌ A = A_x + A_y → ✓ Magnitudes don't add linearly across perpendicular axes
- **prereqs:**
  - `vector-decomposition` (weight 0.9)
- **tags:** [vectors, magnitude, pythagorean, 2d-motion]

---

### 3. Vector Direction from Components

- **id:** `vector-direction-from-components`
- **title:** Direction of a Vector from Its Components
- **formula:** `\theta = \tan^{-1}\!\left(\frac{A_y}{A_x}\right)`
- **principle:** The direction angle of a 2D vector is the arctangent of the ratio of its y- to x-component, with quadrant resolved by the signs of the components.
- **causal:** symmetric (geometric identity)
- **vars:**
  - `A_x` — driver, [units of A]: x-component (sign matters)
  - `A_y` — driver, [units of A]: y-component (sign matters)
  - `\theta` — response, rad or deg: direction angle from +x axis
- **limits:**
  - A_x = 0, A_y > 0 → θ = 90°; A_x = 0, A_y < 0 → θ = −90° (or 270°)
  - Both negative → vector in Q3, calculator returns Q1 angle — must add 180°
- **misconceptions:**
  - ❌ The arctangent gives the right answer directly → ✓ Calculators return values in (−90°, 90°); you must inspect signs to assign the correct quadrant
- **prereqs:**
  - `vector-decomposition` (weight 0.9)
- **tags:** [vectors, direction, trigonometry, 2d-motion]

---

### 4. Analytical Vector Addition

- **id:** `vector-addition-analytical`
- **title:** Vector Addition by Components
- **formula:** `R_x = \sum_i A_{i,x},\quad R_y = \sum_i A_{i,y},\quad R = \sqrt{R_x^2 + R_y^2},\ \theta_R = \tan^{-1}(R_y/R_x)`
- **principle:** To add vectors, sum like components separately; magnitude and direction of the resultant follow from the totals.
- **causal:** symmetric (definitional)
- **vars:**
  - `A_{i,x}, A_{i,y}` — drivers, [units]: components of each input vector
  - `R_x, R_y` — response, [units]: components of the resultant
  - `R` — response, [units]: magnitude of the resultant
  - `\theta_R` — response, rad or deg: direction of the resultant
- **limits:**
  - All A_i parallel → reduces to scalar sum (1D)
  - Two equal vectors at 180° → R = 0
- **misconceptions:**
  - ❌ Magnitudes add: |A| + |B| = |A + B| → ✓ Only true when A and B are parallel; in general |A + B| ≤ |A| + |B|
  - ❌ Subtraction is a separate operation → ✓ A − B = A + (−B); negate components and add
- **prereqs:**
  - `vector-decomposition` (weight 0.9)
  - `vector-magnitude-from-components` (weight 0.85)
  - `vector-direction-from-components` (weight 0.85)
- **tags:** [vectors, addition, components, 2d-motion]

---

### 5. Independence of Perpendicular Motions

- **id:** `independence-of-perpendicular-motion`
- **title:** Independence of Perpendicular Motions
- **principle:** Motion along perpendicular axes is independent: the kinematics in x and y can be solved as two separate 1D problems coupled only by the shared time variable.
- **causal:** asymmetric (foundational principle that *enables* projectile/2D analysis)
- **vars:**
  - `t` — driver, s: shared time coordinate (the only link between axes)
  - `x(t), v_x(t), a_x` — 1D kinematic variables along x
  - `y(t), v_y(t), a_y` — 1D kinematic variables along y
- **limits:**
  - Holds in the absence of forces that couple axes (e.g., velocity-dependent drag couples x and y)
  - Strictly valid in inertial frames; rotational frames introduce coupling (Coriolis)
- **misconceptions:**
  - ❌ A horizontal push affects how fast something falls → ✓ In free fall (no air), horizontal velocity does not change vertical fall time
  - ❌ Bullet dropped vs. bullet fired horizontally hit the ground at different times → ✓ They hit at the same time (assuming same release height, no air)
- **prereqs:**
  - `vector-decomposition` (weight 0.7)
  - `kinematics-position-time` (weight 0.85)
- **tags:** [2d-motion, projectile, foundational, kinematics]

---

### 6. Projectile Motion (Standard Decomposition)

- **id:** `projectile-motion`
- **title:** Projectile Motion — Decomposed Kinematics
- **formula:** `x = x_0 + v_{0x} t,\quad y = y_0 + v_{0y} t - \tfrac{1}{2} g t^2,\quad v_y = v_{0y} - g t`
- **principle:** A projectile in free fall has constant horizontal velocity (a_x = 0) and constant downward vertical acceleration (a_y = −g); the trajectory is a parabola.
- **causal:** asymmetric (gravity → vertical acceleration; initial conditions → trajectory)
- **vars:**
  - `v_0` — driver, m/s: initial speed
  - `\theta_0` — driver, rad or deg: launch angle from horizontal
  - `v_{0x} = v_0\cos\theta_0` — driver, m/s: initial horizontal velocity
  - `v_{0y} = v_0\sin\theta_0` — driver, m/s: initial vertical velocity
  - `g` — parameter, m/s²: gravitational acceleration (≈ 9.80)
  - `t` — driver, s: elapsed time
  - `x, y` — response, m: position
  - `v_y` — response, m/s: vertical velocity (sign convention: up = +)
- **limits:**
  - Air resistance negligible (idealization that *defines* this regime)
  - g constant over the trajectory (height change ≪ R_Earth)
  - θ_0 = 90° → degenerate to 1D vertical free fall
  - θ_0 = 0° → horizontal launch (drop with sideways velocity)
- **misconceptions:**
  - ❌ Horizontal velocity decreases as the projectile flies → ✓ Constant in the idealization (no air); only changes if drag acts
  - ❌ At the apex, the projectile has zero acceleration → ✓ a = −g throughout; only v_y = 0 at apex
  - ❌ Heavier projectiles travel farther → ✓ In the no-air idealization, range depends on v_0 and θ_0, not mass
- **prereqs:**
  - `independence-of-perpendicular-motion` (weight 0.95)
  - `free-fall` (weight 0.9)
  - `kinematics-position-time` (weight 0.85)
- **tags:** [projectile, 2d-motion, free-fall, kinematics]

---

### 7. Projectile Range (Level Ground)

- **id:** `projectile-range-level`
- **title:** Range of a Projectile on Level Ground
- **formula:** `R = \frac{v_0^2 \sin(2\theta_0)}{g}`
- **principle:** For a projectile launched and landing at the same elevation, horizontal range scales with the square of launch speed and is maximized at a 45° launch angle.
- **causal:** asymmetric (initial conditions → range)
- **vars:**
  - `v_0` — driver, m/s: initial speed
  - `\theta_0` — driver, rad or deg: launch angle from horizontal
  - `g` — parameter, m/s²: gravitational acceleration (≈ 9.80)
  - `R` — response, m: horizontal range
- **limits:**
  - Same launch and landing height (else use full trajectory equations)
  - No air resistance
  - θ_0 = 45° → maximum range R_max = v_0²/g
  - θ_0 and (90° − θ_0) give the same range (complementary-angle symmetry)
- **misconceptions:**
  - ❌ Higher launch angle always means longer range → ✓ Only up to 45°; above that, R decreases
  - ❌ Range scales linearly with speed → ✓ R ∝ v_0² — doubling speed quadruples range
- **prereqs:**
  - `projectile-motion` (weight 0.95)
- **tags:** [projectile, range, 2d-motion]

---

### 8. Galilean Velocity Addition

- **id:** `relative-velocity-addition`
- **title:** Relative Velocity (Galilean Addition)
- **formula:** `\vec{v}_{AC} = \vec{v}_{AB} + \vec{v}_{BC}`
- **principle:** The velocity of object A relative to frame C equals the velocity of A relative to frame B plus the velocity of frame B relative to frame C — performed as a vector sum.
- **causal:** symmetric (frame transformation)
- **vars:**
  - `\vec{v}_{AB}` — driver, m/s: velocity of A measured in frame B
  - `\vec{v}_{BC}` — driver, m/s: velocity of frame B measured in frame C
  - `\vec{v}_{AC}` — response, m/s: velocity of A measured in frame C
- **limits:**
  - Speeds ≪ c (else relativistic velocity addition is required)
  - Inertial frames (Galilean transformation breaks down in accelerating frames)
- **misconceptions:**
  - ❌ Speeds add as scalars → ✓ Velocities add as vectors; subscript-cancellation (AB + BC = AC) is the bookkeeping
  - ❌ A boat heading "straight across" a river arrives directly across → ✓ The current carries it downstream; ground-frame velocity is the vector sum
- **prereqs:**
  - `vector-addition-analytical` (weight 0.9)
  - `average-velocity` (weight 0.7)
- **tags:** [relative-motion, vectors, frames, 2d-motion]

---

## Pedagogical Notes (for downstream LLM context)

- The **single most important takeaway** of Ch 3 is the independence of perpendicular motion. Every projectile problem reduces to "two 1D problems coupled by t." Drill this before any equation memorization.
- Force students to draw a labeled vector diagram with axes *committed* before writing components. Quadrant errors in arctan are the #1 source of pain.
- Range equation only works for **same launch and landing elevation** — use it as a sanity check but solve general problems with the full y(t) and x(t) decomposition.
- The complementary-angle range symmetry (15° and 75° give the same range) is a great launching point for noticing that air resistance breaks this symmetry — useful intuition for the optics/labs that come later in PHY 114.
- Relative velocity is the gateway to inertial frames in Ch 4 — connect "no preferred frame" here to Newton's first law there.

