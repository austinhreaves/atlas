# Chapter 18: Electric Charge and Electric Field

## Chapter Overview

Chapter 18 opens the electromagnetism sequence. It establishes the fundamental properties of electric charge (two types, quantized, conserved), the microscopic origin of charge in electrons and protons, methods of charging objects, Coulomb's Law for the force between point charges, the concept of the electric field as a force-per-unit-charge, field lines as a visualization tool, and the behavior of conductors in electrostatic equilibrium. Brief excursions into biological relevance (DNA, polar molecules, wound healing) and practical applications (Van de Graaff generators, xerography, electrostatic precipitators) round out the chapter.

---

## Concept Nodes

---

### 18.1 — Electric Charge

- **id**: `electric-charge`
- **title**: Electric Charge
- **formula**: $q = ne$, where $e = 1.602 \times 10^{-19}$ C (fundamental charge)
- **principle**: Electric charge is an intrinsic property of matter. There are exactly two types: positive (protons) and negative (electrons). Like charges repel; unlike charges attract. Charge is quantized — all observable charges are integer multiples of $e$. Charge is a conserved quantity: the total charge in any isolated system is constant.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $q$ | Electric charge | C (coulombs) |
| $e$ | Elementary charge | $1.602 \times 10^{-19}$ C |
| $n$ | Integer number of elementary charges | dimensionless |

**causal**: Intrinsic — charge is a property of particles, not derived from other quantities.

**tags**: `electric-charge`, `quantization`, `conservation-of-charge`, `electrons`, `protons`, `fundamental-charge`

**limits**:
- Quarks carry fractional charges ($\pm e/3$, $\pm 2e/3$) but are never observed in isolation.
- In pair creation/annihilation, equal and opposite charges are always created or destroyed together, preserving net charge.

**misconceptions**:
- "Positive charge means protons were added" — in most everyday situations, positive charge results from *electrons being removed* (protons don't move in solids).
- "Charge can be created" — charge is only *transferred* or *separated*, never created from nothing; conservation of charge is absolute.
- "There are more than two types of charge" — only positive and negative exist.

**prereqs**: Atoms and atomic structure (conceptual), fundamental forces (Ch. 4)

---

### 18.2 — Conservation of Charge

- **id**: `conservation-of-charge`
- **title**: Law of Conservation of Charge
- **formula**: $\sum q_{total} = \text{constant}$ in any isolated process
- **principle**: The total electric charge in the universe is constant. Charge cannot be created or destroyed — only transferred between objects. Even in pair production ($E \rightarrow e^- + e^+$), the net charge created is zero. Conservation of charge is as fundamental as conservation of energy and momentum.

**causal**: Symmetric — conservation is a constraint, not a causal relationship.

**tags**: `conservation-law`, `charge-conservation`, `pair-production`

**limits**: No exceptions have ever been observed.

**misconceptions**: "When you rub glass with silk, charge is created in the glass" — charge is transferred from silk to glass (or vice versa); the total charge of glass + silk is unchanged.

**prereqs**: `electric-charge`

---

### 18.3 — Conductors and Insulators

- **id**: `conductors-insulators`
- **title**: Conductors and Insulators
- **formula**: (conceptual; no single formula)
- **principle**: **Conductors** allow charges (free electrons in metals, free ions in solutions) to move freely. **Insulators** hold charges fixed — electrons are bound to atoms. This dichotomy governs how charge distributes itself and how charging methods work.

**causal**: Material property — determined by atomic/molecular structure (band gap in solid-state physics).

**tags**: `conductor`, `insulator`, `free-electrons`, `ions`, `semiconductor`

**limits**:
- Superconductors: charge moves with zero resistance.
- Semiconductors are intermediate; their conductivity is controllable.
- Pure water is an insulator; salty water conducts (free ions).

**misconceptions**:
- "Metals are positive and non-metals are negative" — the sign of charge has nothing to do with being a conductor.
- "Insulators have no charges" — insulators have plenty of charges; they just can't move freely.

**prereqs**: `electric-charge`

---

### 18.4 — Methods of Charging

- **id**: `methods-of-charging`
- **title**: Charging by Contact, Friction, and Induction
- **formula**: (process-based; no single formula)
- **principle**: Three methods to charge objects: (1) **Friction**: rubbing transfers electrons between materials (one gains, one loses). (2) **Contact**: direct touch with a charged object transfers same-sign charge. (3) **Induction**: a nearby charge redistributes charges in a neutral object *without contact*; grounding during induction leaves the object with the *opposite* sign charge.

**causal**: Asymmetric — external charged object causes redistribution; process determines sign and magnitude of induced charge.

**tags**: `charging`, `induction`, `contact`, `friction`, `grounding`, `polarization`

**limits**: Charging by induction requires that the object be disconnected from ground *before* the inducing charge is removed (critical sequence).

**misconceptions**:
- "Charging by induction leaves the object with the same sign charge" — induction produces **opposite** sign charge (unlike charging by contact, which produces **same** sign).
- "Grounding removes all charges" — grounding allows charge to flow to/from the large reservoir of Earth, equilibrating charge.

**prereqs**: `conductors-insulators`, `electric-charge`

---

### 18.5 — Coulomb's Law

- **id**: `coulombs-law`
- **title**: Coulomb's Law
- **formula**: $F = k\frac{|q_1 q_2|}{r^2}$, where $k = 8.99 \times 10^9$ N·m²/C²
- **principle**: The electrostatic (Coulomb) force between two point charges is proportional to the product of their charges and inversely proportional to the square of their separation. It acts along the line connecting the charges. Like charges repel, unlike attract. Coulomb's Law is structurally identical to Newton's Law of Gravitation ($F = Gm_1m_2/r^2$) but ~$10^{36}$ times stronger between an electron and proton.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $F$ | Coulomb force | N |
| $k$ | Coulomb's constant ($1/4\pi\epsilon_0$) | N·m²/C² |
| $q_1, q_2$ | Point charges | C |
| $r$ | Separation between charges | m |

**causal**: Symmetric — each charge exerts equal and opposite force on the other (Newton's Third Law applies).

**tags**: `coulombs-law`, `electrostatic-force`, `inverse-square-law`, `point-charge`

**limits**:
- Exactly valid for point charges; requires integration for extended charge distributions.
- Verified experimentally to 1 part in $10^{16}$.
- At sub-nuclear distances, nuclear forces dominate.

**misconceptions**:
- "Coulomb force is strong at macroscopic scales" — on macroscopic scales, positive and negative charges nearly cancel, so gravity (always attractive, never canceling) dominates. Coulomb dominates at atomic/molecular scales.
- "The force depends on only one charge" — it depends on the product of *both* charges.

**prereqs**: `electric-charge`, Newton's Second and Third Laws (Ch. 4)

**visual**: Two point charges with force arrows showing Newton's Third Law pair; graph of $F$ vs. $r$ showing inverse-square fall-off.

**order-of-magnitude**: Coulomb force between electron and proton at ~0.05 nm (hydrogen atom): ~$8 \times 10^{-8}$ N; gravitational force between same pair: ~$3.6 \times 10^{-47}$ N. Ratio: ~$10^{39}$.

---

### 18.6 — Electric Field

- **id**: `electric-field`
- **title**: Electric Field
- **formula**: $\vec{E} = \frac{\vec{F}}{q_0}$; for a point charge: $E = k\frac{Q}{r^2}$
- **principle**: The electric field is a vector field that encodes the force-per-unit-charge that any positive test charge would experience at a given point in space. It is defined to depend only on the *source* charge $Q$ and position, not on the test charge $q_0$. Once $\vec{E}$ is known, the force on any charge $q$ placed there is $\vec{F} = q\vec{E}$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{E}$ | Electric field | N/C |
| $\vec{F}$ | Coulomb force on test charge | N |
| $q_0$ | Test charge (small, positive by convention) | C |
| $Q$ | Source charge | C |
| $r$ | Distance from source | m |
| $k$ | Coulomb's constant | N·m²/C² |

**causal**: Asymmetric — source charge $Q$ *creates* the field; the field then *exerts force* on any other charge placed in it.

**tags**: `electric-field`, `field-concept`, `force-per-unit-charge`, `point-charge`, `vector-field`

**limits**:
- Test charge must be small enough not to disturb the source charge distribution.
- For extended distributions, $\vec{E}$ is found by integration (superposition).

**misconceptions**:
- "The electric field exists only when a test charge is present" — the field exists in space regardless of whether anything is there to experience it. It is a property of the region of space around a charge.
- "A negative charge feels a force in the direction of $\vec{E}$" — negative charges feel forces *opposite* to $\vec{E}$, since $\vec{F} = q\vec{E}$ with $q < 0$.

**prereqs**: `coulombs-law`, vector arithmetic (Ch. 3)

---

### 18.7 — Electric Field Lines

- **id**: `electric-field-lines`
- **title**: Electric Field Lines
- **formula**: (visualization tool; density $\propto E$)
- **principle**: Electric field lines are a pictorial representation of $\vec{E}$. Direction: tangent to line at each point (in direction a positive test charge would be pushed). Density: proportional to field strength. Rules: lines begin on positive charges, end on negative charges (or at infinity for isolated charges); lines never cross; number of lines $\propto$ magnitude of charge.

**causal**: Field lines represent the field — they don't cause anything; they are a visualization, not physical entities.

**tags**: `field-lines`, `electric-field`, `visualization`, `superposition`

**limits**: Field lines are a 2D/3D visualization aid — the actual field is continuous everywhere.

**misconceptions**:
- "Field lines show where charges travel" — charges may follow field lines only in special cases; field lines show the *force direction*, not necessarily the trajectory.
- "Field lines can cross" — impossible; crossing would imply two different field directions at one point (the field is unique at each point).

**prereqs**: `electric-field`

**visual**: Point positive charge (radial lines out); point negative charge (radial lines in); dipole (field lines from + to −); two equal positive charges (lines repel between them).

---

### 18.8 — Superposition of Electric Fields

- **id**: `electric-field-superposition`
- **title**: Superposition of Electric Fields
- **formula**: $\vec{E}_{total} = \vec{E}_1 + \vec{E}_2 + \ldots$ (vector sum)
- **principle**: The total electric field from multiple source charges is the *vector sum* of the individual fields. This principle, called superposition, is exact (electromagnetic theory is linear). To find the total field at a point: compute each charge's contribution as a vector, then add them.

**causal**: Symmetric — each source charge independently contributes to the total field; they don't interact through the field (at the classical level).

**tags**: `superposition`, `electric-field`, `vector-addition`

**limits**: Superposition holds in linear media (vacuum, most materials at ordinary field strengths). Breaks down in nonlinear media.

**misconceptions**: Students often add magnitudes instead of performing vector addition — direction matters critically.

**prereqs**: `electric-field`, vector addition (Ch. 3)

---

### 18.9 — Conductors in Electrostatic Equilibrium

- **id**: `conductor-electrostatic-equilibrium`
- **title**: Conductors in Electrostatic Equilibrium
- **formula**: $\vec{E}_{inside} = 0$; $\vec{E}_{surface}$ is perpendicular to surface
- **principle**: When a conductor reaches electrostatic equilibrium, three properties hold: (1) **$\vec{E} = 0$ inside** — any internal field would cause free charges to move until it vanished. (2) **All excess charge resides on the surface**. (3) **$\vec{E}$ just outside is perpendicular to the surface**. Charge concentrates most at sharp points/high curvature, where field strength is greatest.

**causal**: Asymmetric — free charges in the conductor respond to any applied field by redistributing until equilibrium is established.

**tags**: `conductor`, `electrostatic-equilibrium`, `surface-charge`, `faraday-cage`, `shielding`

**limits**: Applies only in static equilibrium. Dynamic situations (AC, transient currents) are different.

**misconceptions**:
- "Charge distributes uniformly on a conductor" — only on a sphere. Non-spherical conductors concentrate charge at points/edges.
- "The electric field inside a Faraday cage is zero only if the cage is grounded" — $\vec{E} = 0$ inside any closed conducting shell regardless of grounding.

**prereqs**: `conductors-insulators`, `electric-field`

**real-world**: Lightning rods (sharp → charge bleeds off, preventing strike); Faraday cages (cars during lightning, MRI rooms, microwave oven door mesh); Van de Graaff generators (smooth sphere → charge accumulates, not bleeds); parallel plate capacitors (uniform field between plates).

---

### 18.10 — Electric Dipole

- **id**: `electric-dipole`
- **title**: Electric Dipole and Polarization
- **formula**: $\vec{p} = q\vec{d}$ (dipole moment; $q$ = charge magnitude, $d$ = separation vector from − to +)
- **principle**: A dipole consists of equal and opposite charges separated by a small distance. The dipole moment $\vec{p}$ characterizes its strength and orientation. Polar molecules (e.g., water, $H_2O$) are permanent dipoles due to unequal charge sharing. Non-polar objects can be *induced* dipoles when an external field shifts their charge distribution. The resulting attraction to any nearby charge explains why neutral objects are attracted to charged objects.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{p}$ | Electric dipole moment | C·m |
| $q$ | Charge magnitude | C |
| $d$ | Separation | m |

**causal**: Asymmetric — external field induces polarization; polarization then responds to field.

**tags**: `dipole`, `polarization`, `polar-molecule`, `water`, `induced-dipole`, `screening`

**limits**: Dipole approximation is valid when the separation is small compared to the distance to the observer.

**misconceptions**: "Neutral objects feel no electrostatic force" — false; polarization means the closer side has opposite charge, which is attracted more strongly than the farther same-sign side is repelled, producing a net attractive force.

**prereqs**: `electric-charge`, `coulombs-law`

**pre-med relevance**: DNA is highly charged (~2 elementary charges per 0.34 nm); water's polarity screens Coulomb interactions in cells, making electrostatics shorter-range; ion movement across cell membranes (Na⁺, K⁺, Ca²⁺) drives nerve impulses; the "fast block" in fertilization (wave of negativity in egg membrane) is an electrostatic phenomenon.

---

### 18.11 — Electrostatic Applications

- **id**: `electrostatic-applications`
- **title**: Applications of Electrostatics
- **formula**: (application-specific; principles apply)
- **principle**: Practical exploitation of electrostatic principles: Van de Graaff generators (charge accumulates on sphere, can produce MV potentials); xerography/laser printers (photoconductor drum selectively charged by light, toner attracted by opposite charge); ink-jet printers (charged droplets deflected by plates); electrostatic precipitators (charge particles, then attract to oppositely charged grid — removes >99% of particulates from stack gas).

**tags**: `van-de-graaff`, `xerography`, `electrostatic-precipitator`, `laser-printer`, `applications`

**prereqs**: `conductor-electrostatic-equilibrium`, `electric-field`

**real-world** (PHY 114/132 relevance): Air quality (precipitators), industrial/medical imaging (laser printers, xerography), safety (grounding gasoline pumps, Faraday cages).

---

## Cross-Chapter Connections

- **← Ch. 4 (Newton's Laws)**: Coulomb force obeys Newton's Third Law; $\vec{F} = q\vec{E}$ is used with $\vec{F} = m\vec{a}$ to find particle accelerations in fields.
- **→ Ch. 19 (Electric Potential)**: Electric potential (voltage) is the scalar energy-per-charge counterpart to the vector electric field; $E = -\Delta V / \Delta r$ for uniform fields.
- **→ Ch. 20 (Current and Resistance)**: Current = charge flow; conductors in electrostatic equilibrium become conductors carrying current when a potential difference is applied.
- **→ Ch. 21 (Circuits)**: Capacitors store charge on conductors separated by insulators — direct application of Ch. 18 field concepts.
- **→ Ch. 22 (Magnetism)**: Magnetism arises from moving charges; the electromagnetic force unifies Coulomb's Law with magnetic force.
- **Pre-med bridge**: DNA structure, membrane potentials, bioelectricity, wound healing, nerve conduction — all grounded in this chapter's physics.

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Quantization of charge | $q = ne$, $e = 1.602 \times 10^{-19}$ C |
| Coulomb's Law | $F = k\dfrac{\|q_1 q_2\|}{r^2}$, $k = 8.99 \times 10^9$ N·m²/C² |
| Electric field (definition) | $\vec{E} = \vec{F}/q_0$ |
| Electric field (point charge) | $E = k Q/r^2$ |
| Force from field | $\vec{F} = q\vec{E}$ |
| Superposition | $\vec{E}_{total} = \sum \vec{E}_i$ |
| Inside conductor | $\vec{E} = 0$ |
| Dipole moment | $\vec{p} = q\vec{d}$ |

## Instructor Notes (PHY 132 / PHY 114 Relevance)

The transition from mechanics to electromagnetism is conceptually jarring for students — the "force at a distance" now mediated by a *field* rather than contact is the key abstraction to nail. The field concept is the gateway to everything in E&M. For PHY 114 (pre-med track): the biology sections (18.6 — electric forces in DNA, polar water molecules, membrane depolarization) are highly motivating and worth emphasizing. For PHY 132 (engineering track): Coulomb's Law as a vector force problem, superposition, and field-line reasoning are the technical workhorse skills.
