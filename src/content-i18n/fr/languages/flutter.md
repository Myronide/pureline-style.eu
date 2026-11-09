# Style de code de flutter

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Le profil Flutter cible **Dart 3 avec Flutter 3.x** et la sécurité sonore nulle. Les règles de langue Dart s'appliquent ci-dessous : `final` par défaut, et les types scellés où ils modélisent un ensemble fermé d'états. Un widget est une fonction de sa configuration et de son état : configuration dans, garde, valeurs dérivées, arbre de widget.

## Profil de la flûte

### PL-FLUT-001 — Les méthodes de construction sont petites et exemptes d'effets secondaires

`build` calcule un arbre de widget à partir de ses entrées et rien d'autre. Il ne démarre pas les requêtes, n'écrivent pas de stockage, ne naviguent pas ou ne mutent pas les champs. Lorsque l'arbre pousse au-delà d'un écran de nidification, extraire un bloc ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Les effets secondaires appartiennent aux gestionnaires d'événements et à la couche d'état ([état et effets secondaires](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Extraire les widgets croissants dans les classes de Const

Extraire un bloc dans sa propre `StatelessWidget` quand il a son nom, ses données ou son état. Ne pas extraire les méthodes d'aide qui retournent des widgets: ils ne peuvent pas être `const` et cacher la limite du widget de Flutter.

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

### PL-FLUT-003 — Constructeurs de conteneurs partout où c'est possible

Marquez les constructeurs `const` lorsque tous les champs sont finaux, et écrivez `const` à chaque site d'appel dont la valeur est constante de compilation-temps.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Une approche de gestion de l'État par application

Choisissez une approche pour l'application entière et donnez-la dans le projet README: Riverpod ou `ChangeNotifier` avec `provider` pour les applications plus petites. Utilisez-le de façon cohérente. `setState` est une amende pour l'état de l'interface utilisateur purement locale, comme un toggle ou un drapeau élargi. L'État d'affaires vit dans des fournisseurs ou des notifications, pas dans des widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Aucun réseau ou d'appels de stockage à l'intérieur de la construction

`build` fonctionne sur chaque reconstruction, donc une requête placée là répète imprudemment. Charger les données dans la couche état; les widgets rendent le résultat.

### PL-FLUT-006 — Clauses de garde avant l'arbre principal

Poignez le chargement, l'erreur et les états vides d'abord et de revenir tôt. Le schéma réussi reste à l'indentation de base.

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

Évitez les conditions imbriquées dans les arbres widgets.

Utilisez une collection `if` lorsque seul un enfant est conditionnel et le reste de
la liste est partagée.

```text
− Two child lists                            │ ✓ Pureline
return Column(                               │ return Column(
  children: showDetails                      │   children: [
      ? [const TitleBar(), const Details()]  │     const TitleBar(),
      : [const TitleBar()],                  │     if (showDetails) const Details(),
);                                           │   ],
                                             │ );
```

### PL-FLUT-007 — Clés seulement lorsque la liste de l'identité compte

Donnez une clé seulement lorsque l'identité d'un widget doit survivre à la réorganisation ou à l'enlèvement, comme des éléments de liste de qualité ou un `Dismissible`. Utilisez un identifiant stable à partir des données, jamais l'index de la liste.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — Construisez le Context Après attendre Besoin d'une vérification montée

Un `BuildContext` peut appartenir à un widget enlevé alors qu'un `await` était en attente. Vérifiez qu'il est encore monté avant de l'utiliser après un `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Dans une sous-classe `State`, vérifiez plutôt `mounted`.

### PL-FLUT-009 — Dossiers et densité de dossiers

Grouper les widgets, les fournisseurs et les tests par fonction (`lib/features/sessions/`), pas par type de fichier dans l'application. Un dossier contient au plus des fichiers source **10 maintenus manuellement** par défaut. Il s'agit d'un seuil de révision: scindé les responsabilités, non pas en dossiers imbriqués sans signification ([structure](../core/structure.md)).

### PL-FLUT-010 — L'outillage porte chaque changement

Chaque changement passe la matière première et les analyseurs avant examen:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` règle la disposition, de sorte que les débats de formatage ne parviennent jamais à un examen. Les avertissements ne sont pas facultatifs: une règle de lint désactivée nécessite une raison en `analysis_options.yaml`.
