# Stile del codice Dart

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Dart {#dart-profile}

La base di partenza è Dart 3 con null safety solida. Tutti gli esempi presuppongono la sintassi di Dart 3.

### PL-DART-001 — `final` e `const` per impostazione predefinita {#pl-dart-001--final-and-const-by-default}

Dichiara variabili locali e campi come `final`, a meno che vengano riassegnati. Usa `const` per i valori noti a tempo di compilazione.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Evita `var` quando il valore non viene mai riassegnato.
- Preferisci i costruttori `const` per widget, value object e configurazione.

### PL-DART-002 — Null safety solida senza `!` {#pl-dart-002--sound-null-safety-without}

Rendi esplicita la nullabilità nei tipi. Gestisci `null` con `?.` e `??` quando l'espressione è semplice.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Evita l'operatore `!`. Usalo solo con un commento che spieghi perché il valore non può essere null.
- Preferisci la promozione tramite controlli a `!`.

### PL-DART-003 — Parametri con nome e `required` per l'API pubblica {#pl-dart-003--named-parameters-with-required-for-public-api}

I costruttori e le funzioni pubbliche prendono parametri con nome. Contrassegna con `required` quelli obbligatori.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Gli argomenti con nome rendono espliciti i punti di chiamata (PL-CORE-007).
- Usa i parametri posizionali solo per funzioni di supporto ovvie, con un solo valore.

### PL-DART-004 — Il codice asincrono usa `Future` e `Stream` per il loro scopo {#pl-dart-004--async-code-uses-future-and-stream-for-their-purpose}

Usa `Future` per un singolo risultato e `Stream` per una sequenza di eventi. Usa `async` e `await` invece di `.then` concatenati.

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

- Non avvolgere un singolo valore in uno `Stream` e non forzare in un `Future` una fonte con più eventi.
- Mantieni visibili gli effetti collaterali nel punto della chiamata (PL-CORE-015).

### PL-DART-005 — Evitare `dynamic` {#pl-dart-005--avoid-dynamic}

Usa tipi concreti, generics oppure `Object?` per i dati sconosciuti. Restringi i dati sconosciuti con il pattern matching prima di usarli.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Tratta `dynamic` come un'eccezione che va giustificata al confine.

### PL-DART-006 — Guard clause con ritorno anticipato {#pl-dart-006--guard-clauses-with-early-return}

Controlla per primi gli stati non validi e assenti e ritorna. Mantieni il percorso principale senza indentazione (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Per la regola condivisa vedi il [controllo di flusso](../core/control-flow.md).
- Evita `else` dopo un ramo che ritorna (PL-CORE-002).

### PL-DART-007 — Sealed class ed espressioni switch per lo stato {#pl-dart-007--sealed-classes-and-switch-expressions-for-state}

Modella gli insiemi chiusi di stati come classi `sealed`. Gestiscili con un'espressione `switch` esaustiva.

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

- Preferiscilo ai flag booleani o agli stati come stringhe.
- Il compilatore verifica che ogni stato sia gestito.

### PL-DART-008 — Nomi {#pl-dart-008--naming}

Usa `lowerCamelCase` per membri, variabili, parametri e costanti. Usa `UpperCamelCase` per tipi, classi, enum ed extension.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- I nomi devono portare significato (PL-CORE-007). Evita abbreviazioni come `usr` o `cfg`.
- Usa `snake_case` solo per i nomi dei file.

### PL-DART-009 — `_` contrassegna i nomi privati della libreria {#pl-dart-009---marks-library-private-names}

Anteponi `_` ai nomi solo quando devono restare nascosti alle altre librerie. Non usare `_` come sostituto della documentazione.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Mantieni piccola la superficie pubblica, così il contratto della libreria resta chiaro.

### PL-DART-010 — Classi piccole con una sola responsabilità {#pl-dart-010--small-classes-with-one-responsibility}

Mantieni le classi concentrate su una responsabilità coerente. Dividi una classe quando mescola questioni non correlate, non quando supera un numero arbitrario di righe (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Preferisci la composizione di piccole classi alle gerarchie di ereditarietà.

### PL-DART-011 — Densità delle cartelle {#pl-dart-011--folder-density}

Una cartella sorgente Dart sotto `lib/` può contenere al massimo **10 file sorgente mantenuti a mano** per impostazione predefinita.

File generati, file `part`, barrel file come `lib/feature.dart` e test non contano. Una divisione dovrebbe seguire un confine reale:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Per le regole condivise sulle dimensioni vedi la [struttura](../core/structure.md) (PL-CORE-021).

### PL-DART-012 — Strumenti: `dart format` e `dart analyze` con `lints` {#pl-dart-012--tooling-dart-format-and-dart-analyze-with-lints}

Formatta e analizza ogni pacchetto prima della revisione. Abilita il pacchetto `lints` in `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Tratta gli avvisi dell'analyzer come fallimenti nella CI.
- Non disabilitare i lint in locale senza un commento che spieghi l'eccezione.
