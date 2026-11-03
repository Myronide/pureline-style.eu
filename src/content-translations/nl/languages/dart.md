# Dart-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Dart-profiel {#dart-profile}

Dart 3 met sound null safety is de basis. Alle voorbeelden gaan uit van Dart 3-syntaxis.

### PL-DART-001 — Standaard `final` en `const` {#pl-dart-001--final-and-const-by-default}

Declareer lokale variabelen en velden als `final`, tenzij ze opnieuw worden toegewezen. Gebruik `const` voor waarden die al bij compilatie bekend zijn.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Vermijd `var` wanneer de waarde nooit opnieuw wordt toegewezen.
- Geef de voorkeur aan `const`-constructors voor widgets, waardeobjecten en configuratie.

### PL-DART-002 — Sound null safety zonder `!` {#pl-dart-002--sound-null-safety-without}

Maak nullability expliciet in typen. Behandel `null` met `?.` en `??` wanneer de expressie eenvoudig is.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Vermijd de operator `!`. Gebruik hem alleen met een opmerking waarin staat waarom de waarde niet null kan zijn.
- Geef de voorkeur aan promotie via controles boven `!`.

### PL-DART-003 — Benoemde parameters met `required` voor de publieke API {#pl-dart-003--named-parameters-with-required-for-public-api}

Publieke constructors en functies nemen benoemde parameters. Markeer verplichte parameters met `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Benoemde argumenten maken aanroepen expliciet (PL-CORE-007).
- Gebruik positionele parameters alleen voor vanzelfsprekende hulpfuncties met één waarde.

### PL-DART-004 — Async-code gebruikt `Future` en `Stream` voor hun eigen doel {#pl-dart-004--async-code-uses-future-and-stream-for-their-purpose}

Gebruik `Future` voor één resultaat en `Stream` voor een reeks gebeurtenissen. Gebruik `async` en `await` in plaats van aaneengeschakelde `.then`.

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

- Verpak geen enkele waarde in een `Stream` en dwing een bron met meerdere gebeurtenissen niet in een `Future`.
- Houd neveneffecten zichtbaar op de plek van de aanroep (PL-CORE-015).

### PL-DART-005 — Vermijd `dynamic` {#pl-dart-005--avoid-dynamic}

Gebruik concrete typen, generics of `Object?` voor onbekende data. Vernauw onbekende data met patroonherkenning voordat je haar gebruikt.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Behandel `dynamic` als een uitzondering die aan de grens moet worden onderbouwd.

### PL-DART-006 — Guard clauses met vroege return {#pl-dart-006--guard-clauses-with-early-return}

Controleer ongeldige en afwezige toestanden eerst en keer terug. Houd het hoofdpad zonder extra inspringing (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Zie [besturingsstroom](../core/control-flow.md) voor de gedeelde regel.
- Vermijd `else` na een tak die terugkeert (PL-CORE-002).

### PL-DART-007 — Sealed classes en switch-expressies voor toestand {#pl-dart-007--sealed-classes-and-switch-expressions-for-state}

Modelleer gesloten verzamelingen toestanden als `sealed` classes. Behandel ze met een uitputtende `switch`-expressie.

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

- Geef hieraan de voorkeur boven booleaanse vlaggen of toestanden als string.
- De compiler dwingt af dat elke toestand wordt afgehandeld.

### PL-DART-008 — Naamgeving {#pl-dart-008--naming}

Gebruik `lowerCamelCase` voor leden, variabelen, parameters en constanten. Gebruik `UpperCamelCase` voor typen, klassen, enums en extensions.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Namen moeten betekenis dragen (PL-CORE-007). Vermijd afkortingen zoals `usr` of `cfg`.
- Gebruik `snake_case` alleen voor bestandsnamen.

### PL-DART-009 — `_` markeert namen die privé zijn voor de bibliotheek {#pl-dart-009---marks-library-private-names}

Geef namen alleen het voorvoegsel `_` wanneer ze verborgen moeten blijven voor andere bibliotheken. Gebruik `_` niet als vervanging voor documentatie.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Houd het publieke oppervlak klein, zodat het contract van de bibliotheek duidelijk blijft.

### PL-DART-010 — Kleine klassen met één verantwoordelijkheid {#pl-dart-010--small-classes-with-one-responsibility}

Houd klassen gericht op één samenhangende verantwoordelijkheid. Splits een klasse wanneer ze niet-gerelateerde aandachtsgebieden vermengt, niet wanneer ze een willekeurig aantal regels overschrijdt (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Geef de voorkeur aan compositie van kleine klassen boven overervingshiërarchieën.

### PL-DART-011 — Mapdichtheid {#pl-dart-011--folder-density}

Een Dart-bronmap onder `lib/` mag standaard maximaal **10 handmatig onderhouden bronbestanden** bevatten.

Gegenereerde bestanden, `part`-bestanden, barrel-bestanden zoals `lib/feature.dart` en tests tellen niet mee. Een splitsing moet een echte grens volgen:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Zie [structuur](../core/structure.md) voor de gedeelde grootteregels (PL-CORE-021).

### PL-DART-012 — Tooling: `dart format` en `dart analyze` met `lints` {#pl-dart-012--tooling-dart-format-and-dart-analyze-with-lints}

Formatteer en analyseer elk package vóór de review. Schakel het package `lints` in in `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Behandel waarschuwingen van de analyzer in CI als fouten.
- Schakel lints niet lokaal uit zonder een opmerking die de uitzondering uitlegt.
