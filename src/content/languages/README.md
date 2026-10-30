# Language Profiles

[Code style guide](../README.md) · [Original specification 1.5](../../../PURELINE_SPECIFICATION_1.5.md)

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
│   ├── rustfmt / clippy
│   └── explicit async task lifecycles
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
