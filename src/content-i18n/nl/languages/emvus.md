# Emvus Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Emvus-profiele layout

Pureline Emvus volgt de **current Emvus taalontwerp**. Dit is een stijlprofiel voor de beoogde `.ev` syntax, geen claim dat elke showcased functie al door Ring 1 is geïmplementeerd. Hou Emvus gescheiden van Emerald.

### PL-EV-001. Inheemse methoden verklaringen

Declareer methoden met `method` en, indien nodig, een retourtype in `method<Type>`. Generieke typevariabelen worden geïntroduceerd via `where`, niet door een andere generieke parameterlijst aan de methodenaam te koppelen.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Een methode zonder een expliciet retourtype geeft `Void` terug.

### PL-EV-002. Lege verklaring Parenthesen zijn facultatief; Bel Parenthesen zijn niet

Beide parameterloze verklaringen zijn Pureline-conform:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Beide spellings verklaren nul-36 methoden; het verschil is cosmetisch, **not** een overbelasting onderscheid. Schrijf altijd `refresh()` of `shutdown()` om de methode uit te voeren; `object.refresh` is geen methodeaanroep. Voor materien moet ofwel geldige aangiftestijl behouden ofwel consequent worden geconfigureerd zonder dat de andere als fout wordt aangemerkt.

### PL-EV-003. Breuken vereist; Semikommanen optioneel

Gebruik expliciete `{ ... }`-blokken voor `if`, loops en vergelijkbare regelstroom. Liever omitting optionele puntkomma's in idiomatische Emvus, maar wijs bestaande geldige puntkomma-getermineerde code niet af.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Brace-free inline bewakers en onnodige `else` blokken zijn geen Pureline. Houd vervolglijnen en lange expressies ondubbelzinnig.

### PL-EV-004. Naamgeving, Import, en Zichtbaarheid

- Typen: `PascalCase`; interfaces: `I`-prefix (`IStorage`, `IConnection`).
- Methoden, velden, eigenschappen, parameters en locals: `camelCase`.
- Constanten: `UPPER_SNAKE_CASE`.
- Verpakkingen: Kleine gestippelde paden.
- Bronbestandsnamen: **camelCase**, bijvoorbeeld `sessionService.ev`, zelfs als de primaire klasse `SessionService` is.
- De standaard zichtbaarheid is `public`; geef `private` of `protected` indien nodig.
- Symboolresolutie is hoofdlettergevoelig, maar bron spelling wordt bewaard: gebruik de **declared spelling** consequent en definieer geen namen die alleen verschillen in geval van.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Gebruik expliciete importen enden in plaats van te vertrouwen op verwarrende botsingen.

### PL-EV-005. Types moeten communiceren met de inhoud

Emvus wordt standaard statisch getypt. `var` voert **statische type-inferentie** uit; `dynamic` vraagt expliciet om runtime-getypte gedrag.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Gebruik `dynamic` op werkelijk dynamische grenzen, niet om normale type controles te omzeilen. Zowel expliciete als afgeleide statische lokale types zijn Pureline-compliant.

### PL-EV-006. Handvat Nullability door Stable Flow

Emvus heeft geen `T?`-annotatie nodig. Het spoort nulstaten door controlestroom. Bewaak een mogelijk-null waarde vroeg en verkies een stabiele lokale momentopname van veranderlijke eigenschappen voordat men redeneert over hun nietigverklaring.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Vertrouw nooit op herhaalde niet-gesynchroniseerde lezingen van een veranderlijk eigendom met dezelfde waarde. Maak de vereiste veld initialisatie expliciet.

### PL-EV-007. Getypte resultaatverwerking bij verwachte fouten

Emvus heeft geen `try/catch/finally` syntax. Gebruik `Result<T, E>`, `success`, `fail`, `?` en `switch` zoals de taal aangeeft.

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

- `?` is bedoeld voor doelbewuste foutvermeerdering wanneer het type het toelaat.
- `!` veroorzaakt paniek bij fouten; reserveer het voor gevestigde in de SUV's of grenscontroles die echt niet kunnen herstellen.
- Een `Result` niet weggooien of de verwachte fout achter `panic` verbergen.
- Houd `success`, `fail` en `return` duidelijk in plaats van elke handeling onnodig te verpakken.

`?` verkies bij het doorsturen van de fout en de methode van de omsluiten
Het resultaattype accepteert het.

```text
Explicit result branches                │ ✓ Pureline
switch (validatePort(port)) {            │ Int validPort = validatePort(port)?
    success(value) -> success value     │ success validPort
    error(problem) -> fail problem      │
}                                       │
```

### PL-EV-008. Maak Resource Lifetimes zichtbaar met `scoped`

Gebruik Emvus' `scoped`-constructie voor resources die gesloten moeten worden als hun scope eindigt.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

`scoped` niet vervangen door Java `try-with-resources`, Go `defer` of een niet bestaande Emvus `finally`. De levensduur van een bron moet duidelijk blijven, zelfs als de compiler het geheugen optimaliseert.

### PL-EV-009. Liever gegevensklassen naar boilerplate

Gebruik `data class` voor kleine, benoemde, data-centrische types met het ingebouwde gegenereerde gedrag.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Primaire gegevenseigenschappen zijn alleen-lezen buiten initialisatie. `copy()` en `withX(...)` zijn standaard ondiep. Liever gegenereerde gelijkheid, hashing, en tekstuele weergave waar nodig in plaats van handmatig te herschrijven. Houd grotere gedragsrijke types als reguliere klassen.

**Zen geen aparte `record`-stijl-eis in te voeren:** het overeengekomen Emvus-design maakt gebruik van `data class` voor genoemde datamodellen en `Dictionary` voor woordenboek/object-literal data.

### PL-EV-010. Lijsten, Tupels en Woordenboeken Behoud hun bepaalde Semantiek

Voor `[...]`-literals betekent **all-elementtypes precies gelijk ** een `List`; anders is de uitdrukking een tupel. Laat Pureline de type-gestuurde regel van de taal niet overschrijven met een stilistische voorkeur.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Woordenboek literals gebruiken `{ key: value }`; afgeleide gemengde waarde types gebruiken `dynamic` indien vereist door het taalmodel. Woordenboeken zijn toegankelijk door **keys**, geen structurele-record stippennotatie.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Een veranderend elementtype kan een lijst-versus-tupel-invloeden wettig veranderen. Houd dat gedrag zichtbaar aan de API-grenzen door expliciete aangegeven types waar nodig.

### PL-EV-011. Destructureren is positioneel

Gebruik `{ ... }` om tupel- of data-klassecomponenten in declaratievolgorde te destructureren. `_` kan een element overslaan.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Herinterpreteer de structuur niet als een naam voor het record dat overeenkomt met de naam. Geef de voorkeur aan korte betekenisvolle bindingen, niet willekeurig uitpakken.

### PL-EV-012. `switch` moet volledige tabs tonen

Gebruik `switch` verklaringen of uitdrukkingen voor echte status alternatieven. Expressies moeten volledig zijn of een gedefinieerde catch-all / failure arm hebben.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Prefereer duidelijke `success(...)` en `error(...)` patronen aan nestedede voorwaarden voor `Result`. Houd alle patronen bewust, geen manier om vergeten zaken te verbergen.

### PL-EV-013. Gebruik Cascades alleen als ze een enkele ontvanger verduidelijken

Cascades met `..` zijn nuttig voor een korte reeks bewerkingen op dezelfde ontvanger.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Vermijd ketens die niet-gerelateerde effecten verbergen, meerdere objecten impliciet muteren of zich uitstrekken over vele uitspraken.

### PL-EV-014. Vezels en draadjes hebben een heldere levenscyclus nodig

`fiber {}`, `virtual {}` en `thread {}` zijn verschillende uitvoeringsconstructies met een gemeenschappelijk taak-resultaat patroon. Kies op basis van de werkelijke werklast, niet omdat concurrency ziet er compact.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Wacht op resultaten en mislukkingen die er toe doen.
- Maak annulering en eigendom duidelijk voor langlevende taken.
- Synchroniseren gedeelde muteerbare toestand; `@Synchronized` is beschikbaar waar nodig.
- Neem niet aan dat het object van een taak lokaal is of dat het kan worden vrijgegeven als de paaimethode terugkeert.
- Vermijd verborgen brand-en-vergeet werk in gewone business methoden.

### PL-EV-015. Macro's moeten de ontdekking verbeteren, niet versturen

Emvus macro's zijn compile-time AST transformaties met doelverklaringen, `quote`, `$(...)` substitutie, en AST bouwer API's.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline vereist:

- Kleine macro's met duidelijk omschreven verantwoordelijkheden en ondersteunde doelstellingen.
- Deterministische expansie; bron-orde gedrag en resulterende leden blijven ontdekbaar.
- Hygiëne om toevallige naambotsingen te voorkomen.
- Compiler diagnostiek wanneer uitbreiding maakt tegenstrijdige of ongeldige code.
- Gewone methoden in plaats van macro's wanneer er geen substantiële compilatietijdwinst bestaat.
- Geen vertrouwen op niet-geviewde macro-tijd I/O, netwerk, klok of willekeurige bijwerkingen.

Gegenereerde code moet voldoen aan semantische controles; checker/formatter tooling mag gegenereerde locaties niet behandelen als gewone hand-onderhoudsbestanden.

### PL-EV-016. Programma niet tegen HyperAlloc stroom internen

Emvus-code kan worden geoptimaliseerd door middel van Sublang, Optimind en HyperAlloc Flow. Ontwikkelaars moeten **semantics en lifetimes** uitdrukken, niet handmatig raden van een toekomstige toewijzingsstrategie.

- Begeer eenvoudige objectlevenscycli en stabiele eigendom.
- Houd gedeelde veranderlijke staat expliciet, vooral voor taken.
- Geef de voorkeur aan onveranderlijke data classes voor eenvoudige waarden wanneer ze passen in het domein.
- Bouw geen API's rond de veronderstellingen dat een object altijd gestapeld wordt, dat de ruiter wordt vervangen of samengevoegd.
- Evalueer hot-path allocatie en ontsnappen gedrag door middel van metingen en diagnostiek, niet folklore.

### PL-EV-017. Pakket Dinnen en Bron Organisatie

Een map met pakketten/bron moet standaard **8**-productie-`.ev`-modules bevatten. Tests, gegenereerde bronnen en alleen metadata bestanden tellen niet mee. Splitsing door de werkelijke functie verantwoordelijkheid in plaats van mechanisch het creëren van willekeurige subpakketten.

Een pakketnaam en een bestandsnaam zijn verschillende concepten: `app.session` blijft in het kleine geval, terwijl `sessionService.ev` `camelCase` is.

### PL-EV-018. Taal-Native Rules Override Cross-Taal Imitatie

Pureline-gereedschap mag geen overtreding melden alleen omdat Emvus verschilt van Java, Emerald, Rust of Go:

- Optionele `()` in **-methodeverklaringen zonder ** zijn geldig; oproepen vereisen altijd `()`.
- Optionele puntkomma's zijn geldig.
- `where` is de algemene declaratie syntax.
- `var` wordt statisch afgeleid; `dynamic` is expliciet dynamisch.
- `success`, `fail`, `?`, `!`, `scoped` en AST macro's hebben Emvus-specifieke betekenissen.
- `{ ... }` heeft geldige context-afhankelijke toepassingen, waaronder woordenboeken en positionale destructurering.
- `[ ... ]` wordt getypt als een lijst of tupel volgens Emvus's exact-element-type regel.

De formatter moet AST-bewust zijn, betekenis behouden en nooit Emerald's `::` namespaces of semicolon eisen toepassen op `.ev` bestanden.
