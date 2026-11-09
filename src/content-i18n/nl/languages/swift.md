# Swift Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Swift Profile

Pureline Swift volgt **idiomatic Swift 5.9 en later**: waarde semantiek, optionelen, uitputtende enums en expliciete toegangscontrole zijn taalsterktes en moeten als zodanig worden gebruikt.

### PL-SW-001. Naam volgt Swift Conventionseeeeeeee

- Typen en protocollen: `UpperCamelCase`. Leden en lokale bevolking:e `lowerCamelCase`, genoemd naar hun betekenis ([Namen](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002. Expliciete toegangscontrole

- Schrijf de toegangsniveaus expliciet. Standaard `private`; alleen uitbreiden naar `fileprivate` of `internal` als een echte consument het nodig heeft.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003. `let` over `var`

Gebruik `let` tenzij mutatie noodzakelijk is. Houd `var` locals nauw in de gaten.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004. Guard Clausles voor vroege afrit

Valideer vroeg met `guard` en houd het succesvolle pad bij basisinspringen ([Control Flow](../core/control-flow.md)). Vermijd `else` na een tak die al afgaat.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

`guard let` prefereren als een ontbrekende waarde de functie en de niet-afgepakte waarde beëindigt
waarde behoort tot het succes pad.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005. Optionelen worden veilig uitgepakt

- Uitpakken met `if let` of `guard let`; gebruik `??` voor eenvoudige standaards. Nooit force-unwrap (`!`) of `try!` buiten de tests; gebruik daar `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006. Waardetypes naar standaard

Model gegevens als `struct` en `enum`. Gebruik `class` alleen voor gedeelde identiteit of veranderlijke referentietoestand, en merk het `final` tenzij er een erfenis in is ontworpen.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007. Protocollen alleen voor echte abstracties

Stel een protocol in voor een echte verwisselbare implementatie, API grens of testnaden. Een enkel betontype zonder naad moet beton blijven ([Architectuur](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008. Uitputtende `switch` over Enums

Schakel over enums zonder `default` zodat de compiler nieuwe cases opvouwt. Gebruik `if case` of `guard case` voor een enkel patroon.

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

### PL-SW-009. Kleine, gerichte functies

Houd functies tot één niveau van abstractie: een korte reeks van genoemde stappen. Een hulpje uitpakken als een blok een naam moet begrijpen ([Functions](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010. Map Density

Een Swift bronmap moet maximaal **10 hand-onderhoud `.swift` bestanden** bevatten standaard; gegenereerde en test bestanden niet tellen. Dit is een herzieningsdrempel: split langs verantwoordelijkheidsgrenzen, nooit in betekenisloze nested mappen ([Structure](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011. Gereedschap formatteren en Lint

- Formatteer met `swift-format` en met `SwiftLint` met behulp van de project-agreed configuratie; houd uitzonderingen daar, met redenen, niet zoals verspreid `// swiftlint:disable` opmerkingen.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
