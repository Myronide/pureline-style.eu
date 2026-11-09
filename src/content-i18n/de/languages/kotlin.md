# Kodolin-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Profil von Kotlin

### PL-KT-001 — val über var

Standardwert für `val`. Verwenden Sie `var` nur, wenn sich ein Wert wirklich ändert und die Mutation lokal bleibt. Siehe [Zustand und Nebenwirkungen](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Datenklassen für einfache Daten

Verwenden Sie `data class` für Werte, die Daten transportieren und nach Inhalt vergleichen. Schreiben Sie `equals`, `hashCode` nicht von Hand oder kopieren Sie das Heizblech.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Versiegelte Typen mit Erschöpfender Wirkung, wenn

Modellzustand als `sealed interface` und Zweig mit einem erschöpfenden `when`-Ausdruck. Vermeiden Sie `else`, das still neue Fälle absorbiert.

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

### PL-KT-004 — Null Sicherheit ohne!!

Verwenden Sie `?.` für optionalen Zugriff und `?:` für Fallback-Werte. Bevorzugen Sie
Trennen Sie null Schutz, wenn ein fehlender Wert eine frühe Rückkehr verursacht. Niemals verwenden
`!!` außerhalb der Tests.

```text
− Elvis with early return              │ ✓ Pureline
val user = users[id] ?: return "Gast"  │ val user = users[id]
                                       │ if (user == null) {
return user.name                       │     return "Gast"
                                       │ }
                                       │
                                       │ return user.name
```

### PL-KT-005 — Umfang Funktionen nur, wenn sie lesen eindeutig

Verwenden Sie `let`, `run` oder `apply`, wenn Sie einen temporären Namen entfernen oder ein Objekt konfigurieren. Verkettt sie nicht und neigt sie nicht; eine klare Aussage ist klarer.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Erweiterungsfunktionen mit schmalem Umfang

Fügen Sie eine Erweiterung nur hinzu, wenn sie als Eigenschaft des Empfängers gelesen wird. Vermeiden Sie Erweiterungen auf `Any` oder breite Arten, und nie verstecken Nebenwirkungen hinter einem.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Benannte Verbindungen für Booleans und viele Parameter

Nennen Sie Argumente für jedes boolesche Flag und für jeden Aufruf mit mehr als zwei Parametern. Ein bloßes `true` sagt dem Leser nichts...

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Schutzklauseln und kleine Funktionen

Ungültige Eingaben zuerst ablehnen und sofort zurückgeben, so bleibt der Erfolgspfad unidneded. Jede Funktion führt einen Schritt durch und passt auf einen Bildschirm. Siehe [Kontrollfluss](../core/control-flow.md) und [Funktionen](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Benennung

Typen verwenden UpperCamelCase. Funktionen, Eigenschaften und Parameter verwenden lowerCamelCase. `const val` verwendet UPPER_SNAKE_CASE auf höchster Ebene.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Ordnerdichte

Halten Sie standardmäßig höchstens 10 handgepflegerte Quelldateien pro Ordner bereit. Generierte Dateien zählen nicht.. Über diese Grenze hinaus, geteilt durch Verantwortung, nicht durch Dateityp, und dokumentieren jede gerechtfertigte Ausnahme.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Werkzeugbau

Führen Sie ktlint für Formatierung und detektieren Sie für statische Analyse in CI. Befestigen Sie die Befunde oder unterdrücken Sie sie mit einem schmalen, kommentierten Grund.

```bash
./gradlew ktlintCheck detekt
```
