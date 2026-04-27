# Chapter 7 — Work, Energy, and Energy Resources

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 7.1 Work · 7.2 Kinetic Energy and the Work-Energy Theorem · 7.3 Gravitational Potential Energy · 7.4 Conservative Forces and PE · 7.5 Nonconservative Forces · 7.6 Conservation of Energy · 7.7 Power · 7.8 Work, Energy, and Power in Humans · 7.9 World Energy Use

**Domain:** mechanics
**Suggested shared metadata:**
```yaml
layer: concept
domain: mechanics
chapter: 7
idealizations:
  - {name: "Constant g over height changes", scope: "limiting-case"}
  - {name: "Point particle", scope: "idealized"}
  - {name: "Conservative forces only (in mech-energy conservation)", scope: "limiting-case"}
  - {name: "Inertial reference frame", scope: "limiting-case"}
```

---

## Chapter Overview

Energy is the most powerful unifying concept in physics. This chapter builds it up from a single definition (work) and arrives at the conservation law that holds in every domain of physics. **Work** is force × displacement (with a cosine for non-aligned vectors); the **work-energy theorem** says net work equals change in kinetic energy. **Potential energy** is the bookkeeping for stored work against conservative forces (gravity, springs). The grand prize is **conservation of energy**: in a closed system, mechanical + other forms = constant. Power closes the chapter — energy per unit time, the rate at which work is done.

---

## Concept Nodes

### 1. Work (Constant Force)

- **id:** `work-constant-force`
- **title:** Work Done by a Constant Force
- **formula:** `W = F d \cos\theta`
- **principle:** Work is the energy transferred to a system by a force acting through a displacement; it equals the component of force along the displacement times the magnitude of the displacement.
- **causal:** asymmetric (force acting through displacement → energy transfer)
- **vars:**
  - `F` — driver, N: magnitude of the applied force
  - `d` — driver, m: magnitude of the displacement
  - `\theta` — driver, rad or deg: angle between F and d
  - `W` — response, J (= N·m): work done on the system
- **limits:**
  - θ = 0 → W = Fd (force aligned with motion)
  - θ = 90° → W = 0 (force perpendicular to motion does no work — e.g., centripetal force, normal force on level ground)
  - θ = 180° → W = −Fd (force opposes motion — e.g., friction during sliding)
  - d = 0 → W = 0 (no displacement → no work, regardless of force magnitude — e.g., holding a heavy box still)
- **misconceptions:**
  - ❌ Holding a heavy load is doing work (because it's tiring) → ✓ Zero displacement → zero work in the physics sense; muscular fatigue is biological, not mechanical work on the load
  - ❌ Centripetal force does work on an orbiting body → ✓ Perpendicular to v → W = 0; speed (and KE) doesn't change
  - ❌ Work is always positive → ✓ Sign matters; negative work removes energy from the system
- **prereqs:**
  - `force-net-external` (weight 0.7)
  - `vector-decomposition` (weight 0.7)
- **tags:** [energy, work, foundational, mechanics]

---

### 2. Kinetic Energy

- **id:** `kinetic-energy`
- **title:** Translational Kinetic Energy
- **formula:** `KE = \tfrac{1}{2} m v^2`
- **principle:** A moving body carries kinetic energy equal to half its mass times the square of its speed; it is a scalar and always non-negative.
- **causal:** symmetric (definitional in terms of m and v)
- **vars:**
  - `m` — parameter, kg: mass
  - `v` — driver, m/s: speed (magnitude of velocity)
  - `KE` — response, J: kinetic energy
- **limits:**
  - v = 0 → KE = 0
  - Doubling v → KE quadruples (quadratic dependence — same scaling as drag)
  - Frame-dependent: KE depends on the reference frame in which v is measured
  - At v → c, classical KE diverges from relativistic value KE = (γ−1)mc²
- **misconceptions:**
  - ❌ KE depends on direction of motion → ✓ KE is a scalar; only |v|² matters
  - ❌ KE doubles when speed doubles → ✓ KE *quadruples* — this is why stopping distance scales as v² (Ch 2's timeless equation)
- **prereqs:**
  - `average-velocity` (weight 0.6)
  - `mass-inertia` (weight 0.7)
- **tags:** [energy, kinetic-energy, foundational, mechanics]

---

### 3. Work-Energy Theorem

- **id:** `work-energy-theorem`
- **title:** Work-Energy Theorem
- **formula:** `W_{net} = \Delta KE = \tfrac{1}{2} m v_f^2 - \tfrac{1}{2} m v_0^2`
- **principle:** The net work done on a body equals its change in kinetic energy — a direct consequence of Newton's second law applied along the path.
- **causal:** asymmetric (net work → change in kinetic energy)
- **vars:**
  - `W_{net}` — driver, J: net (sum of all) work done on the body
  - `m` — parameter, kg: mass
  - `v_0, v_f` — drivers, m/s: initial and final speeds
  - `\Delta KE` — response, J: change in kinetic energy
- **limits:**
  - Holds for any net force (constant or variable), any path
  - In rotational form: W_net = ΔKE_rot (Ch 10)
  - W_net > 0 → speed increases; W_net < 0 → speed decreases; W_net = 0 → speed unchanged
- **misconceptions:**
  - ❌ All forces contribute equal-magnitude work → ✓ Only the *net* work matters; perpendicular forces drop out
  - ❌ Work and KE are different units → ✓ Both joules; this is what makes the theorem sensible
- **prereqs:**
  - `work-constant-force` (weight 0.95)
  - `kinetic-energy` (weight 0.95)
  - `newtons-second-law` (weight 0.85)
- **tags:** [energy, work-energy-theorem, foundational, mechanics]

---

### 4. Gravitational Potential Energy (Near Earth)

- **id:** `gravitational-pe-local`
- **title:** Gravitational Potential Energy (Uniform g)
- **formula:** `\Delta PE_g = m g h`
- **principle:** Lifting a mass m a height h against gravity stores energy mgh in the mass-Earth system; this stored energy can be recovered as kinetic energy when the mass falls.
- **causal:** asymmetric (work against gravity → stored PE)
- **vars:**
  - `m` — parameter, kg: mass
  - `g` — parameter, m/s²: gravitational acceleration (≈ 9.80)
  - `h` — driver, m: change in height (positive = lifted)
  - `\Delta PE_g` — response, J: change in gravitational potential energy
- **limits:**
  - Valid only for h ≪ R_Earth (constant g approximation); otherwise use −GMm/r
  - Path-independent: depends only on Δh, not on the path traversed
  - Reference height (PE = 0) is arbitrary; only ΔPE has physical meaning
  - Strictly speaking, PE belongs to the *system* (object + Earth), not the object alone
- **misconceptions:**
  - ❌ PE belongs to the object → ✓ It's a property of the object-Earth system (the gravitational interaction)
  - ❌ The reference level matters absolutely → ✓ Only differences in PE are physical; choose any zero
- **prereqs:**
  - `work-constant-force` (weight 0.85)
  - `weight-gravitational-force` (weight 0.95)
- **tags:** [energy, potential-energy, gravity, mechanics]

---

### 5. Conservative vs. Nonconservative Forces

- **id:** `conservative-vs-nonconservative`
- **title:** Conservative and Nonconservative Forces
- **principle:** A force is conservative if the work it does between two points is independent of the path taken (equivalently, if the work around any closed loop is zero); nonconservative forces (friction, drag, applied pushes) generally have path-dependent work.
- **causal:** symmetric (taxonomy/property)
- **vars:**
  - Force type: conservative (gravity, springs, electrostatic) vs. nonconservative (friction, drag, applied force)
  - Work along path: path-independent (conservative) vs. path-dependent (nonconservative)
  - Existence of associated PE: yes (conservative) vs. no (nonconservative)
- **limits:**
  - Only conservative forces have an associated potential energy
  - Friction always does negative work on the moving body (and dissipates to heat)
  - Many "nonconservative" forces (e.g., applied push) are conservative at the microscopic level — they're just classified by the system boundary you draw
- **misconceptions:**
  - ❌ Nonconservative means energy is destroyed → ✓ Energy is *transferred* to forms not tracked in mechanical energy (heat, sound, deformation)
  - ❌ Conservative forces store energy somewhere visible → ✓ The energy is in the *configuration* of the system (height, spring compression)
- **prereqs:**
  - `work-constant-force` (weight 0.85)
  - `gravitational-pe-local` (weight 0.7)
- **tags:** [energy, conservative-forces, taxonomy, mechanics]

---

### 6. Conservation of Mechanical Energy

- **id:** `conservation-mechanical-energy`
- **title:** Conservation of Mechanical Energy (Conservative Forces Only)
- **formula:** `KE_0 + PE_0 = KE_f + PE_f`
- **principle:** When only conservative forces act on a system, the sum of kinetic and potential energies (the mechanical energy) is constant throughout the motion.
- **causal:** asymmetric (constraint: no nonconservative work → ME conserved)
- **vars:**
  - `KE_0, KE_f` — drivers, J: initial and final kinetic energies
  - `PE_0, PE_f` — drivers, J: initial and final potential energies
  - System: must be isolated from nonconservative forces
- **limits:**
  - Friction or drag present → mechanical energy decreases over time (use full conservation of total energy instead)
  - Allows trading PE ↔ KE without tracking forces explicitly — *huge* simplification for problems
  - Pendulum, roller coaster (frictionless), springs, projectile (no air): all canonical applications
- **misconceptions:**
  - ❌ Mechanical energy is always conserved → ✓ Only when no nonconservative forces do work
  - ❌ Conservation gives you everything you need → ✓ It's a scalar equation; can't determine direction or path, only energy magnitudes
- **prereqs:**
  - `work-energy-theorem` (weight 0.9)
  - `gravitational-pe-local` (weight 0.85)
  - `conservative-vs-nonconservative` (weight 0.95)
- **tags:** [energy, conservation, mechanical-energy, foundational]

---

### 7. Conservation of Total Energy

- **id:** `conservation-total-energy`
- **title:** Conservation of Total Energy
- **formula:** `KE_0 + PE_0 + W_{nc} + OE_0 = KE_f + PE_f + OE_f`
- **principle:** Total energy is constant in any closed system: mechanical energy plus work done by nonconservative forces plus all other forms (thermal, chemical, electrical, nuclear, radiant) sums to a constant.
- **causal:** asymmetric (foundational law of nature; underlies thermodynamics)
- **vars:**
  - `KE, PE` — drivers, J: kinetic and potential energy
  - `W_{nc}` — driver, J: work done by nonconservative forces (negative for friction → goes to heat)
  - `OE` — driver, J: "other energies" (thermal, chemical, etc.)
- **limits:**
  - Closed-system requirement: no energy crosses the system boundary
  - At relativistic energies, mass itself is a form of energy: E = mc²
  - At quantum scales, energy is conserved on average; transient violations allowed by ΔE Δt ≥ ℏ/2 (uncertainty)
- **misconceptions:**
  - ❌ Friction destroys energy → ✓ Friction *converts* mechanical energy to thermal energy; the total is preserved
  - ❌ Engines "create" energy from fuel → ✓ They convert chemical energy to mechanical and thermal; conversion efficiency < 100%
  - ❌ Conservation is a result of derivation → ✓ It's an empirical law tied (by Noether's theorem) to time-translation symmetry
- **prereqs:**
  - `conservation-mechanical-energy` (weight 0.85)
  - `conservative-vs-nonconservative` (weight 0.85)
- **tags:** [energy, conservation, foundational, thermodynamics-precursor]

---

### 8. Power

- **id:** `power-rate-of-work`
- **title:** Power as the Rate of Doing Work
- **formula:** `P = \frac{W}{t} = \frac{\Delta E}{\Delta t},\quad P_{\text{inst}} = \vec{F}\cdot\vec{v}`
- **principle:** Power is the rate at which energy is transferred or work is done; for a force acting on a body, instantaneous power equals the dot product of force and velocity.
- **causal:** symmetric (definitional)
- **vars:**
  - `W` or `\Delta E` — driver, J: work done or energy transferred
  - `t` — driver, s: elapsed time
  - `\vec{F}, \vec{v}` — drivers: force and velocity (instantaneous form)
  - `P` — response, W (= J/s): power
- **limits:**
  - Same energy delivered faster → more power
  - Useful units: 1 hp ≈ 746 W
  - Sustained human output: ~75 W (0.1 hp); peak short-duration: ~750 W (1 hp)
  - 60 W incandescent bulb: ~5 W of light + 55 W heat → efficiency ~8%
- **misconceptions:**
  - ❌ Power and energy are the same → ✓ Power is the *rate* of energy transfer (J vs. J/s)
  - ❌ "Powerful" means "high energy" → ✓ It means "high rate of energy delivery"; a small battery can store lots of energy but deliver little power, or vice versa
- **prereqs:**
  - `work-constant-force` (weight 0.95)
  - `kinetic-energy` (weight 0.6)
- **tags:** [energy, power, rate, mechanics]

---

### 9. Efficiency

- **id:** `efficiency-energy-conversion`
- **title:** Efficiency of an Energy Conversion
- **formula:** `\eta = \frac{E_{\text{useful out}}}{E_{\text{in}}}`
- **principle:** Efficiency is the fraction of input energy that emerges as useful output; the rest appears in unwanted forms (typically heat) but the total is still conserved.
- **causal:** symmetric (definitional ratio)
- **vars:**
  - `E_{\text{in}}` — driver, J: energy input
  - `E_{\text{useful out}}` — driver, J: useful energy output
  - `\eta` — response, dimensionless (often %): efficiency
- **limits:**
  - Always 0 ≤ η ≤ 1
  - Heat engines bound by Carnot limit (Ch 15) — η_max = 1 − T_cold/T_hot
  - Typical fossil-fuel power plant: η ~ 35–40%
  - Incandescent bulb: ~8% (visible light); LED: 50–80%
  - Human metabolism doing physical work: ~25%
- **misconceptions:**
  - ❌ Low efficiency means energy is destroyed → ✓ It just appears in unwanted forms (usually heat); the conservation books always balance
  - ❌ Efficiency can exceed 100% → ✓ Never; would violate conservation of energy (heat pumps' "COP > 1" is not efficiency — they move energy rather than converting it)
- **prereqs:**
  - `conservation-total-energy` (weight 0.85)
  - `power-rate-of-work` (weight 0.6)
- **tags:** [energy, efficiency, conversion, applied]

---

## Pedagogical Notes (for downstream LLM context)

- The conceptual unlock of this chapter: **switching from F = ma to energy methods turns hard problems into one-line algebra**. A roller-coaster speed problem that's a nightmare with kinematics becomes "mgh = ½mv²" with energy. Drill this until students reach for energy methods first.
- The "holding a briefcase" example (Fig 7.2b) is the canonical place to break the everyday meaning of "work." Spend the time — students who skip this never grok why centripetal forces don't do work.
- KE ∝ v² is the single most important scaling result of intro physics. Tie it to: (a) stopping distance (Ch 2), (b) drag (Ch 5), (c) collision damage (Ch 8), (d) why highway speed limits matter so much.
- Conservative/nonconservative isn't a deep ontological category — it's a bookkeeping choice that depends on system boundary. Friction is "nonconservative" because we don't track the microscopic kinetic energy of molecular vibrations as PE. Worth saying out loud.
- The "Force to Stop Falling" example (Ex 7.6) — a person dropping 3 m and decelerating in 0.5 cm — is an *outstanding* hook for biomechanics. Compare the force on knee joints to body weight; the multiplier is sobering. Pre-meds in PHY 114 will eat this up.
- Power → think rate, not amount. The horsepower-up-the-stairs example puts human output in the right order of magnitude (~750 W peak). Tie to: car engines (60–300 hp), bicycles (~150 W steady), Tour de France climbers (~400 W for hours).
- Efficiency lays the groundwork for Carnot in Ch 15. Plant the seed that there's a *fundamental* (not engineering) limit to η for heat engines, and students will be primed when entropy shows up.
- For PHY 132: variable-force work via integration (W = ∫F·dx) makes spring PE = ½kx² a natural calculation. For PHY 114: state it as a result and have students verify via the area under F vs. x.
