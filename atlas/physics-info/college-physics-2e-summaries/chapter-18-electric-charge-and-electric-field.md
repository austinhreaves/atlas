# Chapter 18: Electric Charge and Electric Field
## Calculus-Based Physics (PHY 132 / Future Physicists)

**Chapter scope:** Intrinsic charge, conservation, Coulomb's law in vector form, the electric field as a vector integral over source distributions, Gauss's Law, field lines, superposition, conductor equilibrium, dipoles.

---

## Concept Nodes

---

### 18.1 — Electric Charge

- **id**: `electric-charge`
- **title**: Electric Charge
- **formula**: $q = ne$, where $e = 1.602 \times 10^{-19}$ C

**principle**: Electric charge is an intrinsic scalar property of matter. Two types exist — positive (protons) and negative (electrons) — with like charges repelling and unlike charges attracting. Charge is **quantized**: all observable free charges are integer multiples of $e$. Charge is a **conserved quantity** (Noether's theorem: conservation follows from global $U(1)$ phase symmetry of the Lagrangian). In any isolated system, $\sum q_i = \text{const}$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $q$ | response — charge of object | C |
| $e$ | parameter — elementary charge | $1.602 \times 10^{-19}$ C |
| $n$ | parameter — integer multiplicity | dimensionless |

**causal**: Intrinsic — charge is not derived from other classical quantities. The roles here are definitional: $q$ is the conserved quantity.

**causal-structure**: symmetric (conservation law; $q$ is conserved, $n$ and $e$ are parameters)

**limits**:
- Quarks carry fractional charges ($\pm e/3$, $\pm 2e/3$) but color confinement prevents isolation. Quark charges are observationally irrelevant at this level.
- In pair production ($\gamma \to e^- + e^+$), charge is conserved: net charge created is zero.
- At the field-theory level, charge is the Noether current of $U(1)$ symmetry — making conservation exact, not empirical.

**misconceptions**:
- "Positive charge means protons were added" — in solids, protons don't move; positive charge results from electrons being *removed*.
- "Charge can be created" — it is transferred or separated, never created from nothing.

**prereqs**:
- Atoms and atomic structure (foundational, weight 0.85)
- Noether's theorem / symmetry principles (lateral, weight 0.2)

---

### 18.2 — Conservation of Charge

- **id**: `conservation-of-charge`
- **title**: Law of Conservation of Charge
- **formula**: $\frac{d}{dt}\int_V \rho \, dV = -\oint_{\partial V} \vec{J} \cdot d\vec{A}$

**principle**: Charge is neither created nor destroyed — it flows. The differential form of charge conservation is the **continuity equation**:

$$\frac{\partial \rho}{\partial t} + \nabla \cdot \vec{J} = 0$$

The integral form states that the rate of change of total charge in any volume equals the net inward current flux through its surface. This is more general than the algebraic $\sum q = \text{const}$: it enforces *local* conservation — charge can't teleport.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\rho$ | conserved — charge density | C/m³ |
| $\vec{J}$ | response — current density | A/m² |
| $V$ | parameter — arbitrary control volume | m³ |

**causal-structure**: symmetric (conservation constraint, not a causal driver-response relation)

**limits**: No exceptions have ever been observed. Valid in all of classical and quantum electrodynamics.

**misconceptions**: "Rubbing glass on silk creates charge in the glass" — charge is transferred between materials; the algebraic sum of glass + silk charge is unchanged.

**prereqs**:
- `electric-charge` (foundational, 0.85)
- Divergence theorem (foundational, 0.85)

---

### 18.3 — Conductors and Insulators

- **id**: `conductors-insulators`
- **title**: Conductors and Insulators
- **formula**: (no single formula; characterized by conductivity $\sigma$; for metals $\sigma \sim 10^7$ S/m, insulators $\sigma \sim 10^{-14}$ S/m)

**principle**: A **conductor** contains a sea of freely mobile charge carriers (electrons in metals, ions in solutions). An **insulator** binds all charges to specific atomic sites. This is determined by band-gap structure: metals have overlapping conduction and valence bands; insulators have large band gaps ($\gtrsim 5$ eV). Semiconductors are intermediate and tunable. The conductivity $\sigma$ appears in the microscopic Ohm's law $\vec{J} = \sigma \vec{E}$.

**causal**: Material property — determined by quantum mechanical band structure, not by classical mechanics.

**causal-structure**: contextual — $\sigma$ mediates the response $\vec{J}$ to the driver $\vec{E}$; neither conductor nor insulator status *causes* charge — it determines charge *mobility*.

**limits**:
- Superconductors: $\sigma \to \infty$, $\vec{E} = 0$ inside (Meissner effect also expels $\vec{B}$).
- Semiconductors: $\sigma$ depends on doping, temperature, illumination.

**misconceptions**:
- "Insulators have no charges" — they have bound charges; the distinction is mobility, not presence.
- "Metals are always conductors" — at sufficiently low T, some metals superconduct; at very high fields, dielectric breakdown makes insulators conduct.

**prereqs**:
- `electric-charge` (foundational, 0.85)
- Quantum band theory (lateral, 0.2)

---

### 18.4 — Methods of Charging

- **id**: `methods-of-charging`
- **title**: Charging by Contact, Friction, and Induction
- **formula**: (process-based)

**principle**: Three mechanisms to produce macroscopic charge separation:
1. **Friction**: work function differences cause electron transfer between rubbed surfaces.
2. **Contact**: charge carriers flow from charged object to neutral one (same sign on both afterward).
3. **Induction**: a nearby charge polarizes a conductor by redistributing its free electrons; removing the ground connection *before* the inducing charge leaves results in net charge of *opposite* sign.

The physical mechanism in all three is the continuity equation: charge redistributes in response to $\vec{E}$, obeying $\partial\rho/\partial t + \nabla \cdot \vec{J} = 0$ until equilibrium ($\vec{J} = 0$).

**causal-structure**: asymmetric — the external charge or contact is the driver; the redistribution of charge on the target object is the response.

**limits**: Induction requires the object be disconnected from ground *before* the inducing charge is removed; sequence matters.

**misconceptions**:
- "Induction leaves the object with the same sign charge" — induction produces **opposite** sign (unlike contact, which produces same sign).

**prereqs**:
- `conductors-insulators` (foundational, 0.85)
- `conservation-of-charge` (foundational, 0.85)

---

### 18.5 — Coulomb's Law

- **id**: `coulombs-law`
- **title**: Coulomb's Law (Vector Form)
- **formula**:
$$\vec{F}_{12} = \frac{1}{4\pi\varepsilon_0} \frac{q_1 q_2}{r_{12}^2} \hat{r}_{12}$$
where $\hat{r}_{12}$ points from charge 2 to charge 1.

**principle**: The electrostatic force between two point charges is a vector along the line joining them, proportional to the product of charges and inversely proportional to the square of the separation. The scalar $k = 1/4\pi\varepsilon_0 = 8.99 \times 10^9$ N·m²/C². The inverse-square form arises from the 3D geometry of field lines radiating from a point source (solid angle argument). Structurally identical to Newton's law of gravitation but $\sim 10^{36}$ times stronger for electron-proton pairs.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{F}_{12}$ | response — force on charge 1 from charge 2 | N |
| $q_1, q_2$ | driver/parameter — source charges | C |
| $r_{12}$ | parameter — separation | m |
| $\varepsilon_0 = 8.85 \times 10^{-12}$ C²/(N·m²) | parameter — permittivity of free space | C²/(N·m²) |

**causal-structure**: symmetric — each charge exerts an equal and opposite force on the other (Newton's Third Law). Neither charge has causal priority; they are mutual sources.

**limits**:
- Exact only for point charges in vacuum; requires volume integration for extended distributions.
- Verified to 1 part in $10^{16}$; deviation would imply finite photon mass.
- Below nuclear separations (~fm), nuclear forces dominate.

**misconceptions**:
- "The force depends only on one charge" — it depends on the *product* $q_1 q_2$.
- "Coulomb force dominates at macroscopic scales" — opposite signs nearly cancel; gravity, always attractive, dominates macroscopic dynamics.

**prereqs**:
- `electric-charge` (foundational, 0.85)
- Newton's Second and Third Laws (foundational, 0.85)
- Vector arithmetic (foundational, 0.85)

**order-of-magnitude**: $F_C / F_G$ for electron-proton pair $\approx ke^2 / Gm_em_p \approx 2 \times 10^{39}$.

---

### 18.6 — Electric Field

- **id**: `electric-field`
- **title**: Electric Field (General Definition and Superposition Integral)
- **formula**: For a point charge: $\vec{E} = \frac{1}{4\pi\varepsilon_0} \frac{Q}{r^2} \hat{r}$

For a continuous charge distribution:
$$\vec{E}(\vec{r}) = \frac{1}{4\pi\varepsilon_0} \int \frac{\rho(\vec{r}\,')\,(\vec{r} - \vec{r}\,')}{|\vec{r} - \vec{r}\,'|^3} \, dV'$$

**principle**: The electric field is the force-per-unit-positive-test-charge at a point in space. It is a real physical field — it exists whether or not a test charge is present, and carries energy. The field of a source distribution is computed via the **superposition integral**: each infinitesimal volume element $dV'$ with charge $\rho(\vec{r}\,') \, dV'$ contributes a Coulomb field; the total is the vector integral. The test charge $q_0$ must be small enough not to perturb the source distribution.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{E}$ | response — field produced by source | N/C = V/m |
| $\rho(\vec{r}\,')$ | driver — source charge density | C/m³ |
| $q_0$ | covariate — test charge (infinitesimally small, does not perturb) | C |
| $\vec{r} - \vec{r}\,'$ | parameter — displacement from source element to field point | m |
| $\varepsilon_0$ | parameter — permittivity of free space | C²/(N·m²) |

**causal-structure**: asymmetric — source charges $\rho$ drive the field $\vec{E}$; the field then drives force on any charge placed in it: $\vec{F} = q\vec{E}$.

**limits**:
- The integral form requires knowing $\rho(\vec{r}\,')$ everywhere — often symmetry (Gauss's law) is more practical.
- The classical field picture breaks down at quantum scales; replace with QED.

**misconceptions**:
- "The field only exists when something is there to feel it" — the field is a real entity; it carries energy density $u = \frac{1}{2}\varepsilon_0 E^2$.
- "A negative charge feels force in the $\vec{E}$ direction" — negative charges experience $\vec{F} = q\vec{E}$ with $q < 0$, so force is antiparallel to $\vec{E}$.

**prereqs**:
- `coulombs-law` (foundational, 0.85)
- Vector calculus (volume integrals, unit vectors) (foundational, 0.85)

---

### 18.7 — Gauss's Law

- **id**: `gauss-law`
- **title**: Gauss's Law
- **formula**:
$$\oint_{\partial V} \vec{E} \cdot d\vec{A} = \frac{Q_{\text{enc}}}{\varepsilon_0}$$
Differential form: $\nabla \cdot \vec{E} = \frac{\rho}{\varepsilon_0}$

**principle**: The total electric flux through any closed surface equals the net charge enclosed divided by $\varepsilon_0$. Gauss's law is one of Maxwell's four equations. It is equivalent to Coulomb's law for static charge distributions, but is more general and more powerful for symmetric geometries. Strategy: choose a Gaussian surface that matches the symmetry of the charge distribution so that $|\vec{E}|$ is constant on the surface and $\vec{E} \parallel d\vec{A}$ (or $\vec{E} \perp d\vec{A}$ on surfaces that contribute zero flux). Then $\oint \vec{E} \cdot d\vec{A} = E \cdot A_{\text{eff}} = Q_{\text{enc}}/\varepsilon_0$.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{E}$ | response — electric field on Gaussian surface | N/C |
| $Q_{\text{enc}} = \int_V \rho \, dV$ | driver — total enclosed charge | C |
| $d\vec{A}$ | parameter — outward area element | m² |
| $\varepsilon_0$ | parameter — permittivity of free space | C²/(N·m²) |

**causal-structure**: contextual — charge *sources* the divergence of the field. For high-symmetry cases (spherical, cylindrical, planar), this is effectively asymmetric: $Q_{\text{enc}}$ → $\vec{E}$. For arbitrary distributions, the relationship is bidirectional (knowing $\vec{E}$ everywhere implies knowing $Q_{\text{enc}}$).

**limits**:
- Powerful only when symmetry allows the field to be pulled out of the integral.
- For asymmetric distributions, Coulomb superposition integral is needed.
- In dielectric media, replace $\varepsilon_0$ with $\varepsilon = \kappa \varepsilon_0$ or introduce $\vec{D} = \varepsilon_0 \vec{E} + \vec{P}$.

**misconceptions**:
- "Gauss's law only works for spheres" — any closed surface works; spheres/cylinders/pillboxes are chosen for computational convenience.
- "The field on the surface is only from the enclosed charge" — $\vec{E}$ on the surface is from *all* charges everywhere; only the *flux* is determined by enclosed charge alone.

**prereqs**:
- `electric-field` (foundational, 0.85)
- `conservation-of-charge` (supporting, 0.55)
- Divergence theorem (foundational, 0.85)

**canonical applications**:
- Spherical shell of charge → $\vec{E} = 0$ inside, point-charge field outside.
- Infinite line charge → $E = \lambda / (2\pi\varepsilon_0 r)$.
- Infinite sheet of charge → $E = \sigma / (2\varepsilon_0)$, uniform and constant.

---

### 18.8 — Electric Field Lines

- **id**: `electric-field-lines`
- **title**: Electric Field Lines
- **formula**: (visualization: density $\propto |\vec{E}|$)

**principle**: Field lines are a pictorial representation of $\vec{E}$: the tangent to a line at any point gives the field direction; the areal density of lines (number per unit cross-sectional area perpendicular to the lines) is proportional to field magnitude. Rules: lines originate on positive charges, terminate on negative charges (or at infinity for isolated charges); they never cross; the number of lines drawn $\propto |Q|$. The divergence of $\vec{E}$ at any point relates to local charge density (Gauss's law differential form).

**causal-structure**: symmetric — field lines represent the field; they do not cause it.

**limits**: A 2D drawing of field lines is a projection; the real field fills 3D space continuously.

**misconceptions**:
- "Charges travel along field lines" — charges at rest don't move along field lines; charges in motion follow force (not always tangent to field lines, due to inertia).
- "Field lines can cross" — impossible; two different field directions at one point would violate uniqueness of $\vec{E}$ at that point.

**prereqs**:
- `electric-field` (foundational, 0.85)
- `gauss-law` (supporting, 0.55)

---

### 18.9 — Superposition of Electric Fields

- **id**: `electric-field-superposition`
- **title**: Superposition of Electric Fields
- **formula**: $\vec{E}_{\text{total}}(\vec{r}) = \sum_i \vec{E}_i(\vec{r}) = \frac{1}{4\pi\varepsilon_0} \int \frac{\rho(\vec{r}\,')(\vec{r}-\vec{r}\,')}{|\vec{r}-\vec{r}\,'|^3} \, dV'$

**principle**: The electromagnetic field is linear — superposition holds exactly (in vacuum). The total field from any charge distribution is the vector sum (or vector integral) of individual contributions. This follows from the linearity of Maxwell's equations. For discrete charges, sum vectors; for continuous distributions, integrate.

**causal-structure**: symmetric — each source charge independently contributes; there is no interaction *between* field contributions in linear media.

**limits**: Superposition breaks down in nonlinear media (strong fields in dielectrics, quantum vacuum, etc.).

**misconceptions**: Students frequently add magnitudes rather than vectors — direction is not optional; the components must be summed separately.

**prereqs**:
- `electric-field` (foundational, 0.85)
- Vector addition and integration (foundational, 0.85)

---

### 18.10 — Conductors in Electrostatic Equilibrium

- **id**: `conductor-electrostatic-equilibrium`
- **title**: Conductors in Electrostatic Equilibrium
- **formula**: $\vec{E}_{\text{inside}} = 0$; $E_{\text{surface}} = \sigma/\varepsilon_0$ (normal component only)

**principle**: A conductor in electrostatic equilibrium satisfies four conditions that follow from Gauss's law + $\vec{J} = \sigma\vec{E} = 0$ at equilibrium:
1. $\vec{E} = 0$ inside — any nonzero $\vec{E}$ would drive $\vec{J}$, contradicting equilibrium.
2. All net charge resides on the surface — by Gauss's law ($\nabla \cdot \vec{E} = \rho/\varepsilon_0$), if $\vec{E} = 0$ inside then $\rho = 0$ inside.
3. $\vec{E}$ just outside is perpendicular to surface — a tangential component would drive surface current.
4. Surface charge density $\sigma$ is highest at regions of highest curvature.

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{E}_{\text{inside}}$ | response — field inside conductor at equilibrium | N/C |
| $\sigma$ | response — surface charge density | C/m² |
| $\varepsilon_0$ | parameter — permittivity of free space | C²/(N·m²) |

**causal-structure**: asymmetric — free charges respond to applied field by redistributing until $\vec{E} = 0$ inside (equilibrium is the attractor state).

**limits**: Applies only in *electrostatic* equilibrium. Dynamic (AC, transient) situations require the full Maxwell equations and $\vec{J} \neq 0$ inside.

**misconceptions**:
- "Charge distributes uniformly on a conductor" — uniform only for a sphere. Shape determines $\sigma$ distribution.
- "A Faraday cage must be grounded to shield" — $\vec{E} = 0$ inside any *closed* conducting shell regardless of grounding status, by Gauss's law.

**prereqs**:
- `conductors-insulators` (foundational, 0.85)
- `gauss-law` (foundational, 0.85)

---

### 18.11 — Electric Dipole

- **id**: `electric-dipole`
- **title**: Electric Dipole and Polarization
- **formula**: $\vec{p} = q\vec{d}$ (dipole moment; $\vec{d}$ from $-$ to $+$)

Far-field potential: $V = \frac{1}{4\pi\varepsilon_0}\frac{\vec{p}\cdot\hat{r}}{r^2}$; far-field field: $\vec{E} \sim \frac{p}{4\pi\varepsilon_0 r^3}$ (leading order; falls off faster than monopole).

**principle**: A dipole consists of equal and opposite charges $\pm q$ separated by displacement $\vec{d}$. The dipole moment $\vec{p}$ is the fundamental multipole beyond the monopole. The potential falls off as $1/r^2$ and the field as $1/r^3$ — *faster* than Coulomb's monopole ($1/r^2$) — because the leading charges cancel and only the asymmetry remains. Induced dipoles arise when an external $\vec{E}$ shifts bound charges in a neutral object: $\vec{p}_{\text{ind}} = \alpha \vec{E}$ where $\alpha$ is the polarizability.

Torque on a dipole in an external field: $\vec{\tau} = \vec{p} \times \vec{E}$. Energy: $U = -\vec{p} \cdot \vec{E}$ (minimum at alignment).

**vars**:
| Symbol | Role | Units |
|--------|------|-------|
| $\vec{p}$ | response — dipole moment of system | C·m |
| $q$ | driver — magnitude of each charge | C |
| $\vec{d}$ | parameter — separation vector ($-$ to $+$) | m |
| $\alpha$ | parameter — polarizability (for induced dipoles) | C·m/(V/m) |

**causal-structure**: asymmetric — external field induces polarization; polarization creates secondary field and torque.

**limits**: Dipole approximation valid when $d \ll r$ (observer far from dipole). At short range, higher multipole terms contribute.

**misconceptions**: "Neutral objects feel no electrostatic force" — polarization means the near face has opposite sign and is attracted more than the far face is repelled, giving a net attractive force.

**prereqs**:
- `electric-charge` (foundational, 0.85)
- `coulombs-law` (foundational, 0.85)
- Multipole expansion (lateral, 0.2)

---

## Cross-Chapter Connections

- **← Ch. 4 (Newton's Laws)**: $\vec{F} = q\vec{E}$ combined with $\vec{F} = m\vec{a}$ gives charged-particle dynamics.
- **→ Ch. 19 (Electric Potential)**: $V(\vec{r}) = -\int_{\infty}^{\vec{r}} \vec{E} \cdot d\vec{l}$; the gradient relation $\vec{E} = -\nabla V$.
- **→ Ch. 22 (Magnetism)**: Gauss's law for $\vec{B}$ is $\oint \vec{B} \cdot d\vec{A} = 0$ — the magnetic analogue, which enforces no monopoles.
- **→ Ch. 24 (Maxwell's Equations)**: Gauss's law ($\nabla \cdot \vec{E} = \rho/\varepsilon_0$) is the first of the four Maxwell equations.
- **Symmetry note**: Conservation of charge → continuity equation → Gauss's law in integral form: these three are the same physical content, at increasing levels of locality.

## Key Equations Summary

| Concept | Equation |
|---------|----------|
| Charge quantization | $q = ne$, $e = 1.602 \times 10^{-19}$ C |
| Continuity equation | $\partial\rho/\partial t + \nabla \cdot \vec{J} = 0$ |
| Coulomb's Law (vector) | $\vec{F}_{12} = \frac{q_1 q_2}{4\pi\varepsilon_0 r^2}\hat{r}_{12}$ |
| Electric field (point charge) | $\vec{E} = \frac{Q}{4\pi\varepsilon_0 r^2}\hat{r}$ |
| Electric field (continuous) | $\vec{E}(\vec{r}) = \frac{1}{4\pi\varepsilon_0}\int \frac{\rho(\vec{r}\,')(\vec{r}-\vec{r}\,')}{|\vec{r}-\vec{r}\,'|^3}dV'$ |
| Gauss's Law (integral) | $\oint \vec{E} \cdot d\vec{A} = Q_{\text{enc}}/\varepsilon_0$ |
| Gauss's Law (differential) | $\nabla \cdot \vec{E} = \rho/\varepsilon_0$ |
| Inside conductor | $\vec{E} = 0$ |
| Surface field | $E_\perp = \sigma/\varepsilon_0$ |
| Dipole moment | $\vec{p} = q\vec{d}$ |
| Dipole energy | $U = -\vec{p} \cdot \vec{E}$ |
| Dipole torque | $\vec{\tau} = \vec{p} \times \vec{E}$ |

## Instructor Notes (PHY 132 / Advanced Track)

The key calculus-level upgrade in this chapter is the superposition integral for the electric field — getting comfortable with the form $\int \frac{\rho \, (\vec{r} - \vec{r}\,')}{|\vec{r} - \vec{r}\,'|^3} dV'$ and knowing when to use it vs. Gauss's law. Gauss's law is elegant and powerful *only* when symmetry constrains the field to be uniform and perpendicular on a chosen surface — drill the three canonical cases (spherical, cylindrical, planar). The conductor equilibrium results are a *direct consequence* of Gauss's law + $\vec{J} = \sigma\vec{E}$ at equilibrium — they shouldn't be memorized as rules but derived in a few lines. The dipole section is the gateway to dielectrics (Ch. 19), polarization, and later to radiation (Ch. 24): every radiating antenna is an oscillating dipole.
