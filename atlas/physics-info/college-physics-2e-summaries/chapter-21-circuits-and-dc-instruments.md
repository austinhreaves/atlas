# Chapter 21: Circuits and DC Instruments
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Kirchhoff's rules derived from Maxwell's equations, series/parallel resistors, EMF and terminal voltage, voltmeters/ammeters, null measurements, RC circuits from first-order ODEs.

---

## Concept Nodes

---

### Node 21.1 — Resistors in Series

- **id**: `resistors-series`
- **title**: Resistors in Series
- **formula**: $R_s = \sum_i R_i$ (same current $I$ through all elements; voltages add)

**principle**: In series, the same current flows through each element (single path). The voltages drop across each: $V_n = IR_n$; summing around the loop (Kirchhoff's voltage law) gives $\mathcal{E} = I\sum_i R_i \equiv IR_s$. The voltage division rule follows: $V_n/V_{\text{total}} = R_n/R_s$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $R_s$ | response — equivalent series resistance | Ω |
| $R_i$ | parameter — individual resistances | Ω |
| $I$ | driver — same current through all | A |

**causal-structure**: asymmetric — EMF drives current $I$; series resistance $R_s$ is the parameter limiting response.

**limits**: Applies to purely resistive DC circuits. Wire resistance (often neglected) is in series and matters for high-current runs.

**misconceptions**:
- "Series resistors share voltage equally" — only if all $R_i$ are equal; in general $V_n \propto R_n$.
- "Adding series resistance increases current" — it decreases current.

**prereqs**:
- `ohms-law` (foundational, 0.85)
- Kirchhoff's loop rule (foundational, 0.85)

---

### Node 21.2 — Resistors in Parallel

- **id**: `resistors-parallel`
- **title**: Resistors in Parallel
- **formula**: $\frac{1}{R_p} = \sum_i \frac{1}{R_i}$ (same voltage $V$ across all; currents add)

**principle**: In parallel, the same voltage appears across each element. Currents divide: $I_n = V/R_n$; Kirchhoff's junction rule gives $I_{\text{total}} = \sum_i V/R_i \equiv V/R_p$. The current divider rule: $I_n/I_{\text{total}} = R_p/R_n$. Total resistance is always less than any individual resistance — each branch provides an additional path for current.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $R_p$ | response — equivalent parallel resistance | Ω |
| $V$ | driver — same voltage across all branches | V |
| $I_n$ | response — current in branch $n$ | A |

**causal-structure**: asymmetric — applied $V$ drives each branch current independently.

**limits**: Adding parallel branches always decreases $R_p$ and increases total current from source.

**misconceptions**:
- "Parallel resistors each get the full current" — current divides; voltage stays the same.
- "Parallel resistance is larger than individual" — always smaller.

**prereqs**:
- `ohms-law` (foundational, 0.85)
- Kirchhoff's junction rule (foundational, 0.85)

---

### Node 21.3 — Series-Parallel Combinations

- **id**: `series-parallel-combinations`
- **title**: Series-Parallel Combinations
- **formula**: Reduce iteratively using $R_s = \sum R_i$ and $1/R_p = \sum 1/R_i$

**principle**: Most real circuits are combinations. Solve by iterative reduction: identify purely series or parallel sub-networks, replace with an equivalent resistance, and repeat until a single $R_{\text{eq}}$ remains. Then work backward to recover branch voltages and currents using Ohm's law at each stage. Circuits with loops that are not reducible to series/parallel (e.g., Wheatstone bridge, ladder networks) require the full Kirchhoff's equations (Node 21.5).

**limits**: Iterative reduction works only for *series-parallel reducible* networks. Mesh circuits require Kirchhoff's rules directly.

**prereqs**:
- `resistors-series` (foundational, 0.85)
- `resistors-parallel` (foundational, 0.85)

---

### Node 21.4 — EMF and Terminal Voltage

- **id**: `emf-terminal-voltage`
- **title**: EMF, Internal Resistance, and Terminal Voltage
- **formula**: $V_{\text{terminal}} = \mathcal{E} - Ir$ (discharge); $I = \mathcal{E}/(R_{\text{load}} + r)$

**principle**: A real voltage source (battery, generator) has an internal resistance $r$ in series with an ideal EMF $\mathcal{E}$. When current flows, the terminal voltage sags: $V_{\text{terminal}} = \mathcal{E} - Ir$. The EMF $\mathcal{E}$ is the open-circuit potential difference (energy per unit charge supplied by the source's non-electrostatic mechanism — chemical, mechanical, etc.). Internal resistance dissipates power $P_r = I^2 r$, reducing efficiency. As batteries age, $r$ increases → terminal voltage sags more under load → device fails.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\mathcal{E}$ | driver — EMF (open-circuit voltage) | V |
| $r$ | parameter — internal resistance | Ω |
| $I$ | response — current | A |
| $V_{\text{terminal}}$ | response — terminal voltage under load | V |
| $R_{\text{load}}$ | parameter — external load resistance | Ω |

**causal-structure**: asymmetric — $\mathcal{E}$ drives current through the total resistance $R_{\text{load}} + r$; the terminal voltage is what remains after the internal drop.

**limits**: Assumes constant $r$ (real $r$ depends on state of charge, temperature, discharge rate). For charging: $V_{\text{terminal}} = \mathcal{E} + Ir$ (external source forces current in, so terminal voltage is *higher* than EMF).

**misconceptions**:
- "A dead battery has no voltage" — often shows near-normal open-circuit $\mathcal{E}$; fails under load because $r$ has increased.
- "Battery voltage equals EMF" — only at zero current.
- "Internal resistance is negligible" — under heavy load ($I$ large), $Ir$ can dominate and waste most power.

**prereqs**:
- `ohms-law` (foundational, 0.85)
- `electric-power` (foundational, 0.85)
- `resistors-series` (foundational, 0.85)

---

### Node 21.5 — Kirchhoff's Rules

- **id**: `kirchhoffs-rules`
- **title**: Kirchhoff's Junction and Loop Rules (Derived from Maxwell's Equations)
- **formula**:
Junction rule (KCL): $\sum_k I_k = 0$ at any node (inflow = outflow)

Loop rule (KVL): $\sum_k \Delta V_k = 0$ around any closed loop

**principle**: Kirchhoff's rules are not independent axioms — they are consequences of Maxwell's equations in the lumped-circuit limit:

- **Junction rule** ← continuity equation $\nabla \cdot \vec{J} = 0$ at steady state: charge does not accumulate at a node, so net current out equals net current in.
- **Loop rule** ← Faraday's law $\oint \vec{E} \cdot d\vec{l} = -d\Phi_B/dt$: at low frequencies (quasi-static), $d\Phi_B/dt \approx 0$ for circuit loops, so $\oint \vec{E} \cdot d\vec{l} = 0$, meaning the potential returns to its starting value around any closed loop.

Application: assign branch currents (choose directions arbitrarily — negative result just means actual flow is reversed). Write $n-1$ independent junction equations (for $n$ nodes). Write as many independent loop equations as needed. Solve the system.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $I_k$ | response — branch currents (signed) | A |
| $\Delta V_k$ | parameter — potential change across each element | V |

**causal-structure**: symmetric — both rules are conservation constraints (charge conservation; energy conservation per unit charge).

**limits**: Lumped-circuit approximation valid when circuit dimensions $\ll$ electromagnetic wavelength $\lambda = c/f$. At high frequencies (RF, microwave), distributed effects require full Maxwell treatment.

**misconceptions**:
- "Kirchhoff's rules only work for complex circuits" — they apply to *any* circuit; series/parallel reductions are just Kirchhoff's rules in disguise.
- "A negative current result means I made an error" — it means actual flow is opposite to the assumed direction.

**prereqs**:
- `electric-current` (foundational, 0.85)
- `conservation-of-charge` (foundational, 0.85)
- Faraday's law (supporting, 0.55) — for the derivation of KVL

---

### Node 21.6 — Voltmeters and Ammeters

- **id**: `voltmeters-ammeters`
- **title**: DC Voltmeters and Ammeters
- **formula**:
Voltmeter: $R_{\text{series}} = V_{\text{fs}}/I_{\text{fs}} - R_G$ (large series R; connected in parallel)
Ammeter: $R_{\text{shunt}} = I_{\text{fs}} R_G / (I_{\text{measured}} - I_{\text{fs}})$ (small shunt R; connected in series)

**principle**: An ideal voltmeter draws zero current ($R \to \infty$; connected in parallel); an ideal ammeter has zero voltage drop ($R \to 0$; connected in series). Real meters inevitably perturb the circuit. A galvanometer deflects proportionally to current; extending its range uses a series resistor (voltmeter) or a shunt resistor (ammeter). The loading error — the perturbation introduced by the measurement — is a fundamental limitation that cannot be eliminated, only minimized.

**causal-structure**: asymmetric — the measured circuit drives the meter; the meter perturbs the circuit.

**limits**: Analog (galvanometer) meters largely replaced by digital multimeters (op-amp input stages, $R_{\text{in}} \gtrsim 10$ MΩ). Loading error still nonzero but negligible in most cases.

**misconceptions**:
- "A voltmeter is connected in series" — always in parallel (must be across the element being measured).
- "An ammeter is connected in parallel" — always in series (must carry the same current as the branch).
- "Connecting an ammeter in parallel is harmless" — the low shunt resistance across a voltage source drives enormous current, destroying the meter.

**prereqs**:
- `kirchhoffs-rules` (foundational, 0.85)
- `resistors-series` (foundational, 0.85)
- `resistors-parallel` (foundational, 0.85)

---

### Node 21.7 — Null Measurements

- **id**: `null-measurements`
- **title**: Null Measurements — Potentiometer and Wheatstone Bridge
- **formula**:
Potentiometer (null): $\mathcal{E}_x / \mathcal{E}_s = R_x / R_s$
Wheatstone bridge (null): $R_x = R_s(R_2/R_1)$

**principle**: A null measurement balances the unknown against a known standard until zero current flows through the detector. Because zero current flows at balance, the source circuit is not perturbed → higher accuracy than direct measurement. The Wheatstone bridge exploits Kirchhoff's rules: at balance, $V_b = V_d$ (bridge is balanced), giving $R_x/R_s = R_1/R_2$ from the voltage divider ratios on each side.

**causal-structure**: asymmetric — the balance condition ($I_G = 0$) is the response; $R_x$ is determined when balance is achieved.

**limits**: Accuracy limited by: finite galvanometer sensitivity, contact/wire resistances, temperature coefficients of standard resistors.

**misconceptions**:
- "Null means the measured quantity is zero" — null means zero current through the detector, not zero quantity.
- "Wheatstone bridge measures voltage directly" — it measures resistance via the null balance condition.

**prereqs**:
- `kirchhoffs-rules` (foundational, 0.85)
- `voltmeters-ammeters` (foundational, 0.85)

---

### Node 21.8 — RC Circuits and the Time Constant

- **id**: `rc-circuits`
- **title**: RC Circuits — First-Order ODE and Exponential Response
- **formula**:
Kirchhoff's loop rule → ODE:
$$\mathcal{E} = IR + V_C = R\frac{dQ}{dt} + \frac{Q}{C}$$

Charging solution: $Q(t) = C\mathcal{E}(1 - e^{-t/\tau})$, $V_C(t) = \mathcal{E}(1 - e^{-t/\tau})$, $\tau = RC$

Discharging: $V_C(t) = V_0 e^{-t/\tau}$, $I(t) = (V_0/R)e^{-t/\tau}$

**principle**: The RC circuit is governed by a first-order linear ODE derived directly from Kirchhoff's loop rule + $Q = CV_C$ + $I = dQ/dt$. The exponential solution $e^{-t/\tau}$ arises from the self-limiting nature of charging: as $V_C$ builds, it opposes the driving EMF, reducing the charging current, which slows further charging. After $t = \tau = RC$: $V_C = 0.632\mathcal{E}$ (63.2% charged). After $5\tau$: $V_C \approx 0.993\mathcal{E}$ (effectively fully charged). The ODE is analogous to: RC circuit ↔ Newton's law with drag ($ma = F - bv$ → exponential approach to terminal velocity).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\tau = RC$ | parameter — time constant | s |
| $V_C(t)$ | response — capacitor voltage | V |
| $\mathcal{E}$ | driver — source EMF | V |
| $R$ | parameter — resistance | Ω |
| $C$ | parameter — capacitance | F |

**causal-structure**: asymmetric — $\mathcal{E}$ drives charging; $R$ and $C$ determine the timescale $\tau$.

**limits**: Assumes ideal components (no capacitor leakage, constant $R$). Battery internal resistance $r$ is in series with $R$; effective time constant is $(R+r)C$.

**misconceptions**:
- "The capacitor is fully charged after $\tau$" — it's only 63% charged; approaches full charge asymptotically.
- "Larger $R$ doesn't change the final charge" — it slows charging but the final charge $Q_\infty = C\mathcal{E}$ is the same (independent of $R$).
- "Discharging is faster than charging" — same $\tau = RC$ for both (if $R$ is the same).

**prereqs**:
- `capacitance` (foundational, 0.85)
- `kirchhoffs-rules` (foundational, 0.85)
- First-order linear ODEs (foundational, 0.85)
- `emf-terminal-voltage` (supporting, 0.55)

---

## Cross-Chapter Connections

- **← Ch. 18–20**: KCL ← $\nabla \cdot \vec{J} = 0$; KVL ← $\oint \vec{E} \cdot d\vec{l} = 0$.
- **→ Ch. 23 (AC Circuits)**: RC time constant is the gateway to impedance; $\tau = RC$ → $X_C = 1/(\omega C)$. The RC circuit ODE becomes an algebraic phasor equation $\tilde{V} = \tilde{I}(R + 1/i\omega C)$.
- **→ Ch. 23 (Inductors)**: The RC ODE is the capacitive dual of the RL ODE ($\mathcal{E} = LdI/dt + IR$, $\tau_L = L/R$). Present them together once inductors are introduced.

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Series resistance | $R_s = \sum_i R_i$ |
| Parallel resistance | $1/R_p = \sum_i 1/R_i$ |
| Terminal voltage | $V_{\text{term}} = \mathcal{E} - Ir$ |
| KCL (junction) | $\sum_k I_k = 0$ |
| KVL (loop) | $\sum_k \Delta V_k = 0$ |
| RC ODE | $\mathcal{E} = R(dQ/dt) + Q/C$ |
| RC charging | $V_C(t) = \mathcal{E}(1-e^{-t/RC})$ |
| RC discharging | $V_C(t) = V_0 e^{-t/RC}$ |
| RC time constant | $\tau = RC$ |

## Instructor Notes (PHY 132 / Advanced Track)

The key upgrade in this chapter: show explicitly that KVL and KCL are not axioms but consequences of Maxwell's equations ($\nabla \cdot \vec{J} = 0$ and $\oint \vec{E} \cdot d\vec{l} = 0$ at low frequency). The RC circuit ODE (Node 21.8) should be derived fully — write Kirchhoff's loop rule, substitute $V_C = Q/C$ and $I = dQ/dt$, and solve the first-order linear ODE explicitly. Students who can do this carry a transferable skill (analogous problems appear everywhere: Newton's law with drag, radioactive decay, thermal relaxation). The time constant $\tau = RC$ will reappear as $1/(\omega_0)$ at resonance in Ch. 23.
