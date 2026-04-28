# Chapter 24: Electromagnetic Waves
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Maxwell's four equations in integral form, the displacement current, the wave equation derived from Maxwell's equations, plane wave solutions, speed of light from first principles, energy transport (Poynting vector), radiation pressure, the electromagnetic spectrum.

---

## Overview

Chapter 24 is the synthesis. Maxwell's equations in their complete form predict that oscillating electric and magnetic fields propagate through vacuum at speed $c = 1/\sqrt{\mu_0\varepsilon_0}$. The fact that this matches the measured speed of light revealed that light *is* an electromagnetic wave — one of the greatest unifications in the history of physics.

**Core insight**: Faraday's law ($\nabla\times\vec{E} = -\partial\vec{B}/\partial t$) and the Ampère-Maxwell law ($\nabla\times\vec{B} = \mu_0\varepsilon_0\partial\vec{E}/\partial t$ in vacuum) mutually sustain each other: a changing $\vec{B}$ induces $\vec{E}$, whose change in turn induces $\vec{B}$. This feedback propagates at $c$.

---

## Concept Nodes

---

### 24.1 — Maxwell's Four Equations

- **id**: `maxwell-equations`
- **title**: Maxwell's Four Equations (Integral Form)
- **formula**:
$$\text{(1) Gauss: } \oint_{\partial V} \vec{E} \cdot d\vec{A} = \frac{Q_{\text{enc}}}{\varepsilon_0}$$
$$\text{(2) No monopoles: } \oint_{\partial V} \vec{B} \cdot d\vec{A} = 0$$
$$\text{(3) Faraday: } \oint_{\partial\mathcal{S}} \vec{E} \cdot d\vec{l} = -\frac{d}{dt}\int_{\mathcal{S}} \vec{B} \cdot d\vec{A}$$
$$\text{(4) Ampère-Maxwell: } \oint_{\partial\mathcal{S}} \vec{B} \cdot d\vec{l} = \mu_0\int_{\mathcal{S}} \vec{J} \cdot d\vec{A} + \mu_0\varepsilon_0\frac{d}{dt}\int_{\mathcal{S}} \vec{E} \cdot d\vec{A}$$

Differential (local) forms:
$$\nabla\cdot\vec{E} = \frac{\rho}{\varepsilon_0}, \quad \nabla\cdot\vec{B} = 0, \quad \nabla\times\vec{E} = -\frac{\partial\vec{B}}{\partial t}, \quad \nabla\times\vec{B} = \mu_0\vec{J} + \mu_0\varepsilon_0\frac{\partial\vec{E}}{\partial t}$$

**principle**: Maxwell's equations are the complete classical description of electromagnetism. Each equation has a clear physical interpretation:

1. **Gauss's law**: Electric field diverges from charges. Charges source $\vec{E}$.
2. **No magnetic monopoles**: Magnetic field has no divergence — field lines close on themselves.
3. **Faraday's law**: A changing $\vec{B}$ field has curl — it drives circulation of $\vec{E}$ (electromagnetic induction).
4. **Ampère-Maxwell law**: A current *and* a changing $\vec{E}$ field drive circulation of $\vec{B}$. Maxwell's addition ($\mu_0\varepsilon_0\partial\vec{E}/\partial t$, the displacement current) is the key: it closes the system and enables wave propagation.

Together, these four equations contain all of classical electromagnetism: statics, magnetostatics, induction, and wave propagation.

**causal-structure**: contextual — charges and currents source fields; fields then exert forces on charges (via Lorentz force $\vec{F} = q(\vec{E} + \vec{v}\times\vec{B})$). The full system is self-consistent and mutually coupled.

**limits**: Classical (non-quantum). Quantum electrodynamics (QED) is the quantum version. In matter, introduce $\vec{D} = \varepsilon\vec{E}$ and $\vec{H} = \vec{B}/\mu$.

**misconceptions**:
- "Maxwell's equations are just a summary of Coulomb's and Ampère's laws" — they include new physics: the displacement current term in (4) has no classical precursor and is essential for wave propagation.
- "The equations are symmetric in $\vec{E}$ and $\vec{B}$" — *almost* symmetric, but the asymmetry is (i) electric charges exist ($\rho \neq 0$), magnetic monopoles do not ($= 0$); (ii) the sign difference in the curl equations encodes electromagnetic wave chirality.

**prereqs**:
- `gauss-law` from Ch. 18 (foundational, 1.0 — definitional)
- `ampere-law` from Ch. 22 (foundational, 1.0 — definitional)
- `faraday-law` from Ch. 23 (foundational, 1.0 — definitional)
- Divergence and Stokes' theorems (foundational, 0.85)

---

### 24.2 — Displacement Current

- **id**: `displacement-current`
- **title**: Displacement Current (Maxwell's Addition)
- **formula**:
$$I_{\text{disp}} = \varepsilon_0\frac{d\Phi_E}{dt} = \varepsilon_0\frac{d}{dt}\int_{\mathcal{S}}\vec{E}\cdot d\vec{A}$$

Complete Ampère-Maxwell law: $\oint\vec{B}\cdot d\vec{l} = \mu_0(I_{\text{enc}} + I_{\text{disp}})$

**principle**: Maxwell noticed an inconsistency in the original Ampère's law: for a circuit charging a capacitor, the current $I$ flows in the wire but not between the plates — yet $\vec{B}$ must be the same whether you choose the flat surface (through the wire) or the bulging surface (between the plates). Maxwell resolved this by adding the displacement current $I_{\text{disp}} = \varepsilon_0\,d\Phi_E/dt$: even without physical charge flow, a changing electric flux acts as a source of $\vec{B}$. In the gap between capacitor plates: $I_{\text{disp}} = \varepsilon_0 A\,dE/dt = \varepsilon_0 A (1/\varepsilon_0)\,d\sigma/dt = I$ (consistent). The displacement current is essential for wave propagation in vacuum: no current, but $\partial\vec{E}/\partial t \neq 0$ sources $\vec{B}$, which sources $\partial\vec{E}/\partial t$, and so on.

**causal-structure**: asymmetric — changing $\vec{E}$ flux is the driver; induced circulation of $\vec{B}$ is the response.

**limits**: "Displacement current" is a mathematical current density ($J_{\text{disp}} = \varepsilon_0\partial\vec{E}/\partial t$, units A/m²) — no charge physically moves. The name is historical and somewhat misleading.

**misconceptions**:
- "Displacement current requires charge to flow" — no physical charge moves; it is a field quantity.
- "Displacement current is small compared to conduction current" — in vacuum (no conduction current), it is the *only* source of magnetic field in Ampère's law.

**prereqs**:
- `maxwell-equations` (foundational, 0.85)
- `capacitance` from Ch. 19 (supporting, 0.55)
- `ampere-law` from Ch. 22 (foundational, 0.85)

---

### 24.3 — The Wave Equation and Speed of Light

- **id**: `em-wave-equation`
- **title**: Wave Equation from Maxwell's Equations; Speed of Light
- **formula**:
Taking the curl of Faraday's law and substituting Ampère-Maxwell (in vacuum, $\vec{J} = 0$, $\rho = 0$):

$$\nabla^2\vec{E} = \mu_0\varepsilon_0\frac{\partial^2\vec{E}}{\partial t^2}$$
$$\nabla^2\vec{B} = \mu_0\varepsilon_0\frac{\partial^2\vec{B}}{\partial t^2}$$

This is the wave equation $\nabla^2 f = (1/v^2)\partial^2 f/\partial t^2$ with:

$$c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = \frac{1}{\sqrt{(4\pi\times10^{-7})(8.85\times10^{-12})}} \approx 3.00 \times 10^8 \text{ m/s}$$

**principle**: Maxwell derived the wave equation by taking $\nabla\times(\nabla\times\vec{E}) = -\nabla\times(\partial\vec{B}/\partial t)$ and using $\nabla\times\vec{B} = \mu_0\varepsilon_0\partial\vec{E}/\partial t$ (in vacuum). With the vector identity $\nabla\times(\nabla\times\vec{E}) = \nabla(\nabla\cdot\vec{E}) - \nabla^2\vec{E}$ and $\nabla\cdot\vec{E} = 0$ (vacuum, no charges), this gives $\nabla^2\vec{E} = \mu_0\varepsilon_0\ddot{\vec{E}}$. The wave speed emerging from purely electromagnetic constants $\mu_0$ (defined by magnetic force between wires) and $\varepsilon_0$ (defined by electrostatic force) matching the measured speed of light was the decisive evidence that *light is an electromagnetic wave*.

**causal-structure**: symmetric — the wave equation is self-sustained: changing $\vec{E}$ induces $\vec{B}$ (Faraday), and changing $\vec{B}$ induces $\vec{E}$ (Ampère-Maxwell). Neither field is the primary driver; they mutually sustain each other.

**limits**: $c = 1/\sqrt{\mu_0\varepsilon_0}$ is the speed in vacuum. In a medium with permittivity $\varepsilon = \kappa\varepsilon_0$ and permeability $\mu = \mu_r\mu_0$: $v = c/\sqrt{\kappa\mu_r} = c/n$ where $n$ is the index of refraction.

**prereqs**:
- `maxwell-equations` (foundational, 0.85)
- `faraday-law` from Ch. 23 (foundational, 0.85)
- `displacement-current` (foundational, 0.85)
- Wave equation and wave kinematics (foundational, 0.85)

---

### 24.4 — Plane Wave Solutions

- **id**: `em-plane-wave`
- **title**: Electromagnetic Plane Wave Solution
- **formula**:
$$\vec{E}(x,t) = E_0\sin(kx - \omega t)\,\hat{y}$$
$$\vec{B}(x,t) = \frac{E_0}{c}\sin(kx - \omega t)\,\hat{z}$$

Amplitude ratio: $E_0/B_0 = c$

Dispersion: $\omega = ck$, $f = c/\lambda$, $k = 2\pi/\lambda$, $\omega = 2\pi f$

**principle**: The plane wave is the simplest solution to the EM wave equation in vacuum. Key properties that follow directly from Maxwell's equations:
1. **Transverse**: Both $\vec{E}$ and $\vec{B}$ are perpendicular to the direction of propagation ($\hat{x}$). EM waves cannot be longitudinal in vacuum.
2. **Mutually perpendicular**: $\vec{E} \perp \vec{B}$ at all times and positions.
3. **In phase**: $\vec{E}$ and $\vec{B}$ oscillate in phase (both zero and both maximum at the same time/place).
4. **Fixed amplitude ratio**: $E_0 = cB_0$ everywhere.
5. **Propagation direction**: $\hat{E} \times \hat{B} = \hat{k}$ (propagation direction given by the cross product).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $E_0, B_0 = E_0/c$ | parameter — field amplitudes | V/m, T |
| $k = 2\pi/\lambda$ | parameter — wave number | m⁻¹ |
| $\omega = 2\pi f$ | parameter — angular frequency | rad/s |
| $c = \omega/k$ | parameter — phase velocity | m/s |

**causal-structure**: symmetric — both fields sustain each other; neither is the "driver."

**limits**: Plane wave applies to far-field radiation. Near a source, the field structure is more complex. In a medium with $n > 1$: replace $c$ with $v = c/n$ and $B_0 = E_0 n/c$.

**prereqs**:
- `em-wave-equation` (foundational, 0.85)
- Sinusoidal wave kinematics (foundational, 0.85)

---

### 24.5 — Energy in EM Waves: The Poynting Vector

- **id**: `poynting-vector`
- **title**: Poynting Vector and EM Wave Energy Transport
- **formula**:
$$\vec{S} = \frac{1}{\mu_0}\vec{E}\times\vec{B} \quad \text{[W/m}^2\text{]}$$

Total EM energy density (in vacuum):
$$u = u_E + u_B = \frac{1}{2}\varepsilon_0 E^2 + \frac{B^2}{2\mu_0}$$

In a plane wave ($E = cB$): $u_E = u_B$, so $u = \varepsilon_0 E^2$

Magnitude of Poynting vector: $S = uc = \varepsilon_0 cE^2 = E^2/(\mu_0 c)$

Time-averaged intensity (sinusoidal wave):
$$I_{\text{avg}} = \langle S \rangle = \frac{1}{2}\varepsilon_0 c E_0^2 = \frac{E_0^2}{2\mu_0 c}$$

**principle**: The Poynting vector $\vec{S}$ represents the directional energy flux of an EM wave — power per unit area flowing in the direction of propagation. It is derived from the energy conservation equation for electromagnetic fields (Poynting's theorem):

$$\frac{\partial u}{\partial t} + \nabla\cdot\vec{S} = -\vec{J}\cdot\vec{E}$$

which states: rate of change of field energy density + divergence of energy flux = negative of work done on charges (power delivered to matter). In vacuum ($\vec{J} = 0$): $\partial u/\partial t + \nabla\cdot\vec{S} = 0$ — field energy is conserved and flows with flux $\vec{S}$. In a plane wave, $u_E = u_B$ exactly (energy is equally partitioned between electric and magnetic fields).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{S}$ | response — Poynting vector (energy flux) | W/m² |
| $\vec{E}, \vec{B}$ | driver — field amplitudes | V/m, T |
| $u$ | conserved — electromagnetic energy density | J/m³ |
| $I_{\text{avg}}$ | response — time-averaged intensity | W/m² |

**causal-structure**: asymmetric — field amplitudes drive the energy flux; the direction of $\vec{S}$ is $\hat{E}\times\hat{B}$ (the propagation direction).

**limits**: Poynting's theorem applies everywhere, not just in waves — including inside a wire carrying DC current (the energy flows from the field into the wire, not through the wire itself). Relativistic: $\vec{S}/c^2$ is the electromagnetic momentum density.

**misconceptions**:
- "Energy flows through the wire in a DC circuit" — in a DC circuit, $\vec{S}$ points *into* the wire from the surrounding field, not along the wire. Energy is transported in the fields, not the charges.
- "Only one field (E or B) carries the energy" — both fields carry equal energy in a plane wave ($u_E = u_B$).

**prereqs**:
- `em-plane-wave` (foundational, 0.85)
- `capacitor-energy` from Ch. 19 (supporting, 0.55 — source of $u_E = \frac{1}{2}\varepsilon_0 E^2$)
- `self-inductance` from Ch. 23 (supporting, 0.55 — source of $u_B = B^2/2\mu_0$)
- Vector cross product, energy conservation (foundational, 0.85)

---

### 24.6 — Radiation Pressure

- **id**: `radiation-pressure`
- **title**: Radiation Pressure
- **formula**:
For absorbed radiation: $P_{\text{rad}} = I/c = S/c$

For reflected radiation: $P_{\text{rad}} = 2I/c$ (momentum reversed)

EM momentum density: $\vec{g} = \vec{S}/c^2 = \varepsilon_0(\vec{E}\times\vec{B})$

**principle**: Electromagnetic waves carry momentum as well as energy. When radiation is absorbed by a surface, the momentum transfer per unit area per unit time is $I/c$ (Newton's second law for photons: $p = E/c$ per photon, so momentum flux = energy flux / $c$). When reflected, momentum is reversed and the pressure doubles. Radiation pressure is tiny for ordinary light ($\sim 10^{-6}$ Pa in sunlight) but is exploited in optical tweezers, laser cooling, and solar sail spacecraft.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $P_{\text{rad}}$ | response — radiation pressure | Pa = N/m² |
| $I$ | driver — time-averaged intensity | W/m² |
| $c$ | parameter — speed of light | m/s |
| $\vec{g} = \vec{S}/c^2$ | response — momentum density | kg/(m²·s) |

**causal-structure**: asymmetric — radiation intensity drives momentum transfer to surface.

**limits**: Classical derivation gives same result as quantum (photon momentum $p = E/c = hf/c = h/\lambda$). Polarization effects modify angular momentum transfer but not linear pressure.

**prereqs**:
- `poynting-vector` (foundational, 0.85)
- Momentum conservation (foundational, 0.85)

---

### 24.7 — Radiation from Accelerating Charges

- **id**: `larmor-radiation`
- **title**: Radiation from Accelerating Charges (Larmor Formula)
- **formula**:
$$P = \frac{\mu_0 q^2 a^2}{6\pi c} = \frac{q^2 a^2}{6\pi\varepsilon_0 c^3}$$
(Larmor formula, non-relativistic)

**principle**: An accelerating charge radiates electromagnetic energy. The radiated power scales as $q^2 a^2$ — the source of radiation is the time-varying current (or dipole moment) produced by the acceleration. Consequences:
- An electron in a circular orbit radiates (→ classical atoms are unstable → quantum mechanics necessary).
- An antenna (oscillating current → oscillating dipole $\ddot{p} = q a$) radiates efficiently.
- Synchrotron radiation: relativistic electrons in circular paths radiate copiously (medical/materials imaging).
- Bremsstrahlung: decelerating electrons produce X-rays (medical X-ray tubes).
- The radiation pattern of an oscillating dipole: intensity $\propto \sin^2\theta$ (maximum perpendicular to acceleration, zero along acceleration axis).

**causal-structure**: asymmetric — acceleration of charge is the driver; radiated power and field are the response.

**limits**: Larmor formula is non-relativistic ($v \ll c$). Relativistic generalization: $P = \frac{\mu_0 q^2 \gamma^4}{6\pi c}(a_\perp^2 + \gamma^2 a_\parallel^2)$ where $a_\perp, a_\parallel$ are perpendicular and parallel to $\vec{v}$. For circular motion ($a_\parallel = 0$): $P \propto \gamma^4$.

**misconceptions**:
- "Moving charges radiate" — only *accelerating* charges radiate. Constant velocity → no radiation.
- "Larger charge always radiates more" — power scales as $q^2 a^2$; a tiny charge with large $a$ can radiate more than a large charge with small $a$.

**prereqs**:
- `em-plane-wave` (supporting, 0.55)
- `lorentz-force-magnetic` from Ch. 22 (supporting, 0.55)
- `circular-motion-magnetic-field` from Ch. 22 (lateral, 0.2)

---

### 24.8 — The Electromagnetic Spectrum

- **id**: `electromagnetic-spectrum`
- **title**: The Electromagnetic Spectrum
- **formula**: $c = \lambda f$ for all EM waves in vacuum; photon energy $E = hf$

| Band | Frequency | Wavelength | Generation |
|------|-----------|------------|------------|
| Radio | $\sim 10^3$–$10^9$ Hz | km–cm | Oscillating circuits/antennas |
| Microwave | $\sim 10^9$–$10^{12}$ Hz | cm–mm | Klystron, magnetron |
| Infrared | $\sim 10^{12}$–$4\times10^{14}$ Hz | mm–$\mu$m | Thermal radiation |
| Visible | $\sim 4\times10^{14}$–$8\times10^{14}$ Hz | 400–700 nm | Atomic transitions, LEDs |
| UV | $\sim 10^{15}$–$10^{17}$ Hz | 400–10 nm | Discharge lamps, hot stars |
| X-rays | $\sim 10^{17}$–$10^{19}$ Hz | 10–0.01 nm | Bremsstrahlung, atomic transitions |
| Gamma | $> 10^{19}$ Hz | $< 0.01$ nm | Nuclear decay, pair annihilation |

**principle**: All EM radiation is the same phenomenon — self-sustaining oscillations of $\vec{E}$ and $\vec{B}$ propagating at $c$ — differing only in frequency. The photon energy $E = hf$ determines how EM radiation interacts with matter: low-frequency photons (radio) interact with macroscopic current distributions; optical photons interact with valence electrons; X-ray and gamma photons carry enough energy to ionize atoms and break chemical bonds. The division of the spectrum into named bands is a historical/practical convention — there are no gaps or discontinuities.

**causal-structure**: symmetric — frequency determines wavelength ($\lambda = c/f$) and photon energy ($E = hf$); the relationship is definitional.

**limits**: All EM waves travel at $c$ in vacuum. In media, $v = c/n$, and $n$ is frequency-dependent (dispersion). The spectrum has no known upper or lower frequency bound.

**prereqs**:
- `em-wave-equation` (foundational, 0.85)
- Photon concept, $E = hf$ (supporting, 0.55)

---

## Summary of Core Principles

1. **Maxwell's equations**: Four equations (Gauss's law, no monopoles, Faraday's law, Ampère-Maxwell) fully describe classical EM.
2. **Displacement current**: $\varepsilon_0\partial\vec{E}/\partial t$ completes Ampère's law and enables wave propagation.
3. **Wave equation**: $\nabla^2\vec{E} = \mu_0\varepsilon_0\ddot{\vec{E}}$ with speed $c = 1/\sqrt{\mu_0\varepsilon_0}$.
4. **Plane wave**: $\vec{E} \perp \vec{B} \perp \hat{k}$; $E_0 = cB_0$; both in phase; transverse.
5. **Poynting vector**: $\vec{S} = \vec{E}\times\vec{B}/\mu_0$ — directional energy flux; $\langle S\rangle = E_0^2/(2\mu_0 c)$.
6. **Radiation pressure**: $P_{\text{rad}} = I/c$ (absorbed), $2I/c$ (reflected).
7. **Larmor radiation**: $P = \mu_0 q^2 a^2/(6\pi c)$ — accelerating charges radiate.
8. **Spectrum**: All EM radiation travels at $c$; properties scale with frequency via $\lambda f = c$ and $E_{\text{photon}} = hf$.

## Key Formulas

| Formula | Description | Units |
|---------|-------------|-------|
| $\oint\vec{E}\cdot d\vec{A} = Q_{\text{enc}}/\varepsilon_0$ | Gauss's law | — |
| $\oint\vec{B}\cdot d\vec{A} = 0$ | No monopoles | — |
| $\oint\vec{E}\cdot d\vec{l} = -d\Phi_B/dt$ | Faraday's law | — |
| $\oint\vec{B}\cdot d\vec{l} = \mu_0 I + \mu_0\varepsilon_0\,d\Phi_E/dt$ | Ampère-Maxwell | — |
| $c = 1/\sqrt{\mu_0\varepsilon_0}$ | Speed of light | m/s |
| $\nabla^2\vec{E} = \mu_0\varepsilon_0\ddot{\vec{E}}$ | EM wave equation | — |
| $E_0 = cB_0$ | Plane wave amplitude ratio | — |
| $\omega = ck$, $\lambda f = c$ | Dispersion relation | — |
| $\vec{S} = \vec{E}\times\vec{B}/\mu_0$ | Poynting vector | W/m² |
| $I_{\text{avg}} = E_0^2/(2\mu_0 c)$ | Intensity (time-averaged) | W/m² |
| $u = \varepsilon_0 E^2$ | EM energy density (plane wave) | J/m³ |
| $P_{\text{rad}} = I/c$ | Radiation pressure (absorbed) | Pa |
| $P = \mu_0 q^2 a^2/(6\pi c)$ | Larmor formula | W |

## Instructor Notes (PHY 132 / Advanced Track)

The wave equation derivation (Node 24.3) is the single most important calculation in this chapter — and possibly in the course. Walk through it step by step: take the curl of Faraday's law, apply the vector identity $\nabla\times(\nabla\times\vec{E}) = \nabla(\nabla\cdot\vec{E}) - \nabla^2\vec{E}$, use Gauss's law ($\nabla\cdot\vec{E} = 0$ in vacuum), and substitute Ampère-Maxwell. The result $\nabla^2\vec{E} = \mu_0\varepsilon_0\ddot{\vec{E}}$ is unmistakably a wave equation, with speed $c = 1/\sqrt{\mu_0\varepsilon_0}$ that you can calculate from purely electromagnetic laboratory measurements. That the result equals the measured speed of light — measured completely independently — is extraordinary and should land with appropriate weight.

The Poynting vector (Node 24.5) connects to everything before it: $u_E = \frac{1}{2}\varepsilon_0 E^2$ (Ch. 19), $u_B = B^2/(2\mu_0)$ (Ch. 23), and the fact that in a plane wave $u_E = u_B$ exactly (since $E = cB$ and $c = 1/\sqrt{\mu_0\varepsilon_0}$). The DC circuit version of Poynting — energy flowing radially inward into a wire from the surrounding field — is a genuinely mind-bending result that rewards discussion.

The Larmor formula (Node 24.7) is the conceptual resolution of the classical atom's stability crisis: classical physics predicts electrons should spiral into the nucleus in $\sim 10^{-11}$ seconds due to radiation. This is a non-trivial failure of classical mechanics that forces quantum mechanics — worth flagging explicitly as a historical turning point.
