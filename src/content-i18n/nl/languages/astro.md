# Astro Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe met dit profiel, en het [TypeScript profile](typescript.md) voor het frontmateriescript. Astro rendert HTML op de server of op bouwtijd en stuurt JavaScript alleen waar het nodig is. Pureline Astro houdt dat model zichtbaar: standaard statische, interactief indien aangegeven. Pureline is compatibel met Astro 5 en later.

## Astro-profiel

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001. Componenten zijn `.astro`-bestanden genoemd in `PascalCase`

Een component leeft in `src/components/` en is vernoemd naar wat het rendert (`SessionCard.astro`). Een pagina of lay-out woont in `src/pages/` of `src/layouts/`. Routebestanden blijven dun: zij laden gegevens en samenstellen onderdelen.

### PL-AS-002. Voorgrond is lineair en getypt

De voorste lat (tussen `---` hekken) doet vier dingen in volgorde: ontvangen getypte rekwisieten, laden gegevens, berekenen afgeleide waarden, en vervolgens renderen. Declareer rekwisieten met een `interface Props`. Houd de voorste vlek vrij van markup.

```astro
---
interface Props {
    title: string;
    draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
    return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
```

### PL-AS-003. Statisch naar standaard, eilanden volgens verklaring

Render HTML zonder JavaScript tenzij het onderdeel moet reageren op de gebruiker of in de loop van de tijd moet veranderen. Wanneer het moet, markeer het ene interactieve onderdeel met een expliciete cliëntrichtlijn: `client:visible` voor inhoud onder de vouw, `client:idle` voor niet-stijve widgets, `client:load` alleen voor wat nodig is bij de eerste verf. Een onderdeel zonder richtlijn wordt nooit verzonden naar JavaScript.

### PL-AS-004. Sjablonen blijven klaarstaan

- Voorwaardelijke elementen met `&&` of een genoemde variabele voor één tak; gebruik een bewaker in de voormatter voor vroege uitgangen.
- Kaarten over lijsten met een stabiele `key` als de lijst interactief is.
- Nest niet meer dan twee expressieniveaus binnen de markup. Verplaats het binnenste deel naar een onderdeel.

Keep a short formatting expression in the template when it is used once
and reads clearly at the point of use.

```text
Named frontmatter value                         │ ✓ Pureline
---                                             │ ---
const { title } = Astro.props;                  │ const { title } = Astro.props;
const displayTitle = title.trim() || "Profil";  │ ---
---                                             │
                                                │ <h1>{title.trim() || "Profil"}</h1>
<h1>{displayTitle}</h1>                         │
```

### PL-AS-005. Stijlen zijn Scoped

Gebruik standaard `<style>`-blokken in het onderdeel; Astro maakt ze automatisch toegankelijk. Gebruik `is:global` alleen voor documentbrede regels zoals reset of thema tokens, en bewaar deze in één wereldwijd stylesheet.

### PL-AS-006. Gegevens hebben één bron

Inhoud leeft in inhoudsverzamelingen (`src/content/`) met een "Alyene" (`defineCollection` en zod). Pagina's zoeken de collectie op; ze ontleden Markdown-bestanden zelf niet. De gegevens op afstand worden in de voorkant van de pagina geladen die het nodig heeft, eenmaal.

### PL-AS-007. Framework Islands Volg hun eigen profiel

Een React, Vue of Svelte eiland volgt het profiel van dat kader (voor React:) [PL-REACT](react.md)). Astro verandert de regels van het onderdeel niet; het besluit alleen waar het onderdeel gehydrateerd is.

### PL-AS-008. Map Density

`src/components/` bevat hooguit **10 bestanden** standaard. Groepscomponenten per functie (`components/blog/`) zodra een functie heeft verschillende bestanden.

### PL-AS-009. Gereedschape

Run `astro check` (types en template diagnostiek) en de ingebouwde CI. Gebruik `astro build`-uitvoer om te controleren of pagina's zonder eilanden geen JavaScript verzenden.
