# Pureline-Codestil 1.7

[Code-Stil-Führer](README.md) · [Original-Spezifikation 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Begriffsbestimmung

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

Nicht:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

The central Pureline principles are:

> **Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Kohäsion über Größe.**

**Version 1.7:** Adds the Python profile (`PL-PY-001` through `PL-PY-012`), the QML profile (`PL-QML-001` through `PL-QML-011`), the Astro profile (`PL-AS-001` through `PL-AS-009`), the HTML profile (`PL-HTML-001` through `PL-HTML-009`), and the CSS profile (`PL-CSS-001` through `PL-CSS-012`). Version 1.6 added the Novus profile (`PL-NV-001` through `PL-NV-013`) and the React profile (`PL-REACT-001` through `PL-REACT-014`), and extends the Rust profile with `PL-RS-021` through `PL-RS-024` and a precise test exemption in `PL-RS-004`. All existing rule IDs and the 1.4 Cohesion over Size principle are preserved. Version 1.5 added the Rust profile (`PL-RS-001` through `PL-RS-020`).

---

## Pureline Summary

Pureline code should feel:

- linear
- explizit
- kompakt
- modern
- Geräuscharm
- modular
- zusammenhalten unabhängig von der Zeilenzahl
- vorhersehbar
- leicht zu scannen
- leicht zu refaktor
- schwer zu missverstehen

Die Kernregel lautet:

> **Code without noise.**

Ein zweites Prinzip regelt jedes Sprachprofil:

> **Pureline standardizes principles, not syntax.**

A language should remain idiomatic. Pureline removes unnecessary noise without stripping away the features that make Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, or Emvus effective in the first place.
