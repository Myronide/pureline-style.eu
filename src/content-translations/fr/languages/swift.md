# Style de code Swift

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Swift {#swift-profile}

Pureline Swift suit le **Swift idiomatique à partir de la version 5.9** : la sémantique de valeur, les optionnels, les enums exhaustifs et le contrôle d'accès explicite sont des forces du langage et doivent être utilisés comme tels.

### PL-SW-001 — Le nommage suit les conventions de Swift {#pl-sw-001--naming-follows-swift-conventions}

- Types et protocoles : `UpperCamelCase`. Membres et variables locales : `lowerCamelCase`, nommés d'après leur signification ([Nommage](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Contrôle d'accès explicite {#pl-sw-002--explicit-access-control}

- Écrivez explicitement les niveaux d'accès. Utilisez `private` par défaut ; n'élargissez à `fileprivate` ou `internal` que lorsqu'un consommateur réel en a besoin.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` plutôt que `var` {#pl-sw-003--let-over-var}

Utilisez `let`, sauf si une mutation est nécessaire. Gardez les variables locales `var` de portée étroite.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard clauses pour la sortie anticipée {#pl-sw-004--guard-clauses-for-early-exit}

Validez tôt avec `guard` et gardez le chemin de succès à l'indentation de base ([Flux de contrôle](../core/control-flow.md)). Évitez `else` après une branche qui sort déjà.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

### PL-SW-005 — Les optionnels sont déballés en toute sûreté {#pl-sw-005--optionals-are-unwrapped-safely}

- Déballez avec `if let` ou `guard let` ; utilisez `??` pour les valeurs par défaut simples. N'utilisez jamais le déballage forcé (`!`) ni `try!` en dehors des tests ; dans ceux-ci, utilisez `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Types valeur par défaut {#pl-sw-006--value-types-by-default}

Modélisez les données avec `struct` et `enum`. N'utilisez `class` que pour une identité partagée ou un état de référence mutable, et marquez-la `final` sauf si l'héritage est prévu par conception.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Des protocoles seulement pour de vraies abstractions {#pl-sw-007--protocols-only-for-real-abstractions}

Introduisez un protocole pour une véritable implémentation interchangeable, une frontière d'API ou un point d'insertion pour les tests. Un type concret unique sans point d'insertion doit rester concret ([Architecture](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — `switch` exhaustif sur les enums {#pl-sw-008--exhaustive-switch-over-enums}

Faites un switch sur les enums sans `default`, afin que le compilateur signale les nouveaux cas. Utilisez `if case` ou `guard case` pour un seul pattern.

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

### PL-SW-009 — Fonctions petites et ciblées {#pl-sw-009--small-focused-functions}

Gardez les fonctions à un seul niveau d'abstraction : une courte séquence d'étapes nommées. Extrayez une fonction auxiliaire lorsqu'un bloc a besoin d'un nom pour être compris ([Fonctions](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Densité des dossiers {#pl-sw-010--folder-density}

Un dossier source Swift doit contenir au maximum **10 fichiers `.swift` maintenus à la main** par défaut ; les fichiers générés et de test ne comptent pas. C'est un seuil de revue : découpez selon les frontières de responsabilité, jamais en dossiers imbriqués dénués de sens ([Structure](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — L'outillage impose le format et le lint {#pl-sw-011--tooling-enforces-format-and-lint}

- Formatez avec `swift-format` et analysez avec `SwiftLint` en utilisant la configuration convenue dans le projet ; gardez les exceptions dans cette configuration, avec leurs raisons, et non sous forme de commentaires `// swiftlint:disable` dispersés.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
