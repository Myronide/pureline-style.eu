# Swift Code Style

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Swift Profile

Pureline Swift follows **idiomatic Swift 5.9 and later**: value semantics, optionals, exhaustive enums, and explicit access control are language strengths and should be used as such.

### PL-SW-001 — Naming Follows Swift Conventions

- Types and protocols: `UpperCamelCase`. Members and locals: `lowerCamelCase`, named for their meaning ([Naming](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Explicit Access Control

- Write access levels explicitly. Default to `private`; widen to `fileprivate` or `internal` only when a real consumer needs it.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` over `var`

Use `let` unless mutation is required. Keep `var` locals narrowly scoped.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard Clauses for Early Exit

Validate early with `guard` and keep the successful path at base indentation ([Control Flow](../core/control-flow.md)). Avoid `else` after a branch that already exits.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

Prefer `guard let` when a missing value ends the function and the unwrapped
value belongs to the success path.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005 — Optionals Are Unwrapped Safely

- Unwrap with `if let` or `guard let`; use `??` for simple defaults. Never force-unwrap (`!`) or `try!` outside tests; there, use `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Value Types by Default

Model data as `struct` and `enum`. Use `class` only for shared identity or mutable reference state, and mark it `final` unless inheritance is designed in.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protocols Only for Real Abstractions

Introduce a protocol for a real interchangeable implementation, API boundary, or test seam. A single concrete type with no seam should stay concrete ([Architecture](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — Exhaustive `switch` over Enums

Switch over enums without `default` so the compiler flags new cases. Use `if case` or `guard case` for a single pattern.

```swift
enum SessionState { case ready, closed, failed }

func label(for state: SessionState) -> String {
    switch state {
    case .ready: return "Ready"
    case .closed: return "Closed"
    case .failed: return "Failed"
    }
}
```

### PL-SW-009 — Small, Focused Functions

Keep functions to one level of abstraction: a short sequence of named steps. Extract a helper when a block needs a name to be understood ([Functions](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Densité du dossier

A Swift source folder should contain at most **10 hand-maintained `.swift` files** by default; generated and test files do not count. Il s'agit d'un seuil de révision: split along responsibility boundaries, never into meaningless nested folders ([Structure](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Tooling Enforces Format and Lint

- Format with `swift-format` and lint with `SwiftLint` using the project-agreed configuration; keep exceptions there, with reasons, not as scattered `// swiftlint:disable` comments.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
