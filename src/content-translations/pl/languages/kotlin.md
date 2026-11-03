# Kotlin Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Kotlin {#kotlin-profile}

### PL-KT-001 — val zamiast var {#pl-kt-001--val-over-var}

Domyślnie używaj `val`. `var` stosuj tylko wtedy, gdy wartość naprawdę się zmienia, a mutacja pozostaje lokalna. Zobacz [Stan i efekty uboczne](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Klasy danych dla zwykłych danych {#pl-kt-002--data-classes-for-plain-data}

Używaj `data class` dla wartości, które niosą dane i są porównywane według zawartości. Nie pisz ręcznie `equals`, `hashCode` ani kodu szablonowego kopiowania.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Typy sealed z wyczerpującym when {#pl-kt-003--sealed-types-with-exhaustive-when}

Stany modeluj jako `sealed interface` i rozgałęziaj za pomocą wyczerpującego wyrażenia `when`. Unikaj `else`, które po cichu pochłania nowe przypadki.

```kotlin
sealed interface ConnectionState {
    data object Idle : ConnectionState
    data class Connected(val host: String) : ConnectionState
    data class Failed(val reason: String) : ConnectionState
}

fun describe(state: ConnectionState): String = when (state) {
    ConnectionState.Idle -> "idle"
    is ConnectionState.Connected -> "connected to ${state.host}"
    is ConnectionState.Failed -> "failed: ${state.reason}"
}
```

### PL-KT-004 — Null safety bez !! {#pl-kt-004--null-safety-without}

Używaj `?.` do opcjonalnego dostępu oraz `?:` do wartości zapasowych lub wczesnych wyjść. Nigdy nie używaj `!!` poza testami; zamienia sprawdzenie null w awarię w czasie wykonania.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

### PL-KT-005 — Funkcje zakresu tylko wtedy, gdy czyta się je jasno {#pl-kt-005--scope-functions-only-when-they-read-clearly}

Używaj `let`, `run` lub `apply`, gdy usuwają tymczasową nazwę albo konfigurują jeden obiekt. Nie łącz ich w łańcuchy ani nie zagnieżdżaj; zwykła instrukcja jest czytelniejsza.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Funkcje rozszerzające o wąskim zakresie {#pl-kt-006--extension-functions-with-narrow-scope}

Dodawaj rozszerzenie tylko wtedy, gdy czyta się je jak właściwość odbiorcy. Unikaj rozszerzeń na `Any` lub szerokich typach i nigdy nie ukrywaj za nimi efektów ubocznych.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Argumenty nazwane dla wartości logicznych i wielu parametrów {#pl-kt-007--named-arguments-for-booleans-and-many-parameters}

Nazywaj argumenty dla każdej flagi logicznej i w każdym wywołaniu z więcej niż dwoma parametrami. Samo `true` nic nie mówi czytelnikowi.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard clauses i małe funkcje {#pl-kt-008--guard-clauses-and-small-functions}

Niepoprawne dane wejściowe odrzucaj najpierw i wracaj natychmiast, aby ścieżka sukcesu pozostała bez wcięć. Każda funkcja wykonuje jeden krok i mieści się na jednym ekranie. Zobacz [Przepływ sterowania](../core/control-flow.md) i [Funkcje](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Nazewnictwo {#pl-kt-009--naming}

Typy używają UpperCamelCase. Funkcje, właściwości i parametry używają lowerCamelCase. `const val` na najwyższym poziomie używa UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Gęstość folderów {#pl-kt-010--folder-density}

Domyślnie utrzymuj co najwyżej 10 ręcznie utrzymywanych plików źródłowych na folder. Pliki generowane nie są wliczane. Po przekroczeniu limitu dziel według odpowiedzialności, a nie według typu pliku, i udokumentuj każdy uzasadniony wyjątek.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Narzędzia {#pl-kt-011--tooling}

W CI uruchamiaj ktlint do formatowania i detekt do analizy statycznej. Napraw uwagi albo wyciszaj pojedynczą z wąskim, skomentowanym uzasadnieniem.

```bash
./gradlew ktlintCheck detekt
```
