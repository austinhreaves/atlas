# Chapter 6 — Uniform Circular Motion and Gravitation

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 6.1 Rotation Angle and Angular Velocity · 6.2 Centripetal Acceleration · 6.3 Centripetal Force · 6.4 Fictitious Forces and Non-inertial Frames · 6.5 Newton's Universal Law of Gravitation · 6.6 Satellites and Kepler's Laws

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 6
idealizations:
  - {name: "Rigid body / point mass", scope: "idealized"}
  - {name: "Circular orbit", scope: "limiting-case (special-case ellipse)"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
  - {name: "Spherically symmetric source mass", scope: "idealized"}
```

---

## Chapter Overview

Generalizes Newton's laws to motion along a curved path. Introduces angular kinematics (θ, ω) and shows that any object moving in a circle must have centripetal acceleration directed toward the center, requiring a real centripetal force to supply it. Fictitious forces (centrifugal, Coriolis) appear in rotating frames and are book-keeping artifacts of non-inertial reference. The chapter then steps up to **gravity** as the universal force that supplies centripetal acceleration for orbits, derives Kepler's third law from F = GMm/r², and reframes Kepler's empirical laws as consequences of one underlying principle.

---

## Concept Nodes

### 1. Rotation Angle and Arc Length

- **id:** `rotation-angle-radian`
- **title:** Rotation Angle (Radian Measure)
- **formula:** `\Delta\theta = \frac{\Delta s}{r}`
- **principle:** The rotation angle (in radians) equals the arc length traveled along a circular path divided by the radius of curvature.
- **causal:** symmetric (definitional)
- **vars:**
  - `\Delta s` — driver, m: arc length traveled
  - `r` — parameter, m: radius of curvature
  - `\Delta\theta` — response, rad: rotation angle (dimensionless ratio of two lengths)
- **limits:**
  - One full revolution → Δs = 2πr → Δθ = 2π rad = 360°
  - Conversion: 1 rad = 57.3°
  - Radians are technically dimensionless; can be inserted/dropped in unit analysis
- **misconceptions:**
  - ❌ Radians are a "real" unit like meters → ✓ A radian is a ratio of two lengths and is unitless
  - ❌ Use degrees in physics formulas → ✓ Always convert to radians before using s = rθ, v = rω, etc.
- **prereqs:**
  - `displacement-1d` (weight 0.5)
- **tags:** [rotation, kinematics, geometry, circular-motion]

---

### 2. Angular Velocity

- **id:** `angular-velocity`
- **title:** Angular Velocity
- **formula:** `\omega = \frac{\Delta\theta}{\Delta t},\quad v = r\omega`
- **principle:** Angular velocity is the rate at which the rotation angle changes; for an object moving in a circle of radius r, the tangential (linear) speed equals r times the angular speed.
- **causal:** symmetric (definitional / geometric)
- **vars:**
  - `\Delta\theta` — driver, rad: angle swept
  - `\Delta t` — driver, s: elapsed time
  - `r` — parameter, m: radius of the circular path
  - `\omega` — response, rad/s: angular velocity
  - `v` — response, m/s: tangential speed at radius r
- **limits:**
  - Outer rim of a rigid wheel has larger v but same ω as inner rim
  - Constant ω → uniform circular motion (speed constant; direction changing)
  - Period T and ω: ω = 2π/T
- **misconceptions:**
  - ❌ Two points on a spinning record have different angular velocities → ✓ Same ω; different v because different r
  - ❌ A car's tire and the ground have the same speed at the contact point → ✓ At rolling without slipping, the contact point is *instantaneously at rest*; the wheel's center moves at v = rω
- **prereqs:**
  - `rotation-angle-radian` (weight 0.95)
  - `average-velocity` (weight 0.7)
- **tags:** [rotation, angular-velocity, kinematics, circular-motion]

---

### 3. Centripetal Acceleration

- **id:** `centripetal-acceleration`
- **title:** Centripetal Acceleration
- **formula:** `a_c = \frac{v^2}{r} = r\omega^2`
- **principle:** An object moving in a circle of radius r at constant speed v has acceleration of magnitude v²/r directed toward the center — required to continually change the direction of velocity.
- **causal:** asymmetric (changing-direction velocity → centripetal acceleration)
- **vars:**
  - `v` — driver, m/s: tangential speed
  - `r` — parameter, m: radius of the circular path
  - `\omega` — driver, rad/s: angular velocity (alternative form)
  - `a_c` — response, m/s²: centripetal acceleration (toward center)
- **limits:**
  - Uniform circular motion → a_c is the *only* acceleration (no tangential component)
  - Non-uniform circular motion → also has tangential component a_t = dv/dt
  - At v → 0, a_c → 0; at r → 0 (with v fixed), a_c → ∞
  - Quadratic in v: doubling speed quadruples a_c (think: car cornering)
- **misconceptions:**
  - ❌ Centripetal acceleration points outward → ✓ It always points *toward* the center
  - ❌ A constant-speed circular motion has zero acceleration (because |v| is constant) → ✓ Acceleration is rate of change of v *as a vector*; direction is changing → a ≠ 0
- **prereqs:**
  - `angular-velocity` (weight 0.85)
  - `average-acceleration` (weight 0.85)
- **tags:** [circular-motion, centripetal, acceleration, kinematics]

---

### 4. Centripetal Force

- **id:** `centripetal-force`
- **title:** Centripetal Force
- **formula:** `F_c = m a_c = \frac{m v^2}{r} = m r \omega^2`
- **principle:** The net force required to keep a mass m moving in a circle of radius r at speed v has magnitude mv²/r and points toward the center; it is supplied by whatever real force fits the geometry (tension, friction, gravity, normal, etc.).
- **causal:** asymmetric (real force in radial direction → centripetal acceleration via F = ma)
- **vars:**
  - `m` — parameter, kg: mass of the orbiting object
  - `v` — driver, m/s: tangential speed
  - `r` — parameter, m: radius of the circular path
  - `F_c` — response, N: net inward force required
- **limits:**
  - Friction supplies F_c for a car cornering on flat ground → max v before sliding sets the safe speed
  - Tension supplies F_c for a ball on a string → if string snaps, ball moves tangentially (Newton's 1st)
  - Gravity supplies F_c for orbits → next concept node
  - Normal force on a banked road can supply F_c → no friction needed at the design speed
- **misconceptions:**
  - ❌ Centripetal force is a separate kind of force → ✓ It's the *role* a real force plays; identify the real force first (gravity, tension, friction…)
  - ❌ A "centrifugal force" pushes you outward in a turning car → ✓ You're being pushed *inward* by the door/seat; what feels like outward push is your inertia (your tendency to go straight)
- **prereqs:**
  - `centripetal-acceleration` (weight 0.95)
  - `newtons-second-law` (weight 0.95)
- **tags:** [circular-motion, centripetal, force, dynamics]

---

### 5. Fictitious Forces in Rotating Frames

- **id:** `fictitious-forces`
- **title:** Fictitious Forces (Centrifugal, Coriolis)
- **principle:** In a non-inertial (accelerating or rotating) reference frame, Newton's laws appear to fail unless one introduces fictitious forces — bookkeeping terms that account for the frame's acceleration; in an inertial frame they vanish.
- **causal:** asymmetric (frame choice → required correction terms)
- **vars:**
  - Frame choice (inertial vs. non-inertial)
  - `\vec{F}_{cf} = m\omega^2 \vec{r}` — centrifugal (outward, in rotating frame)
  - `\vec{F}_{Cor} = -2m\,\vec{\omega} \times \vec{v}'` — Coriolis (deflection of moving objects in rotating frame)
- **limits:**
  - Earth's rotation: ω_E ≈ 7.3 × 10⁻⁵ rad/s → Coriolis is small but visible (cyclones, Foucault pendulum)
  - Equatorial centrifugal effect → reduces apparent g by ~0.034 m/s² at the equator
  - In a strictly inertial frame: no fictitious forces; only real forces from real interactions
- **misconceptions:**
  - ❌ Centrifugal force is real and pushes things outward → ✓ It's a fictitious force, only present when you analyze in the rotating frame
  - ❌ Cyclones rotate the way they do because of "Coriolis pulling" them → ✓ Coriolis is an apparent deflection from the rotating-Earth frame; in the inertial frame, the air just moves in nearly straight lines
- **prereqs:**
  - `centripetal-force` (weight 0.7)
  - `newtons-first-law` (weight 0.6)
- **tags:** [non-inertial, rotating-frame, centrifugal, coriolis, fictitious]

---

### 6. Newton's Universal Law of Gravitation

- **id:** `universal-gravitation`
- **title:** Newton's Universal Law of Gravitation
- **formula:** `F = G\,\frac{M m}{r^2}`
- **principle:** Every pair of point masses attracts each other along the line connecting them with a force proportional to the product of their masses and inversely proportional to the square of their separation.
- **causal:** asymmetric (mass distribution → gravitational force)
- **vars:**
  - `M, m` — drivers, kg: the two masses
  - `r` — driver, m: distance between centers of mass
  - `G` — parameter, m³/(kg·s²): universal gravitational constant ≈ 6.674 × 10⁻¹¹
  - `F` — response, N: gravitational force magnitude (attractive)
- **limits:**
  - Spherically symmetric bodies → can use distance between centers (shell theorem)
  - r → 0 → F → ∞ (idealization breaks at point-mass singularity; classical only)
  - r → ∞ → F → 0; gravity has infinite range but falls off rapidly
  - Modified by general relativity in strong fields (Mercury's perihelion, black holes)
  - G is the least-precisely-known fundamental constant in physics
- **misconceptions:**
  - ❌ Gravity is the strongest force → ✓ Weakest of the four fundamental forces by ~36 orders of magnitude; dominates at large scale only because mass is always positive and unscreened
  - ❌ Gravity disappears in orbit ("zero gravity") → ✓ Astronauts in low orbit have ~89% of surface g; they're in continuous free fall
  - ❌ Heavier objects gravitate more strongly toward each other → ✓ Force is mutual and equal-and-opposite (Newton's 3rd); both feel the same F, but heavier object accelerates less
- **prereqs:**
  - `newtons-second-law` (weight 0.7)
  - `weight-gravitational-force` (weight 0.7)
- **tags:** [gravity, fundamental-force, inverse-square, foundational]

---

### 7. Acceleration Due to Gravity from Mass and Radius

- **id:** `g-from-mass-radius`
- **title:** Surface Gravity from Mass and Radius
- **formula:** `g = \frac{G M}{r^2}`
- **principle:** The gravitational acceleration at distance r from the center of a spherical mass M depends only on M and r, not on the test mass — the test mass cancels in F = ma.
- **causal:** asymmetric (source mass + distance → field)
- **vars:**
  - `M` — driver, kg: mass of the gravitating body (e.g., Earth)
  - `r` — driver, m: distance from center of M
  - `G` — parameter: gravitational constant
  - `g` — response, m/s²: gravitational acceleration at distance r
- **limits:**
  - At Earth's surface: r = R_E ≈ 6.38 × 10⁶ m, M_E ≈ 5.97 × 10²⁴ kg → g ≈ 9.80 m/s²
  - At Moon's distance from Earth (3.84 × 10⁸ m): g ≈ 0.0027 m/s² (matches Moon's centripetal acceleration — Newton's clinching argument)
  - On Moon's surface: g ≈ 1.67 m/s²
  - At altitude h ≪ R: g(h) ≈ g_surface (1 − 2h/R)
- **misconceptions:**
  - ❌ g depends on the falling object's mass → ✓ Object mass cancels; this is the equivalence principle
  - ❌ g is a constant of nature → ✓ g is a *property of the gravitating body*; G is the universal constant
- **prereqs:**
  - `universal-gravitation` (weight 0.95)
  - `newtons-second-law` (weight 0.85)
- **tags:** [gravity, surface-gravity, equivalence-principle, planetary]

---

### 8. Kepler's Three Laws

- **id:** `keplers-laws`
- **title:** Kepler's Laws of Planetary Motion
- **principle:** (1) Each planet's orbit is an ellipse with the Sun at one focus. (2) The line from the Sun to a planet sweeps out equal areas in equal times. (3) The square of the orbital period is proportional to the cube of the semi-major axis: T² ∝ r³.
- **causal:** symmetric (descriptive — Kepler's laws are observed regularities; gravity is the cause)
- **vars:**
  - `T` — response/driver, s or yr: orbital period
  - `r` — response/driver, m or AU: semi-major axis (orbital radius for circular orbits)
  - Equal-area rate: dA/dt = constant (consequence of angular-momentum conservation)
- **limits:**
  - Strictly valid for an isolated two-body system (small mass orbiting a much larger one)
  - Multi-body perturbations (Jupiter on Saturn, etc.) cause small deviations — historically used to discover Neptune
  - Relativistic corrections needed near very massive bodies (Mercury's perihelion precession)
- **misconceptions:**
  - ❌ Planets orbit in perfect circles → ✓ Ellipses; Earth's eccentricity is small (0.017) so it looks circular
  - ❌ Kepler discovered the cause of orbits → ✓ Kepler discovered the *patterns*; Newton supplied the cause (gravity)
  - ❌ Planets move at constant speed → ✓ They speed up at perihelion, slow at aphelion (2nd law)
- **prereqs:**
  - `centripetal-force` (weight 0.7)
  - `universal-gravitation` (weight 0.85)
- **tags:** [orbits, kepler, planetary, gravitation, conservation]

---

### 9. Kepler's Third Law from Gravity (Circular Orbits)

- **id:** `keplers-third-law-derived`
- **title:** Kepler's Third Law Derived from Newtonian Gravity
- **formula:** `T^2 = \frac{4\pi^2}{G M}\,r^3`
- **principle:** Setting gravity equal to the centripetal force for a circular orbit gives T² ∝ r³, with proportionality constant 4π²/(GM) — explaining Kepler's empirical third law and allowing the parent body's mass to be computed from any satellite's orbit.
- **causal:** asymmetric (Newton's 2nd + universal gravitation → Kepler's 3rd)
- **vars:**
  - `M` — driver, kg: mass of parent body
  - `r` — driver, m: orbital radius (circular orbit)
  - `T` — response, s: orbital period
  - `G` — parameter: gravitational constant
- **limits:**
  - Circular orbits only (for ellipses, replace r with semi-major axis a)
  - Test mass m cancels — all satellites at radius r orbit with the same T
  - Holds only for satellites of the same parent body; M sets the proportionality
  - Geosynchronous orbit: T = 1 day → r ≈ 4.22 × 10⁷ m (~36,000 km altitude)
- **misconceptions:**
  - ❌ Heavier satellites orbit slower at the same altitude → ✓ Satellite mass cancels; T depends only on M (parent) and r
  - ❌ Kepler's 3rd is one universal constant → ✓ The constant 4π²/(GM) depends on the parent body; it's only universal for a fixed M
- **prereqs:**
  - `centripetal-force` (weight 0.95)
  - `universal-gravitation` (weight 0.95)
  - `keplers-laws` (weight 0.7)
- **tags:** [orbits, kepler, gravitation, derivation, planetary]

---

## Pedagogical Notes (for downstream LLM context)

- The single biggest unlock of this chapter: **centripetal force is not a new force**. It's the *role* played by some real, identifiable force (gravity, tension, friction, normal). Always ask "what is supplying the centripetal force here?" before writing F_c = mv²/r.
- The Moon-and-apple thought experiment (Ex 6.6) is genuinely Newton's argument for universal gravitation. Compute g at the Moon's distance using GM/r² and compare to v²/r from the Moon's orbit — they agree to ~1%. That agreement *is* the discovery.
- Centrifugal vs. centripetal naming is a perennial source of pain. Anchor the convention: **centripetal = real, inward, in inertial frames; centrifugal = fictitious, outward, in rotating frames only**. Don't let "centrifugal" appear in your students' free-body diagrams.
- Kepler's third law is the cleanest example of a derivation that takes a descriptive empirical pattern and explains it with a deeper principle. Worth showing the full chain F_grav → F_centripetal → solve for T.
- The fact that g(test mass) is independent of test mass = the **equivalence principle**, the seed of general relativity. Even if you don't say the words, plant the observation.
- For PHY 132 (calculus-based): banked-curve problems are the canonical place to practice combining centripetal force, normal force decomposition, and (optionally) friction. For PHY 114: vertical-loop and conical-pendulum problems are more accessible.
- Microgravity ≠ no gravity. Astronauts in LEO experience ~89% of surface g but appear weightless because they (and the station) are in continuous free fall. Anchor this distinction early.
