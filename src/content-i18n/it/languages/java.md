# Stile codice Java

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Java Profile

### PL-JAVA-001 — Package by Responsibility

Preferred:

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

Avoid generic dumping grounds such as `util/`, `manager/`, `misc/`, or `helper/` unless the package has a real and narrow purpose.

### PL-JAVA-002. Naming

Classes:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Interfaces use the `I` prefix:

```java
ISession
IStorage
IPacket
IConnection
```

Methods:

```java
open()
close()
load()
save()
execute()
resolve()
```

Variables:

```java
request
session
player
connection
```

Single-letter variables are disallowed unless they are established local conventions such as loop counters.

### PL-JAVA-003. Preferire record per dati immutabili

Preferred:

```java
public record SessionId(UUID value) {
}
```

Evitare di utilizzare la piastra di caldaia POJO quando un record è sufficiente.

### PL-JAVA-004. Gestione esplicita dei null

Avoid:

```java
Objects.requireNonNull(value);
```

for normal control-flow validation.

Prefer:

```java
if (value == null) {
    return;
}
```

o un guasto specifico per dominio:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005. Usare le importazioni invece di FQCN

Avoid:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Prefer:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006. Preferire Java moderna

Utilizzare moderne funzionalità Java quando migliorano il codice:

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

Modern syntax should reduce noise, not create novelty for its own sake.

Preferire un modello `instanceof` quando una guardia controlla un tipo e il successo
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

### PL-JAVA-007 — Prefer Switch for Real State Branching

Preferred:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Prefer this over long chains of unrelated state checks.

### PL-JAVA-008 — Concurrency

Do not block main or tick threads with HTTP, database operations, filesystem access, or blocking network I/O.

Virtual threads are preferred for blocking I/O where appropriate.

### PL-JAVA-009 — Streams Only When Clearer

Streams are encouraged when they improve readability. Usare un ciclo se è più chiaro, più facile da debug, o meglio adatto al percorso caldo..

### PL-JAVA-010. Simmetria del ciclo di vita

Qualsiasi cosa che viene aperta, registrata, avviata, assegnata o sottoscritta deve avere un percorso ugualmente chiaro corrispondente vicino, non registrare, fermare, rilasciare o annullare l'iscrizione.
