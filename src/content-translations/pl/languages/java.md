# Java Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Java {#java-profile}

### PL-JAVA-001 — Pakiety według odpowiedzialności {#pl-java-001--package-by-responsibility}

Zalecane:

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

Unikaj ogólnych wysypisk, takich jak `util/`, `manager/`, `misc/` czy `helper/`, chyba że pakiet ma rzeczywiste i wąskie przeznaczenie.

### PL-JAVA-002 — Nazewnictwo {#pl-java-002--naming}

Klasy:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Interfejsy używają prefiksu `I`:

```java
ISession
IStorage
IPacket
IConnection
```

Metody:

```java
open()
close()
load()
save()
execute()
resolve()
```

Zmienne:

```java
request
session
player
connection
```

Zmienne jednoliterowe są niedozwolone, chyba że są ugruntowaną konwencją lokalną, jak liczniki pętli.

### PL-JAVA-003 — Preferuj rekordy dla danych niezmiennych {#pl-java-003--prefer-records-for-immutable-data}

Zalecane:

```java
public record SessionId(UUID value) {
}
```

Unikaj szablonowych klas POJO, gdy wystarczy rekord.

### PL-JAVA-004 — Jawna obsługa null {#pl-java-004--explicit-null-handling}

Unikaj:

```java
Objects.requireNonNull(value);
```

do zwykłej walidacji w przepływie sterowania.

Preferuj:

```java
if (value == null) {
    return;
}
```

lub błąd właściwy dla domeny:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Używaj importów zamiast pełnych nazw kwalifikowanych {#pl-java-005--use-imports-instead-of-fqcns}

Unikaj:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Preferuj:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Preferuj nowoczesną Javę {#pl-java-006--prefer-modern-java}

Używaj nowoczesnych cech Javy, gdy poprawiają kod:

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

Nowoczesna składnia powinna redukować szum, a nie wprowadzać nowość dla samej nowości.

### PL-JAVA-007 — Preferuj switch przy rzeczywistym rozgałęzianiu po stanie {#pl-java-007--prefer-switch-for-real-state-branching}

Zalecane:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Preferuj to zamiast długich łańcuchów niepowiązanych sprawdzeń stanu.

### PL-JAVA-008 — Współbieżność {#pl-java-008--concurrency}

Nie blokuj głównego wątku ani wątku ticków operacjami HTTP, bazodanowymi, dostępem do systemu plików ani blokującym wejściem/wyjściem sieciowym.

Tam, gdzie to właściwe, dla blokującego I/O preferowane są wątki wirtualne.

### PL-JAVA-009 — Strumienie tylko wtedy, gdy jest czytelniej {#pl-java-009--streams-only-when-clearer}

Strumienie są zalecane, gdy poprawiają czytelność. Użyj pętli, jeśli jest czytelniejsza, łatwiejsza do debugowania lub lepiej pasuje do gorącej ścieżki.

### PL-JAVA-010 — Symetria cyklu życia {#pl-java-010--lifecycle-symmetry}

Wszystko, co jest otwierane, rejestrowane, uruchamiane, alokowane lub subskrybowane, musi mieć równie jasną odpowiadającą ścieżkę zamknięcia, wyrejestrowania, zatrzymania, zwolnienia lub anulowania subskrypcji.
