# Core Principles

[Code style guide](../README.md) · [Original specification 1.6](../../../PURELINE_SPECIFICATION_1.6.md)

## Pureline Core

These rules apply to all supported languages where the language allows them naturally.

| ID | Rule |
|---|---|
| PL-CORE-001 | Control flow should be as linear as possible |
| PL-CORE-002 | Avoid `else` |
| PL-CORE-003 | Prefer guard clauses |
| PL-CORE-004 | Use the clearest control-flow form for the language; brace-based languages use explicit blocks |
| PL-CORE-005 | Idiomatic language-native shorthand is allowed when it remains immediately readable |
| PL-CORE-006 | Functions should be small and focused |
| PL-CORE-007 | Names must carry meaning |
| PL-CORE-008 | Avoid unnecessary abstractions |
| PL-CORE-009 | Avoid God Classes and God Modules |
| PL-CORE-010 | Prefer immutable state |
| PL-CORE-011 | Prefer modern language features where they improve clarity |
| PL-CORE-012 | Avoid unnecessary vertical formatting |
| PL-CORE-013 | Comments must not compensate for unclear code |
| PL-CORE-014 | Handle invalid and error states early |
| PL-CORE-015 | Keep important side effects visible |
| PL-CORE-016 | Resources must have a clear lifecycle |
| PL-CORE-017 | Prefer framework-native APIs |
| PL-CORE-018 | Avoid magic values |
| PL-CORE-019 | Make dependencies explicit |
| PL-CORE-020 | Optimize hot paths deliberately, not accidentally |
| PL-CORE-021 | Keep packages and source folders small enough to scan at a glance |
| PL-CORE-022 | Cohesion over Size: prefer one coherent responsibility over arbitrary class line limits |
