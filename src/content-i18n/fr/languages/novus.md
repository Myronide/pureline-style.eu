# Style de code Novus

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Novus est un langage auto-hosting qui compile vers portable C, avec des valeurs dactylographiées dynamiquement, des tachygraphies statiques optionnelles, des composants de serveur `.nvh` et du contenu de Markdown `.nvmd` via [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Le profil suit les exemples de Novus, la bibliothèque standard et les règles que le serveur de langue Novus vérifie lorsque les diagnostics de style Pureline sont activés (`novus.pureline.enabled`). [Cohésion sur taille](../core/structure.md) s'applique tout au long.

Les ID de règles `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` et `PL-NAME-001` sont ceux que le serveur de langue Novus rapporte déjà sous `pureline` source. Les règles spécifiques à Novus ci-dessous utilisent le préfixe `PL-NV-*`.

## Profil de Novus

### PL-NV-001 — Désignation et visibilité

- Classes, enums et composants: `PascalCase`.
- Méthodes, champs, locaux et paramètres: `lowerCamelCase`.
- Noms des colis (dossiers) : courte, en minuscule, sans séparateurs.
- Constantes: `private final SCREAMING_SNAKE_CASE` au niveau du fichier.
- Gardez les membres privés à moins qu'un autre paquet ou fichier ne les utilise. Exposez les champs à travers `: get` ou `: get, set` seulement lorsque les appelants en ont besoin.
- Les noms courts sont autorisés pour les compteurs de boucle (`i`, `j`, `k`). D'autres noms et détenteurs d'une lettre unique (`tmp`, `obj`, `thing`, `data2`) sont déclarés par `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002 — Clauses de garde et débit linéaire

Valider d'abord, revenir tôt et garder le chemin réussi à l'indentation de base.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Évitez `else` après une branche qui retourne, casse ou continue déjà (`PL-CF-002`). Lorsqu'un `else` est véritablement la forme la plus claire, marquez la ligne avec une exemption justifiée:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Déclarations: `final`, `var` et types explicites

- Utilisez `final` pour des valeurs qui ne changent jamais; utilisez `var` pour les locaux dont le type est évident à partir de l'initialisateur.
- Écrivez un type déclaré où le lecteur devrait deviner autrement, et aux limites de l'API (champs, paramètres, types de retour).
- Rappelez-vous qu'un type explicite convertit la valeur : `integer x = 2.9` stocke `2`. Rendre ces conversions visibles plutôt que de s'en remettre par accident.
- Novus n'a pas d'affectation de composé. Écrivez `count = count + 1`, pas `count += 1`, et gardez cette déclaration sur une ligne.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

### PL-NV-004 — Construction et litéraux d'objets

- Utilisez des données littérales objet (`Person{name="Tom"}`) pour des données simples sans comportement.
- Utilisez `construct()` lorsque l'objet doit établir des invariants, dériver des champs ou valider des arguments.
- Ne cachez pas les travaux importants dans les initialisateurs de terrain; restez la construction explicite dans `construct()`.
- Une chaîne de succession `based` devrait décrire une vraie relation est-une. Préférez un `interface` lorsque seul le comportement est partagé.

### PL-NV-005 — Signatures de méthode

- Déclarez les types de paramètres et de retours lorsque la signature fait partie d'une API, d'une limite de module ou d'un composant `.nvh`.
- Utilisez `method name(args): type { }` pour les méthodes ordinaires; gardez les listes de paramètres suffisamment courtes pour pouvoir les scanner.
- Les surcharges de méthode par type de caractéristique ou de paramètre sont autorisées lorsque la signification est identique. N'utilisez pas de surcharges pour cacher un comportement différent derrière un nom.

### PL-NV-006 — Taille de la fonction est un signal de révision

Le serveur de langue examine une méthode à 30 lignes et la rapporte au-dessus de 50 lignes (`PL-FN-001`). Il s'agit de seuils de révision. Une méthode cohérente qui fait une chose en séquence peut rester plus longue; la diviser lorsqu'elle mélange des responsabilités telles que l'analyse, la validation et les E/S.

### PL-NV-007 — Paquets, importations et densité du dossier

- Un dossier est un paquet. Importez l'unité la plus étroite nécessaire : `import geo/circle` ou `import @helpers` au lieu d'importer un paquet entier quand un fichier suffit.
- Conservez au maximum **10 `.nv` / `.nvh` fichiers** par dossier par défaut (`PL-STRUCT-002`). Divisez les limites de responsabilité, et non pas dans des dossiers imbriqués sans signification.
- Examiner un fichier à **200 lines** (`PL-STRUCT-001`). Il s'agit d'un seuil de révision, et non d'une limite difficile: garder une responsabilité par dossier et laisser la logique cohésive rester ensemble.

### PL-NV-008 — La comptabilisation des devises est une propriété visible

- Faire en sorte que la convergence soit visible sur le site d'appel : `async` / `await`, `thread`, `virtual` et `sync` indiquent où tourner.
- Tracer toutes les tâches qui comptent. Ne commencez pas à travailler au feu et à l'oubli pour obtenir des résultats dont dépend le programme plus tard.
- Guard partageait l'état mutable explicitement avec `sync` plutôt que de se fier à l'ordre d'appel.
- Suivez la même discipline que [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) pour la fermeture et l'annulation.

### PL-NV-009 — L'ordonnance d'évaluation est documentée, non présumée

Novus évalue les opérandes de gauche à droite et documente les exceptions. Ne pas écrire de code dont le résultat dépend d'un ordre inhabituel. Gardez les effets secondaires dans leurs propres déclarations, et évitez de combiner un texte global ou un texte de champ lu avec un appel ultérieur qui le modifie en une seule expression.

La chaîne `..` est destinée à la construction d'un objet ou d'un tableau en une seule séquence linéaire (`var names = []..append("Ada")..append("Grace")`). Utilisez-le lorsque chaque étape est un appel ou une affectation de membre sur le même récepteur. Découpez une chaîne en étapes nommées lorsqu'une étape nécessite un commentaire ou une branche.

### PL-NV-010 — Blocs C et limites des plates-formes

Un bloc `c { ... }` est une limite native. Gardez-le petit, isolez-le dans un fichier ciblé, et expliquez avec un commentaire ce que le code C suppose sur les types, les durées de vie et la plate-forme. Exposez la fonction native à travers une méthode Novus avec une signature dactylographiée, de sorte que le reste du code ne voit jamais les détails C bruts.

### PL-NV-011 — Les composants `.nvh` conservent le balisage et la logique à part

Dans un composant `.nvh`:

- Déclarez l'état réactif avec `ref` à l'intérieur de `<?nv ... ?>` au sommet du composant.
- Gardez les gestionnaires et les calculs dans les blocs de Novus; gardez le HTML concentré sur la structure et la présentation.
- Calculer les valeurs dérivées en un seul endroit plutôt que de répéter l'expression en plusieurs endroits du balisage.
- Traiter chaque composant comme une seule responsabilité, de la même façon qu'une classe (`PL-STRUCT-001`).

### PL-NV-012 — Commentaires et diagnostics

- Les commentaires expliquent pourquoi, pas quoi: la raison d'une solution de rechange, d'une écurie de plate-forme ou d'un invariant non évident ([PL-DOC-001](../core/comments.md)).
- Les diagnostics Pureline sont opt-in dans l'éditeur (`novus.pureline.enabled`). Activez-les pour les projets partagés de sorte que les mêmes ID de règle apparaissent dans chaque éditeur et dans CI.
- Chaque exemption `pureline:allow-else` a besoin d'une raison sur la même ligne. Une exemption sans raison est une conclusion de réexamen.

### PL-NV-013 — Contenu de la marque (`.nvmd`)

Un fichier `.nvmd` est Markdown avec Novus en elle, la façon dont `.mdx` est Markdown avec JSX. Le générateur dans [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) tourne `Page.nvmd` en `Page.nvh` avant que la „P" ne tourne. Appliquer les règles ci-dessus au bloc d'en-tête et à tout module `.nv` qu'il importe; l'organisme Markdown suit ces règles:

- Le corps porte le contenu. Le bloc d'en-tête (`<?nv ... ?>`) ne porte que ce dont la page a besoin : les importations, les accessoires et quelques méthodes. Déplacer la logique plus longtemps que quelques lignes dans un module `.nv` et l'importer.
- Les clés de la première matière sont les accessoires de la page. Gardez-les courts et plats, et utilisez `{title}` plutôt que de répéter la valeur dans le texte.
- Gardez chaque `{expr}` à une valeur ou un appel. Calculez n'importe quoi plus longtemps dans l'en-tête ou un module, donc le corps lit haut en bas comme prose.
- Gardez les blocs `{#if}` et `{#for}` à tout le plus deux niveaux de profondeur. Lorsqu'un bloc répète une marquage, utilisez plutôt un composant (`<Callout>`, `<Toc>`).
- Une rubrique dont le texte est dynamique obtient un id explicite (`# {title} {#intro}`), donc les ancres et `markdown.headings` restent stables.
- Les fichiers `.nvh` générés sont des sorties de construction. Ajoutez-les à `.gitignore`, ne jamais les modifier et corrigez plutôt la source `.nvmd`. Gardez la marque `<?nv /* nvmd-generated */` intacte.
- Un bloc HTML avec un gestionnaire (`<button @click="hit">`) est nvh à l'intérieur de Markdown. Gardez ces blocs courts et les séparer du texte environnant avec des lignes blanches.
