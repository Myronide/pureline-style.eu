# Dart Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Dartprofiel

Dart 3 met geluidsnull veiligheid is de basislijn. Alle voorbeelden veronderstellen Dart 3 syntax.

### PL-DART-001. `final` en `const` standaard

Declareer lokalen en velden als `final` tenzij ze opnieuw toegewezen worden. Gebruik `const` voor compilatie-tijdwaarden.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Vermijd `var` als de waarde nooit opnieuw wordt toegewezen.
- `const`-constructors zijn de voorkeur voor widgets, waarde objecten en configuratie.

### PL-DART-002. Geluid Null Veiligheid zonder `!`

Maak de verwatering expliciet in types. `null` met `?.` en `??` als de expressie eenvoudig is.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Vermijd de `!`-operator. Gebruik het alleen met een opmerking die aangeeft waarom de waarde niet nul kan zijn.
- Liever promotie door middel van controles over `!`.

### PL-DART-003. Genoemde parameters met `required` voor publieke API

Openbare constructeurs en functies nemen genoemde parameters. Meld de verplichte `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Genoemde argumenten maken call sites expliciet (PL-CORE-007).
- Gebruik positieparameters alleen voor duidelijke, hulpjes met één waarde.

Genoemde parameters onderscheiden dezelfde soort argumenten op de call site.

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

### PL-DART-004. Async code gebruikt `Future` en `Stream` voor hun doel

Gebruik `Future` voor één resultaat en `Stream` voor een reeks gebeurtenissen. Gebruik `async` en `await` in plaats van geketende `.then`.

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

- Geen enkele waarde in een `Stream` inpakken en een multi-event bron niet in een `Future` dwingen.
- Houd bijwerkingen zichtbaar op de oproepplaats (PL-CORE-015).

### PL-DART-005. Vermijd `dynamic`

Gebruik concrete types, generieken of `Object?` voor onbekende gegevens. Smal onbekende gegevens met patroon dat overeenkomt voor gebruik.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Behandel `dynamic` als een uitzondering die aan de grens moet worden gerechtvaardigd.

### PL-DART-006. Bewakersclausules met vroegtijdige terugkeer

Controleer ongeldige en afwezige staten eerst en keer terug. Houd het hoofdpad ongemerkt (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Zie [controlestroom](../core/control-flow.md) voor de gedeelde regel.
- Vermijd `else` na een terugkerende tak (PL-CORE-002).

### PL-DART-007. Gesloten klassen en switch-expressies voor staat

Model gesloten sets van staten als `sealed` klassen. Behandel ze met een uitgebreide `switch` expressie.

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

- Liever dit dan booleaanse vlaggen of string staten.
- De compiler verplicht zich ertoe dat elke staat wordt afgehandeld.

### PL-DART-008. Naamgeving

Gebruik `lowerCamelCase` voor leden, variabelen, parameters en constanten. Gebruik `UpperCamelCase` voor types, klassen, enums en extensies.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Namen moeten betekenis hebben (PL-CORE-007). Vermijd afkortingen zoals `usr` of `cfg`.
- Gebruik `snake_case` alleen voor bestandsnamen.

### PL-DART-009. `_` Marks Library-Privé Namen

Voorvoeg namen met `_` alleen als ze verborgen moeten blijven voor andere bibliotheken. Gebruik `_` niet als vervanging voor documentatie.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Houd het publiek oppervlak klein zodat het contract van de bibliotheek duidelijk blijft.

### PL-DART-010. Kleine klassen met één verantwoordelijkheid

Houd klassen gericht op één samenhangende verantwoordelijkheid. Splits een klasse als het niet-gerelateerde problemen mengt, niet als het een willekeurige lijntelling passeert (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Liever compositie van kleine klassen dan erfgoed octerarchies.

### PL-DART-011. Map Density

Een Dart bronmap onder `lib/` kan maximaal **10 hand-onderhoud bronbestanden** bevatten standaard.

Gegenereerde bestanden, `part`-bestanden, vatbestanden zoals `lib/feature.dart`, en tests tellen niet mee. Een splitsing moet een echte grens volgen:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Zie [structuur](../core/structure.md) voor de regels voor gedeelde grootte (PL-CORE-021).

### PL-DART-012. Gereedschap: `dart format` en `dart analyze` met `lints`

Formatteer en analyseer elk pakket voordat u het bekijkt. Schakel het `lints`-pakket in `analysis_options.yaml` in.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Behandel de waarschuwingen van de analyser als fouten in de CI.
- Niet uitschakelen van de lokale..Sus zonder een opmerking die de uitzondering verklaart.
