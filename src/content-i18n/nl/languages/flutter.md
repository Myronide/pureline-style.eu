# Flotter Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Het Flutterprofiel richt zich op **Dart 3 met Flutter 3.x** en geluid zonder veiligheid. De Dart-taalregels gelden hieronder: `final` standaard, en verzegelde types waar ze model een gesloten set van staten. Een widget is een functie van zijn configuratie en staat: configuratie in, bewakers, afgeleide waarden, widget boom uit.

## Flutter Profile

### PL-FLUT-001. Build methoden zijn klein en vrij van bijwerkingen

`build` berekent een widgetboom van zijn ingangen en niets anders. Het start geen verzoeken, schrijf opslag, navigeren, of muteren velden. Als de boom langs één broedscherm groeit, haal dan een blok ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Bijwerkingen zijn in geval van een gebeurtenis en de statuslaag ([toestand en bijwerkingen](../core/state-and-side-effects.md)).

### PL-FLUT-002. Uitpakken van groeiende widgets in Cont-klassen

Een blok uitpakken in zijn eigen `StatelessWidget` als het zijn eigen naam, gegevens of toestand heeft. Hulpmethoden die widgets teruggeven niet uitpakken: ze kunnen niet `const` zijn en de widgetgrens voor Flutter verbergen.

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

### PL-FLUT-003. Cont Constructors Waar mogelijk

Markeer constructors `const` als alle velden definitief zijn, en schrijf `const` op elke call site waarvan de waarde compileertijd constant is.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004. Eén State Management Approach per App

Kies één aanpak voor de hele app en noem het in het project README: Riverpod, of `ChangeNotifier` met `provider` voor kleinere apps. Use it consistently. `setState` is prima voor een puur lokale UI staat, zoals een toggle of een uitgebreide vlag. De bedrijfsstaat woont in aanbieders of kennisgevers, niet in widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005. Geen netwerk of opslaggesprekken binnen Build

`build` draait op elke herbouw, dus een verzoek dat daar geplaatst wordt herhaalt zich onvoorspelbaar. Laad data in de status laag; widgets maken het resultaat.

### PL-FLUT-006. Wachtclausules voor de hoofdboom

Laadt, fout en leegt de toestand eerst en keert vroeg terug. De succesvolle indeling blijft op de basis inspringen.

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

Vermijd nested voorwaardes in widget bomen.

Gebruik een `if` verzameling als slechts één kind voorwaardelijk is en de rest van deeee
de lijst wordt gedeeld.

```text
− Two child lists                            │ ✓ Pureline
return Column(                               │ return Column(
  children: showDetails                      │   children: [
      ? [const TitleBar(), const Details()]  │     const TitleBar(),
      : [const TitleBar()],                  │     if (showDetails) const Details(),
);                                           │   ],
                                             │ );
```

### PL-FLUT-007. Sleutels alleen waar lijstidentiteit belangrijk is

Geef alleen een sleutel wanneer de identiteit van een widget moet overleven herordening of verwijdering, zoals stateful lijst items of een `Dismissible`. Gebruik een stabiele identificatiecode uit de gegevens, nooit de lijstindex.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008. BuildContext Na het wachten Heeft een aangekoppelde controle nodig

Een `BuildContext` kan deel uitmaken van een widget die verwijderd is terwijl een `await` in behandeling was. Controleer of het nog steeds is gemonteerd voordat het na een `await` wordt gebruikt.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

In een `State`-subklasse, controleer in plaats daarvan `mounted`.

### PL-FLUT-009. Eigenschappenmappen en map-dinnen

Groepswidgets, providers, en tests op functie (`lib/features/sessions/`), niet op bestandstype in de app. Een map bevat hooguit **10 hand-onderhoud bronbestanden** standaard. Dit is een herzieningsdrempel: split langs verantwoordelijkheden, niet in betekenisloze nested mappen ([structuur](../core/structure.md)).

### PL-FLUT-010. Werkplekken elke verandering

Elke verandering passeert de formatter en analysers voordat ze worden beoordeeld:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` regelt lay-out, dus formatteren debatten nooit bereiken beoordeling. Waarschuwingen zijn niet optioneel: een gehandicapte verkorte regel heeft een reden nodig in `analysis_options.yaml`.
