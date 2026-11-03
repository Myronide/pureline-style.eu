# Estilo de código Kotlin

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Kotlin {#kotlin-profile}

### PL-KT-001 — val antes que var {#pl-kt-001--val-over-var}

Usa `val` por defecto. Usa `var` solo cuando un valor cambie de verdad y la mutación se mantenga local. Consulta [Estado y efectos secundarios](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Data classes para los datos simples {#pl-kt-002--data-classes-for-plain-data}

Usa `data class` para los valores que transportan datos y se comparan por contenido. No escribas a mano `equals`, `hashCode` ni el código repetitivo de copia.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Tipos sellados con when exhaustivo {#pl-kt-003--sealed-types-with-exhaustive-when}

Modela los estados como `sealed interface` y ramifica con una expresión `when` exhaustiva. Evita `else`, que absorbe en silencio los casos nuevos.

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

### PL-KT-004 — Null safety sin !! {#pl-kt-004--null-safety-without}

Usa `?.` para el acceso opcional y `?:` para los valores alternativos o las salidas tempranas. No uses nunca `!!` fuera de los tests; convierte una comprobación de nulos en un fallo en tiempo de ejecución.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

### PL-KT-005 — Las funciones de ámbito solo cuando se leen con claridad {#pl-kt-005--scope-functions-only-when-they-read-clearly}

Usa `let`, `run` o `apply` cuando eliminen un nombre temporal o configuren un solo objeto. No las encadenes ni las anides; una sentencia simple es más clara.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Funciones de extensión con un alcance estrecho {#pl-kt-006--extension-functions-with-narrow-scope}

Añade una extensión solo cuando se lea como una propiedad del receptor. Evita las extensiones sobre `Any` o sobre tipos muy amplios, y no ocultes nunca efectos secundarios tras una.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Argumentos con nombre para los booleanos y para muchos parámetros {#pl-kt-007--named-arguments-for-booleans-and-many-parameters}

Nombra los argumentos de cada bandera booleana y de cualquier llamada con más de dos parámetros. Un `true` suelto no le dice nada al lector.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard clauses y funciones pequeñas {#pl-kt-008--guard-clauses-and-small-functions}

Rechaza primero las entradas inválidas y retorna de inmediato, para que el camino de éxito quede sin sangrar. Cada función realiza un paso y cabe en una pantalla. Consulta el [Flujo de control](../core/control-flow.md) y las [Funciones](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Nombres {#pl-kt-009--naming}

Los tipos usan UpperCamelCase. Las funciones, las propiedades y los parámetros usan lowerCamelCase. Los `const val` de nivel superior usan UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Densidad de carpetas {#pl-kt-010--folder-density}

Mantén como máximo 10 archivos fuente mantenidos a mano por carpeta por defecto. Los archivos generados no cuentan. Superado ese límite, divide por responsabilidad y no por tipo de archivo, y documenta cualquier excepción justificada.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Herramientas {#pl-kt-011--tooling}

Ejecuta ktlint para el formato y detekt para el análisis estático en la CI. Corrige los hallazgos o suprime uno con un motivo acotado y comentado.

```bash
./gradlew ktlintCheck detekt
```
