# Style de code Emvus

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille] (../core/structure.md) s'applique tout au long.

## Profil Emvus

Pureline Emvus suit le design de langage de ** Emvus courant**. C'est un profil de style pour la syntaxe `.ev` prévue, et non une affirmation que chaque fonctionnalité présentée est déjà implémentée par Ring 1. Gardez Emvus distincts de Emerald.

### PL-EV-001 — Déclarations de méthodes autochtones

Déclarez les méthodes avec `method` et, si nécessaire, un type de retour dans `method<Type>`. Les variables de type générique sont introduites par `where`, non en joignant une autre liste de paramètres génériques au nom de la méthode.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Une méthode sans type de retour explicite renvoie `Void`.

### PL-EV-002 — Déclaration vide Les parenthèses sont facultatives; les parenthèses d'appel ne sont pas

Les deux déclarations sans paramètre sont conformes à Pureline :

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Les deux orthographes déclarent des méthodes de « 0- argument » ; la différence est cosmétique, **not** une distinction de surcharge. Toujours écrire `refresh()` ou `shutdown()` pour exécuter la méthode; `object.refresh` n'est pas un appel de méthode. Les Formateurs doivent préserver ou configurer de façon cohérente ou valide le style de déclaration sans marquer l'autre comme une erreur.

### PL-EV-003 — Braces requis; Semicolons Facultatif

Utilisez des blocs `{ ... }` explicites pour `if`, boucles et flux de contrôle comparables. Préférez omettre les semi-colons optionnels dans les Emvus idiomatiques, mais ne rejettez pas le code valide de semi-colon.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Les protecteurs en ligne sans braille et les blocs `else` inutiles ne sont pas Pureline. Gardez les lignes de continuation et les longues expressions sans ambiguïté.

### PL-EV-004 — Désignation, importations et visibilité

- Types: Interfaces `PascalCase`; & #160;: Préfixe `I` (`IStorage`, `IConnection`).
- Méthodes, champs, propriétés, paramètres et locaux: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE`.
- Emballages: Les sentiers en bas de la caisse.
- Noms de fichier source : **camelCase**, par exemple `sessionService.ev`, même si la classe primaire est `SessionService`.
- La visibilité par défaut est `public`; spécifiez `private` ou `protected` si nécessaire.
- La résolution du symbole est insensible à la casse mais l'orthographe source est préservée : utiliser l'orthographe ** déclarée** de façon cohérente et ne pas définir des noms qui diffèrent seulement dans le cas.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Utiliser des importations et des alias explicites au lieu de se fier à des collisions confuses.

### PL-EV-005 — Types qui devraient communiquer l'intention

Emvus est tapé statiquement par défaut. `var` exécute **static type inference**; `dynamic` demande explicitement un comportement type d'exécution.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Utilisez `dynamic` à des limites réellement dynamiques, pas pour contourner les contrôles de type normaux. Les types locaux statiques explicites et inférés sont conformes à Pureline.

### PL-EV-006 — Nullabilité des poignées par un débit stable

Emvus ne nécessite pas d'annotation `T?`. Il suit les états nuls par le flux de contrôle. Garder une valeur possible-null tôt et préférer un instantané local stable des propriétés mutables avant de raisonner sur leur nullité.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Ne jamais se fier à des lectures non synchronisées répétées d'une propriété mutable ayant la même valeur. Expliquer l'initialisation obligatoire du champ.

### PL-EV-007 — Préférez la manipulation des résultats en caractères dactylographiés pour les défaillances prévues

Emvus n'a pas de syntaxe `try/catch/finally`. Utilisez `Result<T, E>`, `success`, `fail`, `?` et `switch` comme le langage le spécifie.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` est pour la propagation d'erreurs délibérées lorsque les types le permettent.
- `!` provoque une panique lors d'une erreur; réservez-la pour les invariants établis ou les contrôles de limite qui ne peuvent vraiment pas se rétablir.
- Ne pas jeter un `Result` ou cacher la défaillance attendue derrière `panic`.
- Gardez les `success`, `fail` et `return` distincts plutôt que d'envelopper chaque opération inutilement.

### PL-EV-008 — rendre visible la vie des ressources avec `scoped`

Utilisez la construction `scoped` d'Emvus pour les ressources qui doivent être fermées lorsque leur portée se termine.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Ne remplacez pas `scoped` par Java `try-with-resources`, Go `defer` ou par un Emvus `finally` inexistant. La vie d'une ressource devrait rester claire même lorsque les „pi" optimisent la mémoire.

### PL-EV-009 — Préférer les classes de données à la plaque de travail

Utilisez `data class` pour les petits types, nommés, data-centric avec le comportement généré intégré.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Les propriétés des données primaires sont en lecture seule en dehors de l'initialisation. `copy()` et `withX(...)` expriment des copies modifiées et sont peu profondes par défaut. Préférez générer l'égalité, le hachage et la représentation textuelle, le cas échéant, plutôt que de les réécrire manuellement. Gardez des types plus grands et riches en comportements comme des classes régulières.

**N'introduisez pas de prescription de style `record` séparée:** le design Emvus accepté utilise `data class` pour les modèles de données nommés et `Dictionary` pour les données de dictionnaire/objet-littéral.

### PL-EV-010 — Listes, tuples et dictionnaires conservent leur sémantique définie

Pour les éléments littéraux `[...]`, **all types exactement egal** implique un `List`; sinon l'expression est un tuple. Ne pas faire écraser la règle de type de Pureline avec une préférence stylistique.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Les dictionnaires utilisent `{ key: value }` au sens littéral; les types de valeurs mixtes déduites utilisent `dynamic` au besoin par le modèle de langue. Les dictionnaires sont accessibles par **keys**, pas par dot-enregistrement structurel.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Un type d'élément changeant peut modifier légitimement l'inférence list-versus-tuple. Gardez ce comportement visible aux limites de l'API par des types déclarés explicites, le cas échéant.

### PL-EV-011 — La déstructuration est positionnelle

Utilisez `{ ... }` pour déstructurer les composants de tuple ou de classe de données dans l'ordre de déclaration. `_` peut sauter un élément.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Ne pas réinterpréter la déstructuration comme un enregistrement nommé. Préférez les fixations courtes significatives, et non le déballage aveugle.

### PL-EV-012 — `switch` devrait exposer la branche complète

Utilisez des instructions ou des expressions `switch` pour des alternatives d'état réel. Les expressions doivent être exhaustives ou avoir un bras de fermeture/défaut défini.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Préférez les motifs `success(...)` et `error(...)` clairs aux conditions imbriquées pour `Result`. Gardez tous les motifs de capture délibérés, pas un moyen de cacher les cas oubliés.

### PL-EV-013 — Utiliser des cascades seulement lorsqu'elles clarifient un récepteur unique

Les cascades avec `..` sont utiles pour une courte séquence d'opérations sur le même récepteur.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Évitez les chaînes qui dissimulent des effets non liés, mutent plusieurs objets implicitement, ou s'étendent sur de nombreuses déclarations.

### PL-EV-014 — Fibres et fils ont besoin de cycles de vie clairs

`fiber {}`, `virtual {}` et `thread {}` sont des constructions d'exécution distinctes avec un modèle de résultat de tâche commun. Choisissez en fonction de la charge de travail réelle, pas parce que la concurrence semble compacte.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Les résultats et les échecs sont importants.
- Faire en sorte que l'annulation et la propriété soient claires pour les tâches de longue durée.
- Synchroniser l'état mutable partagé; `@Synchronized` est disponible le cas échéant.
- Ne présumez pas que l'objet capturé d'une tâche est local ou peut être libéré lorsque la méthode de frai revient.
- Évitez de faire des travaux cachés dans des méthodes commerciales ordinaires.

### PL-EV-015 — Les macros doivent améliorer la découverte, non pas obscurcir

Les macros Emvus sont des AST-times de compilation avec des déclarations cibles, `quote`, `$(...)` substitution, et API de constructeur AST.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline nécessite:

- Petites macros ayant des responsabilités clairement définies et des objectifs soutenus.
- Dilatation déterministe; comportement source-ordre et les membres résultants restent décelables.
- Hygiène pour éviter les collisions accidentelles.
- Compiler le diagnostic lorsque l'expansion crée un code contradictoire ou invalide.
- Méthodes ordinaires au lieu de macros quand il n'existe pas de bénéfice substantiel de compilation-temps.
- Pas de dépendance à des effets secondaires non examinés macro-temps, réseau, horloge ou aléatoires.

Le code généré doit satisfaire aux vérifications sémantiques; l'outillage checker/formatter ne doit pas traiter les emplacements générés comme des fichiers ordinaires maintenus à la main.

### PL-EV-016 — Ne pas programmer contre les flux d'hyperalloc internes

Le code Emvus peut être optimisé par Sublang, Optimind et HyperAlloc Flow. Les développeurs doivent exprimer **semantics et vials**, pas de deviner manuellement une stratégie d'allocation future.

- Favorer les cycles de vie simples d'objets et la propriété stable.
- Gardez l'état mutable partagé explicite, surtout entre les tâches.
- Préférez des classes de données immutables pour des valeurs simples lorsqu'elles correspondent au domaine.
- Ne pas construire des API autour des hypothèses qu'un objet est toujours attribué par pile, remplacé par scalar ou mis en commun.
- Évaluer l'attribution des sentiers chauds et échapper au comportement par la mesure et le diagnostic, et non par le folklore.

### PL-EV-017 — Organisme de densité et de source de colis

A package/source folder should contain at most **8** production `.ev` modules by default. Tests, generated sources, and metadata-only files do not count. Split by actual feature responsibility rather than mechanically creating arbitrary subpackages.

Un nom de paquet et un nom de fichier sont des concepts différents : `app.session` reste en minuscules, tandis que `sessionService.ev` est `camelCase`.

### PL-EV-018 — Règles linguistiques-natives surpassent l'imitation translingue

L'outillage Pureline ne doit pas signaler une violation simplement parce qu'Emvus diffère de Java, Emerald, Rust ou Go:

- Les déclarations de méthode `()` en option dans **Parameterless** sont valides; les appels nécessitent toujours `()`.
- Les points-virgules optionnels sont valides.
- `where` est la syntaxe de déclaration générique native.
- `var` est déduit statiquement; `dynamic` est explicitement dynamique.
- Les macros `success`, `fail`, `?`, `!`, `scoped` et AST ont des significations spécifiques à Emvus.
- `{ ... }` a des utilisations valides en fonction du contexte, y compris des dictionnaires et des déstructurations positionnelles.
- `[ ... ]` est tapé comme une liste ou un tuple selon la règle de type exact-element d'Emvus.

Le contenu doit être AST-aware, préserver le sens et ne jamais appliquer les espaces de noms `::` d'Emerald ou les exigences de point-virgule aux fichiers `.ev`.
