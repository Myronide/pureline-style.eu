# Estilo de código Pureline 1.7

[Guía de estilo de código](README.md) · [Especificación original 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definición {#definition}

**Pureline** es un estilo de código con criterio propio, centrado en el flujo de control lineal, la intención explícita, el formato compacto, las unidades pequeñas, la responsabilidad clara y el mínimo ruido sintáctico o arquitectónico.

Pureline no busca minimizar los caracteres. Busca minimizar el **código innecesario**.

La dirección de lectura preferida es:

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

Y no:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

Los principios centrales de Pureline son:

> **Flujo lineal. Intención explícita. Ruido mínimo. Unidades pequeñas. Responsabilidad clara. Cohesión antes que tamaño.**

**Versión 1.7:** añade el perfil de Python (`PL-PY-001` a `PL-PY-012`), el perfil de QML (`PL-QML-001` a `PL-QML-011`), el perfil de Astro (`PL-AS-001` a `PL-AS-009`), el perfil de HTML (`PL-HTML-001` a `PL-HTML-009`) y el perfil de CSS (`PL-CSS-001` a `PL-CSS-012`). La versión 1.6 añadió el perfil de Novus (`PL-NV-001` a `PL-NV-013`) y el perfil de React (`PL-REACT-001` a `PL-REACT-014`), y amplía el perfil de Rust con `PL-RS-021` a `PL-RS-024` y una exención precisa para los tests en `PL-RS-004`. Se conservan todos los ID de regla existentes y el principio de cohesión antes que tamaño de la 1.4. La versión 1.5 añadió el perfil de Rust (`PL-RS-001` a `PL-RS-020`).

**Versión 1.7 (perfiles adicionales):** la versión 1.7 añade también los perfiles de C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) y Kotlin (`PL-KT-001`–`PL-KT-011`), sin renumerar las reglas existentes.

---

## Resumen de Pureline {#pureline-summary}

El código Pureline debe sentirse:

- lineal
- explícito
- compacto
- moderno
- de bajo ruido
- modular
- cohesivo, sea cual sea su número de líneas
- predecible
- fácil de recorrer con la vista
- fácil de refactorizar
- difícil de malinterpretar

La regla central sigue siendo:

> **Código sin ruido.**

Un segundo principio rige todos los perfiles de lenguaje:

> **Pureline estandariza principios, no sintaxis.**

Un lenguaje debe seguir siendo idiomático. Pureline elimina el ruido innecesario sin despojar a Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald o Emvus de las características que los hacen eficaces desde el principio.
