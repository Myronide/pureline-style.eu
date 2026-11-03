# Java Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Java-Profil {#java-profile}

### PL-JAVA-001 — Pakete nach Verantwortung gliedern {#pl-java-001--package-by-responsibility}

Bevorzugt:

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

Vermeide generische Sammelbecken wie `util/`, `manager/`, `misc/` oder `helper/`, es sei denn, das Paket hat einen echten und eng gefassten Zweck.

### PL-JAVA-002 — Benennung {#pl-java-002--naming}

Klassen:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Interfaces verwenden das Präfix `I`:

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

Einbuchstabige Variablen sind nicht erlaubt, es sei denn, es handelt sich um etablierte lokale Konventionen wie Schleifenzähler.

### PL-JAVA-003 — Records für unveränderliche Daten bevorzugen {#pl-java-003--prefer-records-for-immutable-data}

Bevorzugt:

```java
public record SessionId(UUID value) {
}
```

Vermeide Boilerplate-POJOs, wenn ein Record genügt.

### PL-JAVA-004 — Explizite Null-Behandlung {#pl-java-004--explicit-null-handling}

Vermeide:

```java
Objects.requireNonNull(value);
```

für normale Validierung im Kontrollfluss.

Bevorzuge:

```java
if (value == null) {
    return;
}
```

oder einen domänenspezifischen Fehler:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Imports statt vollqualifizierter Klassennamen verwenden {#pl-java-005--use-imports-instead-of-fqcns}

Vermeide:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Bevorzuge:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Modernes Java bevorzugen {#pl-java-006--prefer-modern-java}

Verwende moderne Java-Features, wenn sie den Code verbessern:

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

Moderne Syntax soll Lärm reduzieren, nicht Neuheit um ihrer selbst willen erzeugen.

Bevorzuge ein `instanceof`-Muster, wenn ein Guard den Typ prüft und der
Erfolgspfad den Wert mit diesem Typ benötigt.

```text
− Separate cast                      │ ✓ Pureline
if (!(value instanceof String)) {   │ if (!(value instanceof String text)) {
    return "";                       │     return "";
}                                    │ }
                                     │
String text = (String) value;        │ return text.trim();
return text.trim();                  │
```

### PL-JAVA-007 — Switch für echte Zustandsverzweigungen bevorzugen {#pl-java-007--prefer-switch-for-real-state-branching}

Bevorzugt:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Bevorzuge das gegenüber langen Ketten unzusammenhängender Zustandsprüfungen.

### PL-JAVA-008 — Nebenläufigkeit {#pl-java-008--concurrency}

Blockiere Main- oder Tick-Threads nicht mit HTTP, Datenbankoperationen, Dateisystemzugriffen oder blockierendem Netzwerk-I/O.

Virtual Threads sind für blockierendes I/O bevorzugt, wo es passt.

### PL-JAVA-009 — Streams nur, wenn sie klarer sind {#pl-java-009--streams-only-when-clearer}

Streams werden empfohlen, wenn sie die Lesbarkeit verbessern. Verwende eine Schleife, wenn sie klarer, leichter zu debuggen oder für den Hot Path besser geeignet ist.

### PL-JAVA-010 — Symmetrischer Lebenszyklus {#pl-java-010--lifecycle-symmetry}

Alles, was geöffnet, registriert, gestartet, allokiert oder abonniert wird, braucht einen ebenso klaren Gegenpfad zum Schließen, Abmelden, Stoppen, Freigeben oder Kündigen des Abonnements.
