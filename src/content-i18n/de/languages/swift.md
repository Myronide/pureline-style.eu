# Code-Stil der Geschwindigkeit

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Schnelles Profil

Pureline Swift folgt **idiomatic Swift 5.9 und später**: Wertsemantik, optionale, erschöpfende Enums und explizite Zugriffskontrolle sind Sprachstärken und sollten als solche verwendet werden.

### PL-SW-001 — Benennung folgt schnellen Übereinkommen

- Typen und Protokolle: `UpperCamelCase`. Mitglieder und Einheimische: `lowerCamelCase`, benannt nach ihrer Bedeutung ([Naming](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — explizite Zugriffskontrolle

- Write access levels explicitly. Default to `private`; widen to `fileprivate` or `internal` only when a real consumer needs it.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` über `var`

Verwenden Sie `let`, sofern keine Mutation erforderlich ist. Halten Sie die `var`-Einheimische eng umschlossen.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Schutzklauseln für vorzeitige Ausreise

Validierung mit `guard` und halten Sie den erfolgreichen Pfad bei der Basiseinrückung ([Control Flow](../core/control-flow.md)). Vermeiden Sie `else` nach einem Zweig, der bereits beendet.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

Bevorzugen Sie `guard let`, wenn ein fehlender Wert die Funktion und das ausgepackte beendet
Wert gehört zum Erfolgspfad.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005 — Optionale sind sicher verpackt

- Auspacken mit `if let` oder `guard let`; `??` für einfache Standardeinstellungen verwenden. Nie Kraft-Auswurf (`!`) oder `try!` außerhalb Tests; dort verwenden Sie `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Standardmäßiger Wert

Daten als `struct` und `enum` modellieren. Verwenden Sie `class` nur für gemeinsame Identität oder wandelbaren Referenzzustand und markieren Sie es `final`, es sei denn, Vererbung ist in.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protokolle nur für echte Abstractionen

Einführung eines Protokolls für eine echte austauschbare Implementierung, API-Grenze oder Testnaht. Ein einzelner Betontyp ohne Naht sollte Beton bleiben ([Architektur](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — Erschöpfendes `switch` über Enums

Wechseln Sie Enums ohne `default`, so dass der Compiler neue Fälle markiert. Verwenden Sie `if case` oder `guard case` für ein einzelnes Muster.

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

### PL-SW-009 — Kleine, fokussierte Funktionen

Funktionen auf einer Ebene der Abstraktion halten: eine kurze Folge von benannten Schritten. Extrahieren Sie einen Helfer, wenn ein Block einen Namen versteht ([Funktionen](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Ordnerdichte

Ein Swift-Quellordner sollte standardmäßig höchstens **10 handgepflegete `.swift`-Dateien** enthalten; generierte und Testdateien zählen nicht. Dies ist ein Überprüfungsschwellenwert: die sich entlang der Verantwortungsgrenzen teilen, niemals in bedeutungslose verschachtelte Ordner ([Struktur](../core/structure.md))).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Werkzeugbau-Werkzeuge Format und Lint

- Formatieren Sie mit `swift-format` und Flint mit `SwiftLint` unter Verwendung der projekt-abgeschlossenen Konfiguration; halten Sie Ausnahmen dort, mit Gründen, nicht als verstreut `// swiftlint:disable` Kommentare.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
