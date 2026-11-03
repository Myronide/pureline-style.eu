# Pureline-codestijl

De Pureline 1.7-codeerstandaard, geordend per onderwerp en per taal. Begin met het [overzicht](overview.md), lees de gedeelde regels en pas daarna het relevante taalprofiel toe.

**Lineaire stroom. Expliciete intentie. Minimale ruis. Kleine eenheden. Helder eigenaarschap. Samenhang boven omvang.**

## Deze gids toepassen {#how-to-apply-this-guide}

- Gedeelde regels gelden overal waar de taal ze op een natuurlijke manier ondersteunt.
- Taaleigen syntaxis en expliciete profielvrijstellingen gaan voor. Crystal staat bijvoorbeeld eenvoudige postfix-guards toe, Rust staat `let ... else` toe en volgt rustfmt, Novus gebruikt `pureline:allow-else` voor gemotiveerde `else`-takken, en Emvus staat optionele puntkomma's toe.
- Het React-profiel bouwt voort op de JavaScript- en TypeScript-profielen. Pas voor `.tsx`- en `.jsx`-bestanden alle drie samen toe.
- TypeScript erft naast de eigen regels ook het JavaScript-profiel.
- De groottebereiken voor functies en klassen zijn richtlijnen voor review. Houd samenhangende logica bij elkaar; het aantal regels alleen is geen overtreding.
- Behoud vaste regel-ID's in reviews en diagnostiek. Zie het [toolingmodel](tooling.md).

## Gedeelde regels {#shared-rules}

| Gids | Inhoud |
|---|---|
| [Kernprincipes](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Besturingsstroom](core/control-flow.md) | Guard clauses, vroege fouten, expliciete blokken, onnodige `else` vermijden |
| [Naamgeving](core/naming.md) | Betekenisvolle namen en lokale conventies |
| [Functies](core/functions.md) | Eén verantwoordelijkheid en richtlijnen voor grootte |
| [Klassen en modules](core/structure.md) | Verantwoordelijkheidsgrenzen, mapdichtheid, Samenhang boven omvang |
| [Opmaak](core/formatting.md) | Compacte aanroepen en betekenisvolle verticale groepering |
| [Opmerkingen](core/comments.md) | Leg uit waarom afwijkend gedrag nodig is |
| [Architectuur](core/architecture.md) | Gerechtvaardigde abstracties, afhankelijkheidsrichting, expliciete afhankelijkheden |
| [Toestand en neveneffecten](core/state-and-side-effects.md) | Zichtbare effecten en bewuste mutatie |
| [Prestaties](core/performance.md) | Bewuste optimalisatie van hot paths |

## Taalspecifieke regels {#language-specific-rules}

| Profiel | Regel-ID's | Bijzondere richtlijnen |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Records, interfaces met `I`-prefix, null-afhandeling, concurrency, symmetrie in de levenscyclus |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Accolades, puntkomma's, `const`, async/await, callbacks |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | JavaScript-overerving, expliciete of afgeleide typen, `unknown`, interfaces en unions |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Foutguards, idiomatische naamgeving, kleine consumer-interfaces, `defer`, goroutines |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Postfix-guards, snake_case, inferentie, nil-afhandeling, macro's |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, puntkomma's, dataklassen, AST-macro's, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, levenscycli van taken; beoogd taalontwerp |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Ownership, Result/Option, patroonherkenning, rustfmt, RAII, async en FFI, foutentypen, centrale lints, annuleringsveiligheid, plaatsing van tests |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, packages en imports, `.nvh`-componenten, `.nvmd`-Markdown-inhoud |
| [React](languages/react.md) | `PL-REACT-001`–`PL-REACT-014` | React 19 met strikt TypeScript: guards, hooks, effecten, props, context, keys, pure render, routing |
| [Python](languages/python.md) | `PL-PY-001`–`PL-PY-012` | PEP 8-naamgeving, guard clauses, typehints, specifieke uitzonderingen, dataclasses, ruff en typecheckers |
| [QML](languages/qml.md) | `PL-QML-001`–`PL-QML-011` | Qt 6-componenten, `required property`, bindings, Theme-tokens, layouts, qmllint |
| [Astro](languages/astro.md) | `PL-AS-001`–`PL-AS-009` | Getypeerde frontmatter, standaard statisch, expliciete islands, scoped stijlen, content collections |
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` | Semantische elementen, één kopstructuur, labels, alt-tekst, documentkop, validatie |
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` | Tokens, cascade layers, lage specificiteit, geen `!important`, logische eigenschappen, beperkte beweging |
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Naamgeving, nullable reference types, records, `using`, async met Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Standalone componenten, signals, OnPush, getypeerde formulieren, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, getypeerde props, computed, composables, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Statische typering, `@export`, `@onready`, signals, gdformat en gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Expliciet heap-eigenaarschap, foutcodes, guard clauses, clang-format en clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, uniek eigenaarschap, standaard const, `std::expected`, scheiding van headers |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Standaard local, moduletabellen, expliciete nil-controles, luacheck en StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` en `const`, sound null safety, benoemde parameters, sealed types |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Kleine build-methoden, const-widgets, één aanpak voor toestand, mounted-controles |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Standaard onveranderlijk, resultaattypen, `or {}`, optietypen, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` boven `var`, guard let, waardetypen, toegangscontrole, swift-format en SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` boven `var`, dataklassen, sealed types, null safety, ktlint en detekt |

Zie ook het [overzicht van taalprofielen](languages/README.md) en de [toolingvereisten](tooling.md).

## Specificatie en onderhoud {#specification-and-maintenance}

Deze onderwerpbestanden bewaren de regels, voorbeelden, kanttekeningen en vaste ID's uit de [Pureline Specification 1.7](../../PURELINE_SPECIFICATION_1.7.md), het versiebeheerde referentiedocument. Sectienummers zijn hier weggelaten, zodat elk onderwerp onafhankelijk te lezen is; de regel-ID's zijn ongewijzigd.

Houd bij het herzien van richtlijnen de oorspronkelijke specificatie en het bijbehorende onderwerpbestand consistent. Hernummer bestaande regel-ID's niet en maak van richtlijnen voor review geen harde overtredingen.
