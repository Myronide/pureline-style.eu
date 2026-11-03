# Pureline Code Style

Lo standard di codifica Pureline 1.7, organizzato per argomento e per linguaggio. Parti dalla [panoramica](overview.md), leggi le regole condivise, poi applica il profilo del linguaggio che ti interessa.

**Flusso lineare. Intento esplicito. Rumore minimo. Unità piccole. Responsabilità chiara. Coesione prima della dimensione.**

## Come applicare questa guida {#how-to-apply-this-guide}

- Le regole condivise valgono ovunque il linguaggio le supporti in modo naturale.
- La sintassi nativa del linguaggio e le eccezioni esplicite del profilo hanno la precedenza. Ad esempio, Crystal ammette semplici guardie postfisse, Rust ammette `let ... else` e segue rustfmt, Novus usa `pureline:allow-else` per i rami `else` giustificati ed Emvus ammette i punti e virgola facoltativi.
- Il profilo React si appoggia ai profili JavaScript e TypeScript. Per i file `.tsx` / `.jsx` applica tutti e tre insieme.
- TypeScript eredita il profilo JavaScript, oltre alle proprie regole.
- Gli intervalli di dimensione per funzioni e classi sono euristiche di revisione. Tieni insieme la logica coesa: il numero di righe da solo non è mai una violazione.
- Conserva gli ID stabili delle regole nelle revisioni e nelle diagnostiche. Vedi il [modello degli strumenti](tooling.md).

## Regole condivise {#shared-rules}

| Guida | Contenuto |
|---|---|
| [Principi fondamentali](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Controllo di flusso](core/control-flow.md) | Guard clause, errori anticipati, blocchi espliciti, evitare `else` superfluo |
| [Nomi](core/naming.md) | Nomi significativi e convenzioni locali |
| [Funzioni](core/functions.md) | Una sola responsabilità e indicazioni sulle dimensioni |
| [Classi e moduli](core/structure.md) | Confini di responsabilità, densità delle cartelle, Coesione prima della dimensione |
| [Formattazione](core/formatting.md) | Chiamate compatte e raggruppamento verticale significativo |
| [Commenti](core/comments.md) | Spiegare perché un comportamento insolito è necessario |
| [Architettura](core/architecture.md) | Astrazioni giustificate, direzione delle dipendenze, dipendenze esplicite |
| [Stato ed effetti collaterali](core/state-and-side-effects.md) | Effetti visibili e mutazione intenzionale |
| [Prestazioni](core/performance.md) | Ottimizzazione deliberata dei percorsi critici |

## Regole specifiche per linguaggio {#language-specific-rules}

| Profilo | ID delle regole | Indicazioni particolari |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Record, interfacce con prefisso `I`, gestione del null, concorrenza, simmetria del ciclo di vita |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Parentesi graffe, punti e virgola, `const`, async/await, callback |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | Ereditarietà da JavaScript, tipi espliciti o inferiti, `unknown`, interfacce e unioni |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Guardie sugli errori, nomi idiomatici, piccole interfacce lato consumatore, `defer`, goroutine |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Guardie postfisse, snake_case, inferenza, gestione di nil, macro |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, punti e virgola, classi di dati, macro AST, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, cicli di vita dei task; progetto del linguaggio previsto |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Ownership, Result/Option, pattern matching, rustfmt, RAII, async e FFI, tipi di errore, lint centralizzati, sicurezza della cancellazione, posizione dei test |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, pacchetti e import, componenti `.nvh`, contenuto Markdown `.nvmd` |
| [React](languages/react.md) | `PL-REACT-001`–`PL-REACT-014` | React 19 con TypeScript strict: guardie, hook, effetti, props, contesto, chiavi, render puro, routing |
| [Python](languages/python.md) | `PL-PY-001`–`PL-PY-012` | Nomi secondo PEP 8, guard clause, type hint, eccezioni specifiche, dataclass, ruff e type checker |
| [QML](languages/qml.md) | `PL-QML-001`–`PL-QML-011` | Componenti Qt 6, `required property`, binding, token del Theme, layout, qmllint |
| [Astro](languages/astro.md) | `PL-AS-001`–`PL-AS-009` | Frontmatter tipizzato, statico per impostazione predefinita, isole esplicite, stili con ambito, content collection |
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` | Elementi semantici, un'unica struttura dei titoli, etichette, testo alternativo, head del documento, validazione |
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` | Token, cascade layer, bassa specificità, niente `!important`, proprietà logiche, movimento ridotto |
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Nomi, tipi riferimento nullable, record, `using`, async con Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Componenti standalone, signal, OnPush, form tipizzati, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, props tipizzate, computed, composable, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Tipizzazione statica, `@export`, `@onready`, segnali, gdformat e gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Ownership esplicito dell'heap, codici di errore, guard clause, clang-format e clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, ownership unico, const per impostazione predefinita, `std::expected`, separazione degli header |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Locale per impostazione predefinita, tabelle di modulo, controlli espliciti di nil, luacheck e StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` e `const`, null safety solida, parametri con nome, tipi sealed |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Metodi build piccoli, widget const, un solo approccio allo stato, controlli su mounted |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Immutabile per impostazione predefinita, tipi result, `or {}`, tipi option, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` al posto di `var`, guard let, tipi valore, controllo degli accessi, swift-format e SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` al posto di `var`, data class, tipi sealed, null safety, ktlint e detekt |

Vedi anche la [panoramica dei profili dei linguaggi](languages/README.md) e i [requisiti degli strumenti](tooling.md).

## Specifica e manutenzione {#specification-and-maintenance}

Questi file tematici conservano le regole, gli esempi, le precisazioni e gli ID stabili della [Specifica Pureline 1.7](../../PURELINE_SPECIFICATION_1.7.md), il riferimento versionato. I numeri di sezione sono omessi, così ogni argomento si può leggere in modo indipendente; gli ID delle regole restano invariati.

Quando rivedi queste indicazioni, mantieni coerenti la specifica originale e il file tematico corrispondente. Non rinumerare gli ID delle regole esistenti e non trasformare le euristiche di revisione in violazioni rigide.
