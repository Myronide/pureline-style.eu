# Dart Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Dart {#dart-profile}

Punktem wyjścia jest Dart 3 z solidną null safety. Wszystkie przykłady zakładają składnię Dart 3.

### PL-DART-001 — Domyślnie `final` i `const` {#pl-dart-001--final-and-const-by-default}

Zmienne lokalne i pola deklaruj jako `final`, chyba że są przypisywane ponownie. Dla wartości czasu kompilacji używaj `const`.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Unikaj `var`, gdy wartość nigdy nie jest przypisywana ponownie.
- Dla widżetów, obiektów wartości i konfiguracji preferuj konstruktory `const`.

### PL-DART-002 — Solidna null safety bez `!` {#pl-dart-002--sound-null-safety-without}

Nullowalność wyrażaj jawnie w typach. `null` obsługuj za pomocą `?.` i `??`, gdy wyrażenie jest proste.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Unikaj operatora `!`. Używaj go tylko z komentarzem wyjaśniającym, dlaczego wartość nie może być null.
- Preferuj promocję typu przez sprawdzenia zamiast `!`.

### PL-DART-003 — Parametry nazwane z `required` w publicznym API {#pl-dart-003--named-parameters-with-required-for-public-api}

Publiczne konstruktory i funkcje przyjmują parametry nazwane. Obowiązkowe oznacz jako `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Argumenty nazwane czynią miejsca wywołań jawnymi (PL-CORE-007).
- Parametrów pozycyjnych używaj tylko w oczywistych pomocnikach z jedną wartością.

### PL-DART-004 — Kod asynchroniczny używa `Future` i `Stream` zgodnie z przeznaczeniem {#pl-dart-004--async-code-uses-future-and-stream-for-their-purpose}

`Future` stosuj dla jednego wyniku, a `Stream` dla sekwencji zdarzeń. Używaj `async` i `await` zamiast łańcuchów `.then`.

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

- Nie opakowuj pojedynczej wartości w `Stream` i nie wciskaj źródła wielu zdarzeń w `Future`.
- Efekty uboczne utrzymuj widoczne w miejscu wywołania (PL-CORE-015).

### PL-DART-005 — Unikaj `dynamic` {#pl-dart-005--avoid-dynamic}

Dla nieznanych danych używaj konkretnych typów, generyków lub `Object?`. Nieznane dane zawężaj dopasowaniem wzorców przed użyciem.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- `dynamic` traktuj jako wyjątek, który trzeba uzasadnić na granicy.

### PL-DART-006 — Guard clauses z wczesnym zwrotem {#pl-dart-006--guard-clauses-with-early-return}

Najpierw sprawdzaj stany niepoprawne i brakujące, i wracaj. Główną ścieżkę trzymaj bez wcięć (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Regułę wspólną znajdziesz w [przepływie sterowania](../core/control-flow.md).
- Unikaj `else` po gałęzi kończącej się return (PL-CORE-002).

### PL-DART-007 — Klasy sealed i wyrażenia switch dla stanu {#pl-dart-007--sealed-classes-and-switch-expressions-for-state}

Zamknięte zbiory stanów modeluj jako klasy `sealed`. Obsługuj je wyczerpującym wyrażeniem `switch`.

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

- Preferuj to zamiast flag logicznych lub stanów tekstowych.
- Kompilator wymusza obsłużenie każdego stanu.

### PL-DART-008 — Nazewnictwo {#pl-dart-008--naming}

Dla składowych, zmiennych, parametrów i stałych używaj `lowerCamelCase`. Dla typów, klas, enumów i rozszerzeń używaj `UpperCamelCase`.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Nazwy muszą nieść znaczenie (PL-CORE-007). Unikaj skrótów takich jak `usr` czy `cfg`.
- `snake_case` stosuj wyłącznie dla nazw plików.

### PL-DART-009 — `_` oznacza nazwy prywatne dla biblioteki {#pl-dart-009---marks-library-private-names}

Przed nazwami dodawaj `_` tylko wtedy, gdy muszą pozostać ukryte przed innymi bibliotekami. Nie używaj `_` jako zamiennika dokumentacji.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Utrzymuj małą powierzchnię publiczną, aby kontrakt biblioteki pozostał jasny.

### PL-DART-010 — Małe klasy z jedną odpowiedzialnością {#pl-dart-010--small-classes-with-one-responsibility}

Klasy utrzymuj skupione na jednej spójnej odpowiedzialności. Dziel klasę, gdy miesza niepowiązane zagadnienia, a nie wtedy, gdy przekroczy dowolną liczbę linii (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Preferuj kompozycję małych klas zamiast hierarchii dziedziczenia.

### PL-DART-011 — Gęstość folderów {#pl-dart-011--folder-density}

Folder źródłowy Dart w `lib/` może domyślnie zawierać co najwyżej **10 ręcznie utrzymywanych plików źródłowych**.

Pliki generowane, pliki `part`, pliki barrel takie jak `lib/feature.dart` oraz testy nie są wliczane. Podział powinien odpowiadać rzeczywistej granicy:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Wspólne reguły dotyczące rozmiaru znajdziesz w [strukturze](../core/structure.md) (PL-CORE-021).

### PL-DART-012 — Narzędzia: `dart format` i `dart analyze` z `lints` {#pl-dart-012--tooling-dart-format-and-dart-analyze-with-lints}

Przed przeglądem formatuj i analizuj każdy pakiet. Włącz pakiet `lints` w `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Ostrzeżenia analizatora traktuj w CI jako błędy.
- Nie wyłączaj lintów lokalnie bez komentarza wyjaśniającego wyjątek.
