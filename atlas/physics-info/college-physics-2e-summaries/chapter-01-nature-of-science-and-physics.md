# Chapter 1 — Introduction: The Nature of Science and Physics

**Source:** OpenStax *College Physics 2e* (Urone & Hinrichs, 2022)
**Sections covered:** 1.1 Physics: An Introduction · 1.2 Physical Quantities and Units · 1.3 Accuracy, Precision, and Significant Figures · 1.4 Approximation

---

## Chapter Overview

A scope-setting chapter that frames *what* physics is, *how* scientists describe nature, *which units* they use, and *how reliable* a measurement actually is. No real dynamics yet — this is the language and toolkit students need before any equations of motion show up. Two big throughlines: (1) nature is describable by a small set of unifying laws, and (2) every measurement carries uncertainty that must be tracked.

---

## 1.1 Physics: An Introduction

### Core ideas
- **Physics** describes interactions of energy, matter, space, and time, and looks for the underlying mechanisms behind every phenomenon.
- The universe is enormously detailed but governed by a surprisingly small set of unifying laws.
- The scientific enterprise builds **models, theories, and laws** by repeated observation and experiment.
- **Classical physics** holds when (a) speeds ≪ 1% of *c*, (b) objects are larger than microscopic, (c) gravitational fields are weak. Outside those limits you need **modern physics** — relativity (fast / strong gravity) and quantum mechanics (very small).

### Key terminology

| Term | Meaning |
|---|---|
| **Model** | Representation of something not directly observable; valid only in a limited domain (e.g., planetary model of the atom). |
| **Theory** | Testable explanation for patterns in nature, supported by repeated evidence. *Not* a guess. |
| **Law** | Concise (often equation-form) statement of a generalized pattern in nature; foundational. |
| **Principle** | Same flavor as a law, but narrower in scope (e.g., Pascal's principle applies only to fluids). |
| **Scientific method** | Observe → question → research → hypothesize → test → analyze → conclude. Iterative. |
| **Classical physics** | Physics from the Renaissance through the 19th century; valid in everyday regimes. |
| **Modern physics** | Relativity + quantum mechanics. Required for fast/small/strong-gravity regimes. |
| **Relativistic quantum mechanics** | Combination of the two; the most universally applicable theory we have. |

### Did-you-know
Ibn al-Haytham (Alhazen, ~10th–11th c.) is credited as a major precursor of the modern scientific method — he insisted scientists "be the enemy" of what they read and trust only objective evidence.

---

## 1.2 Physical Quantities and Units

### Core ideas
- Most physical quantities are combinations of just **four fundamental quantities**: length, mass, time, electric current.
- A **physical quantity** is defined either by *how it is measured* (operational) or *how it is calculated* from other measurements.
- Two unit systems dominate: **SI (metric)** and **English/imperial**. SI is the global scientific standard.
- The metric system's superpower: conversions are powers of 10.

### Fundamental SI units

| Quantity | Unit | Symbol |
|---|---|---|
| Length | meter | m |
| Mass | kilogram | kg |
| Time | second | s |
| Electric current | ampere | A |

**Definitions (post-2019 redefinitions):**
- **Second** — duration of 9,192,631,770 oscillations of a cesium-133 atom.
- **Meter** — distance light travels in vacuum in 1/299,792,458 s. (This *defines* c = 299,792,458 m/s exactly.)
- **Kilogram** — defined via the second, the meter, and Planck's constant *h* (no more platinum-iridium cylinder as of May 2019).
- **Ampere** — introduced later in the text with electricity & magnetism.

### Derived vs fundamental units
**Fundamental units** are defined by the procedure used to measure them. **Derived units** are algebraic combinations (e.g., speed = length/time → m/s).

### Metric prefixes (memorize the common ones)

| Prefix | Symbol | Factor | | Prefix | Symbol | Factor |
|---|---|---|---|---|---|---|
| exa | E | 10¹⁸ | | deci | d | 10⁻¹ |
| peta | P | 10¹⁵ | | centi | c | 10⁻² |
| tera | T | 10¹² | | milli | m | 10⁻³ |
| giga | G | 10⁹ | | micro | µ | 10⁻⁶ |
| mega | M | 10⁶ | | nano | n | 10⁻⁹ |
| kilo | k | 10³ | | pico | p | 10⁻¹² |
| hecto | h | 10² | | femto | f | 10⁻¹⁵ |
| deka | da | 10¹ | | atto | a | 10⁻¹⁸ |

### Order of magnitude
The **order of magnitude** of a number is the power of 10 nearest its value (loosely, its scale). Quantities with the same power of 10 are "the same order of magnitude." Diameter of an atom ~10⁻¹⁰ m; diameter of the Sun ~10⁹ m → 19 orders of magnitude apart.

### Unit conversion
Multiply by **conversion factors** (ratios equal to 1) arranged so the unwanted units cancel. If your final units are wrong, you flipped a factor.

---

## 1.3 Accuracy, Precision, and Significant Figures

### Core distinctions
- **Accuracy** — how close a measurement is to the *true* value.
- **Precision** — how close repeated measurements are to *each other* (spread/repeatability).
- These are independent: you can be accurate-but-imprecise, precise-but-inaccurate, both, or neither (the bullseye/GPS analogy).

### Uncertainty
- **Uncertainty (δA or ΔA)** — quantitative measure of how much a measurement deviates from the true value. Always present.
- A measurement is reported as **A ± δA** (e.g., 11 ± 0.2 in).
- Sources: limits of the instrument, skill of the experimenter, irregularities in the object, environmental factors.

### Key equations

**Percent uncertainty:**
$$\%\text{unc} = \frac{\delta A}{A} \times 100\%$$

**Method of adding percents** (for small uncertainties combined by × or ÷):
> The percent uncertainty in a product or quotient equals the sum of the percent uncertainties of the inputs.

### Significant figures (sig figs)

**Counting sig figs:**
- All non-zero digits are significant.
- Zeros between non-zeros are significant (10.053 → 5 sig figs).
- Leading zeros are *not* significant (0.0009 → 1 sig fig).
- Trailing zeros after a decimal *are* significant (87.990 → 5 sig figs).
- Trailing zeros in whole numbers without a decimal (e.g., 1300) are ambiguous — use scientific notation to disambiguate.

**Rules for calculations:**
- **× or ÷**: result has the same number of sig figs as the *least-sig-fig* input.
- **+ or −**: result has the same number of *decimal places* as the *least-precise* input.
- **Exact values** (counts, definitions, the "2" in 2πr) don't constrain sig figs.

**Default in this textbook:** assume 3 sig figs unless stated otherwise (some optics problems use more).

---

## 1.4 Approximation

### Core idea
Order-of-magnitude estimation ("guesstimating") is a real physicist skill. You scaffold an unknown quantity from known quantities, willing to be wrong by a factor of a few in exchange for a fast sanity check.

### Worked-example flavor
- **Building height** — scale up from a person (~2 m tall, ~2 humans per story) to estimate a 39-story building at ~150 m.
- **Trillion dollars on a football field** — chain volume estimates (bill dims → stack vol → field area → height) to find a $1T pile in $100 bills is ~100 in tall.

### Pedagogical takeaway
Approximation lets you (1) rule out absurd answers, (2) build physical intuition for scale, and (3) check formal calculations.

---

## Variables / symbols introduced

| Symbol | Meaning |
|---|---|
| *A* | A measured quantity (generic placeholder) |
| δA, ΔA | Uncertainty in *A* |
| %unc | Percent uncertainty |
| m, kg, s, A | SI fundamental units (meter, kilogram, second, ampere) |
| *c* | Speed of light, 299,792,458 m/s (exact, by definition of the meter) |
| *h* | Planck's constant (used in defining the kg) |

---

## Pedagogical / TA-training notes

- Students routinely conflate **accuracy** and **precision**. The bullseye diagram is canonical for a reason — use it.
- The "is 1300 four sig figs or two?" ambiguity is a great hook for *why* scientific notation matters.
- Order-of-magnitude estimation is underemphasized in most intro labs; lean into it during pre-lab chats — it's the cheapest sanity check students will ever learn.
- The cesium/Planck redefinitions of SI units (2019) are a fun talking point: units of measurement are now defined entirely in terms of fundamental constants, not artifacts.
