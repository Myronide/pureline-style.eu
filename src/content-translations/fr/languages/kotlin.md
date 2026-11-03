# Style de code Kotlin

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Kotlin {#kotlin-profile}

### PL-KT-001 — val plutôt que var {#pl-kt-001--val-over-var}

Utilisez `val` par défaut. N'utilisez `var` que lorsqu'une valeur change réellement et que la mutation reste locale. Voir [État et effets de bord](../core/state-and-side-effects.md).

```kotlin
val retries = 3
val limit = retries * 2
```

### PL-KT-002 — Data classes pour les données simples {#pl-kt-002--data-classes-for-plain-data}

Utilisez `data class` pour les valeurs qui portent des données et se comparent par leur contenu. N'écrivez pas à la main `equals`, `hashCode` ni le code répétitif de copie.

```kotlin
data class SessionId(val value: String)
```

### PL-KT-003 — Types scellés avec when exhaustif {#pl-kt-003--sealed-types-with-exhaustive-when}

Modélisez les états avec `sealed interface` et branchez avec une expression `when` exhaustive. Évitez `else`, qui absorbe silencieusement les nouveaux cas.

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

### PL-KT-004 — Null safety sans !! {#pl-kt-004--null-safety-without}

Utilisez `?.` pour l'accès optionnel et `?:` pour les valeurs de repli ou les sorties anticipées. N'utilisez jamais `!!` en dehors des tests ; il transforme une vérification de null en plantage à l'exécution.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

### PL-KT-005 — Fonctions de portée seulement quand elles se lisent clairement {#pl-kt-005--scope-functions-only-when-they-read-clearly}

Utilisez `let`, `run` ou `apply` lorsqu'elles suppriment un nom temporaire ou configurent un objet. Ne les chaînez pas et ne les imbriquez pas ; une instruction simple est plus claire.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

### PL-KT-006 — Fonctions d'extension de portée étroite {#pl-kt-006--extension-functions-with-narrow-scope}

N'ajoutez une extension que si elle se lit comme une propriété du récepteur. Évitez les extensions sur `Any` ou sur des types trop larges, et ne cachez jamais d'effets de bord derrière l'une d'elles.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

### PL-KT-007 — Arguments nommés pour les booléens et les nombreux paramètres {#pl-kt-007--named-arguments-for-booleans-and-many-parameters}

Nommez les arguments pour chaque drapeau booléen et pour tout appel de plus de deux paramètres. Un `true` seul n'apprend rien au lecteur.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

### PL-KT-008 — Guard clauses et petites fonctions {#pl-kt-008--guard-clauses-and-small-functions}

Rejetez d'abord les entrées invalides et retournez immédiatement, afin que le chemin de succès reste sans indentation supplémentaire. Chaque fonction accomplit une étape et tient sur un écran. Voir [Flux de contrôle](../core/control-flow.md) et [Fonctions](../core/functions.md).

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

### PL-KT-009 — Nommage {#pl-kt-009--naming}

Les types utilisent UpperCamelCase. Les fonctions, les propriétés et les paramètres utilisent lowerCamelCase. Les `const val` de niveau supérieur utilisent UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

### PL-KT-010 — Densité des dossiers {#pl-kt-010--folder-density}

Gardez au maximum 10 fichiers sources maintenus à la main par dossier par défaut. Les fichiers générés ne comptent pas. Au-delà de cette limite, découpez par responsabilité et non par type de fichier, et documentez toute exception justifiée.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

### PL-KT-011 — Outillage {#pl-kt-011--tooling}

Exécutez ktlint pour le formatage et detekt pour l'analyse statique en CI. Corrigez les constats, ou supprimez-en un avec une raison étroite et commentée.

```bash
./gradlew ktlintCheck detekt
```
