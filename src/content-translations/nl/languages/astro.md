# Astro-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe, en het [TypeScript-profiel](typescript.md) voor het frontmatterscript. Astro rendert HTML op de server of tijdens de build en levert alleen JavaScript mee waar dat nodig is. Pureline Astro houdt dat model zichtbaar: standaard statisch, interactief waar dat is gedeclareerd. Pureline is compatibel met Astro 5 en nieuwer.

## Astro-profiel {#astro-profile}

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Componenten zijn `.astro`-bestanden met namen in `PascalCase` {#pl-as-001--components-are-astro-files-named-in-pascalcase}

Een component staat in `src/components/` en is vernoemd naar wat hij rendert (`SessionCard.astro`). Een pagina of layout staat in `src/pages/` of `src/layouts/`. Routebestanden blijven dun: ze laden data en stellen componenten samen.

### PL-AS-002 — Frontmatter is lineair en getypeerd {#pl-as-002--frontmatter-is-linear-and-typed}

De frontmatter (tussen `---`-hekjes) doet vier dingen in volgorde: getypeerde props ontvangen, data laden, afgeleide waarden berekenen en daarna renderen. Declareer props met een `interface Props`. Houd de frontmatter vrij van markup.

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

### PL-AS-003 — Standaard statisch, islands op declaratie {#pl-as-003--static-by-default-islands-by-declaration}

Render HTML zonder JavaScript, tenzij de component op de gebruiker moet reageren of in de loop van de tijd moet veranderen. Wanneer dat moet, markeer je de ene interactieve component met een expliciete client-directive: `client:visible` voor inhoud onder de vouw, `client:idle` voor niet-urgente widgets en `client:load` alleen voor wat bij de eerste weergave nodig is. Een component zonder directive levert nooit JavaScript mee.

### PL-AS-004 — Templates blijven leesbaar {#pl-as-004--templates-stay-readable}

- Gebruik voorwaarden met `&&` of een benoemde variabele voor één enkele tak; gebruik een guard in de frontmatter voor vroege uitgangen.
- Gebruik maps over lijsten met een stabiele `key` wanneer de lijst interactief is.
- Nest niet meer dan twee expressieniveaus in de markup. Verplaats het binnenste deel naar een component.

### PL-AS-005 — Stijlen hebben een eigen scope {#pl-as-005--styles-are-scoped}

Gebruik standaard `<style>`-blokken in de component; Astro geeft ze automatisch een eigen scope. Gebruik `is:global` alleen voor regels die voor het hele document gelden, zoals reset of themetokens, en houd die in één globale stylesheet.

### PL-AS-006 — Data heeft één bron {#pl-as-006--data-has-one-source}

Inhoud staat in content collections (`src/content/`) met een schema (`defineCollection` en zod). Pagina's bevragen de collectie; ze parsen Markdown-bestanden niet zelf. Externe data wordt eenmalig geladen in de frontmatter van de pagina die haar nodig heeft.

### PL-AS-007 — Framework-islands volgen hun eigen profiel {#pl-as-007--framework-islands-follow-their-own-profile}

Een React-, Vue- of Svelte-island volgt het profiel van dat framework (voor React: [PL-REACT](react.md)). Astro verandert de regels van de component niet; het bepaalt alleen waar de component wordt gehydrateerd.

### PL-AS-008 — Mapdichtheid {#pl-as-008--folder-density}

`src/components/` bevat standaard maximaal **10 bestanden**. Groepeer componenten per feature (`components/blog/`) zodra een feature meerdere bestanden heeft.

### PL-AS-009 — Tooling {#pl-as-009--tooling}

Voer in CI `astro check` (typen en templatediagnostiek) en de build uit. Gebruik de uitvoer van `astro build` om te controleren dat pagina's zonder islands geen JavaScript meeleveren.
