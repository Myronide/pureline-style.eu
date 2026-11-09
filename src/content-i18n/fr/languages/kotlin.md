# Style de code de Kotlin

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil de Kotlin

### PL-KT-001 — valeur supérieure à la valeur

Par défaut vers `val`. Utilisez `var` seulement quand une valeur change vraiment et que la mutation reste locale. Voir [État et effets secondaires](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Classes de données pour les données ordinaires

Utilisez `data class` pour les valeurs qui transportent les données et les comparent par contenu. Ne pas écrire à la main `equals`, `hashCode`, ni copier la plaque de chaudière.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Types scellés avec échappement lorsque

Model indique comme `sealed interface` et branche avec une expression exhaustive `when`. Évitez `else`, qui absorbe silencieusement de nouveaux cas.

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

### PL-KT-004 — Sécurité sans coques sans!!

Utilisez `?.` pour l'accès optionnel et `?:` pour les valeurs de recul. Préférez
séparer le garde nul lorsqu'une valeur manquante provoque un retour précoce. Ne jamais utiliser
`!!` essais extérieurs.

```text
− Elvis with early return              │ ✓ Pureline
val user = users[id] ?: return "Gast"  │ val user = users[id]
                                       │ if (user == null) {
return user.name                       │     return "Gast"
                                       │ }
                                       │
                                       │ return user.name
```

### PL-KT-005 — Fonctions de portée seulement lorsqu'elles lisent clairement

Utilisez `let`, `run` ou `apply` lorsqu'ils suppriment un nom temporaire ou configurent un objet. Ne les enchaînez pas ou ne les niez pas; une déclaration claire est plus claire.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Fonctions d'extension avec une portée étroite

Ajouter une extension seulement lorsqu'elle est l'objet du récepteur. Évitez les extensions sur `Any` ou les types larges, et ne cachez jamais les effets secondaires derrière un.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Arguments nommés pour les booléens et de nombreux paramètres

Nommer les arguments pour chaque drapeau booléen et pour tout appel avec plus de deux paramètres. Un `true` nu ne dit rien au lecteur.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Clauses de garde et petites fonctions

Rejeter les entrées invalides d'abord et revenir immédiatement, de sorte que le chemin de succès reste inaltéré. Chaque fonction effectue une étape et s'adapte sur un écran. Voir [Flux de contrôle](../core/control-flow.md) et [Fonctions](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Désignation

Types utilisent UpperCamelCase. Les fonctions, les propriétés et les paramètres utilisent lowerCamelCase. `const val` de haut niveau utilise Upper_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Densité du dossier

Conservez au plus 10 fichiers source par dossier par défaut. Les fichiers générés ne comptent pas. Après cette limite, divisée par responsabilité, non par type de fichier, et documenter toute exception justifiée.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Outillage

Lancer ktlint pour le formatage et detekt pour l'analyse statique en CI. Fixez des conclusions, ou supprimez-les avec une raison étroite et commentée.

```bash
./gradlew ktlintCheck detekt
```
