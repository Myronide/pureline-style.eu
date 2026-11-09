# Estilo de código Swift

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil Swift

Pureline Swift sigue a **idiomatic Swift 5.9 y más tarde**: valor semántica, opcional, enumes exhaustivos y control de acceso explícito son fortalezas del lenguaje y deben ser utilizadas como tales.

### PL-SW-001 — La denominación sigue las convenciones de Swift

- Tipos y protocolos: `UpperCamelCase`. Miembros y lugareños: `lowerCamelCase`, cuyo nombre se debe a su significado [[Naming](../core/naming.md)].

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Control explícito del acceso

- Escriba explícitamente los niveles de acceso. Por defecto a `private`; ampliar a `fileprivate` o `internal` sólo cuando un consumidor real lo necesita.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` sobre `var`

Use `let` a menos que se requiera mutación. Mantenga a los locales de `var` con un alcance estrecho.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Cláusulas de protección para la salida anticipada

Validar al principio con `guard` y mantener la ruta correcta en la sangría de la base [[Flow de control](../core/control-flow.md)]. Evite `else` después de una rama que ya sale.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

Prefiere `guard let` cuando un valor faltante termina la función y el desenvolver
el valor pertenece al camino del éxito.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005 — Las opciones se desenvuelven con seguridad

- Desenvolver con `if let` o `guard let`; utilizar `??` para los valores predeterminados simples. Nunca se desenvuelvan las pruebas externas (`!`) o `try!`; allí, use `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Tipos de valor por defecto

Datos de modelo como `struct` y `enum`. Use `class` sólo para identidad compartida o estado de referencia mutable, y marque `final` a menos que la herencia esté diseñada.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protocolos sólo para abstracciones reales

Introducir un protocolo para una implementación intercambiable real, límite API o seam de prueba. Un único tipo de hormigón sin seam debe permanecer en concreto [Arquitectura](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — `switch` exhaustivo sobre enumes

Cambiar sobre enums sin `default` para que el compilador marque nuevos casos. Utilice `if case` o `guard case` para un solo patrón.

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

### PL-SW-009 — Funciones pequeñas y centradas

Mantenga las funciones a un nivel de abstracción: una breve secuencia de pasos nombrados. Extraer un ayudante cuando un bloque necesita un nombre para ser entendido ([Funciones](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Densidad de la carpeta

A Swift source folder should contain at most **10 hand-maintained `.swift` files** by default; generated and test files do not count. This is a review threshold: split along responsibility boundaries, never into meaningless nested folders ([Structure](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Herramientas hace cumplir formato y Lint

- Formatee con `swift-format` y pelusa con `SwiftLint` usando la configuración de proyecto; mantenga excepciones allí, con razones, no como comentarios `// swiftlint:disable` dispersos.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
