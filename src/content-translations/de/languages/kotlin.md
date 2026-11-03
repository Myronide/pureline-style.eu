# Kotlin Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Kotlin-Profil {#kotlin-profile}

### PL-KT-001 — val statt var {#pl-kt-001--val-over-var}

Verwende standardmäßig `val`. Verwende `var` nur, wenn sich ein Wert wirklich ändert und die Mutation lokal bleibt. Siehe [Zustand und Seiteneffekte](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Data Classes für einfache Daten {#pl-kt-002--data-classes-for-plain-data}

Verwende `data class` für Werte, die Daten tragen und nach Inhalt verglichen werden. Schreibe `equals`, `hashCode` oder Copy-Boilerplate nicht von Hand.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Sealed Types mit erschöpfendem when {#pl-kt-003--sealed-types-with-exhaustive-when}

Modelliere Zustände als `sealed interface` und verzweige mit einem erschöpfenden `when`-Ausdruck. Vermeide `else`, das neue Fälle stillschweigend verschluckt.

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

### PL-KT-004 — Null Safety ohne !! {#pl-kt-004--null-safety-without}

Verwende `?.` für optionalen Zugriff und `?:` für Fallbacks oder frühe Ausstiege. Verwende `!!` niemals außerhalb von Tests; es macht aus einer Null-Prüfung einen Absturz zur Laufzeit.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

### PL-KT-005 — Scope-Funktionen nur, wenn sie klar lesbar sind {#pl-kt-005--scope-functions-only-when-they-read-clearly}

Verwende `let`, `run` oder `apply`, wenn sie einen temporären Namen überflüssig machen oder ein einzelnes Objekt konfigurieren. Verkette oder verschachtele sie nicht; eine einfache Anweisung ist klarer.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Extension Functions mit engem Geltungsbereich {#pl-kt-006--extension-functions-with-narrow-scope}

Füge eine Extension nur hinzu, wenn sie sich wie eine Eigenschaft des Empfängers liest. Vermeide Extensions auf `Any` oder breite Typen und verstecke Seiteneffekte niemals hinter einer Extension.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Benannte Argumente für Booleans und viele Parameter {#pl-kt-007--named-arguments-for-booleans-and-many-parameters}

Benenne Argumente bei jedem booleschen Flag und bei jedem Aufruf mit mehr als zwei Parametern. Ein nacktes `true` sagt dem Leser nichts.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard Clauses und kleine Funktionen {#pl-kt-008--guard-clauses-and-small-functions}

Weise ungültige Eingaben zuerst ab und kehre sofort zurück, damit der Erfolgspfad ohne Einrückung bleibt. Jede Funktion führt einen Schritt aus und passt auf einen Bildschirm. Siehe [Kontrollfluss](../core/control-flow.md) und [Funktionen](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Benennung {#pl-kt-009--naming}

Typen verwenden UpperCamelCase. Funktionen, Properties und Parameter verwenden lowerCamelCase. `const val` auf oberster Ebene verwendet UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Ordnerdichte {#pl-kt-010--folder-density}

Halte standardmäßig höchstens 10 von Hand gepflegte Quelldateien pro Ordner. Generierte Dateien zählen nicht. Teile jenseits dieses Limits nach Verantwortung auf, nicht nach Dateityp, und dokumentiere jede begründete Ausnahme.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Tooling {#pl-kt-011--tooling}

Führe in der CI ktlint für die Formatierung und detekt für die statische Analyse aus. Behebe Befunde oder unterdrücke einen mit einer engen, kommentierten Begründung.

```bash
./gradlew ktlintCheck detekt
```
