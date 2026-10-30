# Emvus Code Style

[Code style guide](../README.md) · [Original specification 1.5](../../../PURELINE_SPECIFICATION_1.5.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Emvus Profile

Pureline Emvus follows the **current Emvus language design**. This is a style profile for intended `.ev` syntax, not a claim that every showcased feature is already implemented by Ring 1. Keep Emvus distinct from Emerald.

### PL-EV-001 — Native Method Declarations

Declare methods with `method` and, when needed, a return type in `method<Type>`. Generic type variables are introduced through `where`, not by attaching another generic parameter list to the method name.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

A method without an explicit return type returns `Void`.

### PL-EV-002 — Empty Declaration Parentheses Are Optional; Call Parentheses Are Not

Both parameterless declarations are Pureline-compliant:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Both spellings declare zero-argument methods; the difference is cosmetic, **not** an overload distinction. Always write `refresh()` or `shutdown()` to execute the method; `object.refresh` is not a method call. Formatters should preserve or consistently configure either valid declaration style without marking the other as an error.

### PL-EV-003 — Braces Required; Semicolons Optional

Use explicit `{ ... }` blocks for `if`, loops, and comparable control flow. Prefer omitting optional semicolons in idiomatic Emvus, but do not reject existing valid semicolon-terminated code.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Brace-free inline guards and unnecessary `else` blocks are not Pureline. Keep continuation lines and long expressions unambiguous.

### PL-EV-004 — Naming, Imports, and Visibility

- Types: `PascalCase`; interfaces: `I` prefix (`IStorage`, `IConnection`).
- Methods, fields, properties, parameters, and locals: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Packages: lower-case dotted paths.
- Source filenames: **camelCase**, for example `sessionService.ev`, even if the primary class is `SessionService`.
- The default visibility is `public`; specify `private` or `protected` when required.
- Symbol resolution is case-insensitive but source spelling is preserved: use the **declared spelling** consistently and do not define names that differ only in case.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Use explicit imports and aliases instead of relying on confusing collisions.

### PL-EV-005 — Types Should Communicate Intent

Emvus is statically typed by default. `var` performs **static type inference**; `dynamic` explicitly requests runtime-typed behavior.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Use `dynamic` at genuinely dynamic boundaries, not to bypass normal type checks. Both explicit and inferred static local types are Pureline-compliant.

### PL-EV-006 — Handle Nullability Through Stable Flow

Emvus does not require a `T?` annotation. It tracks null states through control flow. Guard a possibly-null value early and prefer a stable local snapshot of mutable properties before reasoning about their nullability.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Never rely on repeated unsynchronized reads of a mutable property having the same value. Make required field initialization explicit.

### PL-EV-007 — Prefer Typed Result Handling for Expected Failures

Emvus has no `try/catch/finally` syntax. Use `Result<T, E>`, `success`, `fail`, `?`, and `switch` as the language specifies.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` is for deliberate error propagation where types permit it.
- `!` causes a panic on error; reserve it for established invariants or boundary checks that truly cannot recover.
- Do not discard a `Result` or hide expected failure behind `panic`.
- Keep `success`, `fail`, and `return` distinct rather than wrapping every operation unnecessarily.

### PL-EV-008 — Make Resource Lifetimes Visible with `scoped`

Use Emvus's `scoped` construct for resources that must be closed when their scope ends.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Do not replace `scoped` with Java `try-with-resources`, Go `defer`, or a nonexistent Emvus `finally`. A resource's lifetime should remain clear even when the compiler optimizes memory.

### PL-EV-009 — Prefer Data Classes to Boilerplate

Use `data class` for small, named, data-centric types with the built-in generated behavior.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Primary data properties are read-only outside initialization. `copy()` and `withX(...)` express modified copies and are shallow by default. Prefer generated equality, hashing, and textual representation where appropriate rather than rewriting them manually. Keep larger behavior-rich types as regular classes.

**Do not introduce a separate `record` style requirement:** the agreed Emvus design uses `data class` for named data models and `Dictionary` for dictionary/object-literal data.

### PL-EV-010 — Lists, Tuples, and Dictionaries Retain Their Defined Semantics

For `[...]` literals, **all element types exactly equal** implies a `List`; otherwise the expression is a tuple. Do not make Pureline overwrite the language's type-driven rule with a stylistic preference.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Dictionary literals use `{ key: value }`; inferred mixed value types use `dynamic` where required by the language model. Dictionaries are accessed by **keys**, not structural-record dot notation.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

A changing element type can legitimately change list-versus-tuple inference. Keep that behavior visible at API boundaries through explicit declared types where appropriate.

### PL-EV-011 — Destructuring Is Positional

Use `{ ... }` to destructure tuple or data-class components in declaration order. `_` may skip an element.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Do not reinterpret destructuring as named record matching. Prefer short meaningful bindings, not indiscriminate unpacking.

### PL-EV-012 — `switch` Should Expose Complete Branching

Use `switch` statements or expressions for real state alternatives. Expressions must be exhaustive or have a defined catch-all / failure arm.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Prefer clear `success(...)` and `error(...)` patterns to nested conditions for `Result`. Keep catch-all patterns deliberate, not a way to hide forgotten cases.

### PL-EV-013 — Use Cascades Only When They Clarify a Single Receiver

Cascades with `..` are useful for a short sequence of operations on the same receiver.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Avoid chains that conceal unrelated effects, mutate several objects implicitly, or stretch across many statements.

### PL-EV-014 — Fibers and Threads Need Clear Lifecycles

`fiber {}`, `virtual {}`, and `thread {}` are distinct execution constructs with a common task-result pattern. Choose based on the actual workload, not because concurrency looks compact.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Await results and failures that matter.
- Make cancellation and ownership clear for long-lived tasks.
- Synchronize shared mutable state; `@Synchronized` is available where appropriate.
- Do not assume a task's captured object is stack-local or can be released when the spawning method returns.
- Avoid hidden fire-and-forget work in ordinary business methods.

### PL-EV-015 — Macros Must Improve Discoverability, Not Obscure It

Emvus macros are compile-time AST transformations with target declarations, `quote`, `$(...)` substitution, and AST builder APIs.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline requires:

- Small macros with clearly stated responsibilities and supported targets.
- Deterministic expansion; source-order behavior and resulting members remain discoverable.
- Hygiene to avoid accidental name collisions.
- Compiler diagnostics when expansion creates conflicting or invalid code.
- Ordinary methods instead of macros when no substantial compile-time benefit exists.
- No reliance on unreviewed macro-time I/O, network, clock, or random side effects.

Generated code must satisfy semantic checks; checker/formatter tooling should not treat generated locations as ordinary hand-maintained files.

### PL-EV-016 — Do Not Program Against HyperAlloc Flow Internals

Emvus code may be optimized through Sublang, Optimind, and HyperAlloc Flow. Developers should express **semantics and lifetimes**, not manually guess a future allocation strategy.

- Favor straightforward object lifecycles and stable ownership.
- Keep shared mutable state explicit, especially across tasks.
- Prefer immutable data classes for simple values when they fit the domain.
- Do not build APIs around assumptions that an object is always stack-allocated, scalar-replaced, or pooled.
- Evaluate hot-path allocation and escape behavior through measurement and diagnostics, not folklore.

### PL-EV-017 — Package Density and Source Organization

A package/source folder should contain at most **8** production `.ev` modules by default. Tests, generated sources, and metadata-only files do not count. Split by actual feature responsibility rather than mechanically creating arbitrary subpackages.

A package name and a filename are different concepts: `app.session` remains lower-case, while `sessionService.ev` is `camelCase`.

### PL-EV-018 — Language-Native Rules Override Cross-Language Imitation

Pureline tooling must not report a violation merely because Emvus differs from Java, Emerald, Rust, or Go:

- Optional `()` in **parameterless method declarations** are valid; calls always require `()`.
- Optional semicolons are valid.
- `where` is the native generic declaration syntax.
- `var` is statically inferred; `dynamic` is explicitly dynamic.
- `success`, `fail`, `?`, `!`, `scoped`, and AST macros have Emvus-specific meanings.
- `{ ... }` has valid context-dependent uses, including dictionaries and positional destructuring.
- `[ ... ]` is typed as a list or tuple according to Emvus's exact-element-type rule.

The formatter should be AST-aware, preserve meaning, and never apply Emerald's `::` namespaces or semicolon requirements to `.ev` files.
