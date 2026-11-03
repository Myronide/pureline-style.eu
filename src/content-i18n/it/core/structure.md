# Classes, Modules, and Folder Density

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Classes and Modules

### PL-STRUCT-001. Una responsabilità chiara l'uso di un'altro è stato di

Avoid structures like:

```text
ServerManager
 ├─ database
 ├─ players
 ├─ packets
 ├─ commands
 ├─ configuration
 ├─ HTTP
 └─ logging
```

Prefer:

```text
server/
    ServerRuntime

network/
    Connection
    PacketRegistry
    PacketDispatcher

session/
    Session
    SessionService

storage/
    UserStorage
    SessionStorage
```

A class has one clear responsibility when its members and internal state contribute to one cohesive concern. **Line count alone does not determine whether a class is well designed.** See `PL-STRUCT-003` for size guidance.

---

## Package and Folder Density

### PL-STRUCT-002. Mantenere spazi di nomi piccoli abbastanza da essere scansionati

Pureline treats file and type density as part of code readability.

Un pacchetto o una cartella sorgente dovrebbe essere abbastanza piccolo da poterne comprendere il contenuto in un colpo d'occhio senza cercare una lunga lista di file non correlati..

When the limit is exceeded, split the package or folder by responsibility instead of allowing it to become a dumping ground.

#### Default limits

|Lingua|Predefinito Pureline|
|---|---|
| Java |Massimo 8 tipi di produzione di primo livello/file sorgente per pacchetto|
|Smeraldo|Massima 8 produzione di file sorgente `.ems` per cartella sorgente/namespace|
|Empus|Massima 8 produzione file sorgente `.ev` per pacchetto/cartella sorgente|
|JavaScript|Massimo 10 moduli di produzione per cartella funzione/fonte|
|TipoScript|Massimo 10 moduli di produzione per cartella funzione/fonte|
|Vai|Massimo 12 file `.go` non generati per cartella dei pacchetti|
|Cristallo|Massima 10 file `.cr` di produzione per cartella sorgente/namespace|
|Rust|Massimo 10 file `.rs` di produzione curati a mano per cartella funzione/fonte|

Questi file non contano verso il limite:

- prove e specs
- generated source files
- metadata-only files
- `package-info.java`
- `module-info.java`
- JavaScript/TypeScript barrel files such as `index.ts` or `index.js`
- generated bindings or protocol output
- snapshot di migrazione e manufatti prodotti con macchine comparabili (')..oratoxeoxeoxeeeee..

The purpose of this rule is not to force arbitrary folder nesting. A split should introduce a real responsibility boundary.

Bad:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java
    PacketHandler.java
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Preferred:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java

network/packet/
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java

network/runtime/
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

A project may override these thresholds through a future Pureline configuration file, but the default rule should remain intentionally strict.

---

## Cohesion over Size

### PL-STRUCT-003 — Cohesion over Size (Zusammengehörigkeit vor Zeilenbegrenzung)

> **Cohesion over Size — Zusammengehörigkeit vor Zeilenbegrenzung.**

The preferred maximum class size is **guidance, never a hard limit**. Keep strongly related logic together when splitting it would make the code harder to read, maintain, test, or reason about. A larger cohesive class is preferable to multiple artificial classes connected by unnecessary delegation.

#### Class size guidance

|Dimensione della classe|Raccomandazione Pureline|
|---|---|
|Fino a 200 linee|Caso normale preferito|
|201.400 linee|Non problematico quando la classe ha una chiara responsabilità|
|401.600 linee|Deliberare la decisione architettonica; mantenere la sua coesione comprensibile|
| More than 600 lines | Review recommended, **not prohibited** |

The ranges are **heuristics, not hard limits**. Crossing a threshold must not, by itself, produce a style violation or require a split.

#### When larger classes are justified

- **Parsers and lexers:** A cohesive state machine may become more complicated when its states and transitions are scattered across artificial abstractions.
- **Algorithms:** Tightly coupled processing phases can be easier to understand and optimize when kept together.
- **Central data structures:** Methods sharing the same invariants and internal state can belong in one class.
- **Complex but cohesive logic:** Splitting is counterproductive when it adds indirection, unnecessary delegation, or more coordination than clarity.

#### Quando dividere comunque

Split by **real responsibility boundaries**, not by line count. Indicators include distinct subsystems evolving independently, unrelated reasons to change, weak coupling among groups of methods, or separate lifecycles that are obscured by one class.

**Tooling rule:** Pureline Checker and IDE inspections may show an informational size notice with a cohesion-review suggestion, particularly above 600 lines. They must not treat the number of lines as sufficient evidence of a violation, automatically extract classes, or require suppressions merely to keep a cohesive class intact.

This principle applies to **all Pureline language profiles**, including Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, and Emvus. Language-specific syntax and idioms continue to take precedence.
