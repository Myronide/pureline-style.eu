# Dart Code Style

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille] (../core/structure.md) s'applique tout au long.

## Dart Profile

Dart 3 with sound null safety is the baseline. All examples assume Dart 3 syntax.

### PL-DART-001 — `final` and `const` by Default

Declare locals and fields as `final` unless they are reassigned. Use `const` for compile-time values.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Avoid `var` when the value is never reassigned.
- Prefer `const` constructors for widgets, value objects, and configuration.

### PL-DART-002 — Sound Null Safety Without `!`

Make nullability explicit in types. Handle `null` with `?.` and `??` when the expression is simple.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Avoid the `!` operator. Use it only with a comment that states why the value cannot be null.
- Prefer promotion through checks over `!`.

### PL-DART-003 — Named Parameters with `required` for Public API

Public constructors and functions take named parameters. Mark mandatory ones `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Named arguments make call sites explicit (PL-CORE-007).
- Use positional parameters only for obvious, single-value helpers.

### PL-DART-004 — Async Code Uses `Future` and `Stream` for Their Purpose

Use `Future` for one result and `Stream` for a sequence of events. Use `async` and `await` instead of chained `.then`.

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

- Do not wrap a single value in a `Stream`, and do not force a multi-event source into a `Future`.
- Keep side effects visible at the call site (PL-CORE-015).

### PL-DART-005 — Éviter `dynamic`

Use concrete types, generics, or `Object?` for unknown data. Narrow unknown data with pattern matching before use.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Treat `dynamic` as an exception that must be justified at the boundary.

### PL-DART-006 — Guard Clauses with Early Return

Check invalid and absent states first and return. Keep the main path unindented (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- See [control flow](../core/control-flow.md) for the shared rule.
- Avoid `else` after a returning branch (PL-CORE-002).

### PL-DART-007 — Sealed Classes and Switch Expressions for State

Model closed sets of states as `sealed` classes. Handle them with an exhaustive `switch` expression.

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

- Prefer this over boolean flags or string states.
- The compiler enforces that every state is handled.

### PL-DART-008 — Désignation

Use `lowerCamelCase` for members, variables, parameters, and constants. Use `UpperCamelCase` for types, classes, enums, and extensions.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Names must carry meaning (PL-CORE-007). Avoid abbreviations such as `usr` or `cfg`.
- Use `snake_case` only for file names.

### PL-DART-009 — `_` Marks Library-Private Names

Prefix names with `_` only when they must stay hidden from other libraries. Do not use `_` as a substitute for documentation.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Keep public surface small so that the library's contract stays clear.

### PL-DART-010 — Small Classes with One Responsibility

Keep classes focused on one coherent responsibility. Split a class when it mixes unrelated concerns, not when it passes an arbitrary line count (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Prefer composition of small classes over inheritance hierarchies.

### PL-DART-011 — Densité du dossier

A Dart source folder under `lib/` may contain at most **10 hand-maintained source files** by default.

Generated files, `part` files, barrel files such as `lib/feature.dart`, and tests do not count. A split should follow a real boundary:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- See [structure](../core/structure.md) for the shared size rules (PL-CORE-021).

### PL-DART-012 — Tooling: `dart format` and `dart analyze` with `lints`

Format and analyze every package before review. Enable the `lints` package in `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Treat analyzer warnings as failures in CI.
- Do not disable lints locally without a comment that explains the exception.
