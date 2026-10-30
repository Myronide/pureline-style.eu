# Pureline Code Style

The Pureline 1.5 coding standard, organized by topic and language. Start with the [overview](overview.md), read the shared rules, then apply the relevant language profile.

**Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Cohesion over Size.**

## How to apply this guide

- Shared rules apply wherever the language supports them naturally.
- Language-native syntax and explicit profile exceptions take precedence. For example, Crystal allows simple postfix guards, Rust allows `let ... else` and follows rustfmt, and Emvus allows optional semicolons.
- TypeScript inherits the JavaScript profile in addition to its own rules.
- Function and class size ranges are review heuristics. Keep cohesive logic together; line count alone is not a violation.
- Preserve stable rule IDs in reviews and diagnostics. See the [tooling model](tooling.md).

## Shared rules

| Guide | Contents |
|---|---|
| [Core principles](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Control flow](core/control-flow.md) | Guard clauses, early errors, explicit blocks, avoiding unnecessary `else` |
| [Naming](core/naming.md) | Meaningful names and local conventions |
| [Functions](core/functions.md) | One responsibility and size guidance |
| [Classes and modules](core/structure.md) | Responsibility boundaries, folder density, Cohesion over Size |
| [Formatting](core/formatting.md) | Compact calls and meaningful vertical grouping |
| [Comments](core/comments.md) | Explain why unusual behavior is necessary |
| [Architecture](core/architecture.md) | Justified abstractions, dependency direction, explicit dependencies |
| [State and side effects](core/state-and-side-effects.md) | Visible effects and intentional mutation |
| [Performance](core/performance.md) | Deliberate optimization of hot paths |

## Language-specific rules

| Profile | Rule IDs | Particular guidance |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Records, `I`-prefixed interfaces, null handling, concurrency, lifecycle symmetry |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Braces, semicolons, `const`, async/await, callbacks |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | JavaScript inheritance, explicit or inferred types, `unknown`, interfaces and unions |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Error guards, idiomatic naming, small consumer interfaces, `defer`, goroutines |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Postfix guards, snake_case, inference, nil handling, macros |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, semicolons, data classes, AST macros, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, task lifecycles; intended language design |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-020` | Ownership, Result/Option, pattern matching, rustfmt, RAII, async and FFI |

See also the [language profile overview](languages/README.md) and [tooling requirements](tooling.md).

## Specification and maintenance

These topic files preserve the rules, examples, qualifications, and stable IDs from the [original Pureline Specification 1.5](../../PURELINE_SPECIFICATION_1.5.md). The original remains the versioned source of reference. Section numbers are omitted here so each topic can be read independently; rule IDs are unchanged.

When revising guidance, keep the original specification and the corresponding topic file consistent. Do not renumber existing rule IDs or turn review heuristics into hard violations.
