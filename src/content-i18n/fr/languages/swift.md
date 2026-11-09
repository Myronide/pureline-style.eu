# Style de code rapide

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil rapide

Pureline Swift follows **idiomatic Swift 5.9 and later**: value semantics, optionals, exhaustive enums, and explicit access control are language strengths and should be used as such.

### PL-SW-001 — La désignation suit les conventions rapides

- Types et protocoles: `UpperCamelCase`. Membres et locaux: `lowerCamelCase`, nommé pour leur signification ([Naming](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Contrôle d'accès explicite

- Write access levels explicitly. Default to `private`; widen to `fileprivate` or `internal` only when a real consumer needs it.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` au-dessus de `var`

Utilisez `let` sauf si la mutation est nécessaire. Gardez les locaux `var` étroitement visés.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Clauses de garde pour sortie anticipée

Valider tôt avec `guard` et garder le chemin réussi à l'indentation de base ([Control Flow](../core/control-flow.md)). Évitez `else` après une branche qui sort déjà.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

Préférez `guard let` quand une valeur manquante termine la fonction et le non wrapped
la valeur appartient au chemin du succès.

```text
− if let                              │ ✓ Pureline
if let user = users[id] {             │ guard let user = users[id] else {
    return user.name                  │     return "Gast"
}                                     │ }
                                      │
return "Gast"                         │ return user.name
```

### PL-SW-005 — Les options sont déballées en toute sécurité

- Dépouillez avec `if let` ou `guard let`; utilisez `??` pour les simples par défaut. Ne jamais forcer le déverrouillage (`!`) ou les essais extérieurs `try!`; là, utiliser `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Types de valeur par défaut

Les données de modèle sont `struct` et `enum`. Utilisez `class` uniquement pour l'identité partagée ou l'état de référence mutable, et marquez-le `final` à moins que l'héritage n'ait été conçu.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protocoles uniquement pour les abstractions réelles

Introduire un protocole pour une implémentation réelle de la marque, une limite API ou une seam de test. Un seul type de béton sans sem doit rester en béton ([Architecture](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — `switch` exhaustif sur les enums

Passez sur les enums sans `default` donc la NFS signe de nouvelles affaires. Utilisez `if case` ou `guard case` pour un seul motif.

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

### PL-SW-009 — Petites fonctions ciblées

Gardez les fonctions à un niveau d'abstraction : une courte séquence de marches nommées. Extraire un helper lorsqu'un bloc a besoin d'un nom à comprendre ([Fonctions](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Densité du dossier

A Swift source folder should contain at most **10 hand-maintained `.swift` files** by default; generated and test files do not count. This is a review threshold: split along responsibility boundaries, never into meaningless nested folders ([Structure](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — L'outillage fait usage du format et du lint

- Format avec `swift-format` et lint avec `SwiftLint` en utilisant la configuration projet-agreed; gardez des exceptions là, avec des raisons, pas comme des commentaires `// swiftlint:disable` dispersés.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
