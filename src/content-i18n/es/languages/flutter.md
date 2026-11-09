# Estilo de código de flutter

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. El perfil Flutter está dirigido a **Dart 3 con Flutter 3.x** y seguridad de sonido nulo. Las reglas del idioma Dart se aplican debajo: `final` por defecto, y los tipos sellados donde modelan un conjunto cerrado de estados. Un widget es una función de su configuración y estado: configuración, guardas, valores derivados, árbol de widget hacia fuera.

## Perfil de flutter

### PL-FLUT-001 — Los métodos de construcción son pequeños y no tienen efectos secundarios

`build` calcula un árbol de widgets desde sus entradas y nada más. No inicia peticiones, escribe almacenamiento, navega ni campos de navegación. Cuando el árbol crezca más allá de una pantalla de anidación, extraiga un bloque ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)]. Los efectos secundarios pertenecen a los manipuladores de eventos y a la capa de estado ([estado y efectos secundarios](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Extraer Widgets de crecimiento en clases de const

Extraiga un bloque en su propio `StatelessWidget` cuando tenga su propio nombre, datos o estado. No extraiga métodos de ayuda que devuelven los widgets: no pueden ser `const` y ocultar el límite del widget de Flutter.

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

### PL-FLUT-003 — Constructores de const cuando sea posible

Mark constructors `const` when all fields are final, and write `const` at every call site whose value is compile-time constant.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Enfoque de gestión estatal por aplicación

Elija un enfoque para toda la aplicación y nombre en el proyecto README: Riverpod, o `ChangeNotifier` con `provider` para aplicaciones más pequeñas. Úsalo consistentemente. `setState` está bien para el estado puramente local de la UI, como un cambio de marcha o una bandera expandida. El estado de negocios vive en proveedores o notificantes, no en widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Sin llamadas de red o almacenamiento dentro de la construcción

`build` se ejecuta en cada reconstrucción, por lo que una solicitud colocada allí se repite de forma impredecible. Cargar datos en la capa de estado; los widgets representan el resultado.

### PL-FLUT-006 — Guarda las cláusulas antes del árbol principal

Maneje primero los estados de carga, error y vacío y regrese temprano. El diseño exitoso permanece en la sangría de la base.

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

Evite los condicionales anidados en los árboles widgets.

Utilice una colección `if` cuando sólo un niño es condicional y el resto de
la lista es compartida.

```text
− Two child lists                            │ ✓ Pureline
return Column(                               │ return Column(
  children: showDetails                      │   children: [
      ? [const TitleBar(), const Details()]  │     const TitleBar(),
      : [const TitleBar()],                  │     if (showDetails) const Details(),
);                                           │   ],
                                             │ );
```

### PL-FLUT-007 — Solo claves donde se menciona la identidad

Dar una clave sólo cuando la identidad de un widget debe sobrevivir a reordenar o eliminar, como elementos de lista de estado o un `Dismissible`. Usar un identificador estable de los datos, nunca el índice de lista.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext Después de esperar Necesita un cheque montado

Un `BuildContext` puede pertenecer a un widget eliminado mientras un `await` estaba pendiente. Compruebe que todavía está montado antes de usarlo después de un `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Dentro de una subclase `State`, compruebe `mounted` en su lugar.

### PL-FLUT-009 — Carpetas de características y densidad de carpeta

Agrupar widgets, proveedores y pruebas por función (`lib/features/sessions/`), no por tipo de archivo en la aplicación. Una carpeta contiene como máximo archivos fuente **10 mantenidos a mano** por defecto. Se trata de un umbral de revisión: dividir a lo largo de las responsabilidades, no en carpetas anidadas sin sentido [[estructura](../core/structure.md)].

### PL-FLUT-010 — Puertas de herramientas cada cambio

Cada cambio pasa el formulario y los analizadores antes de revisar:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` establece la disposición, por lo que los debates de formato nunca llegan a la revisión. Las advertencias no son opcionales: una regla de pelusas inhabilitada necesita una razón en `analysis_options.yaml`.
