# Pureline Code Style

The Pureline 1.7 coding standard, organized by topic and language. Start with the [overview](overview.md), read the shared rules, then apply the relevant language profile.

**Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Cohesion over Size.**

## How to apply this guide

- Shared rules apply wherever the language supports them naturally.
- Language-native syntax and explicit profile exceptions take precedence. For example, Crystal allows simple postfix guards, Rust allows `let ... else` and follows rustfmt, Novus uses `pureline:allow-else` for justified `else` branches, and Emvus allows optional semicolons.
- The React profile sits on top of the JavaScript and TypeScript profiles. Apply all three together for `.tsx` / `.jsx` files.
- TypeScript inherits the JavaScript profile in addition to its own rules.
- Function and class size ranges are review heuristics. Keep cohesive logic together; line count alone is not a violation.
- Preserve stable rule IDs in reviews and diagnostics. See the [tooling model](tooling.md).

## Shared rules

| Guide | Contents |
|---|---|
| [Core principles](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
|[Fonte di controllo](core/control-flow.md)|Clausole di guardia, errori precoci, blocchi espliciti, evitando `else` inutili|
|[Naming](core/naming.md)|Nomi significativi e convenzioni locali|
|[Functions](core/functions.md)|Una responsabilità e un orientamento di dimensioni|
|[Classi e moduli](core/structure.md)|Limiti di responsabilità, densità delle cartelle, Coesione su dimensione|
|[Formattare](core/formatting.md)|Chiamate compatte e raggruppamento verticale significativo|
|[Commenti](core/comments.md)|Spiegare perché è necessario behavior insolito|
|[Architecture](core/architecture.md)|Astrazione giustificata, direzione della dipendenza, dipendenze esplicite|
|[Effetti di stato e di origine](core/state-and-side-effects.md)|Effetti visibili e mutazione intenzionale|
|[Prestazione](core/performance.md)|Ottimizzazione dei percorsi caldi Deliberate|

## Norme specifiche per le lingue

|Profilo|ID regola|Orientamenti particolari|
|---|---|---|
|[Java](languages/java.md)| `PL-JAVA-001`–`PL-JAVA-010` |Records, interfacce `I`-prefisse, gestione nulla, convergenza, simmetria ciclo di vita|
|[JavaScript](languages/javascript.md)| `PL-JS-001`–`PL-JS-007` |Braccia, punti e virgola, `const`, asincroni/atteso, richiamate|
|[TypeScript](languages/typescript.md)| `PL-TS-001`–`PL-TS-007` |Eredità JavaScript, tipi espliciti o inferiti, `unknown`, interfacce e sindacati|
|[Go](languages/go.md)| `PL-GO-001`–`PL-GO-009` |Protezione degli errori, nomi idiomatici, piccole interfacce di consumo, `defer`, goroutines|
|[Crystal](languages/crystal.md)| `PL-CR-001`–`PL-CR-008` |Protezioni postfix, snark_case, inferenza, gestione zero, macro|
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, semicolons, data classes, AST macros, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, task lifecycles; intended language design |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` |Proprietà, risultato/opzione, corrispondenza dei modelli, rustfmt, RAII, async e FFI, tipi di errore, linti centrali, sicurezza di cancellazione, posizionamento dei test|
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, packages and imports, `.nvh` components, `.nvmd` Markdown content |
|[React](languages/react.md)| `PL-REACT-001`–`PL-REACT-014` |Reagisci 19 con TypeScript severo: archi, agganci, effetti, effetti, effetti, effetti, truccature, truccature|
|[Python](languages/python.md)| `PL-PY-001`–`PL-PY-012` |PEP 8 nomi, clausole di protezione, suggerimenti di tipo, eccezioni specifiche, dati... e pedine|
|[QML](languages/qml.md)| `PL-QML-001`–`PL-QML-011` |Componenti Qt 6, `required property`, legature, Token a tema, layout, qmllnt|
|[Astro](languages/astro.md)| `PL-AS-001`–`PL-AS-009` |Frontmatter digitato, statico per impostazione predefinita, isole esplicite, stili a scopo, collezioni di contenuti|
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` |Elementi semantici, struttura di una sola rubrica, etichette, testo alt, testa del documento, convalida|
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` |Token, livelli a cascata, bassa specificità, senza `!important`, proprietà logiche, movimento ridotto|
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` |Naming, tipi di riferimento di npoble, record, `using`, async con Task, LINQ, formato dotnet|
|[Angolare](languages/angular.md) (A) (A) (A)| `PL-NG-001`–`PL-NG-009` |Componenti standalone, segnali, OnPush, forme digitate, `ng lint`|
|[Vue](languages/vue.md) (CZ) (CZ) (CZ)| `PL-VUE-001`–`PL-VUE-010` |`<script setup lang="ts">`, puntelli digitati, calcolati, composables, Pinia|
|[GLScript](languages/gdscript.md)| `PL-GD-001`–`PL-GD-010` |Digitazione statica, `@export`, `@onready`, segnali, gdformat e gdlint|
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` |Proprieta' esplicita del mucchio, codici di errore, clausole di protezione, c-lang-formato e c-lang-ordine|
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` |RAII, proprietà unica, conto per impostazione predefinita, `std::expected`, divisione intestazione|
|[Lua](languages/lua.md)| `PL-LUA-001`–`PL-LUA-012` |Locale per impostazione predefinita, tabelle dei moduli, controlli nilli espliciti, luacheck e StyLua|
|[Dart](languages/dart.md)| `PL-DART-001`–`PL-DART-012` |`final` e `const`, sicurezza del suono nulla, parametri nominati, tipi sigillati|
|[Flutter](languages/flutter.md)| `PL-FLUT-001`–`PL-FLUT-010` |Piccoli metodi di compilazione, widget di cost, un approccio di stato, controlli montati|
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` |Immutabile per impostazione predefinita, tipi di risultato, `or {}`, tipi di opzione, `v fmt`|
|[Swift](languages/swift.md) (CZ)| `PL-SW-001`–`PL-SW-011` |`let` su `var`, guardia let, tipi di valore, controllo accessi, formato rapido e SwiftLint|
|[Kotlin](languages/kotlin.md) (CZ)| `PL-KT-001`–`PL-KT-011` |`val` su `var`, classi di dati, tipi sigillati, sicurezza nulla, ktlint e detekt|

See also the [language profile overview](languages/README.md) and [tooling requirements](tooling.md).

## Specifiche e manutenzione

Questi file tematici conservano le regole, gli esempi, le qualifiche e gli ID stabili della specifica [Pureline 1.7](../../PURELINE_SPECIFICATION_1.7.md), la fonte di riferimento versione.. Section numbers are omitted here so each topic can be read independently; rule IDs are unchanged.

When revising guidance, keep the original specification and the corresponding topic file consistent. Do not renumber existing rule IDs or turn review heuristics into hard violations.
