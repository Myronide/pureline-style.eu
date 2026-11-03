# CSS-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe, en het [HTML-profiel](html.md) voor de markup die wordt gestyled. CSS is declaratief: een regel beschrijft hoe een element eruitziet, niet hoe de browser dat moet berekenen. Pureline CSS gebruikt de moderne taal: custom properties, cascade layers, nesting, logische eigenschappen en container queries. Utilities van Tailwind CSS volgen dezelfde principes wanneer een project ze gebruikt.

## CSS-profiel {#css-profile}

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Tokens vóór waarden {#pl-css-001--tokens-before-values}

Kleuren, spaties, afrondingen, lettergroottes en duur zijn custom properties die eenmalig op `:root` of in een themascope worden gedeclareerd. Componenten lezen `var(--space-3)`; ze herhalen nooit `#22d3ee` of `12px`.

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

### PL-CSS-002 — Cascade layers bepalen de volgorde {#pl-css-002--cascade-layers-own-the-order}

Declareer de volgorde van de layers eenmalig: `@layer reset, base, components, utilities;`. Zet de regels van elk bestand in de layer die bij hun rol past. Vertrouw niet op de bronvolgorde of op `!important` om een conflict te winnen.

### PL-CSS-003 — Houd de specificiteit laag {#pl-css-003--keep-specificity-low}

Style met enkele klassen. Style niet met elementketens (`div section ul li a`) of id's. Specificiteit die met de markup meegroeit, maakt latere wijzigingen duur. Een selector die dieper is dan twee niveaus is een bevinding bij review.

### PL-CSS-004 — Geen `!important` buiten utilities {#pl-css-004--no-important-outside-utilities}

`!important` is alleen toegestaan voor utility-klassen die een component moeten overschrijven, en alleen in de utilities-layer. Overal elders is het een bevinding.

### PL-CSS-005 — Nesting volgt de component {#pl-css-005--nesting-mirrors-the-component}

Gebruik native CSS-nesting voor toestanden en kinderen van één component (`&:hover`, `& .title`). Nest niet dieper dan twee niveaus. Nesting vervangt nooit een aparte component.

### PL-CSS-006 — Logische eigenschappen en layoutmodules {#pl-css-006--logical-properties-and-layout-modules}

Gebruik logische eigenschappen (`margin-inline`, `padding-block`, `inset-inline-start`) voor layouts die in beide schrijfrichtingen moeten werken. Gebruik Flexbox voor eendimensionale rijen en kolommen en Grid voor tweedimensionale layouts. Gebruik geen floats voor layout.

### PL-CSS-007 — Responsieve regels volgen de component {#pl-css-007--responsive-rules-follow-the-component}

Geef de voorkeur aan container queries (`@container`) voor de eigen layout van een component en aan media queries voor structuur op paginaniveau. Elk breakpoint is een benoemd token, geen herhaalde letterlijke waarde.

### PL-CSS-008 — De volgorde van eigenschappen is consistent {#pl-css-008--property-order-is-consistent}

Groepeer binnen een regel de eigenschappen in deze volgorde, met een lege regel tussen de groepen: layout (`display`, positie, flex/grid), box (afmetingen, marge, padding, rand), typografie, visueel (kleur, achtergrond, schaduw) en beweging (transition, animation).

### PL-CSS-009 — Naamgeving {#pl-css-009--naming}

Klassenamen zijn `kebab-case` en beschrijven de rol van het element (`session-card`, `session-card-title`), niet het uiterlijk (`red-box`). Namen in BEM-stijl zijn toegestaan wanneer een project ze al gebruikt.

### PL-CSS-010 — Beweging respecteert de gebruiker {#pl-css-010--motion-respects-the-user}

Elke animatie of transitie heeft een alternatief in `@media (prefers-reduced-motion: reduce)` dat haar verwijdert of verkort. Animeer alleen `transform` en `opacity`.

### PL-CSS-011 — Mapdichtheid {#pl-css-011--folder-density}

Een map met stylesheets bevat maximaal **10 bestanden**. Splits per layer of per componentgroep, niet per eigenschapstype (`colors.css`, `spacing.css`).

### PL-CSS-012 — Tooling {#pl-css-012--tooling}

Voer in CI een linter uit, zoals `stylelint`, met de regels van het project. Schakel de stylelint-regels voor specificiteit en `!important` in, zodat PL-CSS-003 en PL-CSS-004 automatisch worden gecontroleerd.
