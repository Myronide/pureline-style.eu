# Java-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Java-profiel {#java-profile}

### PL-JAVA-001 — Package per verantwoordelijkheid {#pl-java-001--package-by-responsibility}

Aanbevolen:

```text
src/main/java/
    space/example/project/
        api/
        runtime/
        service/
        network/
        storage/
        model/
```

Vermijd generieke stortplaatsen zoals `util/`, `manager/`, `misc/` of `helper/`, tenzij het package een echt en nauw afgebakend doel heeft.

### PL-JAVA-002 — Naamgeving {#pl-java-002--naming}

Klassen:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Interfaces gebruiken het voorvoegsel `I`:

```java
ISession
IStorage
IPacket
IConnection
```

Methoden:

```java
open()
close()
load()
save()
execute()
resolve()
```

Variabelen:

```java
request
session
player
connection
```

Variabelen van één letter zijn niet toegestaan, tenzij het gevestigde lokale conventies zijn, zoals lusteller.

### PL-JAVA-003 — Geef de voorkeur aan records voor onveranderlijke data {#pl-java-003--prefer-records-for-immutable-data}

Aanbevolen:

```java
public record SessionId(UUID value) {
}
```

Vermijd boilerplate-POJO's wanneer een record volstaat.

### PL-JAVA-004 — Expliciete null-afhandeling {#pl-java-004--explicit-null-handling}

Vermijd:

```java
Objects.requireNonNull(value);
```

voor gewone validatie in de besturingsstroom.

Aanbevolen:

```java
if (value == null) {
    return;
}
```

of een domeinspecifieke fout:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Gebruik imports in plaats van FQCN's {#pl-java-005--use-imports-instead-of-fqcns}

Vermijd:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Aanbevolen:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Geef de voorkeur aan modern Java {#pl-java-006--prefer-modern-java}

Gebruik moderne Java-functies wanneer ze de code verbeteren:

```text
records
sealed types
pattern matching
switch expressions
var
virtual threads
text blocks
streams
```

Moderne syntaxis moet ruis verminderen, niet nieuwigheid om de nieuwigheid creëren.

### PL-JAVA-007 — Geef de voorkeur aan switch voor echte toestandsvertakking {#pl-java-007--prefer-switch-for-real-state-branching}

Aanbevolen:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Geef hieraan de voorkeur boven lange reeksen niet-gerelateerde toestandscontroles.

### PL-JAVA-008 — Concurrency {#pl-java-008--concurrency}

Blokkeer de main- of tick-threads niet met HTTP, databasebewerkingen, bestandssysteemtoegang of blokkerende netwerk-I/O.

Virtual threads verdienen waar passend de voorkeur voor blokkerende I/O.

### PL-JAVA-009 — Streams alleen wanneer ze duidelijker zijn {#pl-java-009--streams-only-when-clearer}

Streams worden aangemoedigd wanneer ze de leesbaarheid verbeteren. Gebruik een lus als die duidelijker is, makkelijker te debuggen of beter geschikt voor het hot path.

### PL-JAVA-010 — Symmetrie in de levenscyclus {#pl-java-010--lifecycle-symmetry}

Alles wat wordt geopend, geregistreerd, gestart, gealloceerd of geabonneerd, moet een even duidelijk bijbehorend pad hebben om te sluiten, de registratie op te heffen, te stoppen, vrij te geven of het abonnement op te zeggen.
