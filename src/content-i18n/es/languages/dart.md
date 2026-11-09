# Estilo de código Dart

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de dardo

Dardo 3 con seguridad de sonido nulo es la línea de base. Todos los ejemplos asumen la sintaxis Dart 3.

### PL-DART-001 — `final` y `const` por defecto

Declarar locales y campos como `final` a menos que se reasignen. Utilice `const` para compilar valores de tiempo.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Evite `var` cuando el valor nunca se reasigna.
- Prefiere las grecas `const` para widgets, objetos de valor y configuración.

### PL-DART-002 — Seguridad de sonido nula sin `!`

Hacer la nulidad explícita en los tipos. Maneje `null` con `?.` y `??` cuando la expresión es simple.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Evite el operador `!`. Úselo sólo con un comentario que indique por qué el valor no puede ser nulo.
- Prefieren la promoción a través de cheques sobre `!`.

### PL-DART-003 — Parámetros designados con `required` para API pública

Las funciones y los vulcanismos públicos toman parámetros nombrados. Marcar las `required` obligatorias.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Los argumentos nombrados hacen explícitos los sitios de llamadas (PL-CORE-007).
- Utilice parámetros posicionales sólo para ayudantes obvios de un solo valor.

Los parámetros designados distinguen los argumentos del mismo tipo en el sitio de llamada.

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

### PL-DART-004 — Código ASYnc utiliza `Future` y `Stream` para su propósito

Utilice `Future` para un resultado y `Stream` para una secuencia de eventos. Use `async` y `await` en lugar de `.then` encadenado.

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

- No envuelva un solo valor en un `Stream`, y no obligue a una fuente de eventos múltiples a un `Future`.
- Mantener los efectos secundarios visibles en el lugar de la llamada (PL-CORE-015).

### PL-DART-005 — Evitar `dynamic`

Use tipos de hormigón, genéricos o `Object?` para datos desconocidos. Reduzca los datos desconocidos con el patrón que coincide antes de su uso.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Tratar `dynamic` como una excepción que debe ser justificada en el límite.

### PL-DART-006 — Cláusulas de protección con retorno temprano

Compruebe primero los estados inválidos y ausentes y regrese. Mantenga la ruta principal sin identificar (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- Véase [flujo de control](../core/control-flow.md) para la regla compartida.
- Evite `else` después de una rama de retorno (PL-CORE-002).

### PL-DART-007 — Clases selladas y expresiones de cambio para el Estado

Modelo conjuntos cerrados de estados como clases `sealed`. Manejalos con una exhaustiva expresión `switch`.

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

- Prefiere esto sobre banderas booleanas o estados de cuerda.
- El compilador hace que se haga cumplir que cada estado está manejado.

### PL-DART-008 — Denominación

Utilice `lowerCamelCase` para miembros, variables, parámetros y constantes. Utilice `UpperCamelCase` para tipos, clases, enums y extensiones.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Los nombres deben tener significado (PL-CORE-007). Evite abreviaturas como `usr` o `cfg`.
- Utilice `snake_case` sólo para nombres de archivo.

### PL-DART-009 — `_` Marcas Biblioteca-Nombres privados

Prefija nombres con `_` sólo cuando deben permanecer ocultos de otras bibliotecas. No utilice `_` como sustituto de la documentación.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Mantenga la superficie pública pequeña para que el contrato de la biblioteca se mantenga despejado.

### PL-DART-010: clases pequeñas con una sola responsabilidad

Mantenga las clases centradas en una responsabilidad coherente. Dividir una clase cuando mezcla preocupaciones no relacionadas, no cuando pasa un recuento de líneas arbitrarias (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Prefieren la composición de clases pequeñas sobre jerarquías de herencia.

### PL-DART-011 — Densidad de la carpeta

Una carpeta fuente Dart bajo `lib/` puede contener como máximo archivos fuente **10 mantenidos a mano** por defecto.

Los archivos generados, los archivos `part`, los archivos de barril como `lib/feature.dart` y las pruebas no cuentan. Una división debe seguir un límite real:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- Véase [estructura](../core/structure.md) para las reglas de tamaño compartido (PL-CORE-021).

### PL-DART-012 — Herramientas: `dart format` y `dart analyze` con `lints`

Formatee y analice cada paquete antes de revisarlo. Active el paquete `lints` en `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Tratar las advertencias del analizador como fallas en IC.
- No deshabilite las pelusas localmente sin un comentario que explique la excepción.
