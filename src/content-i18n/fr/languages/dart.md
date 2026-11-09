# Style de code de laart

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil de la fléchette

La Dart 3 avec la sécurité sonore nulle est la référence. Tous les exemples supposent la syntaxe Dart 3.

### PL-DART-001 — `final` et `const` par défaut

Déclarez les locaux et les champs comme `final` à moins qu'ils ne soient réaffectés. Utilisez `const` pour compiler les valeurs temps.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Évitez `var` lorsque la valeur n'est jamais réaffectée.
- Préférez les constructeurs `const` pour les widgets, les objets de valeur et la configuration.

### PL-DART-002 — Sécurité de la nuque sans `!`

Faire la nullité explicite dans les types. Poignez `null` avec `?.` et `??` lorsque l'expression est simple.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Évitez l'opérateur `!`. Utilisez-le seulement avec un commentaire qui indique pourquoi la valeur ne peut pas être nulle.
- Préférez la promotion par des vérifications sur `!`.

### PL-DART-003 — Paramètres nommés avec `required` pour API publique

Les constructeurs et les fonctions publics prennent des paramètres nommés. Marquez les `required` obligatoires.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Les arguments nommés rendent les sites d'appel explicites (PL-CORE-007).
- Utiliser les paramètres de position uniquement pour les aides évidentes et à valeur unique.

Les paramètres nommés distinguent les arguments de même type sur le site d'appel.

```text
− Positional parameters                │ ✓ Pureline
void resize(int width, int height) {   │ void resize({
  // …                                 │   required int width,
}                                      │   required int height,
                                       │ }) {
resize(1920, 1080);                    │   // …
                                       │ }
                                       │
                                       │ resize(width: 1920, height: 1080);
```

### PL-DART-004 — Code Async utilise `Future` et `Stream` pour leur usage

Utilisez `Future` pour un résultat et `Stream` pour une séquence d'événements. Utilisez `async` et `await` au lieu de `.then` enchaîné.

```dart
Future<User> loadUser(UserId id) async {
  final response = await api.fetch(id);
  return User.fromJson(response);
}

Stream<Packet> incoming(Socket socket) async* {
  await for (final packet in socket) {
    yield packet;
  }
}
```

- Ne pas envelopper une valeur unique dans un `Stream` et ne pas forcer une source multi-événements dans un `Future`.
- Gardez les effets indésirables visibles au site d'appel (PL-CORE-015).

### PL-DART-005 — Éviter `dynamic`

Utilisez des types de béton, des génériques ou `Object?` pour des données inconnues. Données inconnues étroites avec correspondance des patrons avant utilisation.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Traiter `dynamic` comme une exception qui doit être justifiée à la frontière.

### PL-DART-006 — Clauses de garde avec retour anticipé

Vérifiez les états invalides et absents d'abord et retournez. Gardez le chemin principal sans diluer (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Voir [contrôle flow](../core/control-flow.md) pour la règle partagée.
- Évitez `else` après une branche de retour (PL-CORE-002).

### PL-DART-007 — Classes scellées et expressions de commutation pour l'État

Modéliser des ensembles fermés d'états comme classes `sealed`. Gérez-les avec une expression exhaustive `switch`.

```dart
sealed class SessionState {
  const SessionState();
}

final class Ready extends SessionState {
  const Ready();
}

final class Closed extends SessionState {
  const Closed(this.reason);
  final String reason;
}

String label(SessionState state) => switch (state) {
      Ready() => 'ready',
      Closed(:final reason) => 'closed: $reason',
    };
```

- Préférez-le par rapport aux drapeaux booléens ou aux états de cordes.
- Les généalogies font en sorte que chaque État soit géré.

### PL-DART-008 — Désignation

Utilisez `lowerCamelCase` pour les membres, les variables, les paramètres et les années 2004. Utilisez `UpperCamelCase` pour les types, classes, enums et extensions.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Les noms doivent avoir une signification (PL-CORE-007). Évitez les abréviations telles que `usr` ou `cfg`.
- Utilisez `snake_case` uniquement pour les noms de fichiers.

### PL-DART-009 — `_` Marque les noms de la bibliothèque-privé

Préfixez les noms avec `_` seulement quand ils doivent rester cachés d'autres bibliothèques. N'utilisez pas `_` comme substitut à la documentation.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Gardez la surface publique petite pour que le contrat de la bibliothèque reste clair.

### PL-DART-010 — Petites classes ayant une responsabilité unique

Conservez les cours axés sur une responsabilité cohérente. Diviser une classe lorsqu'elle mélange des préoccupations non liées, et non lorsqu'elle passe un nombre de lignes arbitraires (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Préférez la composition des petites classes par rapport aux hiérarchisations.

### PL-DART-011 — Densité du dossier

Un dossier source Dart sous `lib/` peut contenir au maximum des fichiers source **10 maintenus manuellement** par défaut.

Les fichiers générés, les fichiers `part`, les fichiers barils comme `lib/feature.dart`, et les tests ne comptent pas. Une scission doit suivre une vraie limite :

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Voir [structure](../core/structure.md) pour les règles de taille partagée (PL-CORE-021).

### PL-DART-012 — Outillage: `dart format` et `dart analyze` avec `lints`

Formater et analyser chaque paquet avant de l'examiner. Activez le paquet `lints` dans `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Traiter les avertissements d'analyseur comme des défaillances dans l'IC.
- Ne pas désactiver localement les lints sans un commentaire qui explique l'exception.
