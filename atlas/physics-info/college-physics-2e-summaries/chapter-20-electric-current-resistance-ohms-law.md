# Chapter 20: Electric Current, Resistance, and Ohm's Law
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Current as a flux integral, drift velocity, microscopic Ohm's law ($\vec{J} = \sigma\vec{E}$), macroscopic resistance ($R = \rho L / A$), power dissipation as a volume integral, AC via phasor language (introduction), electrical safety, bioelectricity.

---

## Concept Nodes

---

### Node 20.1 — Electric Current

- **id**: `electric-current`
- **title**: Electric Current as a Flux Integral
- **formula**:
$$I = \frac{dQ}{dt} = \int_{\mathcal{S}} \vec{J} \cdot d\vec{A}$$

**principle**: Current $I$ is the net charge per unit time crossing a surface $\mathcal{S}$. In terms of the current density $\vec{J}$ (charge flow per unit time per unit area, units A/m²), current is the flux of $\vec{J}$ through the surface. This is the local, field-level description — $\vec{J}$ is the real physical quantity; $I$ is an integrated version of it. Conventional current direction is the direction positive charges flow (opposite to electron drift in metals). The continuity equation $\nabla \cdot \vec{J} = -\partial\rho/\partial t$ links $\vec{J}$ to charge conservation — in steady state, $\nabla \cdot \vec{J} = 0$, which is the microscopic statement of Kirchhoff's junction rule.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $I$ | response — total current through surface | A = C/s |
| $\vec{J}$ | driver — current density (local) | A/m² |
| $d\vec{A}$ | parameter — outward area element | m² |
| $\rho$ | covariate — charge density (zero in steady state) | C/m³ |

**causal-structure**: asymmetric — potential difference drives $\vec{J}$; $I$ is the integrated response.

**limits**: Applies to steady DC current. In AC, current direction reverses; in semiconductors and electrolytes, both positive and negative carriers contribute to $\vec{J}$.

**misconceptions**:
- "Electrons flow in the direction of conventional current" — electrons drift *opposite* to conventional current.
- "Current is used up by a resistor" — $I$ is conserved through a series circuit (continuity equation: $\nabla \cdot \vec{J} = 0$ in steady state).
- "Current flows instantaneously" — the electromagnetic signal propagates at $\sim c$; individual electron drift is $\sim$ mm/s.

**prereqs**:
- `conservation-of-charge` (foundational, 0.85)
- `electric-charge` (foundational, 0.85)
- Flux integrals, continuity equation (foundational, 0.85)

---

### Node 20.2 — Drift Velocity

- **id**: `drift-velocity`
- **title**: Microscopic Origin of Current: Drift Velocity
- **formula**:
$$\vec{J} = nq\vec{v}_d \quad \Rightarrow \quad I = nqAv_d$$

**principle**: In a conductor, charge carriers undergo rapid random thermal motion ($v_{\text{thermal}} \sim 10^6$ m/s for electrons) superimposed on a slow net drift $\vec{v}_d$ driven by $\vec{E}$. The current density is $\vec{J} = nq\vec{v}_d$ where $n$ is the carrier number density (m⁻³). For copper, $n \approx 8.5 \times 10^{28}$ m⁻³, giving $v_d \sim 10^{-4}$–$10^{-3}$ m/s for ordinary currents — far slower than thermal velocities. The electromagnetic signal, however, propagates at $\sim c$ because $\vec{E}$ fills the conductor nearly instantaneously.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{J}$ | response — current density | A/m² |
| $n$ | parameter — carrier number density | m⁻³ |
| $q$ | parameter — carrier charge | C |
| $\vec{v}_d$ | response — drift velocity | m/s |
| $A$ | parameter — cross-sectional area | m² |

**causal-structure**: asymmetric — applied $\vec{E}$ (from potential difference) drives $\vec{v}_d$; $\vec{J} = nq\vec{v}_d$ and $I = \int \vec{J} \cdot d\vec{A}$.

**limits**: One-carrier model. In semiconductors, both electrons (charge $-e$) and holes (charge $+e$) contribute: $\vec{J} = n_e(-e)\vec{v}_{de} + n_h(+e)\vec{v}_{dh}$. In electrolytes, positive and negative ions both drift.

**misconceptions**:
- "Faster current means faster electrons" — drift speed $\sim$ mm/s; signal propagation $\sim c$.
- "Thicker wire means slower current" — thicker wire at the same $I$ means *lower* $v_d$ (more carriers share the current).

**prereqs**:
- `electric-current` (foundational, 0.85)
- `conductors-insulators` (foundational, 0.85)

---

### Node 20.3 — Ohm's Law: Microscopic and Macroscopic

- **id**: `ohms-law`
- **title**: Ohm's Law — Microscopic ($\vec{J} = \sigma\vec{E}$) and Macroscopic ($V = IR$)
- **formula**:
Microscopic (local, fundamental): $\vec{J} = \sigma \vec{E}$

Macroscopic (circuit-level): $V = IR$, where $R = \rho L / A = L / (\sigma A)$

**principle**: The microscopic form $\vec{J} = \sigma\vec{E}$ states that the local current density at any point is proportional to the local electric field; $\sigma$ is the **conductivity** (S/m = 1/(Ω·m)). This is the *fundamental* version — a local, vector, material-level statement. The macroscopic form $V = IR$ is derived from it by integrating $\vec{E}$ along the conductor length ($\Delta V = EL$) and integrating $\vec{J}$ over the cross section ($I = JA$):

$$V = IR = I \cdot \frac{\rho L}{A} = \frac{JA \cdot \rho L}{A} = J \rho L = E L = \Delta V \checkmark$$

Ohm's law is an empirical approximation valid for ohmic materials (constant $\sigma$). It fails for diodes, transistors, superconductors, and non-equilibrium systems.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{J}$ | response — current density | A/m² |
| $\vec{E}$ | driver — electric field in conductor | V/m |
| $\sigma = 1/\rho$ | parameter — conductivity | S/m = 1/(Ω·m) |
| $I$ | response — current | A |
| $V$ | driver — potential difference | V |
| $R$ | parameter — resistance | Ω |

**causal-structure**: asymmetric — $\vec{E}$ (equivalently $V$) is the driver; $\vec{J}$ (equivalently $I$) is the response; $\sigma$ (equivalently $R$) is the parameter mediating the response. Surface charges on conductor walls maintain $\vec{E}$ inside.

**limits**: Valid for ohmic materials at moderate field strengths and temperatures. Fails for: diodes, transistors, superconductors ($R = 0$), electrolytes, plasmas, and any material where $\sigma$ depends on $\vec{E}$ or $I$.

**misconceptions**:
- "All materials obey Ohm's Law" — only ohmic materials do; Ohm's law is empirical, not fundamental.
- "$V = IR$ defines resistance — $R \equiv V/I$ is always defined; Ohm's law is the *claim* that $R$ is constant (independent of $V$ and $I$).

**prereqs**:
- `electric-current` (foundational, 0.85)
- `electric-potential` (foundational, 0.85)
- `drift-velocity` (supporting, 0.55)

---

### Node 20.4 — Resistance and Resistivity

- **id**: `resistance-resistivity`
- **title**: Resistance, Resistivity, and Temperature Dependence
- **formula**:
$$R = \frac{\rho L}{A}, \quad \rho = \frac{1}{\sigma}$$
$$\rho(T) = \rho_0[1 + \alpha(T - T_0)]$$

**principle**: Resistivity $\rho$ (Ω·m) is the intrinsic material property; resistance $R$ (Ω) is the geometric combination $R = \rho L / A$. The distinction matters: two rods of the same material but different geometry have the same $\rho$ and different $R$. Temperature dependence: for metals, $\rho$ increases with $T$ (increased phonon scattering reduces mean free path); for semiconductors, $\rho$ decreases with $T$ (thermally excited carriers increase $n$). Drude model insight: $\sigma = ne^2\tau/m_e$ where $\tau$ is the mean free time between collisions; increasing $T$ decreases $\tau$ (metals) or increases $n$ (semiconductors).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $R$ | response — resistance | Ω |
| $\rho$ | parameter — resistivity (material property) | Ω·m |
| $L$ | parameter — conductor length | m |
| $A$ | parameter — cross-sectional area | m² |
| $\alpha$ | parameter — temperature coefficient | K⁻¹ or °C⁻¹ |
| $T_0$ | parameter — reference temperature | K or °C |

**causal-structure**: asymmetric — geometry and material properties determine $R$, which mediates the $V \to I$ response.

**limits**: $\rho = \rho_0(1 + \alpha\Delta T)$ is a linear approximation valid over limited temperature ranges. Superconductors: $\rho = 0$ below the critical temperature. Semiconductors require the full Fermi-Dirac treatment for accuracy.

**misconceptions**:
- "Thicker wire has more resistance" — more area → more current paths → less $R = \rho L / A$.
- "Resistance and resistivity are the same thing" — $\rho$ is material-level; $R$ depends on geometry too.

**prereqs**:
- `ohms-law` (foundational, 0.85)
- `drift-velocity` (supporting, 0.55)

---

### Node 20.5 — Electric Power and Energy Dissipation

- **id**: `electric-power`
- **title**: Electric Power; Joule Heating as a Volume Integral
- **formula**:
$$P = I V = I^2 R = \frac{V^2}{R}$$

Microscopic power density (Joule heating):
$$p = \vec{J} \cdot \vec{E} = \sigma E^2 = J^2/\sigma \quad [\text{W/m}^3]$$

Total dissipated power: $P = \int_V \vec{J} \cdot \vec{E} \, dV$

**principle**: Power is the rate of energy transfer from the electric field to the conductor. At the microscopic level, $\vec{J} \cdot \vec{E}$ is the power density (energy dissipated per unit volume per unit time) — this is the product of the force per unit volume ($\rho_{\text{charge}} \vec{E}$) and the drift velocity, converted to power. Integrating over the conductor volume reproduces $P = IV = I^2R$. The high-voltage transmission line insight: $P_{\text{loss}} = I^2 R \propto I^2$, so transmitting at high $V$ (low $I$ for the same power $P = IV$) reduces losses quadratically.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $P$ | response — power dissipated | W = J/s |
| $I$ | driver — current | A |
| $V$ | driver — voltage | V |
| $R$ | parameter — resistance | Ω |
| $p = \vec{J} \cdot \vec{E}$ | response — power density | W/m³ |

**causal-structure**: asymmetric — $V$ and $I$ jointly drive power dissipation; $R$ is the parameter. Power is a response of the system.

**limits**: $P = V^2/R$ and $P = I^2R$ apply to purely *resistive* elements. For reactive elements (L, C) in AC, only the real part of impedance dissipates power.

**misconceptions**:
- "A 100 W bulb uses 100 joules" — it uses 100 joules *per second*.
- "High-power appliances always draw high current" — $P = V^2/R$; high $R$ at same $V$ means low $P$ and low $I$.

**prereqs**:
- `ohms-law` (foundational, 0.85)
- `electric-potential` (foundational, 0.85)

---

### Node 20.6 — Alternating Current and RMS Values

- **id**: `alternating-current-rms`
- **title**: Alternating Current: Phasor Representation and RMS Values
- **formula**:
$$V(t) = V_0 \cos(\omega t + \phi_V) = \text{Re}[\tilde{V} e^{i\omega t}], \quad \tilde{V} = V_0 e^{i\phi_V}$$
$$I(t) = I_0 \cos(\omega t + \phi_I), \quad \tilde{I} = I_0 e^{i\phi_I}$$
$$V_{\text{rms}} = \frac{V_0}{\sqrt{2}}, \quad I_{\text{rms}} = \frac{I_0}{\sqrt{2}}$$
$$P_{\text{avg}} = V_{\text{rms}} I_{\text{rms}} \cos\phi = \frac{1}{2}V_0 I_0 \cos\phi$$

**principle**: AC quantities oscillate sinusoidally. The **phasor** representation ($\tilde{V} = V_0 e^{i\phi}$) converts differential equations into algebraic equations — the key that makes circuit analysis tractable. The **rms** (root-mean-square) value is defined so that power formulas have the same form as DC: $P = V_{\text{rms}} I_{\text{rms}}$ (for resistive loads). The derivation: $P_{\text{avg}} = \langle V(t) I(t) \rangle = \frac{1}{T}\int_0^T V_0 I_0 \cos(\omega t) \cos(\omega t - \phi) \, dt = \frac{1}{2}V_0 I_0 \cos\phi$. For purely resistive load ($\phi = 0$): $P = V_{\text{rms}}^2/R = I_{\text{rms}}^2 R$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $V_0, I_0$ | parameter — peak amplitudes | V, A |
| $\tilde{V}, \tilde{I}$ | parameter — complex phasors | V, A |
| $\omega = 2\pi f$ | parameter — angular frequency | rad/s |
| $\phi$ | parameter — phase difference between $V$ and $I$ | rad |
| $V_{\text{rms}}, I_{\text{rms}}$ | parameter — rms values | V, A |
| $P_{\text{avg}}$ | response — average power | W |

**causal-structure**: asymmetric — source drives $V(t)$; circuit determines $I(t)$ and phase $\phi$; power is a response.

**limits**: $V_{\text{rms}} = V_0/\sqrt{2}$ applies only to sinusoidal AC; other waveforms have different crest factors. For non-resistive loads, $\cos\phi \neq 1$ and apparent power $S = V_{\text{rms}}I_{\text{rms}}$ exceeds real power.

**misconceptions**:
- "US outlets supply 120 V" — they supply 120 V *rms*; the peak is $\approx 170$ V.
- "AC delivers no net power because the average current is zero" — $\langle I \rangle = 0$ but $\langle I^2 \rangle \neq 0$.
- "RMS is the average of the magnitude" — rms is the square root of the mean of the *square*.

**prereqs**:
- `electric-power` (foundational, 0.85)
- Complex exponentials, phasor algebra (foundational, 0.85)
- Trigonometric time averages (foundational, 0.85)

---

### Node 20.7 — Electrical Safety

- **id**: `electrical-safety`
- **title**: Electrical Safety and Current Thresholds
- **formula**: $I = V/R_{\text{body}}$; physiological thresholds: $\sim 1$ mA (sensation), $\sim 10$ mA (cannot release), $\sim 100$ mA (ventricular fibrillation), $> 1$ A (severe burns/cardiac arrest)

**principle**: Electrical shock hazard is determined by current through the body (not voltage alone). Body resistance $R_{\text{body}}$ ranges from $\sim 100$ kΩ (dry skin) to $\sim 1$ kΩ (wet skin), so the same voltage drives very different currents. Current path matters: hand-to-hand or hand-to-foot through the chest is most dangerous. GFCIs trip at $\sim 5$ mA in $\sim 25$ ms — below fibrillation threshold.

**causal-structure**: asymmetric — $V$ drives $I$ through body resistance; $I$ through body causes physiological effects.

**limits**: Thresholds approximate and vary with frequency (60 Hz AC more dangerous than DC at same rms), duration, contact area, and individual.

**misconceptions**:
- "High voltage always kills" — low voltage through wet skin can be fatal.
- "It's the voltage that kills" — it's the current through the body.

**prereqs**:
- `ohms-law` (foundational, 0.85)
- `electric-power` (foundational, 0.85)

---

### Node 20.8 — Nerve Conduction and Bioelectricity

- **id**: `nerve-conduction`
- **title**: Nerve Conduction and Bioelectricity
- **formula**: $V_{\text{rest}} \approx -70$ mV (resting membrane potential); action potential peak $\approx +40$ mV; conduction speed $\sim 1$–$100$ m/s

**principle**: Neurons maintain a resting membrane potential via ion concentration gradients (K⁺ inside, Na⁺ outside) maintained by active ion pumps (Na⁺/K⁺-ATPase). The membrane itself acts as a parallel-RC circuit: lipid bilayer is the capacitor ($\kappa \approx 5$, $\sim 1$ μF/cm²), ion channels are resistors. An action potential is a self-regenerating depolarization wave: voltage-gated Na⁺ channels open above threshold ($\sim -55$ mV), Na⁺ rushes in (depolarization to $+40$ mV), then K⁺ channels restore resting potential. Myelination dramatically increases conduction speed (saltatory conduction). The Hodgkin-Huxley model (1952) is a set of coupled ODEs that quantitatively reproduces action potential dynamics.

**causal-structure**: asymmetric — ion gradients (maintained by metabolic energy) drive membrane potential; voltage-gated channels translate potential changes into propagating currents.

**limits**: Simplified Hodgkin-Huxley framework. Real neurons involve multiple ion channels, neurotransmitters, complex dendritic integration, and spatial nonuniformity. ECG/EEG represent population averages of action potentials.

**misconceptions**:
- "Nerve signals are electrical currents like in wires" — they are electrochemical waves; the charge carriers are ions (Na⁺, K⁺, Cl⁻), not electrons.
- "The action potential weakens with distance" — it is all-or-nothing and self-regenerating (driven by active channels at each node of Ranvier).

**prereqs**:
- `electric-current` (foundational, 0.85)
- `electric-potential` (foundational, 0.85)
- `capacitance` (supporting, 0.55)
- `dielectrics` (lateral, 0.2)

---

## Cross-Chapter Connections

- **← Ch. 18–19**: $\vec{J} = \sigma\vec{E}$; $\sigma$ connects the field (Ch. 18) to current (Ch. 20); $V = IR$ connects potential difference (Ch. 19) to current.
- **→ Ch. 21 (Circuits)**: Kirchhoff's junction rule = $\nabla \cdot \vec{J} = 0$ at steady state; loop rule = $\oint \vec{E} \cdot d\vec{l} = 0$ for static fields.
- **→ Ch. 23 (AC Circuits)**: Phasors introduced here extend to impedance ($Z = R + i(X_L - X_C)$), resonance, and power factor.

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Current (flux integral) | $I = \int_{\mathcal{S}} \vec{J} \cdot d\vec{A}$ |
| Continuity (steady state) | $\nabla \cdot \vec{J} = 0$ |
| Drift velocity | $\vec{J} = nq\vec{v}_d$ |
| Microscopic Ohm's law | $\vec{J} = \sigma\vec{E}$ |
| Macroscopic Ohm's law | $V = IR$, $R = \rho L/A$ |
| Resistivity vs temperature | $\rho(T) = \rho_0[1 + \alpha\Delta T]$ |
| Power (macroscopic) | $P = IV = I^2R = V^2/R$ |
| Power density (microscopic) | $p = \vec{J} \cdot \vec{E}$ |
| RMS values | $V_{\text{rms}} = V_0/\sqrt{2}$, $I_{\text{rms}} = I_0/\sqrt{2}$ |
| Average AC power | $P_{\text{avg}} = V_{\text{rms}}I_{\text{rms}}\cos\phi$ |

## Instructor Notes (PHY 132 / Advanced Track)

The critical upgrade here is the distinction between the microscopic ($\vec{J} = \sigma\vec{E}$) and macroscopic ($V = IR$) forms of Ohm's law, and showing explicitly that the macroscopic form is derived by integrating the microscopic one. Students should see the Drude model at least qualitatively ($\sigma = ne^2\tau/m_e$) to understand why $\sigma$ is a material property. The phasor language in Node 20.6 is a preview of impedance analysis in Ch. 23 — introduce complex exponentials explicitly here. The power density $\vec{J} \cdot \vec{E}$ connects back to field energy (Ch. 19) and forward to the Poynting vector (Ch. 24).
