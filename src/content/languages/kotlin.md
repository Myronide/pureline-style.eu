# Kotlin Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Kotlin Profile

### PL-KT-001 — val over var

Default to `val`. Use `var` only when a value truly changes and the mutation stays local. See [State and Side Effects](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Data Classes for Plain Data

Use `data class` for values that carry data and compare by content. Do not hand-write `equals`, `hashCode`, or copy boilerplate.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Sealed Types with Exhaustive when

Model states as `sealed interface` and branch with an exhaustive `when` expression. Avoid `else`, which silently absorbs new cases.

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

### PL-KT-004 — Null Safety Without !!

Use `?.` for optional access and `?:` for fallback values. Prefer a
separate null guard when a missing value causes an early return. Never use
`!!` outside tests.

```text
− Elvis with early return              │ ✓ Pureline
val user = users[id] ?: return "Gast"  │ val user = users[id]
                                       │ if (user == null) {
return user.name                       │     return "Gast"
                                       │ }
                                       │
                                       │ return user.name
```

### PL-KT-005 — Scope Functions Only When They Read Clearly

Use `let`, `run`, or `apply` when they remove a temporary name or configure one object. Do not chain or nest them; a plain statement is clearer.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Extension Functions with Narrow Scope

Add an extension only when it reads as a property of the receiver. Avoid extensions on `Any` or broad types, and never hide side effects behind one.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Named Arguments for Booleans and Many Parameters

Name arguments for every boolean flag and for any call with more than two parameters. A bare `true` tells the reader nothing.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard Clauses and Small Functions

Reject invalid input first and return immediately, so the success path stays unindented. Each function performs one step and fits on one screen. See [Control Flow](../core/control-flow.md) and [Functions](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Naming

Types use UpperCamelCase. Functions, properties, and parameters use lowerCamelCase. Top-level `const val` uses UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Folder Density

Keep at most 10 hand-maintained source files per folder by default. Generated files do not count. Past that limit, split by responsibility, not by file type, and document any justified exception.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Tooling

Run ktlint for formatting and detekt for static analysis in CI. Fix findings, or suppress one with a narrow, commented reason.

```bash
./gradlew ktlintCheck detekt
```
