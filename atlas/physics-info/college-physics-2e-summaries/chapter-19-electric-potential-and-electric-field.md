# Chapter 19: Electric Potential and Electric Field
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Electric potential as a line integral, gradient relation, electron volt, potential of point charges and distributions, equipotentials, capacitance from Gauss's law, dielectrics, energy stored in the field.

---

## Concept Nodes

---

### Node 19.1 — Electric Potential and Potential Difference

- **id**: `electric-potential`
- **title**: Electric Potential as a Line Integral
- **formula**:
$$V(\vec{r}) = -\int_{\mathcal{O}}^{\vec{r}} \vec{E} \cdot d\vec{l}$$
$$\Delta V = V_B - V_A = -\int_A^B \vec{E} \cdot d\vec{l}$$

**principle**: The electric potential $V$ at a point is the work done per unit positive charge by the external agent moving a test charge from the reference point $\mathcal{O}$ (conventionally at $\infty$) to that point, against the electric force. Because the electrostatic force is conservative ($\nabla \times \vec{E} = 0$ for static fields), the line integral is path-independent — $V$ is well-defined as a scalar field. The inverse relation:

$$\vec{E} = -\nabla V$$

states that the electric field is the negative gradient of the potential — it points in the direction of steepest potential *decrease*, with magnitude equal to the rate of decrease.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $V$ | response — electric potential | V = J/C |
| $\vec{E}$ | driver — electric field (source of V) | V/m |
| $d\vec{l}$ | parameter — path element | m |
| $\Delta V$ | response — potential difference between two points | V |

**causal-structure**: asymmetric — the charge distribution drives $\vec{E}$, which drives $V$; conversely, $\vec{E} = -\nabla V$ so knowing $V$ everywhere is equivalent to knowing $\vec{E}$.

**limits**:
- The potential $V$ is defined only up to an additive constant (the choice of reference). Only $\Delta V$ is physically meaningful; $V$ at a single point is convention.
- In time-varying fields, $\vec{E}$ is no longer conservative and $\vec{E} \neq -\nabla V$ (requires the full $\vec{E} = -\nabla V - \partial\vec{A}/\partial t$ with vector potential $\vec{A}$).

**misconceptions**:
- "Voltage and energy are the same" — $V$ is energy per charge. Same $\Delta V$ can correspond to very different $\Delta PE$ depending on the charge.
- "Only potential differences matter because potential is arbitrary" — correct; this is why Ohm's law, Kirchhoff's voltage law, and all physics involve $\Delta V$, never absolute $V$.

**prereqs**:
- `electric-field` (foundational, 0.85)
- Line integrals; conservative fields and path independence (foundational, 0.85)
- `coulombs-law` (supporting, 0.55)

---

### Node 19.2 — Electron Volt

- **id**: `electron-volt`
- **title**: Electron Volt as an Energy Unit
- **formula**: $1 \text{ eV} = e \cdot \Delta V = (1.602 \times 10^{-19} \text{ C})(1 \text{ V}) = 1.602 \times 10^{-19}$ J

**principle**: The electron volt is the kinetic energy gained by a particle of charge $e$ accelerated through a potential difference of 1 V: $\Delta KE = |q| \Delta V$. It is not a unit of voltage — it is a unit of energy. Conversion: $\Delta KE (\text{in eV}) = (q/e) \cdot \Delta V$. Relevant scales: molecular bond energies $\sim 1$–$5$ eV; ionization energies $\sim 10$–$100$ eV; nuclear reactions $\sim$ MeV; LHC collisions $\sim$ TeV.

**causal-structure**: asymmetric — $\Delta V$ drives $\Delta KE$ for a particle of charge $q$.

**limits**: Non-relativistic limit. For electrons, relativistic corrections become significant at $\Delta V \gtrsim 50$ kV ($v/c \gtrsim 0.4$).

**misconceptions**:
- "eV is a unit of voltage" — volt is J/C; eV is a joule-level energy quantity.
- "Only electrons use eV" — any charged particle's energy can be expressed in eV; it's just a unit.

**prereqs**:
- `electric-potential` (foundational, 0.85)
- `electric-charge` (foundational, 0.85)

---

### Node 19.3 — Voltage and Electric Field: The Gradient Relation

- **id**: `gradient-relation`
- **title**: Electric Field as the Negative Gradient of Potential
- **formula**:
$$\vec{E} = -\nabla V = -\left(\frac{\partial V}{\partial x}\hat{x} + \frac{\partial V}{\partial y}\hat{y} + \frac{\partial V}{\partial z}\hat{z}\right)$$

Uniform field (parallel plates): $E = -\Delta V / d$ (magnitude; field points from high $V$ to low $V$).

**principle**: The gradient $\nabla V$ points in the direction of steepest increase of $V$. Therefore $\vec{E} = -\nabla V$ points in the direction of steepest *decrease*. Field lines are always perpendicular to equipotential surfaces (since motion along an equipotential does no work, and $W = q \vec{E} \cdot d\vec{l} = 0$ requires $\vec{E} \perp d\vec{l}$ on that surface). In a uniform field: $E = \Delta V / d$ (the familiar algebra-level result) is the 1D projection of the gradient relation.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{E}$ | response — electric field | V/m |
| $V$ | driver — scalar potential field | V |
| $\nabla V$ | driver — gradient of potential | V/m |

**causal-structure**: asymmetric — the charge distribution determines $V$; the gradient of $V$ determines $\vec{E}$. This is a computational chain, not a new physical law: it follows from the definition of $V$ as a line integral.

**limits**: Valid for electrostatics only. In time-varying situations, $\vec{E} = -\nabla V - \partial\vec{A}/\partial t$.

**misconceptions**:
- "Larger voltage means stronger field" — field depends on the *gradient* of $V$, not its value. A uniform 1000 V distributed over 1 km gives a weaker field than 10 V across 1 mm.
- "$E = V/d$ requires $d$ to be in any direction" — valid only along the field direction.

**prereqs**:
- `electric-potential` (foundational, 0.85)
- Gradient and partial derivatives (foundational, 0.85)

---

### Node 19.4 — Electric Potential of a Point Charge and Distributions

- **id**: `point-charge-potential`
- **title**: Potential of Point Charges and Continuous Distributions
- **formula**:
Single point charge: $V = \frac{1}{4\pi\varepsilon_0}\frac{Q}{r}$

Continuous distribution:
$$V(\vec{r}) = \frac{1}{4\pi\varepsilon_0} \int \frac{\rho(\vec{r}\,')}{|\vec{r} - \vec{r}\,'|} \, dV'$$

**principle**: The potential from a point charge falls off as $1/r$ (slower than the field $\sim 1/r^2$). The potential is a scalar, so superposition for multiple charges requires only *algebraic* addition — no vector decomposition. This often makes computing $V$ easier than $\vec{E}$ directly; then $\vec{E} = -\nabla V$. The continuous-distribution integral is the scalar counterpart of the vector field integral from Ch. 18.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $V$ | response — potential | V |
| $Q$ or $\rho$ | driver — source charge | C or C/m³ |
| $r$ | parameter — distance from source | m |
| $\varepsilon_0$ | parameter — permittivity | C²/(N·m²) |

**causal-structure**: asymmetric — charge distribution drives $V$.

**limits**:
- $V = 0$ at $r \to \infty$ (reference convention). Inside a conductor, $V$ is constant (not zero unless grounded).
- For charge distributions with infinite extent (e.g., infinite line charge), the integral diverges; a finite reference must be chosen.

**misconceptions**:
- "$V$ and $\vec{E}$ both go as $1/r^2$" — $|\vec{E}| \propto 1/r^2$ for a point charge; $V \propto 1/r$.
- "$V = 0$ means no charge" — it means the point is at the reference potential.
- "Adding potentials requires vectors" — $V$ is scalar; add algebraically.

**prereqs**:
- `electric-potential` (foundational, 0.85)
- `electric-field` (foundational, 0.85)
- Volume integrals (foundational, 0.85)

---

### Node 19.5 — Equipotential Surfaces

- **id**: `equipotential-surfaces`
- **title**: Equipotential Surfaces
- **formula**: $W = q\Delta V = 0$ along an equipotential ($\Delta V = 0$ by definition)

**principle**: Equipotential surfaces are the level surfaces of $V(\vec{r})$. Since $\vec{E} = -\nabla V$ and the gradient is always perpendicular to level surfaces, $\vec{E}$ is everywhere perpendicular to equipotentials. No work is done moving a charge along an equipotential. In electrostatic equilibrium, conductors are equipotential volumes — their entire surface (and interior) is at one potential, since $\vec{E} = 0$ inside means $\nabla V = 0$ inside.

**causal-structure**: symmetric — equipotentials represent the geometry of $V$; they don't cause anything.

**limits**: Applies to electrostatics. In time-varying fields, Faraday's law adds a curl to $\vec{E}$ and pure equipotential surfaces are no longer strictly defined.

**misconceptions**:
- "Equipotential = zero field" — moving along an equipotential requires zero work, but the field can be strong (it is just perpendicular to the surface).
- "Field lines and equipotentials can be parallel" — impossible; they are always mutually perpendicular.

**prereqs**:
- `gradient-relation` (foundational, 0.85)
- `point-charge-potential` (supporting, 0.55)

---

### Node 19.6 — Capacitance from Gauss's Law

- **id**: `capacitance`
- **title**: Capacitance: Definition and Derivation from Gauss's Law
- **formula**:
$$C \equiv \frac{Q}{\Delta V}$$
For a parallel-plate capacitor (derived from Gauss's law + gradient relation):
$$C = \frac{\varepsilon_0 A}{d}$$

**principle**: Capacitance is the ratio of charge stored to the potential difference required to maintain it. It depends *only* on geometry and material — not on $Q$ or $V$ individually. Derivation for parallel plates: (1) Gauss's law gives $E = \sigma/\varepsilon_0 = Q/(\varepsilon_0 A)$ between plates. (2) $\Delta V = Ed = Qd/(\varepsilon_0 A)$. (3) $C = Q/\Delta V = \varepsilon_0 A/d$. This is a clean chain from Gauss's law to a circuit element — the geometry is doing the physics.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $C$ | response — capacitance | F = C/V |
| $Q$ | driver — charge on plates | C |
| $\Delta V$ | response — potential difference | V |
| $\varepsilon_0$ | parameter — permittivity of free space | C²/(N·m²) |
| $A$ | parameter — plate area | m² |
| $d$ | parameter — plate separation | m |

**causal-structure**: asymmetric — charge $Q$ placed on the plates drives the potential difference $\Delta V$; the ratio $C$ is a geometric parameter.

**limits**: $C = \varepsilon_0 A / d$ assumes infinite parallel plates (uniform field); fringing fields at edges are neglected. Real capacitors have equivalent series resistance (ESR) and lead inductance.

**misconceptions**:
- "Capacitance depends on how much charge you put on it" — $C$ is fixed by geometry; $Q = C\Delta V$ defines how much charge results from a given voltage.
- "Farads are a natural unit for everyday capacitors" — 1 F is enormous; practical devices are $\mu$F to pF.

**prereqs**:
- `gauss-law` (foundational, 0.85)
- `gradient-relation` (foundational, 0.85)
- `conductor-electrostatic-equilibrium` (foundational, 0.85)

---

### Node 19.7 — Dielectrics and Polarization

- **id**: `dielectrics`
- **title**: Dielectrics: Bound Charge, Polarization, and Permittivity
- **formula**:
$$C = \kappa \varepsilon_0 \frac{A}{d} = \varepsilon \frac{A}{d}, \quad \varepsilon = \kappa\varepsilon_0$$

Bound surface charge density: $\sigma_b = \vec{P} \cdot \hat{n}$

Displacement field: $\vec{D} = \varepsilon_0 \vec{E} + \vec{P} = \varepsilon_0 \kappa \vec{E}$ (for linear isotropic dielectric)

Gauss's law in dielectric: $\oint \vec{D} \cdot d\vec{A} = Q_{\text{free,enc}}$

**principle**: When a dielectric is placed in an electric field, the bound charges in each molecule shift to form induced dipoles aligned with $\vec{E}$. The polarization $\vec{P} = n\alpha\vec{E}$ (dipole moment per unit volume) creates bound surface charges ($\sigma_b = \vec{P} \cdot \hat{n}$) that partially cancel the free charges on the capacitor plates, reducing $\vec{E}$ inside and allowing more free charge to be stored at the same $\Delta V$ (hence $C$ increases by factor $\kappa$). The displacement field $\vec{D}$ is introduced so Gauss's law can be written in terms of free charge alone.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\kappa$ | parameter — relative permittivity (dielectric constant) | dimensionless, $\kappa \geq 1$ |
| $\vec{P}$ | response — polarization (dipole moment per volume) | C/m² |
| $\vec{D}$ | response — displacement field | C/m² |
| $\sigma_b$ | response — bound surface charge density | C/m² |
| $\varepsilon = \kappa\varepsilon_0$ | parameter — permittivity of medium | C²/(N·m²) |

**causal-structure**: asymmetric — applied $\vec{E}$ (from free charges) drives polarization $\vec{P}$; $\vec{P}$ produces bound charges that modify the effective field inside the dielectric.

**limits**: Linear dielectric: $\vec{P} = \varepsilon_0 \chi_e \vec{E}$ where $\chi_e = \kappa - 1$ is the electric susceptibility. Nonlinear at high fields. $\kappa$ is frequency-dependent (important in AC circuits; water has $\kappa \approx 80$ at DC but $\approx 1.8$ in optical range).

**misconceptions**:
- "The dielectric increases the voltage at fixed charge" — it *decreases* $\Delta V$ at fixed $Q$ (more charge needed to maintain same $\Delta V$).
- "Dielectrics only insulate" — they also polarize, increasing capacitance and changing breakdown voltage.

**prereqs**:
- `capacitance` (foundational, 0.85)
- `electric-dipole` (foundational, 0.85)
- `gauss-law` (foundational, 0.85)

---

### Node 19.8 — Capacitors in Series and Parallel

- **id**: `capacitors-series-parallel`
- **title**: Capacitors in Series and Parallel
- **formula**:
$$\text{Series:} \quad \frac{1}{C_s} = \sum_i \frac{1}{C_i} \quad (Q_i = Q, \text{ same charge; voltages add})$$
$$\text{Parallel:} \quad C_p = \sum_i C_i \quad (V_i = V, \text{ same voltage; charges add})$$

**principle**: Derived from conservation of charge (junction rule) and the definition $Q = C\Delta V$. For series: same charge on each (charge conservation at isolated internal nodes); voltages add ($\Delta V_{\text{total}} = \sum Q/C_i$); equivalent capacitance $< $ smallest individual. For parallel: same voltage across each; charges add ($Q_{\text{total}} = \sum C_i V$); equivalent capacitance is the sum. The rules are structurally opposite to resistors (series $R$ adds; series $C$ reciprocals add) because capacitors respond to voltage, resistors to current.

**causal-structure**: symmetric — this is a geometric/topological consequence of circuit connections, not a causal chain.

**limits**: Assumes ideal capacitors (no leakage, no ESR). Series combination assumes capacitors start uncharged or are in the same branch.

**misconceptions**:
- "Series and parallel rules for capacitors are the same as for resistors" — they are opposite; internalize the *derivation* rather than memorizing.
- "Series capacitors share voltage" — they share charge; voltage divides inversely with capacitance.

**prereqs**:
- `capacitance` (foundational, 0.85)
- Charge conservation and circuit topology (foundational, 0.85)

---

### Node 19.9 — Energy Stored in a Capacitor and in the Electric Field

- **id**: `capacitor-energy`
- **title**: Energy in a Capacitor; Electric Field Energy Density
- **formula**:
$$U_C = \frac{Q^2}{2C} = \frac{1}{2}C(\Delta V)^2 = \frac{1}{2}Q\Delta V$$

Energy density in the electric field:
$$u_E = \frac{1}{2}\varepsilon_0 E^2 \quad \text{(vacuum)}$$
$$u_E = \frac{1}{2}\varepsilon E^2 = \frac{1}{2}\kappa\varepsilon_0 E^2 \quad \text{(dielectric)}$$

Total energy: $U = \int u_E \, dV$

**principle**: The energy stored in a capacitor is the work done to assemble the charge distribution. The factor of $\frac{1}{2}$ arises from the work integral $W = \int_0^Q V \, dq = \int_0^Q (q/C) \, dq = Q^2/2C$. More fundamentally: the energy is stored in the *electric field* itself, not in the charges. The energy density $u_E = \frac{1}{2}\varepsilon_0 E^2$ is a general result valid wherever $\vec{E}$ exists — the capacitor is just a convenient device for concentrating the field. The total field energy $U = \int \frac{1}{2}\varepsilon_0 E^2 \, dV$ reproduces $Q^2/2C$ when evaluated between parallel plates.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $U_C$ | conserved — energy stored | J |
| $C$ | parameter — capacitance | F |
| $\Delta V$ | driver — potential difference | V |
| $u_E$ | response — field energy density | J/m³ |
| $\vec{E}$ | driver — electric field | V/m |

**causal-structure**: symmetric — energy is the conserved quantity; $\Delta V$ and $Q$ are parameters related by $C$.

**limits**: Valid for ideal capacitor. Real capacitors have leakage current (finite parallel resistance) and lose energy over time. Energy density formula assumes linear dielectric.

**misconceptions**:
- "The energy is stored in the charge" — the energy is in the field; the formula $u_E = \frac{1}{2}\varepsilon_0 E^2$ applies even in field-free regions with no capacitor.
- "Missing the factor of $\frac{1}{2}$" — it comes from the work integral (not a convention); $P = Q\Delta V$ is the *power*, and integrating from 0 to $Q$ gives the $\frac{1}{2}$.

**prereqs**:
- `capacitance` (foundational, 0.85)
- `gradient-relation` (foundational, 0.85)
- Integration (work integral) (foundational, 0.85)

---

## Cross-Chapter Connections

- **← Ch. 18**: $V = -\int \vec{E} \cdot d\vec{l}$ is the inverse of $\vec{E} = -\nabla V$; Gauss's law is used to derive $C = \varepsilon_0 A/d$.
- **→ Ch. 20 (Circuits)**: $\Delta V$ across elements drives current; capacitors in RC circuits use $V_C(t)$ from $Q = C\Delta V$ plus Kirchhoff's loop rule → first-order ODE.
- **→ Ch. 23 (Inductance)**: Energy stored in a capacitor $U = \frac{1}{2}C V^2$ is the electrical analogue of energy stored in an inductor $U = \frac{1}{2}LI^2$; their exchange drives LC oscillations.
- **→ Ch. 24 (EM Waves)**: $u_E = \frac{1}{2}\varepsilon_0 E^2$ is half of the total EM wave energy density (the other half is $u_B = B^2/2\mu_0$).

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Potential (line integral) | $V(\vec{r}) = -\int_\infty^{\vec{r}} \vec{E} \cdot d\vec{l}$ |
| Field from potential | $\vec{E} = -\nabla V$ |
| Potential difference | $\Delta V = V_B - V_A = -\int_A^B \vec{E} \cdot d\vec{l}$ |
| Point charge potential | $V = Q/(4\pi\varepsilon_0 r)$ |
| Continuous distribution | $V = \frac{1}{4\pi\varepsilon_0}\int \rho / \|\vec{r}-\vec{r}'\| \, dV'$ |
| Electron volt | $1 \text{ eV} = 1.602 \times 10^{-19}$ J |
| Capacitance | $C = Q/\Delta V$ |
| Parallel plate | $C = \varepsilon_0 A/d$ |
| With dielectric | $C = \kappa\varepsilon_0 A/d$ |
| Gauss's law (dielectric) | $\oint \vec{D} \cdot d\vec{A} = Q_{\text{free,enc}}$ |
| Capacitor energy | $U = \frac{1}{2}C(\Delta V)^2 = Q^2/(2C)$ |
| Field energy density | $u_E = \frac{1}{2}\varepsilon_0 E^2$ |

## Instructor Notes (PHY 132 / Advanced Track)

The calculus-level payoff in this chapter is the chain **charges → $\vec{E}$ (Gauss or superposition) → $V = -\int\vec{E}\cdot d\vec{l}$ → $\vec{E} = -\nabla V$**: students should be able to travel both directions on this chain fluidly. The derivation of $C = \varepsilon_0 A / d$ from Gauss's law (not from memorization) is a canonical exercise. The dielectric section is a first contact with the $\vec{D} = \varepsilon_0\vec{E} + \vec{P}$ language that reappears in electrostatics of materials, optics (index of refraction), and microwave engineering. The energy density $u_E = \frac{1}{2}\varepsilon_0 E^2$ is the first half of the EM wave energy content — plant the seed for Ch. 24.
