# Emvus-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Emvus-profiel {#emvus-profile}

Pureline Emvus volgt het **huidige taalontwerp van Emvus**. Dit is een stijlprofiel voor de beoogde `.ev`-syntaxis, geen bewering dat elke getoonde functie al door Ring 1 is geïmplementeerd. Houd Emvus gescheiden van Emerald.

### PL-EV-001 — Eigen methodedeclaraties {#pl-ev-001--native-method-declarations}

Declareer methoden met `method` en, indien nodig, een retourtype in `method<Type>`. Generieke typevariabelen worden ingevoerd via `where`, niet door nog een lijst met generieke parameters aan de methodenaam te hangen.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Een methode zonder expliciet retourtype retourneert `Void`.

### PL-EV-002 — Lege haakjes bij declaraties zijn optioneel; haakjes bij aanroepen niet {#pl-ev-002--empty-declaration-parentheses-are-optional-call-parentheses-are-not}

Beide declaraties zonder parameters voldoen aan Pureline:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Beide notaties declareren methoden zonder argumenten; het verschil is cosmetisch en **geen** onderscheid tussen overloads. Schrijf altijd `refresh()` of `shutdown()` om de methode uit te voeren; `object.refresh` is geen methodeaanroep. Formatters moeten beide geldige declaratiestijlen behouden of consequent configureren, zonder de andere als fout te markeren.

### PL-EV-003 — Accolades verplicht; puntkomma's optioneel {#pl-ev-003--braces-required-semicolons-optional}

Gebruik expliciete `{ ... }`-blokken voor `if`, lussen en vergelijkbare besturingsstroom. Laat optionele puntkomma's bij voorkeur weg in idiomatisch Emvus, maar wijs bestaande geldige code met puntkomma's niet af.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Inline guards zonder accolades en onnodige `else`-blokken zijn geen Pureline. Houd vervolgregels en lange expressies ondubbelzinnig.

### PL-EV-004 — Naamgeving, imports en zichtbaarheid {#pl-ev-004--naming-imports-and-visibility}

- Typen: `PascalCase`; interfaces: voorvoegsel `I` (`IStorage`, `IConnection`).
- Methoden, velden, properties, parameters en lokale variabelen: `camelCase`.
- Constanten: `UPPER_SNAKE_CASE`.
- Packages: padnamen in kleine letters, gescheiden door punten.
- Bronbestandsnamen: **camelCase**, bijvoorbeeld `sessionService.ev`, ook als de primaire klasse `SessionService` heet.
- De standaardzichtbaarheid is `public`; geef `private` of `protected` op wanneer dat nodig is.
- Symboolresolutie is hoofdletterongevoelig, maar de spelling in de bron blijft behouden: gebruik consequent de **gedeclareerde spelling** en definieer geen namen die alleen in hoofdletters verschillen.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Gebruik expliciete imports en aliassen in plaats van te vertrouwen op verwarrende naamconflicten.

### PL-EV-005 — Typen moeten de intentie communiceren {#pl-ev-005--types-should-communicate-intent}

Emvus is standaard statisch getypeerd. `var` voert **statische typeafleiding** uit; `dynamic` vraagt expliciet om gedrag met typen tijdens runtime.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Gebruik `dynamic` aan werkelijk dynamische grenzen, niet om de normale typecontroles te omzeilen. Zowel expliciete als afgeleide statische lokale typen voldoen aan Pureline.

### PL-EV-006 — Behandel nullability via een stabiele stroom {#pl-ev-006--handle-nullability-through-stable-flow}

Emvus vereist geen `T?`-annotatie. Het volgt null-toestanden via de besturingsstroom. Bewaak een mogelijk-null-waarde vroeg en geef de voorkeur aan een stabiele lokale momentopname van veranderlijke properties voordat je over hun nullability redeneert.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Reken er nooit op dat herhaalde ongesynchroniseerde lezingen van een veranderlijke property dezelfde waarde opleveren. Maak de verplichte initialisatie van velden expliciet.

### PL-EV-007 — Geef de voorkeur aan getypeerde Result-afhandeling voor verwachte fouten {#pl-ev-007--prefer-typed-result-handling-for-expected-failures}

Emvus kent geen syntaxis voor `try/catch/finally`. Gebruik `Result<T, E>`, `success`, `fail`, `?` en `switch` zoals de taal voorschrijft.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` is bedoeld voor bewuste foutpropagatie waar de typen dat toelaten.
- `!` veroorzaakt een panic bij een fout; bewaar het voor vaststaande invarianten of grenscontroles waarvan echt niet te herstellen valt.
- Negeer een `Result` niet en verberg verwachte fouten niet achter `panic`.
- Houd `success`, `fail` en `return` gescheiden in plaats van elke bewerking onnodig in te pakken.

### PL-EV-008 — Maak de levensduur van resources zichtbaar met `scoped` {#pl-ev-008--make-resource-lifetimes-visible-with-scoped}

Gebruik de `scoped`-constructie van Emvus voor resources die moeten worden gesloten wanneer hun scope eindigt.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Vervang `scoped` niet door Java-`try-with-resources`, Go-`defer` of een niet-bestaande Emvus-`finally`. De levensduur van een resource moet duidelijk blijven, ook wanneer de compiler het geheugen optimaliseert.

### PL-EV-009 — Geef de voorkeur aan dataklassen boven boilerplate {#pl-ev-009--prefer-data-classes-to-boilerplate}

Gebruik `data class` voor kleine, benoemde, datagerichte typen met het ingebouwde gegenereerde gedrag.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Primaire dataproperties zijn buiten de initialisatie alleen-lezen. `copy()` en `withX(...)` drukken aangepaste kopieën uit en zijn standaard ondiep. Geef waar passend de voorkeur aan gegenereerde gelijkheid, hashing en tekstuele weergave in plaats van ze handmatig te herschrijven. Houd grotere typen met veel gedrag als gewone klassen.

**Introduceer geen aparte stijlvereiste voor `record`:** het afgesproken Emvus-ontwerp gebruikt `data class` voor benoemde datamodellen en `Dictionary` voor dictionary-/objectliteraaldata.

### PL-EV-010 — Lijsten, tuples en dictionaries behouden hun gedefinieerde semantiek {#pl-ev-010--lists-tuples-and-dictionaries-retain-their-defined-semantics}

Bij `[...]`-literalen betekent **alle elementtypen exact gelijk** een `List`; anders is de expressie een tuple. Laat Pureline de typegestuurde regel van de taal niet overschrijven met een stilistische voorkeur.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Dictionary-literalen gebruiken `{ key: value }`; afgeleide gemengde waardetypen gebruiken `dynamic` waar het taalmodel dat vereist. Dictionaries worden benaderd via **sleutels**, niet via puntnotatie zoals bij structurele records.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Een wisselend elementtype kan terecht de afleiding van lijst versus tuple veranderen. Houd dat gedrag aan API-grenzen zichtbaar via expliciet gedeclareerde typen waar dat past.

### PL-EV-011 — Destructuring is positioneel {#pl-ev-011--destructuring-is-positional}

Gebruik `{ ... }` om componenten van tuples of dataklassen in declaratievolgorde te destructureren. `_` mag een element overslaan.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Interpreteer destructuring niet als matching op benoemde records. Geef de voorkeur aan korte, betekenisvolle bindings, niet aan willekeurig uitpakken.

### PL-EV-012 — `switch` moet volledige vertakking zichtbaar maken {#pl-ev-012--switch-should-expose-complete-branching}

Gebruik `switch`-statements of -expressies voor echte toestandsalternatieven. Expressies moeten uitputtend zijn of een gedefinieerde catch-all-/foutarm hebben.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Geef voor `Result` de voorkeur aan duidelijke patronen met `success(...)` en `error(...)` boven geneste voorwaarden. Houd catch-all-patronen bewust, niet als manier om vergeten gevallen te verbergen.

### PL-EV-013 — Gebruik cascades alleen wanneer ze één receiver verduidelijken {#pl-ev-013--use-cascades-only-when-they-clarify-a-single-receiver}

Cascades met `..` zijn nuttig voor een korte reeks bewerkingen op dezelfde receiver.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Vermijd ketens die niet-gerelateerde effecten verbergen, impliciet meerdere objecten muteren of zich over veel statements uitstrekken.

### PL-EV-014 — Fibers en threads hebben duidelijke levenscycli nodig {#pl-ev-014--fibers-and-threads-need-clear-lifecycles}

`fiber {}`, `virtual {}` en `thread {}` zijn afzonderlijke uitvoeringsconstructies met een gemeenschappelijk patroon voor taakresultaten. Kies op basis van de werkelijke werklast, niet omdat concurrency er compact uitziet.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Wacht op resultaten en fouten die ertoe doen.
- Maak annulering en eigenaarschap duidelijk bij langlevende taken.
- Synchroniseer gedeelde veranderlijke toestand; `@Synchronized` is beschikbaar waar passend.
- Ga er niet van uit dat het door een taak vastgelegde object stack-lokaal is of kan worden vrijgegeven wanneer de startende methode terugkeert.
- Vermijd verborgen fire-and-forget-werk in gewone bedrijfsmethoden.

### PL-EV-015 — Macro's moeten de vindbaarheid verbeteren, niet verhullen {#pl-ev-015--macros-must-improve-discoverability-not-obscure-it}

Macro's in Emvus zijn AST-transformaties tijdens compilatie met doeldeclaraties, `quote`, substitutie met `$(...)` en AST-builder-API's.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline vereist:

- Kleine macro's met duidelijk omschreven verantwoordelijkheden en ondersteunde doelen.
- Deterministische expansie; het gedrag in bronvolgorde en de resulterende leden blijven vindbaar.
- Hygiëne om onbedoelde naamconflicten te voorkomen.
- Compilerdiagnostiek wanneer expansie conflicterende of ongeldige code oplevert.
- Gewone methoden in plaats van macro's wanneer er geen substantieel voordeel tijdens compilatie is.
- Geen afhankelijkheid van niet-gereviewde I/O, netwerk-, klok- of willekeurige neveneffecten tijdens macro-uitvoering.

Gegenereerde code moet voldoen aan semantische controles; checker- en formattertooling mag gegenereerde locaties niet behandelen als gewone, handmatig onderhouden bestanden.

### PL-EV-016 — Programmeer niet tegen de interne werking van HyperAlloc Flow {#pl-ev-016--do-not-program-against-hyperalloc-flow-internals}

Emvus-code kan worden geoptimaliseerd via Sublang, Optimind en HyperAlloc Flow. Ontwikkelaars moeten **semantiek en levensduur** uitdrukken en niet handmatig een toekomstige allocatiestrategie raden.

- Geef de voorkeur aan eenvoudige levenscycli van objecten en stabiel eigenaarschap.
- Houd gedeelde veranderlijke toestand expliciet, vooral tussen taken.
- Geef de voorkeur aan onveranderlijke dataklassen voor eenvoudige waarden wanneer ze bij het domein passen.
- Bouw geen API's rond aannames dat een object altijd op de stack wordt gealloceerd, scalair wordt vervangen of wordt gepoold.
- Beoordeel allocatie en escape-gedrag in hot paths aan de hand van metingen en diagnostiek, niet van volksverhalen.

### PL-EV-017 — Packagedichtheid en organisatie van bronnen {#pl-ev-017--package-density-and-source-organization}

Een package- of bronmap moet standaard maximaal **8** `.ev`-modules voor productie bevatten. Tests, gegenereerde bronnen en bestanden met alleen metadata tellen niet mee. Splits op daadwerkelijke featureverantwoordelijkheid in plaats van mechanisch willekeurige subpackages aan te maken.

Een packagenaam en een bestandsnaam zijn verschillende concepten: `app.session` blijft in kleine letters, terwijl `sessionService.ev` `camelCase` is.

### PL-EV-018 — Taaleigen regels gaan voor op imitatie van andere talen {#pl-ev-018--language-native-rules-override-cross-language-imitation}

Pureline-tooling mag geen overtreding melden alleen omdat Emvus verschilt van Java, Emerald, Rust of Go:

- Optionele `()` bij **methodedeclaraties zonder parameters** zijn geldig; aanroepen vereisen altijd `()`.
- Optionele puntkomma's zijn geldig.
- `where` is de eigen syntaxis voor generieke declaraties.
- `var` wordt statisch afgeleid; `dynamic` is expliciet dynamisch.
- `success`, `fail`, `?`, `!`, `scoped` en AST-macro's hebben Emvus-specifieke betekenissen.
- `{ ... }` heeft geldige contextafhankelijke toepassingen, waaronder dictionaries en positionele destructuring.
- `[ ... ]` wordt getypeerd als lijst of tuple volgens de regel van Emvus voor exact gelijke elementtypen.

De formatter moet AST-bewust zijn, de betekenis behouden en nooit de `::`-namespaces of de puntkomma-eis van Emerald toepassen op `.ev`-bestanden.
