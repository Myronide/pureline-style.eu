# Novus-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Novus is een zelfhostende taal die compileert naar draagbare C, met dynamisch getypeerde waarden, optionele statische typering, server-side gerenderde `.nvh`-componenten en `.nvmd`-Markdown-inhoud via [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Het profiel volgt de Novus-voorbeelden, de standaardbibliotheek en de regels die de Novus-taalserver controleert wanneer Pureline-stijldiagnostiek is ingeschakeld (`novus.pureline.enabled`). [Samenhang boven omvang](../core/structure.md) geldt overal.

De regel-ID's `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` en `PL-NAME-001` worden al door de Novus-taalserver gemeld onder de bron `pureline`. De Novus-specifieke regels hieronder gebruiken het voorvoegsel `PL-NV-*`.

## Novus-profiel {#novus-profile}

### PL-NV-001 — Naamgeving en zichtbaarheid {#pl-nv-001--naming-and-visibility}

- Klassen, enums en componenten: `PascalCase`.
- Methoden, velden, lokale variabelen en parameters: `lowerCamelCase`.
- Namen van packages (mappen): kort, in kleine letters, zonder scheidingstekens.
- Constanten: `private final SCREAMING_SNAKE_CASE` op bestandsniveau.
- Houd leden privé, tenzij een ander package of bestand ze gebruikt. Maak velden alleen beschikbaar via `: get` of `: get, set` wanneer aanroepers ze nodig hebben.
- Korte namen zijn toegestaan voor lustellers (`i`, `j`, `k`). Andere namen van één letter en placeholders (`tmp`, `obj`, `thing`, `data2`) worden gemeld door `PL-NAME-001`.

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

### PL-NV-002 — Guard clauses en lineaire stroom {#pl-nv-002--guard-clauses-and-linear-flow}

Valideer eerst, keer vroeg terug en houd het succespad op het basisinspringniveau.

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

Vermijd `else` na een tak die al terugkeert, afbreekt of doorgaat (`PL-CF-002`). Wanneer een `else` echt de duidelijkste vorm is, markeer de regel dan met een onderbouwde vrijstelling:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Declaraties: `final`, `var` en expliciete typen {#pl-nv-003--declarations-final-var-and-explicit-types}

- Gebruik `final` voor waarden die nooit veranderen; gebruik `var` voor lokale variabelen waarvan het type duidelijk is uit de initialisatie.
- Schrijf een gedeclareerd type op waar de lezer anders zou moeten raden, en aan API-grenzen (velden, parameters, retourtypen).
- Houd er rekening mee dat een expliciet type de waarde converteert: `integer x = 2.9` slaat `2` op. Maak zulke conversies zichtbaar in plaats van er per ongeluk op te vertrouwen.
- Novus kent geen samengestelde toewijzing. Schrijf `count = count + 1`, niet `count += 1`, en houd die statement op één regel.

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

### PL-NV-004 — Constructie en objectliteralen {#pl-nv-004--construction-and-object-literals}

- Gebruik objectliteralen (`Person{name="Tom"}`) voor gewone data zonder gedrag.
- Gebruik `construct()` wanneer het object invarianten moet vastleggen, velden moet afleiden of argumenten moet valideren.
- Verberg geen significant werk in initialisaties van velden; houd constructie expliciet in `construct()`.
- Een `based`-overervingsketen moet een echte is-een-relatie beschrijven. Geef de voorkeur aan een `interface` wanneer alleen het gedrag wordt gedeeld.

### PL-NV-005 — Methodesignaturen {#pl-nv-005--method-signatures}

- Declareer parameter- en retourtypen wanneer de signatuur deel uitmaakt van een API, een modulegrens of een `.nvh`-component.
- Gebruik `method name(args): type { }` voor gewone methoden; houd parameterlijsten kort genoeg om te scannen.
- Overloads van methoden op basis van aantal of type parameters zijn toegestaan wanneer de betekenis identiek is. Gebruik geen overloads om verschillend gedrag achter één naam te verbergen.

### PL-NV-006 — Functiegrootte is een signaal voor review {#pl-nv-006--function-size-is-a-review-signal}

De taalserver beoordeelt een methode bij 30 regels en meldt haar boven 50 regels (`PL-FN-001`). Dit zijn drempels voor review. Een samenhangende methode die in volgorde één ding doet, mag langer blijven; splits haar wanneer ze verantwoordelijkheden vermengt, zoals parsing, validatie en I/O.

### PL-NV-007 — Packages, imports en mapdichtheid {#pl-nv-007--packages-imports-and-folder-density}

- Een map is een package. Importeer de smalste eenheid die nodig is: `import geo/circle` of `import @helpers` in plaats van een heel package te importeren wanneer één bestand volstaat.
- Houd standaard maximaal **10 `.nv`- / `.nvh`-bestanden** per map aan (`PL-STRUCT-002`). Splits langs verantwoordelijkheidsgrenzen, niet in zinloze geneste mappen.
- Beoordeel een bestand bij **200 regels** (`PL-STRUCT-001`). Dit is een drempel voor review, geen harde limiet: houd één verantwoordelijkheid per bestand en laat samenhangende logica bij elkaar blijven.

### PL-NV-008 — Concurrency heeft zichtbaar eigenaarschap {#pl-nv-008--concurrency-has-visible-ownership}

- Maak concurrency zichtbaar op de plek van de aanroep: `async` / `await`, `thread`, `virtual` en `sync` geven aan wat waar draait.
- Houd elke taak bij die ertoe doet. Start geen fire-and-forget-werk voor resultaten waar het programma later van afhangt.
- Bescherm gedeelde veranderlijke toestand expliciet met `sync` in plaats van op de volgorde van aanroepen te vertrouwen.
- Volg dezelfde discipline als [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) voor afsluiting en annulering.

### PL-NV-009 — Evaluatievolgorde is gedocumenteerd, niet aangenomen {#pl-nv-009--evaluation-order-is-documented-not-assumed}

Novus evalueert operanden van links naar rechts en documenteert de uitzonderingen. Schrijf geen code waarvan het resultaat afhangt van een ongebruikelijke volgorde. Houd neveneffecten in eigen statements en vermijd het combineren van het lezen van een global of veld met een latere aanroep die dat wijzigt in één expressie.

De `..`-keten is bedoeld om een object of array in één lineaire reeks op te bouwen (`var names = []..append("Ada")..append("Grace")`). Gebruik haar wanneer elke stap een aanroep of lidtoewijzing op dezelfde receiver is. Breek een keten op in benoemde stappen wanneer een stap een opmerking of een vertakking nodig heeft.

### PL-NV-010 — C-blokken en platformgrenzen {#pl-nv-010--c-blocks-and-platform-boundaries}

Een `c { ... }`-blok is een native grens. Houd het klein, isoleer het in een afgebakend bestand en leg met een opmerking uit wat de C-code aanneemt over typen, levensduur en het platform. Maak de native functie beschikbaar via een Novus-methode met een getypeerde signatuur, zodat de rest van de code nooit ruwe C-details te zien krijgt.

### PL-NV-011 — `.nvh`-componenten houden markup en logica gescheiden {#pl-nv-011--nvh-components-keep-markup-and-logic-apart}

In een `.nvh`-component:

- Declareer reactieve toestand met `ref` binnen `<?nv ... ?>` bovenaan de component.
- Houd handlers en berekeningen in Novus-blokken; houd de HTML gericht op structuur en presentatie.
- Bereken afgeleide waarden op één plek in plaats van de expressie op meerdere plekken in de markup te herhalen.
- Behandel elke component als één verantwoordelijkheid, net als een klasse (`PL-STRUCT-001`).

### PL-NV-012 — Opmerkingen en diagnostiek {#pl-nv-012--comments-and-diagnostics}

- Opmerkingen leggen uit waarom, niet wat: de reden voor een workaround, een eigenaardigheid van het platform of een niet-vanzelfsprekende invariant ([PL-DOC-001](../core/comments.md)).
- Pureline-diagnostiek moet in de editor zelf worden ingeschakeld (`novus.pureline.enabled`). Schakel haar in voor gedeelde projecten, zodat in elke editor en in CI dezelfde regel-ID's verschijnen.
- Elke vrijstelling met `pureline:allow-else` heeft een reden op dezelfde regel nodig. Een vrijstelling zonder reden is een bevinding bij review.

### PL-NV-013 — Markdown-inhoud (`.nvmd`) {#pl-nv-013--markdown-content-nvmd}

Een `.nvmd`-bestand is Markdown met Novus erin, zoals `.mdx` Markdown met JSX is. De generator in [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) zet `Page.nvmd` om in `Page.nvh` voordat de compiler draait. Pas de bovenstaande regels toe op het headerblok en op alle `.nv`-modules die het importeert; voor de Markdown-body gelden deze regels:

- De body draagt de inhoud. Het headerblok (`<?nv ... ?>`) bevat alleen wat de pagina nodig heeft: imports, props en een paar methoden. Verplaats logica die langer is dan een paar regels naar een `.nv`-module en importeer die.
- De frontmatter-sleutels zijn de props van de pagina. Houd ze kort en plat, en gebruik `{title}` in plaats van de waarde in de tekst te herhalen.
- Beperk elke `{expr}` tot één waarde of één aanroep. Bereken alles wat langer is in de header of in een module, zodat de body als proza van boven naar beneden leest.
- Houd `{#if}`- en `{#for}`-blokken maximaal twee niveaus diep. Gebruik een component (`<Callout>`, `<Toc>`) wanneer een blok markup herhaalt.
- Een kop met dynamische tekst krijgt een expliciete id (`# {title} {#intro}`), zodat ankers en `markdown.headings` stabiel blijven.
- Gegenereerde `.nvh`-bestanden zijn buildoutput. Voeg ze toe aan `.gitignore`, bewerk ze nooit en repareer in plaats daarvan de `.nvmd`-bron. Laat de markering `<?nv /* nvmd-generated */` intact.
- Een HTML-blok met een handler (`<button @click="hit">`) is nvh binnen Markdown. Houd zulke blokken kort en scheid ze met lege regels van de omringende tekst.
