# Stile del codice Java

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Java {#java-profile}

### PL-JAVA-001 — Pacchetti per responsabilità {#pl-java-001--package-by-responsibility}

Preferito:

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

Evita le discariche generiche come `util/`, `manager/`, `misc/` o `helper/`, a meno che il pacchetto non abbia uno scopo reale e circoscritto.

### PL-JAVA-002 — Nomi {#pl-java-002--naming}

Classi:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Le interfacce usano il prefisso `I`:

```java
ISession
IStorage
IPacket
IConnection
```

Metodi:

```java
open()
close()
load()
save()
execute()
resolve()
```

Variabili:

```java
request
session
player
connection
```

Le variabili di una sola lettera non sono ammesse, a meno che non siano convenzioni locali consolidate come i contatori di ciclo.

### PL-JAVA-003 — Preferire i record per i dati immutabili {#pl-java-003--prefer-records-for-immutable-data}

Preferito:

```java
public record SessionId(UUID value) {
}
```

Evita i POJO pieni di boilerplate quando un record è sufficiente.

### PL-JAVA-004 — Gestione esplicita del null {#pl-java-004--explicit-null-handling}

Evita:

```java
Objects.requireNonNull(value);
```

per la normale validazione nel controllo di flusso.

Preferisci:

```java
if (value == null) {
    return;
}
```

oppure un errore specifico del dominio:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Usare gli import al posto dei nomi completi {#pl-java-005--use-imports-instead-of-fqcns}

Evita:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Preferisci:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Preferire il Java moderno {#pl-java-006--prefer-modern-java}

Usa le funzionalità moderne di Java quando migliorano il codice:

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

La sintassi moderna dovrebbe ridurre il rumore, non introdurre novità fine a sé stesse.

### PL-JAVA-007 — Preferire lo switch per le vere ramificazioni di stato {#pl-java-007--prefer-switch-for-real-state-branching}

Preferito:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Preferiscilo a lunghe catene di controlli di stato non correlati.

### PL-JAVA-008 — Concorrenza {#pl-java-008--concurrency}

Non bloccare i thread principali o di tick con HTTP, operazioni su database, accesso al filesystem o I/O di rete bloccante.

Per l'I/O bloccante, dove opportuno, sono preferibili i virtual thread.

### PL-JAVA-009 — Stream solo quando sono più chiari {#pl-java-009--streams-only-when-clearer}

Gli stream sono incoraggiati quando migliorano la leggibilità. Usa un ciclo se è più chiaro, più facile da debuggare o più adatto al percorso critico.

### PL-JAVA-010 — Simmetria del ciclo di vita {#pl-java-010--lifecycle-symmetry}

Tutto ciò che viene aperto, registrato, avviato, allocato o sottoscritto deve avere un percorso corrispondente altrettanto chiaro per chiudere, annullare la registrazione, fermare, rilasciare o annullare la sottoscrizione.
