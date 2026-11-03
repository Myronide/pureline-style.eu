# Perfiles de idiomas

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Elija su perfil de idioma en el [Índice de guía] (../README.md#language-specific-rules). TypeScript hereda JavaScript y el núcleo compartido. Mantenga Emerald y Emvus perfiles separados.

## Perfiles de idiomas

```text
Pureline Core
│
├── Pureline Java
│   ├── Records
│   ├── I-prefixed interfaces
│   ├── Modern Java
│   ├── Explicit null handling
│   └── Virtual Threads
│
├── Pureline JavaScript
│   ├── const-first
│   ├── semicolons
│   ├── braces
│   └── async/await
│
├── Pureline TypeScript
│   ├── strong typing
│   ├── inference
│   ├── unknown > any
│   └── unions/types
│
├── Pureline Go
│   ├── idiomatic error guards
│   ├── small interfaces
│   ├── defer
│   └── explicit goroutine lifecycle
│
├── Pureline Crystal
│   ├── idiomatic postfix guards
│   ├── explicit blocks for complex flow
│   ├── nil guards
│   └── type inference
│
├── Pureline Rust
│   ├── Result / Option / ? and let-else guards
│   ├── ownership, borrowing, RAII
│   ├── exhaustive match and enums
│   ├── error types by crate role
│   ├── central lints, rustfmt / clippy
│   └── explicit async task lifecycles
│
├── Pureline React (on JavaScript + TypeScript)
│   ├── components as named functions
│   ├── guards before markup
│   ├── hooks, derived state, effects
│   └── pure render, typed props
│
├── Pureline Novus (.nv / .nvh)
│   ├── final / var / explicit types
│   ├── construct() and object literals
│   ├── packages and narrow imports
│   └── .nvh components with ref state
│
├── Pureline Emerald (.ems)
│   ├── namespace / use with ::
│   ├── typed declarations and semicolons
│   ├── data classes and AST macros
│   └── Flow-aware lifecycle clarity
│
└── Pureline Emvus (.ev)
    ├── method<Type> and where generics
    ├── Result, fail/success, scoped
    ├── data classes, dictionaries, tuples
    ├── AST macros
    └── fiber / virtual / thread
```
