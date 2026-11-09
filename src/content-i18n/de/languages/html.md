# HTML-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) mit diesem Profil an. HTML ist die Struktur eines Dokuments.. Pureline HTML verwendet **semantische Elemente**, hält die Präsentation in CSS und hält das Verhalten in JavaScript. Pureline HTML-Ziele **HTML Living Standard**-Dokumente und die Rahmenvorlagen, die sie erzeugen (Astro, JSX-Vorlagen ausgeschlossen: siehe die Rahmenprofile).

## HTML-Profil

### PL-HTML-001 — Semantische Elemente verwenden

Wählen Sie das Element für die Bedeutung des Inhalts: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Ein `<div>` oder `<span>` ist für die Gruppierung, die keine eigene Bedeutung hat. Ein Knopf, der eine Aktion durchführt, ist ein `<button>`; ein Link, der navigiert, ist ein `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Eine Überschrift pro Seite

Eine Seite hat einen `<h1>`. Die Überschriften folgen ihrem Level in Reihenfolge (`h2` nach `h1`, `h3` nach `h2`) und werden nie für ihre Größe gewählt; die Größe gehört zu CSS.

### PL-HTML-003 — Attribute sind minimal und Zitat

Verwenden Sie Kleinbuchstaben und Attributnamen, doppelte Anführungszeichen für Attributwerte und keine `style`-Attribute oder Inline-Ereignishandler. Attribute, die ihrem Standard entsprechen, weglassen. Keep `class` values short and named by role.

### PL-HTML-004 — Forms Have Labels

Every input has a visible `<label>` associated with `for` and `id`, or wraps the input. Placeholder text is not a label. Group related controls with `<fieldset>` and `<legend>`.

Bevorzugen Sie ein Umhüllungsetikett, wenn der Etikettentext und die Eingabe zusammen gehören in
Die Markierung. Verwenden Sie eine explizite `for` und `id` Assoziation, wenn sie sein müssen
getrennt.

```text
Explicit association                        │ ✓ Pureline
<label for="email">E-Mail</label>           │ <label>
<input id="email" name="email" type="email"> │     E-Mail
                                            │     <input name="email" type="email">
                                            │ </label>
```

### PL-HTML-005 — Images and Media Have Text Alternatives

Every `<img>` has an `alt` attribute: a description for informative images, an empty `alt=""` for decorative ones. Geben Sie `width` und `height`, um Layout-Verlagerungen zu verhindern. Videos bieten Bildunterschriften durch `<track>`.

### PL-HTML-006 — Benehmen Sie sich aus Markup heraus

Skripte sind externe Dateien, die mit `type="module"` oder `defer` geladen werden. Legen Sie keine `<script>`-Blöcke mit Anwendungslogik in die Seite. Inline JSON Daten für ein einzelnes Skript ist die einzige akzeptierte Ausnahme, markiert mit `type="application/json"`.

### PL-HTML-007 — Dokumentchef ist vollständig

Jede Seite setzt `<html lang>`, ein `<meta name="viewport">`, ein einzigartiges `<title>` und ein `<meta name="description">`, wenn die Seite öffentlich ist. Favicons und soziale Metadaten werden einmal im Layout deklariert, nicht pro Seite wiederholt.

### PL-HTML-008 — Kompakte Verschachtelung

Element seicht halten. Wenn ein Block mehr als vier Ebenen tief nist, extrahieren Sie ein Bauteil oder ein Vorlagenfragment. Setzen Sie ein Blockelement pro Zeile; halten Sie den Inhalt der Inline-Phrasierung auf der gleichen Zeile wie der Text.

### PL-HTML-009 — Validierung ist Teil des Baus

HTML in CI mit dem W3C-Validator oder `html-validate` validieren. Eine Warnung vor einem fehlenden `alt` oder Label ist ein Build-Fehler, kein Vorschlag.
