# Klassen, modules en mappen-dievenheid

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Classes and Modules

### PL-STRUCT-001. Eén duidelijke verantwoordelijkheid

Vermijd structuren zoals:

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

Voorkeur:

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

Een klasse heeft één duidelijke verantwoordelijkheid als haar leden en interne staat bijdragen aan één samenhangende zorg. **Line-telling alleen bepaalt niet of een klasse goed is ontworpen.** Zie `PL-STRUCT-003` voor maatgeleiding.

---

## Pakket en map-dieveneeeeeeeeeeeeeeeeeeeee

### PL-STRUCT-002. Houd namenruimtes klein genoeg om te scannen

Pureline behandelt bestand en type dichtheid als onderdeel van de leesbaarheid van de code.

Een pakket of bronmap moet klein genoeg zijn om de inhoud ervan in één oogopslag te begrijpen zonder door een lange platte lijst van niet-gerelateerde bestanden te zoeken.

Wanneer de limiet wordt overschreden, splitst u het pakket of de map naar verantwoordelijkheid in plaats van het te laten worden als een stortplaats.

#### Standaardlimieten

| Language |Pureline standaard|
|---|---|
|Java|Maximaal 8 productie-top-level types/bronbestanden per pakket|
|Smaragd|Maximaal 8 productie `.ems` bronbestanden per bron/naamruimtemap|
|Emvus|Maximaal 8 `.ev`-bronbestanden per map/pakket/bron|
|JavaScript|Maximaal 10 productiebronmodules per functie/bronmap|
|TypeScript|Maximaal 10 productiebronmodules per functie/bronmap|
| Go |Maximaal 12 niet-test, niet-gegenereerde `.go`-bestanden per pakketmap|
|Crystal|Maximaal 10 `.cr`-bestanden per bron/namespace-map|
|Rust|Maximaal 10 hand-onderhoudsproductie `.rs`-bestanden per functie/bronmap|

Deze bestanden tellen niet mee naar de limiet:

- tests and specs
- gegenereerde bronbestanden
- Alleen metadatabestanden
- `package-info.java`
- `module-info.java`
- JavaScript/TypeScript vatbestanden zoals `index.ts` of `index.js`
- gegenereerde bindingen of protocoluitvoer
- migratie snapshots en vergelijkbare machine-generated artifacts

Het doel van deze regel is niet om willekeurige mappennesten te forceren. Een splitsing moet een echte verantwoordelijkheidsgrens introduceren.

Slecht:

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

Voorkeur:

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

Een project kan deze drempels overschrijden door een toekomstig Pureline configuratiebestand, maar de standaardregel moet opzettelijk strikt blijven.

---

## Cohesion over Size

### PL-STRUCT-003 — Cohesion over Size (Zusammengehörigkeit vor Zeilenbegrenzung)

> **Cohesie over Size. Zusamengehörigkeit vor Zeilenbegrenzung.**

De voorkeursmaximale klassegrootte is **guidance, nooit een harde limiet**. Houd sterk verwante logica samen bij het splitsen zou de code moeilijker te lezen, onderhouden, testen of redeneren over maken.Verspreidings A larger cohesive class is preferable to multiple artificial classes connected by unnecessary delegation.

#### Richtlijnen voor klassengrootte

|Klassegroottee klasse|Pureline-aanbeveling|
|---|---|
|Tot 200 lijnen| Preferred normal case |
|201.400 lijnen|Onproblematisch als de klasse een duidelijke verantwoordelijkheid heeft|
|401.600 lijnen|Besliste architectonische beslissing; de samenhang ervan begrijpelijk houden|
|Meer dan 600 lijnen|Beoordeling aanbevolen, **not verboden **|

De reeksen zijn **heuristics, geen harde limieten**. Het overschrijden van een drempel mag op zichzelf geen inbreuk op de stijl of een splitsing vereisen.

#### Wanneer grotere klassen gerechtvaardigd zijneeeeeeeeeeeeeeee

- **Parsers en lexers:** Een samenhangende staatmachine kan ingewikkelder worden wanneer zijn toestanden en overgangen verspreid zijn over kunstmatige abstracties.
- **ALgorithms:** Strak gekoppelde procesfasen kunnen gemakkelijker te begrijpen en te optimaliseren zijn wanneer ze samen worden gehouden.
- **Centrale datastructuren:** Methodes die hetzelfde delen in de SUV's en interne staat kunnen in één klasse thuishoren.
- **Complexe maar samenhangende logica:** Splitsing is contraproductief als het indirecte, onnodige delegatie, of meer coördinatie dan duidelijkheid toevoegt.

#### Wanneer moet ik toch splitsen?

Gesplitst door **real verantwoordelijkheidsgrenzen**, niet door lijntelling. Indicatoren omvatten afzonderlijke subsystemen die onafhankelijk evolueren, niet-gerelateerde redenen om te veranderen, zwakke koppeling tussen groepen methoden of afzonderlijke levenscyclussen die door één klasse worden verduisterd.

**Tooling regel:** Pureline Controleer en IDE inspecties kunnen tonen een informatieve grootte kennisgeving met een cohesie-review suggestie, met name boven 600 lijnen. Zij mogen het aantal regels niet als voldoende bewijs van een overtreding beschouwen, automatisch klassen uitpakken of onderdrukkingen eisen om een samenhangende klasse intact te houden.

Dit principe geldt voor **all Pureline taalprofielen**, waaronder Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald en Emvus. Taalspecifieke syntaxis en idiomen blijven prevaleren.
