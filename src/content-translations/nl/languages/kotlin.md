# Kotlin-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Kotlin-profiel {#kotlin-profile}

### PL-KT-001 — val boven var {#pl-kt-001--val-over-var}

Gebruik standaard `val`. Gebruik `var` alleen wanneer een waarde echt verandert en de mutatie lokaal blijft. Zie [Toestand en neveneffecten](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Dataklassen voor gewone data {#pl-kt-002--data-classes-for-plain-data}

Gebruik `data class` voor waarden die data dragen en op inhoud worden vergeleken. Schrijf `equals`, `hashCode` of copy-boilerplate niet met de hand.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Sealed types met uitputtende when {#pl-kt-003--sealed-types-with-exhaustive-when}

Modelleer toestanden als `sealed interface` en vertak met een uitputtende `when`-expressie. Vermijd `else`, dat nieuwe cases ongemerkt opslokt.

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

### PL-KT-004 — Null safety zonder !! {#pl-kt-004--null-safety-without}

Gebruik `?.` voor optionele toegang en `?:` voor terugvalwaarden of vroege uitgangen. Gebruik `!!` nooit buiten tests; het verandert een null-controle in een crash tijdens runtime.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

### PL-KT-005 — Scope-functies alleen wanneer ze duidelijk lezen {#pl-kt-005--scope-functions-only-when-they-read-clearly}

Gebruik `let`, `run` of `apply` wanneer ze een tijdelijke naam wegnemen of één object configureren. Schakel ze niet aaneen en nest ze niet; een gewone statement is duidelijker.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Extension-functies met een smal bereik {#pl-kt-006--extension-functions-with-narrow-scope}

Voeg een extension alleen toe wanneer ze leest als een property van de receiver. Vermijd extensions op `Any` of brede typen en verberg er nooit neveneffecten achter.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Benoemde argumenten voor booleans en veel parameters {#pl-kt-007--named-arguments-for-booleans-and-many-parameters}

Benoem argumenten voor elke booleaanse vlag en voor elke aanroep met meer dan twee parameters. Een kale `true` zegt de lezer niets.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard clauses en kleine functies {#pl-kt-008--guard-clauses-and-small-functions}

Wijs ongeldige invoer eerst af en keer meteen terug, zodat het succespad zonder extra inspringing blijft. Elke functie voert één stap uit en past op één scherm. Zie [Besturingsstroom](../core/control-flow.md) en [Functies](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Naamgeving {#pl-kt-009--naming}

Typen gebruiken UpperCamelCase. Functies, properties en parameters gebruiken lowerCamelCase. `const val` op het hoogste niveau gebruikt UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Mapdichtheid {#pl-kt-010--folder-density}

Houd standaard maximaal 10 handmatig onderhouden bronbestanden per map aan. Gegenereerde bestanden tellen niet mee. Splits boven die limiet op verantwoordelijkheid en niet op bestandstype, en documenteer elke gerechtvaardigde uitzondering.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Tooling {#pl-kt-011--tooling}

Voer in CI ktlint uit voor opmaak en detekt voor statische analyse. Los bevindingen op, of onderdruk er een met een smal, toegelicht motief.

```bash
./gradlew ktlintCheck detekt
```
