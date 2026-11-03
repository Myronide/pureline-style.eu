# Estilo de código Dart

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Dart {#dart-profile}

La base es Dart 3 con null safety sólida. Todos los ejemplos asumen la sintaxis de Dart 3.

### PL-DART-001 — `final` y `const` por defecto {#pl-dart-001--final-and-const-by-default}

Declara las variables locales y los campos como `final` salvo que se reasignen. Usa `const` para los valores conocidos en tiempo de compilación.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Evita `var` cuando el valor no se reasigna nunca.
- Prefiere los constructores `const` para los widgets, los objetos de valor y la configuración.

### PL-DART-002 — Null safety sólida sin `!` {#pl-dart-002--sound-null-safety-without}

Haz explícita la nulabilidad en los tipos. Trata `null` con `?.` y `??` cuando la expresión sea simple.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Evita el operador `!`. Úsalo solo con un comentario que explique por qué el valor no puede ser nulo.
- Prefiere la promoción de tipos mediante comprobaciones a `!`.

### PL-DART-003 — Parámetros con nombre y `required` en la API pública {#pl-dart-003--named-parameters-with-required-for-public-api}

Los constructores y las funciones públicos toman parámetros con nombre. Marca los obligatorios como `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Los argumentos con nombre hacen explícitos los puntos de llamada (PL-CORE-007).
- Usa parámetros posicionales solo para auxiliares evidentes de un único valor.

### PL-DART-004 — El código asíncrono usa `Future` y `Stream` según su propósito {#pl-dart-004--async-code-uses-future-and-stream-for-their-purpose}

Usa `Future` para un único resultado y `Stream` para una secuencia de eventos. Usa `async` y `await` en lugar de `.then` encadenados.

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

- No envuelvas un único valor en un `Stream` ni fuerces una fuente de varios eventos dentro de un `Future`.
- Mantén visibles los efectos secundarios en el punto de llamada (PL-CORE-015).

### PL-DART-005 — Evita `dynamic` {#pl-dart-005--avoid-dynamic}

Usa tipos concretos, genéricos u `Object?` para los datos desconocidos. Estrecha los datos desconocidos con pattern matching antes de usarlos.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Trata `dynamic` como una excepción que debe justificarse en el límite.

### PL-DART-006 — Guard clauses con retorno temprano {#pl-dart-006--guard-clauses-with-early-return}

Comprueba primero los estados inválidos y ausentes y retorna. Mantén el camino principal sin sangrar (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Consulta el [flujo de control](../core/control-flow.md) para la regla compartida.
- Evita `else` después de una rama que retorna (PL-CORE-002).

### PL-DART-007 — Clases selladas y expresiones switch para el estado {#pl-dart-007--sealed-classes-and-switch-expressions-for-state}

Modela los conjuntos cerrados de estados como clases `sealed`. Trátalos con una expresión `switch` exhaustiva.

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

- Prefiérelo a las banderas booleanas o a los estados en forma de cadena.
- El compilador garantiza que se trate cada estado.

### PL-DART-008 — Nombres {#pl-dart-008--naming}

Usa `lowerCamelCase` para los miembros, las variables, los parámetros y las constantes. Usa `UpperCamelCase` para los tipos, las clases, los enums y las extensiones.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Los nombres deben tener significado (PL-CORE-007). Evita las abreviaturas como `usr` o `cfg`.
- Usa `snake_case` solo para los nombres de archivo.

### PL-DART-009 — `_` marca los nombres privados de la biblioteca {#pl-dart-009---marks-library-private-names}

Antepón `_` a los nombres solo cuando deban permanecer ocultos para otras bibliotecas. No uses `_` como sustituto de la documentación.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Mantén pequeña la superficie pública para que el contrato de la biblioteca siga siendo claro.

### PL-DART-010 — Clases pequeñas con una única responsabilidad {#pl-dart-010--small-classes-with-one-responsibility}

Mantén las clases centradas en una responsabilidad coherente. Divide una clase cuando mezcle ámbitos sin relación, no cuando supere un número arbitrario de líneas (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Prefiere la composición de clases pequeñas a las jerarquías de herencia.

### PL-DART-011 — Densidad de carpetas {#pl-dart-011--folder-density}

Una carpeta de código fuente de Dart dentro de `lib/` puede contener como máximo **10 archivos fuente mantenidos a mano** por defecto.

Los archivos generados, los archivos `part`, los archivos barrel como `lib/feature.dart` y los tests no cuentan. Una división debe seguir un límite real:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Consulta la [estructura](../core/structure.md) para las reglas de tamaño compartidas (PL-CORE-021).

### PL-DART-012 — Herramientas: `dart format` y `dart analyze` con `lints` {#pl-dart-012--tooling-dart-format-and-dart-analyze-with-lints}

Da formato y analiza cada paquete antes de la revisión. Activa el paquete `lints` en `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Trata las advertencias del analizador como fallos en la CI.
- No desactives lints localmente sin un comentario que explique la excepción.
