# Flutter Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Das Flutter-Profil zielt auf **Dart 3 mit Flutter 3.x** und Sound Null Safety. Darunter gelten die Sprachregeln für Dart: standardmäßig `final` und Sealed Types dort, wo sie eine geschlossene Menge von Zuständen modellieren. Ein Widget ist eine Funktion seiner Konfiguration und seines Zustands: Konfiguration hinein, Guards, abgeleitete Werte, Widget-Baum heraus.

## Flutter-Profil {#flutter-profile}

### PL-FLUT-001 — Build-Methoden sind klein und frei von Seiteneffekten {#pl-flut-001--build-methods-are-small-and-free-of-side-effects}

`build` berechnet aus seinen Eingaben einen Widget-Baum und sonst nichts. Es startet keine Anfragen, schreibt keinen Speicher, navigiert nicht und verändert keine Felder. Wächst der Baum über eine Bildschirmseite Verschachtelung hinaus, extrahiere einen Block ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Seiteneffekte gehören in Event-Handler und die State-Schicht ([Zustand und Seiteneffekte](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Wachsende Widgets in const-Klassen extrahieren {#pl-flut-002--extract-growing-widgets-into-const-classes}

Extrahiere einen Block in ein eigenes `StatelessWidget`, wenn er einen eigenen Namen, eigene Daten oder einen eigenen Zustand hat. Extrahiere keine Hilfsmethoden, die Widgets zurückgeben: Sie können nicht `const` sein und verbergen die Widget-Grenze vor Flutter.

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

### PL-FLUT-003 — Const-Konstruktoren, wo immer möglich {#pl-flut-003--const-constructors-wherever-possible}

Markiere Konstruktoren als `const`, wenn alle Felder final sind, und schreibe `const` an jeder Aufrufstelle, deren Wert zur Compile-Zeit konstant ist.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Ein Ansatz für State-Management pro App {#pl-flut-004--one-state-management-approach-per-app}

Wähle einen Ansatz für die ganze App und nenne ihn in der README des Projekts: Riverpod oder bei kleineren Apps `ChangeNotifier` mit `provider`. Verwende ihn konsequent. `setState` ist in Ordnung für rein lokalen UI-Zustand, etwa einen Schalter oder ein Aufgeklappt-Flag. Geschäftszustand liegt in Providern oder Notifiern, nicht in Widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Keine Netzwerk- oder Speicheraufrufe in Build {#pl-flut-005--no-network-or-storage-calls-inside-build}

`build` läuft bei jedem Rebuild, daher wiederholt sich eine dort platzierte Anfrage unvorhersehbar. Lade Daten in der State-Schicht; Widgets rendern das Ergebnis.

### PL-FLUT-006 — Guard Clauses vor dem Hauptbaum {#pl-flut-006--guard-clauses-before-the-main-tree}

Behandle Lade-, Fehler- und Leerzustände zuerst und kehre früh zurück. Das erfolgreiche Layout bleibt auf der Basis-Einrückung.

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
``` Vermeide verschachtelte Bedingungen in Widget-Bäumen.

### PL-FLUT-007 — Keys nur dort, wo die Identität in Listen zählt {#pl-flut-007--keys-only-where-list-identity-matters}

Vergib einen Key nur, wenn die Identität eines Widgets Umsortierung oder Entfernen überstehen muss, etwa bei zustandsbehafteten Listenelementen oder einem `Dismissible`. Verwende einen stabilen Bezeichner aus den Daten, niemals den Listenindex.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext nach await braucht eine mounted-Prüfung {#pl-flut-008--buildcontext-after-await-needs-a-mounted-check}

Ein `BuildContext` kann zu einem Widget gehören, das entfernt wurde, während ein `await` ausstand. Prüfe nach einem `await`, ob er noch gemountet ist, bevor du ihn verwendest.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Prüfe innerhalb einer `State`-Unterklasse stattdessen `mounted`.

### PL-FLUT-009 — Feature-Ordner und Ordnerdichte {#pl-flut-009--feature-folders-and-folder-density}

Gruppiere Widgets, Provider und Tests nach Feature (`lib/features/sessions/`) und nicht nach Dateiart über die ganze App hinweg. Ein Ordner enthält standardmäßig höchstens **10 von Hand gepflegte Quelldateien**. Das ist eine Review-Schwelle: Teile entlang von Verantwortlichkeiten auf, nicht in sinnlos verschachtelte Ordner ([Struktur](../core/structure.md)).

### PL-FLUT-010 — Tooling prüft jede Änderung {#pl-flut-010--tooling-gates-every-change}

Jede Änderung durchläuft vor dem Review Formatter und Analyzer:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` legt das Layout fest, sodass Formatierungsdebatten nie im Review landen. Warnungen sind nicht optional: Eine deaktivierte Lint-Regel braucht eine Begründung in der `analysis_options.yaml`.
