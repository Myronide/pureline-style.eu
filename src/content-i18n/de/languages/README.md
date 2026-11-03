# Language Profiles

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Choose your language profile from the [guide index](../README.md#language-specific-rules). TypeScript inherits JavaScript as well as the shared core. Keep Emerald and Emvus profiles separate.

## Language Profiles

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
├── Pureline C#
│   └── PL-CS rules
│
├── Pureline Angular
│   └── PL-NG rules
│
├── Pureline Vue
│   └── PL-VUE rules
│
├── Pureline GDScript
│   └── PL-GD rules
│
├── Pureline C
│   └── PL-C rules
│
├── Pureline C++
│   └── PL-CPP rules
│
├── Pureline Lua
│   └── PL-LUA rules
│
├── Pureline Dart
│   └── PL-DART rules
│
├── Pureline Flutter
│   └── PL-FLUT rules
│
├── Pureline V
│   └── PL-V rules
│
├── Pureline Swift
│   └── PL-SW rules
│
├── Pureline Kotlin
│   └── PL-KT rules
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
