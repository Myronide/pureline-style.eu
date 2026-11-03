# Pureline Code Style

La norme de code Pureline 1.7, organisée par thème et par langage. Commencez par la [vue d'ensemble](overview.md), lisez les règles communes, puis appliquez le profil du langage concerné.

**Flux linéaire. Intention explicite. Bruit minimal. Petites unités. Responsabilité claire. Cohésion avant la taille.**

## Comment appliquer ce guide {#how-to-apply-this-guide}

- Les règles communes s'appliquent partout où le langage les supporte naturellement.
- La syntaxe native du langage et les exceptions explicites d'un profil ont priorité. Par exemple, Crystal autorise les guards postfixes simples, Rust autorise `let ... else` et suit rustfmt, Novus utilise `pureline:allow-else` pour les branches `else` justifiées, et Emvus autorise les points-virgules facultatifs.
- Le profil React vient se superposer aux profils JavaScript et TypeScript. Appliquez les trois ensemble pour les fichiers `.tsx` / `.jsx`.
- TypeScript hérite du profil JavaScript en plus de ses propres règles.
- Les fourchettes de taille des fonctions et des classes sont des heuristiques de revue. Gardez ensemble la logique cohérente : le nombre de lignes seul n'est pas une violation.
- Conservez les identifiants de règle stables dans les revues et les diagnostics. Voir le [modèle d'outillage](tooling.md).

## Règles communes {#shared-rules}

| Guide | Contenu |
|---|---|
| [Principes fondamentaux](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Flux de contrôle](core/control-flow.md) | Guard clauses, erreurs précoces, blocs explicites, éviter les `else` inutiles |
| [Nommage](core/naming.md) | Noms significatifs et conventions locales |
| [Fonctions](core/functions.md) | Une seule responsabilité et repères de taille |
| [Classes et modules](core/structure.md) | Frontières de responsabilité, densité des dossiers, cohésion avant la taille |
| [Mise en forme](core/formatting.md) | Appels compacts et regroupement vertical pertinent |
| [Commentaires](core/comments.md) | Expliquer pourquoi un comportement inhabituel est nécessaire |
| [Architecture](core/architecture.md) | Abstractions justifiées, sens des dépendances, dépendances explicites |
| [État et effets de bord](core/state-and-side-effects.md) | Effets visibles et mutation intentionnelle |
| [Performance](core/performance.md) | Optimisation délibérée des chemins critiques |

## Règles propres à chaque langage {#language-specific-rules}

| Profil | Identifiants de règle | Points particuliers |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Records, interfaces préfixées par `I`, gestion de null, concurrence, symétrie du cycle de vie |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Accolades, points-virgules, `const`, async/await, callbacks |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | Héritage de JavaScript, types explicites ou inférés, `unknown`, interfaces et unions |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Guards d'erreur, nommage idiomatique, petites interfaces côté consommateur, `defer`, goroutines |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Guards postfixes, snake_case, inférence, gestion de nil, macros |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, points-virgules, classes de données, macros AST, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, cycles de vie des tâches ; conception de langage envisagée |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Ownership, Result/Option, pattern matching, rustfmt, RAII, async et FFI, types d'erreur, lints centralisés, sûreté à l'annulation, emplacement des tests |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, packages et imports, composants `.nvh`, contenu Markdown `.nvmd` |
| [React](languages/react.md) | `PL-REACT-001`–`PL-REACT-014` | React 19 avec TypeScript strict : guards, hooks, effets, props, contexte, clés, rendu pur, routage |
| [Python](languages/python.md) | `PL-PY-001`–`PL-PY-012` | Nommage PEP 8, guard clauses, annotations de types, exceptions précises, dataclasses, ruff et vérificateurs de types |
| [QML](languages/qml.md) | `PL-QML-001`–`PL-QML-011` | Composants Qt 6, `required property`, bindings, tokens Theme, layouts, qmllint |
| [Astro](languages/astro.md) | `PL-AS-001`–`PL-AS-009` | Frontmatter typé, statique par défaut, îlots explicites, styles à portée limitée, collections de contenu |
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` | Éléments sémantiques, une seule structure de titres, étiquettes, texte alternatif, en-tête du document, validation |
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` | Tokens, couches de cascade, faible spécificité, pas de `!important`, propriétés logiques, mouvement réduit |
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Nommage, types référence nullables, records, `using`, async avec Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Composants standalone, signals, OnPush, formulaires typés, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, props typées, computed, composables, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Typage statique, `@export`, `@onready`, signaux, gdformat et gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Propriété explicite du tas, codes d'erreur, guard clauses, clang-format et clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, propriété unique, const par défaut, `std::expected`, séparation des en-têtes |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Local par défaut, tables de module, vérifications nil explicites, luacheck et StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` et `const`, null safety saine, paramètres nommés, types scellés |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Petites méthodes build, widgets const, une seule approche d'état, vérifications mounted |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Immuable par défaut, types résultat, `or {}`, types option, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` plutôt que `var`, guard let, types valeur, contrôle d'accès, swift-format et SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` plutôt que `var`, data classes, types scellés, null safety, ktlint et detekt |

Voir aussi la [vue d'ensemble des profils de langage](languages/README.md) et les [exigences d'outillage](tooling.md).

## Spécification et maintenance {#specification-and-maintenance}

Ces fichiers thématiques conservent les règles, les exemples, les nuances et les identifiants stables de la [spécification Pureline 1.7](../../PURELINE_SPECIFICATION_1.7.md), la source de référence versionnée. Les numéros de section sont omis ici pour que chaque thème puisse se lire indépendamment ; les identifiants de règle restent inchangés.

Lorsque vous révisez le guide, gardez la spécification d'origine et le fichier thématique correspondant cohérents. Ne renumérotez pas les identifiants de règle existants et ne transformez pas des heuristiques de revue en violations strictes.
