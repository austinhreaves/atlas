# Chapter 16: Oscillatory Motion and Waves

## Chapter Overview

Chapter 16 introduces oscillatory motion and wave phenomena as unified through a small set of underlying principles. The chapter moves from the restoring force of a spring (Hooke's Law), through the kinematics and energetics of simple harmonic motion, to wave propagation, superposition, interference, and energy transport. The unifying thread: SHM is the microscopic engine behind nearly all wave phenomena.

---

## Concept Nodes

---

### 16.1 — Hooke's Law (Restoring Force)

- **id**: `hookes-law-restoring-force`
- **title**: Hooke's Law
- **formula**: $F = -kx$
- **principle**: A restoring force proportional to displacement and opposite in direction is the condition for oscillatory motion. The negative sign encodes directionality: the force always pushes back toward equilibrium.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $F$ | Restoring force | N |
| $k$ | Spring (force) constant; stiffness of system | N/m |
| $x$ | Displacement from equilibrium | m |

**causal**: Asymmetric — displacement *causes* restoring force, not the reverse.

**tags**: `oscillation`, `elasticity`, `restoring-force`, `potential-energy`

**limits**:
- Valid only in the elastic (linear) regime; breaks down at large deformations (plastic deformation, fracture).
- Real springs deviate from linearity at high compression or extension.

**misconceptions**:
- Students often drop the negative sign or treat $F$ and $x$ as having the same sign — the minus sign is physically essential (force opposes displacement).
- "$k$ is a property of the spring only" — actually $k$ reflects the entire system's effective stiffness (e.g., car suspension, atomic bonds).

**prereqs**: Newton's Second Law (Ch. 4), work and potential energy (Ch. 7)

**visual**: Graph of $|F|$ vs. $x$: straight line through origin; slope = $k$.

**idealization**: Point mass attached to massless, ideal spring; no damping.

---

### 16.2 — Elastic Potential Energy

- **id**: `elastic-potential-energy`
- **title**: Elastic Potential Energy
- **formula**: $PE_{el} = \frac{1}{2}kx^2$
- **principle**: Work done deforming a Hookean system is stored as elastic potential energy, recoverable as kinetic energy upon release. Energy scales as the *square* of displacement.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $PE_{el}$ | Elastic potential energy | J |
| $k$ | Force constant | N/m |
| $x$ | Displacement from equilibrium | m |

**causal**: Symmetric — PE depends only on displacement magnitude, not direction.

**tags**: `potential-energy`, `energy-conservation`, `spring`

**limits**: Valid only within Hooke's Law regime.

**misconceptions**: Students conflate elastic PE with gravitational PE — both are potential energy, but the functional forms ($kx^2/2$ vs. $mgh$) differ; elastic PE is always positive regardless of sign of $x$.

**prereqs**: `hookes-law-restoring-force`, work-energy theorem (Ch. 7)

---

### 16.3 — Period and Frequency

- **id**: `period-frequency-relationship`
- **title**: Period and Frequency
- **formula**: $f = \frac{1}{T}$
- **principle**: Frequency (oscillations per second) and period (seconds per oscillation) are reciprocals. All periodic phenomena — mechanical, electromagnetic, biological — share this fundamental relationship.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $T$ | Period | s |
| $f$ | Frequency | Hz = s⁻¹ |

**causal**: Symmetric — defining relationship, no causal direction.

**tags**: `periodic-motion`, `frequency`, `period`, `hertz`

**limits**: Applies only to strictly periodic motion.

**misconceptions**: "Period and frequency are the same thing said differently" — true mathematically, but pedagogically important to track which is given and which is derived in problems.

---

### 16.4 — Simple Harmonic Motion (SHM)

- **id**: `simple-harmonic-motion`
- **title**: Simple Harmonic Motion
- **formula**: $x(t) = A\cos\!\left(\frac{2\pi t}{T}\right)$, $\quad T = 2\pi\sqrt{\frac{m}{k}}$, $\quad f = \frac{1}{2\pi}\sqrt{\frac{k}{m}}$
- **principle**: When the net restoring force obeys Hooke's Law, the resulting motion is sinusoidal. Period and frequency depend only on system stiffness and mass — *not* on amplitude. This amplitude-independence is the hallmark of SHM and the basis for its use in timekeeping.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $x(t)$ | Displacement as function of time | m |
| $A$ | Amplitude (maximum displacement) | m |
| $T$ | Period | s |
| $m$ | Mass of oscillating object | kg |
| $k$ | Force constant | N/m |
| $f$ | Frequency | Hz |

**causal**: Asymmetric — $k$ and $m$ jointly determine $T$ and $f$; amplitude is set by initial conditions independently.

**tags**: `SHM`, `oscillation`, `sinusoidal`, `amplitude-independence`, `timekeeping`

**limits**:
- Requires Hooke's Law to hold (linear restoring force).
- No damping; energy conserved.

**misconceptions**:
- "Heavier mass → faster oscillation" — opposite: larger $m$ *increases* $T$ (slows it).
- "Larger amplitude → higher frequency" — amplitude has *no effect* on frequency in SHM.
- Students often confuse $\omega = 2\pi f$ (angular frequency, rad/s) with $f$ (Hz); both appear in SHM equations.

**prereqs**: `hookes-law-restoring-force`, `period-frequency-relationship`, Newton's Second Law

**visual**: $x$, $v$, $a$ vs. $t$ plots showing phase relationships (cosine, −sine, −cosine); energy bar charts showing KE ↔ PE exchange.

**idealizations**: Massless spring, frictionless surface, no air resistance.

---

### 16.5 — Velocity and Acceleration in SHM

- **id**: `shm-kinematics`
- **title**: Velocity and Acceleration in SHM
- **formula**: $v(t) = -v_{max}\sin\!\left(\frac{2\pi t}{T}\right)$, $\quad a(t) = -\frac{k}{m}x(t)$, $\quad v_{max} = A\sqrt{\frac{k}{m}}$
- **principle**: Velocity and acceleration in SHM are 90° and 180° out of phase with displacement, respectively. Acceleration is directly proportional to displacement and oppositely directed — this is the defining equation of SHM. Maximum velocity occurs at equilibrium; zero velocity at maximum displacement.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $v_{max}$ | Maximum speed | m/s |
| $A$ | Amplitude | m |

**causal**: Asymmetric — displacement drives acceleration; velocity is a consequence of integrated acceleration.

**tags**: `SHM`, `kinematics`, `phase-relationship`

**misconceptions**: At maximum displacement, many students expect maximum velocity (by analogy with projectile motion). The opposite is true.

**prereqs**: `simple-harmonic-motion`, calculus of sinusoidal functions

---

### 16.6 — Simple Pendulum

- **id**: `simple-pendulum`
- **title**: Simple Pendulum
- **formula**: $T = 2\pi\sqrt{\frac{L}{g}}$
- **principle**: A pendulum bob on a massless string is a SHM system for small angles ($\theta < 15°$), where the effective restoring force is $F = -\frac{mg}{L}x$. Period depends only on string length and gravitational acceleration — *not* on mass or amplitude (for small $\theta$).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $T$ | Period | s |
| $L$ | String length | m |
| $g$ | Gravitational acceleration | m/s² |

**causal**: Asymmetric — $L$ and $g$ set $T$; mass is irrelevant.

**tags**: `pendulum`, `SHM`, `gravity`, `small-angle-approximation`

**limits**:
- Small-angle approximation ($\sin\theta \approx \theta$) required; breaks down for $\theta > ~15°$ (anharmonic behavior at large amplitudes).
- On other planets, $g$ changes, so $T$ changes.

**misconceptions**:
- "Heavier bob swings faster" — mass completely cancels from the period formula.
- "Larger swing = faster oscillation" — false for small angles; period is amplitude-independent.

**prereqs**: `simple-harmonic-motion`, gravitational force (Ch. 4)

**visual**: Pendulum with force components labeled ($mg\sin\theta$ tangential, $mg\cos\theta$ along string).

**idealization**: Massless, inextensible string; point mass bob; no air resistance; $\theta$ small.

---

### 16.7 — Energy Conservation in SHM

- **id**: `shm-energy-conservation`
- **title**: Energy in the Simple Harmonic Oscillator
- **formula**: $E = \frac{1}{2}mv^2 + \frac{1}{2}kx^2 = \frac{1}{2}kA^2 = \text{constant}$
- **principle**: Total mechanical energy in an undamped SHO is constant, continuously exchanged between kinetic and potential forms. Maximum KE occurs at $x = 0$; maximum PE at $x = \pm A$; both equal $\frac{1}{2}kA^2$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $E$ | Total mechanical energy | J |
| $A$ | Amplitude | m |

**causal**: Symmetric — energy conservation is a constraint, not a causal statement.

**tags**: `energy-conservation`, `SHM`, `kinetic-energy`, `potential-energy`

**limits**: Requires no non-conservative (damping) forces.

**misconceptions**: Energy is "lost" at equilibrium — false; it is entirely kinetic there.

**prereqs**: `elastic-potential-energy`, kinetic energy (Ch. 7)

---

### 16.8 — SHM and Uniform Circular Motion

- **id**: `shm-circular-motion-connection`
- **title**: SHM as Projection of Uniform Circular Motion
- **formula**: $x(t) = A\cos(\omega t)$, where $\omega = \frac{2\pi}{T}$
- **principle**: The shadow (projection onto one axis) of a particle moving in uniform circular motion is exactly SHM. This geometric equivalence gives the sinusoidal form of SHM equations and links angular frequency $\omega$ to period.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\omega$ | Angular frequency | rad/s |

**causal**: Conceptual/geometric equivalence — neither causes the other.

**tags**: `SHM`, `circular-motion`, `angular-frequency`, `phasor`

**prereqs**: `simple-harmonic-motion`, uniform circular motion (Ch. 6)

**visual**: Rotating ball casting shadow onto a screen; shadow traces out sinusoidal path.

---

### 16.9 — Damped Harmonic Motion

- **id**: `damped-harmonic-motion`
- **title**: Damped Harmonic Motion
- **formula**: $W_{nc} = \Delta KE + \Delta PE$ (energy removed by non-conservative force)
- **principle**: Real oscillators lose energy to friction and viscosity. Three regimes: **underdamped** (oscillates with decreasing amplitude), **critically damped** (returns to equilibrium fastest, no overshoot — optimal for instruments like scales and shock absorbers), **overdamped** (returns slowly, no oscillation).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $W_{nc}$ | Work by non-conservative (damping) force | J |
| $b$ | Damping coefficient (implied) | N·s/m |

**causal**: Asymmetric — damping force removes energy, reducing amplitude over time.

**tags**: `damping`, `energy-dissipation`, `critical-damping`, `real-oscillators`

**limits**: Period and frequency nearly unchanged for light damping; significantly altered with heavy damping.

**misconceptions**:
- "Critical damping is the same as overdamping" — critical damping is the boundary case that gives fastest return without oscillation.
- Students often expect period to change dramatically with small damping — it changes negligibly.

**prereqs**: `simple-harmonic-motion`, `shm-energy-conservation`, friction (Ch. 5)

**visual**: Amplitude vs. time plots for all three regimes overlaid; resonance curve with varying damping width.

---

### 16.10 — Forced Oscillations and Resonance

- **id**: `resonance`
- **title**: Forced Oscillations and Resonance
- **formula**: Maximum amplitude when $f_{drive} = f_{natural}$
- **principle**: When a periodic driving force matches a system's natural frequency, energy transfer is maximally efficient, producing resonance. Amplitude at resonance is limited only by damping. Less damping → sharper, taller resonance peak; more damping → broader response.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f_{natural}$ | Natural (resonant) frequency | Hz |
| $f_{drive}$ | Driving frequency | Hz |

**causal**: Asymmetric — driving at natural frequency causes resonance and amplitude buildup.

**tags**: `resonance`, `natural-frequency`, `forced-oscillation`, `energy-transfer`

**limits**: Amplitude grows unbounded only in the theoretical zero-damping limit; real systems always have some damping.

**misconceptions**: "Resonance always causes destruction" — resonance is *useful* in MRI, radio tuning, musical instruments; destruction (Tacoma Narrows) is the edge case of very low damping combined with sustained driving.

**prereqs**: `damped-harmonic-motion`, `natural-frequency`

**visual**: Amplitude vs. driving frequency curves for three damping values; resonance peak narrows and rises as damping decreases.

**real-world examples**: MRI (proton resonance at ~100 MHz), radio tuning (adjusting resonant frequency), child on swing, Tacoma Narrows Bridge collapse.

---

### 16.11 — Wave Properties

- **id**: `wave-properties`
- **title**: Wave Properties: Speed, Wavelength, Frequency
- **formula**: $v_w = f\lambda = \frac{\lambda}{T}$
- **principle**: A wave is a propagating disturbance that carries energy, not matter. The fundamental wave relation links propagation speed, wavelength, and frequency. This relationship is universal across all wave types (mechanical, electromagnetic, matter waves).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $v_w$ | Wave (propagation) speed | m/s |
| $\lambda$ | Wavelength (distance between identical phases) | m |
| $f$ | Frequency | Hz |
| $T$ | Period | s |

**causal**: $v_w$ is set by the *medium* (not frequency or amplitude); $f$ is set by the *source*; $\lambda$ adjusts as a consequence: $\lambda = v_w/f$.

**tags**: `wave`, `wavelength`, `frequency`, `wave-speed`, `propagation`

**limits**: $v_w = f\lambda$ assumes non-dispersive medium (wave speed independent of frequency). Dispersive media (e.g., deep water waves) break this.

**misconceptions**:
- "Water molecules travel with the wave" — false; molecules move in place (circles for water waves); energy propagates.
- "Louder sound = faster sound" — amplitude and propagation speed are independent.
- Conflating wave speed with particle speed in the medium.

**prereqs**: `period-frequency-relationship`, `simple-harmonic-motion`

---

### 16.12 — Transverse vs. Longitudinal Waves

- **id**: `transverse-longitudinal-waves`
- **title**: Transverse and Longitudinal Waves
- **formula**: (conceptual — no single formula)
- **principle**: In a **transverse wave**, particle displacement is perpendicular to propagation direction (e.g., string waves, electromagnetic waves). In a **longitudinal wave**, displacement is parallel to propagation (e.g., sound in air). Some waves (water, seismic) have both components.

**causal**: Wave type is determined by the medium's ability to support shear stress. Fluids cannot sustain shear → sound in air/water is always longitudinal.

**tags**: `transverse-wave`, `longitudinal-wave`, `wave-type`, `sound`, `EM-wave`

**limits**: Pure transverse or longitudinal is an idealization; many real waves are mixed.

**misconceptions**: "Sound is transverse" — sound in air is longitudinal (pressure variations parallel to propagation). Light is transverse.

**prereqs**: `wave-properties`

---

### 16.13 — Superposition and Interference

- **id**: `superposition-interference`
- **title**: Superposition and Interference
- **formula**: Constructive: $A_{result} = 2A$ (in phase); Destructive: $A_{result} = 0$ (out of phase)
- **principle**: When waves overlap, their displacements add algebraically (superposition). Constructive interference occurs when waves are in phase (crests align); destructive when out of phase (crest + trough). The *intensity* of constructively interfering waves scales as $A^2$, so doubling amplitude quadruples intensity.

**causal**: Symmetric — superposition is a mathematical property of linear wave equations; neither wave "causes" the other.

**tags**: `superposition`, `interference`, `constructive`, `destructive`, `amplitude`

**limits**: Applies to linear media only (amplitude small enough that medium responds linearly).

**misconceptions**: "Two waves of equal intensity that destructively interfere violate energy conservation" — energy is redistributed spatially, not destroyed; other regions have constructive interference.

**prereqs**: `wave-properties`

---

### 16.14 — Standing Waves

- **id**: `standing-waves`
- **title**: Standing Waves
- **formula**: Fundamental: $f_1 = \frac{v_w}{2L}$; Harmonics: $f_n = nf_1$
- **principle**: Two waves of equal amplitude and frequency traveling in opposite directions superimpose to form a standing wave — nodes (zero displacement, fixed) and antinodes (maximum displacement) alternate. The fundamental frequency is the longest standing wave pattern; overtones are integer multiples.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f_1$ | Fundamental frequency | Hz |
| $f_n$ | $n$th harmonic frequency | Hz |
| $L$ | Length of string/cavity | m |
| $v_w$ | Wave speed on string | m/s |
| $n$ | Harmonic number (positive integer) | dimensionless |

**causal**: Asymmetric — boundary conditions (fixed ends) determine allowed wavelengths; wave speed and length determine frequencies.

**tags**: `standing-waves`, `nodes`, `antinodes`, `harmonics`, `fundamental-frequency`, `resonance`

**limits**: Fixed-fixed boundary condition assumed here; other boundary conditions (open end, closed end) give different harmonic series.

**misconceptions**: "Nodes are where waves cancel completely and always" — nodes are fixed points of zero displacement in the steady-state standing wave, but energy still flows past them.

**prereqs**: `superposition-interference`, `wave-properties`

**visual**: String vibrating in 1st, 2nd, 3rd harmonics; nodes and antinodes labeled.

---

### 16.15 — Beat Frequency

- **id**: `beat-frequency`
- **title**: Beats
- **formula**: $f_{beat} = |f_1 - f_2|$
- **principle**: Two waves of slightly different frequencies superimpose to produce a wave at the average frequency whose amplitude oscillates at the beat frequency. Beats are audible as a periodic loudness fluctuation (warble) when frequencies are close.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f_{beat}$ | Beat frequency | Hz |
| $f_1, f_2$ | Frequencies of the two waves | Hz |

**causal**: Asymmetric — frequency difference causes beats; amplitude modulation is the result.

**tags**: `beats`, `interference`, `frequency-comparison`, `tuning`

**limits**: Beat frequency must be low enough to perceive as amplitude modulation rather than a distinct tone ($f_{beat} \lesssim$ ~20 Hz for audible beats).

**misconceptions**: "Beats produce a new frequency" — beats produce amplitude modulation at $f_{beat}$; the carrier is the average frequency $\bar{f}$.

**prereqs**: `superposition-interference`, `period-frequency-relationship`

**real-world examples**: Piano tuning (listen for beats going to zero), dual-engine aircraft noise, ultrasonic imaging.

---

### 16.16 — Wave Intensity

- **id**: `wave-intensity`
- **title**: Wave Intensity
- **formula**: $I = \frac{P}{A}$, and $I \propto A^2$ (amplitude squared)
- **principle**: Intensity is power per unit area delivered by a wave. It is proportional to the square of amplitude — doubling amplitude quadruples intensity. Intensity decreases with distance from a point source as energy spreads over increasing area.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $I$ | Intensity | W/m² |
| $P$ | Power | W |
| $A$ | Area perpendicular to propagation | m² |

**causal**: Asymmetric — source power and geometry determine intensity at a point.

**tags**: `intensity`, `power`, `amplitude`, `energy-transport`, `inverse-square`

**limits**: $I \propto 1/r^2$ (inverse square law) applies to point sources in 3D; doesn't apply to plane waves or in waveguides.

**misconceptions**: "Intensity doubles when amplitude doubles" — intensity scales as $A^2$, so intensity quadruples when amplitude doubles.

**prereqs**: `wave-properties`, `superposition-interference`

---

## Cross-Chapter Connections

- **→ Ch. 17 (Physics of Hearing)**: Sound as a longitudinal wave; intensity and decibels; Doppler effect.
- **→ Ch. 23 (EM Induction / AC Circuits)**: RLC resonance is the electrical analog of mechanical resonance; $\omega_0 = 1/\sqrt{LC}$ mirrors $\omega_0 = \sqrt{k/m}$.
- **→ Ch. 24 (EM Waves)**: All wave properties apply; $v = c$; transverse EM waves.
- **→ Ch. 27 (Wave Optics)**: Superposition and interference applied to light; Young's double-slit uses the same constructive/destructive interference logic.
- **← Ch. 5 (Friction)**: Damping forces in real oscillators.
- **← Ch. 7 (Work and Energy)**: Conservation of energy framework for SHM.

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Hooke's Law | $F = -kx$ |
| Elastic PE | $PE = \frac{1}{2}kx^2$ |
| SHM Period (spring) | $T = 2\pi\sqrt{m/k}$ |
| SHM Frequency | $f = \frac{1}{2\pi}\sqrt{k/m}$ |
| Pendulum Period | $T = 2\pi\sqrt{L/g}$ |
| SHM Max Velocity | $v_{max} = A\sqrt{k/m}$ |
| SHM Energy | $E = \frac{1}{2}kA^2$ |
| Wave Speed | $v_w = f\lambda$ |
| Beat Frequency | $f_{beat} = \|f_1 - f_2\|$ |
| Intensity | $I = P/A$; $I \propto A^2$ |
