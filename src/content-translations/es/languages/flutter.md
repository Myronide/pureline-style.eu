# Estilo de código Flutter

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. El perfil de Flutter está pensado para **Dart 3 con Flutter 3.x** y null safety sólida. Por debajo se aplican las reglas del lenguaje Dart: `final` por defecto, y tipos sellados cuando modelan un conjunto cerrado de estados. Un widget es una función de su configuración y su estado: entra la configuración, después las guardas y los valores derivados, y sale el árbol de widgets.

## Perfil de Flutter {#flutter-profile}

### PL-FLUT-001 — Los métodos build son pequeños y no tienen efectos secundarios {#pl-flut-001--build-methods-are-small-and-free-of-side-effects}

`build` calcula un árbol de widgets a partir de sus entradas y nada más. No inicia peticiones, no escribe en el almacenamiento, no navega ni muta campos. Cuando el árbol crece más allá de una pantalla de anidamiento, extrae un bloque ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Los efectos secundarios pertenecen a los manejadores de eventos y a la capa de estado ([estado y efectos secundarios](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Extrae los widgets que crecen en clases const {#pl-flut-002--extract-growing-widgets-into-const-classes}

Extrae un bloque a su propio `StatelessWidget` cuando tenga su propio nombre, sus propios datos o su propio estado. No extraigas métodos auxiliares que devuelvan widgets: no pueden ser `const` y ocultan a Flutter el límite del widget.

```dart
class SessionHeader extends StatelessWidget {
  const SessionHeader({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Text(title, style: Theme.of(context).textTheme.titleLarge),
    );
  }
}
```

### PL-FLUT-003 — Constructores const siempre que sea posible {#pl-flut-003--const-constructors-wherever-possible}

Marca los constructores como `const` cuando todos los campos sean final, y escribe `const` en cada punto de llamada cuyo valor sea constante en tiempo de compilación.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Un único enfoque de gestión de estado por aplicación {#pl-flut-004--one-state-management-approach-per-app}

Elige un enfoque para toda la aplicación y nómbralo en el README del proyecto: Riverpod, o `ChangeNotifier` con `provider` para aplicaciones más pequeñas. Úsalo de forma coherente. `setState` está bien para el estado de interfaz puramente local, como un interruptor o un indicador de expandido. El estado de negocio vive en providers o notifiers, no en los widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Sin llamadas de red ni de almacenamiento dentro de build {#pl-flut-005--no-network-or-storage-calls-inside-build}

`build` se ejecuta en cada reconstrucción, por lo que una petición colocada ahí se repite de forma impredecible. Carga los datos en la capa de estado; los widgets renderizan el resultado.

### PL-FLUT-006 — Guard clauses antes del árbol principal {#pl-flut-006--guard-clauses-before-the-main-tree}

Trata primero los estados de carga, de error y de vacío y retorna pronto. El layout correcto se queda en la sangría base.

```dart
@override
Widget build(BuildContext context) {
  final error = state.error;
  if (state.isLoading) {
    return const LoadingView();
  }
  if (error != null) {
    return ErrorView(message: error);
  }
  return ProfileDetails(user: state.user);
}
```

Evita los condicionales anidados en los árboles de widgets.

### PL-FLUT-007 — Keys solo donde importa la identidad de la lista {#pl-flut-007--keys-only-where-list-identity-matters}

Asigna una key solo cuando la identidad de un widget deba sobrevivir a un reordenamiento o a una eliminación, como los elementos de lista con estado o un `Dismissible`. Usa un identificador estable procedente de los datos, nunca el índice de la lista.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — Un BuildContext tras un await necesita una comprobación de mounted {#pl-flut-008--buildcontext-after-await-needs-a-mounted-check}

Un `BuildContext` puede pertenecer a un widget que se eliminó mientras había un `await` pendiente. Comprueba que sigue montado antes de usarlo después de un `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Dentro de una subclase de `State`, comprueba `mounted` en su lugar.

### PL-FLUT-009 — Carpetas por funcionalidad y densidad de carpetas {#pl-flut-009--feature-folders-and-folder-density}

Agrupa los widgets, los providers y los tests por funcionalidad (`lib/features/sessions/`), no por tipo de archivo en toda la aplicación. Una carpeta contiene como máximo **10 archivos fuente mantenidos a mano** por defecto. Es un umbral de revisión: divide según las responsabilidades, no en carpetas anidadas sin sentido ([estructura](../core/structure.md)).

### PL-FLUT-010 — Las herramientas controlan cada cambio {#pl-flut-010--tooling-gates-every-change}

Todo cambio pasa por el formateador y los analizadores antes de la revisión:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` resuelve el layout, así que los debates sobre formato nunca llegan a la revisión. Las advertencias no son opcionales: una regla de lint desactivada necesita un motivo en `analysis_options.yaml`.
