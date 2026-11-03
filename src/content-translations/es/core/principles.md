# Principios básicos

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Núcleo de Pureline {#pureline-core}

Estas reglas se aplican a todos los lenguajes admitidos, siempre que el lenguaje lo permita de forma natural.

| ID | Regla |
|---|---|
| PL-CORE-001 | El flujo de control debe ser lo más lineal posible |
| PL-CORE-002 | Evita `else` |
| PL-CORE-003 | Prefiere las guard clauses |
| PL-CORE-004 | Usa la forma de control de flujo más clara para el lenguaje; los lenguajes con llaves usan bloques explícitos |
| PL-CORE-005 | Se permite la abreviatura idiomática propia del lenguaje cuando sigue siendo legible al instante |
| PL-CORE-006 | Las funciones deben ser pequeñas y enfocadas |
| PL-CORE-007 | Los nombres deben tener significado |
| PL-CORE-008 | Evita las abstracciones innecesarias |
| PL-CORE-009 | Evita las clases Dios y los módulos Dios (God Classes y God Modules) |
| PL-CORE-010 | Prefiere el estado inmutable |
| PL-CORE-011 | Prefiere las características modernas del lenguaje cuando mejoran la claridad |
| PL-CORE-012 | Evita el formato vertical innecesario |
| PL-CORE-013 | Los comentarios no deben compensar un código poco claro |
| PL-CORE-014 | Gestiona pronto los estados inválidos y de error |
| PL-CORE-015 | Mantén visibles los efectos secundarios importantes |
| PL-CORE-016 | Los recursos deben tener un ciclo de vida claro |
| PL-CORE-017 | Prefiere las API nativas del framework |
| PL-CORE-018 | Evita los valores mágicos |
| PL-CORE-019 | Haz explícitas las dependencias |
| PL-CORE-020 | Optimiza las rutas críticas de forma deliberada, no accidental |
| PL-CORE-021 | Mantén los paquetes y las carpetas de código fuente lo bastante pequeños como para recorrerlos de un vistazo |
| PL-CORE-022 | Cohesión antes que tamaño: prefiere una responsabilidad coherente a límites arbitrarios de líneas por clase |
