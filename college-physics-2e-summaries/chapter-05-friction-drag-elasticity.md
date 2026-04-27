# Chapter 5 — Further Applications of Newton's Laws: Friction, Drag, and Elasticity

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 5.1 Friction · 5.2 Drag Forces · 5.3 Elasticity: Stress and Strain

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 5
idealizations:
  - {name: "Constant friction coefficients", scope: "idealized"}
  - {name: "Quadratic drag (high-Re regime)", scope: "limiting-case"}
  - {name: "Linear stress–strain (Hooke regime)", scope: "limiting-case"}
  - {name: "Uniform, isotropic materials", scope: "idealized"}
```

---

## Chapter Overview

Three real-world departures from the idealized world of Ch 4. **Friction** opposes motion at solid–solid interfaces and comes in two flavors (static, which adjusts up to a maximum; kinetic, which is roughly constant). **Drag** opposes motion through fluids and depends on velocity (∝ v² for everyday objects; → terminal velocity when balanced by gravity). **Elasticity** describes how forces deform solids: Hooke's law for small deformations, and three elastic moduli (Young's, shear, bulk) for the three geometric flavors of deformation.

---

## Concept Nodes

### 1. Static Friction (Inequality)

- **id:** `static-friction`
- **title:** Static Friction
- **formula:** `f_s \leq \mu_s N`
- **principle:** Static friction is a responsive force that exactly opposes any applied force tending to cause motion, up to a maximum proportional to the normal force; beyond this maximum, the surfaces slip.
- **causal:** asymmetric (applied force → reaction friction; magnitude bounded by μ_s N)
- **vars:**
  - `\mu_s` — parameter, dimensionless: coefficient of static friction (depends on materials in contact)
  - `N` — driver, N: normal force between surfaces
  - `f_s` — response, N: static friction force (whatever magnitude is needed to prevent motion, up to μ_s N)
- **limits:**
  - Applied force = 0 → f_s = 0 (friction is responsive, not a "background" force)
  - Approaches μ_s N at threshold of slipping
  - Once slipping occurs → kinetic friction takes over (typically smaller)
  - μ_s independent of contact area in the simple model (real surfaces deviate)
- **misconceptions:**
  - ❌ Static friction always equals μ_s N → ✓ It's an inequality; f_s = μ_s N only at the verge of slipping
  - ❌ Increasing contact area increases friction → ✓ In the idealized model, only μ and N matter; pressure × area effects cancel
- **prereqs:**
  - `normal-force` (weight 0.95)
  - `newtons-second-law` (weight 0.7)
- **tags:** [friction, contact-force, statics, dynamics]

---

### 2. Kinetic Friction

- **id:** `kinetic-friction`
- **title:** Kinetic (Sliding) Friction
- **formula:** `f_k = \mu_k N`
- **principle:** Once two surfaces are sliding relative to each other, kinetic friction opposes the relative motion with magnitude proportional to the normal force.
- **causal:** asymmetric (relative sliding + normal load → friction force)
- **vars:**
  - `\mu_k` — parameter, dimensionless: coefficient of kinetic friction (typically μ_k < μ_s)
  - `N` — driver, N: normal force
  - `f_k` — response, N: kinetic friction force, opposite to relative velocity
- **limits:**
  - μ_k < μ_s (almost always) → "easier to keep moving than to start"
  - Approximately independent of sliding speed at moderate v
  - Heavy lubrication → μ_k → very small (oiled steel-on-steel ~0.03)
  - Bone in synovial fluid → μ_k ~ 0.015 (incredibly slick)
- **misconceptions:**
  - ❌ Kinetic friction is always opposite the velocity in the ground frame → ✓ It opposes the *relative* velocity of the two contacting surfaces
  - ❌ Higher speed → more friction → ✓ Roughly independent of speed (drag, not friction, scales with speed)
- **prereqs:**
  - `normal-force` (weight 0.95)
  - `static-friction` (weight 0.7)
- **tags:** [friction, contact-force, dynamics, sliding]

---

### 3. Drag Force (Quadratic Regime)

- **id:** `drag-force-quadratic`
- **title:** Drag Force at High Reynolds Number
- **formula:** `F_D = \tfrac{1}{2} \rho C A v^2`
- **principle:** For everyday-sized objects moving through air or water at moderate speeds, the drag force opposes motion and scales with the square of the speed; the proportionality depends on shape, frontal area, and fluid density.
- **causal:** asymmetric (motion through fluid → opposing drag force)
- **vars:**
  - `\rho` — parameter, kg/m³: fluid density
  - `C` — parameter, dimensionless: drag coefficient (shape-dependent; ~0.05 airfoil, ~1.0 horizontal skydiver)
  - `A` — parameter, m²: cross-sectional area facing flow
  - `v` — driver, m/s: speed of object relative to fluid
  - `F_D` — response, N: drag force magnitude (direction opposite to relative motion)
- **limits:**
  - Small particles at low speeds → linear in v (Stokes' law: F_D = 6πηrv)
  - C is approximately constant only over a limited Reynolds-number range
  - At highway speeds, drag dominates fuel consumption (~50% of car power)
- **misconceptions:**
  - ❌ Drag scales linearly with speed → ✓ At everyday scales, F_D ∝ v² — doubling speed quadruples drag
  - ❌ Drag depends only on speed → ✓ Also on density, area, and shape (C)
- **prereqs:**
  - `newtons-second-law` (weight 0.85)
- **tags:** [drag, fluid, dynamics, dissipation]

---

### 4. Terminal Velocity

- **id:** `terminal-velocity`
- **title:** Terminal Velocity in Free Fall with Drag
- **formula:** `v_t = \sqrt{\frac{2 m g}{\rho C A}}`
- **principle:** A falling object accelerates until drag balances gravity; thereafter it falls at a constant terminal velocity that scales with √(m/A) and depends on shape and fluid density.
- **causal:** asymmetric (force balance → constant velocity)
- **vars:**
  - `m` — driver, kg: mass of falling object
  - `g` — parameter, m/s²: gravitational acceleration
  - `\rho` — parameter, kg/m³: fluid density
  - `C, A` — parameters: drag coefficient and frontal area
  - `v_t` — response, m/s: terminal speed
- **limits:**
  - Very small objects (dust, water droplets) reach v_t almost instantly
  - Skydiver belly-down: v_t ≈ 60 m/s; head-down: v_t ≈ 90 m/s (smaller A)
  - At v_t, a = 0 even though gravity still acts (force balance ≠ no forces)
- **misconceptions:**
  - ❌ Heavier objects always fall faster → ✓ In vacuum, no; with air, larger m at same A → larger v_t (so heavier *can* be faster)
  - ❌ A skydiver is "weightless" at terminal velocity → ✓ Drag = weight; both forces are present and large
- **prereqs:**
  - `drag-force-quadratic` (weight 0.95)
  - `weight-gravitational-force` (weight 0.85)
  - `newtons-first-law` (weight 0.7)
- **tags:** [drag, terminal-velocity, free-fall, equilibrium]

---

### 5. Hooke's Law (Springs / Small Deformations)

- **id:** `hookes-law`
- **title:** Hooke's Law for Elastic Deformations
- **formula:** `F = k \, \Delta L`
- **principle:** For small deformations of an elastic body, the restoring force is directly proportional to the displacement from equilibrium.
- **causal:** symmetric (constitutive — relates F and ΔL through material/geometric constant k)
- **vars:**
  - `\Delta L` — driver, m: deformation (extension or compression)
  - `k` — parameter, N/m: stiffness/spring constant (depends on material, shape, and load direction)
  - `F` — response, N: applied or restoring force
- **limits:**
  - Holds only in the linear (elastic) regime — typically ΔL/L < ~0.1%
  - Beyond elastic limit → permanent (plastic) deformation
  - Beyond ultimate strength → fracture
  - Bones: small linear region; brittle fracture
- **misconceptions:**
  - ❌ k is a property of the material alone → ✓ k depends on geometry too (length, cross-section); use Young's modulus for material-only properties
  - ❌ Springs always obey Hooke's law → ✓ Only within the linear elastic regime; over-stretching breaks linearity
- **prereqs:**
  - `newtons-third-law` (weight 0.6)
- **tags:** [elasticity, hookes-law, springs, linear-response]

---

### 6. Stress and Strain (Definitions)

- **id:** `stress-strain`
- **title:** Stress and Strain
- **formula:** `\text{stress} = \frac{F}{A},\quad \text{strain} = \frac{\Delta L}{L_0}`
- **principle:** Stress (force per unit area) and strain (fractional deformation) decouple Hooke's law into intensive quantities — material constants (elastic moduli) relate stress to strain independently of shape.
- **causal:** symmetric (definitional)
- **vars:**
  - `F` — driver, N: applied force
  - `A` — parameter, m²: cross-sectional area
  - `\Delta L` — driver, m: deformation
  - `L_0` — parameter, m: original length
  - `\text{stress}` — response, Pa (N/m²): force per unit area
  - `\text{strain}` — response, dimensionless: fractional deformation
- **limits:**
  - Strain is unitless → directly comparable across materials and scales
  - Elastic regime only; nonlinear above
- **misconceptions:**
  - ❌ Stress and strain are interchangeable terms → ✓ Stress is the *cause* (force/area), strain is the *effect* (relative deformation)
  - ❌ Strain has units of length → ✓ Strain is dimensionless (length/length)
- **prereqs:**
  - `hookes-law` (weight 0.85)
- **tags:** [elasticity, stress, strain, materials]

---

### 7. Young's Modulus (Tensile/Compressive Deformation)

- **id:** `youngs-modulus`
- **title:** Young's Modulus — Length Change Under Tension or Compression
- **formula:** `\Delta L = \frac{1}{Y}\,\frac{F}{A}\,L_0 \quad \Longleftrightarrow \quad Y = \frac{F/A}{\Delta L / L_0}`
- **principle:** When a rod is stretched or compressed along its length, the fractional length change is proportional to the applied stress; the constant of proportionality (Young's modulus) is a material property.
- **causal:** asymmetric (stress → strain, mediated by Y)
- **vars:**
  - `F` — driver, N: applied force along the length
  - `A` — parameter, m²: cross-sectional area
  - `L_0` — parameter, m: original length
  - `Y` — parameter, Pa (often GPa): Young's modulus (steel ~210 GPa, bone-tension ~16 GPa, nylon ~5 GPa)
  - `\Delta L` — response, m: change in length
- **limits:**
  - Elastic regime only (small strain ≪ 1%)
  - Liquids and gases have no Young's modulus (cannot resist a one-directional pull)
  - Bone has different Y for tension vs. compression — listed separately in tables
- **misconceptions:**
  - ❌ Larger Y means more stretchy → ✓ Larger Y means *stiffer*; deforms less for the same stress
  - ❌ Doubling cross-section halves ΔL → ✓ Yes (correct intuition: thicker = stiffer for same load)
- **prereqs:**
  - `hookes-law` (weight 0.85)
  - `stress-strain` (weight 0.95)
- **tags:** [elasticity, youngs-modulus, materials, tension, compression]

---

### 8. Shear Modulus (Sideways Deformation)

- **id:** `shear-modulus`
- **title:** Shear Modulus — Sideways Deformation
- **formula:** `\Delta x = \frac{1}{S}\,\frac{F}{A}\,L_0`
- **principle:** When a force is applied parallel to one face of an object (perpendicular to its length), the object distorts in shear; the sideways displacement scales with applied stress and original length, divided by the shear modulus.
- **causal:** asymmetric (shear stress → shear strain)
- **vars:**
  - `F` — driver, N: shear force (parallel to face)
  - `A` — parameter, m²: area of the face
  - `L_0` — parameter, m: thickness perpendicular to the shear
  - `S` — parameter, Pa: shear modulus (steel ~80 GPa; bone ~80 GPa — unusually rigid; concrete/brick: undefined for shear)
  - `\Delta x` — response, m: sideways displacement
- **limits:**
  - Liquids and gases: S ≈ 0 (they flow under any shear)
  - Most materials: S < Y (typically S ~ Y/3)
  - Bone is anomalous: S ≈ Y, which makes bone exceptionally rigid against shear
- **misconceptions:**
  - ❌ Shear and tension produce the same kind of deformation → ✓ Tension: force along length, ΔL parallel; shear: force perpendicular to length, Δx perpendicular
  - ❌ Concrete is good in shear because it's strong → ✓ Concrete is poor in shear; that's why steel-reinforced concrete and rebar exist
- **prereqs:**
  - `stress-strain` (weight 0.9)
  - `youngs-modulus` (weight 0.7)
- **tags:** [elasticity, shear-modulus, materials, structures]

---

### 9. Bulk Modulus (Volumetric Deformation)

- **id:** `bulk-modulus`
- **title:** Bulk Modulus — Volume Change Under Pressure
- **formula:** `\Delta V = \frac{1}{B}\,\frac{F}{A}\,V_0`
- **principle:** When a body is squeezed equally from all sides, its fractional volume change is proportional to the applied pressure, with the bulk modulus B as the proportionality constant.
- **causal:** asymmetric (uniform pressure → volume strain)
- **vars:**
  - `F/A` — driver, Pa: applied pressure (force per unit area on each surface)
  - `V_0` — parameter, m³: original volume
  - `B` — parameter, Pa: bulk modulus (water ~2.2 GPa, steel ~130 GPa, gases: small)
  - `\Delta V` — response, m³: change in volume (negative for compression)
- **limits:**
  - Defined for solids, liquids, and gases (only modulus that makes sense for fluids)
  - Gases: B is very small and pressure-dependent → use the gas laws
  - Incompressible limit: B → ∞ (a useful idealization for liquids in many problems)
- **misconceptions:**
  - ❌ Liquids are incompressible → ✓ Nearly so (B is large), but not exactly — pressure waves (sound) require finite B
  - ❌ Bulk modulus is the inverse of compressibility times some factor → ✓ It is exactly that: B = 1/κ where κ is the compressibility
- **prereqs:**
  - `stress-strain` (weight 0.9)
  - `youngs-modulus` (weight 0.6)
- **tags:** [elasticity, bulk-modulus, materials, pressure, fluids-precursor]

---

## Pedagogical Notes (for downstream LLM context)

- The static-friction inequality (f_s ≤ μ_s N) trips up students who memorize "f = μN." A simple block-on-incline problem with a slowly-tilted ramp is the canonical demo: f_s adjusts up to μ_s N, then slipping starts.
- Drag coefficients in Table 5.2 are a great "did you know" lecture aid — note that a horizontal skydiver has C ≈ 1.0 vs. C ≈ 0.05 for an airfoil. *Shape* matters more than size for drag at high speed.
- Terminal velocity is a perfect crossover problem: it requires force balance (Ch 4) and quadratic drag (Ch 5) simultaneously. Drives home that "no acceleration" ≠ "no forces."
- Hooke's law is the gateway drug to simple harmonic motion (Ch 16) — flag this connection now so students see the through-line.
- The three elastic moduli (Y, S, B) are pedagogically symmetric: same equation form, different geometry of the deformation. Teach them as a triplet, not three separate things.
- Bone's anomalous shear modulus (S ≈ Y, comparable to steel) is a great hook for biomechanics-curious pre-meds in PHY 114. Most materials have S ≈ Y/3.
- Concrete ↔ steel-reinforced concrete is a real-world Newton-meets-elasticity story worth telling: concrete is great in compression, terrible in tension and shear. Steel rebar handles the tension. Architects literally place rebar where the bending math says tension dominates.
