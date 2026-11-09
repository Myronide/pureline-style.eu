# CSS Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe met dit profiel, en het [HTML profiel](html.md) voor de markup die het stijlt. CSS is declaratief: Een regel geeft aan hoe een element eruit ziet, niet hoe de browser het moet berekenen. Pureline CSS gebruikt de moderne taal: aangepaste eigenschappen, cascade lagen, nest, logische eigenschappen, en container queries. Tailwind CSS utility's volgen dezelfde principes als een project ze gebruikt.

## CSS-profiel

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001. Tokens vóór waarden

Kleuren, spatie, radii, font maten en duur zijn aangepaste eigenschappen die eenmaal op `:root` of in een thema-scope worden aangegeven. Componenten lezen `var(--space-3)`; ze herhalen `#22d3ee` of `12px` nooit.

```css
:root {
  --color-accent: #22d3ee;
  --space-3: 0.75rem;
}

.badge {
  color: var(--color-accent);
  padding: var(--space-3);
}
```

### PL-CSS-002. Cascade lagen eigen bestellen

De volgorde van de lagen één keer aangeven: `@layer reset, base, components, utilities;`. Zet de regels van elk bestand in de laag die overeenkomt met hun rol. Vertrouw niet op de broncode of op `!important` om een conflict te winnen.

### PL-CSS-003. Houd Specificiteit laag

Stijl met enkele lessen. Niet stylen met element kettingen (`div section ul li a`) of id's. Specificiteit die groeit met de markup maakt later veranderingen duur. Een keuze die dieper is dan twee niveaus is een beoordelings-vinding.

Liever een speciale klasse wanneer de stijl van het element onafhankelijk van toepassing moet zijn
van zijn positie in het onderdeel.

```text
− Descendant selector                  │ ✓ Pureline
.card .title {                         │ .card-title {
    font-weight: 600;                  │     font-weight: 600;
}                                      │ }
                                       │
<div class="card">                     │ <div class="card">
    <h2 class="title">Profil</h2>       │     <h2 class="card-title">Profil</h2>
</div>                                 │ </div>
```

### PL-CSS-004. Geen `!important` buiten nutsbedrijven

`!important` is alleen toegestaan voor nutsklassen die een component moeten overschrijven, en alleen in de nutslaag. Het is overal een vondst.

### PL-CSS-005. Mirrors het onderdeel

Gebruik inheemse CSS nesten voor staten en kinderen van één component (`&:hover`, `& .title`). Nest niet meer dan twee niveaus. Nesting vervangt nooit een afzonderlijk onderdeel.

### PL-CSS-006. Logische eigenschappen en indelingsmodules

Gebruik logische eigenschappen (`margin-inline`, `padding-block`, `inset-inline-start`) voor lay-outs die in beide schrijfrichtingen moeten werken. Gebruik Flexbox voor eendimensionale rijen en kolommen, en Raster voor tweedimensionale indelingen. Gebruik geen praalwagens voor lay-out.

### PL-CSS-007. Hervattende regels Volg het onderdeel

Prefereer container queries (`@container`) voor de eigen lay-out van een component, en media queries voor pagina-niveau structuur. Elk breekpunt is een genoemd teken, geen herhaald literaal.

### PL-CSS-008. Eigendomsorder is consistent

Binnen een regel, groeperen eigenschappen in deze volgorde met een lege regel tussen groepen: lay-out (`display`, positie, flex/grid), doos (grootte, marge, padding, rand), typografie, visuele (kleur, achtergrond, schaduw) en beweging (overgang, animatie).

### PL-CSS-009. Naamgeving

Klassenamen zijn `kebab-case` en beschrijven de rol van het element (`session-card`, `session-card-title`), niet zijn uiterlijk (`red-box`). BEM-stijlnamen zijn toegestaan als een project ze al gebruikt.

### PL-CSS-010. Beweging respecteert de gebruiker

Elke animatie of transitie heeft een `@media (prefers-reduced-motion: reduce)` alternatief dat het verwijdert of verkort. Alleen Animate `transform` en `opacity`.

### PL-CSS-011. Map Density

Een stylesheet map bevat maximaal **10 bestanden**. Splits op laag of op componentgroep, niet op eigenschaptype (`colors.css`, `spacing.css`).

### PL-CSS-012. Gereedschape

Run een shower zoals `stylelint` met de regels van het project in CI. Schakel de stylelintregels voor specificiteit en `!important` in, zodat PL-CSS-003 en PL-CSS-004 automatisch worden aangevinkt.
