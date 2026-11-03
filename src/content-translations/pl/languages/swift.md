# Swift Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Swift {#swift-profile}

Pureline Swift opiera się na **idiomatycznym języku Swift 5.9 lub nowszym**: semantyka wartości, opcjonale, wyczerpujące enumy i jawna kontrola dostępu to mocne strony języka i tak należy z nich korzystać.

### PL-SW-001 — Nazewnictwo zgodne z konwencjami Swift {#pl-sw-001--naming-follows-swift-conventions}

- Typy i protokoły: `UpperCamelCase`. Składowe i zmienne lokalne: `lowerCamelCase`, nazwane według znaczenia ([Nazewnictwo](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Jawna kontrola dostępu {#pl-sw-002--explicit-access-control}

- Poziomy dostępu zapisuj jawnie. Domyślnie `private`; do `fileprivate` lub `internal` poszerzaj tylko wtedy, gdy potrzebuje tego rzeczywisty konsument.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` zamiast `var` {#pl-sw-003--let-over-var}

Używaj `let`, chyba że potrzebna jest mutacja. Zmienne lokalne `var` utrzymuj w wąskim zakresie.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard clauses dla wczesnego wyjścia {#pl-sw-004--guard-clauses-for-early-exit}

Waliduj wcześnie za pomocą `guard` i trzymaj ścieżkę sukcesu na bazowym poziomie wcięcia ([Przepływ sterowania](../core/control-flow.md)). Unikaj `else` po gałęzi, która już kończy działanie.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

### PL-SW-005 — Opcjonale rozpakowuj bezpiecznie {#pl-sw-005--optionals-are-unwrapped-safely}

- Rozpakowuj za pomocą `if let` lub `guard let`; dla prostych wartości domyślnych używaj `??`. Nigdy nie wymuszaj rozpakowania (`!`) ani `try!` poza testami; tam używaj `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Domyślnie typy wartościowe {#pl-sw-006--value-types-by-default}

Dane modeluj jako `struct` i `enum`. Klasy `class` używaj tylko dla współdzielonej tożsamości lub modyfikowalnego stanu referencyjnego i oznaczaj ją jako `final`, chyba że dziedziczenie jest zaprojektowane celowo.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protokoły tylko dla prawdziwych abstrakcji {#pl-sw-007--protocols-only-for-real-abstractions}

Wprowadzaj protokół dla rzeczywistej wymiennej implementacji, granicy API lub punktu podstawienia w testach. Pojedynczy konkretny typ bez takiego punktu powinien pozostać konkretny ([Architektura](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — Wyczerpujący `switch` po enumach {#pl-sw-008--exhaustive-switch-over-enums}

Przełączaj po enumach bez `default`, aby kompilator zgłaszał nowe przypadki. Dla pojedynczego wzorca używaj `if case` lub `guard case`.

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

### PL-SW-009 — Małe, skupione funkcje {#pl-sw-009--small-focused-functions}

Funkcje utrzymuj na jednym poziomie abstrakcji: to krótka sekwencja nazwanych kroków. Wydziel funkcję pomocniczą, gdy blok potrzebuje nazwy, by dało się go zrozumieć ([Funkcje](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Gęstość folderów {#pl-sw-010--folder-density}

Folder źródłowy Swift powinien domyślnie zawierać co najwyżej **10 ręcznie utrzymywanych plików `.swift`**; pliki generowane i testowe nie są wliczane. To próg przeglądowy: dziel wzdłuż granic odpowiedzialności, nigdy na bezsensowne zagnieżdżone foldery ([Struktura](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Narzędzia egzekwują format i lint {#pl-sw-011--tooling-enforces-format-and-lint}

- Formatuj za pomocą `swift-format`, a lintuj za pomocą `SwiftLint` z konfiguracją uzgodnioną w projekcie; wyjątki trzymaj tam, wraz z uzasadnieniem, a nie jako rozproszone komentarze `// swiftlint:disable`.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
