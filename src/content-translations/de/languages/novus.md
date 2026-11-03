# Novus Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Novus ist eine selbst gehostete Sprache, die zu portablem C kompiliert, mit dynamisch typisierten Werten, optionaler statischer Typisierung, serverseitig gerenderten `.nvh`-Komponenten und `.nvmd`-Markdown-Inhalten über [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Das Profil folgt den Novus-Beispielen, der Standardbibliothek und den Regeln, die der Novus-Language-Server prüft, wenn die Pureline-Stil-Diagnosen aktiviert sind (`novus.pureline.enabled`). [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

Die Regel-IDs `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` und `PL-NAME-001` meldet der Novus-Language-Server bereits unter der Quelle `pureline`. Die Novus-spezifischen Regeln unten verwenden das Präfix `PL-NV-*`.

## Novus-Profil {#novus-profile}

### PL-NV-001 — Benennung und Sichtbarkeit {#pl-nv-001--naming-and-visibility}

- Klassen, Enums und Komponenten: `PascalCase`.
- Methoden, Felder, lokale Variablen und Parameter: `lowerCamelCase`.
- Paketnamen (Ordnernamen): kurz, kleingeschrieben, ohne Trennzeichen.
- Konstanten: `private final SCREAMING_SNAKE_CASE` auf Dateiebene.
- Halte Member privat, solange nicht ein anderes Paket oder eine andere Datei sie verwendet. Gib Felder nur dann über `: get` oder `: get, set` frei, wenn Aufrufer sie brauchen.
- Kurze Namen sind für Schleifenzähler erlaubt (`i`, `j`, `k`). Andere einbuchstabige Namen und Platzhalter (`tmp`, `obj`, `thing`, `data2`) meldet `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002 — Guard Clauses und linearer Fluss {#pl-nv-002--guard-clauses-and-linear-flow}

Validiere zuerst, kehre früh zurück und halte den erfolgreichen Pfad auf der Basis-Einrückung.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Vermeide `else` nach einem Zweig, der bereits mit return, break oder continue endet (`PL-CF-002`). Ist ein `else` tatsächlich die klarste Form, markiere die Zeile mit einer begründeten Ausnahme:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Deklarationen: `final`, `var` und explizite Typen {#pl-nv-003--declarations-final-var-and-explicit-types}

- Verwende `final` für Werte, die sich nie ändern; verwende `var` für lokale Variablen, deren Typ aus dem Initialisierer offensichtlich ist.
- Schreibe einen deklarierten Typ dort, wo der Leser sonst raten müsste, und an API-Grenzen (Felder, Parameter, Rückgabetypen).
- Denke daran, dass ein expliziter Typ den Wert konvertiert: `integer x = 2.9` speichert `2`. Mache solche Konvertierungen sichtbar, statt sich zufällig auf sie zu verlassen.
- Novus kennt keine zusammengesetzte Zuweisung. Schreibe `count = count + 1`, nicht `count += 1`, und halte diese Anweisung in einer Zeile.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

```text
Explicit local type         │ ✓ Pureline
integer attempts = 0        │ var attempts = 0
attempts = attempts + 1     │ attempts = attempts + 1
```

### PL-NV-004 — Konstruktion und Objektliterale {#pl-nv-004--construction-and-object-literals}

- Verwende Objektliterale (`Person{name="Tom"}`) für einfache Daten ohne Verhalten.
- Verwende `construct()`, wenn das Objekt Invarianten herstellen, Felder ableiten oder Argumente validieren muss.
- Verstecke keine umfangreiche Arbeit in Feldinitialisierern; halte die Konstruktion in `construct()` explizit.
- Eine `based`-Vererbungskette soll eine echte Ist-ein-Beziehung beschreiben. Bevorzuge ein `interface`, wenn nur das Verhalten geteilt wird.

### PL-NV-005 — Methodensignaturen {#pl-nv-005--method-signatures}

- Deklariere Parameter- und Rückgabetypen, wenn die Signatur Teil einer API, einer Modulgrenze oder einer `.nvh`-Komponente ist.
- Verwende `method name(args): type { }` für gewöhnliche Methoden; halte Parameterlisten kurz genug zum Überfliegen.
- Methoden-Überladungen nach Stelligkeit oder Parametertyp sind erlaubt, wenn die Bedeutung identisch ist. Verwende Überladungen nicht, um unterschiedliches Verhalten hinter einem Namen zu verbergen.

### PL-NV-006 — Funktionsgröße ist ein Review-Signal {#pl-nv-006--function-size-is-a-review-signal}

Der Language-Server prüft eine Methode ab 30 Zeilen und meldet sie ab mehr als 50 Zeilen (`PL-FN-001`). Das sind Review-Schwellen. Eine kohäsive Methode, die der Reihe nach eine einzige Sache erledigt, darf länger bleiben; teile sie auf, wenn sie Verantwortlichkeiten wie Parsing, Validierung und I/O vermischt.

### PL-NV-007 — Pakete, Imports und Ordnerdichte {#pl-nv-007--packages-imports-and-folder-density}

- Ein Ordner ist ein Paket. Importiere die kleinste benötigte Einheit: `import geo/circle` oder `import @helpers`, statt ein ganzes Paket zu importieren, wenn eine Datei genügt.
- Halte standardmäßig höchstens **10 `.nv`- / `.nvh`-Dateien** pro Ordner (`PL-STRUCT-002`). Teile entlang von Verantwortungsgrenzen auf, nicht in sinnlos verschachtelte Ordner.
- Prüfe eine Datei ab **200 Zeilen** (`PL-STRUCT-001`). Das ist eine Review-Schwelle, keine harte Grenze: Halte pro Datei eine Verantwortung und lass kohäsive Logik zusammen.

### PL-NV-008 — Nebenläufigkeit hat sichtbare Ownership {#pl-nv-008--concurrency-has-visible-ownership}

- Mache Nebenläufigkeit an der Aufrufstelle sichtbar: `async` / `await`, `thread`, `virtual` und `sync` geben an, was wo läuft.
- Verfolge jeden Task, der wichtig ist. Starte keine Fire-and-forget-Arbeit, deren Ergebnisse das Programm später braucht.
- Schütze gemeinsam genutzten veränderlichen Zustand explizit mit `sync`, statt dich auf die Aufrufreihenfolge zu verlassen.
- Folge für Shutdown und Abbruch derselben Disziplin wie in [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown).

### PL-NV-009 — Auswertungsreihenfolge wird dokumentiert, nicht vorausgesetzt {#pl-nv-009--evaluation-order-is-documented-not-assumed}

Novus wertet Operanden von links nach rechts aus und dokumentiert die Ausnahmen. Schreibe keinen Code, dessen Ergebnis von einer ungewöhnlichen Reihenfolge abhängt. Halte Seiteneffekte in eigenen Anweisungen und vermeide es, das Lesen eines globalen Werts oder Felds mit einem späteren Aufruf, der es ändert, in einem Ausdruck zu kombinieren.

Die `..`-Kette dient dazu, ein Objekt oder Array in einer linearen Abfolge aufzubauen (`var names = []..append("Ada")..append("Grace")`). Verwende sie, wenn jeder Schritt ein Aufruf oder eine Member-Zuweisung auf demselben Empfänger ist. Zerlege eine Kette in benannte Schritte, wenn ein Schritt einen Kommentar oder eine Verzweigung braucht.

### PL-NV-010 — C-Blöcke und Plattformgrenzen {#pl-nv-010--c-blocks-and-platform-boundaries}

Ein `c { ... }`-Block ist eine native Grenze. Halte ihn klein, isoliere ihn in einer fokussierten Datei und erkläre per Kommentar, was der C-Code über Typen, Lebensdauern und die Plattform annimmt. Stelle die native Funktion über eine Novus-Methode mit typisierter Signatur bereit, damit der übrige Code nie rohe C-Details sieht.

### PL-NV-011 — `.nvh`-Komponenten trennen Markup und Logik {#pl-nv-011--nvh-components-keep-markup-and-logic-apart}

In einer `.nvh`-Komponente gilt:

- Deklariere reaktiven Zustand mit `ref` innerhalb von `<?nv ... ?>` am Anfang der Komponente.
- Halte Handler und Berechnungen in Novus-Blöcken; halte das HTML auf Struktur und Darstellung fokussiert.
- Berechne abgeleitete Werte an einer einzigen Stelle, statt den Ausdruck an mehreren Stellen im Markup zu wiederholen.
- Behandle jede Komponente als eine Verantwortung, genau wie eine Klasse (`PL-STRUCT-001`).

### PL-NV-012 — Kommentare und Diagnosen {#pl-nv-012--comments-and-diagnostics}

- Kommentare erklären das Warum, nicht das Was: den Grund für einen Workaround, eine Plattformeigenheit oder eine nicht offensichtliche Invariante ([PL-DOC-001](../core/comments.md)).
- Pureline-Diagnosen sind im Editor Opt-in (`novus.pureline.enabled`). Aktiviere sie für gemeinsame Projekte, damit in jedem Editor und in der CI dieselben Regel-IDs erscheinen.
- Jede `pureline:allow-else`-Ausnahme braucht eine Begründung in derselben Zeile. Eine Ausnahme ohne Begründung ist ein Review-Befund.

### PL-NV-013 — Markdown-Inhalte (`.nvmd`) {#pl-nv-013--markdown-content-nvmd}

Eine `.nvmd`-Datei ist Markdown mit Novus darin, so wie `.mdx` Markdown mit JSX ist. Der Generator in [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) macht aus `Page.nvmd` die Datei `Page.nvh`, bevor der Compiler läuft. Wende die obigen Regeln auf den Header-Block und auf alle von ihm importierten `.nv`-Module an; für den Markdown-Körper gelten diese Regeln:

- Der Körper trägt den Inhalt. Der Header-Block (`<?nv ... ?>`) enthält nur, was die Seite braucht: Imports, Props und wenige Methoden. Verlagere Logik, die länger als ein paar Zeilen ist, in ein `.nv`-Modul und importiere es.
- Frontmatter-Schlüssel sind die Props der Seite. Halte sie kurz und flach und verwende `{title}`, statt den Wert im Text zu wiederholen.
- Halte jedes `{expr}` bei einem Wert oder einem Aufruf. Berechne alles Längere im Header oder in einem Modul, damit der Körper sich wie Fließtext von oben nach unten liest.
- Halte `{#if}`- und `{#for}`-Blöcke höchstens zwei Ebenen tief. Wiederholt ein Block Markup, verwende stattdessen eine Komponente (`<Callout>`, `<Toc>`).
- Eine Überschrift mit dynamischem Text erhält eine explizite ID (`# {title} {#intro}`), damit Anker und `markdown.headings` stabil bleiben.
- Generierte `.nvh`-Dateien sind Build-Ausgabe. Trage sie in die `.gitignore` ein, bearbeite sie nie und korrigiere stattdessen die `.nvmd`-Quelle. Lasse die Markierung `<?nv /* nvmd-generated */` unangetastet.
- Ein HTML-Block mit einem Handler (`<button @click="hit">`) ist nvh innerhalb von Markdown. Halte solche Blöcke kurz und trenne sie durch Leerzeilen vom umgebenden Text.
