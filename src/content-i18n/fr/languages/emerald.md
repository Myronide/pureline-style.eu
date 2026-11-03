# Style de code Emerald

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille] (../core/structure.md) s'applique tout au long.

## Profil d'Emerald

Pureline Emerald suit la syntaxe **native Emerald** au lieu d'emprunter la syntaxe Emvus proposée. Emerald est aussi le langage bootstrap pour Emvus, donc cette distinction est importante pour les outils et le code de la propriété.

### PL-EMS-001 — Gardez Emerald Syntax Native

Emerald utilise des fichiers `.ems`, des déclarations `namespace` et `use` avec `::`, des types de retour avant les noms de méthode et des point-virgules.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Do **not** réécrire les déclarations Emerald comme code sans point de contact Emvus `package`, `method<T>`, `where` ou semi-colon. Ce sont des langues différentes.

### PL-EMS-002 — Utiliser les semi-conducteurs de façon cohérente

Suivez la syntaxe de la déclaration basée sur le point-virgule d'Emerald. Une matière ne doit pas appliquer la règle Emvus facultatif-sémicolon aux fichiers `.ems`.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Noms et organisation du fichier

- Types: `PascalCase`.
- Interfaces : Préfixe `I` (`IStorage`, `IPacket`).
- Méthodes, paramètres, champs et locaux: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE` le cas échéant.
- Gardez les déclarations `namespace` et `use` explicites.
- Préférez les fichiers sources nommés d'après leur type principal, en respectant les conventions existantes de nommage de dépôt Emerald (par exemple `SessionService.ems`).
- Utiliser au maximum les fichiers **8** de production `.ems` par source/namespace par défaut; les tests et les sources générées sont exclus.

Ne renommez pas les fichiers sources de travail existants simplement pour satisfaire à une hypothétique convention inter-langues.

### PL-EMS-004 — Clauses de garde avec bracs

Utilisez des blocs explicites et gardez le chemin réussi non-nécessaire.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Évitez `else` quand une `return`, `continue` ou une autre terminaison précoce la rend inutile. Les indications `if` sans bretelles en ligne ne sont pas Pureline Emerald.

### PL-EMS-005 — Types explicites et `var` sont tous les deux valides

Utilisez un type déclaré lorsqu'il clarifie une limite d'API. Utilisez `var` où un type déduit statiquement est immédiatement évident; `var` est **not** une demande de typage dynamique.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Aucune des deux formes ne devrait être signalée comme une violation de style simplement parce que l'autre est possible.

### PL-EMS-006 — Préserver le modèle d'objet d'Emerald

Utilisez le formulaire d'appel normal d'Emerald sans mot-clé Java `new`.

```java
Connection connection = Connection();
```

Gardez les constructeurs, les champs, les héritages et les interfaces explicites. Préférez les petites classes cohésives par rapport aux couches supérieures de gestionnaire/usine sans responsabilité concrète.

### PL-EMS-007 — Classes de données préférentielles pour les types de données

Lorsqu'un type regroupe principalement des données liées et que les membres d'Emerald sont bien pris en charge, préférez une classe de données par rapport à une plaque de chaudière répétée.

```java
public data class Coordinate(Int x, Int y);
```

La génération de classes de données d'Emerald comprend un constructeur, des méthodes `equals`, `toString`, `copy` et `withX`, le cas échéant. Ne présumez pas que les fonctionnalités de classe de données Emvus-seulement telles que name- argument `copy`, généré `hashCode`, ou destructuration Emvus font déjà partie d'Emerald.

### PL-EMS-008 — Utiliser des macros seulement pour les abstractions de temps compilé authentique

Le système macro AST d'Emerald est approprié pour la génération structurale répétitive, et non pour déguiser la logique de programme ordinaire.

- Préférez les petites macros d'annotation clairement nommées.
- Faire des champs et des méthodes générés découvrables pour les responsables et les outils.
- Évitez de remplacer une méthode simple par un comportement macro difficile à déboguer.
- Ne pas se fier à des capacités macro-déclarées ou à des déclarations muettes silencieusement.
- Gardez compil-time de la transformation séparée des effets secondaires d'exécution.

### PL-EMS-009 — Expliciter les trajectoires d'erreur

Utilisez le mécanisme d'erreur supporté par l'API Emerald actuelle. Lorsqu'une fonction renvoie `Result<T, E>`, la manipuler ou la faire avancer intentionnellement. Ne copiez pas les constructions `success value`, `fail error`, postfix `?` ou `scoped` spécifiques à Emvus dans le code Emerald, sauf si cette syntaxe y est mise en œuvre séparément.

Préservez les entrées non valides tôt et faites une défaillance inattendue visible plutôt que de l'avaler.

### PL-EMS-010 — La monnaie de contrepartie est propriétaire

Les installations `Fiber`, `@Async`, `@Synchronized` et thread d'Emerald devraient être utilisées avec des cycles de vie explicites.

- Continuez à bloquer le travail hors des fils d'exécution inappropriés.
- Les opérations de grande envergure dont les résultats ou les échecs comptent.
- Synchroniser l'état mutable partagé intentionnellement.
- Ne confondez pas l'exécution asynchronous avec la sécurité automatique du filetage.

### PL-EMS-011 — Gardez le code sensible au débit compréhensible

Emerald Flow peut optimiser l'allocation et la durée de vie des objets, mais la sémantique de source lisible prend la priorité.

- Préférez des références locales stables lorsque plusieurs lectures seraient ambiguës.
- Ne pas utiliser manuellement les options de stockage `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` ou `Static` sans papiers.
- Évitez les évasions cachées et les références accidentelles de longue durée dans les sentiers chauds.
- Traiter les stratégies d'optimisation comme des détails de mise en œuvre de la base, pas des rituels de codage de niveau source.

### PL-EMS-012 — Abstractions de compilateurs d'essai

Pour les codes de la série de données de la série de données de l'AST, de l'AST et de l'exécution, écrivez des tests pour les conditions de limite, les chemins d'erreur, les membres générés et le comportement de vie des objets. Une méthode plus courte n'est pas automatiquement meilleure si elle cache une transition de phase ou un effet secondaire important.
