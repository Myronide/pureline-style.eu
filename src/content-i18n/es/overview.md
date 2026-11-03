# Estilo de código Pureline 1.7

[Guía de estilo del código](README.md) · [Especificaciones originales 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definición

**Pureline** es un estilo de codificación con opiniones centradas en el flujo de control lineal, intención explícita, formato compacto, unidades pequeñas, propiedad clara y ruido sintáctico o arquitectónico mínimo.

Pureline no pretende minimizar los caracteres. It aims to minimize **unnecessary code**.

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

No:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

The central Pureline principles are:

> **Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Cohesión sobre el tamaño.**

**Versión 1.7:** Añade el perfil Python (`PL-PY-001` a través de `PL-PY-012`), el perfil QML (`PL-QML-001` a través de `PL-QML-011`), el perfil Astro (`PL-AS-001` a través de `PL-AS-009`), el perfil HTML (`PL-HTML-001` a través de `PL-HTML-009`), y el perfil CSS (`PL-CSS-001` a través de `PL-CSS-012`).!!!!!!!!!!!!!!!!!!!!!!!!! La versión 1.6 añadió el perfil Novus (`PL-NV-001` a través de `PL-NV-013`) y el perfil React (`PL-REACT-001` a través de `PL-REACT-014`), y amplía el perfil Rust con `PL-RS-021` a través de `PL-RS-024` y una exención de prueba precisa en `PL-RS-004`. > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > All existing rule IDs and the 1.4 Cohesion over Size principle are preserved. Version 1.5 added the Rust profile (`PL-RS-001` through `PL-RS-020`).

**Version 1.7 (additional profiles):** Version 1.7 also adds the C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) and Kotlin (`PL-KT-001`–`PL-KT-011`) profiles without renumbering existing rules.

---

## Pureline Summary

El código Pureline debe sentir:

- lineal
- explic
- compacto
- moderno
- ruido bajo
- modular
- Cohesivo independientemente del número de líneas
- predecible
- fácil de escanear
- fácil de refactorizar
- Difícil de malinterpretar

La norma básica sigue siendo:

> **Code sin ruido.**

Un segundo principio rige cada perfil lingüístico:

> **Pureline estandariza principios, no sintaxis.**

A language should remain idiomatic. Pureline elimina el ruido innecesario sin eliminar las características que hacen que Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, o Emvus efectivo en primer lugar.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
