# Novus Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Novus is een zelfhostende taal die compileert naar draagbare C, met dynamisch getypte waarden, optionele statische typen, `.nvh` server-rendered componenten, en `.nvmd` Markdown inhoud door [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Het profiel volgt de Novus voorbeelden, de standaard bibliotheek, en de regels die de Novus taalserver controleert wanneer Pureline stijldiagnostiek is ingeschakeld (`novus.pureline.enabled`). [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

Regel ID's `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` en `PL-NAME-001` zijn degene die de Nous taalserver al rapporteert onder bron `pureline`. De Novus-specifieke regels hieronder gebruiken het `PL-NV-*` voorvoegsel.

## Novus-profiele layout

### PL-NV-001. Naamgeving en zichtbaarheid

- Klassen, enums en onderdelen: `PascalCase`.
- Methoden, velden, lokale bevolking en parameters: `lowerCamelCase`.
- Pakketnamen: korte, kleine koffer, zonder scheidingsstukken.
- Constanten: `private final SCREAMING_SNAKE_CASE` op bestandsniveau.
- Houd leden privé tenzij een ander pakket of bestand ze gebruikt. Vouw velden alleen door `: get` of `: get, set` als beller ze nodig heeft.
- Korte namen zijn toegestaan voor looptellers (`i`, `j`, `k`). Andere namen en plaatshouders met één letter (`tmp`, `obj`, `thing`, `data2`) worden gerapporteerd door `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002. Guard Clausles en Linear Flow

Valideer eerst, keer vroeg terug en houd het succesvolle pad bij de basis inspringing.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Vermijd `else` na een tak die al terugkomt, breekt of doorgaat (`PL-CF-002`). Wanneer een `else` werkelijk de duidelijkste vorm is, moet de lijn met een gerechtvaardigde vrijstelling worden gemarkeerd:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003. Verklaringen: `final`, `var` en Expliciete Types

- Gebruik `final` voor waarden die nooit veranderen; gebruik `var` voor lokale gebruikers waarvan het type duidelijk is van de initialiser.
- Schrijf een opgegeven type waar de lezer anders zou moeten raden, en op API-grenzen (velden, parameters, retourtypen).
- Onthoud dat een expliciet type de waarde converteert: `integer x = 2.9` slaat `2` op. Maak dergelijke conversies zichtbaar in plaats van per ongeluk op ze te vertrouwen.
- Novus heeft geen samengestelde opdracht.? Schrijf `count = count + 1`, niet `count += 1`, en houd dat statement op één regel.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

### PL-NV-004. Bouw en Object Literals

- Gebruik object-literals (`Person{name="Tom"}`) voor gewone gegevens zonder gedrag.
- Gebruik `construct()` als het object in de processor in de processor is gezet, velden moet afleiden of argumenten moet valideren.
- Verberg geen significant werk in veld initialisers; houd de bouw expliciet in `construct()`.
- Een `based` erfenis keten moet beschrijven een echte is-een relatie. Liever een `interface` als alleen het gedrag gedeeld wordt.

### PL-NV-005. Methode Handtekeningen

- Geef parameter en retourtypen aan wanneer de handtekening deel uitmaakt van een API, een modulegrens of een `.nvh`-component.
- Gebruik `method name(args): type { }` voor gewone methoden; houd parameterlijsten kort genoeg om te scannen.
- Methode overbelasting per arity of parametertype is toegestaan wanneer de betekenis identiek is. Gebruik geen overbelasting om verschillende gedragingen achter één naam te verbergen.

### PL-NV-006. Functiegrootte is een beoordelingssignaal

De taalserver bekijkt een methode op 30 regels en rapporteert deze boven 50 regels (`PL-FN-001`). Dit zijn herzieningsdrempels. Een samenhangende methode die één ding in volgorde doet kan langer blijven; het splitsen wanneer het verantwoordelijkheden zoals parsing, validatie en I/O mixt.

### PL-NV-007. Pakketten, import en map-dinnen

- Een map is een pakket. Importeer de smalste eenheid die nodig is: `import geo/circle` of `import @helpers` in plaats van een heel pakket te importeren als één bestand genoeg is.
- Houd maximaal **10 `.nv` / `.nvh` bestanden** per map standaard (`PL-STRUCT-002`). Splits langs verantwoordelijkheidsgrenzen, niet in betekenisloze mappen.
- Bekijk een bestand op **200 lijnen** (`PL-STRUCT-001`). Dit is een herzieningsdrempel, geen harde limiet: Houd één verantwoordelijkheid per bestand en laat samenhangende logica bij elkaar blijven.

### PL-NV-008. Concurrency heeft zichtbare eigendom

- Maak concurrency zichtbaar op de call site: `async` / `await`, `thread`, `virtual` en `sync` geven aan wat waar loopt.
- Volg elke taak die belangrijk is. Begin niet met vuur-en-vergeet werk voor resultaten het programma is later afhankelijk van.
- Bewaker gedeeld veranderlijke toestand expliciet met `sync` in plaats van vertrouwen op oproeporder.
- Volg dezelfde discipline als [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) voor afsluiten en annuleren.

### PL-NV-009. Evaluatie order is gedocumenteerd, niet aangenomen

Novus evalueert operands links naar rechts en documenteert de uitzonderingen. Schrijf geen code waarvan het resultaat afhankelijk is van een ongebruikelijke bestelling. Houd bijwerkingen in hun eigen verklaringen, en vermijd het combineren van een globale of veld gelezen met een latere oproep die het verandert in een uitdrukking.

De `..` ketting is bedoeld om een object of array in één lineaire volgorde te bouwen (`var names = []..append("Ada")..append("Grace")`). Gebruik het wanneer elke stap een call of lid opdracht op dezelfde ontvanger is. Breek een ketting in de genoemde stappen wanneer een stap een commentaar of een tak nodig heeft.

### PL-NV-010. C Blokken en platformgrenzen

Een `c { ... }` blok is een inheemse grens. Houd het klein, isoleer het in een gericht bestand, en leg uit met een commentaar wat de C-code veronderstelt over types, levensduurn, en het platform. Stel de oorspronkelijke functie bloot via een Novus-methode met een getypte handtekening, zodat de rest van de code nooit rauwe C-details ziet.

### PL-NV-011. `.nvh` Componenten Houd Markup en Logic Apart

In een `.nvh`-component:

- Geef reactieve toestand aan met `ref` in `<?nv ... ?>` bovenaan het onderdeel.
- Houd handlers en berekeningen in Novus blokken; houd de HTML gericht op structuur en presentatie.
- Bereken afgeleide waarden op één plaats in plaats van de expressie op verschillende plaatsen van de markup te herhalen.
- Behandel elke component als één verantwoordelijkheid, op dezelfde manier als een klasse (`PL-STRUCT-001`).

### PL-NV-012. Opmerkingen en diagnoses

- Comments explain why, not what: the reason for a workaround, a platform quirk, or a non-obvious invariant ([PL-DOC-001](../core/comments.md)).
- Pureline diagnostiek zijn opt-in in de editor (`novus.pureline.enabled`). Schakel ze in voor gedeelde projecten zodat dezelfde regel ID's in elke editor en in CI verschijnen.
- Elke `pureline:allow-else` vrijstelling heeft een reden nodig op dezelfde lijn. Een vrijstelling zonder reden is een toetsingsvonnis.

### PL-NV-013. Markdown-inhoud (`.nvmd`)

Een `.nvmd` bestand is Markdown met Novus erin, de manier waarop `.mdx` Markdown is met JSX. De generator in [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) verandert `Page.nvmd` in `Page.nvh` voordat de compiler draait. Pas de bovenstaande regels toe op het headerblok en op alle `.nv`-modules die het importeert; de Markdown-instelling volgt deze regels:

- Het lichaam draagt de inhoud. Het headerblok (`<?nv ... ?>`) draagt alleen wat de pagina nodig heeft: import, rekwisieten en een paar methoden. Verplaats logica langer dan een paar regels in een `.nv` module en importeer het.
- De sleutels van de voorste knop zijn de rekwisieten van de pagina. Houd ze kort en plat, en gebruik `{title}` in plaats van de waarde in de tekst te herhalen.
- Houd elke `{expr}` tot één waarde of één gesprek. Bereken alles wat langer in de kop of een module zit, zodat het lichaam van boven naar beneden leest als proza.
- Houd `{#if}` en `{#for}` blokken op hoogstens twee niveaus diep. Als een blok markup herhaalt, gebruik dan een component (`<Callout>`, `<Toc>`) in plaats daarvan.
- Een kop waarvan de tekst dynamisch is krijgt een expliciete id (`# {title} {#intro}`), dus ankers en `markdown.headings` blijven stabiel.
- Gegenereerde `.nvh`-bestanden zijn build output. Voeg ze toe aan `.gitignore`, edit ze nooit, en repareer de `.nvmd` bron in plaats daarvan. Houd de `<?nv /* nvmd-generated */`-markering intact.
- Een HTML-blok met een handler (`<button @click="hit">`) is nvh binnen Markdown. Houd dergelijke blokken kort en scheid ze van de omliggende tekst met lege regels.
