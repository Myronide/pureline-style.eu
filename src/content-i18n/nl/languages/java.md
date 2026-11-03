# Java Code Stijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Javaprofiel

### PL-JAVA-001. Pakket door verantwoordelijkheid

Voorkeur:

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

Vermijd generieke dumpinggronden zoals `util/`, `manager/`, `misc/` of `helper/` tenzij het pakket een echt en nauw doel heeft.

### PL-JAVA-002. Naamgeving

Klassen:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Interfaces gebruiken het `I`-prefix:

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

De variabelen met één letter worden niet toegestaan tenzij het gaat om lokale conventies zoals looptellers.

### PL-JAVA-003. Liefst records voor onveranderlijke gegevens

Voorkeur:

```java
public record SessionId(UUID value) {
}
```

Vermijd boilerplate POJO's wanneer een record voldoende is.

### PL-JAVA-004. Expliciete Null Handling

Vermijd:

```java
Objects.requireNonNull(value);
```

voor normale controlestroomvalidatie.

Voorkeur:

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

### PL-JAVA-005. Invoer gebruiken in plaats van FQCNs

Vermijd:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Voorkeur:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006. Liever Modern Java

Gebruik moderne Java functies wanneer ze de code verbeteren:

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

Moderne syntaxis moet het geluid verminderen, geen nieuwigheid creëren om zijn eigen bestwil.

Prefer an `instanceof` pattern when a guard checks a type and the success
path needs the value as that type.

```text
− Separate cast                      │ ✓ Pureline
if (!(value instanceof String)) {   │ if (!(value instanceof String text)) {
    return "";                       │     return "";
}                                    │ }
                                     │
String text = (String) value;        │ return text.trim();
return text.trim();                  │
```

### PL-JAVA-007. Liever wisselen voor Real State Branching

Voorkeur:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Dit is beter dan lange ketens van niet-gerelateerde staatscontroles.

### PL-JAVA-008 — Concurrency

Blokkeer geen hoofd- of vink-threads met HTTP, databasebewerkingen, toegang tot bestandssysteem of blokkeren van netwerk I/O.

Virtuele threads hebben de voorkeur voor het blokkeren van I/O waar nodig.

### PL-JAVA-009. Streams alleen wanneer helderder

Streams worden aangemoedigd wanneer ze de leesbaarheid verbeteren. Gebruik een lus als het duidelijker is, gemakkelijker te debuggen, of beter geschikt voor het hete pad.

### PL-JAVA-010. Levenscyclussymmetrie

Alles wat geopend, geregistreerd, gestart, toegewezen of ingeschreven is, moet een even duidelijk sluit-, uitschrijf-, stop-, release- of afmeldpad hebben.
