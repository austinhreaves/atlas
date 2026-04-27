# Chapter 13 — Temperature, Kinetic Theory, and the Gas Laws

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 13.1 Temperature · 13.2 Thermal Expansion of Solids and Liquids · 13.3 The Ideal Gas Law · 13.4 Kinetic Theory: Atomic and Molecular Explanation of Pressure and Temperature · 13.5 Phase Changes · 13.6 Humidity, Evaporation, and Boiling

**Domain:** thermodynamics
**Suggested shared metadata:**
```yaml
layer: concept
domain: thermodynamics
chapter: 13
idealizations:
  - {name: "Ideal gas (point particles, no interactions, elastic collisions)", scope: "limiting-case — exact at high T, low ρ"}
  - {name: "Thermal equilibrium reached", scope: "limiting-case — assumes enough time"}
  - {name: "Constant coefficient of expansion (small ΔT)", scope: "idealized"}
  - {name: "Maxwell-Boltzmann velocity distribution", scope: "limiting-case — equilibrium statistics"}
  - {name: "Continuum thermodynamic variables (P, V, T well-defined)", scope: "idealized — needs many particles"}
```

---

## Chapter Overview

The first chapter of the thermal arc — and the one that bridges macroscopic and microscopic descriptions of matter. Three layers stack on top of each other. (1) **Macroscopic / phenomenological:** temperature is what a thermometer reads, the zeroth law guarantees the concept is well-defined, and matter expands when heated (ΔL = αLΔT). (2) **Equation of state:** the ideal gas law (PV = NkT or PV = nRT) compresses three centuries of empirical work — Boyle, Charles, Avogadro — into a single, blindingly useful relation. (3) **Microscopic / kinetic theory:** macroscopic pressure is the time-averaged momentum transfer of molecular collisions with the walls, and *temperature* turns out to be a measure of average translational kinetic energy: ⟨KE⟩ = (3/2)kT. This is the chapter's centerpiece — temperature is no longer a primitive concept but is reduced to molecular motion. The chapter closes with phase diagrams (P vs. T regions for solid/liquid/gas, with critical and triple points) and humidity / evaporation / boiling — applications that all hinge on the Maxwell-Boltzmann distribution and vapor-pressure equilibrium. PHY 132 students will use this for thermodynamics; PHY 114 pre-meds will use it for respiratory physiology and thermoregulation.

---

## Concept Nodes

### 1. Temperature

- **id:** `temperature`
- **title:** Temperature
- **principle:** Temperature is operationally what a thermometer reads — and microscopically a measure of the average translational kinetic energy of the molecules in a system. Two objects in thermal contact exchange energy until their temperatures are equal (thermal equilibrium); the zeroth law guarantees the concept is transitive (A↔B and B↔C ⟹ A↔C).
- **causal:** symmetric (definitional / state variable)
- **vars:**
  - `T` — state, K (or °C, °F): absolute temperature
  - thermometer property — any reproducibly T-dependent quantity (volume, resistance, color, IR emission, gas pressure)
  - thermal equilibrium — the no-net-heat-flow steady state
- **limits:**
  - SI unit: kelvin (K), no degree sign; same size as °C
  - 0 K = absolute zero = no molecular thermal motion (unattainable by 3rd law)
  - Conversions: T_K = T_C + 273.15; T_F = (9/5)T_C + 32
  - Temperature is an *intensive* property — independent of system size
  - Human perception ≠ temperature: metal feels colder than wood at the same T because it conducts heat away faster
- **misconceptions:**
  - ❌ Temperature and heat are the same → ✓ Temperature is a state variable; heat is energy in transit (Ch 14)
  - ❌ Cold objects "have cold" that flows into warm ones → ✓ Energy flows from hot to cold; "cold" isn't a substance
  - ❌ Absolute zero is just very cold → ✓ It's the zero point of molecular kinetic energy and the absolute reference for all temperatures
- **prereqs:**
  - `kinetic-energy` (weight 0.7)
- **tags:** [thermodynamics, temperature, foundational, state-variable]

---

### 2. Zeroth Law of Thermodynamics

- **id:** `zeroth-law`
- **title:** Zeroth Law of Thermodynamics
- **formula:** `A \leftrightarrow B \;\text{and}\; B \leftrightarrow C \;\Longrightarrow\; A \leftrightarrow C`
- **principle:** If system A is in thermal equilibrium with B, and B with C, then A is in thermal equilibrium with C. Equivalently: thermal equilibrium is a transitive relation, which is what allows us to assign a single number (temperature) to a system at all.
- **causal:** symmetric (postulate)
- **vars:**
  - thermal equilibrium relation — the transitive equivalence relation among systems
  - temperature — the equivalence-class label
- **limits:**
  - Named "zeroth" because it's logically prior to the 1st and 2nd laws but was formalized after them (1930s)
  - The basis for thermometry: a thermometer reads its own T, which equals the system's T once equilibrium is reached
  - Implicit in any pair-comparison or heat-engine analysis
- **misconceptions:**
  - ❌ The zeroth law is trivial → ✓ It's exactly what's needed to make T a well-defined state variable; without it, "temperature" couldn't be assigned uniquely
- **prereqs:**
  - `temperature` (weight 0.95)
- **tags:** [thermodynamics, foundational, equivalence-relation]

---

### 3. Linear Thermal Expansion

- **id:** `linear-thermal-expansion`
- **title:** Linear Thermal Expansion
- **formula:** `\Delta L = \alpha L_0 \,\Delta T`
- **principle:** When a solid is heated, the average atomic spacing grows because thermal-vibration amplitudes push neighbors apart slightly more than they pull. Length changes proportionally to original length, temperature change, and a material-specific coefficient of linear expansion α.
- **causal:** asymmetric (ΔT × geometry × α → length change)
- **vars:**
  - `\alpha` — parameter, 1/K (or 1/°C): coefficient of linear expansion
  - `L_0` — parameter, m: initial length
  - `\Delta T` — driver, K: temperature change
  - `\Delta L` — response, m: length change
- **limits:**
  - α typical solids ~10⁻⁵ /K (steel ~12, aluminum ~25, Pyrex ~3, Invar ~1)
  - Holes expand the same as solid material (ring of atoms behaves like a solid plug)
  - 2D area expansion: ΔA ≈ 2αA₀ΔT; 3D volume: ΔV ≈ 3αV₀ΔT (so β ≈ 3α for solids)
  - Bridges, railroad tracks, dental fillings, hip implants — all need expansion-matched materials
  - Linear-expansion approximation breaks down for large ΔT or near phase changes
  - Anomalous water: density max at 4°C, *not* at the freezing point (why ponds freeze top-down)
- **misconceptions:**
  - ❌ Holes shrink when material expands → ✓ Holes expand at the same rate as the surrounding material
  - ❌ All materials expand on heating → ✓ Most do, but water (0–4°C), some polymers, and rubber under tension contract
  - ❌ Thermal expansion is small enough to ignore → ✓ Golden Gate Bridge changes length by ~1 m between extreme temperatures; small per-meter, large in absolute terms
- **prereqs:**
  - `temperature` (weight 0.85)
  - `length-geometry` (weight 0.7)
- **tags:** [thermodynamics, expansion, materials, applications]

---

### 4. Volume Thermal Expansion

- **id:** `volume-thermal-expansion`
- **title:** Volume Thermal Expansion
- **formula:** `\Delta V = \beta V_0 \,\Delta T \quad ; \quad \beta \approx 3\alpha \text{ (solids)}`
- **principle:** The volumetric expansion coefficient β governs how a body's volume changes with temperature. For isotropic solids β ≈ 3α; for liquids and gases β must be measured directly. Differential expansion between dissimilar materials creates **thermal stress** that can rupture containers, crack glass, or buckle pavement.
- **causal:** asymmetric (ΔT × volume × β → volume change)
- **vars:**
  - `\beta` — parameter, 1/K: volume expansion coefficient
  - `V_0` — parameter, m³: initial volume
  - `\Delta T` — driver, K: temperature change
  - `\Delta V` — response, m³: volume change
- **limits:**
  - Liquids: β ranges ~10⁻⁴ /K (water ~2.1×10⁻⁴, gasoline ~9.5×10⁻⁴, mercury ~1.8×10⁻⁴)
  - Gases at constant pressure: β ≈ 1/T (≈ 3.4×10⁻³ /K at 20°C) — much larger
  - Thermal stress (constrained expansion): pressure ΔP = B·βΔT, where B is bulk modulus — easily destructive
  - Differential expansion drives bimetallic strips (thermostats), pothole formation, and gasoline overflow on hot days
  - Sea-level rise from thermal expansion of oceans is a substantial fraction of the total observed rise
- **misconceptions:**
  - ❌ Volume expansion is negligible → ✓ A 60-L gas tank loses ~1 L of usable fuel between 15°C and 35°C from gas expanding more than steel
  - ❌ β = 3α exactly → ✓ Approximation valid for small ΔT and isotropic materials only
  - ❌ Capping a fluid container is safe because liquids can't compress much → ✓ Exactly the point — preventing expansion creates extreme thermal stress
- **prereqs:**
  - `linear-thermal-expansion` (weight 0.95)
  - `bulk-modulus` (weight 0.7)
- **tags:** [thermodynamics, expansion, thermal-stress, materials]

---

### 5. Ideal Gas Law

- **id:** `ideal-gas-law`
- **title:** Ideal Gas Law
- **formula:** `PV = NkT \quad \text{(molecules)} \quad ; \quad PV = nRT \quad \text{(moles)}`
- **principle:** For a sufficiently dilute gas, the four state variables P, V, N (or n), and T are linked by a single equation of state — the product PV equals the number of particles times Boltzmann's constant times absolute temperature. This single law subsumes Boyle's law (PV = const at fixed T), Charles' law (V/T = const at fixed P), Gay-Lussac's law (P/T = const at fixed V), and Avogadro's hypothesis (equal volumes of gas at the same P, T contain equal numbers of molecules).
- **causal:** symmetric (constraint among state variables)
- **vars:**
  - `P` — Pa: absolute pressure
  - `V` — m³: volume
  - `N` — number of molecules; or `n` — moles (= N / N_A)
  - `k = 1.38\times10^{-23}` — J/K: Boltzmann's constant
  - `R = N_A k = 8.314` — J/(mol·K): universal gas constant
  - `T` — K: absolute temperature (must be in K, not °C)
- **limits:**
  - Valid in the ideal-gas regime: high T (well above boiling) and low ρ (dilute)
  - At STP (0°C, 1 atm), 1 mole occupies 22.4 L and 1 m³ contains ~2.7×10²⁵ molecules (Loschmidt's number)
  - Both P (absolute) and T (absolute) — common student error to use gauge pressure or °C
  - Real gas corrections (van der Waals, intermolecular forces, finite molecular volume) needed near phase boundaries
  - PV has units of J — a foreshadowing that PV is energy-related (work done by/on a gas; Ch 14–15)
- **misconceptions:**
  - ❌ Different gases obey different versions of the ideal gas law → ✓ Same law for all (assuming ideality); only N or n matters, not species
  - ❌ Gauge pressure works in PV = NkT → ✓ Must use absolute pressure
  - ❌ Doubling T at constant V doubles P → ✓ Only if T is in *kelvin* (293→586 K → P doubles; 20→40°C → P rises by only ~7%)
  - ❌ The gas constant R has only one value → ✓ Same constant; just different units (8.314 J/mol·K = 0.0821 L·atm/mol·K)
- **prereqs:**
  - `pressure` (weight 0.95)
  - `temperature` (weight 0.95)
  - `density` (weight 0.7)
- **tags:** [thermodynamics, ideal-gas, equation-of-state, foundational]

---

### 6. Avogadro's Number and the Mole

- **id:** `avogadros-number`
- **title:** Avogadro's Number and the Mole
- **formula:** `N_A = 6.022\times10^{23}\ \text{particles/mol}`
- **principle:** A mole is a counting unit for atoms and molecules — defined so that one mole of any substance contains exactly Avogadro's number of particles. The molar mass in grams equals the molecular mass in atomic mass units (amu).
- **causal:** symmetric (definitional)
- **vars:**
  - `N_A` — constant, /mol: Avogadro's number
  - `n` — driver, mol: number of moles
  - `N = nN_A` — response: number of particles
  - `M` — parameter, g/mol: molar mass
- **limits:**
  - 1 mole occupies 22.4 L at STP (any ideal gas)
  - Molar mass: H ≈ 1, C ≈ 12, O ≈ 16, N ≈ 14 (g/mol)
  - 1 m³ of air at STP ≈ 2.7×10²⁵ molecules ≈ 44.6 mol ≈ 1.29 kg
  - Avogadro originally hypothesized "equal volumes of gas at same P, T → equal N" — a counterintuitive claim that is the kinetic-theory consequence of pressure depending only on N, not species
  - Macroscopic intuition: a mole of marbles would cover Earth ~80 km deep
- **misconceptions:**
  - ❌ A mole always weighs ~12 grams → ✓ A mole of *carbon-12* does, but a mole of water = 18 g, lead = 207 g
  - ❌ Avogadro's number is somehow a magic constant → ✓ Just a unit-conversion factor between particle counts and macroscopic chemistry — the number was *fit* to match the gram-amu definition
- **prereqs:**
  - `ideal-gas-law` (weight 0.7)
- **tags:** [thermodynamics, chemistry, units, mole, foundational]

---

### 7. Kinetic-Theory Pressure

- **id:** `kinetic-theory-pressure`
- **title:** Pressure from Molecular Collisions
- **formula:** `P = \frac{1}{3}\frac{N}{V} m\,\overline{v^2}`
- **principle:** A gas's macroscopic pressure is the time-averaged momentum flux delivered to the walls by the rapid, random collisions of its molecules. Each collision transfers 2mv_x to the wall; summing over all molecules and dividing by area and time gives a pressure that depends on N/V, molecular mass m, and the mean-square speed.
- **causal:** asymmetric (microscopic momentum transfers → macroscopic pressure)
- **vars:**
  - `N/V` — driver, /m³: number density
  - `m` — parameter, kg: mass per molecule
  - `\overline{v^2}` — driver, m²/s²: mean-square molecular speed
  - `P` — response, Pa: macroscopic pressure
- **limits:**
  - Derivation assumes elastic wall collisions, no intermolecular forces, isotropic motion (⟨v_x²⟩ = ⟨v_y²⟩ = ⟨v_z²⟩ = ⟨v²⟩/3)
  - Combined with ideal gas law → average kinetic energy per molecule = (3/2)kT (next node)
  - Pressure fluctuations exist at the molecular scale (Brownian motion is the visible manifestation in pollen grains)
  - Holds for monatomic, diatomic, polyatomic gases — only translational KE matters for pressure
  - Not valid where molecules feel each other (high density, near phase change)
- **misconceptions:**
  - ❌ Gas pressure is from molecules pushing on each other → ✓ It's from molecules hitting the *walls*; intermolecular forces are negligible in the ideal limit
  - ❌ Doubling the molecular mass doubles the pressure → ✓ At fixed T, doubling m halves v² (since (1/2)mv² is fixed), so P is unchanged
- **prereqs:**
  - `ideal-gas-law` (weight 0.95)
  - `momentum-impulse` (weight 0.85)
  - `pressure` (weight 0.85)
- **tags:** [thermodynamics, kinetic-theory, microscopic, pressure, foundational]

---

### 8. Temperature ↔ Molecular Kinetic Energy

- **id:** `temperature-kinetic-energy`
- **title:** Temperature as Molecular Kinetic Energy
- **formula:** `\overline{KE} = \tfrac{1}{2}m\,\overline{v^2} = \tfrac{3}{2}kT \quad ; \quad v_{rms} = \sqrt{\frac{3kT}{m}}`
- **principle:** The single deepest result of kinetic theory: for an ideal gas, the average translational kinetic energy per molecule is (3/2)kT. Temperature is *not* a primitive concept — it is a measure of the kinetic energy stored in molecular motion, and equals the same value for all gas species at the same T (regardless of mass).
- **causal:** symmetric (definitional / equipartition)
- **vars:**
  - `T` — state, K: absolute temperature
  - `k` — constant, J/K: Boltzmann constant
  - `\overline{KE}` — response, J: average translational kinetic energy per molecule
  - `m` — parameter, kg: molecular mass
  - `v_{rms}` — response, m/s: root-mean-square speed
- **limits:**
  - At room T (300 K): ⟨KE⟩ ≈ 6×10⁻²¹ J ≈ 0.04 eV per molecule
  - v_rms for N₂ at 300 K ≈ 517 m/s — comparable to speed of sound (~340 m/s) for the same reason
  - v_rms for He at 300 K ≈ 1370 m/s — light molecules move faster (same KE, smaller m)
  - This is the equipartition theorem (3 translational degrees of freedom × ½kT each); diatomic molecules add rotational and vibrational modes (Ch 14–15)
  - Atmospheric escape: a small Maxwell-Boltzmann tail of light molecules exceeds Earth's escape velocity → He, H gradually leak away over geologic time; heavier N₂, O₂ retained
  - Equipartition is the foundation of specific heat (Ch 14), Brownian motion, and statistical mechanics
- **misconceptions:**
  - ❌ Heavier molecules at the same T have higher KE → ✓ Same KE; just lower speed (KE depends only on T)
  - ❌ Temperature is a property of an individual molecule → ✓ It's a *statistical* property of an ensemble; one molecule has KE, not T
  - ❌ Maxwell-Boltzmann is symmetric → ✓ It has a long high-speed tail (skewed); v_rms > v_avg > v_most-probable
- **prereqs:**
  - `kinetic-theory-pressure` (weight 0.95)
  - `ideal-gas-law` (weight 0.95)
  - `temperature` (weight 0.95)
  - `kinetic-energy` (weight 0.85)
- **tags:** [thermodynamics, kinetic-theory, equipartition, microscopic, foundational]

---

### 9. Maxwell-Boltzmann Distribution

- **id:** `maxwell-boltzmann-distribution`
- **title:** Maxwell-Boltzmann Speed Distribution
- **principle:** In thermal equilibrium, molecular speeds in a gas are distributed according to the Maxwell-Boltzmann law — a probability distribution skewed to higher speeds. It has three characteristic speeds: most probable (peak), average (mean), and rms (square root of mean of v²), with v_p < v_avg < v_rms. As T rises, the entire distribution broadens and shifts to higher speeds.
- **causal:** asymmetric (T + species → speed distribution)
- **vars:**
  - `f(v)` — response, s/m: probability density of finding a molecule with speed v
  - `T` — driver, K: temperature
  - `m` — parameter, kg: molecular mass
  - `v_p, v_{avg}, v_{rms}` — characteristic speeds (in ratio ~1 : 1.13 : 1.22)
- **limits:**
  - Underlies evaporation: the high-speed tail molecules can escape liquid surfaces even below boiling point
  - Drives chemical reaction rates (Arrhenius factor — fraction of molecules above activation energy)
  - Explains why fevers cause mild dehydration: shifted distribution → more high-energy water molecules escape lung mucosa
  - Atmospheric retention: planet keeps gas if v_rms ≪ v_escape; loses it if comparable (over geologic time)
  - Strictly an equilibrium result — non-equilibrium gases (jets, plasmas) deviate
- **misconceptions:**
  - ❌ All molecules in a gas at temperature T have speed v_rms → ✓ A *distribution* — most have lower, some have much higher
  - ❌ Mean and rms speeds are equal → ✓ rms > mean for any non-trivial distribution (Cauchy-Schwarz)
- **prereqs:**
  - `temperature-kinetic-energy` (weight 0.95)
  - `ideal-gas-law` (weight 0.7)
- **tags:** [thermodynamics, statistics, kinetic-theory, distribution, foundational]

---

### 10. Phase Diagrams (P-T)

- **id:** `phase-diagrams`
- **title:** Phase Diagrams and Phase Equilibrium
- **principle:** A pressure–temperature plot of a substance partitions the (P, T) plane into solid, liquid, and gas regions, separated by coexistence curves where two phases are in equilibrium. Three special points define the diagram: the **triple point** (all three phases coexist), the **critical point** (above which liquid and gas are indistinguishable), and the boiling/melting curves.
- **causal:** symmetric (state-space topology)
- **vars:**
  - `P, T` — state coordinates
  - phase region — qualitative output: solid, liquid, gas, supercritical
  - triple point: water at 273.16 K, 0.00604 atm (used for the kelvin definition)
  - critical point: water at 647 K, 218 atm
- **limits:**
  - Pressure cookers exploit the rising boiling curve: at higher P, water boils at higher T → faster cooking
  - At very low pressures (< 0.006 atm for water) liquid is impossible → solid sublimates directly to vapor (CO₂ at 1 atm; freeze-drying; freezer defrost; snow loss to atmosphere)
  - Triple point is a fixed thermodynamic landmark (replaced ice point as the kelvin reference until 2019 SI redefinition)
  - Above critical T: no distinct liquid phase exists at any pressure; supercritical fluid has unusual solvent properties (used in industrial decaffeination)
  - Water's solid-liquid line slopes *negative* (anomalous) — increased pressure melts ice (ice skating, glacier flow)
- **misconceptions:**
  - ❌ Boiling temperature is a fixed property of a liquid → ✓ Depends on ambient pressure (water boils at 70°C in Denver; at 100°C at sea level)
  - ❌ Phase changes are sharp lines in temperature → ✓ Sharp in (P, T), but thermal hysteresis and nucleation kinetics smear out real transitions
  - ❌ Above the critical point, the gas just becomes "really compressed" → ✓ The distinction between liquid and gas vanishes; supercritical CO₂ has no surface tension but ~liquid density
- **prereqs:**
  - `ideal-gas-law` (weight 0.7)
  - `pressure` (weight 0.85)
  - `temperature` (weight 0.85)
- **tags:** [thermodynamics, phase-diagram, phase-transition, equilibrium]

---

### 11. Vapor Pressure, Humidity, and Boiling

- **id:** `vapor-pressure-humidity`
- **title:** Vapor Pressure, Humidity, and Boiling
- **formula:** `\%\,RH = \frac{\text{actual vapor density}}{\text{saturation vapor density at }T} \times 100\%`
- **principle:** A liquid in a closed container reaches dynamic equilibrium with its vapor at a temperature-dependent **vapor pressure**. **Boiling** occurs when the vapor pressure equals the ambient (total) pressure — bubbles can form throughout the liquid, not just at the surface. **Relative humidity** is the ratio of actual to saturation water vapor density. **Dalton's law of partial pressures**: total P = sum of partial pressures of each component, treating them independently.
- **causal:** asymmetric (T → vapor pressure → boiling / dew formation / evaporation rate)
- **vars:**
  - vapor pressure — Pa, function of T and substance (water at 100°C = 1 atm)
  - partial pressure — Pa: pressure contribution of one component in a gas mixture (Dalton)
  - relative humidity — dimensionless 0–1: ratio of partial pressure to saturation vapor pressure
  - dew point — K: T at which current vapor density would be 100% RH
- **limits:**
  - Boiling = vapor pressure equals external pressure; reduce P → boil at lower T (Denver: 95°C; vacuum chamber: room temperature)
  - At 37°C (body T) saturation vapor density of water ≈ 44 g/m³ — basis for evaporative cooling from sweat and lungs
  - At dew point, condensation just begins; below it, fog/dew/frost form
  - "Humid air feels hotter" → high partial pressure of water vapor inhibits sweat evaporation
  - Latent heat (Ch 14) is what's actually transferred during phase change — vapor pressure tells you when, not how much
  - Pressure cooker: ~2 atm internal → boiling at ~120°C → cooking ~3× faster
- **misconceptions:**
  - ❌ Air "holds" water vapor → ✓ The vapor is independent of air; max vapor density is set by water's saturation curve, not by air
  - ❌ Higher humidity means more water in the air than dry air → ✓ Relative humidity; the partial pressure can be lower at low T even at high RH
  - ❌ Boiling and evaporation are the same → ✓ Evaporation occurs at any T from a liquid surface (high-speed tail); boiling is bulk phase change requiring vapor pressure ≥ ambient
- **prereqs:**
  - `phase-diagrams` (weight 0.95)
  - `maxwell-boltzmann-distribution` (weight 0.85)
  - `ideal-gas-law` (weight 0.85)
- **tags:** [thermodynamics, humidity, boiling, evaporation, daltons-law, biomedical]

---

## Pedagogical Notes (for downstream LLM context)

- **The chapter's spine is the chain macroscopic → equation of state → microscopic.** Walk students up the staircase: (1) here's a thermometer; (2) here's a beautifully simple pattern, PV = NkT, that ties three centuries of empirical work together; (3) and now look — *temperature itself* turns out to be the average translational KE of the molecules. The "aha" moment when ⟨KE⟩ = (3/2)kT lands is the high point of the entire intro thermal physics curriculum.
- **For PHY 132 (engineers):** ideal gas law is an everyday tool — pressure-temperature work, tire pressure with temperature, gas expansion/compression in cylinders. Spend extra time on absolute vs. gauge pressure and °C vs. K conversions; these are the single most common student errors. The connection PV = (energy units) primes them for thermodynamics in Ch 15.
- **For PHY 114 (pre-meds):** lean on the biomedical thread. Vapor pressure → humidity, sweating, lungs (water vapor in alveoli is at 47 mm Hg at 37°C — non-trivial fraction of breath). Maxwell-Boltzmann → Arrhenius (enzyme kinetics, why fevers can run away). Phase diagrams → cryosurgery, freeze-drying of pharmaceuticals, hyperbaric oxygen.
- **The single most useful order-of-magnitude fact:** at room T, ⟨KE⟩ ≈ kT ≈ 0.025 eV per molecule. This number recurs for the rest of physics — it's the energy scale of thermal noise that determines biological membrane behavior, semiconductor doping, leakage currents, every chemical reaction's Arrhenius factor. Burn it in.
- **The "holes get bigger" thermal-expansion paradox** is a great early concept-question moment. Make it operational: ask students whether a steel ring that doesn't fit on a steel rod will fit if you heat *the ring* (yes — hole expands).
- **Anomalous water expansion (max density at 4°C, expansion on freezing)** is the canonical "physics enables biology" story — without it, ponds would freeze bottom-up and ice would sink, ending freshwater life. Worth a "did you know" follow-up: liquid water has ~10 known anomalies, including specific heat, surface tension, and viscosity behavior.
- **Gas constant unit acrobatics:** R = 8.314 J/(mol·K) = 0.0821 L·atm/(mol·K). Engineering-track students should be able to switch fluently. A common trap: PV = nRT with V in liters and P in atm but T in °C — mistake that reliably costs points on exams.
- **Common worked example I recommend:** "How many molecules of air do you breathe in a single inhalation?" Tidal volume ~0.5 L, T = 310 K, P = 1 atm → n = PV/(RT) ≈ 0.02 mol → N ≈ 1.2×10²² molecules. Now ask: "How many of those were exhaled by Caesar?" (Classic Lord Kelvin estimation problem — comes out to around 1, given Earth's atmosphere and time-mixing — a great way to internalize how big Avogadro's number is and how thoroughly the atmosphere mixes.)
- **Connection to upcoming chapters:** Ch 14 introduces heat, latent heat, and heat capacity (where ⟨KE⟩ = (3/2)kT becomes specific heat C_v = (3/2)R for monatomic gases via equipartition). Ch 15 introduces the 1st and 2nd laws of thermodynamics (the zeroth law you just learned is the foundation). Ch 30 will return to kT in quantum statistics (Planck distribution).
- **Did-you-know:** the kelvin was redefined in 2019 in terms of fundamental constants (the Boltzmann constant k is now *exactly* 1.380649×10⁻²³ J/K, by definition). Before that, the kelvin was defined as 1/273.16 of the triple-point temperature of water — a beautifully thermodynamic choice. The 2019 SI redefinition closed the loop: now T is operationally what we calculate from energy ratios via k.
