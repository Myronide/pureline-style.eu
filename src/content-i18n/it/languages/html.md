# HTML Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile. HTML is the structure of a document. Pureline HTML uses **semantic elements**, keeps presentation in CSS, and keeps behaviour in JavaScript. Pureline HTML targets **HTML Living Standard** documents and the framework templates that produce them (Astro, JSX templates excluded: see the framework profiles).

## HTML Profile

### PL-HTML-001 — Use Semantic Elements

Choose the element for the meaning of the content: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. A `<div>` or `<span>` is for grouping that has no meaning of its own. A button that performs an action is a `<button>`; a link that navigates is an `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002. Struttura di una rubrica per pagina l'equazione 2D..

A page has one `<h1>`. Headings follow their level in order (`h2` after `h1`, `h3` after `h2`) and are never chosen for their size; size belongs to CSS.

### PL-HTML-003 — Attributes Are Minimal and Quoted

Use lowercase element and attribute names, double quotes for attribute values, and no inline `style` attributes or inline event handlers. Omit attributes that equal their default. Keep `class` values short and named by role.

### PL-HTML-004. I moduli hanno etichette

Ogni ingresso ha uno `<label>` visibile associato a `for` e `id`, o avvolge l'ingresso.. Placeholder text is not a label. Controlli relativi al gruppo con `<fieldset>` e `<legend>`...

### PL-HTML-005. Le immagini e i media hanno alternative di testo

Ogni `<img>` ha un attributo `alt`: a description for informative images, an empty `alt=""` for decorative ones. Give `width` and `height` to prevent layout shift. Videos provide captions through `<track>`.

### PL-HTML-006 — Keep Behaviour Out of Markup

Scripts are external files loaded with `type="module"` or `defer`. Do not place inline `<script>` blocks with application logic in the page. Inline JSON data for a single script is the only accepted exception, marked with `type="application/json"`.

### PL-HTML-007. Testa del documento è completata

Each page sets `<html lang>`, a `<meta name="viewport">`, a unique `<title>`, and a `<meta name="description">` when the page is public. Favicons and social metadata are declared once in the layout, not repeated per page.

### PL-HTML-008. Nesting compatto

Keep element nesting shallow. Quando un blocco nidifica più di quattro livelli in profondità, estrae un componente o un frammento di modello. Metti un elemento blocco per linea; mantieni il contenuto di fraseggio in linea sulla stessa linea del suo testo.

### PL-HTML-009. La convalida è parte della costruzione

Convalidare HTML in CI con il validatore W3C o `html-validate`. Un avvertimento su una `alt` mancante o etichetta è un fallimento di build, non un suggerimento..
