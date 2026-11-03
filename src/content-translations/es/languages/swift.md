# Estilo de código Swift

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Swift {#swift-profile}

Pureline Swift sigue el **Swift idiomático 5.9 y posterior**: la semántica de valor, los opcionales, los enums exhaustivos y el control de acceso explícito son puntos fuertes del lenguaje y deben usarse como tales.

### PL-SW-001 — Los nombres siguen las convenciones de Swift {#pl-sw-001--naming-follows-swift-conventions}

- Tipos y protocolos: `UpperCamelCase`. Miembros y variables locales: `lowerCamelCase`, con nombres según su significado ([Nombres](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Control de acceso explícito {#pl-sw-002--explicit-access-control}

- Escribe los niveles de acceso de forma explícita. Usa `private` por defecto; amplía a `fileprivate` o `internal` solo cuando un consumidor real lo necesite.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` antes que `var` {#pl-sw-003--let-over-var}

Usa `let` salvo que haga falta mutar. Mantén las variables locales `var` con un ámbito reducido.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard clauses para la salida temprana {#pl-sw-004--guard-clauses-for-early-exit}

Valida pronto con `guard` y mantén el camino de éxito en la sangría base ([Flujo de control](../core/control-flow.md)). Evita `else` después de una rama que ya sale.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

### PL-SW-005 — Los opcionales se desenvuelven de forma segura {#pl-sw-005--optionals-are-unwrapped-safely}

- Desenvuelve con `if let` o `guard let`; usa `??` para los valores por defecto simples. No uses nunca el desenvuelto forzado (`!`) ni `try!` fuera de los tests; allí, usa `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Tipos de valor por defecto {#pl-sw-006--value-types-by-default}

Modela los datos como `struct` y `enum`. Usa `class` solo para una identidad compartida o un estado de referencia mutable, y márcala como `final` salvo que la herencia esté prevista en el diseño.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protocolos solo para abstracciones reales {#pl-sw-007--protocols-only-for-real-abstractions}

Introduce un protocolo para una implementación intercambiable real, un límite de API o un punto de sustitución para tests. Un único tipo concreto sin punto de sustitución debe seguir siendo concreto ([Arquitectura](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — `switch` exhaustivo sobre los enums {#pl-sw-008--exhaustive-switch-over-enums}

Haz el switch sobre los enums sin `default`, para que el compilador señale los casos nuevos. Usa `if case` o `guard case` para un único patrón.

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

### PL-SW-009 — Funciones pequeñas y enfocadas {#pl-sw-009--small-focused-functions}

Mantén las funciones en un único nivel de abstracción: una secuencia corta de pasos con nombre. Extrae una función auxiliar cuando un bloque necesite un nombre para entenderse ([Funciones](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Densidad de carpetas {#pl-sw-010--folder-density}

Una carpeta de código fuente de Swift debe contener como máximo **10 archivos `.swift` mantenidos a mano** por defecto; los archivos generados y los de tests no cuentan. Es un umbral de revisión: divide según los límites de responsabilidad, nunca en carpetas anidadas sin sentido ([Estructura](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Las herramientas hacen cumplir el formato y el lint {#pl-sw-011--tooling-enforces-format-and-lint}

- Da formato con `swift-format` y haz lint con `SwiftLint` usando la configuración acordada por el proyecto; mantén allí las excepciones, con sus motivos, y no como comentarios `// swiftlint:disable` dispersos.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
