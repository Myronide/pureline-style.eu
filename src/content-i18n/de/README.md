# Pureline-Codestil

Der Pureline 1.7-Codestandard, organisiert nach Thema und Sprache. Start with the [overview](overview.md), read the shared rules, then apply the relevant language profile.

**Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Kohäsion über Größe.**

## How to apply this guide

- Shared rules apply wherever the language supports them naturally.
- Language-native syntax and explicit profile exceptions take precedence. For example, Crystal allows simple postfix guards, Rust allows `let ... else` and follows rustfmt, Novus uses `pureline:allow-else` for justified `else` branches, and Emvus allows optional semicolons.
- The React profile sits on top of the JavaScript and TypeScript profiles. Apply all three together for `.tsx` / `.jsx` files.
- TypeScript inherits the JavaScript profile in addition to its own rules.
- Funktion und Klassengrößenbereiche sind Review-Heuristiken. Halten Sie die Logik zusammen; Linienzählung allein ist keine Verletzung.
- Preserve stabile Regel-IDs in Reviews und Diagnosen. Siehe das [Werkzeugmodell](tooling.md).

## Gemeinsame Regeln

|Leitfaden|Inhalt|
|---|---|
|[Kore-Prinzipien](core/principles.md)| `PL-CORE-001`–`PL-CORE-022` |
|[Kontrollstrom](core/control-flow.md)|Schutzklauseln, frühe Fehler, explizite Blöcke, Vermeidung unnötiger `else`|
| [Naming](core/naming.md) |Sinnvolle Namen und lokale Kongresse|
|[Funktionen](core/functions.md)|Eine Verantwortung und Größenorientierung|
|[Klassen und Module](core/structure.md)|Verantwortung Grenzen, Ordnerdichte, Kohäsion über Größe|
| [Formatting](core/formatting.md) |Kompakte Anrufe und sinnvolle vertikale Gruppierung|
|[Deine Meinung](core/comments.md)|Erklären Sie, warum ungewöhnliches Verhalten notwendig ist|
|[Architektur](core/architecture.md)|Berechtigte Abstraktionen, Abhängigkeitsrichtung, explizite Abhängigkeiten|
|[Zustand und Nebenwirkungen](core/state-and-side-effects.md)|Sichtbare Wirkungen und beabsichtigte Mutation|
|[Aufführung](core/performance.md).|Optimierung von Heißpfaden mit dem Deliberat|

## Sprachenspezifische Regeln

|Profil|Regel-IDs|Besondere Leitlinien|
|---|---|---|
|[Java](languages/java.md).| `PL-JAVA-001`–`PL-JAVA-010` |Aufzeichnungen, `I`-voreingestellte Schnittstellen, null Handhabung, Konkurrenz, Lebenszyklussymmetrie|
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Braces, semicolons, `const`, async/await, callbacks |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | JavaScript inheritance, explicit or inferred types, `unknown`, interfaces and unions |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Error guards, idiomatic naming, small consumer interfaces, `defer`, goroutines |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Postfix guards, snake_case, inference, nil handling, macros |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, semicolons, data classes, AST macros, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, task lifecycles; intended language design |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Ownership, Result/Option, pattern matching, rustfmt, RAII, async and FFI, error types, central lints, cancellation safety, test placement |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, packages and imports, `.nvh` components, `.nvmd` Markdown content |
|[Reagieren](languages/react.md)...| `PL-REACT-001`–`PL-REACT-014` |Reagieren Sie 19 mit strengem TypeScript: Wärter, Haken, Effekte, Requisiten, Kontext, Tasten, reine Render, Routing|
|[Python](languages/python.md)| `PL-PY-001`–`PL-PY-012` |PEP 8 Namens-, Schutzklauseln, Typ-Hinweise, spezifische Ausnahmen, Datenklassen, Geräte- und Typprüfer|
|[QML](languages/qml.md)| `PL-QML-001`–`PL-QML-011` |Qt 6 Komponenten, `required property`, Bindungen, Theme Token, Layouts, Xmlint|
|(Astro) (languages/astro.md)| `PL-AS-001`–`PL-AS-009` |Typierte Frontmaterie, statische Standardeinstellung, explizite Inseln, scoped Stile, Inhaltssammlungen|
|(HTML) (languages/html.md)| `PL-HTML-001`–`PL-HTML-009` |Semantische Elemente, eine Überschrift Struktur, Etiketten, Alttext, Dokumentenkopf, Validierung|
|[CSS](languages/css.md)...| `PL-CSS-001`–`PL-CSS-012` |Token, Kaskadenschichten, geringe Spezifität, kein `!important`, logische Eigenschaften, reduzierte Bewegung|
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

Siehe auch die [Sprachenprofilübersicht](languages/README.md) und [Werkzeuganforderungen](tooling.md).

## Spezifikation und Wartung

Diese Themendateien bewahren die Regeln, Beispiele, Qualifikationen und stabilen IDs aus der [Pureline Specification 1.7](../../PURELINE_SPECIFICATION_1.7.md), der versionierten Referenzquelle. Hier werden Abschnittsnummern weggelassen, so dass jedes Thema unabhängig gelesen werden kann; Regel-IDs sind unverändert.

Bei der Überarbeitung der Anleitung halten Sie die ursprüngliche Spezifikation und die entsprechende Themendatei konsistent. Nicht umnummerieren bestehende Regel-IDs oder machen Überprüfung Heuristiken in harte Verstöße.
