# Chapter 22: Introduction to Magnetism
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Magnetic dipoles, Lorentz force, Biot-Savart law as a current integral, Ampère's law in integral form, magnetic flux as a surface integral, force on current-carrying conductors, torque on current loops, Hall effect.

---

## Overview

Chapter 22 establishes magnetism as a phenomenon arising from electric currents — moving charges. At the field-theory level, this is encoded in Maxwell's equations: the Biot-Savart law and Ampère's law (both derived from $\nabla \times \vec{B} = \mu_0\vec{J}$) tell us how currents source $\vec{B}$, while Gauss's law for magnetism ($\nabla \cdot \vec{B} = 0$, i.e., $\oint\vec{B}\cdot d\vec{A} = 0$) tells us that magnetic monopoles do not exist.

**Core insight**: All magnetism arises from electric currents (orbital and spin). Magnetic field lines always form closed loops — there are no magnetic charges.

---

## Concept Nodes

---

### 22.1 — Magnetic Dipole

- **id**: `magnetic-dipole`
- **title**: Magnetic Dipole
- **formula**: $\vec{\mu} = I A \hat{n} = \frac{1}{2}\int \vec{r} \times \vec{J} \, dV$

**principle**: The magnetic dipole moment $\vec{\mu}$ is the fundamental quantity characterizing a localized current distribution's magnetic character. For a planar current loop of area $A$ carrying current $I$: $\vec{\mu} = IA\hat{n}$ where $\hat{n}$ is the normal by the right-hand rule. For a general current distribution: $\vec{\mu} = \frac{1}{2}\int \vec{r} \times \vec{J} \, dV$. Unlike electric dipoles (which can be decomposed into two monopoles), magnetic dipoles cannot — magnetic monopoles have never been observed, and $\nabla \cdot \vec{B} = 0$ forbids them.

The far field of a magnetic dipole: $\vec{B}_{\text{far}} \sim \frac{\mu_0}{4\pi}\frac{\mu}{r^3}$ (same angular dependence as electric dipole, falls off faster than $1/r^2$).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{\mu}$ | response — magnetic dipole moment | A·m² |
| $I$ | driver — current in loop | A |
| $A$ | parameter — loop area | m² |
| $\hat{n}$ | parameter — normal to loop | dimensionless |

**causal-structure**: asymmetric — current (driver) produces the magnetic moment (response).

**limits**: Dipole approximation valid at distances $r \gg$ size of current loop.

**misconceptions**:
- "Magnetic dipoles can be split into monopoles" — breaking a magnet always produces two dipoles; $\nabla \cdot \vec{B} = 0$ is absolute.

**prereqs**:
- `electric-dipole` (lateral, 0.2)
- `electric-current` (foundational, 0.85)

---

### 22.2 — Ferromagnetism and Magnetic Domains

- **id**: `ferromagnetism`
- **title**: Ferromagnetism, Domains, and Curie Temperature
- **formula**: $\vec{B} = \mu_0(\vec{H} + \vec{M}) = \mu_0\mu_r\vec{H}$ (linear approximation in unsaturated regime)

**principle**: Ferromagnetic materials (Fe, Ni, Co) have quantum mechanical exchange interactions that align neighboring electron spins over macroscopic regions called **domains**. Each domain has a net $\vec{M}$ (magnetization = magnetic dipole moment per unit volume). When domain walls align under an external $\vec{H}$, the material acquires a large net $\vec{B}$. The relative permeability $\mu_r = B/(\mu_0 H)$ can reach $10^3$–$10^5$ in soft iron. Above the Curie temperature $T_C$, thermal energy destroys alignment and the material becomes paramagnetic.

**causal-structure**: asymmetric — applied field $\vec{H}$ (driver) aligns domains (response $\vec{M}$); hysteresis means response is history-dependent.

**limits**: Linear approximation ($\vec{B} = \mu_0\mu_r\vec{H}$) fails at high $H$ (saturation). Hysteresis: $\vec{M}$ lags $\vec{H}$ for AC fields; energy is dissipated per cycle (hysteresis losses in transformer cores).

**prereqs**:
- `magnetic-dipole` (foundational, 0.85)
- Statistical mechanics / thermal energy scales (lateral, 0.2)

---

### 22.3 — Magnetic Field and Field Lines

- **id**: `magnetic-field`
- **title**: Magnetic Field $\vec{B}$ and Its Sources
- **formula**: Gauss's law for magnetism:
$$\oint_{\partial V} \vec{B} \cdot d\vec{A} = 0$$
Differential form: $\nabla \cdot \vec{B} = 0$

**principle**: The magnetic field $\vec{B}$ is a vector field sourced by electric currents (and, at the quantum level, by intrinsic spin). The defining equation $\nabla \cdot \vec{B} = 0$ states that $\vec{B}$ has no divergence — field lines have no beginning or end; they form closed loops. This is the magnetic analogue of Gauss's law for $\vec{E}$, but with zero on the right-hand side (no magnetic charge). The curl of $\vec{B}$ is sourced by current: $\nabla \times \vec{B} = \mu_0\vec{J}$ (Ampère's law, static case).

**causal-structure**: asymmetric — currents and moving charges source $\vec{B}$; $\vec{B}$ exerts forces on other currents and moving charges.

**limits**: $\nabla \cdot \vec{B} = 0$ is exact — no exceptions observed (searches for magnetic monopoles ongoing). Ampère's law in static form requires the displacement current correction for time-varying fields (Maxwell's completion → Ch. 24).

**prereqs**:
- `gauss-law` (lateral, 0.2 — structural analogy, different physics)
- `electric-field` (lateral, 0.2)
- Divergence theorem (foundational, 0.85)

---

### 22.4 — Lorentz Force (Magnetic Component)

- **id**: `lorentz-force-magnetic`
- **title**: Lorentz Force — Magnetic Component
- **formula**:
$$\vec{F} = q\vec{v} \times \vec{B}$$
Magnitude: $F = qvB\sin\theta$

**principle**: A charge $q$ moving with velocity $\vec{v}$ in a field $\vec{B}$ experiences a force perpendicular to both $\vec{v}$ and $\vec{B}$. Key consequences: (1) No work done ($\vec{F} \perp \vec{v}$ always → kinetic energy unchanged; only direction changes). (2) In a uniform $\vec{B}$, a charge moving perpendicular to $\vec{B}$ undergoes uniform circular motion with radius $r = mv/(qB)$ and cyclotron angular frequency $\omega_c = qB/m$ (independent of speed — key to cyclotron operation). (3) If $\vec{v}$ has both $\perp$ and $\parallel$ components, motion is helical.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{F}$ | response — magnetic force | N |
| $q$ | parameter — charge | C |
| $\vec{v}$ | driver — velocity | m/s |
| $\vec{B}$ | driver — magnetic field | T |
| $\theta$ | parameter — angle between $\vec{v}$ and $\vec{B}$ | rad |

**causal-structure**: asymmetric — $\vec{v}$ and $\vec{B}$ jointly drive $\vec{F}$; the cross product encodes both magnitude and direction.

**limits**: Non-relativistic ($v \ll c$). At relativistic speeds, replace $m$ with $\gamma m$ and $\vec{p}$ replaces $m\vec{v}$.

**misconceptions**:
- "The magnetic force accelerates the particle in its direction of motion" — $\vec{F} \perp \vec{v}$ always; it changes direction, never speed.
- "Magnetic force does work" — it does not ($W = \int \vec{F} \cdot d\vec{l} = 0$ since $\vec{F} \perp d\vec{l}$).

**prereqs**:
- `electric-charge` (foundational, 0.85)
- `magnetic-field` (foundational, 0.85)
- Vector cross product (foundational, 0.85)

---

### 22.5 — Circular Motion and Applications

- **id**: `circular-motion-magnetic-field`
- **title**: Charged Particle Motion in a Magnetic Field
- **formula**:
$$r = \frac{mv}{|q|B} \quad \text{(Larmor/cyclotron radius)}$$
$$\omega_c = \frac{|q|B}{m} \quad \text{(cyclotron angular frequency)}$$
$$T = \frac{2\pi m}{|q|B} \quad \text{(cyclotron period — independent of } v\text{)}$$

**principle**: For $\vec{v} \perp \vec{B}$: magnetic force = centripetal force, $qvB = mv^2/r$, giving $r = mv/(qB)$. The cyclotron period $T = 2\pi r / v = 2\pi m/(qB)$ is independent of speed — this is cyclotron resonance, and it is why cyclotrons work. For velocity with components both $\perp$ and $\parallel$ to $\vec{B}$: the perpendicular component circles (radius $r = mv_\perp/(qB)$), the parallel component drifts uniformly → helical trajectory (pitch $= v_\parallel T$).

**causal-structure**: asymmetric — $\vec{B}$ and particle properties ($m$, $q$, $v$) determine the trajectory.

**limits**: Relativistic correction: $r = \gamma mv/(qB)$; cyclotron frequency drops with energy → requires synchrotron (variable-frequency RF or larger radius). Helical paths become complicated in non-uniform fields.

**prereqs**:
- `lorentz-force-magnetic` (foundational, 0.85)
- Uniform circular motion and centripetal acceleration (foundational, 0.85)

---

### 22.6 — Hall Effect

- **id**: `hall-effect`
- **title**: Hall Effect
- **formula**:
$$V_H = \frac{BI}{ned}$$
Hall coefficient: $R_H = \frac{1}{ne}$ (for a single carrier type)

**principle**: In a current-carrying conductor in a perpendicular magnetic field $\vec{B}$, the Lorentz force deflects drifting charge carriers to one side. Charges accumulate until the transverse electric force $eE_H$ balances the magnetic force $ev_dB$: equilibrium gives $E_H = v_d B$. Since $J = nev_d$ and $V_H = E_H d$, the Hall voltage $V_H = BI/(ned)$. The *sign* of $V_H$ reveals whether carriers are positive or negative — it is how we established that electrons carry current in metals and that "holes" carry current in p-type semiconductors.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $V_H$ | response — Hall voltage | V |
| $B$ | driver — magnetic field | T |
| $I$ | driver — current | A |
| $n$ | parameter — carrier density | m⁻³ |
| $e$ | parameter — carrier charge | C |
| $d$ | parameter — conductor thickness (in $\vec{B}$ direction) | m |

**causal-structure**: asymmetric — $\vec{B}$ and drift velocity jointly drive charge separation; equilibrium Hall voltage is the response.

**prereqs**:
- `lorentz-force-magnetic` (foundational, 0.85)
- `drift-velocity` (foundational, 0.85)

---

### 22.7 — Magnetic Force on a Current-Carrying Conductor

- **id**: `magnetic-force-current-conductor`
- **title**: Magnetic Force on a Current-Carrying Conductor
- **formula**:
For a straight segment: $\vec{F} = I\vec{L} \times \vec{B}$

For an arbitrary current path:
$$\vec{F} = I \int_{\text{path}} d\vec{l} \times \vec{B}$$

In terms of current density (most general):
$$d\vec{F} = (\vec{J} \times \vec{B}) \, dV$$

**principle**: The force on a conductor arises from the Lorentz force on each charge carrier; summing over all carriers in volume element $dV$ gives the body force density $\vec{J} \times \vec{B}$ (N/m³). Integrating over the conductor volume gives the total force. For a straight segment of length $L$ in a uniform field: $F = BIL\sin\theta$. For two parallel wires carrying currents $I_1$ and $I_2$ separated by distance $d$: $F/L = \mu_0 I_1 I_2 / (2\pi d)$ (attractive if same direction, repulsive if opposite). This force *defined* the ampere until the 2019 SI redefinition.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $d\vec{F}$ | response — force element | N |
| $I$ | driver — current | A |
| $d\vec{l}$ | parameter — path element (in direction of current) | m |
| $\vec{B}$ | driver — magnetic field | T |
| $\vec{J}$ | driver — current density | A/m² |

**causal-structure**: asymmetric — current (or $\vec{J}$) in field $\vec{B}$ drives force; the cross product determines direction.

**limits**: Force zero if current is parallel to $\vec{B}$. Force maximum when $I \perp \vec{B}$.

**prereqs**:
- `lorentz-force-magnetic` (foundational, 0.85)
- `electric-current` (foundational, 0.85)
- Vector cross product, line/volume integrals (foundational, 0.85)

---

### 22.8 — Torque on a Current Loop; Magnetic Dipole in a Field

- **id**: `torque-current-loop`
- **title**: Torque on a Current Loop; Magnetic Dipole Energy
- **formula**:
$$\vec{\tau} = \vec{\mu} \times \vec{B} = \mu B\sin\theta \, \hat{\tau}$$
$$U = -\vec{\mu} \cdot \vec{B}$$

**principle**: A current loop with dipole moment $\vec{\mu} = NIA\hat{n}$ in a field $\vec{B}$ experiences torque $\vec{\tau} = \vec{\mu} \times \vec{B}$ tending to align $\vec{\mu}$ with $\vec{B}$ (minimize $U = -\vec{\mu}\cdot\vec{B}$). This is the torque basis of galvanometers and DC motors. At equilibrium ($\theta = 0$), $\tau = 0$ and $U$ is minimum. The torque is due to equal and opposite forces on opposite sides of the loop — net force on the loop is zero in a *uniform* field, but torque is nonzero. In a non-uniform field, there is also a net force $\vec{F} = \nabla(\vec{\mu}\cdot\vec{B})$ — this is how atomic magnetic moments are sorted in a Stern-Gerlach experiment.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{\tau}$ | response — torque | N·m |
| $\vec{\mu} = NIA\hat{n}$ | driver — magnetic dipole moment | A·m² |
| $\vec{B}$ | driver — magnetic field | T |
| $U = -\vec{\mu}\cdot\vec{B}$ | conserved — potential energy | J |

**causal-structure**: asymmetric — $\vec{B}$ and $\vec{\mu}$ jointly drive $\vec{\tau}$; the cross product gives direction (toward alignment).

**prereqs**:
- `magnetic-force-current-conductor` (foundational, 0.85)
- `magnetic-dipole` (foundational, 0.85)
- Torque and rotational mechanics (foundational, 0.85)

---

### 22.9 — Biot-Savart Law

- **id**: `biot-savart-law`
- **title**: Biot-Savart Law
- **formula**:
$$d\vec{B} = \frac{\mu_0}{4\pi} \frac{I \, d\vec{l} \times \hat{r}}{r^2}$$
$$\vec{B}(\vec{r}) = \frac{\mu_0}{4\pi} \int \frac{I \, d\vec{l}' \times (\vec{r} - \vec{r}\,')}{|\vec{r} - \vec{r}\,'|^3}$$

**principle**: The Biot-Savart law is the magnetic analogue of Coulomb's law — it gives the $\vec{B}$ field contribution from each current element $I \, d\vec{l}$. The cross product means: (1) field is perpendicular to both the current direction and the displacement vector; (2) field is zero in the current direction; (3) direction follows the right-hand rule. Total field is the vector integral over the entire current path. Biot-Savart is derived from $\nabla \times \vec{B} = \mu_0\vec{J}$ (Ampère's law in differential form) using the vector potential $\vec{A}$ where $\vec{B} = \nabla \times \vec{A}$.

Key results computed from Biot-Savart:
- Center of circular loop: $B = \mu_0 I / (2R)$
- Axis of circular loop: $B = \frac{\mu_0 I R^2}{2(R^2+z^2)^{3/2}}$
- Long straight wire: $B = \mu_0 I/(2\pi r)$ (also from Ampère's law)

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{B}$ | response — magnetic field | T |
| $I \, d\vec{l}'$ | driver — current element | A·m |
| $\vec{r} - \vec{r}'$ | parameter — displacement from element to field point | m |
| $\mu_0 = 4\pi \times 10^{-7}$ T·m/A | parameter — permeability of free space | T·m/A |

**causal-structure**: asymmetric — current distribution drives $\vec{B}$.

**limits**: Valid for steady currents (magnetostatics). More general than Ampère's law but requires integration; Ampère's law is more efficient for symmetric distributions.

**prereqs**:
- `magnetic-field` (foundational, 0.85)
- `lorentz-force-magnetic` (foundational, 0.85)
- Vector cross product, line integrals (foundational, 0.85)
- `coulombs-law` (lateral, 0.2 — structural analogy)

---

### 22.10 — Ampère's Law

- **id**: `ampere-law`
- **title**: Ampère's Law (Integral Form)
- **formula**:
$$\oint_{\mathcal{C}} \vec{B} \cdot d\vec{l} = \mu_0 I_{\text{enc}} = \mu_0 \int_{\mathcal{S}} \vec{J} \cdot d\vec{A}$$
Differential form: $\nabla \times \vec{B} = \mu_0 \vec{J}$

**principle**: The circulation of $\vec{B}$ around any closed loop $\mathcal{C}$ equals $\mu_0$ times the total current threading through any surface $\mathcal{S}$ bounded by $\mathcal{C}$. This is the magnetic analogue of Gauss's law for $\vec{E}$ — powerful for symmetric current distributions where $|\vec{B}|$ is constant on the chosen loop and $\vec{B} \parallel d\vec{l}$. The differential form ($\nabla \times \vec{B} = \mu_0\vec{J}$) is one of Maxwell's four equations (static limit).

Strategy: choose an Amperian loop that matches the symmetry of the current distribution (circle for line/solenoid, rectangle for sheet) → pull $B$ out of the integral → solve for $B$.

Canonical results:
- Long straight wire: $B = \mu_0 I/(2\pi r)$ (circular loops)
- Infinite solenoid: $B_{\text{inside}} = \mu_0 nI$, $B_{\text{outside}} = 0$ (rectangular loop)
- Toroid: $B = \mu_0 NI/(2\pi r)$ (inside); $B = 0$ (outside)

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{B}$ | response — magnetic field | T |
| $I_{\text{enc}} = \int \vec{J} \cdot d\vec{A}$ | driver — enclosed current | A |
| $d\vec{l}$ | parameter — line element along Amperian loop | m |
| $\mu_0$ | parameter — permeability of free space | T·m/A |

**causal-structure**: contextual — enclosed current drives the circulation of $\vec{B}$. For symmetric configurations, this is effectively asymmetric: $I_{\text{enc}}$ → $B$.

**limits**: Static form valid for DC; requires Maxwell's displacement current correction for AC (→ Ch. 24). Powerful only when symmetry makes $B$ constant on the loop; otherwise Biot-Savart is needed.

**misconceptions**:
- "Ampère's law only works for circular loops" — any closed loop works; the choice of loop is computational strategy.
- "The field on the loop is only from the enclosed current" — the field from *all* sources is on the loop; only the *circulation* is determined by enclosed current.
- "Ampère's law and Biot-Savart are separate laws" — they are two forms of the same content ($\nabla \times \vec{B} = \mu_0\vec{J}$): Biot-Savart is the particular solution, Ampère is the integral form.

**prereqs**:
- `biot-savart-law` (supporting, 0.55)
- `magnetic-field` (foundational, 0.85)
- `gauss-law` (lateral, 0.2 — structural analogy)
- Stokes' theorem (foundational, 0.85)

---

## Summary of Core Principles

1. **$\nabla \cdot \vec{B} = 0$**: No magnetic monopoles; field lines form closed loops.
2. **Biot-Savart**: Current distribution sources $\vec{B}$ via vector integral.
3. **Ampère's law**: $\oint \vec{B} \cdot d\vec{l} = \mu_0 I_{\text{enc}}$ — circulation of $\vec{B}$ = enclosed current × $\mu_0$.
4. **Lorentz force**: $\vec{F} = q\vec{v} \times \vec{B}$ — always perpendicular to motion; does no work.
5. **Circular/helical motion**: Larmor radius $r = mv_\perp/(qB)$; cyclotron frequency $\omega_c = qB/m$ (speed-independent).
6. **Force on conductor**: $d\vec{F} = I\,d\vec{l} \times \vec{B}$ (or $d\vec{F} = \vec{J}\times\vec{B}\,dV$).
7. **Dipole in field**: $\vec{\tau} = \vec{\mu}\times\vec{B}$, $U = -\vec{\mu}\cdot\vec{B}$.
8. **Hall effect**: $V_H = BI/(ned)$ — reveals carrier sign and density.

## Key Formulas

| Formula | Description | Units |
|---------|-------------|-------|
| $\vec{F} = q\vec{v} \times \vec{B}$ | Lorentz force | N |
| $r = mv/(qB)$ | Larmor radius | m |
| $\omega_c = qB/m$ | Cyclotron frequency | rad/s |
| $d\vec{B} = \frac{\mu_0 I}{4\pi}\frac{d\vec{l}\times\hat{r}}{r^2}$ | Biot-Savart | T |
| $\oint\vec{B}\cdot d\vec{l} = \mu_0 I_{\text{enc}}$ | Ampère's law | — |
| $\nabla\cdot\vec{B} = 0$ | No monopoles | — |
| $B = \mu_0 nI$ (solenoid) | Solenoid field | T |
| $\vec{F} = I\int d\vec{l}\times\vec{B}$ | Force on conductor | N |
| $\vec{\tau} = \vec{\mu}\times\vec{B}$ | Torque on dipole | N·m |
| $V_H = BI/(ned)$ | Hall voltage | V |

## Instructor Notes (PHY 132 / Advanced Track)

The deepest conceptual payoff in Ch. 22: Biot-Savart and Ampère's law are both expressions of $\nabla \times \vec{B} = \mu_0\vec{J}$. Just as Gauss's law and Coulomb's law are both expressions of $\nabla \cdot \vec{E} = \rho/\varepsilon_0$, the choice between them is a matter of symmetry and computational convenience. Students should be able to recognize when Ampère's law is more efficient (cylindrical/planar symmetry) versus when Biot-Savart is required (arbitrary geometry). The force on parallel wires and the definition of the ampere is a good calibration exercise ($F/L = \mu_0 I_1 I_2 / 2\pi d$). The torque formula $\vec{\tau} = \vec{\mu}\times\vec{B}$ is the seed for: NMR/MRI (precessing nuclear spins), electron spin resonance, magnetic domain switching, and all motor/generator technology.
