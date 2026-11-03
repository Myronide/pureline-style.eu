# Style de code Emvus

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Emvus {#emvus-profile}

Pureline Emvus suit la **conception actuelle du langage Emvus**. Il s'agit d'un profil de style pour la syntaxe `.ev` envisagée, et non d'une affirmation selon laquelle chaque fonctionnalité présentée est déjà implémentée par Ring 1. Gardez Emvus distinct d'Emerald.

### PL-EV-001 — Déclarations de méthode natives {#pl-ev-001--native-method-declarations}

Déclarez les méthodes avec `method` et, si nécessaire, un type de retour dans `method<Type>`. Les variables de type génériques sont introduites par `where`, et non en attachant une autre liste de paramètres génériques au nom de la méthode.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Une méthode sans type de retour explicite retourne `Void`.

### PL-EV-002 — Les parenthèses vides de déclaration sont facultatives ; celles des appels ne le sont pas {#pl-ev-002--empty-declaration-parentheses-are-optional-call-parentheses-are-not}

Les deux déclarations sans paramètre sont conformes à Pureline :

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Les deux écritures déclarent des méthodes sans argument ; la différence est purement cosmétique, **et non** une distinction de surcharge. Écrivez toujours `refresh()` ou `shutdown()` pour exécuter la méthode ; `object.refresh` n'est pas un appel de méthode. Les formateurs doivent préserver ou configurer de façon cohérente l'un ou l'autre style de déclaration valide, sans marquer l'autre comme une erreur.

### PL-EV-003 — Accolades obligatoires ; points-virgules facultatifs {#pl-ev-003--braces-required-semicolons-optional}

Utilisez des blocs `{ ... }` explicites pour `if`, les boucles et les flux de contrôle comparables. Préférez omettre les points-virgules facultatifs dans l'Emvus idiomatique, mais ne rejetez pas le code existant valide terminé par des points-virgules.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Les guards en ligne sans accolades et les blocs `else` inutiles ne sont pas du Pureline. Gardez les lignes de continuation et les longues expressions sans ambiguïté.

### PL-EV-004 — Nommage, imports et visibilité {#pl-ev-004--naming-imports-and-visibility}

- Types : `PascalCase` ; interfaces : préfixe `I` (`IStorage`, `IConnection`).
- Méthodes, champs, propriétés, paramètres et variables locales : `camelCase`.
- Constantes : `UPPER_SNAKE_CASE`.
- Packages : chemins pointés en minuscules.
- Noms de fichiers sources : **camelCase**, par exemple `sessionService.ev`, même si la classe principale est `SessionService`.
- La visibilité par défaut est `public` ; précisez `private` ou `protected` lorsque c'est nécessaire.
- La résolution des symboles ne tient pas compte de la casse, mais l'orthographe du source est préservée : utilisez de façon cohérente l'**orthographe déclarée** et ne définissez pas de noms qui ne diffèrent que par la casse.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Utilisez des imports et des alias explicites plutôt que de compter sur des collisions déroutantes.

### PL-EV-005 — Les types doivent communiquer l'intention {#pl-ev-005--types-should-communicate-intent}

Emvus est typé statiquement par défaut. `var` effectue une **inférence de type statique** ; `dynamic` demande explicitement un comportement typé à l'exécution.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Utilisez `dynamic` aux frontières réellement dynamiques, pas pour contourner les vérifications de types normales. Les types statiques locaux explicites comme inférés sont conformes à Pureline.

### PL-EV-006 — Gérer la nullabilité par un flux stable {#pl-ev-006--handle-nullability-through-stable-flow}

Emvus n'exige pas d'annotation `T?`. Il suit les états null à travers le flux de contrôle. Protégez-vous tôt contre une valeur éventuellement nulle et préférez un instantané local stable des propriétés mutables avant de raisonner sur leur nullabilité.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Ne comptez jamais sur le fait que des lectures répétées et non synchronisées d'une propriété mutable renvoient la même valeur. Rendez explicite l'initialisation des champs obligatoires.

### PL-EV-007 — Préférer un traitement typé par Result pour les échecs attendus {#pl-ev-007--prefer-typed-result-handling-for-expected-failures}

Emvus n'a pas de syntaxe `try/catch/finally`. Utilisez `Result<T, E>`, `success`, `fail`, `?` et `switch` comme le spécifie le langage.

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

- `?` sert à propager délibérément une erreur lorsque les types le permettent.
- `!` provoque un panic en cas d'erreur ; réservez-le aux invariants établis ou aux vérifications de frontière dont on ne peut vraiment pas se remettre.
- Ne jetez pas un `Result` et ne cachez pas un échec attendu derrière `panic`.
- Gardez `success`, `fail` et `return` distincts plutôt que d'envelopper inutilement chaque opération.

### PL-EV-008 — Rendre visibles les durées de vie des ressources avec `scoped` {#pl-ev-008--make-resource-lifetimes-visible-with-scoped}

Utilisez la construction `scoped` d'Emvus pour les ressources qui doivent être fermées à la fin de leur portée.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Ne remplacez pas `scoped` par le `try-with-resources` de Java, le `defer` de Go ou un `finally` inexistant en Emvus. La durée de vie d'une ressource doit rester claire même lorsque le compilateur optimise la mémoire.

### PL-EV-009 — Préférer les data classes au code répétitif {#pl-ev-009--prefer-data-classes-to-boilerplate}

Utilisez `data class` pour de petits types nommés, centrés sur les données, avec le comportement généré intégré.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Les propriétés de données principales sont en lecture seule en dehors de l'initialisation. `copy()` et `withX(...)` expriment des copies modifiées et sont superficielles (shallow) par défaut. Préférez l'égalité, le hachage et la représentation textuelle générés lorsque c'est approprié, plutôt que de les réécrire manuellement. Gardez les types plus volumineux et riches en comportement sous forme de classes ordinaires.

**N'introduisez pas d'exigence de style `record` distincte :** la conception Emvus convenue utilise `data class` pour les modèles de données nommés et `Dictionary` pour les données de type dictionnaire/littéral d'objet.

### PL-EV-010 — Les listes, tuples et dictionnaires conservent leur sémantique définie {#pl-ev-010--lists-tuples-and-dictionaries-retain-their-defined-semantics}

Pour les littéraux `[...]`, **tous les types d'éléments exactement égaux** impliquent une `List` ; sinon l'expression est un tuple. Ne faites pas écraser par Pureline la règle du langage fondée sur les types au profit d'une préférence stylistique.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Les littéraux de dictionnaire utilisent `{ key: value }` ; les types de valeurs mixtes inférés utilisent `dynamic` lorsque le modèle du langage l'exige. On accède aux dictionnaires par **clés**, et non par une notation à point de type enregistrement structurel.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Un type d'élément qui change peut légitimement modifier l'inférence entre liste et tuple. Gardez ce comportement visible aux frontières d'API en utilisant des types déclarés explicites lorsque c'est approprié.

### PL-EV-011 — La déstructuration est positionnelle {#pl-ev-011--destructuring-is-positional}

Utilisez `{ ... }` pour déstructurer les composants d'un tuple ou d'une data class dans l'ordre de déclaration. `_` permet d'ignorer un élément.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Ne réinterprétez pas la déstructuration comme une correspondance d'enregistrement par nom. Préférez des liaisons courtes et significatives plutôt qu'un dépaquetage sans discernement.

### PL-EV-012 — `switch` doit exposer un branchement complet {#pl-ev-012--switch-should-expose-complete-branching}

Utilisez des instructions ou des expressions `switch` pour de vraies alternatives d'état. Les expressions doivent être exhaustives ou comporter une branche fourre-tout / d'échec définie.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Préférez des motifs `success(...)` et `error(...)` clairs à des conditions imbriquées pour `Result`. Gardez les motifs fourre-tout délibérés, et non un moyen de cacher des cas oubliés.

### PL-EV-013 — N'utiliser les cascades que lorsqu'elles clarifient un récepteur unique {#pl-ev-013--use-cascades-only-when-they-clarify-a-single-receiver}

Les cascades avec `..` sont utiles pour une courte séquence d'opérations sur le même récepteur.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Évitez les chaînes qui dissimulent des effets sans rapport entre eux, qui modifient implicitement plusieurs objets ou qui s'étendent sur de nombreuses instructions.

### PL-EV-014 — Les fibers et les threads ont besoin de cycles de vie clairs {#pl-ev-014--fibers-and-threads-need-clear-lifecycles}

`fiber {}`, `virtual {}` et `thread {}` sont des constructions d'exécution distinctes qui partagent un modèle commun de résultat de tâche. Choisissez en fonction de la charge de travail réelle, et non parce que la concurrence paraît compacte.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Attendez (await) les résultats et les échecs qui comptent.
- Rendez l'annulation et la propriété claires pour les tâches de longue durée.
- Synchronisez l'état mutable partagé ; `@Synchronized` est disponible lorsque c'est approprié.
- Ne supposez pas que l'objet capturé par une tâche est local à la pile ni qu'il peut être libéré quand la méthode qui l'a lancée retourne.
- Évitez le travail caché lancé sans suivi (fire-and-forget) dans les méthodes métier ordinaires.

### PL-EV-015 — Les macros doivent améliorer la découvrabilité, pas la masquer {#pl-ev-015--macros-must-improve-discoverability-not-obscure-it}

Les macros Emvus sont des transformations d'AST à la compilation avec des déclarations cibles, `quote`, la substitution `$(...)` et des API de construction d'AST.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline exige :

- De petites macros aux responsabilités et aux cibles prises en charge clairement énoncées.
- Une expansion déterministe ; le comportement dans l'ordre du source et les membres obtenus restent découvrables.
- L'hygiène, pour éviter les collisions de noms accidentelles.
- Des diagnostics du compilateur lorsque l'expansion crée du code en conflit ou invalide.
- Des méthodes ordinaires plutôt que des macros lorsqu'il n'existe aucun bénéfice substantiel à la compilation.
- Aucune dépendance à des effets de bord non revus au moment de la macro (E/S, réseau, horloge ou aléatoire).

Le code généré doit satisfaire les vérifications sémantiques ; les outils de vérification et de formatage ne doivent pas traiter les emplacements générés comme des fichiers ordinaires maintenus à la main.

### PL-EV-016 — Ne pas programmer contre les internes de HyperAlloc Flow {#pl-ev-016--do-not-program-against-hyperalloc-flow-internals}

Le code Emvus peut être optimisé via Sublang, Optimind et HyperAlloc Flow. Les développeurs doivent exprimer la **sémantique et les durées de vie**, et non deviner manuellement une future stratégie d'allocation.

- Privilégiez des cycles de vie d'objets simples et une propriété stable.
- Gardez l'état mutable partagé explicite, surtout entre les tâches.
- Préférez les data classes immuables pour les valeurs simples lorsqu'elles conviennent au domaine.
- Ne construisez pas d'API sur l'hypothèse qu'un objet est toujours alloué sur la pile, remplacé par des scalaires ou mis en pool.
- Évaluez l'allocation et l'échappement dans les chemins critiques par la mesure et les diagnostics, pas par le folklore.

### PL-EV-017 — Densité des packages et organisation des sources {#pl-ev-017--package-density-and-source-organization}

Un package/dossier source doit contenir au maximum **8** modules `.ev` de production par défaut. Les tests, les sources générées et les fichiers contenant uniquement des métadonnées ne comptent pas. Découpez selon la responsabilité fonctionnelle réelle plutôt que de créer mécaniquement des sous-packages arbitraires.

Un nom de package et un nom de fichier sont des notions différentes : `app.session` reste en minuscules, tandis que `sessionService.ev` est en `camelCase`.

### PL-EV-018 — Les règles natives du langage priment sur l'imitation d'autres langages {#pl-ev-018--language-native-rules-override-cross-language-imitation}

Les outils Pureline ne doivent pas signaler une violation simplement parce qu'Emvus diffère de Java, d'Emerald, de Rust ou de Go :

- Les `()` facultatives dans les **déclarations de méthodes sans paramètre** sont valides ; les appels exigent toujours `()`.
- Les points-virgules facultatifs sont valides.
- `where` est la syntaxe native de déclaration des génériques.
- `var` est inféré statiquement ; `dynamic` est explicitement dynamique.
- `success`, `fail`, `?`, `!`, `scoped` et les macros AST ont des significations propres à Emvus.
- `{ ... }` a des usages valides dépendant du contexte, notamment les dictionnaires et la déstructuration positionnelle.
- `[ ... ]` est typé comme liste ou comme tuple selon la règle d'Emvus sur l'égalité exacte des types d'éléments.

Le formateur doit connaître l'AST, préserver le sens, et ne jamais appliquer aux fichiers `.ev` les namespaces `::` ni l'exigence de points-virgules d'Emerald.
