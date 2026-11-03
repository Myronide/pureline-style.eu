# HTML-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. HTML is de structuur van een document. Pureline HTML gebruikt **semantische elementen**, houdt presentatie in CSS en gedrag in JavaScript. Pureline HTML richt zich op documenten volgens de **HTML Living Standard** en op de frameworktemplates die ze produceren (Astro; JSX-templates uitgezonderd: zie de frameworkprofielen).

## HTML-profiel {#html-profile}

### PL-HTML-001 — Gebruik semantische elementen {#pl-html-001--use-semantic-elements}

Kies het element op basis van de betekenis van de inhoud: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Een `<div>` of `<span>` is bedoeld voor groepering die zelf geen betekenis heeft. Een knop die een actie uitvoert is een `<button>`; een link die navigeert is een `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Eén kopstructuur per pagina {#pl-html-002--one-heading-structure-per-page}

Een pagina heeft één `<h1>`. Koppen volgen hun niveau in volgorde (`h2` na `h1`, `h3` na `h2`) en worden nooit gekozen vanwege hun grootte; grootte hoort bij CSS.

### PL-HTML-003 — Attributen zijn minimaal en tussen aanhalingstekens {#pl-html-003--attributes-are-minimal-and-quoted}

Gebruik element- en attribuutnamen in kleine letters, dubbele aanhalingstekens voor attribuutwaarden en geen inline `style`-attributen of inline event handlers. Laat attributen weg die gelijk zijn aan hun standaardwaarde. Houd `class`-waarden kort en benoem ze naar hun rol.

### PL-HTML-004 — Formulieren hebben labels {#pl-html-004--forms-have-labels}

Elk invoerveld heeft een zichtbaar `<label>` dat met `for` en `id` is gekoppeld, of dat het invoerveld omsluit. Plaatsvervangende tekst is geen label. Groepeer gerelateerde besturingselementen met `<fieldset>` en `<legend>`.

### PL-HTML-005 — Afbeeldingen en media hebben tekstalternatieven {#pl-html-005--images-and-media-have-text-alternatives}

Elke `<img>` heeft een `alt`-attribuut: een beschrijving voor informatieve afbeeldingen, een lege `alt=""` voor decoratieve. Geef `width` en `height` op om layoutverschuiving te voorkomen. Video's bieden ondertitels via `<track>`.

### PL-HTML-006 — Houd gedrag uit de markup {#pl-html-006--keep-behaviour-out-of-markup}

Scripts zijn externe bestanden die worden geladen met `type="module"` of `defer`. Plaats geen inline `<script>`-blokken met applicatielogica in de pagina. Inline JSON-data voor één enkel script is de enige geaccepteerde uitzondering, gemarkeerd met `type="application/json"`.

### PL-HTML-007 — De documentkop is compleet {#pl-html-007--document-head-is-complete}

Elke pagina stelt `<html lang>`, een `<meta name="viewport">`, een unieke `<title>` en, wanneer de pagina openbaar is, een `<meta name="description">` in. Favicons en sociale metadata worden eenmalig in de layout gedeclareerd en niet per pagina herhaald.

### PL-HTML-008 — Compacte nesting {#pl-html-008--compact-nesting}

Houd de nesting van elementen ondiep. Wanneer een blok meer dan vier niveaus diep nest, extraheer dan een component of een templatefragment. Zet één blokelement per regel; houd inline frasering op dezelfde regel als de bijbehorende tekst.

### PL-HTML-009 — Validatie is onderdeel van de build {#pl-html-009--validation-is-part-of-the-build}

Valideer HTML in CI met de W3C-validator of `html-validate`. Een waarschuwing over een ontbrekende `alt` of een ontbrekend label is een mislukte build en geen suggestie.
