# Style de code Pureline

La norme de codage Pureline 1.7, organisée par sujet et par langue. Commencez par la [overview](overview.md), lisez les règles partagées, puis appliquez le profil linguistique pertinent.

**Flux linéaire. Intention explicite. Un bruit minimal. Petites unités. Propriété claire. Cohésion sur Taille.**

## Comment appliquer ce guide

- Des règles partagées s'appliquent partout où la langue les soutient naturellement.
- La syntaxe linguistique et les exceptions explicites de profil ont priorité. Par exemple, Crystal permet des gardes postfix simples, Rust autorise `let ... else` et suit rustfmt, Novus utilise `pureline:allow-else` pour des branches `else` justifiées, et Emvus permet des semi-colons optionnels.
- Le profil React se trouve en haut des profils JavaScript et TypeScript. Appliquer les trois ensemble pour les fichiers `.tsx` / `.jsx`.
- TypeScript hérite du profil JavaScript en plus de ses propres règles.
- Les gammes de taille de fonction et de classe sont des heuristiques de révision. Maintenir une logique cohérente; le compte de ligne seul n'est pas une violation.
- Préserver des ID stables dans les examens et les diagnostics. Voir le [modèle d'outil](tooling.md).

## Règles partagées

|Guide|Sommaire|
|---|---|
|[Principes fondamentaux] (core/principles.md)| `PL-CORE-001`–`PL-CORE-022` |
|[Flux de commande](core/control-flow.md)|Clauses de garde, erreurs précoces, blocs explicites, évitant `else` inutile|
|[Naming] (core/naming.md)|Noms significatifs et conventions locales|
|[Fonctions](core/functions.md)|Une responsabilité et une orientation de taille|
|[Classes et modules](core/structure.md)|Limites de responsabilité, densité de dossiers, cohésion sur taille|
|[Format] (core/formatting.md)|Appels compacts et regroupement vertical significatif|
|[Commentaires](core/comments.md)|Expliquez pourquoi un comportement inhabituel est nécessaire|
|[Architecture] (core/architecture.md)|Abstractions justifiées, direction de dépendance, dépendances explicites|
|[État et effets indésirables](core/state-and-side-effects.md)|Effets visibles et mutation intentionnelle|
|[Exécution](core/performance.md)|Optimisation de la libération des chemins chauds|

## Règles linguistiques spécifiques

|Profil|IDs de règles|Orientations particulières|
|---|---|---|
|[Java] (languages/java.md)| `PL-JAVA-001`–`PL-JAVA-010` |Enregistrements, interfaces préfixées `I`, manipulation nulle, concurrence, symétrie du cycle de vie|
|[JavaScript] (languages/javascript.md)| `PL-JS-001`–`PL-JS-007` |Braces, semi-colons, `const`, asynchrones/awit, rappels|
|[TypeScript](languages/typescript.md)| `PL-TS-001`–`PL-TS-007` |Héritage JavaScript, types explicites ou inférés, `unknown`, interfaces et syndicats|
|[Allez](languages/go.md)| `PL-GO-001`–`PL-GO-009` |Guardiers d'erreur, nommage idiomatique, petites interfaces grand public, `defer`, goroutines|
|[Crystal] (languages/crystal.md)| `PL-CR-001`–`PL-CR-008` |Gardes postfixes, cas_serpent, inférence, manipulation de nil, macros|
|[Émeraude](languages/emerald.md)| `PL-EMS-001`–`PL-EMS-012` |`.ems`, `namespace`/`use`, points-virgules, classes de données, macros AST, débit|
|[Emvus](languages/emvus.md)| `PL-EV-001`–`PL-EV-018` |`.ev`, `method<Type>`, `where`, Result, `scoped`, cycles de vie des tâches; conception de la langue prévue|
|[Rust](languages/rust.md)| `PL-RS-001`–`PL-RS-024` |Propriété, Résultat/Option, correspondance de motifs, rustfmt, RAII, async et FFI, types d'erreurs, lints centraux, sécurité d'annulation, placement de test|
|[Novus](languages/novus.md)| `PL-NV-001`–`PL-NV-013` |`.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, emballages et importations, composants `.nvh`, `.nvmd` Contenu du marquage|
|[Réagir](languages/react.md)| `PL-REACT-001`–`PL-REACT-014` |Réagir 19 avec un script de type strict: garde, crochet, effets, accessoires, contexte, clés, rendu pur, routage|
|[Python](languages/python.md)| `PL-PY-001`–`PL-PY-012` |PEP 8 nommage, clauses de garde, conseils de type, exceptions spécifiques, dataclasses, ruff et contrôles de type|
|[QML](languages/qml.md)| `PL-QML-001`–`PL-QML-011` |Qt 6 composants, `required property`, fixations, Jetons de thème, mises en page, qmllint|
|[Astro](languages/astro.md)| `PL-AS-001`–`PL-AS-009` |Avant-matière typée, statique par défaut, îles explicites, styles de champ d'application, collections de contenu|
|[HTML](languages/html.md)| `PL-HTML-001`–`PL-HTML-009` |Éléments sémantiques, structure d'un cap, étiquettes, texte alte, tête de document, validation|
|[CSS](languages/css.md)| `PL-CSS-001`–`PL-CSS-012` |Jetons, cascade couches, faible spécificité, pas de `!important`, propriétés logiques, mouvement réduit|
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Naming, nullable reference types, records, `using`, async with Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Standalone components, signals, OnPush, typed forms, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, typed props, computed, composables, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Static typing, `@export`, `@onready`, signals, gdformat and gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Explicit heap ownership, error codes, guard clauses, clang-format and clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, unique ownership, const by default, `std::expected`, header split |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Local by default, module tables, explicit nil checks, luacheck and StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` and `const`, sound null safety, named parameters, sealed types |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Small build methods, const widgets, one state approach, mounted checks |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Immutable by default, result types, `or {}`, option types, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` over `var`, guard let, value types, access control, swift-format and SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` over `var`, data classes, sealed types, null safety, ktlint and detekt |

Voir aussi [language profile panorama](languages/README.md) et [tooling requirements](tooling.md).

## Spécifications et entretien

Ces fichiers thématiques préservent les règles, les exemples, les qualifications et les ID stables à partir de la [Pureline Specification 1.7] (../../PURELINE_SPECIFICATION_1.7.md), la source de référence en version. Les numéros de section sont omis ici afin que chaque sujet puisse être lu indépendamment; les ID de la règle sont inchangés.

Lors de la révision des directives, conservez la spécification originale et le dossier thématique correspondant cohérent. Ne renumérotez pas les ID de règles existantes ou ne transformez pas l'heuristique de l'examen en violations dures.
