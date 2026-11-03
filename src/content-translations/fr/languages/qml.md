# Style de code QML

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. QML est déclaratif : un fichier décrit un arbre d'objets, ses propriétés et ses bindings. Le JavaScript à l'intérieur de QML sert aux petites expressions et aux gestionnaires, et le [profil JavaScript](javascript.md) s'applique à chacun de ses blocs. Pureline QML cible **Qt 6** avec Qt Quick.

## Profil QML {#qml-profile}

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Un seul objet racine par fichier {#pl-qml-001--one-root-object-per-file}

Chaque fichier `.qml` définit un composant dont le nom est celui du fichier (`SessionCard.qml` définit `SessionCard`). Placez les composants auxiliaires imbriqués dans leurs propres fichiers lorsqu'ils sont réutilisés ; ne gardez un auxiliaire en ligne que si rien d'autre ne l'utilise.

### PL-QML-002 — Nommage {#pl-qml-002--naming}

- Fichiers de composants et noms de types : `PascalCase`.
- Propriétés, signaux, fonctions et ids : `lowerCamelCase`.
- Les ids nomment le rôle de l'objet (`titleLabel`, `retryButton`), jamais son type ni sa position (`text1`, `rect2`).
- Les gestionnaires de signaux suivent le nom du signal : `onClicked`, `onAccepted`.

### PL-QML-003 — Déclarer les interfaces explicitement {#pl-qml-003--declare-interfaces-explicitly}

Déclarez les entrées d'un composant avec `required property` et un type. Utilisez `readonly property` pour les valeurs que le composant calcule. Activez `pragma ComponentBehavior: Bound` afin que les ids se résolvent à travers une portée explicite.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Des bindings plutôt que l'affectation impérative {#pl-qml-004--bindings-over-imperative-assignment}

Exprimez l'état par un binding (`visible: user.active`). Ne copiez pas de valeurs dans `Component.onCompleted` ni dans des gestionnaires lorsqu'un binding les garderait correctes. N'affectez de manière impérative que pour une action ponctuelle, comme démarrer une animation ou envoyer une requête.

### PL-QML-005 — Les guards sont des bindings ou des retours anticipés {#pl-qml-005--guards-are-bindings-or-early-returns}

Utilisez `visible`, `enabled` et `Loader.active` pour basculer entre les branches. Dans une fonction JavaScript, retournez tôt au lieu d'imbriquer le chemin principal dans une condition.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Garder les expressions petites {#pl-qml-006--keep-expressions-small}

Un binding contient une seule expression, avec au plus une condition et un appel court. Déplacez la logique plus longue dans une fonction nommée ou dans un objet backend C++ / Python. Les ternaires imbriqués ne sont pas du Pureline.

### PL-QML-007 — L'ordre des propriétés regroupe l'objet {#pl-qml-007--property-order-groups-the-object}

Écrivez les propriétés d'un objet dans cet ordre, avec une ligne vide entre les groupes : identité (`id`), propriétés requises et publiques, bindings, objets enfants, gestionnaires de signaux, fonctions.

### PL-QML-008 — La mise en page est déclarative {#pl-qml-008--layout-is-declarative}

Utilisez les types `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) et les ancres pour le placement. N'écrivez pas de valeurs absolues `x` et `y` en dur pour du contenu qui doit s'adapter à la taille. Les tailles codées en dur relèvent des tokens de design dans un singleton `Theme`.

### PL-QML-009 — Thème et tokens à un seul endroit {#pl-qml-009--theme-and-tokens-in-one-place}

Les couleurs, les espacements et les tailles de police proviennent d'un seul singleton `Theme` (`pragma Singleton`). Les composants lisent les tokens ; ils ne répètent jamais de valeurs littérales.

### PL-QML-010 — Densité des dossiers {#pl-qml-010--folder-density}

Un dossier de composants QML contient au maximum **10 fichiers** par défaut. Regroupez les composants par fonctionnalité (`views/session/`) et gardez les contrôles partagés dans un seul dossier `controls/`.

### PL-QML-011 — Outillage {#pl-qml-011--tooling}

Exécutez `qmllint` (avec les avertissements `--unqualified` activés) et l'outil `qmlformat` en CI. Testez le comportement avec `QtTest` et gardez les avertissements intentionnels.
