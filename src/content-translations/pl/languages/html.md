# HTML Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. HTML to struktura dokumentu. Pureline HTML używa **elementów semantycznych**, trzyma prezentację w CSS, a zachowanie w JavaScript. Pureline HTML dotyczy dokumentów **HTML Living Standard** oraz szablonów frameworków, które je tworzą (Astro; szablony JSX są wyłączone: zobacz profile frameworków).

## Profil HTML {#html-profile}

### PL-HTML-001 — Używaj elementów semantycznych {#pl-html-001--use-semantic-elements}

Element wybieraj według znaczenia treści: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. `<div>` lub `<span>` służy do grupowania, które nie ma własnego znaczenia. Przycisk wykonujący akcję to `<button>`; odnośnik, który nawiguje, to `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Jedna struktura nagłówków na stronę {#pl-html-002--one-heading-structure-per-page}

Strona ma jeden `<h1>`. Nagłówki podążają za swoim poziomem po kolei (`h2` po `h1`, `h3` po `h2`) i nigdy nie są wybierane ze względu na rozmiar; rozmiar należy do CSS.

### PL-HTML-003 — Atrybuty są minimalne i w cudzysłowach {#pl-html-003--attributes-are-minimal-and-quoted}

Używaj nazw elementów i atrybutów pisanych małymi literami, podwójnych cudzysłowów dla wartości atrybutów oraz żadnych atrybutów `style` w linii ani handlerów zdarzeń w linii. Pomijaj atrybuty równe swojej wartości domyślnej. Wartości `class` utrzymuj krótkie i nazywaj według roli.

### PL-HTML-004 — Formularze mają etykiety {#pl-html-004--forms-have-labels}

Każde pole ma widoczny `<label>` powiązany przez `for` i `id` albo obejmujący pole. Tekst zastępczy (placeholder) nie jest etykietą. Powiązane kontrolki grupuj za pomocą `<fieldset>` i `<legend>`.

### PL-HTML-005 — Obrazy i media mają alternatywy tekstowe {#pl-html-005--images-and-media-have-text-alternatives}

Każdy `<img>` ma atrybut `alt`: opis dla obrazów informacyjnych, pusty `alt=""` dla dekoracyjnych. Podaj `width` i `height`, aby zapobiec przesunięciom układu. Wideo zapewnia napisy przez `<track>`.

### PL-HTML-006 — Trzymaj zachowanie poza markupem {#pl-html-006--keep-behaviour-out-of-markup}

Skrypty to zewnętrzne pliki ładowane z `type="module"` lub `defer`. Nie umieszczaj na stronie blokowych `<script>` w linii z logiką aplikacji. Jedynym akceptowanym wyjątkiem są dane JSON w linii dla pojedynczego skryptu, oznaczone `type="application/json"`.

### PL-HTML-007 — Nagłówek dokumentu jest kompletny {#pl-html-007--document-head-is-complete}

Każda strona ustawia `<html lang>`, `<meta name="viewport">`, unikalny `<title>` oraz `<meta name="description">`, gdy strona jest publiczna. Favikony i metadane dla mediów społecznościowych deklaruje się raz w layoucie, a nie powtarza na każdej stronie.

### PL-HTML-008 — Zwarte zagnieżdżenie {#pl-html-008--compact-nesting}

Utrzymuj płytkie zagnieżdżenie elementów. Gdy blok zagnieżdża się głębiej niż na cztery poziomy, wyodrębnij komponent lub fragment szablonu. Umieszczaj jeden element blokowy w linii; treść frazową (inline) trzymaj w tej samej linii co jej tekst.

### PL-HTML-009 — Walidacja jest częścią budowania {#pl-html-009--validation-is-part-of-the-build}

Waliduj HTML w CI za pomocą walidatora W3C lub `html-validate`. Ostrzeżenie o brakującym `alt` lub etykiecie jest błędem budowania, a nie sugestią.
