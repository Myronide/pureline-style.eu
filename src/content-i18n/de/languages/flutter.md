# Codestil für den FATter-Code

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Das Profil von Flutter zielt auf **Dart 3 mit dem Flutter 3.x** und Sound null Sicherheit. Die Dart-Sprachenregeln gelten darunter: `final` standardmäßig und versiegelte Typen, bei denen sie einen geschlossenen Satz von Zuständen modellieren. Ein Widget ist eine Funktion seiner Konfiguration und Zustand: Konfiguration in, Wachen, abgeleitete Werte, Widget Baum aus.

## Flözprofil

### PL-FLUT-001 — Build-Methoden sind klein und frei von Nebenwirkungen

`build` berechnet einen Widget-Baum aus seinen Eingängen und nichts anderes. Es startet keine Anfragen, schreibt Speicher, navigiert oder mutiert Felder. Wenn der Baum an einem Nester-Bildschirm vorbeiwächst, entnimmt er einen Block ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Nebenwirkungen gehören bei Ereignishandlern und der Zustandslage ([Zustand und Nebenwirkungen](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Ausziehen von Wuchs-Widgets in Const-Klassen

Extrahieren Sie einen Block in sein eigenes `StatelessWidget`, wenn es seinen eigenen Namen, Daten oder Zustand hat. Entpacken Sie keine Hilfsmethoden, die Widgets zurückgeben: they cannot be `const` and hide the widget boundary from Flutter.

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

Choose one approach for the whole app and name it in the project README: Riverpod, or `ChangeNotifier` with `provider` for smaller apps. Use it consistently. `setState` is fine for purely local UI state, such as a toggle or an expanded flag. Der Wirtschaftsstaat lebt in Anbietern oder Notifikatoren, nicht in Widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Kein Netzwerk oder Speicher ruft innerhalb der Baugruppe auf

`build` läuft bei jedem Umbau, so dass eine dort platzierte Anfrage unvorhersehbar wiederholt. Daten in der Zustandsschicht laden; Widgets machen das Ergebnis.

### PL-FLUT-006 — Wachklauseln vor dem Hauptbaum

Behandeln Sie zuerst Lade-, Fehler- und Leerzustände und kehren Sie frühzeitig zurück. Das gelungene Layout bleibt bei der Basiseinrückung.

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

Vermeiden Sie verschachtelte Bedingungen in Widget-Bäumen..

Verwenden Sie eine Sammlung `if`, wenn nur ein Kind bedingt ist und der Rest der
die Liste wird freigegeben.

```text
− Two child lists                            │ ✓ Pureline
return Column(                               │ return Column(
  children: showDetails                      │   children: [
      ? [const TitleBar(), const Details()]  │     const TitleBar(),
      : [const TitleBar()],                  │     if (showDetails) const Details(),
);                                           │   ],
                                             │ );
```

### PL-FLUT-007 — nur Schlüssel, bei denen Identitätsfragen aufgelistet werden

Geben Sie einen Schlüssel nur, wenn die Identität eines Widgets überleben muss, um zu bestellen oder zu entfernen, wie Stateful Listeneinträge oder ein `Dismissible`. Verwenden Sie einen stabilen Identifier aus den Daten, nie den Listenindex.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext Nachher wartet man auf einen montierten Check

Ein `BuildContext` kann zu einem entfernten Widget gehören, während ein `await` aussteht. Prüfen Sie, ob es noch vor der Verwendung nach einem `await` montiert ist.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

In einer `State`-Unterklasse überprüfen Sie stattdessen `mounted`.

### PL-FLUT-009 — Feature Ordner und Ordnerdichte

Gruppen-Widgets, Provider und Tests nach Feature (`lib/features/sessions/`), nicht nach Dateiart in der App. Ein Ordner enthält standardmäßig höchstens **10 handgepflegete Quelldateien**. Dies ist ein Überprüfungsschwellenwert: Aufgeteilt entlang der Verantwortlichkeiten, nicht in bedeutungslose verschachtelte Ordner ([Struktur](../core/structure.md)).

### PL-FLUT-010 — Toren jeder Veränderung werkzeugen

Jede Änderung passiert die Formmaterie und die Analysegeräte vor der Überprüfung:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` legt Layout ab, so dass Formatierungsdebatten nie Überprüfung erreichen. Warnungen sind nicht optional: Eine deaktivierte Flöze-Regel braucht einen Grund in `analysis_options.yaml`.
