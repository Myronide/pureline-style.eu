# Klassen, Module und Ordnerdichte

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Klassen und Module {#classes-and-modules}

### PL-STRUCT-001 — Eine klare Verantwortung {#pl-struct-001--one-clear-responsibility}

Vermeide Strukturen wie:

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

Bevorzuge:

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

Eine Klasse hat eine klare Verantwortung, wenn ihre Member und ihr interner Zustand zu einem zusammenhängenden Aufgabenbereich beitragen. **Die Zeilenzahl allein entscheidet nicht darüber, ob eine Klasse gut entworfen ist.** Richtwerte zur Größe stehen in `PL-STRUCT-003`.

---

## Paket- und Ordnerdichte {#package-and-folder-density}

### PL-STRUCT-002 — Namensräume klein genug halten, um sie zu überschauen {#pl-struct-002--keep-namespaces-small-enough-to-scan}

Pureline betrachtet die Dichte von Dateien und Typen als Teil der Lesbarkeit von Code.

Ein Paket oder Quellordner soll klein genug sein, dass Entwickler seinen Inhalt auf einen Blick erfassen, ohne eine lange, flache Liste unzusammenhängender Dateien durchsuchen zu müssen.

Wird das Limit überschritten, teile das Paket oder den Ordner nach Verantwortung auf, statt es zur Müllhalde werden zu lassen.

#### Standardlimits {#default-limits}

| Sprache | Pureline-Standard |
|---|---|
| Java | Höchstens 8 produktive Top-Level-Typen/Quelldateien pro Paket |
| Emerald | Höchstens 8 produktive `.ems`-Quelldateien pro Quell-/Namespace-Ordner |
| Emvus | Höchstens 8 produktive `.ev`-Quelldateien pro Paket/Quellordner |
| JavaScript | Höchstens 10 produktive Quellmodule pro Feature-/Quellordner |
| TypeScript | Höchstens 10 produktive Quellmodule pro Feature-/Quellordner |
| Go | Höchstens 12 `.go`-Dateien pro Paketverzeichnis, ohne Tests und generierte Dateien |
| Crystal | Höchstens 10 produktive `.cr`-Dateien pro Quell-/Namespace-Ordner |
| Rust | Höchstens 10 von Hand gepflegte produktive `.rs`-Dateien pro Feature-/Quellordner |

Diese Dateien zählen nicht zum Limit:

- Tests und Specs
- generierte Quelldateien
- reine Metadaten-Dateien
- `package-info.java`
- `module-info.java`
- Barrel-Dateien in JavaScript/TypeScript wie `index.ts` oder `index.js`
- generierte Bindings oder Protokollausgaben
- Migrations-Snapshots und vergleichbare maschinell erzeugte Artefakte

Diese Regel soll keine willkürliche Ordnerverschachtelung erzwingen. Eine Aufteilung soll eine echte Verantwortungsgrenze einführen.

Schlecht:

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

Bevorzugt:

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

Ein Projekt darf diese Schwellenwerte künftig über eine Pureline-Konfigurationsdatei überschreiben, doch die Standardregel soll bewusst streng bleiben.

---

## Kohäsion vor Größe {#cohesion-over-size}

### PL-STRUCT-003 — Kohäsion vor Größe (Zusammengehörigkeit vor Zeilenbegrenzung) {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung} {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung}

> **Kohäsion vor Größe — Zusammengehörigkeit vor Zeilenbegrenzung.**

Die bevorzugte maximale Klassengröße ist ein **Richtwert, niemals eine harte Grenze**. Halte eng zusammengehörige Logik zusammen, wenn eine Aufteilung den Code schwerer lesbar, wartbar, testbar oder nachvollziehbar machen würde. Eine größere kohäsive Klasse ist mehreren künstlichen Klassen vorzuziehen, die durch unnötige Delegation verbunden sind.

#### Richtwerte zur Klassengröße {#class-size-guidance}

| Klassengröße | Pureline-Empfehlung |
|---|---|
| Bis 200 Zeilen | Bevorzugter Normalfall |
| 201–400 Zeilen | Unproblematisch, wenn die Klasse eine klare Verantwortung hat |
| 401–600 Zeilen | Bewusste Architekturentscheidung; die Kohäsion soll nachvollziehbar bleiben |
| Mehr als 600 Zeilen | Review empfohlen, **nicht verboten** |

Die Bereiche sind **Heuristiken, keine harten Grenzen**. Das Überschreiten einer Schwelle darf für sich genommen weder einen Stilverstoß ergeben noch eine Aufteilung erzwingen.

#### Wann größere Klassen gerechtfertigt sind {#when-larger-classes-are-justified}

- **Parser und Lexer:** Eine kohäsive Zustandsmaschine kann komplizierter werden, wenn ihre Zustände und Übergänge über künstliche Abstraktionen verstreut sind.
- **Algorithmen:** Eng gekoppelte Verarbeitungsphasen sind oft leichter zu verstehen und zu optimieren, wenn sie zusammenbleiben.
- **Zentrale Datenstrukturen:** Methoden, die dieselben Invarianten und denselben internen Zustand teilen, können in eine Klasse gehören.
- **Komplexe, aber kohäsive Logik:** Aufteilen ist kontraproduktiv, wenn es Indirektion, unnötige Delegation oder mehr Koordinationsaufwand als Klarheit bringt.

#### Wann trotzdem aufgeteilt wird {#when-to-split-anyway}

Teile nach **echten Verantwortungsgrenzen** auf, nicht nach Zeilenzahl. Hinweise darauf sind unterschiedliche Teilsysteme, die sich unabhängig voneinander entwickeln, voneinander unabhängige Änderungsgründe, schwache Kopplung zwischen Methodengruppen oder getrennte Lebenszyklen, die durch eine einzige Klasse verdeckt werden.

**Tooling-Regel:** Pureline Checker und IDE-Inspektionen dürfen einen informativen Größenhinweis mit einem Vorschlag zur Kohäsionsprüfung anzeigen, besonders ab 600 Zeilen. Sie dürfen die Zeilenzahl nicht als ausreichenden Beleg für einen Verstoß werten, nicht automatisch Klassen extrahieren und keine Unterdrückungen verlangen, nur um eine kohäsive Klasse intakt zu halten.

Dieses Prinzip gilt für **alle Pureline-Sprachprofile**, darunter Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald und Emvus. Sprachspezifische Syntax und Idiome haben weiterhin Vorrang.
