# Chapter 17: Physics of Hearing

## Chapter Overview

Chapter 17 applies the wave physics of Chapter 16 to sound specifically. It covers the nature of sound as a longitudinal pressure wave, the speed of sound and its medium/temperature dependence, the decibel scale of intensity, the Doppler effect and sonic booms, standing waves in air columns (the physics of wind instruments and voices), the biology and physics of hearing, and medical/industrial uses of ultrasound. The chapter is rich in pre-med relevant content (hearing damage, audiograms, cochlear implants, ultrasound diagnostics) and engineering content (resonant cavities, Doppler radar).

---

## Concept Nodes

---

### 17.1 — Sound as a Longitudinal Wave

- **id**: `sound-longitudinal-wave`
- **title**: Sound as a Longitudinal Pressure Wave
- **formula**: (conceptual; $v_w = f\lambda$ applies)
- **principle**: Sound is a mechanical disturbance propagating through matter as alternating compressions (high pressure) and rarefactions (low pressure). It is longitudinal in fluids (displacement parallel to propagation). It requires a material medium — no sound in a vacuum.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f$ | Frequency of oscillation | Hz |
| $\lambda$ | Wavelength | m |
| $v_w$ | Wave speed (medium-dependent) | m/s |

**causal**: Asymmetric — a vibrating source compresses surrounding medium; compressions propagate outward, carrying energy.

**tags**: `sound`, `longitudinal-wave`, `pressure-wave`, `compression`, `rarefaction`

**limits**: In solids, sound can also be transverse. In a vacuum, sound cannot propagate.

**misconceptions**:
- "Sound is a transverse wave" — sound in air and fluids is longitudinal (pressure variations parallel to propagation). Only in solids can it have transverse components.
- "Matter travels with the sound wave" — matter oscillates in place; energy propagates.

**prereqs**: `transverse-longitudinal-waves` (Ch. 16), `wave-properties` (Ch. 16)

---

### 17.2 — Speed of Sound

- **id**: `speed-of-sound`
- **title**: Speed of Sound
- **formula**: $v_w = (331 \text{ m/s})\sqrt{\frac{T}{273\text{ K}}}$ (in air); generally depends on bulk modulus and density of medium
- **principle**: Sound speed is determined by medium rigidity (bulk modulus) and density. More rigid or less compressible → faster sound. Lower density → faster sound (for similar rigidity). Sound in air (~343 m/s at 20°C) is much slower than in water (~1480 m/s) or steel (~5960 m/s). Speed is nearly frequency-independent in air — all audible frequencies travel together.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $v_w$ | Speed of sound | m/s |
| $T$ | Absolute temperature | K |

**causal**: Asymmetric — medium properties set $v_w$; frequency of source sets $f$; $\lambda = v_w/f$ adjusts as consequence.

**tags**: `speed-of-sound`, `medium-dependence`, `temperature-dependence`

**limits**:
- Temperature formula applies to ideal gases; more complex in real media.
- Speed is frequency-independent in non-dispersive media (air for audible range); this is why music doesn't distort over distance.

**misconceptions**:
- "Louder sound travels faster" — amplitude and propagation speed are independent.
- "Sound travels fastest in air" — it travels much faster in solids and liquids.
- When sound crosses a medium boundary, frequency stays the same (set by source), but speed and thus wavelength change.

**prereqs**: `wave-properties` (Ch. 16), density and bulk modulus concepts

**real-world**: Bat echolocation, earthquake P-wave vs. S-wave speed difference used to locate epicenters and probe Earth's interior.

---

### 17.3 — Sound Intensity and the Decibel Scale

- **id**: `sound-intensity-decibels`
- **title**: Sound Intensity and Sound Level (dB)
- **formula**: $I = \frac{P}{A}$; $\quad \beta = 10\log_{10}\!\left(\frac{I}{I_0}\right)$ dB, where $I_0 = 10^{-12}$ W/m²
- **principle**: Intensity (power per unit area, W/m²) spans ~12 orders of magnitude from threshold of hearing to damage threshold. The logarithmic decibel scale compresses this range to 0–120+ dB, matching the roughly logarithmic response of the ear. Each factor of 10 in intensity = 10 dB; doubling intensity ≈ +3 dB; quintupling intensity ≈ +7 dB.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $I$ | Sound intensity | W/m² |
| $I_0$ | Threshold of hearing reference | $10^{-12}$ W/m² |
| $\beta$ | Sound intensity level | dB |
| $P$ | Power | W |
| $A$ | Area | m² |

**causal**: Asymmetric — source power and geometry determine $I$; $\beta$ is derived from $I$.

**tags**: `decibels`, `sound-intensity`, `logarithmic-scale`, `hearing`, `noise-exposure`

**limits**: Decibel scale is purely a ratio comparison to $I_0$; different reference pressures give different dB values (e.g., underwater acoustics uses a different $I_0$).

**misconceptions**:
- "Doubling the decibels doubles the loudness" — dB is logarithmic; +10 dB is 10× the intensity.
- "120 dB is twice as loud as 60 dB" — 120 dB is $10^6$ times the intensity of 60 dB.
- Students often confuse intensity (physical, W/m²) with loudness (perceptual, phons) — they're related but not identical (loudness also depends on frequency).

**prereqs**: `wave-intensity` (Ch. 16), logarithms

**real-world**: Hearing protection standards (85 dB 8-hour limit), OSHA noise exposure rules, audiometry.

---

### 17.4 — Doppler Effect

- **id**: `doppler-effect`
- **title**: The Doppler Effect
- **formula**: Moving source: $f_{obs} = f_s \frac{v_w}{v_w \pm v_s}$; Moving observer: $f_{obs} = f_s \frac{v_w \pm v_{obs}}{v_w}$
- **principle**: Relative motion between a wave source and observer shifts the observed frequency. Approach → higher observed frequency (compressed wavelength); recession → lower (stretched wavelength). The wave speed in the medium is unchanged; only wavelength and thus frequency shift.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f_{obs}$ | Observed frequency | Hz |
| $f_s$ | Source frequency | Hz |
| $v_w$ | Wave speed in medium | m/s |
| $v_s$ | Source speed | m/s |
| $v_{obs}$ | Observer speed | m/s |

**sign convention**: Moving source toward observer: use minus (denominator smaller → $f_{obs}$ higher). Moving observer toward source: use plus (numerator larger → $f_{obs}$ higher).

**causal**: Asymmetric — relative motion *causes* the frequency shift.

**tags**: `doppler-effect`, `frequency-shift`, `moving-source`, `moving-observer`

**limits**:
- Formulas assume sub-sonic source speed ($v_s < v_w$); at $v_s = v_w$, observed frequency → ∞ (denominator → 0); above $v_w$, a sonic boom forms.
- Applies to all waves (sound, light, water waves, radar).

**misconceptions**:
- "The frequency shift is symmetric" — it's not. The shift approaching (+) differs in magnitude from the shift receding (−) for the same speed.
- "Source and observer moving together produce a shift" — no Doppler shift when source and observer have zero relative velocity (even if both are moving through the medium).

**prereqs**: `wave-properties` (Ch. 16), `speed-of-sound`

**real-world**: Ambulance sirens, police radar, Doppler weather radar, echocardiography blood flow measurement, redshift of galaxies (estimated age of universe ~14 billion years).

---

### 17.5 — Sonic Boom

- **id**: `sonic-boom`
- **title**: Sonic Boom and Bow Wake
- **formula**: Mach angle: $\sin\theta = \frac{v_w}{v_s}$ (Mach cone half-angle)
- **principle**: When a source moves faster than the wave speed, emitted wavefronts pile up into a conical shock wave (sonic boom for sound). The cone angle narrows as source speed increases. Constructive interference along the cone produces extreme pressure amplitude. Bow wakes (V-shaped wakes behind boats) are the 2D analog.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\theta$ | Half-angle of Mach cone | degrees |
| $v_s$ | Source speed | m/s |
| $v_w$ | Wave speed | m/s |

**causal**: Asymmetric — supersonic speed causes the conical shock wave.

**tags**: `sonic-boom`, `supersonic`, `shock-wave`, `Mach-cone`, `constructive-interference`

**limits**: The shock wave is not a continuous phenomenon — it passes an observer as a single event (boom).

**misconceptions**: "Sonic boom happens only at the moment of 'breaking the sound barrier'" — the boom is a continuous cone that sweeps along the ground as the aircraft flies.

**prereqs**: `doppler-effect`, `superposition-interference` (Ch. 16)

---

### 17.6 — Standing Waves in Air Columns

- **id**: `standing-waves-air-columns`
- **title**: Standing Waves in Air Columns (Open and Closed Tubes)
- **formula**: 
  - Closed one end: $f_n = n\frac{v_w}{4L}$, $n = 1, 3, 5, \ldots$ (odd harmonics only)
  - Open both ends: $f_n = n\frac{v_w}{2L}$, $n = 1, 2, 3, \ldots$ (all harmonics)
- **principle**: Sound resonates in tubes when standing waves form. Boundary conditions: closed end = **node** (no displacement); open end = **antinode** (maximum displacement). Closed-one-end tubes support only odd harmonics (giving a richer, darker timbre). Open tubes support all harmonics.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f_n$ | Frequency of $n$th harmonic | Hz |
| $L$ | Tube length | m |
| $v_w$ | Speed of sound in tube | m/s |
| $n$ | Harmonic number | dimensionless |

**causal**: Asymmetric — tube length and boundary conditions determine allowed resonant frequencies.

**tags**: `standing-waves`, `air-column`, `harmonics`, `resonance`, `musical-instruments`, `closed-tube`, `open-tube`

**limits**:
- Real instruments deviate from ideal tubes (end corrections, bell shapes, tone holes).
- Speed of sound is temperature-dependent, so resonant frequencies shift with temperature → musicians warm up instruments.

**misconceptions**:
- "Closed tubes produce the same harmonics as open tubes" — closed-one-end tubes skip even harmonics.
- Confusion between the node/antinode at open vs. closed ends: open = antinode (air can move freely), closed = node (wall prevents displacement).

**prereqs**: `standing-waves` (Ch. 16), `wave-properties` (Ch. 16), `speed-of-sound`

**real-world**: Wind instruments (flute = open both ends, clarinet = closed one end), organ pipes, vocal tract resonance (formants determine vowel sounds), noise-canceling headphones (destructive interference).

---

### 17.7 — Pitch, Loudness, and Timbre (Perception vs. Physics)

- **id**: `sound-perception`
- **title**: Sound Perception: Pitch, Loudness, Timbre
- **formula**: $\beta_{phon}$ read from equal-loudness curves (Fletcher-Munson); ear most sensitive 2000–5000 Hz
- **principle**: Three perceptual qualities map to physical quantities: **pitch** ↔ frequency; **loudness** ↔ intensity AND frequency (the phon scale, not just dB); **timbre** ↔ overtone spectrum (relative intensities of harmonics). Equal-loudness curves show that the ear is most sensitive at 2000–5000 Hz — sounds in that range seem louder at the same dB level.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| Phon | Loudness unit (perceptual) | phon |
| dB | Intensity level (physical) | dB |

**causal**: Bidirectional — physical quantities determine (but don't fully specify) perception; perception depends on ear's frequency response.

**tags**: `pitch`, `loudness`, `timbre`, `phon`, `hearing-perception`, `equal-loudness`, `auditory-range`

**limits**: Human audible range: 20–20,000 Hz. Below 20 Hz = infrasound; above 20,000 Hz = ultrasound. Ear sensitivity varies by frequency.

**misconceptions**:
- "Loudness = intensity level in dB" — loudness (phons) also depends on frequency. A 60 dB tone at 100 Hz sounds much quieter than a 60 dB tone at 3000 Hz.
- "Infrasound and ultrasound are imperceptible to all animals" — dogs, bats, dolphins, elephants all perceive ranges humans cannot.

**prereqs**: `sound-intensity-decibels`, `standing-waves-air-columns`

**real-world**: Audiograms, hearing aids, presbycusis (age-related high-frequency loss), 4000 Hz dip from noise exposure, cochlear implants.

---

### 17.8 — Anatomy of Hearing

- **id**: `hearing-mechanism`
- **title**: The Hearing Mechanism
- **formula**: Middle ear amplifies pressure by ~40×; cochlea performs frequency analysis
- **principle**: Outer ear (ear canal) acts as a resonant cavity (peak sensitivity 2000–5000 Hz). Middle ear converts pressure waves to mechanical vibrations via ossicles (lever system, ~40× force amplification to oval window). Inner ear (cochlea) separates frequencies: high frequencies excite near end, low near far end. Hair cells transduce mechanical vibration to electrical nerve signals.

**causal**: Asymmetric — physical sound wave → mechanical → electrical neural signal (transduction chain).

**tags**: `hearing`, `cochlea`, `ossicles`, `transduction`, `frequency-analysis`, `hair-cells`

**limits**: Damage to hair cells (from noise or age) is generally irreversible. Middle ear damage (conductive loss) can be partly compensated with bone conduction.

**misconceptions**: Loudness at the ear is not the only hearing hazard — duration and frequency also matter; peak exposure at ~4000 Hz is where most noise-induced damage occurs.

**prereqs**: `sound-intensity-decibels`, `sound-perception`

**real-world** (pre-med relevance): Audiograms, conductive vs. sensorineural hearing loss, cochlear implants (electrode array emulating ~24 frequency channels of the cochlea).

---

### 17.9 — Acoustic Impedance

- **id**: `acoustic-impedance`
- **title**: Acoustic Impedance
- **formula**: $Z = \rho v_w$
- **principle**: Acoustic impedance $Z$ characterizes how much a medium resists sound propagation. At boundaries between media of different $Z$, some sound is reflected and some transmitted. Large impedance mismatch → large reflection (e.g., tissue-air interface reflects ~99.9%). Gel is used in ultrasound to match impedances between transducer and skin.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $Z$ | Acoustic impedance | kg/(m²·s) = Pa·s/m |
| $\rho$ | Density of medium | kg/m³ |
| $v_w$ | Speed of sound in medium | m/s |

**causal**: Asymmetric — impedance mismatch determines fraction reflected at boundary.

**tags**: `acoustic-impedance`, `reflection`, `transmission`, `ultrasound`, `boundary-conditions`

**limits**: Applies at normal incidence; angle-dependent at oblique incidence.

**misconceptions**: Students may think gel in ultrasound is for patient comfort — it's primarily for impedance matching to eliminate air gaps that would reflect nearly all signal.

**prereqs**: `speed-of-sound`, `wave-intensity` (Ch. 16)

---

### 17.10 — Intensity Reflection Coefficient

- **id**: `intensity-reflection-coefficient`
- **title**: Intensity Reflection Coefficient
- **formula**: $a = \left(\frac{Z_2 - Z_1}{Z_2 + Z_1}\right)^2$
- **principle**: The fraction of intensity reflected at a boundary depends on the impedance contrast. $a = 0$ when $Z_1 = Z_2$ (perfect transmission, no reflection). $a \approx 1$ for large mismatch (nearly all intensity reflected). Ultrasound imaging relies on partial reflections at tissue boundaries.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $a$ | Intensity reflection coefficient | dimensionless (0–1) |
| $Z_1, Z_2$ | Acoustic impedances of adjacent media | kg/(m²·s) |

**tags**: `reflection-coefficient`, `ultrasound`, `imaging`, `boundary`

**prereqs**: `acoustic-impedance`

---

### 17.11 — Ultrasound Applications

- **id**: `ultrasound-applications`
- **title**: Ultrasound: Medical Diagnostics and Therapy
- **formula**: Resolution limit $\approx \lambda = v_w/f$; Doppler-shift beat frequency used for velocity measurement
- **principle**: Ultrasound (>20 kHz) has shorter wavelength → finer resolution. Diagnostic ultrasound (~1–10 MHz) uses pulse-echo timing to image tissue boundaries. Therapeutic ultrasound (~$10^3$–$10^9$ W/m²) causes cavitation and thermal damage to destroy tissue (gallstones, tumors). Doppler ultrasound measures blood velocity via beat frequency between transmitted and returned signal.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $f_{us}$ | Ultrasound frequency | MHz |
| $\lambda$ | Ultrasound wavelength in tissue | mm |

**causal**: Asymmetric — frequency choice trades off resolution (higher $f$ = finer detail) against penetration depth (higher $f$ = more absorption = shallower penetration).

**tags**: `ultrasound`, `medical-imaging`, `doppler-ultrasound`, `therapeutic-ultrasound`, `resolution`, `cavitation`

**limits**: Practical penetration ~$500\lambda$; for 7 MHz, ~11 cm into tissue. Cannot image through bone or air-filled cavities (too large impedance mismatch).

**misconceptions**: "All ultrasound doses are safe" — diagnostic intensities (~$10^{-2}$ W/m²) are safe; therapeutic intensities ($10^3$–$10^9$ W/m²) are intentionally destructive.

**prereqs**: `acoustic-impedance`, `intensity-reflection-coefficient`, `doppler-effect`, `beat-frequency` (Ch. 16)

**real-world** (pre-med): Fetal imaging, echocardiography, Doppler blood flow, lithotripsy (kidney stone destruction), ultrasound diathermy (muscle therapy).

---

## Cross-Chapter Connections

- **← Ch. 16**: All wave properties (SHM, standing waves, superposition, intensity) directly applied to sound.
- **→ Ch. 18–21 (E&M)**: Doppler effect generalizes to light (redshift, radar); acoustic impedance is analogous to electrical impedance in circuits.
- **→ Ch. 27 (Wave Optics)**: Interference and diffraction apply to light exactly as they do to sound; the argument "interference proves wave nature" applies to both.
- **→ Ch. 29 (Quantum)**: Wave-particle duality — electrons show interference just as sound does, confirming wave nature.
- **Pre-med bridge**: Audiograms, cochlear implants, ultrasound diagnostics, and hearing damage thresholds are directly clinically relevant.

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Wave relation | $v_w = f\lambda$ |
| Sound speed in air | $v_w = (331)\sqrt{T/273}$ m/s |
| Sound intensity level | $\beta = 10\log_{10}(I/I_0)$ dB |
| Doppler (moving source) | $f_{obs} = f_s \frac{v_w}{v_w \pm v_s}$ |
| Doppler (moving observer) | $f_{obs} = f_s \frac{v_w \pm v_{obs}}{v_w}$ |
| Closed-end tube harmonics | $f_n = n\frac{v_w}{4L}$, odd $n$ only |
| Open-end tube harmonics | $f_n = n\frac{v_w}{2L}$, all $n$ |
| Acoustic impedance | $Z = \rho v_w$ |
| Intensity reflection coeff. | $a = \left(\frac{Z_2 - Z_1}{Z_2 + Z_1}\right)^2$ |
