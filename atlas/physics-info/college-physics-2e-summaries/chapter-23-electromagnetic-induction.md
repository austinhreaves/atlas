# Chapter 23: Electromagnetic Induction, AC Circuits, and Electrical Machines
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Faraday's law as a curl equation, magnetic flux as a surface integral, motional EMF as a path integral, Lenz's law, self-inductance, AC circuits via complex impedance (phasors), resonance, transformers, power transmission.

---

## Overview

Chapter 23 closes the loop: instead of currents producing $\vec{B}$ (Ch. 22), *changing* $\vec{B}$ produces $\vec{E}$ (Faraday's law). This is one of Maxwell's four equations and, combined with Ampère-Maxwell (Ch. 24), predicts electromagnetic waves. The chapter then develops AC circuit analysis using the full complex-impedance machinery and ends with practical applications: generators, transformers, power transmission.

**Core insight**: A changing magnetic flux through a surface induces an EMF around its boundary. The direction of the induced current opposes the flux change (Lenz's law) — a direct consequence of energy conservation.

---

## Concept Nodes

---

### 23.1 — Magnetic Flux

- **id**: `magnetic-flux`
- **title**: Magnetic Flux as a Surface Integral
- **formula**:
$$\Phi_B = \int_{\mathcal{S}} \vec{B} \cdot d\vec{A}$$

For uniform $\vec{B}$ over a flat surface: $\Phi_B = BA\cos\theta$

**principle**: The magnetic flux through a surface $\mathcal{S}$ is the net amount of magnetic field "threading" through it, weighted by orientation. As a surface integral, $\Phi_B$ accounts for non-uniform fields and curved surfaces naturally. The uniform formula $\Phi_B = BA\cos\theta$ is the special case where $\vec{B}$ is constant and the surface is flat. Units: Weber (Wb) = T·m². Since $\nabla \cdot \vec{B} = 0$, the flux through any closed surface is zero: $\oint \vec{B} \cdot d\vec{A} = 0$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\Phi_B$ | response — magnetic flux | Wb = T·m² |
| $\vec{B}$ | driver — magnetic field | T |
| $d\vec{A}$ | parameter — outward area element | m² |

**causal-structure**: asymmetric — $\vec{B}$ field (and surface geometry/orientation) determines $\Phi_B$.

**limits**: For a non-planar or non-uniform situation, the simple $BA\cos\theta$ formula fails; the integral form is always correct.

**misconceptions**:
- "Flux is a physical flow" — $\Phi_B$ is a mathematical measure of field penetration; nothing literally flows.
- "Static flux induces EMF" — only *changing* flux induces EMF (Faraday's law).

**prereqs**:
- `magnetic-field` (foundational, 0.85)
- Surface integrals; dot product with area element (foundational, 0.85)

---

### 23.2 — Faraday's Law of Induction

- **id**: `faraday-law`
- **title**: Faraday's Law (Integral and Differential Forms)
- **formula**:
Integral form:
$$\mathcal{E} = \oint_{\partial\mathcal{S}} \vec{E} \cdot d\vec{l} = -\frac{d}{dt}\int_{\mathcal{S}} \vec{B} \cdot d\vec{A} = -\frac{d\Phi_B}{dt}$$

For a coil with $N$ turns:
$$\mathcal{E} = -N\frac{d\Phi_B}{dt}$$

Differential form (one of Maxwell's four equations):
$$\nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t}$$

**principle**: A changing magnetic flux through a surface $\mathcal{S}$ induces an electromotive force (EMF) around the boundary $\partial\mathcal{S}$. The EMF is the circulation of the electric field: $\mathcal{E} = \oint \vec{E} \cdot d\vec{l}$. The negative sign is Lenz's law (see next node). Note that in time-varying fields, $\vec{E}$ is *not* conservative ($\nabla \times \vec{E} \neq 0$), so the scalar potential $V$ alone does not fully describe the situation — the full $\vec{E} = -\nabla V - \partial\vec{A}/\partial t$ is needed.

The flux can change in three ways: (1) changing $B$; (2) changing area $A$; (3) changing orientation $\theta$. Any mechanism that changes $\Phi_B$ induces an EMF.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\mathcal{E}$ | response — induced EMF | V |
| $\Phi_B = \int \vec{B}\cdot d\vec{A}$ | driver — magnetic flux | Wb |
| $d\Phi_B/dt$ | driver — rate of flux change | V |
| $N$ | parameter — number of turns | dimensionless |

**causal-structure**: asymmetric — changing $\Phi_B$ drives $\mathcal{E}$; the negative sign encodes the oppositional direction.

**limits**: Valid for any closed loop and any mechanism of flux change. At the quantum level, Faraday's law generalizes to the Aharonov-Bohm effect (vector potential $\vec{A}$ is physically real even where $\vec{B} = 0$).

**misconceptions**:
- "A strong $\vec{B}$ field induces EMF" — only *changing* $\Phi_B$ induces EMF; a static field through a static loop produces nothing.
- "Faraday's law only applies to loops with wires" — it applies to any closed path; the EMF around a path in free space is also governed by Faraday's law (this is how EM waves propagate).

**prereqs**:
- `magnetic-flux` (foundational, 0.85)
- `ampere-law` (lateral, 0.2 — structural parallel: curl equations are dual)
- Derivatives; Stokes' theorem (foundational, 0.85)

---

### 23.3 — Lenz's Law

- **id**: `lenz-law`
- **title**: Lenz's Law
- **formula**: The negative sign in $\mathcal{E} = -d\Phi_B/dt$ encodes Lenz's law.

**principle**: The induced current flows in a direction such that the magnetic flux it creates *opposes the change* in the original flux. If $\Phi_B$ is increasing, the induced current creates a $\vec{B}_{\text{ind}}$ opposing the increase (i.e., $\vec{B}_{\text{ind}}$ is antiparallel to the flux change). If $\Phi_B$ is decreasing, the induced current creates a $\vec{B}_{\text{ind}}$ opposing the decrease. Lenz's law is a consequence of energy conservation — if the induced current *aided* the flux change, a runaway self-amplification would violate conservation of energy.

**causal-structure**: asymmetric — direction of flux change drives direction of induced current (oppositional).

**limits**: Applies whenever flux changes. The "opposition" is always to the *change*, not to the field itself.

**misconceptions**:
- "Lenz's law says the induced field cancels the original field" — it opposes the *change*, not the field. The induced field partially counteracts the change but does not fully cancel it.
- "The induced current is always counter-clockwise" — depends on the geometry and direction of flux change.

**prereqs**:
- `faraday-law` (foundational, 0.85)
- `ampere-law` (supporting, 0.55 — to find $\vec{B}$ from induced current)
- Conservation of energy (foundational, 0.85)

---

### 23.4 — Motional EMF

- **id**: `motional-emf`
- **title**: Motional EMF
- **formula**:
General (any moving conductor in a magnetic field):
$$\mathcal{E} = \int_{\text{path}} (\vec{v} \times \vec{B}) \cdot d\vec{l}$$

Special case (rod moving perpendicular to uniform $\vec{B}$):
$$\mathcal{E} = Blv$$

**principle**: When a conductor moves through a magnetic field, the Lorentz force $\vec{F} = q\vec{v} \times \vec{B}$ acts on free charge carriers, driving them along the conductor and creating a charge separation. The EMF is the work done per unit charge by this force along the path. This is the *physical origin* of electromagnetic induction in moving conductors. The equivalence with Faraday's law ($\mathcal{E} = -d\Phi_B/dt$) is a direct consequence of Stokes' theorem applied to the moving boundary of the surface.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\mathcal{E}$ | response — motional EMF | V |
| $\vec{v}$ | driver — velocity of conductor | m/s |
| $\vec{B}$ | driver — magnetic field | T |
| $l$ | parameter — length of conductor | m |

**causal-structure**: asymmetric — motion in field drives Lorentz force on carriers → charge separation → EMF.

**limits**: General form $\mathcal{E} = \int(\vec{v}\times\vec{B})\cdot d\vec{l}$ handles non-uniform fields and non-straight paths.

**misconceptions**:
- "Motional EMF comes from the wire moving, not from physics" — it comes from the Lorentz force $q\vec{v}\times\vec{B}$ on individual charge carriers; the conductor geometry determines the result.
- "Relative motion doesn't matter — only the wire's motion matters" — only the relative motion between conductor and field region matters (Galilean invariance of the classical limit).

**prereqs**:
- `lorentz-force-magnetic` (foundational, 0.85)
- `faraday-law` (supporting, 0.55)
- Path integrals; vector cross product (foundational, 0.85)

---

### 23.5 — Self-Inductance

- **id**: `self-inductance`
- **title**: Self-Inductance
- **formula**:
$$\mathcal{E}_L = -L\frac{dI}{dt}$$
$$L = \frac{N\Phi_B}{I} = \frac{\text{flux linkage}}{\text{current}}$$

For a solenoid: $L = \mu_0 n^2 V = \mu_0 \frac{N^2}{l} A$

Energy stored: $U_L = \frac{1}{2}LI^2$

Magnetic energy density: $u_B = \frac{B^2}{2\mu_0}$, so $U_L = \int u_B \, dV$

**principle**: When current in a coil changes, it changes its own flux, which by Faraday's law induces a back-EMF opposing the current change: $\mathcal{E}_L = -L\,dI/dt$. The self-inductance $L$ (Henry = Wb/A = V·s/A) depends only on geometry and material. For a solenoid: $\Phi_B = \mu_0 nI \cdot A$ per turn, flux linkage $= N\Phi_B = \mu_0 n^2 V \cdot I$, so $L = \mu_0 n^2 V$. The energy stored in an inductor is held in the magnetic field: $u_B = B^2/(2\mu_0)$ is the magnetic analogue of $u_E = \varepsilon_0 E^2/2$ (Ch. 19).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $L$ | parameter — self-inductance | H = Wb/A |
| $\mathcal{E}_L$ | response — back-EMF | V |
| $I$ | driver — current | A |
| $dI/dt$ | driver — rate of current change | A/s |
| $U_L = \frac{1}{2}LI^2$ | conserved — energy stored in inductor | J |

**causal-structure**: asymmetric — changing $I$ drives back-EMF; $L$ is the parameter. The back-EMF *opposes* the change (Lenz's law applied to self-inductance).

**limits**: $L$ is defined only for linear media ($B \propto I$). In ferromagnetic cores, $L$ depends on $I$ (nonlinear, hysteretic). In DC steady state ($dI/dt = 0$), the inductor acts as a short circuit.

**misconceptions**:
- "Inductance resists current" — inductance resists *changes* in current. A DC current flows freely through an ideal inductor.
- "Energy is stored in the coil wire" — energy is stored in the magnetic *field*; the wire just maintains the current.

**prereqs**:
- `faraday-law` (foundational, 0.85)
- `magnetic-flux` (foundational, 0.85)
- `solenoid-magnetic-field` from Ch. 22 (foundational, 0.85)
- `capacitor-energy` from Ch. 19 (lateral, 0.2 — dual: $\frac{1}{2}CV^2$ ↔ $\frac{1}{2}LI^2$)

---

### 23.6 — AC Circuits: Impedance and Phasors

- **id**: `impedance-phasors`
- **title**: AC Circuits: Complex Impedance and Phasor Analysis
- **formula**:
Resistor: $Z_R = R$ (real; $V$ and $I$ in phase)
Inductor: $Z_L = i\omega L = \omega L e^{i\pi/2}$ (imaginary; $V$ leads $I$ by 90°)
Capacitor: $Z_C = \frac{1}{i\omega C} = \frac{1}{\omega C}e^{-i\pi/2}$ (imaginary; $V$ lags $I$ by 90°)

Series RLC: $Z = R + i\left(\omega L - \frac{1}{\omega C}\right)$, $|Z| = \sqrt{R^2 + (X_L - X_C)^2}$

Ohm's law for AC: $\tilde{V} = Z\tilde{I}$

**principle**: For sinusoidal AC, every circuit element's voltage-current relationship is a complex algebraic equation: $\tilde{V} = Z\tilde{I}$, where $Z$ is the complex impedance and $\tilde{V}$, $\tilde{I}$ are phasors (complex amplitudes). This converts the circuit's differential equations into algebraic equations in the frequency domain. Kirchhoff's rules apply to phasors exactly as they do to DC: $\sum Z_k \tilde{I}_k = 0$ (KVL), $\sum \tilde{I}_k = 0$ (KCL). The inductive reactance $X_L = \omega L$ increases with frequency (inductor blocks high-frequency AC); capacitive reactance $X_C = 1/(\omega C)$ decreases with frequency (capacitor blocks DC, passes high-frequency AC).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $Z$ | parameter — complex impedance | Ω |
| $\tilde{V}$ | driver — voltage phasor | V |
| $\tilde{I}$ | response — current phasor | A |
| $X_L = \omega L$ | parameter — inductive reactance | Ω |
| $X_C = 1/(\omega C)$ | parameter — capacitive reactance | Ω |
| $\phi = \arg(Z)$ | parameter — phase angle | rad |

**causal-structure**: asymmetric — applied $\tilde{V}$ drives $\tilde{I} = \tilde{V}/Z$; $Z$ is the parameter.

**limits**: Phasor analysis is valid for *steady-state sinusoidal* AC only. Transient response requires time-domain ODE solution (or Laplace transforms). Nonlinear elements (diodes, transistors) cannot be treated with impedance directly.

**misconceptions**:
- "Reactance is like resistance but for AC" — reactance is not dissipative; no power is lost in ideal L or C. The key distinction: $Z_R = R$ (real), $Z_{L,C}$ (imaginary).
- "The current and voltage are always in phase" — only for purely resistive loads; in general, the phase angle $\phi = \arg(Z)$ is nonzero.

**prereqs**:
- `alternating-current-rms` from Ch. 20 (foundational, 0.85)
- `self-inductance` (foundational, 0.85)
- `capacitance` from Ch. 19 (foundational, 0.85)
- Complex exponentials, Euler's formula (foundational, 0.85)

---

### 23.7 — Resonance in RLC Circuits

- **id**: `resonance-rlc`
- **title**: Resonance in RLC Circuits
- **formula**:
Resonance condition: $X_L = X_C$ → $\omega_0 = \frac{1}{\sqrt{LC}}$, $f_0 = \frac{1}{2\pi\sqrt{LC}}$

At resonance: $Z = R$ (minimum), $I_{\text{rms}} = V_{\text{rms}}/R$ (maximum)

Quality factor: $Q = \frac{\omega_0 L}{R} = \frac{1}{\omega_0 RC} = \frac{1}{R}\sqrt{\frac{L}{C}}$

Bandwidth: $\Delta\omega = \omega_0/Q$ (full width at half-maximum of power curve)

**principle**: Resonance occurs when inductive and capacitive reactances cancel, $X_L = X_C$, leaving only $R$ to limit current. At $\omega_0 = 1/\sqrt{LC}$, the impedance is minimum and current is maximum. The quality factor $Q$ measures how sharply peaked the resonance is: $Q = 2\pi \times (\text{energy stored})/(\text{energy dissipated per cycle})$. Physically: energy oscillates between the magnetic field of the inductor ($U_L = \frac{1}{2}LI^2$) and the electric field of the capacitor ($U_C = \frac{1}{2}CV^2$); $R$ dissipates energy, damping the oscillation. This is the electrical analogue of a driven harmonic oscillator with damping.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\omega_0 = 1/\sqrt{LC}$ | parameter — resonance frequency | rad/s |
| $Q$ | parameter — quality factor | dimensionless |
| $\Delta\omega$ | response — bandwidth | rad/s |
| $L, C, R$ | parameter — circuit elements | H, F, Ω |

**causal-structure**: asymmetric — source frequency and circuit parameters determine whether resonance occurs; at resonance, $I$ is maximum.

**limits**: $Q > 1$: sharp resonance peak. $Q < 1$: overdamped (no peak). Ideal inductors and capacitors: $R \to 0$, $Q \to \infty$, bandwidth $\to 0$. Parallel RLC circuit has maximum impedance (minimum current) at resonance.

**prereqs**:
- `impedance-phasors` (foundational, 0.85)
- `self-inductance` (foundational, 0.85)
- `capacitance` (foundational, 0.85)
- Harmonic oscillator (lateral, 0.2)

---

### 23.8 — Transformers

- **id**: `ideal-transformer`
- **title**: Ideal Transformer
- **formula**:
$$\frac{V_s}{V_p} = \frac{N_s}{N_p}, \quad V_p I_p = V_s I_s \quad \text{(power conservation)}$$

Mechanism via Faraday: both coils share the same core flux $\Phi_B$:
$$\mathcal{E}_p = -N_p\frac{d\Phi_B}{dt}, \quad \mathcal{E}_s = -N_s\frac{d\Phi_B}{dt} \quad \Rightarrow \quad \frac{\mathcal{E}_s}{\mathcal{E}_p} = \frac{N_s}{N_p}$$

**principle**: A transformer consists of two coils (primary $N_p$ turns, secondary $N_s$ turns) on a shared ferromagnetic core. An AC current in the primary drives a changing flux in the core; Faraday's law induces EMF in both coils proportional to their turns count. Since both see the same $d\Phi_B/dt$, the voltage ratio equals the turns ratio. Power conservation (ideal: no losses) gives $V_p I_p = V_s I_s$: step-up in voltage means step-down in current. A transformer *only works with AC* — DC produces no changing flux, hence no induced secondary EMF.

**causal-structure**: asymmetric — primary EMF + changing flux → secondary EMF; transformer ratio is a parameter.

**limits**: Real transformers have core losses (hysteresis + eddy currents) and copper losses ($I^2R$ in windings). Efficiency $\approx 95$–$99\%$ for large power transformers.

**prereqs**:
- `faraday-law` (foundational, 0.85)
- `self-inductance` (foundational, 0.85)
- `alternating-current-rms` from Ch. 20 (foundational, 0.85)

---

## Summary of Core Principles

1. **Faraday's law**: $\mathcal{E} = -d\Phi_B/dt$; differential form: $\nabla\times\vec{E} = -\partial\vec{B}/\partial t$ (one of Maxwell's four equations).
2. **Magnetic flux**: $\Phi_B = \int_{\mathcal{S}} \vec{B}\cdot d\vec{A}$ — the integral, not the scalar approximation, is the definition.
3. **Lenz's law**: Induced current opposes flux change (energy conservation).
4. **Motional EMF**: $\mathcal{E} = \int(\vec{v}\times\vec{B})\cdot d\vec{l}$ — Lorentz force on moving carriers.
5. **Self-inductance**: $\mathcal{E}_L = -L\,dI/dt$; energy $U_L = \frac{1}{2}LI^2$ stored in $\vec{B}$ field.
6. **Impedance**: $Z_R = R$, $Z_L = i\omega L$, $Z_C = 1/(i\omega C)$; phasor Ohm's law $\tilde{V} = Z\tilde{I}$.
7. **Resonance**: $\omega_0 = 1/\sqrt{LC}$; $Q = \omega_0 L/R$.
8. **Transformer**: $V_s/V_p = N_s/N_p$; derived from Faraday's law on shared core.

## Key Formulas

| Formula | Description | Units |
|---------|-------------|-------|
| $\Phi_B = \int\vec{B}\cdot d\vec{A}$ | Magnetic flux | Wb |
| $\mathcal{E} = -d\Phi_B/dt$ | Faraday's law | V |
| $\mathcal{E} = -N\,d\Phi_B/dt$ | Multi-turn coil | V |
| $\mathcal{E} = \int(\vec{v}\times\vec{B})\cdot d\vec{l}$ | Motional EMF (general) | V |
| $\mathcal{E}_L = -L\,dI/dt$ | Inductor back-EMF | V |
| $L = \mu_0 n^2 V$ | Solenoid inductance | H |
| $U_L = \frac{1}{2}LI^2$ | Inductor energy | J |
| $u_B = B^2/(2\mu_0)$ | Magnetic energy density | J/m³ |
| $Z = R + i(\omega L - 1/\omega C)$ | Series RLC impedance | Ω |
| $\omega_0 = 1/\sqrt{LC}$ | Resonance frequency | rad/s |
| $Q = \omega_0 L/R$ | Quality factor | — |
| $V_s/V_p = N_s/N_p$ | Transformer ratio | — |

## Instructor Notes (PHY 132 / Advanced Track)

The crown jewel of this chapter is recognizing that Faraday's law ($\nabla\times\vec{E} = -\partial\vec{B}/\partial t$) and Ampère-Maxwell ($\nabla\times\vec{B} = \mu_0\vec{J} + \mu_0\varepsilon_0\partial\vec{E}/\partial t$) together predict wave propagation — this is the bridge to Ch. 24. The phasor framework (Node 23.6) is the most transferable mathematical tool in this chapter: once students internalize $\tilde{V} = Z\tilde{I}$ with complex $Z$, AC circuit analysis reduces to complex algebra. Spend time on the dimensional analysis of $Q$: it is simultaneously $\omega_0 L/R$, $1/(\omega_0 RC)$, and $\sqrt{L/C}/R$, and it sets the selectivity of radio tuners and the damping of oscillating systems universally. The self-inductance energy $U_L = \frac{1}{2}LI^2$ is the magnetic dual of capacitor energy $U_C = \frac{1}{2}CV^2$ — the LC oscillation is the exchange between these two forms, the electromagnetic analogue of a mass-spring system.
