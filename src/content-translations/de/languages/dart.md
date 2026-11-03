# Dart Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Dart-Profil {#dart-profile}

Dart 3 mit Sound Null Safety ist die Basis. Alle Beispiele setzen die Syntax von Dart 3 voraus.

### PL-DART-001 — Standardmäßig `final` und `const` {#pl-dart-001--final-and-const-by-default}

Deklariere lokale Variablen und Felder als `final`, solange sie nicht neu zugewiesen werden. Verwende `const` für Werte zur Compile-Zeit.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Vermeide `var`, wenn der Wert nie neu zugewiesen wird.
- Bevorzuge `const`-Konstruktoren für Widgets, Value Objects und Konfiguration.

### PL-DART-002 — Sound Null Safety ohne `!` {#pl-dart-002--sound-null-safety-without}

Mache die Nullability in den Typen explizit. Behandle `null` mit `?.` und `??`, wenn der Ausdruck einfach ist.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Vermeide den Operator `!`. Verwende ihn nur mit einem Kommentar, der angibt, warum der Wert nicht null sein kann.
- Bevorzuge Promotion durch Prüfungen gegenüber `!`.

### PL-DART-003 — Benannte Parameter mit `required` für die öffentliche API {#pl-dart-003--named-parameters-with-required-for-public-api}

Öffentliche Konstruktoren und Funktionen nehmen benannte Parameter entgegen. Markiere zwingende Parameter mit `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Benannte Argumente machen Aufrufstellen explizit (PL-CORE-007).
- Verwende positionale Parameter nur für offensichtliche Helfer mit einem einzigen Wert.

Benannte Parameter machen am Aufruf sichtbar, welche Rolle Argumente desselben Typs haben.

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

### PL-DART-004 — Asynchroner Code nutzt `Future` und `Stream` zweckgemäß {#pl-dart-004--async-code-uses-future-and-stream-for-their-purpose}

Verwende `Future` für ein einzelnes Ergebnis und `Stream` für eine Folge von Ereignissen. Verwende `async` und `await` statt verketteter `.then`.

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

- Verpacke einen einzelnen Wert nicht in einen `Stream` und presse keine Quelle mit mehreren Ereignissen in ein `Future`.
- Halte Seiteneffekte an der Aufrufstelle sichtbar (PL-CORE-015).

### PL-DART-005 — `dynamic` vermeiden {#pl-dart-005--avoid-dynamic}

Verwende konkrete Typen, Generics oder `Object?` für unbekannte Daten. Grenze unbekannte Daten vor der Verwendung per Pattern Matching ein.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Behandle `dynamic` als Ausnahme, die an der Grenze begründet werden muss.

### PL-DART-006 — Guard Clauses mit frühem Return {#pl-dart-006--guard-clauses-with-early-return}

Prüfe ungültige und fehlende Zustände zuerst und kehre zurück. Halte den Hauptpfad ohne Einrückung (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Die gemeinsame Regel steht unter [Kontrollfluss](../core/control-flow.md).
- Vermeide `else` nach einem Zweig, der zurückkehrt (PL-CORE-002).

### PL-DART-007 — Sealed Classes und Switch-Ausdrücke für Zustände {#pl-dart-007--sealed-classes-and-switch-expressions-for-state}

Modelliere geschlossene Mengen von Zuständen als `sealed`-Klassen. Behandle sie mit einem erschöpfenden `switch`-Ausdruck.

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

- Bevorzuge das gegenüber booleschen Flags oder String-Zuständen.
- Der Compiler stellt sicher, dass jeder Zustand behandelt wird.

### PL-DART-008 — Benennung {#pl-dart-008--naming}

Verwende `lowerCamelCase` für Member, Variablen, Parameter und Konstanten. Verwende `UpperCamelCase` für Typen, Klassen, Enums und Extensions.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Namen müssen Bedeutung tragen (PL-CORE-007). Vermeide Abkürzungen wie `usr` oder `cfg`.
- Verwende `snake_case` nur für Dateinamen.

### PL-DART-009 — `_` kennzeichnet bibliotheksprivate Namen {#pl-dart-009---marks-library-private-names}

Setze `_` nur dann als Präfix, wenn Namen vor anderen Bibliotheken verborgen bleiben müssen. Verwende `_` nicht als Ersatz für Dokumentation.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Halte die öffentliche Oberfläche klein, damit der Vertrag der Bibliothek klar bleibt.

### PL-DART-010 — Kleine Klassen mit einer Verantwortung {#pl-dart-010--small-classes-with-one-responsibility}

Halte Klassen auf eine kohärente Verantwortung fokussiert. Teile eine Klasse auf, wenn sie unzusammenhängende Anliegen vermischt, nicht wenn sie eine willkürliche Zeilenzahl überschreitet (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Bevorzuge die Komposition kleiner Klassen gegenüber Vererbungshierarchien.

### PL-DART-011 — Ordnerdichte {#pl-dart-011--folder-density}

Ein Dart-Quellordner unter `lib/` darf standardmäßig höchstens **10 von Hand gepflegte Quelldateien** enthalten.

Generierte Dateien, `part`-Dateien, Barrel-Dateien wie `lib/feature.dart` und Tests zählen nicht. Eine Aufteilung soll einer echten Grenze folgen:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Die gemeinsamen Größenregeln stehen unter [Struktur](../core/structure.md) (PL-CORE-021).

### PL-DART-012 — Tooling: `dart format` und `dart analyze` mit `lints` {#pl-dart-012--tooling-dart-format-and-dart-analyze-with-lints}

Formatiere und analysiere jedes Paket vor dem Review. Aktiviere das Paket `lints` in der `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Behandle Analyzer-Warnungen in der CI als Fehler.
- Deaktiviere Lints nicht lokal ohne einen Kommentar, der die Ausnahme erklärt.
