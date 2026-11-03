# Style de code Emerald

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Emerald {#emerald-profile}

Pureline Emerald suit la **syntaxe native d'Emerald** au lieu d'emprunter la syntaxe Emvus envisagée. Emerald est aussi le langage d'amorçage (bootstrap) d'Emvus ; cette distinction compte donc pour les outils et le code du compilateur.

### PL-EMS-001 — Garder une syntaxe Emerald native {#pl-ems-001--keep-emerald-syntax-native}

Emerald utilise des fichiers `.ems`, des déclarations `namespace` et `use` avec `::`, les types de retour avant les noms de méthode, et des points-virgules.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Ne réécrivez **pas** les déclarations Emerald avec `package`, `method<T>`, `where` ou du code sans point-virgule propres à Emvus. Ce sont des langages différents.

### PL-EMS-002 — Utiliser les points-virgules de façon cohérente {#pl-ems-002--use-semicolons-consistently}

Suivez la syntaxe d'instructions à points-virgules d'Emerald. Un formateur ne doit pas appliquer aux fichiers `.ems` la règle des points-virgules facultatifs d'Emvus.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Noms et organisation des fichiers {#pl-ems-003--names-and-file-organization}

- Types : `PascalCase`.
- Interfaces : préfixe `I` (`IStorage`, `IPacket`).
- Méthodes, paramètres, champs et variables locales : `camelCase`.
- Constantes : `UPPER_SNAKE_CASE` le cas échéant.
- Gardez les déclarations `namespace` et `use` explicites.
- Préférez des fichiers sources nommés d'après leur type principal, en respectant les conventions de nommage existantes du dépôt Emerald (par exemple `SessionService.ems`).
- Utilisez au maximum **8** fichiers `.ems` de production par dossier source/namespace par défaut ; les tests et les sources générées sont exclus.

Ne renommez pas des fichiers sources existants qui fonctionnent simplement pour satisfaire une hypothétique convention commune à tous les langages.

### PL-EMS-004 — Guard clauses avec accolades {#pl-ems-004--guard-clauses-with-braces}

Utilisez des blocs explicites et gardez le chemin nominal sans imbrication.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Évitez `else` lorsqu'un `return`, un `continue` ou une autre interruption précoce le rend inutile. Les instructions `if` sur une ligne sans accolades ne sont pas du Pureline Emerald.

### PL-EMS-005 — Types explicites et `var` sont tous deux valides {#pl-ems-005--explicit-types-and-var-are-both-valid}

Utilisez un type déclaré lorsqu'il clarifie une frontière d'API. Utilisez `var` lorsque le type inféré statiquement est immédiatement évident ; `var` n'est **pas** une demande de typage dynamique.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Aucune des deux formes ne doit être signalée comme une violation de style simplement parce que l'autre est possible.

### PL-EMS-006 — Préserver le modèle objet d'Emerald {#pl-ems-006--preserve-emeralds-object-model}

Utilisez la forme normale d'appel de constructeur d'Emerald, sans mot-clé `new` à la manière de Java.

```java
Connection connection = Connection();
```

Gardez explicites les constructeurs, les champs, l'héritage et les interfaces. Préférez de petites classes cohésives à des couches supplémentaires de manager/factory sans responsabilité concrète.

### PL-EMS-007 — Préférer les data classes pour les types orientés données {#pl-ems-007--prefer-data-classes-for-data-shaped-types}

Lorsqu'un type regroupe avant tout des données liées et que les membres générés pris en charge par Emerald conviennent, préférez une data class à du code répétitif.

```java
public data class Coordinate(Int x, Int y);
```

La génération de data class d'Emerald inclut un constructeur, `equals`, `toString`, `copy` et des méthodes `withX` le cas échéant. Ne supposez pas que les fonctionnalités de data class propres à Emvus, comme `copy` avec arguments nommés, `hashCode` généré ou la déstructuration d'Emvus, font déjà partie d'Emerald.

### PL-EMS-008 — N'utiliser les macros que pour de véritables abstractions à la compilation {#pl-ems-008--use-macros-only-for-genuine-compile-time-abstractions}

Le système de macros AST d'Emerald convient à la génération structurelle répétitive, pas à la dissimulation de la logique ordinaire d'un programme.

- Préférez de petites macros d'annotation clairement nommées.
- Rendez les champs et méthodes générés découvrables par les mainteneurs et par les outils.
- Évitez de remplacer une méthode simple par un comportement de macro difficile à déboguer.
- Ne vous appuyez pas sur des capacités de macro non documentées et ne modifiez pas silencieusement des déclarations sans rapport.
- Séparez les transformations à la compilation des effets de bord à l'exécution.

### PL-EMS-009 — Rendre explicites les chemins d'erreur {#pl-ems-009--make-error-paths-explicit}

Utilisez le mécanisme d'erreur pris en charge par l'API Emerald réelle. Lorsqu'une fonction retourne `Result<T, E>`, traitez-le ou transmettez-le de façon intentionnelle. Ne copiez pas dans du code Emerald les constructions propres à Emvus telles que `success value`, `fail error`, le `?` postfixe ou `scoped`, sauf si cette syntaxe y est implémentée séparément.

Protégez-vous tôt contre les entrées invalides et rendez visibles les échecs inattendus plutôt que de les avaler.

### PL-EMS-010 — La concurrence a un propriétaire {#pl-ems-010--concurrency-has-ownership}

Les mécanismes `Fiber`, `@Async`, `@Synchronized` et les threads d'Emerald doivent être utilisés avec des cycles de vie explicites.

- Gardez les traitements bloquants hors des threads d'exécution inappropriés.
- Attendez (await) les opérations dont le résultat ou l'échec compte.
- Synchronisez l'état mutable partagé de façon intentionnelle.
- Ne confondez pas exécution asynchrone et sûreté vis-à-vis des threads automatique.

### PL-EMS-011 — Garder le code sensible à Flow compréhensible {#pl-ems-011--keep-flow-sensitive-code-understandable}

Emerald Flow peut optimiser l'allocation et la durée de vie des objets, mais la sémantique lisible du code source reste prioritaire.

- Préférez des références locales stables lorsque plusieurs lectures seraient ambiguës.
- Ne vous appuyez pas manuellement sur des choix de stockage non documentés comme `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` ou `Static`.
- Évitez les échappements cachés et les références durables accidentelles dans les chemins critiques.
- Considérez les stratégies de l'optimiseur comme des détails d'implémentation du compilateur, pas comme des rituels de codage au niveau source.

### PL-EMS-012 — Tester les abstractions exposées au compilateur {#pl-ems-012--test-compiler-facing-abstractions}

Pour le code de compilateur, d'AST et d'exécution, écrivez des tests pour les cas limites, les chemins d'erreur, les membres générés et le comportement de la durée de vie des objets. Une méthode plus courte n'est pas automatiquement meilleure si elle masque une transition de phase ou un effet de bord important.
