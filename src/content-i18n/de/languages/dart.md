# Dart-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Dartprofil

Dart 3 mit einer Schallsicherheit von null ist die Basis.. Alle Beispiele nehmen die Dart-3-Syntax an.

### PL-DART-001 — `final` und `const` nach Standard

Lokale und Felder als `final` deklarieren, es sei denn, sie werden neu zugewiesen. Verwenden Sie `const` für Compil-Zeitwerte.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Vermeiden Sie `var`, wenn der Wert nie neu zugewiesen wird.
- Bevorzugen Sie `const` Konstruktoren für Widgets, Wertobjekte und Konfiguration.

### PL-DART-002 — Schall Null Sicherheit ohne `!`

Nichtigkeit in Typen explizit machen.. Griff `null` mit `?.` und `??`, wenn der Ausdruck einfach ist.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Vermeiden Sie den `!`-Operator. Verwenden Sie es nur mit einem Kommentar, der besagt, warum der Wert nicht null sein kann.
- Bevorzugen Sie die Beförderung durch Kontrollen über `!`.

### PL-DART-003 — Benannte Parameter mit `required` für öffentliche API

Öffentliche Konstruktoren und Funktionen nehmen benannte Parameter ein.. Markieren Sie die Pflichtzeichen `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Benannte Argumente machen Call Sites explizit (PL-CORE-007).
- Verwenden Sie Positionsparameter nur für offensichtliche, einwertige Helfer..

Genannte Parameter unterscheiden dieselben Argumente an der Call-Site.

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

### PL-DART-004 — Async Code verwendet `Future` und `Stream` für ihre Zwecke

Verwenden Sie `Future` für ein Ergebnis und `Stream` für eine Folge von Ereignissen. Verwenden Sie `async` und `await` statt verkettet `.then`.

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

- Nicht einen einzelnen Wert in ein `Stream` einwickeln und keine Multi-Event-Quelle in ein `Future` zwingen.
- Halten Sie Nebenwirkungen am Call-Site (PL-CORE-015) sichtbar.

### PL-DART-005 — Avoid `dynamic`

Verwenden Sie Betontypen, Generika oder `Object?` für unbekannte Daten. Enge unbekannte Daten mit Muster-Matching vor der Anwendung.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- `dynamic` als Ausnahme behandeln, die an der Grenze gerechtfertigt sein muss.

### PL-DART-006 — Wachklauseln mit früher Rückkehr

Überprüfen Sie zuerst ungültige und fehlende Zustände und kehren Sie zurück. Halten Sie den Hauptweg uninndented (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Siehe [Kontrollfluss](../core/control-flow.md) für die gemeinsame Regel.
- Vermeiden Sie `else` nach einem wiederkehrenden Zweig (PL-CORE-002).

### PL-DART-007 — Versiegelte Klassen und Schalterausdrücke für den Staat

Modell geschlossene Staatensätze als `sealed` Klassen. Behandeln Sie sie mit einem erschöpfenden `switch`-Ausdruck.

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

- Bevorzugen Sie dies über boolesche Flaggen oder String-Zustände.
- Der Compiler setzt sicher, dass jeder Zustand behandelt wird.

### PL-DART-008 — Benennung

Verwenden Sie `lowerCamelCase` für Mitglieder, Variablen, Parameter und Konstanten. Verwenden Sie `UpperCamelCase` für Typen, Klassen, Enums und Erweiterungen.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Namen müssen Bedeutung haben (PL-CORE-007). Vermeiden Sie Abkürzungen wie `usr` oder `cfg`.
- Verwenden Sie `snake_case` nur für Dateinamen.

### PL-DART-009 — `_` markiert Bibliothek-Privatnamen

Präfixnamen mit `_` nur, wenn sie vor anderen Bibliotheken versteckt bleiben müssen. `_` darf nicht als Ersatz für Dokumentation verwendet werden.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Halten Sie die öffentliche Oberfläche klein, damit der Vertrag der Bibliothek klar bleibt.

### PL-DART-010 — Kleine Klassen mit einer Verantwortung

Halten Sie die Klassen auf eine kohärente Verantwortung konzentriert.. Teilt eine Klasse, wenn sie nicht miteinander in Verbindung stehende Bedenken mischt, nicht wenn sie eine beliebige Zeilenanzahl (PL-CORE-009, PL-CORE-022) passiert.

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Bevorzugen Sie die Zusammensetzung der kleinen Klassen über Erbhierarchien..

### PL-DART-011 — Ordnerdichte

A Dart source folder under `lib/` may contain at most **10 hand-maintained source files** by default.

Generierte Dateien, `part`-Dateien, Fassdateien wie `lib/feature.dart` und Tests zählen nicht. Eine Spaltung sollte einer echten Grenze folgen:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Siehe [Struktur](../core/structure.md) für die Regeln für die gemeinsame Größe (PL-CORE-021).

### PL-DART-012 — Werkzeug: `dart format` und `dart analyze` mit `lints`

Formatieren und analysieren Sie jedes Paket vor der Überprüfung.. Aktivieren Sie das `lints`-Paket in `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Analysatorenwarnungen als Misserfolge bei KI behandeln.
- Nicht lokal ohne einen Kommentar deaktivieren, der die Ausnahme erklärt.
