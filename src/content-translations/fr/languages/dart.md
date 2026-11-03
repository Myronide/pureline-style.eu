# Style de code Dart

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Dart {#dart-profile}

Dart 3 avec une null safety saine (sound null safety) est la base de référence. Tous les exemples supposent la syntaxe de Dart 3.

### PL-DART-001 — `final` et `const` par défaut {#pl-dart-001--final-and-const-by-default}

Déclarez les variables locales et les champs en `final`, sauf s'ils sont réaffectés. Utilisez `const` pour les valeurs connues à la compilation.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Évitez `var` lorsque la valeur n'est jamais réaffectée.
- Préférez les constructeurs `const` pour les widgets, les objets valeur et la configuration.

### PL-DART-002 — Null safety saine sans `!` {#pl-dart-002--sound-null-safety-without}

Rendez la nullabilité explicite dans les types. Traitez `null` avec `?.` et `??` lorsque l'expression est simple.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Évitez l'opérateur `!`. Ne l'utilisez qu'avec un commentaire qui explique pourquoi la valeur ne peut pas être nulle.
- Préférez la promotion de type par des vérifications plutôt que `!`.

### PL-DART-003 — Paramètres nommés avec `required` pour l'API publique {#pl-dart-003--named-parameters-with-required-for-public-api}

Les constructeurs et fonctions publics prennent des paramètres nommés. Marquez les obligatoires avec `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Les arguments nommés rendent les points d'appel explicites (PL-CORE-007).
- N'utilisez des paramètres positionnels que pour de simples utilitaires évidents à une seule valeur.

### PL-DART-004 — Le code asynchrone utilise `Future` et `Stream` selon leur vocation {#pl-dart-004--async-code-uses-future-and-stream-for-their-purpose}

Utilisez `Future` pour un résultat unique et `Stream` pour une séquence d'événements. Utilisez `async` et `await` plutôt que des `.then` chaînés.

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

- N'enveloppez pas une valeur unique dans un `Stream`, et ne forcez pas une source à événements multiples dans un `Future`.
- Gardez les effets de bord visibles au point d'appel (PL-CORE-015).

### PL-DART-005 — Éviter `dynamic` {#pl-dart-005--avoid-dynamic}

Utilisez des types concrets, des génériques ou `Object?` pour les données inconnues. Rétrécissez le type des données inconnues par pattern matching avant de les utiliser.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Traitez `dynamic` comme une exception qui doit être justifiée à la frontière.

### PL-DART-006 — Guard clauses avec retour anticipé {#pl-dart-006--guard-clauses-with-early-return}

Vérifiez d'abord les états invalides et absents, puis retournez. Gardez le chemin principal sans indentation supplémentaire (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Voir le [flux de contrôle](../core/control-flow.md) pour la règle commune.
- Évitez `else` après une branche qui retourne (PL-CORE-002).

### PL-DART-007 — Classes scellées et expressions switch pour l'état {#pl-dart-007--sealed-classes-and-switch-expressions-for-state}

Modélisez les ensembles d'états fermés sous forme de classes `sealed`. Traitez-les avec une expression `switch` exhaustive.

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

- Préférez cette approche aux drapeaux booléens ou aux états sous forme de chaînes.
- Le compilateur impose que chaque état soit traité.

### PL-DART-008 — Nommage {#pl-dart-008--naming}

Utilisez `lowerCamelCase` pour les membres, les variables, les paramètres et les constantes. Utilisez `UpperCamelCase` pour les types, les classes, les enums et les extensions.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Les noms doivent porter du sens (PL-CORE-007). Évitez les abréviations telles que `usr` ou `cfg`.
- N'utilisez `snake_case` que pour les noms de fichiers.

### PL-DART-009 — `_` marque les noms privés à la bibliothèque {#pl-dart-009---marks-library-private-names}

Ne préfixez les noms par `_` que lorsqu'ils doivent rester cachés aux autres bibliothèques. N'utilisez pas `_` comme substitut à la documentation.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Gardez la surface publique petite afin que le contrat de la bibliothèque reste clair.

### PL-DART-010 — Petites classes à responsabilité unique {#pl-dart-010--small-classes-with-one-responsibility}

Gardez les classes centrées sur une seule responsabilité cohérente. Découpez une classe lorsqu'elle mélange des préoccupations sans rapport, et non lorsqu'elle dépasse un nombre de lignes arbitraire (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Préférez la composition de petites classes aux hiérarchies d'héritage.

### PL-DART-011 — Densité des dossiers {#pl-dart-011--folder-density}

Un dossier source Dart sous `lib/` peut contenir au maximum **10 fichiers sources maintenus à la main** par défaut.

Les fichiers générés, les fichiers `part`, les fichiers barrel comme `lib/feature.dart` et les tests ne comptent pas. Un découpage doit suivre une véritable frontière :

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Voir la [structure](../core/structure.md) pour les règles de taille communes (PL-CORE-021).

### PL-DART-012 — Outillage : `dart format` et `dart analyze` avec `lints` {#pl-dart-012--tooling-dart-format-and-dart-analyze-with-lints}

Formatez et analysez chaque package avant la revue. Activez le package `lints` dans `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Traitez les avertissements de l'analyseur comme des échecs en CI.
- Ne désactivez pas de lints localement sans un commentaire qui explique l'exception.
