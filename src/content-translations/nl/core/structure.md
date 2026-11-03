# Klassen, modules en mapdichtheid

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Klassen en modules {#classes-and-modules}

### PL-STRUCT-001 — Eén duidelijke verantwoordelijkheid {#pl-struct-001--one-clear-responsibility}

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

Aanbevolen:

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

Een klasse heeft één duidelijke verantwoordelijkheid wanneer haar leden en interne toestand bijdragen aan één samenhangend aandachtsgebied. **Het aantal regels alleen bepaalt niet of een klasse goed is ontworpen.** Zie `PL-STRUCT-003` voor richtlijnen over grootte.

---

## Dichtheid van packages en mappen {#package-and-folder-density}

### PL-STRUCT-002 — Houd namespaces klein genoeg om te overzien {#pl-struct-002--keep-namespaces-small-enough-to-scan}

Pureline beschouwt de dichtheid van bestanden en typen als onderdeel van de leesbaarheid van code.

Een package of bronmap moet klein genoeg zijn zodat een ontwikkelaar de inhoud in één oogopslag begrijpt, zonder door een lange, platte lijst van niet-gerelateerde bestanden te hoeven zoeken.

Wanneer de limiet wordt overschreden, splits het package of de map dan op verantwoordelijkheid, in plaats van er een stortplaats van te laten worden.

#### Standaardlimieten {#default-limits}

| Taal | Pureline-standaard |
|---|---|
| Java | Maximaal 8 top-level typen/bronbestanden voor productie per package |
| Emerald | Maximaal 8 `.ems`-bronbestanden voor productie per bron-/namespacemap |
| Emvus | Maximaal 8 `.ev`-bronbestanden voor productie per package/bronmap |
| JavaScript | Maximaal 10 bronmodules voor productie per feature-/bronmap |
| TypeScript | Maximaal 10 bronmodules voor productie per feature-/bronmap |
| Go | Maximaal 12 `.go`-bestanden per packagemap, exclusief tests en gegenereerde bestanden |
| Crystal | Maximaal 10 `.cr`-bestanden voor productie per bron-/namespacemap |
| Rust | Maximaal 10 handmatig onderhouden `.rs`-bestanden voor productie per feature-/bronmap |

Deze bestanden tellen niet mee voor de limiet:

- tests en specs
- gegenereerde bronbestanden
- bestanden met alleen metadata
- `package-info.java`
- `module-info.java`
- barrel-bestanden in JavaScript/TypeScript, zoals `index.ts` of `index.js`
- gegenereerde bindings of protocoluitvoer
- migratiesnapshots en vergelijkbare machinaal gegenereerde artefacten

Het doel van deze regel is niet om willekeurige mapnesting af te dwingen. Een splitsing moet een echte verantwoordelijkheidsgrens introduceren.

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

Aanbevolen:

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

Een project mag deze drempelwaarden overschrijven via een toekomstig Pureline-configuratiebestand, maar de standaardregel moet bewust streng blijven.

---

## Samenhang boven omvang {#cohesion-over-size}

### PL-STRUCT-003 — Samenhang boven omvang (Zusammengehörigkeit vor Zeilenbegrenzung) {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung} {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung}

> **Samenhang boven omvang — Zusammengehörigkeit vor Zeilenbegrenzung.**

De aanbevolen maximale klassegrootte is **een richtlijn, nooit een harde limiet**. Houd sterk samenhangende logica bij elkaar wanneer splitsen de code moeilijker zou maken om te lezen, te onderhouden, te testen of te doorgronden. Een grotere samenhangende klasse verdient de voorkeur boven meerdere kunstmatige klassen die door onnodige delegatie met elkaar verbonden zijn.

#### Richtlijn voor klassegrootte {#class-size-guidance}

| Klassegrootte | Pureline-aanbeveling |
|---|---|
| Tot 200 regels | Aanbevolen normaalgeval |
| 201–400 regels | Onproblematisch wanneer de klasse een duidelijke verantwoordelijkheid heeft |
| 401–600 regels | Bewuste architectuurbeslissing; houd de samenhang begrijpelijk |
| Meer dan 600 regels | Review aanbevolen, **niet verboden** |

De bereiken zijn **vuistregels, geen harde limieten**. Het overschrijden van een drempel mag op zichzelf geen stijlovertreding opleveren en dwingt niet tot splitsen.

#### Wanneer grotere klassen gerechtvaardigd zijn {#when-larger-classes-are-justified}

- **Parsers en lexers:** een samenhangende toestandsmachine kan ingewikkelder worden wanneer de toestanden en overgangen over kunstmatige abstracties worden verspreid.
- **Algoritmen:** sterk gekoppelde verwerkingsfasen kunnen makkelijker te begrijpen en te optimaliseren zijn wanneer ze bij elkaar blijven.
- **Centrale datastructuren:** methoden die dezelfde invarianten en interne toestand delen, kunnen in één klasse thuishoren.
- **Complexe maar samenhangende logica:** splitsen werkt averechts wanneer het indirectie, onnodige delegatie of meer coördinatie dan duidelijkheid oplevert.

#### Wanneer je toch splitst {#when-to-split-anyway}

Splits op **echte verantwoordelijkheidsgrenzen**, niet op aantal regels. Indicatoren zijn onder meer afzonderlijke subsystemen die onafhankelijk van elkaar evolueren, niet-gerelateerde redenen om te wijzigen, zwakke koppeling tussen groepen methoden, of aparte levenscycli die door één klasse aan het zicht worden onttrokken.

**Toolingregel:** Pureline Checker en IDE-inspecties mogen een informatieve melding over grootte tonen met een suggestie voor een samenhangreview, met name boven 600 regels. Ze mogen het aantal regels niet als voldoende bewijs van een overtreding beschouwen, niet automatisch klassen extraheren en niet eisen dat er onderdrukkingen worden toegevoegd alleen om een samenhangende klasse intact te houden.

Dit principe geldt voor **alle Pureline-taalprofielen**, waaronder Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald en Emvus. Taalspecifieke syntaxis en idioom blijven voorrang houden.
