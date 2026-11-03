# Swift Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Swift-Profil {#swift-profile}

Pureline Swift folgt **idiomatischem Swift 5.9 und neuer**: Wertsemantik, Optionals, erschöpfende Enums und explizite Zugriffskontrolle sind Stärken der Sprache und sollen auch so genutzt werden.

### PL-SW-001 — Die Benennung folgt den Swift-Konventionen {#pl-sw-001--naming-follows-swift-conventions}

- Typen und Protokolle: `UpperCamelCase`. Member und lokale Variablen: `lowerCamelCase`, benannt nach ihrer Bedeutung ([Benennung](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Explizite Zugriffskontrolle {#pl-sw-002--explicit-access-control}

- Schreibe Zugriffsebenen explizit. Der Standard ist `private`; erweitere auf `fileprivate` oder `internal` nur, wenn ein echter Konsument es braucht.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` statt `var` {#pl-sw-003--let-over-var}

Verwende `let`, solange keine Mutation nötig ist. Halte lokale `var`-Variablen eng begrenzt.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard Clauses für den frühen Ausstieg {#pl-sw-004--guard-clauses-for-early-exit}

Validiere früh mit `guard` und halte den erfolgreichen Pfad auf der Basis-Einrückung ([Kontrollfluss](../core/control-flow.md)). Vermeide `else` nach einem Zweig, der bereits verlässt.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

Bevorzuge `guard let`, wenn ein fehlender Wert die Funktion beendet und
der ausgepackte Wert im Erfolgspfad gebraucht wird.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005 — Optionals werden sicher entpackt {#pl-sw-005--optionals-are-unwrapped-safely}

- Entpacke mit `if let` oder `guard let`; verwende `??` für einfache Standardwerte. Erzwinge das Entpacken (`!`) oder `try!` niemals außerhalb von Tests; verwende dort `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Standardmäßig Werttypen {#pl-sw-006--value-types-by-default}

Modelliere Daten als `struct` und `enum`. Verwende `class` nur für gemeinsame Identität oder veränderlichen Referenzzustand und markiere sie als `final`, es sei denn, Vererbung ist vorgesehen.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protokolle nur für echte Abstraktionen {#pl-sw-007--protocols-only-for-real-abstractions}

Führe ein Protokoll für eine echte austauschbare Implementierung, eine API-Grenze oder eine Test-Naht ein. Ein einzelner konkreter Typ ohne Naht bleibt konkret ([Architektur](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — Erschöpfendes `switch` über Enums {#pl-sw-008--exhaustive-switch-over-enums}

Schalte über Enums ohne `default`, damit der Compiler neue Fälle meldet. Verwende `if case` oder `guard case` für ein einzelnes Muster.

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

### PL-SW-009 — Kleine, fokussierte Funktionen {#pl-sw-009--small-focused-functions}

Halte Funktionen auf einer Abstraktionsebene: eine kurze Folge benannter Schritte. Extrahiere einen Helfer, wenn ein Block einen Namen braucht, um verständlich zu sein ([Funktionen](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Ordnerdichte {#pl-sw-010--folder-density}

Ein Swift-Quellordner soll standardmäßig höchstens **10 von Hand gepflegte `.swift`-Dateien** enthalten; generierte Dateien und Testdateien zählen nicht. Das ist eine Review-Schwelle: Teile entlang von Verantwortungsgrenzen auf, niemals in sinnlos verschachtelte Ordner ([Struktur](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Tooling erzwingt Format und Lint {#pl-sw-011--tooling-enforces-format-and-lint}

- Formatiere mit `swift-format` und linte mit `SwiftLint` anhand der projektweit vereinbarten Konfiguration; halte Ausnahmen dort samt Begründung, nicht als verstreute `// swiftlint:disable`-Kommentare.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
