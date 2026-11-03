# Flutter-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Het Flutter-profiel richt zich op **Dart 3 met Flutter 3.x** en sound null safety. De taalregels van Dart gelden eronder: standaard `final`, en sealed types waar ze een gesloten verzameling toestanden modelleren. Een widget is een functie van zijn configuratie en toestand: configuratie erin, guards, afgeleide waarden, widgetboom eruit.

## Flutter-profiel {#flutter-profile}

### PL-FLUT-001 — Build-methoden zijn klein en vrij van neveneffecten {#pl-flut-001--build-methods-are-small-and-free-of-side-effects}

`build` berekent een widgetboom uit zijn invoer en niets anders. Hij start geen verzoeken, schrijft niet naar opslag, navigeert niet en muteert geen velden. Wanneer de boom meer nesting krijgt dan op één scherm past, extraheer dan een blok ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Neveneffecten horen in event handlers en de toestandslaag ([toestand en neveneffecten](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Extraheer groeiende widgets naar const-klassen {#pl-flut-002--extract-growing-widgets-into-const-classes}

Extraheer een blok naar een eigen `StatelessWidget` wanneer het een eigen naam, eigen data of eigen toestand heeft. Extraheer geen hulpmethoden die widgets retourneren: die kunnen niet `const` zijn en verbergen de widgetgrens voor Flutter.

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

### PL-FLUT-003 — Const-constructors waar mogelijk {#pl-flut-003--const-constructors-wherever-possible}

Markeer constructors als `const` wanneer alle velden final zijn, en schrijf `const` bij elke aanroep waarvan de waarde bij compilatie constant is.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Eén aanpak voor toestandsbeheer per app {#pl-flut-004--one-state-management-approach-per-app}

Kies één aanpak voor de hele app en vermeld die in de README van het project: Riverpod, of `ChangeNotifier` met `provider` voor kleinere apps. Gebruik die consequent. `setState` is prima voor puur lokale UI-toestand, zoals een schakelaar of een vlag voor uitgeklapt. Bedrijfstoestand staat in providers of notifiers, niet in widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Geen netwerk- of opslagaanroepen in build {#pl-flut-005--no-network-or-storage-calls-inside-build}

`build` draait bij elke rebuild, dus een verzoek dat daar staat wordt onvoorspelbaar herhaald. Laad data in de toestandslaag; widgets renderen het resultaat.

### PL-FLUT-006 — Guard clauses vóór de hoofdboom {#pl-flut-006--guard-clauses-before-the-main-tree}

Behandel laad-, fout- en lege toestanden eerst en keer vroeg terug. De succesvolle layout blijft op het basisinspringniveau.

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
``` Vermijd geneste voorwaarden in widgetbomen.

### PL-FLUT-007 — Keys alleen waar de identiteit in lijsten ertoe doet {#pl-flut-007--keys-only-where-list-identity-matters}

Geef alleen een key wanneer de identiteit van een widget herordening of verwijdering moet overleven, zoals bij stateful lijstitems of een `Dismissible`. Gebruik een stabiele identifier uit de data, nooit de index van de lijst.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext na await vraagt om een mounted-controle {#pl-flut-008--buildcontext-after-await-needs-a-mounted-check}

Een `BuildContext` kan toebehoren aan een widget die is verwijderd terwijl een `await` nog liep. Controleer na een `await` of hij nog gemount is voordat je hem gebruikt.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Controleer binnen een subklasse van `State` in plaats daarvan `mounted`.

### PL-FLUT-009 — Featuremappen en mapdichtheid {#pl-flut-009--feature-folders-and-folder-density}

Groepeer widgets, providers en tests per feature (`lib/features/sessions/`), niet per bestandssoort over de hele app. Een map bevat standaard maximaal **10 handmatig onderhouden bronbestanden**. Dit is een drempel voor review: splits langs verantwoordelijkheden, niet in zinloze geneste mappen ([structuur](../core/structure.md)).

### PL-FLUT-010 — Tooling bewaakt elke wijziging {#pl-flut-010--tooling-gates-every-change}

Elke wijziging passeert de formatter en de analyzers vóór de review:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` bepaalt de layout, dus discussies over opmaak halen de review nooit. Waarschuwingen zijn niet vrijblijvend: een uitgeschakelde lintregel vraagt om een reden in `analysis_options.yaml`.
