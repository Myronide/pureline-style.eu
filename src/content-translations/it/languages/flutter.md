# Stile del codice Flutter

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Il profilo Flutter ha come obiettivo **Dart 3 con Flutter 3.x** e null safety solida. Sotto valgono le regole del linguaggio Dart: `final` per impostazione predefinita e tipi sealed dove modellano un insieme chiuso di stati. Un widget è una funzione della sua configurazione e del suo stato: configurazione in ingresso, guardie, valori derivati, albero di widget in uscita.

## Profilo Flutter {#flutter-profile}

### PL-FLUT-001 — I metodi build sono piccoli e privi di effetti collaterali {#pl-flut-001--build-methods-are-small-and-free-of-side-effects}

`build` calcola un albero di widget dai suoi input e nient'altro. Non avvia richieste, non scrive nello storage, non naviga e non muta campi. Quando l'albero supera una schermata di annidamento, estrai un blocco ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Gli effetti collaterali appartengono ai gestori di eventi e al livello dello stato ([stato ed effetti collaterali](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Estrarre i widget che crescono in classi const {#pl-flut-002--extract-growing-widgets-into-const-classes}

Estrai un blocco nel proprio `StatelessWidget` quando ha un nome, dati o stato propri. Non estrarre metodi di supporto che restituiscono widget: non possono essere `const` e nascondono a Flutter il confine del widget.

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

### PL-FLUT-003 — Costruttori const ovunque sia possibile {#pl-flut-003--const-constructors-wherever-possible}

Contrassegna i costruttori come `const` quando tutti i campi sono final, e scrivi `const` in ogni punto di chiamata il cui valore è una costante a tempo di compilazione.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Un solo approccio alla gestione dello stato per app {#pl-flut-004--one-state-management-approach-per-app}

Scegli un approccio per l'intera app e indicalo nel README del progetto: Riverpod, oppure `ChangeNotifier` con `provider` per le app più piccole. Usalo in modo coerente. `setState` va bene per lo stato di UI puramente locale, come un toggle o un flag di espansione. Lo stato di business vive in provider o notifier, non nei widget.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Nessuna chiamata di rete o di storage dentro build {#pl-flut-005--no-network-or-storage-calls-inside-build}

`build` viene eseguito a ogni ricostruzione, quindi una richiesta inserita lì si ripete in modo imprevedibile. Carica i dati nel livello dello stato; i widget renderizzano il risultato.

### PL-FLUT-006 — Guard clause prima dell'albero principale {#pl-flut-006--guard-clauses-before-the-main-tree}

Gestisci per primi gli stati di caricamento, errore e vuoto e ritorna subito. Il layout di successo resta all'indentazione di base.

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
``` Evita i condizionali annidati negli alberi di widget.

### PL-FLUT-007 — Le key solo dove conta l'identità nella lista {#pl-flut-007--keys-only-where-list-identity-matters}

Assegna una key solo quando l'identità di un widget deve sopravvivere a un riordino o a una rimozione, come gli elementi di lista con stato o un `Dismissible`. Usa un identificatore stabile preso dai dati, mai l'indice della lista.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — Un BuildContext dopo un await richiede un controllo su mounted {#pl-flut-008--buildcontext-after-await-needs-a-mounted-check}

Un `BuildContext` può appartenere a un widget rimosso mentre un `await` era in attesa. Controlla che sia ancora montato prima di usarlo dopo un `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

All'interno di una sottoclasse di `State`, controlla invece `mounted`.

### PL-FLUT-009 — Cartelle per funzionalità e densità delle cartelle {#pl-flut-009--feature-folders-and-folder-density}

Raggruppa widget, provider e test per funzionalità (`lib/features/sessions/`), non per tipo di file in tutta l'app. Una cartella contiene al massimo **10 file sorgente mantenuti a mano** per impostazione predefinita. È una soglia di revisione: dividi in base alle responsabilità, non in cartelle annidate prive di senso ([struttura](../core/structure.md)).

### PL-FLUT-010 — Gli strumenti fanno da filtro a ogni modifica {#pl-flut-010--tooling-gates-every-change}

Ogni modifica supera il formatter e gli analyzer prima della revisione:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` stabilisce il layout, così le discussioni sulla formattazione non arrivano mai in revisione. Gli avvisi non sono facoltativi: una regola di lint disabilitata richiede un motivo in `analysis_options.yaml`.
