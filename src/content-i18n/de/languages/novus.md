# Novus-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Novus is a self-hosting language that compiles to portable C, with dynamically typed values, optional static typing, `.nvh` server-rendered components, and `.nvmd` Markdown content through [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Das Profil folgt den Novus-Beispielen, der Standardbibliothek und den Regeln, die der Novus-Sprachserver überprüft, wenn Pureline-Stildiagnosen aktiviert sind (`novus.pureline.enabled`). [Cohesion over Size](../core/structure.md) applies throughout.

Rule IDs `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002`, and `PL-NAME-001` are the ones the Novus language server already reports under source `pureline`. The Novus-specific rules below use the `PL-NV-*` prefix.

## Novus Profile

### PL-NV-001 — Naming and Visibility

- Classes, enums, and components: `PascalCase`.
- Methoden, Felder, Locals und Parameter: `lowerCamelCase`.
- Paket (Ordner) Namen: kurz, klein, ohne Separatoren.
- Konstanten: `private final SCREAMING_SNAKE_CASE` auf Dateiebene.
- Halten Sie Mitglieder privat, es sei denn, ein anderes Paket oder Datei verwendet sie. Felder nur dann durch `: get` oder `: get, set` freigeben, wenn Anrufer sie brauchen.
- Kurze Namen sind für Schleifenzähler (`i`, `j`, `k`) erlaubt. Weitere Namen und Platzhalter (`tmp`, `obj`, `thing`, `data2`) werden von `PL-NAME-001` gemeldet.

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

### PL-NV-002 — Schutzklauseln und linearer Fluss

Erst validieren, früh zurückkehren und den erfolgreichen Pfad bei der Basiseinrückung halten.

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

Vermeiden Sie `else` nach einem Zweig, der bereits zurückgibt, bricht oder weitergeht (`PL-CF-002`). Wenn ein `else` wirklich die deutlichste Form ist, markieren Sie die Linie mit einer gerechtfertigten Ausnahme:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Erklärungen: `final`, `var` und explizite Typen

- Verwenden Sie `final` für Werte, die sich nie ändern; verwenden Sie `var` für lokale Personen, deren Typ vom Initialisierer offensichtlich ist.
- Schreiben Sie einen deklarierten Typ, bei dem der Leser ansonsten zu erraten hätte, und an API-Grenzen (Felder, Parameter, Rückgabetypen).
- Denken Sie daran, dass ein expliziter Typ den Wert konvertiert: `integer x = 2.9` speichert `2`. Machen Sie solche Umwandlungen sichtbar, anstatt sich zufällig auf sie zu verlassen.
- Novus hat keine Verbindung.. Schreiben Sie `count = count + 1`, nicht `count += 1`, und behalten Sie diese Aussage auf einer Zeile.

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

### PL-NV-004 — Bau und Objekt Literale

- Verwenden Sie Objekt-Literaturen (`Person{name="Tom"}`) für einfache Daten ohne Verhalten.
- Verwenden Sie `construct()`, wenn das Objekt Invarianten erstellen, Felder ableiten oder Argumente validieren muss.
- Nicht verbergen signifikante Arbeiten in Feld Initialisierer; halten Sie die Konstruktion explizit in `construct()`.
- Eine `based`-Erbkette sollte eine echte Beziehung beschreiben. Bevorzugen Sie ein `interface`, wenn nur das Verhalten geteilt wird.

### PL-NV-005 — Signaturen für die Methode

- Deklarieren Sie Parameter und Rückgabetypen, wenn die Signatur Teil einer API, einer Modulgrenze oder einer `.nvh`-Komponente ist.
- Verwenden Sie `method name(args): type { }` für gewöhnliche Methoden; halten Sie die Parameterlisten kurz genug, um zu scannen.
- Methodenüberlastungen durch den Typ der Art oder des Parameters sind zulässig, wenn die Bedeutung identisch ist. Verwenden Sie keine Überlastungen, um das unterschiedliche Verhalten hinter einem Namen zu verbergen.

### PL-NV-006 — Funktionsgröße ist ein Prüfsignal

Der Sprachserver überprüft eine Methode bei 30 Zeilen und meldet sie über 50 Zeilen (`PL-FN-001`). Dies sind die Schwellenwerte für die Überprüfung. Eine kohärente Methode, die eine Sache in der Folge tut, kann länger bleiben; teilt sie, wenn sie Aufgaben wie Parsing, Validierung und I/O vermischt.

### PL-NV-007 — Pakete, Importe und Ordnerdichte

- Ein Ordner ist ein Paket. Importieren Sie die schmalste Einheit, die benötigt wird: `import geo/circle` oder `import @helpers` statt ein ganzes Paket zu importieren, wenn eine Datei ausreicht.
- Behalten Sie höchstens **10 `.nv` / `.nvh` Dateien** pro Ordner standardmäßig (`PL-STRUCT-002`). Entzweit euch an Verantwortungsgrenzen, nicht in sinnlose verschachtelte Ordner.?
- Prüfen Sie eine Datei bei **200 lines** (`PL-STRUCT-001`). Dies ist ein Überprüfungsschwellenwert, keine harte Grenze: eine Verantwortung pro Datei zu behalten und die kohärente Logik zusammenbleiben zu lassen.

### PL-NV-008 — Übereinstimmung hat sichtbare Eigentümerschaft

- Machen Sie die Übereinstimmung auf der Call-Site sichtbar: `async` / `await`, `thread`, `virtual` und `sync` geben an, wo es läuft.
- Verfolgen Sie jede Aufgabe, die zählt. Starten Sie keine Feuer-und-Vergessen Arbeit für Ergebnisse, die das Programm später hängt von.
- Die Wache teilte explizit wandelbaren Zustand mit `sync` anstatt sich auf Anrufbefehl zu verlassen.
- Befolgen Sie die gleiche Disziplin wie [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) zum Abschalten und Absagen.

### PL-NV-009 — Evaluierungsauftrag wird dokumentiert, nicht angenommen

Novus bewertet die Operanden von links nach rechts und dokumentiert die Ausnahmen. Schreiben Sie nicht Code, dessen Ergebnis von einer ungewöhnlichen Bestellung abhängt. Halten Sie Nebenwirkungen in ihren eigenen Aussagen, und vermeiden Sie die Kombination eines globalen oder Feld gelesen mit einem späteren Aufruf, der es in einem Ausdruck ändert.

Die `..`-Kette dient zum Aufbau eines Objekts oder Arrays in einer linearen Sequenz (`var names = []..append("Ada")..append("Grace")`). Verwenden Sie es, wenn jeder Schritt eine Anruf- oder Mitglied-Zuweisung auf demselben Empfänger ist. Zerbrechen Sie eine Kette in benannte Schritte, wenn ein Schritt einen Kommentar oder einen Zweig benötigt.

### PL-NV-010 — C-Blocks und Plattformboundarien

Ein `c { ... }`-Block ist eine native Grenze... Halten Sie es klein, isolieren Sie es in einer fokussierten Datei, und erklären Sie mit einem Kommentar, was der C-Code über Typen, Lebensdauern und die Plattform annimmt. Enthüllen Sie die native Funktion durch eine Novus-Methode mit einer typisierten Signatur, sodass der Rest des Codes nie rohe C-Details sieht.

### PL-NV-011 — `.nvh` Komponenten halten Markup und Logik auseinander

In a `.nvh` component:

- Declare reactive state with `ref` inside `<?nv ... ?>` at the top of the component.
- Keep handlers and computations in Novus blocks; keep the HTML focused on structure and presentation.
- Compute derived values in one place rather than repeating the expression in several places of the markup.
- Treat each component as one responsibility, the same way as a class (`PL-STRUCT-001`).

### PL-NV-012 — Comments and Diagnostics

- Comments explain why, not what: the reason for a workaround, a platform quirk, or a non-obvious invariant ([PL-DOC-001](../core/comments.md)).
- Pureline Diagnosen sind Opt-In im Editor (`novus.pureline.enabled`). Enable them for shared projects so that the same rule IDs appear in every editor and in CI.
- Every `pureline:allow-else` exemption needs a reason on the same line. An exemption without a reason is a review finding.

### PL-NV-013 — Markdown Content (`.nvmd`)

A `.nvmd` file is Markdown with Novus in it, the way `.mdx` is Markdown with JSX. The generator in [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) turns `Page.nvmd` into `Page.nvh` before the compiler runs. Apply the rules above to the header block and to any `.nv` modules it imports; the Markdown body follows these rules:

- Der Körper trägt den Inhalt... Der Header-Block (`<?nv ... ?>`) enthält nur das, was die Seite benötigt: Importe, Requisiten und einige Methoden... Bewegen Sie Logik länger als ein paar Zeilen in ein `.nv` Modul und importieren Sie es.
- Frontmaterieschlüssel sind die Requisiten der Seite... Halten Sie sie kurz und flach, und verwenden Sie `{title}` anstatt den Wert im Text zu wiederholen.
- Behalten Sie jedes `{expr}` auf einen Wert oder einen Anruf.. Berechnen Sie etwas länger in der Kopfzeile oder einem Modul, so dass der Körper liest top-down wie Prosa.
- `{#if}` und `{#for}` Blöcke auf zwei Ebenen tief halten. Wenn ein Block die Markierung wiederholt, verwenden Sie stattdessen eine Komponente (`<Callout>`, `<Toc>`).
- Eine Überschrift, deren Text dynamisch ist, erhält eine explizite id (`# {title} {#intro}`), so Anker und `markdown.headings` bleiben stabil.
- Generated `.nvh`-Dateien werden erstellt.. Fügen Sie sie zu `.gitignore` hinzu, bearbeiten Sie sie nie und beheben Sie stattdessen die `.nvmd`-Quelle. Halten Sie die `<?nv /* nvmd-generated */`-Markierung intakt..
- Ein HTML-Block mit einem Handler (`<button @click="hit">`) ist nvh innerhalb Markdown. Halten Sie solche Blöcke kurz und trennen Sie sie vom umgebenden Text mit leeren Linien.
