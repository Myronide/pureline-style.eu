# Pureline Code Style

Der Coding-Standard Pureline 1.7, gegliedert nach Thema und Sprache. Beginne mit der [Übersicht](overview.md), lies die gemeinsamen Regeln und wende dann das passende Sprachprofil an.

**Linearer Fluss. Explizite Absicht. Minimaler Lärm. Kleine Einheiten. Klare Verantwortung. Kohäsion vor Größe.**

## So wendest du diesen Leitfaden an {#how-to-apply-this-guide}

- Die gemeinsamen Regeln gelten überall dort, wo die Sprache sie natürlich unterstützt.
- Sprachnative Syntax und ausdrückliche Profilausnahmen haben Vorrang. Crystal erlaubt zum Beispiel einfache nachgestellte Guards, Rust erlaubt `let ... else` und folgt rustfmt, Novus verwendet `pureline:allow-else` für begründete `else`-Zweige, und Emvus erlaubt optionale Semikolons.
- Das React-Profil baut auf den Profilen für JavaScript und TypeScript auf. Wende für `.tsx`- und `.jsx`-Dateien alle drei gemeinsam an.
- TypeScript erbt zusätzlich zu seinen eigenen Regeln das JavaScript-Profil.
- Größenangaben für Funktionen und Klassen sind Heuristiken für das Review. Zusammengehörige Logik bleibt zusammen; die Zeilenzahl allein ist kein Verstoß.
- Behalte die stabilen Regel-IDs in Reviews und Diagnosen bei. Siehe das [Tooling-Modell](tooling.md).

## Gemeinsame Regeln {#shared-rules}

| Leitfaden | Inhalt |
|---|---|
| [Grundprinzipien](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Kontrollfluss](core/control-flow.md) | Guard Clauses, frühe Fehlerbehandlung, explizite Blöcke, unnötiges `else` vermeiden |
| [Benennung](core/naming.md) | Aussagekräftige Namen und lokale Konventionen |
| [Funktionen](core/functions.md) | Eine Verantwortung und Größenrichtwerte |
| [Klassen und Module](core/structure.md) | Verantwortungsgrenzen, Ordnerdichte, Kohäsion vor Größe |
| [Formatierung](core/formatting.md) | Kompakte Aufrufe und sinnvolle vertikale Gruppierung |
| [Kommentare](core/comments.md) | Erklären, warum ungewöhnliches Verhalten nötig ist |
| [Architektur](core/architecture.md) | Begründete Abstraktionen, Abhängigkeitsrichtung, explizite Abhängigkeiten |
| [Zustand und Seiteneffekte](core/state-and-side-effects.md) | Sichtbare Effekte und bewusste Mutation |
| [Performance](core/performance.md) | Gezielte Optimierung von Hot Paths |

## Sprachspezifische Regeln {#language-specific-rules}

| Profil | Regel-IDs | Besonderheiten |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Records, Interfaces mit `I`-Präfix, Null-Behandlung, Nebenläufigkeit, symmetrischer Lebenszyklus |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Klammern, Semikolons, `const`, async/await, Callbacks |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | Vererbung des JavaScript-Profils, explizite oder inferierte Typen, `unknown`, Interfaces und Unions |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Fehler-Guards, idiomatische Benennung, kleine Interfaces auf Konsumentenseite, `defer`, Goroutines |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Nachgestellte Guards, snake_case, Typinferenz, nil-Behandlung, Makros |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, Semikolons, Datenklassen, AST-Makros, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, Task-Lebenszyklen; beabsichtigtes Sprachdesign |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Ownership, Result/Option, Pattern Matching, rustfmt, RAII, async und FFI, Fehlertypen, zentrale Lints, Cancellation Safety, Platzierung von Tests |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, Pakete und Imports, `.nvh`-Komponenten, `.nvmd`-Markdown-Inhalte |
| [React](languages/react.md) | `PL-REACT-001`–`PL-REACT-014` | React 19 mit striktem TypeScript: Guards, Hooks, Effekte, Props, Context, Keys, reines Rendering, Routing |
| [Python](languages/python.md) | `PL-PY-001`–`PL-PY-012` | PEP-8-Benennung, Guard Clauses, Typannotationen, spezifische Ausnahmen, Dataclasses, ruff und Typchecker |
| [QML](languages/qml.md) | `PL-QML-001`–`PL-QML-011` | Qt-6-Komponenten, `required property`, Bindings, Theme-Tokens, Layouts, qmllint |
| [Astro](languages/astro.md) | `PL-AS-001`–`PL-AS-009` | Typisiertes Frontmatter, standardmäßig statisch, explizite Islands, scoped Styles, Content Collections |
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` | Semantische Elemente, eine Überschriftenstruktur, Labels, Alternativtexte, Dokumentkopf, Validierung |
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` | Tokens, Cascade Layers, niedrige Spezifität, kein `!important`, logische Eigenschaften, reduzierte Bewegung |
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Benennung, Nullable Reference Types, Records, `using`, async mit Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Standalone-Komponenten, Signals, OnPush, typisierte Formulare, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, typisierte Props, computed, Composables, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Statische Typisierung, `@export`, `@onready`, Signale, gdformat und gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Explizite Heap-Ownership, Fehlercodes, Guard Clauses, clang-format und clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, eindeutige Ownership, standardmäßig const, `std::expected`, Header-Aufteilung |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Standardmäßig local, Modultabellen, explizite nil-Prüfungen, luacheck und StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` und `const`, Sound Null Safety, benannte Parameter, Sealed Types |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Kleine Build-Methoden, const-Widgets, ein Ansatz für State, mounted-Prüfungen |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Standardmäßig unveränderlich, Result-Typen, `or {}`, Option-Typen, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` statt `var`, guard let, Werttypen, Zugriffskontrolle, swift-format und SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` statt `var`, Data Classes, Sealed Types, Null Safety, ktlint und detekt |

Siehe auch die [Übersicht der Sprachprofile](languages/README.md) und die [Tooling-Anforderungen](tooling.md).

## Spezifikation und Pflege {#specification-and-maintenance}

Diese Themendateien übernehmen die Regeln, Beispiele, Einschränkungen und stabilen IDs aus der [Pureline-Spezifikation 1.7](../../PURELINE_SPECIFICATION_1.7.md), der versionierten Referenzquelle. Abschnittsnummern entfallen hier, damit jedes Thema für sich gelesen werden kann; die Regel-IDs bleiben unverändert.

Wenn du die Vorgaben überarbeitest, halte die ursprüngliche Spezifikation und die zugehörige Themendatei konsistent. Nummeriere bestehende Regel-IDs nicht neu und mache aus Review-Heuristiken keine harten Verstöße.
