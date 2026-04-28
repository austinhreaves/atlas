# Chapter 14 — Heat and Heat Transfer Methods

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 14.1 Heat · 14.2 Temperature Change and Heat Capacity · 14.3 Phase Change and Latent Heat · 14.4 Heat Transfer Methods · 14.5 Conduction · 14.6 Convection · 14.7 Radiation

**Domain:** thermodynamics
**Suggested shared metadata:**
```yaml
layer: concept
domain: thermodynamics
chapter: 14
idealizations:
  - {name: "Heat transfer ceases at thermal equilibrium", scope: "limiting-case"}
  - {name: "No heat loss to surroundings (calorimetry)", scope: "idealized — bookkeeping convention"}
  - {name: "Constant specific heat (small ΔT)", scope: "idealized"}
  - {name: "Phase change at fixed T,P (sharp transition)", scope: "idealized"}
  - {name: "Steady-state heat flow (Fourier conduction)", scope: "limiting-case"}
  - {name: "Black-body / gray-body radiation (Stefan-Boltzmann)", scope: "idealized — emissivity ε constant"}
```

---

## Chapter Overview

Where Ch 13 told us *what temperature is*, this chapter tells us *what heat does*. Heat is **energy in transit driven by a temperature difference** — distinct from temperature itself, which is a state variable. Two structural patterns recur. (1) **Energy bookkeeping:** Q = mcΔT for temperature change without phase change; Q = mL for phase changes (L_f for fusion, L_v for vaporization); calorimetry is the conservation statement Q_lost = Q_gained when the system is isolated. The mechanical equivalent of heat (4186 J/kcal) — Joule's great result — closes the loop with mechanics and the energy concept. (2) **Three transport mechanisms:** conduction (molecular collisions in stationary matter, Q/t = kAΔT/d), convection (bulk fluid motion, often natural via buoyancy), and radiation (electromagnetic waves needing no medium, P = εσAT⁴ via Stefan-Boltzmann's *fourth-power* law). The chapter closes with applications central to PHY 114 pre-meds (sweating, body thermoregulation, blood circulation as forced convection) and PHY 132 engineers (R-value insulation, heat-engine prerequisites). The physics is conceptually simple but the bookkeeping is where students stumble.

---

## Concept Nodes

### 1. Heat as Energy in Transit

- **id:** `heat-energy-transit`
- **title:** Heat
- **principle:** Heat is the spontaneous transfer of energy between two systems caused by a temperature difference; it has units of joules (or calories) and stops flowing when the systems reach thermal equilibrium. Crucially, "heat" is energy *in transit*, not a quantity stored in a body — a system has internal energy, not heat content.
- **causal:** asymmetric (temperature difference → energy flow until equilibrium)
- **vars:**
  - `Q` — driver/response, J: heat transferred (positive = into system, negative = out)
  - `\Delta T` — driver, K: temperature difference (driving "force")
  - thermal equilibrium — endpoint condition, ΔT = 0
  - mechanical equivalent: 1 cal = 4.186 J ; 1 kcal = 4186 J = 1 food Calorie
- **limits:**
  - Spontaneous direction: hot → cold (precursor to 2nd law in Ch 15)
  - Heat and work both transfer energy; once inside a system you can't tell which way it came in
  - SI unit J; common units cal, kcal (food Calorie = kcal), Btu (= 1.055 kJ)
  - Joule's paddle-wheel experiment: gravitational PE → mechanical work → temperature rise → 1 cal ≡ 4.186 J
  - At the molecular level, heat transfer = redistribution of microscopic kinetic energy
- **misconceptions:**
  - ❌ Hot objects "contain heat" → ✓ They contain *internal energy*; heat is what crosses the boundary
  - ❌ Heat and temperature are the same → ✓ Temperature is a state; heat is a transfer mechanism (and energy has units of J, not K)
  - ❌ A "heat content" is well-defined → ✓ Q depends on path (state variable U exists, but Q does not, by 1st law in Ch 15)
- **prereqs:**
  - `temperature` (weight 0.95)
  - `temperature-kinetic-energy` (weight 0.85)
  - `internal-energy` (weight 0.7)
- **tags:** [thermodynamics, heat, energy-transit, foundational]

---

### 2. Specific Heat and Heat Capacity

- **id:** `specific-heat`
- **title:** Specific Heat and Heat Capacity
- **formula:** `Q = m c \Delta T`
- **principle:** When heat is added to (or removed from) a sample of mass m without phase change, the temperature changes in proportion to the heat, the mass, and the inverse of a substance-specific quantity called the specific heat c. The constant of proportionality c (units J/(kg·K)) is the heat needed per kilogram per degree.
- **causal:** asymmetric (heat input + mass + material → temperature change)
- **vars:**
  - `Q` — driver, J: heat transferred
  - `m` — parameter, kg: mass
  - `c` — parameter, J/(kg·K): specific heat (material property)
  - `\Delta T` — response, K (or °C): temperature change
- **limits:**
  - Water: c = 4186 J/(kg·K) — anomalously high (5× glass, 10× iron)
  - Aluminum c ≈ 900; iron ≈ 450; copper ≈ 390; lead ≈ 130; gold ≈ 130
  - For gases, distinguish c_V (constant volume) and c_P (constant pressure); c_P > c_V because some heat goes into expansion work (Ch 15)
  - Gas c values often quoted in J/(mol·K) — divide by molar mass to compare
  - c depends weakly on T and P for solids/liquids (constant approximation good); strongly for gases near phase changes
  - Calorimetry: Σ Q_i = 0 when system is isolated → m₁c₁(T_f - T_1) + m₂c₂(T_f - T_2) = 0 → solve for T_f
- **misconceptions:**
  - ❌ Water's high c just means it gets hot slowly → ✓ It also *cools* slowly — the mechanism is the same; this is why coastal climates are mild and why oceans buffer the atmosphere
  - ❌ Specific heat depends on amount → ✓ It's intensive; *heat capacity* C = mc is extensive
  - ❌ Doubling temperature change doubles ΔT-relevant heat → ✓ Yes, but only if c is constant (which it usually is over moderate ranges)
- **prereqs:**
  - `heat-energy-transit` (weight 0.95)
  - `temperature` (weight 0.85)
  - `mass-inertia` (weight 0.7)
- **tags:** [thermodynamics, specific-heat, heat-capacity, calorimetry, foundational]

---

### 3. Latent Heat (Phase Change)

- **id:** `latent-heat`
- **title:** Latent Heat of Fusion and Vaporization
- **formula:** `Q = m L_f \quad \text{(melting/freezing)} \quad ; \quad Q = m L_v \quad \text{(boiling/condensation)}`
- **principle:** During a phase change at constant pressure, heat is absorbed or released at constant temperature — the energy goes into rearranging molecular bonds, not raising kinetic energy. The latent heats L_f and L_v are the energy per kilogram needed to fuse (melt) or vaporize the substance. Phase changes carry far more energy than equivalent temperature changes.
- **causal:** asymmetric (heat input at phase boundary → mass converted between phases at constant T)
- **vars:**
  - `Q` — driver, J: heat absorbed (released if Q < 0)
  - `m` — driver, kg: mass that changes phase
  - `L_f` — parameter, J/kg: latent heat of fusion (water: 334 kJ/kg)
  - `L_v` — parameter, J/kg: latent heat of vaporization (water: 2256 kJ/kg at 100°C; 2430 kJ/kg at 37°C)
- **limits:**
  - Water L_v / L_f ≈ 6.7 — vaporization breaks far more bonds than fusion
  - Melting 1 kg of ice = energy to heat 1 kg of liquid water from 0°C to 80°C
  - Vaporizing 1 kg of water = energy to heat 1 kg of water from 0°C to 540°C (if water didn't boil)
  - Sublimation latent heat L_s ≈ L_f + L_v (solid → vapor directly)
  - L depends on T,P: water at body T (37°C) has L_v ≈ 2430 kJ/kg (vs. 2256 at 100°C); evaporation cools more efficiently than boiling
  - Phase change happens at sharply defined T (at given P) — no temperature change while phase change is incomplete
- **misconceptions:**
  - ❌ Adding heat always raises temperature → ✓ During phase change, T stays constant — energy goes to bond breaking
  - ❌ Boiling and evaporation involve the same latent heat → ✓ Same L_v in principle; but evaporation at body T is at slightly higher L (~2430 kJ/kg) because lower-energy molecules have to be supplied with more energy to escape
  - ❌ Ice melts when its temperature reaches 0°C → ✓ It reaches 0°C and *then* needs another 334 kJ/kg before any melts; the temperature stays at 0°C through the entire melt
- **prereqs:**
  - `heat-energy-transit` (weight 0.95)
  - `phase-diagrams` (weight 0.85)
  - `specific-heat` (weight 0.85)
- **tags:** [thermodynamics, phase-change, latent-heat, foundational, biomedical]

---

### 4. Calorimetry (Energy Bookkeeping)

- **id:** `calorimetry`
- **title:** Calorimetry — Conservation of Heat
- **formula:** `\sum_i Q_i = 0 \quad \text{(insulated system)}`
- **principle:** When two or more bodies exchange heat in an insulated container, the heat lost by hot bodies equals the heat gained by cold bodies — a direct application of energy conservation. The technique mixes Q = mcΔT and Q = mL terms to find unknown final temperatures, masses, or specific heats.
- **causal:** asymmetric (energy conservation constraint → solve for unknown thermal variable)
- **vars:**
  - `Q_i` — heat into body i (sign-aware: + if absorbed, − if released)
  - bodies typically include source, container ("calorimeter"), and unknown sample
  - phase-change terms add when crossing a melting/boiling boundary
- **limits:**
  - Idealization: zero heat loss to environment (Dewar flasks approximate this)
  - Final temperature T_f must respect all phase boundaries; if T_f calculated naively crosses a phase change, redo in stages
  - Convention: write Q for each body, set Σ Q = 0; let signs handle directions
  - Heat capacity of calorimeter itself often non-negligible (water-equivalent of cup, stirrer, thermometer)
- **misconceptions:**
  - ❌ Cold water "absorbs heat" → ✓ Cold water *receives* heat from hotter neighbors; sign convention matters
  - ❌ Mix of ice and water always equilibrates above 0°C → ✓ Only if there's enough heat to melt all the ice; otherwise some remains and T_f = 0°C
- **prereqs:**
  - `specific-heat` (weight 0.95)
  - `latent-heat` (weight 0.95)
  - `conservation-of-energy` (weight 0.85)
- **tags:** [thermodynamics, calorimetry, conservation, problem-solving, foundational]

---

### 5. Three Modes of Heat Transfer

- **id:** `heat-transfer-modes`
- **title:** Three Modes of Heat Transfer
- **principle:** Heat transfers between systems by exactly three mechanisms: **conduction** (molecular momentum/energy hopping through a stationary medium), **convection** (bulk flow of a fluid carrying energy with it), and **radiation** (electromagnetic waves carrying energy with no medium needed). Real situations almost always involve combinations.
- **causal:** symmetric (categorical / classification)
- **vars:**
  - mechanism — qualitative selector
  - medium required: conduction needs matter; convection needs fluid; radiation needs nothing
  - typical timescale per OOM: radiation (light-fast for emission, but slow per Stefan-Boltzmann at room T); convection (seconds–minutes for room mixing); conduction (slow over macroscopic distances)
- **limits:**
  - Radiation is the only mechanism that operates across vacuum (Sun → Earth)
  - Convection requires a fluid that can flow (so doesn't apply within solid metal blocks)
  - Conduction operates everywhere matter touches matter, but is dominant only over short distances or in good conductors
  - In a fireplace: radiation dominates the felt warmth; convection moves smoke up the chimney; conduction is negligible
  - In the human body: blood flow is forced convection — overwhelming the much-slower conduction through tissue
- **misconceptions:**
  - ❌ Heat "rises" → ✓ *Hot fluid* rises (less dense); the heat isn't intrinsically directional. Radiation and conduction are isotropic
  - ❌ A vacuum stops heat → ✓ Stops conduction and convection; radiation goes right through (this is why thermos flasks have *both* vacuum gap *and* silvered walls)
- **prereqs:**
  - `heat-energy-transit` (weight 0.95)
- **tags:** [thermodynamics, heat-transfer, classification, foundational]

---

### 6. Conduction (Fourier's Law)

- **id:** `conduction`
- **title:** Conduction
- **formula:** `\frac{Q}{t} = \frac{k A \,\Delta T}{d}`
- **principle:** In a stationary material, heat flows from high to low temperature at a rate proportional to the temperature gradient (ΔT/d), the cross-sectional area, and a material-specific thermal conductivity k. Good electrical conductors (free-electron metals) are usually good thermal conductors; gases and porous insulators are poor conductors.
- **causal:** asymmetric (temperature gradient + geometry + conductivity → heat flow rate)
- **vars:**
  - `k` — parameter, W/(m·K): thermal conductivity (silver 420; copper 390; iron 80; glass 0.8; water 0.6; air 0.023; styrofoam 0.01)
  - `A` — parameter, m²: cross-sectional area
  - `\Delta T` — driver, K: temperature difference across thickness
  - `d` — parameter, m: thickness
  - `Q/t` — response, W: rate of heat flow
- **limits:**
  - Steady state required (T(x) doesn't change with time at any point)
  - Linear T-profile only for uniform k; otherwise solve heat equation
  - R-value (US insulation rating) = d/k, but reported in non-SI ft²·°F·h/Btu
  - Air has low k → fur, fiberglass, down feathers, double-pane windows all trap stagnant air
  - Why metal feels colder than wood at same T: higher k → faster heat flow from skin → faster local cooling
  - Why conduction is ineffective over long distances: rate ∝ 1/d for fixed ΔT; tropical heat doesn't reach poles by conduction
- **misconceptions:**
  - ❌ Tile is colder than carpet → ✓ Same T (both are at room T); tile conducts heat away from your foot faster
  - ❌ Insulators "block" heat → ✓ They slow it down; given enough time, conduction still equilibrates
  - ❌ Doubling thickness halves heat flow → ✓ Yes (1/d scaling); doubling area doubles flow
- **prereqs:**
  - `temperature` (weight 0.85)
  - `heat-energy-transit` (weight 0.95)
- **tags:** [thermodynamics, conduction, fourier-law, foundational]

---

### 7. Convection

- **id:** `convection`
- **title:** Convection (Natural and Forced)
- **principle:** Convection transfers heat by the bulk movement of fluid: hot fluid carries thermal energy from one region to another while cooler fluid takes its place. Natural convection is driven by buoyancy (warmer fluid is less dense, so it rises); forced convection uses a pump or fan to drive the flow.
- **causal:** asymmetric (temperature-induced density gradient + gravity → flow → heat transport)
- **vars:**
  - flow rate (kg/s) — driver
  - temperature difference between fluid and surface — driver
  - geometry, surface roughness — parameters
  - convective heat transfer coefficient `h` — parameter, W/(m²·K): empirical, typically 5–25 (natural air), 10–500 (forced air), up to thousands (boiling)
- **limits:**
  - Natural convection requires gravity (or pseudo-gravity in centrifuges) — minimal in microgravity
  - Speeds heat transfer dramatically over conduction alone (wind-chill: 15 m/s air at 0°C feels like still air at -23°C)
  - Convection driven by phase change can carry enormous energies (thunderstorms, hurricanes, sweating)
  - In the human body: blood flow is forced convection; cutaneous vasodilation in the heat dramatically increases skin-surface convection
  - Heat exchangers, radiators, heat pumps, weather systems, ocean currents — all rely on engineered or natural convection
- **misconceptions:**
  - ❌ Hot air "wants to rise" → ✓ Buoyant force on hot air > weight, because hot air is less dense; cool air sinks for the same reason
  - ❌ Convection carries heat in any direction equally → ✓ Natural convection is gravity-aligned; forced convection follows the imposed flow
  - ❌ A fan cools you by lowering air temperature → ✓ It just moves air; the air temperature isn't lower, but evaporative cooling and replacement of hot air near skin with cooler ambient air increase your heat loss
- **prereqs:**
  - `archimedes-principle` (weight 0.85)
  - `density` (weight 0.85)
  - `flow-rate` (weight 0.7)
- **tags:** [thermodynamics, convection, fluid-flow, biomedical, foundational]

---

### 8. Radiation (Stefan-Boltzmann Law)

- **id:** `stefan-boltzmann-law`
- **title:** Thermal Radiation (Stefan-Boltzmann Law)
- **formula:** `\frac{Q}{t} = \sigma\,\varepsilon A\, T^4 \quad ; \quad \frac{Q_{net}}{t} = \sigma\,\varepsilon A (T^4 - T_s^4)`
- **principle:** Every body emits electromagnetic radiation due to the thermal motion of its charges; the emitted power scales as the **fourth power of absolute temperature**, the surface area, and a dimensionless emissivity ε. The net rate of heat exchange with the surroundings is the difference between emitted and absorbed power.
- **causal:** asymmetric (temperature + emissivity + area → radiated power)
- **vars:**
  - `\sigma = 5.67\times10^{-8}` — constant, W/(m²·K⁴): Stefan-Boltzmann constant
  - `\varepsilon` — parameter, dimensionless 0–1: emissivity (1 = ideal black body; 0 = perfect reflector)
  - `A` — parameter, m²: emitting surface area
  - `T` — driver, K: absolute temperature of the body (must be in K!)
  - `T_s` — driver, K: temperature of surroundings
  - `Q/t` — response, W: radiated (or net) power
- **limits:**
  - The fourth-power dependence is dramatic: T doubling → 16× the radiated power
  - Black body (ε = 1) is the maximum emitter; real surfaces have ε < 1
  - "Good absorbers are good emitters" (Kirchhoff): black surface ε ≈ 1 for emission; same surface absorbs nearly all radiation that hits it
  - Skin: ε ≈ 0.97 in IR — humans are nearly black bodies at body T regardless of skin pigment (relevant to thermal imaging and night-vision)
  - Hot tungsten filament: visible light emission — Wien's displacement law λ_max ∝ 1/T; redshifts of cooler stars, blueshifts of hotter ones
  - Greenhouse effect: atmosphere transparent to incoming visible (Sun's λ_max ≈ 500 nm) but opaque to outgoing IR (Earth's λ_max ≈ 10 μm) — energy in, energy trapped
  - At room T, P_rad per square meter for ε ≈ 1 ≈ 460 W/m² — humans radiate ~100 W into a room and absorb ~80 W back, netting ~20 W out
- **misconceptions:**
  - ❌ Only hot objects radiate → ✓ Every object above 0 K radiates; at room T it's mostly IR
  - ❌ Doubling temperature doubles the radiation → ✓ Doubling T (in K!) increases radiation by 2⁴ = 16×
  - ❌ A bright shiny surface is a good radiator → ✓ Opposite — it's a poor emitter (low ε); a sooty matte black surface is a great emitter
  - ❌ Vacuum prevents thermal radiation → ✓ Vacuum is no barrier; that's how the Sun heats Earth
- **prereqs:**
  - `temperature` (weight 0.95)
  - `electromagnetic-spectrum` (weight 0.7)
- **tags:** [thermodynamics, radiation, stefan-boltzmann, fourth-power, blackbody, foundational]

---

### 9. Greenhouse Effect

- **id:** `greenhouse-effect`
- **title:** The Greenhouse Effect
- **principle:** Earth's atmosphere is largely transparent to incoming visible solar radiation but opaque to outgoing thermal infrared, because greenhouse gases (CO₂, H₂O, CH₄, N₂O) absorb IR strongly. The trapped IR is re-radiated in all directions, including back to the surface, raising Earth's mean surface temperature ~33 K above what it would be with no atmosphere.
- **causal:** asymmetric (wavelength-selective absorption + re-emission → energy retention → equilibrium temperature increase)
- **vars:**
  - solar input: ~340 W/m² (averaged over surface)
  - Earth's effective emissivity in IR: ~0.65 (cloud-cover dependent)
  - greenhouse gas concentration — driver: more GHG → more IR absorption → higher T_eq
  - mean surface T without atmosphere: ~255 K (= -18°C); with: ~288 K (= 15°C)
- **limits:**
  - First predicted by Eunice Newton Foote (1856) and Svante Arrhenius (1896)
  - Negative feedback: warmer T → more cloud cover → more reflection (partial offset)
  - Positive feedbacks: warmer ocean → more H₂O vapor (a strong GHG) → more warming; ice melt → lower albedo → more absorption
  - The effect itself is necessary for life as we know it; the *anthropogenic enhancement* (rising CO₂ from fossil fuels) is what drives current climate change
  - Venus runaway example: ~96% CO₂ atmosphere, surface T ~735 K — what an extreme greenhouse looks like
- **misconceptions:**
  - ❌ The greenhouse effect is bad / artificial → ✓ It is essential and natural; the *enhancement* from human emissions is what's destabilizing
  - ❌ CO₂ is a small fraction of the atmosphere so can't matter → ✓ A trace gas with strong IR absorption can dominate the radiative balance; ppm-level changes in CO₂ produce W/m² scale forcings
- **prereqs:**
  - `stefan-boltzmann-law` (weight 0.95)
  - `electromagnetic-spectrum` (weight 0.7)
- **tags:** [thermodynamics, radiation, climate, greenhouse, applications, biology]

---

### 10. Thermoregulation in the Body

- **id:** `body-thermoregulation`
- **title:** Body Thermoregulation
- **principle:** Maintaining a body temperature near 37 °C requires balancing internal heat production (~100 W at rest, > 1000 W during exercise) against losses by all three transfer mechanisms: conduction (small, except via direct contact), convection (clothing-modulated, blood-flow-driven internally), radiation (~50% of resting losses), and **evaporative cooling** (sweat, respiration). At rest, all four contribute; under heat stress, evaporation dominates because L_v at body T is 2430 kJ/kg.
- **causal:** asymmetric (metabolic heat input + environment → thermoregulatory mechanisms → setpoint maintenance)
- **vars:**
  - basal metabolic rate ~100 W at rest (mostly converted to heat)
  - radiation loss rate: ~100 W in cool room (ε ≈ 0.97 in IR)
  - sweat L_v ≈ 2430 kJ/kg → ~3 g/min sweat removes ~120 W
  - cutaneous blood flow — driver: 250 mL/min (cool) to 6 L/min (heat stress)
- **limits:**
  - Body surface ~1.5–2 m²; ε(skin) ≈ 0.97 across all visible skin tones (relevant for IR thermography)
  - High humidity prevents sweat evaporation — heat-stroke risk near body T even without sun
  - Wind-chill is convective: still-air at -10°C and 15 m/s wind at -10°C represent very different thermal stresses
  - Hypothalamus is the temperature setpoint controller (a feedback loop) — fevers reset the setpoint, not the comparator
  - Newborns and elderly have impaired thermoregulation (smaller surface-to-volume; less subcutaneous fat; weakened sweating)
- **misconceptions:**
  - ❌ "It's not the heat, it's the humidity" is folk wisdom → ✓ It's literal physics: high humidity inhibits L_v cooling
  - ❌ Sweat itself cools you → ✓ Sweat *evaporating* cools you (Q = mL_v); dripping sweat does almost nothing
  - ❌ Cold weather kills only by hypothermia → ✓ Forced convection (wind) and evaporative loss from lungs both drain heat aggressively
- **prereqs:**
  - `latent-heat` (weight 0.95)
  - `convection` (weight 0.85)
  - `stefan-boltzmann-law` (weight 0.85)
  - `specific-heat` (weight 0.85)
- **tags:** [thermodynamics, biomedical, thermoregulation, premed, applications]

---

## Pedagogical Notes (for downstream LLM context)

- **The conceptual key** for this chapter is keeping heat and temperature distinct. Most student errors come from collapsing the two. Phrase it as: temperature is "where the energy is" (a state); heat is "the energy moving" (a transit). Internal energy is what increases when you add heat (or do work on it) — but you can't measure "the heat in" a body.
- **The four go-to formulas** to memorize: (1) Q = mcΔT (sensible heat), (2) Q = mL (latent heat), (3) Q/t = kA(ΔT)/d (conduction), (4) P = εσAT⁴ (radiation). Convection has no clean intro-level formula because the heat transfer coefficient h is empirical — instead, frame it as "fluid carries away mc·ΔT per unit time at flow rate ṁ".
- **Water's anomalously high specific heat** is a load-bearing fact in this chapter. Make it explicit: c_water = 4186 J/(kg·K); c_aluminum = 900; c_iron = 450. Three implications: ocean climate buffering, body thermoregulation (we're 60% water), and why calorimetry uses water as the working fluid.
- **The fourth-power dependence in Stefan-Boltzmann** is the second "wow" of this chapter. A small T change causes a big ΔP change. Pair it with an OOM example: a 100°C change at 300 K base → P scales by (400/300)⁴ ≈ 3.2×. This is also why hot stars are blue (Wien's law) and the cosmic microwave background sits at 2.7 K (relic of Big Bang radiation).
- **For PHY 132 (engineers):** lean on R-values, double-pane windows, heat exchangers, and the prelude to heat engines (Ch 15). The R-value problem is good algebra practice — given an R-value, find the heat loss rate, then the heating bill. Real-world numbers feel motivating.
- **For PHY 114 (pre-meds):** body thermoregulation is the workhorse application. Worked example: at rest, ~100 W metabolic heat. Sweat at 3 g/min × 2430 kJ/kg = 121 W → enough to balance metabolic heat alone, even before convection and radiation. During hard exercise, sweat rate hits ~30 g/min → 1200 W of evaporative cooling capacity. Tie this to dehydration risk and electrolyte loss.
- **The thermos bottle (Dewar flask)** is the perfect concept-question demo for Ch 14: vacuum stops conduction and convection; silvered walls minimize radiation (low ε). A thermos defeats *all three* mechanisms — the only way to keep coffee hot for 8 hours.
- **Common worked-problem trap:** a student calculates a final temperature for a system that crosses a phase boundary using only mcΔT terms. Always check whether T_f is consistent with the assumed phases — if not, redo in stages with mL terms inserted at phase boundaries.
- **Did-you-know:** Joule's wife, Amelia, was on their honeymoon in the Alps when Joule famously spent the trip measuring water temperature at the top and bottom of waterfalls — verifying his prediction that gravitational PE → thermal energy → ΔT of about 1°C per 400 m fall. The mechanical equivalent of heat was so fresh that Joule was eyeballing 1/4° in mountain streams to confirm 4.18 J/cal.
- **OOM cheat sheet for memorization** — heat-capacity and latent-heat values worth burning in: c_water = 4186 J/(kg·K) ≈ 4 kJ/(kg·K); L_f(water) = 334 kJ/kg ≈ 80 cal/g; L_v(water,100°C) = 2256 kJ/kg ≈ 540 cal/g. The "80 and 540 in cal/g" pair is the most efficient encoding for Ch 14 problems.
- **Connection to Ch 15:** the 1st law of thermodynamics is ΔU = Q - W. Ch 14 has been all about Q without explicitly discussing W (work done by a system). Once we add W in Ch 15, we'll see why c_P > c_V for gases (some heat goes into PΔV work), and why heat engines are fundamentally limited (can't convert Q completely into W, by 2nd law).
