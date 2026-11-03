# Style de code Novus

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Novus est un langage auto-hébergé qui compile vers du C portable, avec des valeurs typées dynamiquement, un typage statique facultatif, des composants `.nvh` rendus côté serveur et du contenu Markdown `.nvmd` via [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Le profil suit les exemples Novus, la bibliothèque standard et les règles que le serveur de langage Novus vérifie lorsque les diagnostics de style Pureline sont activés (`novus.pureline.enabled`). [Cohésion avant la taille](../core/structure.md) s'applique partout.

Les identifiants de règle `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` et `PL-NAME-001` sont ceux que le serveur de langage Novus signale déjà sous la source `pureline`. Les règles propres à Novus ci-dessous utilisent le préfixe `PL-NV-*`.

## Profil Novus {#novus-profile}

### PL-NV-001 — Nommage et visibilité {#pl-nv-001--naming-and-visibility}

- Classes, enums et composants : `PascalCase`.
- Méthodes, champs, variables locales et paramètres : `lowerCamelCase`.
- Noms de packages (dossiers) : courts, en minuscules, sans séparateurs.
- Constantes : `private final SCREAMING_SNAKE_CASE` au niveau du fichier.
- Gardez les membres privés, sauf si un autre package ou fichier les utilise. N'exposez des champs par `: get` ou `: get, set` que si les appelants en ont besoin.
- Les noms courts sont permis pour les compteurs de boucle (`i`, `j`, `k`). Les autres noms d'une lettre et les noms fantômes (`tmp`, `obj`, `thing`, `data2`) sont signalés par `PL-NAME-001`.

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

### PL-NV-002 — Guard clauses et flux linéaire {#pl-nv-002--guard-clauses-and-linear-flow}

Validez d'abord, retournez tôt et gardez le chemin nominal à l'indentation de base.

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

Évitez `else` après une branche qui fait déjà un return, un break ou un continue (`PL-CF-002`). Lorsqu'un `else` est réellement la forme la plus claire, marquez la ligne avec une exemption justifiée :

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Déclarations : `final`, `var` et types explicites {#pl-nv-003--declarations-final-var-and-explicit-types}

- Utilisez `final` pour les valeurs qui ne changent jamais ; utilisez `var` pour les variables locales dont le type est évident d'après l'initialiseur.
- Écrivez un type déclaré là où le lecteur devrait sinon deviner, et aux frontières d'API (champs, paramètres, types de retour).
- Rappelez-vous qu'un type explicite convertit la valeur : `integer x = 2.9` stocke `2`. Rendez ces conversions visibles plutôt que de vous y fier par accident.
- Novus n'a pas d'affectation composée. Écrivez `count = count + 1` et non `count += 1`, et gardez cette instruction sur une seule ligne.

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

### PL-NV-004 — Construction et littéraux d'objet {#pl-nv-004--construction-and-object-literals}

- Utilisez des littéraux d'objet (`Person{name="Tom"}`) pour des données simples sans comportement.
- Utilisez `construct()` lorsque l'objet doit établir des invariants, dériver des champs ou valider des arguments.
- Ne cachez pas de travail significatif dans les initialiseurs de champs ; gardez la construction explicite dans `construct()`.
- Une chaîne d'héritage `based` doit décrire une véritable relation « est un ». Préférez une `interface` lorsque seul le comportement est partagé.

### PL-NV-005 — Signatures de méthode {#pl-nv-005--method-signatures}

- Déclarez les types des paramètres et du retour lorsque la signature fait partie d'une API, d'une frontière de module ou d'un composant `.nvh`.
- Utilisez `method name(args): type { }` pour les méthodes ordinaires ; gardez les listes de paramètres assez courtes pour être parcourues.
- Les surcharges de méthode selon l'arité ou le type des paramètres sont permises lorsque la signification est identique. N'utilisez pas les surcharges pour cacher des comportements différents derrière un même nom.

### PL-NV-006 — La taille d'une fonction est un signal de revue {#pl-nv-006--function-size-is-a-review-signal}

Le serveur de langage passe une méthode en revue à 30 lignes et la signale au-delà de 50 lignes (`PL-FN-001`). Ce sont des seuils de revue. Une méthode cohésive qui fait une seule chose en séquence peut rester plus longue ; découpez-la lorsqu'elle mélange des responsabilités comme l'analyse, la validation et les E/S.

### PL-NV-007 — Packages, imports et densité des dossiers {#pl-nv-007--packages-imports-and-folder-density}

- Un dossier est un package. Importez l'unité la plus étroite nécessaire : `import geo/circle` ou `import @helpers` plutôt qu'un package entier lorsqu'un seul fichier suffit.
- Gardez au maximum **10 fichiers `.nv` / `.nvh`** par dossier par défaut (`PL-STRUCT-002`). Découpez selon les frontières de responsabilité, pas en dossiers imbriqués dénués de sens.
- Passez un fichier en revue à **200 lignes** (`PL-STRUCT-001`). C'est un seuil de revue, pas une limite stricte : gardez une responsabilité par fichier et laissez la logique cohésive rester ensemble.

### PL-NV-008 — La concurrence a un propriétaire visible {#pl-nv-008--concurrency-has-visible-ownership}

- Rendez la concurrence visible au point d'appel : `async` / `await`, `thread`, `virtual` et `sync` indiquent ce qui s'exécute où.
- Suivez chaque tâche qui compte. Ne lancez pas de travail sans suivi (fire-and-forget) dont le programme dépendra plus tard pour obtenir des résultats.
- Protégez explicitement l'état mutable partagé avec `sync` plutôt que de vous fier à l'ordre des appels.
- Appliquez la même discipline que [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) pour l'arrêt et l'annulation.

### PL-NV-009 — L'ordre d'évaluation est documenté, pas supposé {#pl-nv-009--evaluation-order-is-documented-not-assumed}

Novus évalue les opérandes de gauche à droite et documente les exceptions. N'écrivez pas de code dont le résultat dépend d'un ordre inhabituel. Gardez les effets de bord dans leurs propres instructions, et évitez de combiner dans une même expression la lecture d'une globale ou d'un champ avec un appel ultérieur qui le modifie.

La chaîne `..` sert à construire un objet ou un tableau en une séquence linéaire unique (`var names = []..append("Ada")..append("Grace")`). Utilisez-la lorsque chaque étape est un appel ou une affectation de membre sur le même récepteur. Découpez une chaîne en étapes nommées lorsqu'une étape nécessite un commentaire ou une branche.

### PL-NV-010 — Blocs C et frontières de plateforme {#pl-nv-010--c-blocks-and-platform-boundaries}

Un bloc `c { ... }` est une frontière native. Gardez-le petit, isolez-le dans un fichier ciblé et expliquez par un commentaire ce que le code C suppose à propos des types, des durées de vie et de la plateforme. Exposez la fonction native par une méthode Novus à la signature typée, de sorte que le reste du code ne voie jamais les détails bruts du C.

### PL-NV-011 — Les composants `.nvh` séparent balisage et logique {#pl-nv-011--nvh-components-keep-markup-and-logic-apart}

Dans un composant `.nvh` :

- Déclarez l'état réactif avec `ref` dans `<?nv ... ?>` en haut du composant.
- Gardez les gestionnaires et les calculs dans des blocs Novus ; gardez le HTML centré sur la structure et la présentation.
- Calculez les valeurs dérivées à un seul endroit plutôt que de répéter l'expression à plusieurs endroits du balisage.
- Traitez chaque composant comme une seule responsabilité, au même titre qu'une classe (`PL-STRUCT-001`).

### PL-NV-012 — Commentaires et diagnostics {#pl-nv-012--comments-and-diagnostics}

- Les commentaires expliquent pourquoi, pas quoi : la raison d'un contournement, une particularité de plateforme ou un invariant non évident ([PL-DOC-001](../core/comments.md)).
- Les diagnostics Pureline sont à activer explicitement dans l'éditeur (`novus.pureline.enabled`). Activez-les dans les projets partagés pour que les mêmes identifiants de règle apparaissent dans tous les éditeurs et en CI.
- Chaque exemption `pureline:allow-else` exige une raison sur la même ligne. Une exemption sans raison est un constat de revue.

### PL-NV-013 — Contenu Markdown (`.nvmd`) {#pl-nv-013--markdown-content-nvmd}

Un fichier `.nvmd` est du Markdown contenant du Novus, comme `.mdx` est du Markdown contenant du JSX. Le générateur de [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) transforme `Page.nvmd` en `Page.nvh` avant l'exécution du compilateur. Appliquez les règles ci-dessus au bloc d'en-tête et aux modules `.nv` qu'il importe ; le corps Markdown suit ces règles :

- Le corps porte le contenu. Le bloc d'en-tête (`<?nv ... ?>`) ne porte que ce dont la page a besoin : imports, props et quelques méthodes. Déplacez la logique de plus de quelques lignes dans un module `.nv` et importez-le.
- Les clés du frontmatter sont les props de la page. Gardez-les courtes et plates, et utilisez `{title}` plutôt que de répéter la valeur dans le texte.
- Limitez chaque `{expr}` à une valeur ou un appel. Calculez tout ce qui est plus long dans l'en-tête ou dans un module, afin que le corps se lise de haut en bas comme de la prose.
- Gardez les blocs `{#if}` et `{#for}` à deux niveaux de profondeur au plus. Lorsqu'un bloc répète du balisage, utilisez un composant (`<Callout>`, `<Toc>`) à la place.
- Un titre dont le texte est dynamique reçoit un id explicite (`# {title} {#intro}`), afin que les ancres et `markdown.headings` restent stables.
- Les fichiers `.nvh` générés sont des produits de build. Ajoutez-les à `.gitignore`, ne les modifiez jamais, et corrigez plutôt la source `.nvmd`. Laissez intacte la marque `<?nv /* nvmd-generated */`.
- Un bloc HTML avec un gestionnaire (`<button @click="hit">`) est du nvh à l'intérieur du Markdown. Gardez ces blocs courts et séparez-les du texte environnant par des lignes vides.
