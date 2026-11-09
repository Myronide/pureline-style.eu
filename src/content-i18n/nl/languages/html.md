# HTML-codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. HTML is de structuur van een document. Pureline HTML gebruikt **semantische elementen**, houdt presentatie in CSS, en houdt gedrag in JavaScript. Pureline HTML richt zich op **HTML Living Standard** documenten en de kadersjablonen die ze produceren (Astro, JSX templates uitgesloten: zie de kaderprofielen).

## HTML-profiel

### PL-HTML-001. Semantische elementen gebruiken

Kies het element voor de betekenis van de inhoud: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Een `<div>` of `<span>` is voor groepering die geen eigen betekenis heeft. Een knop die een actie uitvoert is een `<button>`; een link die navigeert is een `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002. Eén kopstructuur per pagina

Een pagina heeft één `<h1>`. De koers volgt hun niveau in volgorde (`h2` na `h1`, `h3` na `h2`) en worden nooit gekozen voor hun grootte; de grootte behoort tot CSS.

### PL-HTML-003. Attributen zijn minimaal en geciteerd

Gebruik kleine letters en attribuutnamen, dubbele aanhalingstekens voor attribuutwaarden en geen inline `style`-attributen of inline event-afhandelingen. Omit attributen die gelijk zijn aan hun standaard. Houd `class`-waarden kort en door rol genoemd.

### PL-HTML-004. Formulieren hebben labels

Elke invoer heeft een zichtbare `<label>` geassocieerd met `for` en `id`, of wrapt de invoer. Plaatshoudertekst is geen label. Groepsgerelateerde controles met `<fieldset>` en `<legend>`.

Geef de voorkeur aan een wikkellabel wanneer de tekst en de invoer samen horen in
the markup. Gebruik een expliciete `for` en `id` associatie wanneer ze nodig zijn om
gescheiden..

```text
Explicit association                        │ ✓ Pureline
<label for="email">E-Mail</label>           │ <label>
<input id="email" name="email" type="email"> │     E-Mail
                                            │     <input name="email" type="email">
                                            │ </label>
```

### PL-HTML-005. Afbeeldingen en media hebben tekstalternatieven

Elke `<img>` heeft een `alt` attribuut: een beschrijving van informatieve afbeeldingen, een lege `alt=""` voor decoratieve afbeeldingen. Geef `width` en `height` om layoutverschuiving te voorkomen. Video's bieden ondertitels via `<track>`.

### PL-HTML-006. Houd gedrag uit de markup

Scripts zijn externe bestanden geladen met `type="module"` of `defer`. Plaats geen `<script>`-blokken in lijn met toepassingslogica op de pagina. Inline JSON-gegevens voor één enkel script is de enige geaccepteerde uitzondering, gemarkeerd met `type="application/json"`.

### PL-HTML-007. Documenthoofd is voltooid

Elke pagina stelt `<html lang>`, een `<meta name="viewport">`, een unieke `<title>` en een `<meta name="description">` in als de pagina openbaar is. Favicons en sociale metadata worden eenmaal in de lay-out aangegeven, niet per pagina herhaald.

### PL-HTML-008. Compacte nesten

Houd het element ondiep. Als een blok meer dan vier niveaus diep nest, moet een component of een sjabloonfragment worden verwijderd. Zet één blok element per regel; houd inline frasering inhoud op dezelfde regel als de tekst.

### PL-HTML-009. Validatie maakt deel uit van de Build

Valideer HTML in CI met de W3C validator of `html-validate`. Een waarschuwing over een ontbrekende `alt` of label is een bouwfout, geen suggestie.
