# Stile del codice Swift

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Swift {#swift-profile}

Pureline Swift segue lo **Swift idiomatico dalla versione 5.9 in poi**: semantica per valore, optional, enum esaustivi e controllo degli accessi esplicito sono punti di forza del linguaggio e vanno usati come tali.

### PL-SW-001 — I nomi seguono le convenzioni di Swift {#pl-sw-001--naming-follows-swift-conventions}

- Tipi e protocolli: `UpperCamelCase`. Membri e variabili locali: `lowerCamelCase`, con un nome in base al loro significato ([Nomi](../core/naming.md)).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

### PL-SW-002 — Controllo degli accessi esplicito {#pl-sw-002--explicit-access-control}

- Scrivi esplicitamente i livelli di accesso. Parti da `private`; allarga a `fileprivate` o `internal` solo quando lo richiede un consumatore reale.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

### PL-SW-003 — `let` al posto di `var` {#pl-sw-003--let-over-var}

Usa `let`, a meno che serva la mutazione. Mantieni le variabili locali `var` con un ambito ristretto.

```swift
let total = items.reduce(0, +)
```

### PL-SW-004 — Guard clause per l'uscita anticipata {#pl-sw-004--guard-clauses-for-early-exit}

Valida subito con `guard` e mantieni il percorso di successo all'indentazione di base ([Controllo di flusso](../core/control-flow.md)). Evita `else` dopo un ramo che già esce.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

### PL-SW-005 — Gli optional si scartano in sicurezza {#pl-sw-005--optionals-are-unwrapped-safely}

- Scarta con `if let` o `guard let`; usa `??` per i valori predefiniti semplici. Non forzare mai lo scarto (`!`) né usare `try!` fuori dai test; lì usa `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

### PL-SW-006 — Tipi valore per impostazione predefinita {#pl-sw-006--value-types-by-default}

Modella i dati come `struct` ed `enum`. Usa `class` solo per un'identità condivisa o uno stato di riferimento mutabile, e contrassegnala come `final`, a meno che l'ereditarietà sia prevista dal progetto.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

### PL-SW-007 — Protocolli solo per vere astrazioni {#pl-sw-007--protocols-only-for-real-abstractions}

Introduci un protocollo per una reale implementazione intercambiabile, un confine di API o un punto di innesto per i test. Un singolo tipo concreto senza punto di innesto dovrebbe restare concreto ([Architettura](../core/architecture.md)).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

### PL-SW-008 — `switch` esaustivo sugli enum {#pl-sw-008--exhaustive-switch-over-enums}

Fai lo switch sugli enum senza `default`, così il compilatore segnala i nuovi casi. Usa `if case` o `guard case` per un singolo pattern.

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

### PL-SW-009 — Funzioni piccole e mirate {#pl-sw-009--small-focused-functions}

Mantieni le funzioni a un solo livello di astrazione: una breve sequenza di passaggi con nome. Estrai una funzione di supporto quando un blocco ha bisogno di un nome per essere compreso ([Funzioni](../core/functions.md)).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

### PL-SW-010 — Densità delle cartelle {#pl-sw-010--folder-density}

Una cartella sorgente Swift dovrebbe contenere al massimo **10 file `.swift` mantenuti a mano** per impostazione predefinita; i file generati e di test non contano. È una soglia di revisione: dividi lungo i confini di responsabilità, mai in cartelle annidate prive di senso ([Struttura](../core/structure.md)).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

### PL-SW-011 — Gli strumenti impongono formato e lint {#pl-sw-011--tooling-enforces-format-and-lint}

- Formatta con `swift-format` e fai il lint con `SwiftLint` usando la configurazione concordata nel progetto; tieni lì le eccezioni, con i motivi, e non come commenti `// swiftlint:disable` sparsi.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```
