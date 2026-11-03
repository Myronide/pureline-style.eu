# Swift-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Swift-profiel {#swift-profile}

Pureline Swift volgt **idiomatisch Swift 5.9 en nieuwer**: waardesemantiek, optionals, uitputtende enums en expliciete toegangscontrole zijn sterke kanten van de taal en moeten ook zo worden gebruikt.

### PL-SW-001 — Naamgeving volgt de conventies van Swift {#pl-sw-001--naming-follows-swift-conventions}

- Typen en protocollen: `UpperCamelCase`. Leden en lokale variabelen: `lowerCamelCase`, benoemd naar hun betekenis ([Naamgeving](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Expliciete toegangscontrole {#pl-sw-002--explicit-access-control}

- Schrijf toegangsniveaus expliciet op. Gebruik standaard `private`; verbreed naar `fileprivate` of `internal` alleen wanneer een echte consument dat nodig heeft.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` boven `var` {#pl-sw-003--let-over-var}

Gebruik `let`, tenzij mutatie nodig is. Houd lokale `var`-variabelen beperkt in bereik.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard clauses voor vroege uitgang {#pl-sw-004--guard-clauses-for-early-exit}

Valideer vroeg met `guard` en houd het succespad op het basisinspringniveau ([Besturingsstroom](../core/control-flow.md)). Vermijd `else` na een tak die al verlaat.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

### PL-SW-005 — Optionals worden veilig uitgepakt {#pl-sw-005--optionals-are-unwrapped-safely}

- Pak uit met `if let` of `guard let`; gebruik `??` voor eenvoudige standaardwaarden. Gebruik nooit force-unwrap (`!`) of `try!` buiten tests; gebruik daar `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Standaard waardetypen {#pl-sw-006--value-types-by-default}

Modelleer data als `struct` en `enum`. Gebruik `class` alleen voor gedeelde identiteit of veranderlijke referentietoestand, en markeer haar als `final`, tenzij overerving bewust is ontworpen.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protocollen alleen voor echte abstracties {#pl-sw-007--protocols-only-for-real-abstractions}

Introduceer een protocol voor een echte verwisselbare implementatie, API-grens of testnaad. Een enkel concreet type zonder naad moet concreet blijven ([Architectuur](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — Uitputtende `switch` over enums {#pl-sw-008--exhaustive-switch-over-enums}

Switch over enums zonder `default`, zodat de compiler nieuwe cases signaleert. Gebruik `if case` of `guard case` voor één enkel patroon.

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

### PL-SW-009 — Kleine, gefocuste functies {#pl-sw-009--small-focused-functions}

Houd functies op één abstractieniveau: een korte reeks benoemde stappen. Extraheer een hulpfunctie wanneer een blok een naam nodig heeft om te worden begrepen ([Functies](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Mapdichtheid {#pl-sw-010--folder-density}

Een Swift-bronmap moet standaard maximaal **10 handmatig onderhouden `.swift`-bestanden** bevatten; gegenereerde bestanden en testbestanden tellen niet mee. Dit is een drempel voor review: splits langs verantwoordelijkheidsgrenzen, nooit in zinloze geneste mappen ([Structuur](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Tooling dwingt opmaak en lint af {#pl-sw-011--tooling-enforces-format-and-lint}

- Formatteer met `swift-format` en lint met `SwiftLint` met de configuratie waarover het project het eens is; houd uitzonderingen daar, met redenen, en niet als verspreide `// swiftlint:disable`-opmerkingen.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
