# Flutter Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. The Flutter profile targets **Dart 3 with Flutter 3.x** and sound null safety. The Dart language rules apply underneath: `final` by default, and sealed types where they model a closed set of states. Un widget è una funzione della sua configurazione e stato: '- configuration in, guards, derived values, widget tree out.

## Flutter Profile

### PL-FLUT-001. I metodi di compilazione sono piccoli e privi di effetti collaterali

`build` calcola un albero di widget dai suoi input e nient'altro. It does not start requests, write storage, navigate, or mutate fields. When the tree grows past one screen of nesting, extract a block ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Side effects belong in event handlers and the state layer ([state and side effects](../core/state-and-side-effects.md)).

### PL-FLUT-002. Estrarre i widget in crescita nelle classi di Const

Extract a block into its own `StatelessWidget` when it has its own name, data, or state. Non estrarre metodi helper che restituiscono widget: they cannot be `const` and hide the widget boundary from Flutter.

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

### PL-FLUT-003. Costruttori di const ovunque possibile

Marca i costruttori `const` quando tutti i campi sono definitivi e scrivi `const` in ogni sito di chiamata il cui valore è costante in tempo di compilazione..

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004. Un approccio di gestione statale per app

Scegliere un approccio per l'intera app e nominarla nel progetto README: Riverpod, o `ChangeNotifier` con `provider` per applicazioni più piccole... Use it consistently. `setState` is fine for purely local UI state, such as a toggle or an expanded flag. Business state lives in providers or notifiers, not in widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — No Network or Storage Calls Inside Build

`build` runs on every rebuild, so a request placed there repeats unpredictably. Load data in the state layer; widgets render the result.

### PL-FLUT-006. Clausole di guardia prima dell'albero principale

Handle loading, error, and empty states first and return early. The successful layout stays at the base indentation.

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

Avoid nested conditionals in widget trees.

Utilizzare una collezione `if` quando un solo bambino è condizionato e il resto ditritritritritritritritritritritritrilotritritritritrilonetrilo
the list is shared.

```text
− Two child lists                            │ ✓ Pureline
return Column(                               │ return Column(
  children: showDetails                      │   children: [
      ? [const TitleBar(), const Details()]  │     const TitleBar(),
      : [const TitleBar()],                  │     if (showDetails) const Details(),
);                                           │   ],
                                             │ );
```

### PL-FLUT-007. Chiavi solo dove l'identità è importante

Dare una chiave solo quando l'identità di un widget deve sopravvivere riordinando o rimuovendo, come elementi di elenco statico o `Dismissible`. Use a stable identifier from the data, never the list index.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008. Costruisci contesto Dopo aver atteso ha bisogno di un controllo montato

A `BuildContext` may belong to a widget removed while an `await` was pending. Check that it is still mounted before using it after an `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Inside a `State` subclass, check `mounted` instead.

### PL-FLUT-009. Cartelle e densità delle cartelle

Group widgets, providers, and tests by feature (`lib/features/sessions/`), not by file kind across the app. A folder holds at most **10 hand-maintained source files** by default. This is a review threshold: split along responsibilities, not into meaningless nested folders ([structure](../core/structure.md)).

### PL-FLUT-010 — Tooling Gates Every Change

Every change passes the formatter and analyzers before review:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` settles layout, so formatting debates never reach review. Warnings are not optional: a disabled lint rule needs a reason in `analysis_options.yaml`.
