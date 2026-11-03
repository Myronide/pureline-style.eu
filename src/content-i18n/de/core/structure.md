# Klassen, Module und Ordnerdichte

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Klassen und Module

### PL-STRUCT-001 — Eine klare Verantwortung

Vermeiden Sie Strukturen wie:

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

Eine Klasse hat eine klare Verantwortung, wenn ihre Mitglieder und ihr interner Staat zu einem zusammenhängenden Anliegen beitragen. **Line zählt allein nicht, ob eine Klasse gut gestaltet ist.** Siehe `PL-STRUCT-003` für Größenführung.

---

## Paket- und Ordnerdichte

### PL-STRUCT-002 — Halten Sie Namensräume klein genug, um zu scannen

Pureline behandelt Datei- und Typdichte als Teil der Code-Lesebarkeit.

Ein Paket- oder Quellordner sollte klein genug sein, dass ein Entwickler seinen Inhalt auf einen Blick verstehen kann, ohne eine lange, flache Liste von nicht verwandten Dateien zu durchsuchen.

Wenn die Grenze überschritten wird, teilen Sie das Paket oder die Mappe durch Verantwortung, anstatt es zu einem Dumpinggrund zu machen.

#### Standardgrenzen

|Sprache|Pureline Standardeinstellung|
|---|---|
|Java|Maximal 8 Produktions-Top-Level-Typen/Quelldateien pro Paket|
|Emerald|Maximal 8 Produktion `.ems` Quelldateien pro Quell-/Namespace-Ordner|
|Emvus|Maximal 8 Produktion `.ev` Quelldateien pro Paket/Quelle Ordner|
|JavaScript|Maximal 10 Produktionsquellenmodule pro Feature/Source-Ordner|
|TypScript|Maximal 10 Produktionsquellenmodule pro Feature/Source-Ordner|
|Geh.|Maximal 12 nicht getestete, nicht generierte `.go`-Dateien pro Paketverzeichnis|
|Kristall|Maximal 10 `.cr`-Dateien pro Quell-/Namensraum-Ordner|
|Rost|Maximal 10 handgepflegte Produktion `.rs`-Dateien pro Feature/Source-Ordner|

Diese Dateien zählen nicht zum Limit:

- Prüfungen und Spezifikationen
- generierte Quelldateien
- Metadaten-nur Dateien
- `package-info.java`
- `module-info.java`
- JavaScript/TypeScript-Laufdateien wie `index.ts` oder `index.js`
- generierte Bindungen oder Protokollausgabe
- Migrations-Snapshots und vergleichbare maschinengenerierte Artefakte

Der Zweck dieser Regel ist nicht, willkürliche Ordnernten zu zwingen. Eine Spaltung sollte eine echte Verantwortungsgrenze einführen.

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

Ein Projekt kann diese Schwellenwerte über eine zukünftige Pureline-Konfigurationsdatei hinwegnehmen, aber die Standardregel sollte absichtlich streng bleiben.

---

## Kohäsion über die Größe

### PL-STRUCT-003 — Kohäsion über die Größe (Seniorenlinie vor777))

> **Cohesion over Size — Zusammengehörigkeit vor Zeilenbegrenzung.**

Die bevorzugte maximale Klassengröße ist **guidance, nie ein hartes Limit**. Halten Sie stark verwandte Logik zusammen, wenn es den Code zu trennen würde schwerer zu lesen, zu pflegen, zu testen, oder Grund darüber. Eine größere zusammenhängende Klasse ist mehreren künstlichen Klassen vorzuziehen, die durch unnötige Delegation verbunden sind.

#### Klassengrößenführung

|Klassengröße|Empfehlung Pureline|
|---|---|
|Bis zu 200 Leitungen|Bevorzugter normaler Fall|
|201–400 Linien|Unproblematisch, wenn die Klasse eine klare Verantwortung trägt|
|401–600 Linien|Deliberieren Sie architektonische Entscheidung; halten Sie seinen Zusammenhalt verständlich|
|Mehr als 600 Linien|Bewertung empfohlen, **not verboten**|

Die Reichweiten sind **heuristik, keine harten Grenzen**. Überschreiten einer Schwelle darf nicht allein einen Stilverletzung oder eine Spaltung erfordern.

#### Wenn größere Klassen gerechtfertigt sind

- **Parser und Alexer:** Eine kohäsive Zustandsmaschine kann komplizierter werden, wenn ihre Zustände und Übergänge über künstliche Abstraktionen verstreut sind.
- **Algorithmen:** Eng gekoppelte Verarbeitungsphasen können leichter zu verstehen und zu optimieren sein, wenn sie zusammengehalten werden.
- **Zentrale Datenstrukturen:** Methoden, die dieselben Invarianten und einen internen Zustand teilen, können in einer Klasse gehören.
- **Komplexe, aber kohärente Logik:** Splitting ist kontraproduktiv, wenn es indirekte, unnötige Delegation oder mehr Koordination als Klarheit hinzufügt.

#### Wann man sich sowieso teilen muss

Split by **real Verantwortungsgrenzen**, nicht nach Linienzahl. Zu den Indikatoren gehören verschiedene Teilsysteme, die sich unabhängig entwickeln, nicht miteinander in Beziehung stehende Gründe für Veränderungen, eine schwache Kopplung zwischen den Methodengruppen oder getrennte Lebenszyklusphasen, die von einer Klasse verdeckt werden.

**Tooling-Regel:** Pureline Checker und IDE-Inspektionen können eine Informations-Größenanzeige mit einem Kohäsions-Überprüfungsvorschlag, insbesondere über 600 Zeilen, zeigen. Sie dürfen die Anzahl der Zeilen nicht als ausreichenden Beweis für eine Verletzung behandeln, Klassen automatisch extrahieren oder Unterdrückungen nur verlangen, um eine zusammenhängende Klasse intakt zu halten.

Dieses Prinzip gilt für **all Pureline Sprachprofile**, einschließlich Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald und Emvus. Language-specific syntax and idioms continue to take precedence.
