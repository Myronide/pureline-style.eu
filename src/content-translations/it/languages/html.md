# Stile del codice HTML

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo. HTML è la struttura di un documento. Pureline HTML usa **elementi semantici**, tiene la presentazione nel CSS e il comportamento in JavaScript. Pureline HTML ha come obiettivo i documenti **HTML Living Standard** e i template dei framework che li producono (Astro; i template JSX sono esclusi: vedi i profili dei framework).

## Profilo HTML {#html-profile}

### PL-HTML-001 — Usare elementi semantici {#pl-html-001--use-semantic-elements}

Scegli l'elemento in base al significato del contenuto: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Un `<div>` o uno `<span>` serve per un raggruppamento che non ha un significato proprio. Un pulsante che esegue un'azione è un `<button>`; un link che porta altrove è un `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Una sola struttura dei titoli per pagina {#pl-html-002--one-heading-structure-per-page}

Una pagina ha un solo `<h1>`. I titoli seguono il loro livello in ordine (`h2` dopo `h1`, `h3` dopo `h2`) e non vengono mai scelti per la loro dimensione; la dimensione spetta al CSS.

### PL-HTML-003 — Gli attributi sono minimi e tra virgolette {#pl-html-003--attributes-are-minimal-and-quoted}

Usa nomi di elementi e attributi in minuscolo, virgolette doppie per i valori degli attributi e nessun attributo `style` in linea né gestore di eventi in linea. Ometti gli attributi che coincidono con il loro valore predefinito. Mantieni brevi i valori di `class` e dai loro un nome in base al ruolo.

### PL-HTML-004 — I moduli hanno etichette {#pl-html-004--forms-have-labels}

Ogni input ha un `<label>` visibile associato tramite `for` e `id`, oppure che racchiude l'input. Il testo segnaposto non è un'etichetta. Raggruppa i controlli correlati con `<fieldset>` e `<legend>`.

### PL-HTML-005 — Immagini e media hanno alternative testuali {#pl-html-005--images-and-media-have-text-alternatives}

Ogni `<img>` ha un attributo `alt`: una descrizione per le immagini informative, un `alt=""` vuoto per quelle decorative. Assegna `width` e `height` per evitare spostamenti del layout. I video forniscono i sottotitoli tramite `<track>`.

### PL-HTML-006 — Tenere il comportamento fuori dal markup {#pl-html-006--keep-behaviour-out-of-markup}

Gli script sono file esterni caricati con `type="module"` o `defer`. Non inserire nella pagina blocchi `<script>` in linea con logica applicativa. L'unica eccezione accettata sono i dati JSON in linea per un singolo script, contrassegnati con `type="application/json"`.

### PL-HTML-007 — L'head del documento è completo {#pl-html-007--document-head-is-complete}

Ogni pagina imposta `<html lang>`, un `<meta name="viewport">`, un `<title>` univoco e un `<meta name="description">` quando la pagina è pubblica. Favicon e metadati social sono dichiarati una sola volta nel layout, non ripetuti per ogni pagina.

### PL-HTML-008 — Annidamento compatto {#pl-html-008--compact-nesting}

Mantieni poco profondo l'annidamento degli elementi. Quando un blocco si annida per più di quattro livelli, estrai un componente o un frammento di template. Metti un elemento di blocco per riga; mantieni il contenuto di frase in linea sulla stessa riga del suo testo.

### PL-HTML-009 — La validazione fa parte della build {#pl-html-009--validation-is-part-of-the-build}

Valida l'HTML nella CI con il validatore W3C o con `html-validate`. Un avviso su un `alt` o un'etichetta mancante è un fallimento della build, non un suggerimento.
