# Pureline-codestijl

De Pureline 1.7 coderingsstandaard, georganiseerd per onderwerp en taal. Begin met de [overzicht](overview.md), lees de gedeelde regels en pas het relevante taalprofiel toe.

**Linear Flow. Expliciete intentie. Minimale ruis. Small Units. Clear Ownership. Cohesie over Size.**

## Hoe deze handleiding toe te passen

- Gedeelde regels gelden overal waar de taal ze op natuurlijke wijze ondersteunt.
- Taal-native syntax en expliciete profiel uitzonderingen hebben voorrang. Bijvoorbeeld, Crystal maakt eenvoudige postfix bewakers, Rust staat `let ... else` en volgt de thmt, Novus maakt gebruik van `pureline:allow-else` voor gerechtvaardigde `else` takken, en Emvus maakt optionele semicolons mogelijk.
- Het React profiel zit bovenop de JavaScript en TypeScript profielen. Alle drie samen toepassen voor `.tsx` / `.jsx` bestanden.
- TypeScript erft het JavaScript profiel naast zijn eigen regels.
- Functie en klasse grootte varieert zijn review heuristiek. Houd samenhangende logica bij elkaar; lijntelling alleen is geen overtreding.
- Bewaar stabiele regel ID's in beoordelingen en diagnostiek. Zie het [bewerkingsmodel](tooling.md).

## Shared rules

|Gids|Inhoud|
|---|---|
|[Koreprincipes](core/principles.md)| `PL-CORE-001`–`PL-CORE-022` |
|[Controlestroom](core/control-flow.md)|Bewakersclausules, vroege fouten, expliciete blokken, vermijden van onnodige `else`|
|[Namen](core/naming.md)|Bedoelende namen en lokale conventieseeeeee|
|[Functies](core/functions.md)|Eén verantwoordelijkheid en maatgeleiding|
|[Classes en modules](core/structure.md)|Verantwoordelijkheidsgrenzen, mappendichtheid, cohesie boven grootte|
|[Formatting](core/formatting.md)|Compacte oproepen en betekenisvolle verticale groeperingee|
|[Commentaren](core/comments.md)|Leg uit waarom ongebruikelijk gedrag noodzakelijk is|
|[Architectuur](core/architecture.md)|Gejudificeerde abstracties, afhankelijkheidsrichting, expliciete afhankelijkheden|
|[Staat en bijwerkingen](core/state-and-side-effects.md)|Zichtbare effecten en opzettelijke mutatie|
|[Prestatie](core/performance.md)|Beslisbare optimalisatie van hete padene trackinge tracking|

## Taalspecifieke regelse regelse regels

|Profiel|Regel ID'seeideneiden| Particular guidance |
|---|---|---|
|[Java](languages/java.md)| `PL-JAVA-001`–`PL-JAVA-010` |Records, `I`-prefixed interfaces, null handling, concurrency, lifecycle symmetrie|
|[JavaScript](languages/javascript.md)| `PL-JS-001`–`PL-JS-007` |Breuken, puntkomma's, `const`, async/wacht, terugroepacties|
|[TypeScript](languages/typescript.md)| `PL-TS-001`–`PL-TS-007` |JavaScript erfdeel, expliciete of afgeleide types, `unknown`, interfaces en vakbonden|
|[Go](languages/go.md)| `PL-GO-001`–`PL-GO-009` |Foutbewakers, idiomatische intimidering, kleine consumenteninterfaces, `defer`, goroutines|
|[Kristal](languages/crystal.md)| `PL-CR-001`–`PL-CR-008` |Bewakers, slangen_koffer, gevolggeving, nul behandeling, macro's|
|[Emerald](languages/emerald.md)| `PL-EMS-001`–`PL-EMS-012` |`.ems`, `namespace`/`use`, puntkomma's, dataklassen, AST macro's, stroom|
|[Emvus](languages/emvus.md)| `PL-EV-001`–`PL-EV-018` |`.ev`, `method<Type>`, `where`, Resultaat, `scoped`, taaklevenscycli; voorgenomen taalontwerp|
|[Rust](languages/rust.md)| `PL-RS-001`–`PL-RS-024` |Eigenschap, Resultaat/Optie, patroonmatching, Martfmt, RAII, async en FFI, fouttypes, centrales, annuleringsveiligheid, testplaatsing|
|[Novus](languages/novus.md)| `PL-NV-001`–`PL-NV-013` |`.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, pakketten en importen, `.nvh` componenten, `.nvmd` Markdown inhoud|
|[Reageren](languages/react.md)| `PL-REACT-001`–`PL-REACT-014` |Reageer 19 met strikte TypeScript: bewakers, haken, effecten, rekwisieten, context, sleutels, pure render, routing|
|[Python](languages/python.md)| `PL-PY-001`–`PL-PY-012` |PEP 8 Inning, bewakersclausules, type hints, specifieke uitzonderingen, dataclasses, ruff en type dammen|
|[QML](languages/qml.md)| `PL-QML-001`–`PL-QML-011` |Qt 6 componenten, `required property`, bindingen, Thema tokens, lay-outs, qmllint|
|[Astro](languages/astro.md)| `PL-AS-001`–`PL-AS-009` |Getypte frontmaterie, standaard, expliciete eilanden, scoped stijlen, inhoud collecties|
|[HTML](languages/html.md)| `PL-HTML-001`–`PL-HTML-009` |Semantische elementen, één kopstructuur, etiketten, alttekst, documentkop, validatie|
|[CSS](languages/css.md)| `PL-CSS-001`–`PL-CSS-012` |Tokens, cascadelagen, lage specificiteit, geen `!important`, logische eigenschappen, verminderde beweging|
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` |Naamgeving, nulbare referentietypes, records, `using`, async met taak, LINQ, dotnet formaat|
|[Engels](languages/angular.md)| `PL-NG-001`–`PL-NG-009` |Standalone componenten, signalen, OnPush, getypte vormen, `ng lint`|
|[Vue](languages/vue.md)| `PL-VUE-001`–`PL-VUE-010` |`<script setup lang="ts">`, getypte rekwisieten, berekend, composibles, Pinia|
|[GDScript](languages/gdscript.md)| `PL-GD-001`–`PL-GD-010` |Statisch typeren, `@export`, `@onready`, signalen, gdformat en gdlint|
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` |Expliciete hoop eigendom, foutcodes, bewaker clausules, clang-formaat en clang-tidy|
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` |RAII, unieke eigenaar, standaard, `std::expected`, header split|
|[Lua](languages/lua.md)| `PL-LUA-001`–`PL-LUA-012` |Standaard lokaal, module tabellen, expliciete nul controles, luacheck en StyLua|
|[Dart](languages/dart.md)| `PL-DART-001`–`PL-DART-012` |`final` en `const`, geluid nul veiligheid, benoemde parameters, verzegelde types|
|[Flutter](languages/flutter.md)| `PL-FLUT-001`–`PL-FLUT-010` |Kleine bouwmethoden, widgets, een state benadering, gemonteerde controles|
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` |Standaard onveranderbaar, resultaattypes, `or {}`, optietypes, `v fmt`|
|[Swift](languages/swift.md)| `PL-SW-001`–`PL-SW-011` |`let` over `var`, bewaker let, waarde types, toegangscontrole, swift-formaat en SwiftLint|
|[Kotlin](languages/kotlin.md)| `PL-KT-001`–`PL-KT-011` |`val` over `var`, data classes, sealed types, null safety, ktlint en detekt|

Zie ook het [taalprofieloverzicht](languages/README.md) en [bewerkingseisen](tooling.md).

## Specificatie en onderhoude

Deze onderwerpbestanden behouden de regels, voorbeelden, kwalificaties en stabiele ID's van de [Pureline Specificatie 1.7](../../PURELINE_SPECIFICATION_1.7.md), de versioned referentiebron. De sectienummers worden hier weggelaten zodat elk onderwerp onafhankelijk kan worden gelezen; regel ID's zijn ongewijzigd.

Houd bij het herzien van de begeleiding de oorspronkelijke specificatie en het bijbehorende onderwerpbestand consistent. Geen bestaande regel-ID's hernummeren of review heuristiek omzetten in harde schendingen.
