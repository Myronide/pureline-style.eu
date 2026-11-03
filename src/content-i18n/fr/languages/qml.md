# Style de code QML

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. QML est déclaratif: un fichier décrit un arbre d'objets, ses propriétés et ses liaisons. JavaScript inside QML est pour les petites expressions et les gestionnaires, et le [JavaScript profile](javascript.md) s'applique à chaque bloc dans lui. Pureline QML cible **Qt 6** avec Qt Quick.

## Profil QML

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Un objet racine par fichier

Chaque fichier `.qml` définit un composant dont le nom est le nom du fichier (`SessionCard.qml` définit `SessionCard`). Mettez les composants d'aide imbriqués dans leurs propres fichiers lorsqu'ils sont réutilisés; gardez un helper en ligne seulement lorsque rien d'autre ne l'utilise.

### PL-QML-002 — Désignation

- Fichiers de composants et noms de types : `PascalCase`.
- Propriétés, signaux, fonctions et ids: `lowerCamelCase`.
- Ids nomme le rôle de l'objet (`titleLabel`, `retryButton`), jamais son type ou sa position (`text1`, `rect2`).
- Les gestionnaires de signaux suivent le nom du signal: `onClicked`, `onAccepted`.

### PL-QML-003 — Déclarer explicitement les interfaces

Déclarez les entrées d'un composant avec `required property` et un type. Utilisez `readonly property` pour calculer les valeurs du composant. Activer `pragma ComponentBehavior: Bound` de façon à ce que les ids résolvent par une portée explicite.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Reliure sur l'attribution impérative

État express comme une liaison (`visible: user.active`). Ne copiez pas les valeurs dans `Component.onCompleted` ou dans les gestionnaires lorsqu'une liaison les maintient correctement. Assigner obligatoirement seulement pour une action ponctuelle, comme démarrer une animation ou envoyer une requête.

### PL-QML-005 — Les gardes sont des liens ou des retours anticipés

Utilisez `visible`, `enabled` et `Loader.active` pour changer de branche. Dans une fonction JavaScript, retourner tôt au lieu de nicher le chemin principal dans un état.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Gardez les expressions petites

Une liaison contient une expression d'au plus un conditionnel et un appel court. Déplacer la logique plus longue dans une fonction nommée ou un objet de backend C++ / Python. Les ternaires ne sont pas Pureline.

### PL-QML-007 — Ordre de propriété regroupe l'objet

Écrivez les propriétés d'un objet dans cet ordre, avec une ligne blanche entre les groupes: identité (`id`), propriétés requises et publiques, fixations, objets pour enfants, gestionnaires de signaux, fonctions.

### PL-QML-008 — La disposition est déclarative

Utilisez les types `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) et les ancrages pour le placement. Ne pas coder les valeurs absolues `x` et `y` pour le contenu qui doit s'adapter à la taille. Les tailles codées en dur appartiennent aux jetons de conception dans un monoton `Theme`.

### PL-QML-009 — Thème et jetons en un seul endroit

Les couleurs, l'espacement et les tailles de police proviennent d'un seulton `Theme` (`pragma Singleton`). Les composants lisent les jetons; ils ne répètent jamais les valeurs littérales.

### PL-QML-010 — Densité du dossier

Un dossier de composants QML détient au plus des fichiers **10** par défaut. Grouper les composants par fonction (`views/session/`) et garder les commandes partagées dans un dossier `controls/`.

### PL-QML-011 — Outillage

Exécutez `qmllint` (avec les avertissements `--unqualified` activés) et l'outil `qmlformat` dans CI. Testez le comportement avec `QtTest` et gardez les avertissements intentionnels.
