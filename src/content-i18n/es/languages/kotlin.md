# Estilo de código Kotlin

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de Kotlin

### PL-KT-001 — val sobre var

Por defecto a `val`. Use `var` sólo cuando un valor cambia verdaderamente y la mutación permanece local. Véase [Efectos estatales y secundarios](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Clases de datos para datos simples

Utilice `data class` para valores que contengan datos y comparen por contenido. No escriba a mano `equals`, `hashCode` ni copie la placa de caldera.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Tipos sellados con exhaustivo cuando

Modelo establece como `sealed interface` y rama con una expresión exhaustiva `when`. Evite `else`, que absorbe silenciosamente nuevos casos.

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

### PL-KT-004 — ¡Sin seguridad nula!!

Utilice `?.` para acceso opcional y `?:` para valores de reserva. Prefiere un
separar la protección nula cuando un valor faltante causa un retorno temprano. Nunca utilizar
`!!` fuera de las pruebas.

```text
− Elvis with early return              │ ✓ Pureline
val user = users[id] ?: return "Gast"  │ val user = users[id]
                                       │ if (user == null) {
return user.name                       │     return "Gast"
                                       │ }
                                       │
                                       │ return user.name
```

### PL-KT-005 — El alcance funciona solo cuando se lee claramente

Use `let`, `run` o `apply` cuando eliminen un nombre temporal o configuren un objeto. No los encadenen ni anidan; una declaración simple es más clara.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Funciones de extensión con alcance reducido

Añada una extensión sólo cuando se lee como propiedad del receptor. Evite las extensiones en `Any` o tipos amplios, y nunca ocultar los efectos secundarios detrás de uno.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Argumentos nombrados para los booleanos y muchos parámetros

Nombre argumentos para cada bandera booleana y para cualquier llamada con más de dos parámetros. Una `true` sin nada que le diga al lector.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Cláusulas de protección y funciones pequeñas

Rechazar entrada inválida primero y regresar inmediatamente, por lo que la ruta de éxito permanece sin identificar. Cada función realiza un paso y se ajusta a una pantalla. Véase [Flujo de control](../core/control-flow.md) y [Funciones](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Denominación

Types use UpperCamelCase. Las funciones, propiedades y parámetros usan lowerCamelCase. `const val` de alto nivel utiliza UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Densidad de la carpeta

Mantenga como máximo 10 archivos fuente mantenidos a mano por carpeta por defecto. Los archivos generados no cuentan. Más allá de ese límite, dividido por responsabilidad, no por tipo de archivo, y documentar cualquier excepción justificada.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Herramientas

Ejecute ktlint para formatear y detekt para análisis estático en CI. Arreglar hallazgos, o suprimir uno con una razón estrecha, comentada.

```bash
./gradlew ktlintCheck detekt
```
