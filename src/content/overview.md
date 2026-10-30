# Pureline Code Style 1.5

[Code style guide](README.md) · [Original specification 1.5](../../PURELINE_SPECIFICATION_1.5.md)

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

**Version 1.5:** Adds the idiomatic Rust profile (`PL-RS-001` through `PL-RS-020`) while preserving all existing rule IDs and the 1.4 Cohesion over Size principle.

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
