# Kotlin Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Kotlin-profieleeecolorecolor

### PL-KT-001. val over var

Standaard `val`. Gebruik `var` alleen als een waarde echt verandert en de mutatie lokaal blijft. Zie [State and Side Effects](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002. Gegevensklassen voor gewone gegevens

Gebruik `data class` voor waarden die gegevens bevatten en vergelijk met inhoud. Niet met de hand schrijven `equals`, `hashCode` of kopieer ketelplaat.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003. Verzegelde types met uitputtend wanneer

Model staat als `sealed interface` en tak met een uitputtende `when` expressie. Vermijd `else`, die stilletjes nieuwe gevallen absorbeert.

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

### PL-KT-004. Null Veiligheid Zonder!!

Gebruik `?.` voor optionele toegang en `?:` voor terugvalwaarden. Liever een
aparte nul-wacht wanneer een ontbrekende waarde een vroegtijdige terugkeer veroorzaakt. Gebruik nooit
`!!` buiten testen.

```text
− Elvis with early return              │ ✓ Pureline
val user = users[id] ?: return "Gast"  │ val user = users[id]
                                       │ if (user == null) {
return user.name                       │     return "Gast"
                                       │ }
                                       │
                                       │ return user.name
```

### PL-KT-005. Scope functies alleen wanneer ze duidelijk lezen

Gebruik `let`, `run` of `apply` als ze een tijdelijke naam verwijderen of één object configureren. Niet ketenen of nestelen; een duidelijke uitspraak is duidelijker.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006. Uitbreidingsfuncties met smalle reikwijdte

Voeg een extensie alleen toe als het als eigendom van de ontvanger leest. Vermijd uitbreidingen op `Any` of brede types, en verberg nooit bijwerkingen achter een.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007. Genoemde argumenten voor Booleanen en vele parameters

Naam argumenten voor elke booleaanse vlag en voor elke oproep met meer dan twee parameters. Een kale `true` vertelt de lezer niets.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008. Guard Clausles en kleine functies

Ongeldige invoer eerst weigeren en onmiddellijk teruggeven, zodat het succespad ongekend blijft. Elke functie voert één stap uit en past op één scherm. Zie [Control Flow](../core/control-flow.md) en [Functions](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009. Naamgeving

Typen gebruiken UpperCamelCase. Functies, eigenschappen en parameters gebruiken lagerCamelCase. `const val` op topniveau gebruikt UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010. Map Density

Houd maximaal 10 hand-bewaarde bronbestanden per map standaard. Gegenereerde bestanden tellen niet mee. Die limiet is voorbij, verdeeld naar verantwoordelijkheid, niet naar bestandstype, en documenteert elke gerechtvaardigde uitzondering.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011. Gereedschape

Run ktlint voor formatteren en detekt voor statische analyse in CI. Repareer de bevindingen, of onderdruk er een met een smalle, commentaar rede.

```bash
./gradlew ktlintCheck detekt
```
