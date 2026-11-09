# Emerald Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Emerald Profile

Pureline Emerald follows **native Emerald syntax** instead of borrowing the proposed Emvus syntax. Emerald is also the bootstrap language for Emvus, so this distinction matters for tools and compiler code.

### PL-EMS-001 — Keep Emerald Syntax Native

Emerald uses `.ems` files, `namespace` and `use` declarations with `::`, return types before method names, and semicolons.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Do **not** rewrite Emerald declarations as Emvus `package`, `method<T>`, `where`, or semicolon-free code. These are different languages.

### PL-EMS-002. Usa i punti e virgola in modo coerentem

Follow Emerald's semicolon-based statement syntax. A formatter must not apply the Emvus optional-semicolon rule to `.ems` files.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003. Nomi e organizzazione file

- Types: `PascalCase`.
- Interfaces: `I` prefix (`IStorage`, `IPacket`).
- Methods, parameters, fields, and locals: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` where applicable.
- Keep `namespace` and `use` declarations explicit.
- Prefer source files named after their primary type, respecting existing Emerald repository naming conventions (for example, `SessionService.ems`).
- Use at most **8** production `.ems` files per source/namespace folder by default; tests and generated sources are excluded.

Do not rename existing working source files merely to satisfy a hypothetical cross-language convention.

### PL-EMS-004. Clausole di guardia con bracciaoooooosodico

Use explicit blocks and keep the successful path unnested.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Avoid `else` when an early `return`, `continue`, or other termination makes it unnecessary. Inline brace-free `if` statements are not Pureline Emerald.

### PL-EMS-005. Tipi espliciti e `var` sono entrambi validinene

Use a declared type when it clarifies an API boundary. Use `var` where a statically inferred type is immediately obvious; `var` is **not** a request for dynamic typing.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Neither form should be flagged as a style violation merely because the other is possible.

### PL-EMS-006 — Preserve Emerald's Object Model

Use Emerald's normal constructor call form without a Java-style `new` keyword.

```java
Connection connection = Connection();
```

Keep constructors, fields, inheritance, and interfaces explicit. Prefer small cohesive classes over extra manager/factory layers with no concrete responsibility.

### PL-EMS-007 — Prefer Data Classes for Data-Shaped Types

When a type primarily bundles related data and Emerald's supported generated members are suitable, prefer a data class over repeated boilerplate.

```java
public data class Coordinate(Int x, Int y);
```

Emerald's data-class generation includes a constructor, `equals`, `toString`, `copy`, and `withX` methods where applicable. Do not assume Emvus-only data-class features such as named-argument `copy`, generated `hashCode`, or Emvus destructuring are already part of Emerald.

Usare i letterali direttamente quando il costruttore e gli argomenti fanno il valore
immediately clear, as with the origin.

```text
Intermediate values                                 │ ✓ Pureline
Int originX = 0;                                    │ Coordinate origin = Coordinate(0, 0);
Int originY = 0;                                    │
Coordinate origin = Coordinate(originX, originY);   │
```

### PL-EMS-008. Usare macro solo per astrazioni in tempo reale

Emerald's AST macro system is appropriate for repetitive structural generation, not for disguising ordinary program logic.

- Prefer small, clearly named annotation macros.
- Make generated fields and methods discoverable to maintainers and tooling.
- Avoid replacing a straightforward method with difficult-to-debug macro behavior.
- Do not rely on undocumented macro capabilities or silently mutate unrelated declarations.
- Keep compile-time transformations separate from runtime side effects.

### PL-EMS-009 — Make Error Paths Explicit

Use the error mechanism supported by the actual Emerald API. Where a function returns `Result<T, E>`, handle or forward it intentionally. Do not copy Emvus-specific `success value`, `fail error`, postfix `?`, or `scoped` constructs into Emerald code unless that syntax is separately implemented there.

Guard invalid input early and make unexpected failure visible rather than swallowing it.

### PL-EMS-010. Concurrency has Ownershipodico

Emerald's `Fiber`, `@Async`, `@Synchronized`, and thread facilities should be used with explicit lifecycles.

- Keep blocking work off inappropriate execution threads.
- Await operations whose results or failures matter.
- Synchronize shared mutable state intentionally.
- Do not confuse asynchronous execution with automatic thread safety.

### PL-EMS-011. Mantieni comprensibile il codice Flow-Sensitive

Emerald Flow may optimize allocation and object lifetimes, but readable source semantics take priority.

- Prefer stable local references when multiple reads would be ambiguous.
- Do not manually rely on undocumented `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond`, or `Static` storage choices.
- Avoid hidden escapes and accidental long-lived references in hot paths.
- Treat optimizer strategies as compiler implementation details, not source-level coding rituals.

### PL-EMS-012. Test Compiler-Facing Abstractions

For compiler, AST, and runtime code, write tests for boundary conditions, error paths, generated members, and object lifetime behavior. A shorter method is not automatically better if it hides a phase transition or important side effect.
