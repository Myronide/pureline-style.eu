# Flutter Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. The Flutter profile targets **Dart 3 with Flutter 3.x** and sound null safety. The Dart language rules apply underneath: `final` by default, and sealed types where they model a closed set of states. A widget is a function of its configuration and state: configuration in, guards, derived values, widget tree out.

## Flutter Profile

### PL-FLUT-001 — Build Methods Are Small and Free of Side Effects

`build` computes a widget tree from its inputs and nothing else. It does not start requests, write storage, navigate, or mutate fields. When the tree grows past one screen of nesting, extract a block ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Side effects belong in event handlers and the state layer ([state and side effects](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Extract Growing Widgets into Const Classes

Extract a block into its own `StatelessWidget` when it has its own name, data, or state. Do not extract helper methods that return widgets: they cannot be `const` and hide the widget boundary from Flutter.

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

### PL-FLUT-003 — Const Constructors Wherever Possible

Mark constructors `const` when all fields are final, and write `const` at every call site whose value is compile-time constant.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — One State Management Approach per App

Choose one approach for the whole app and name it in the project README: Riverpod, or `ChangeNotifier` with `provider` for smaller apps. Use it consistently. `setState` is fine for purely local UI state, such as a toggle or an expanded flag. Business state lives in providers or notifiers, not in widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — No Network or Storage Calls Inside Build

`build` runs on every rebuild, so a request placed there repeats unpredictably. Load data in the state layer; widgets render the result.

### PL-FLUT-006 — Guard Clauses Before the Main Tree

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

### PL-FLUT-007 — Keys Only Where List Identity Matters

Give a key only when a widget's identity must survive reordering or removal, such as stateful list items or a `Dismissible`. Use a stable identifier from the data, never the list index.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext After await Needs a Mounted Check

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

### PL-FLUT-009 — Feature Folders and Folder Density

Group widgets, providers, and tests by feature (`lib/features/sessions/`), not by file kind across the app. A folder holds at most **10 hand-maintained source files** by default. This is a review threshold: split along responsibilities, not into meaningless nested folders ([structure](../core/structure.md)).

### PL-FLUT-010 — Tooling Gates Every Change

Every change passes the formatter and analyzers before review:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` settles layout, so formatting debates never reach review. Warnings are not optional: a disabled lint rule needs a reason in `analysis_options.yaml`.
