# Pureline Code Style 1.6

[Code style guide](README.md) · [Original specification 1.6](../../PURELINE_SPECIFICATION_1.6.md)

## Definition

**Pureline** is an opinionated coding style focused on linear control flow, explicit intent, compact formatting, small units, clear ownership, and minimal syntactic or architectural noise.

Pureline does not aim to minimize characters. It aims to minimize **unnecessary code**.

The preferred reading direction is:

```text
Input
↓
Validation
↓
Transformation
↓
Execution
↓
Result
```

Not:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

The central Pureline principles are:

> **Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Cohesion over Size.**

**Version 1.6:** Adds the Novus profile (`PL-NV-001` through `PL-NV-013`) and the React profile (`PL-REACT-001` through `PL-REACT-014`), and extends the Rust profile with `PL-RS-021` through `PL-RS-024` and a precise test exemption in `PL-RS-004`. All existing rule IDs and the 1.4 Cohesion over Size principle are preserved. Version 1.5 added the Rust profile (`PL-RS-001` through `PL-RS-020`).

---

## Pureline Summary

Pureline code should feel:

- linear
- explicit
- compact
- modern
- low-noise
- modular
- cohesive regardless of line count
- predictable
- easy to scan
- easy to refactor
- hard to misunderstand

The core rule remains:

> **Code without noise.**

A second principle governs every language profile:

> **Pureline standardizes principles, not syntax.**

A language should remain idiomatic. Pureline removes unnecessary noise without stripping away the features that make Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, or Emvus effective in the first place.
