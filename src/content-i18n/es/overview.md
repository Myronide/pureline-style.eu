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
