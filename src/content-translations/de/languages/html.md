# HTML Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an. HTML ist die Struktur eines Dokuments. Pureline HTML verwendet **semantische Elemente**, hält die Darstellung in CSS und das Verhalten in JavaScript. Pureline HTML zielt auf Dokumente nach dem **HTML Living Standard** und auf die Framework-Templates, die sie erzeugen (Astro; JSX-Templates sind ausgenommen, siehe die Framework-Profile).

## HTML-Profil {#html-profile}

### PL-HTML-001 — Semantische Elemente verwenden {#pl-html-001--use-semantic-elements}

Wähle das Element nach der Bedeutung des Inhalts: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Ein `<div>` oder `<span>` dient dem Gruppieren ohne eigene Bedeutung. Ein Button, der eine Aktion ausführt, ist ein `<button>`; ein Link, der navigiert, ist ein `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Eine Überschriftenstruktur pro Seite {#pl-html-002--one-heading-structure-per-page}

Eine Seite hat genau ein `<h1>`. Überschriften folgen ihrer Ebene der Reihe nach (`h2` nach `h1`, `h3` nach `h2`) und werden nie wegen ihrer Größe gewählt; die Größe gehört in CSS.

### PL-HTML-003 — Attribute sind minimal und in Anführungszeichen {#pl-html-003--attributes-are-minimal-and-quoted}

Verwende kleingeschriebene Element- und Attributnamen, doppelte Anführungszeichen für Attributwerte und keine Inline-`style`-Attribute oder Inline-Event-Handler. Lass Attribute weg, die ihrem Standardwert entsprechen. Halte `class`-Werte kurz und benenne sie nach ihrer Rolle.

### PL-HTML-004 — Formulare haben Labels {#pl-html-004--forms-have-labels}

Jedes Eingabefeld hat ein sichtbares `<label>`, das über `for` und `id` zugeordnet ist oder das Feld umschließt. Platzhaltertext ist kein Label. Gruppiere zusammengehörige Steuerelemente mit `<fieldset>` und `<legend>`.

### PL-HTML-005 — Bilder und Medien haben Textalternativen {#pl-html-005--images-and-media-have-text-alternatives}

Jedes `<img>` hat ein `alt`-Attribut: eine Beschreibung für informative Bilder, ein leeres `alt=""` für dekorative. Gib `width` und `height` an, um Layoutverschiebungen zu vermeiden. Videos liefern Untertitel über `<track>`.

### PL-HTML-006 — Verhalten gehört nicht ins Markup {#pl-html-006--keep-behaviour-out-of-markup}

Skripte sind externe Dateien, die mit `type="module"` oder `defer` geladen werden. Platziere keine Inline-`<script>`-Blöcke mit Anwendungslogik in der Seite. Inline-JSON-Daten für ein einzelnes Skript sind die einzige akzeptierte Ausnahme, gekennzeichnet mit `type="application/json"`.

### PL-HTML-007 — Der Dokumentkopf ist vollständig {#pl-html-007--document-head-is-complete}

Jede Seite setzt `<html lang>`, ein `<meta name="viewport">`, einen eindeutigen `<title>` und, wenn die Seite öffentlich ist, ein `<meta name="description">`. Favicons und Social-Metadaten werden einmal im Layout deklariert, nicht pro Seite wiederholt.

### PL-HTML-008 — Kompakte Verschachtelung {#pl-html-008--compact-nesting}

Halte die Verschachtelung von Elementen flach. Wenn ein Block tiefer als vier Ebenen verschachtelt ist, extrahiere eine Komponente oder ein Template-Fragment. Setze ein Block-Element pro Zeile; Inline-Phrasing-Content bleibt in derselben Zeile wie sein Text.

### PL-HTML-009 — Validierung gehört zum Build {#pl-html-009--validation-is-part-of-the-build}

Validiere HTML in der CI mit dem W3C-Validator oder `html-validate`. Eine Warnung wegen eines fehlenden `alt` oder Labels ist ein Build-Fehler, keine Empfehlung.
