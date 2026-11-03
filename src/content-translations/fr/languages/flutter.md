# Style de code Flutter

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Le profil Flutter cible **Dart 3 avec Flutter 3.x** et une null safety saine. Les règles du langage Dart s'appliquent en dessous : `final` par défaut, et des types scellés lorsqu'ils modélisent un ensemble fermé d'états. Un widget est une fonction de sa configuration et de son état : configuration en entrée, guards, valeurs dérivées, arbre de widgets en sortie.

## Profil Flutter {#flutter-profile}

### PL-FLUT-001 — Les méthodes build sont petites et sans effets de bord {#pl-flut-001--build-methods-are-small-and-free-of-side-effects}

`build` calcule un arbre de widgets à partir de ses entrées, et rien d'autre. Il ne lance pas de requêtes, n'écrit pas dans le stockage, ne navigue pas et ne modifie pas de champs. Lorsque l'arbre dépasse un écran d'imbrication, extrayez un bloc ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Les effets de bord appartiennent aux gestionnaires d'événements et à la couche d'état ([état et effets de bord](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Extraire les widgets qui grossissent dans des classes const {#pl-flut-002--extract-growing-widgets-into-const-classes}

Extrayez un bloc dans son propre `StatelessWidget` lorsqu'il a son propre nom, ses propres données ou son propre état. N'extrayez pas de méthodes auxiliaires qui retournent des widgets : elles ne peuvent pas être `const` et masquent à Flutter la frontière du widget.

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

### PL-FLUT-003 — Des constructeurs const partout où c'est possible {#pl-flut-003--const-constructors-wherever-possible}

Marquez les constructeurs `const` lorsque tous les champs sont finaux, et écrivez `const` à chaque point d'appel dont la valeur est constante à la compilation.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Une seule approche de gestion d'état par application {#pl-flut-004--one-state-management-approach-per-app}

Choisissez une approche pour toute l'application et nommez-la dans le README du projet : Riverpod, ou `ChangeNotifier` avec `provider` pour les applications plus petites. Utilisez-la de façon cohérente. `setState` convient à l'état d'interface purement local, comme un interrupteur ou un indicateur d'expansion. L'état métier vit dans des providers ou des notifiers, pas dans les widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Aucun appel réseau ou de stockage dans build {#pl-flut-005--no-network-or-storage-calls-inside-build}

`build` s'exécute à chaque reconstruction ; une requête placée là se répète donc de façon imprévisible. Chargez les données dans la couche d'état ; les widgets affichent le résultat.

### PL-FLUT-006 — Guard clauses avant l'arbre principal {#pl-flut-006--guard-clauses-before-the-main-tree}

Traitez d'abord les états de chargement, d'erreur et de vide, et retournez tôt. La mise en page de succès reste à l'indentation de base.

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

Évitez les conditions imbriquées dans les arbres de widgets.

### PL-FLUT-007 — Des clés seulement là où l'identité de la liste compte {#pl-flut-007--keys-only-where-list-identity-matters}

Ne donnez une clé que lorsque l'identité d'un widget doit survivre à un réordonnancement ou à une suppression, comme pour des éléments de liste à état ou un `Dismissible`. Utilisez un identifiant stable issu des données, jamais l'index de la liste.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext après await exige une vérification mounted {#pl-flut-008--buildcontext-after-await-needs-a-mounted-check}

Un `BuildContext` peut appartenir à un widget retiré pendant qu'un `await` était en attente. Vérifiez qu'il est toujours monté (mounted) avant de l'utiliser après un `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Dans une sous-classe de `State`, vérifiez plutôt `mounted`.

### PL-FLUT-009 — Dossiers de fonctionnalité et densité des dossiers {#pl-flut-009--feature-folders-and-folder-density}

Regroupez les widgets, les providers et les tests par fonctionnalité (`lib/features/sessions/`), et non par type de fichier à l'échelle de l'application. Un dossier contient au maximum **10 fichiers sources maintenus à la main** par défaut. C'est un seuil de revue : découpez selon les responsabilités, pas en dossiers imbriqués dénués de sens ([structure](../core/structure.md)).

### PL-FLUT-010 — L'outillage contrôle chaque modification {#pl-flut-010--tooling-gates-every-change}

Chaque modification passe le formateur et les analyseurs avant la revue :

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` règle la mise en page ; les débats de formatage n'arrivent donc jamais en revue. Les avertissements ne sont pas facultatifs : une règle de lint désactivée exige une raison dans `analysis_options.yaml`.
