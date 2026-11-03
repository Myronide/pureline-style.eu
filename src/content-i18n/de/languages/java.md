# Java-Code-Stil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe] (../core/structure.md) gilt in allen Bereichen.

## Java-Profil

### PL-JAVA-001 — Paket durch Verantwortung

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

Vermeiden Sie generische Dumpinggründe wie `util/`, `manager/`, `misc/` oder `helper/`, es sei denn, die Verpackung hat einen realen und engen Zweck.

### PL-JAVA-002 — Benennung

Klassen:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Schnittstellen verwenden das `I`-Präfix:

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

Variablen:

```java
request
session
player
connection
```

Einbuchstabenvariablen werden nicht zugelassen, es sei denn, es handelt sich um lokale Konventionen wie Loop-Zähler.

### PL-JAVA-003 — Vorbereiten von Aufzeichnungen für unveränderliche Daten

Preferred:

```java
public record SessionId(UUID value) {
}
```

Vermeiden Sie Boilerplate POJOs, wenn ein Datensatz ausreichend ist.

### PL-JAVA-004 — explizite Null-Bearbeitung

Avoid:

```java
Objects.requireNonNull(value);
```

für die normale Validierung des Kontrollflusses.

Prefer:

```java
if (value == null) {
    return;
}
```

oder ein domänenspezifischer Fehler:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Einfuhren anstelle von FQCN verwenden

Avoid:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Prefer:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Bevorzugen Sie moderne Java

Verwenden Sie moderne Java-Funktionen, wenn sie den Code verbessern:

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

### PL-JAVA-007 — Bevorzugter Schalter für die Verzweigung von Realstaaten

Preferred:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Prefer this over long chains of unrelated state checks.

### PL-JAVA-008 — Übereinstimmung

Blockieren Sie keine Haupt- oder Häkchenthreads mit HTTP, Datenbankoperationen, Dateisystemzugriff oder Blockierung des Netzwerks I/O.

Virtuelle Threads werden gegebenenfalls zur Blockierung von I/O bevorzugt.

### PL-JAVA-009 — Streamt nur, wenn es klarer wird

Streams are encouraged when they improve readability. Verwenden Sie eine Schleife, wenn es klarer, einfacher zu debuggen ist, oder besser geeignet für den heißen Pfad.

### PL-JAVA-010 — Lebenszyklussymmetrie

Alles, was geöffnet, registriert, gestartet, zugewiesen oder abonniert wird, muss einen ebenso klaren, entsprechenden Pfad haben, der schließen, nicht registrieren, stoppen, freigeben oder abmelden kann.
