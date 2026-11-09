# Stile codice Swift

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Profilo swift

Pureline Swift segue **idiomatic Swift 5.9 e la successiva **: value semantics, optionals, exhaustive enums, and explicit access control are language strengths and should be used as such.

### PL-SW-001. Naming segue convenzioni di swift

- Tipi e protocolli: `UpperCamelCase`. Membri e locali: `lowerCamelCase`, named for their meaning ([Naming](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002. Controllo esplicito degli accessi

- Write access levels explicitly. Predefinito in `private`; allargare a `fileprivate` o `internal` solo quando un vero consumatore ne ha bisogno.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003. `let` su `var`

Use `let` unless mutation is required. Keep `var` locals narrowly scoped.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004. Clausole di guardia per l'uscita anticipata

Convalidare in anticipo con `guard` e mantenere il percorso riuscito all'indentazione base ([Control Flow](../core/control-flow.md)).. Avoid `else` after a branch that already exits.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

Preferisci `guard let` quando un valore mancante termina la funzione e l'incartamento
value belongs to the success path.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005. Opzionali sono non avvolti in modo sicuro

- Scaricare con `if let` o `guard let`; utilizzare `??` per semplici default... Never force-unwrap (`!`) or `try!` outside tests; there, use `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006. Tipi di valore per impostazione predefinita

Model data as `struct` and `enum`. Usa `class` solo per l'identità condivisa o lo stato di riferimento mutabile, e segnalo `final` a meno che l'eredità non sia progettata..

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007. Protocolli solo per reali astrazioni

Introduce a protocol for a real interchangeable implementation, API boundary, or test seam. A single concrete type with no seam should stay concrete ([Architecture](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008. `switch` esausto su Enum

Passare su eUM senza `default` in modo che il compilatore segnala nuovi casi. i nuovi casi. Usa `if case` o `guard case` per un singolo motivo...

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

### PL-SW-009. Piccole funzioni focalizzate

Mantieni le funzioni ad un livello di astrazione:. a short sequence of named steps. Estrarre un helper quando un blocco ha bisogno di un nome da capire ([Functions](../core/functions.md))...

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### Densità della cartella PL-SW-010

A Swift source folder should contain at most **10 hand-maintained `.swift` files** by default; generated and test files do not count. This is a review threshold: split along responsibility boundaries, never into meaningless nested folders ([Structure](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011. Tooling Enforces Format and Lint

- Formato con `swift-format` e lint con `SwiftLint` utilizzando la configurazione concordata dal progetto; mantenere le eccezioni lì, con motivi, non come commenti sparsi `// swiftlint:disable`.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
