# Stile del codice Kotlin

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Kotlin {#kotlin-profile}

### PL-KT-001 — val al posto di var {#pl-kt-001--val-over-var}

Usa `val` per impostazione predefinita. Usa `var` solo quando un valore cambia davvero e la mutazione resta locale. Vedi [Stato ed effetti collaterali](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Data class per i dati semplici {#pl-kt-002--data-classes-for-plain-data}

Usa `data class` per i valori che trasportano dati e si confrontano per contenuto. Non scrivere a mano `equals`, `hashCode` o il boilerplate di copy.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Tipi sealed con when esaustivo {#pl-kt-003--sealed-types-with-exhaustive-when}

Modella gli stati come `sealed interface` e ramifica con un'espressione `when` esaustiva. Evita `else`, che assorbe in silenzio i nuovi casi.

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

### PL-KT-004 — Null safety senza !! {#pl-kt-004--null-safety-without}

Usa `?.` per l'accesso facoltativo e `?:` per i valori di ripiego o le uscite anticipate. Non usare mai `!!` fuori dai test; trasforma un controllo di null in un crash a runtime.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

### PL-KT-005 — Le scope function solo quando si leggono con chiarezza {#pl-kt-005--scope-functions-only-when-they-read-clearly}

Usa `let`, `run` o `apply` quando eliminano un nome temporaneo o configurano un oggetto. Non concatenarle né annidarle; un'istruzione semplice è più chiara.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Extension function con ambito ristretto {#pl-kt-006--extension-functions-with-narrow-scope}

Aggiungi un'extension solo quando si legge come una proprietà del destinatario. Evita le extension su `Any` o su tipi troppo generici e non nascondere mai effetti collaterali dietro una di esse.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Argomenti con nome per i booleani e per molti parametri {#pl-kt-007--named-arguments-for-booleans-and-many-parameters}

Dai un nome agli argomenti per ogni flag booleano e per ogni chiamata con più di due parametri. Un `true` nudo non dice nulla a chi legge.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard clause e funzioni piccole {#pl-kt-008--guard-clauses-and-small-functions}

Rifiuta per primo l'input non valido e ritorna subito, così il percorso di successo resta senza indentazione. Ogni funzione esegue un solo passaggio e sta in una schermata. Vedi [Controllo di flusso](../core/control-flow.md) e [Funzioni](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Nomi {#pl-kt-009--naming}

I tipi usano UpperCamelCase. Funzioni, proprietà e parametri usano lowerCamelCase. I `const val` di primo livello usano UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Densità delle cartelle {#pl-kt-010--folder-density}

Mantieni al massimo 10 file sorgente mantenuti a mano per cartella per impostazione predefinita. I file generati non contano. Oltre quel limite, dividi per responsabilità e non per tipo di file, e documenta ogni eccezione giustificata.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Strumenti {#pl-kt-011--tooling}

Esegui ktlint per la formattazione e detekt per l'analisi statica nella CI. Correggi i rilievi, oppure sopprimine uno con un motivo ristretto e commentato.

```bash
./gradlew ktlintCheck detekt
```
