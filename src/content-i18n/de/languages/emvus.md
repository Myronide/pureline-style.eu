# Codestil des Emvus

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Emvus-Profil

Pureline Emvus folgt dem **current Emvus Sprachdesign**. Dies ist ein Stilprofil für die beabsichtigte `.ev` Syntax, nicht ein Anspruch, dass jedes gezeigte Feature bereits von Ring 1 implementiert ist. Keep Emvus distinct from Emerald.

### PL-EV-001 — Erklärungen zur Eingeborenenmethode

Deklarieren Sie Methoden mit `method` und, wenn nötig, einen Rückgabetyp in `method<Type>`. Generische Typvariablen werden über `where` eingeführt, nicht indem dem Methodennamen eine weitere generische Parameterliste beigefügt wird.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Eine Methode ohne expliziten Rückgabetyp gibt `Void` zurück.

### PL-EV-002 — Leere Erklärung Die Klammern sind optional; Anruf Klammern sind nicht

Beide parametrierlose Deklarationen sind Pureline-konform:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Beide Schreibweisen erklären Null-Argument-Methoden; der Unterschied ist kosmetische, **not** eine Überlastungsdifferenz. Schreiben Sie immer `refresh()` oder `shutdown()`, um die Methode auszuführen; `object.refresh` ist kein Methodenaufruf. Formatter sollten entweder einen gültigen Deklarationsstil beibehalten oder konsequent konfigurieren, ohne den anderen als Fehler zu markieren.

### PL-EV-003 — erforderliche Klammern; Semikolone optional

Verwenden Sie explizite `{ ... }`-Blöcke für `if`, Schleifen und vergleichbaren Regelfluss. Bevorzugen Sie das Ausweichen von optionalen Semikolonen in idiomatischen Emvus, aber lehnen Sie den bestehenden gültigen semikolon-terminierten Code nicht ab.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Inline-Bewacher ohne Auffahrsperre und unnötige `else`-Blöcke sind nicht Pureline. Halten Sie die Fortsetzungslinien und langen Ausdrücke eindeutig..

### PL-EV-004 — Naming, Imports, and Visibility

- Typen: `PascalCase`; interfaces: `I` prefix (`IStorage`, `IConnection`).
- Methods, fields, properties, parameters, and locals: `camelCase`.
- Konstanten: `UPPER_SNAKE_CASE`.
- Packages: lower-case dotted paths.
- Source filenames: **camelCase**, z.B. `sessionService.ev`, auch wenn die primäre Klasse `SessionService` ist.
- Die Standard-Sicht ist `public`; bei Bedarf `private` oder `protected` angeben.
- Die Auflösung des Symbols ist fallunempfindlich, aber die Quellenbuchstabierung bleibt erhalten: verwenden Sie die **deklarierte Rechtschreibung** konsequent und definieren nicht Namen, die sich nur im Fall unterscheiden.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Verwenden Sie explizite Importe und Aliases statt sich auf verwirrende Kollisionen zu verlassen.

### PL-EV-005 — Arten sollten Intent kommunizieren

Emvus is statically typed by default. `var` führt **static Type Inferenz durch**; `dynamic` fordert explizit das laufzeitgetippte Verhalten.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Verwenden Sie `dynamic` an wirklich dynamischen Grenzen, nicht um normale Typprüfungen zu umgehen. Sowohl explizite als auch abgeleitete statische lokale Typen sind Pureline-konform.

### PL-EV-006 — Handle Nullability Through Stable Flow

Emvus does not require a `T?` annotation. It tracks null states through control flow. Guard a possibly-null value early and prefer a stable local snapshot of mutable properties before reasoning about their nullability.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Never rely on repeated unsynchronized reads of a mutable property having the same value. Make required field initialization explicit.

### PL-EV-007 — Prefer Typed Result Handling for Expected Failures

Emvus hat keine `try/catch/finally` Syntax.. Verwenden Sie `Result<T, E>`, `success`, `fail`, `?` und `switch`, wie die Sprache definiert.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` ist für absichtliche Fehlerausbreitung, wo Typen es erlauben.
- `!` verursacht eine Panik auf Fehler; reservieren Sie es für etablierte Invarianten oder Grenzkontrollen, die wirklich nicht erholen können.
- Verwerfen Sie kein `Result` oder verstecken Sie das erwartete Versagen hinter `panic`.
- Halten Sie `success`, `fail` und `return` getrennt, anstatt jede Operation unnötig zu wickeln.

Bevorzugen Sie `?` bei der Weiterleitung des Fehlers unverändert und die enclosing-Methode
Ergebnistyp akzeptiert es.

```text
Explicit result branches                │ ✓ Pureline
switch (validatePort(port)) {            │ Int validPort = validatePort(port)?
    success(value) -> success value     │ success validPort
    error(problem) -> fail problem      │
}                                       │
```

### PL-EV-008 — Mit `scoped` die Lebensdauer der Ressource sichtbar machen

Verwenden Sie Emvus `scoped`-Konstrukt für Ressourcen, die geschlossen werden müssen, wenn ihr Umfang endet.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Do not replace `scoped` with Java `try-with-resources`, Go `defer`, or a nonexistent Emvus `finally`. A resource's lifetime should remain clear even when the compiler optimizes memory.

### PL-EV-009 — Prefer Data Classes to Boilerplate

Use `data class` for small, named, data-centric types with the built-in generated behavior.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Primary data properties are read-only outside initialization. `copy()` and `withX(...)` express modified copies and are shallow by default. Prefer generated equality, hashing, and textual representation where appropriate rather than rewriting them manually. Keep larger behavior-rich types as regular classes.

**Keine separate `record`-Stilanforderung einführen:** das vereinbarte Emvus-Design verwendet `data class` für benannte Datenmodelle und `Dictionary` für Wörterbuch/Objekt-Literaturdaten.

### PL-EV-010 — Lists, Tuples, and Dictionaries Retain Their Defined Semantics

Für `[...]`-Literaturen impliziert **all-Elementtypen exakt gleich** ein `List`; ansonsten ist der Ausdruck ein Tupel. Pureline darf die typgetriebene Regel der Sprache nicht mit einer stilistischen Präferenz überschreiben.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Dictionary literals use `{ key: value }`; inferred mixed value types use `dynamic` where required by the language model. Wörterbücher werden über **keys** aufgerufen, nicht durch Struktur-Record-Notation.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

A changing element type can legitimately change list-versus-tuple inference. Keep that behavior visible at API boundaries through explicit declared types where appropriate.

### PL-EV-011 — Destruktu rierung ist positionell

Verwenden Sie `{ ... }`, um Tupel- oder Datenklassenkomponenten in Deklarationsreihenfolge zu destrukturieren. `_` kann ein Element überspringen.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Destruktives Deuten nicht als Plattenmatch neu interpretieren. Bevorzugen Sie kurze sinnvolle Bindungen, nicht wahllos auspacken.

### PL-EV-012 — `switch` sollte vollständige Verzweigung ausstellen

Verwenden Sie `switch`-Anweisungen oder Ausdrücke für echte Zustandsalternativen. Ausdrücke müssen erschöpfend sein oder einen definierten Catch-All- / Ausfallarm haben.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Bevorzugen Sie klare `success(...)` und `error(...)` Muster zu verschachtelten Bedingungen für `Result`. Halten Sie alle Muster bewusst, keine Möglichkeit, vergessene Fälle zu verstecken.

### PL-EV-013 — Kaskaden nur verwenden, wenn sie eine einzelne Receiver zu klären

Kaskaden mit `..` sind für eine kurze Folge von Operationen am gleichen Empfänger nützlich.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Vermeiden Sie Ketten, die nicht verwandte Effekte verbergen, mehrere Objekte implizit mutieren oder sich über viele Aussagen erstrecken.

### PL-EV-014 — Fasern und Gewinde benötigen klare Lebenszyklus

`fiber {}`, `virtual {}` und `thread {}` sind verschiedene Ausführungskonstrukte mit einem gemeinsamen Aufgaben-Ergebnis-Muster. Choose based on the actual workload, not because concurrency looks compact.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Warten Sie auf Ergebnisse und Misserfolge, die wichtig sind.
- Machen Sie die Kündigung und Eigentum für langlebige Aufgaben klar.
- Automatisieren Sie gemeinsam wandelbaren Zustand; `@Synchronized` ist verfügbar, wenn angemessen.
- Nehmen Sie nicht an, dass das erfasste Objekt einer Aufgabe stapelweise lokal ist oder freigegeben werden kann, wenn die Laichmethode zurückkommt.
- Vermeiden Sie versteckte Feuer-und-vergessen Sie Arbeit in gewöhnlichen Geschäftsmethoden.

### PL-EV-015 — Makros müssen die Auffindbarkeit verbessern, nicht sie versperren

Emvus-Makros sind Compil-Time-AST-Transformationen mit Zieldeklarationen, `quote`, `$(...)`-Substitution und AST-Builder-APIs.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline erfordert:

- Kleine Makros mit klar definierten Verantwortlichkeiten und unterstützten Zielen.
- Deterministische Expansion; Verhalten in der Quell-Order und daraus resultierende Mitglieder bleiben auffindbar.
- Hygiene to avoid accidental name collisions.
- Compiler-Diagnose, wenn die Erweiterung widersprüchlichen oder ungültigen Code erzeugt.
- Normale Methoden anstelle von Makros, wenn kein wesentlicher Nutzen für Compil-Time besteht.
- Kein Vertrauen auf unüberprüfte Makro-Zeit-I/O, Netzwerk, Uhr oder zufällige Nebenwirkungen.

Generierter Code muss semantische Kontrollen erfüllen; Checker/Formater-Tooling sollte generierte Standorte nicht als normale handgepflegete Dateien behandeln.

### PL-EV-016 — Programm nicht gegen HyperAlloc Flow Internals

Emvus-Code kann durch Sublang, Optimind und HyperAlloc Flow optimiert werden. Entwickler sollten **semantik und Lebensdauern** ausdrücken, nicht manuell eine zukünftige Zuteilungsstrategie erraten.

- Favor einfache Objekt Lebenszyklus und stabile Eigentümer..
- Halten Sie geteilten mutable Zustand explizit, vor allem über Aufgaben hinweg..
- Bevorzugen Sie unwandelbare Datenklassen für einfache Werte, wenn sie in die Domäne passen.
- Erstellen Sie keine APIs um Annahmen, dass ein Objekt immer stapelweise, skalar-ersetzt oder gepoolt ist.
- Bewertet die Hot-Path-Zuweisung und entfliehen Sie dem Verhalten durch Messung und Diagnostik, nicht Folklore.

### PL-EV-017 — Paketdichte und -quelle

A package/source folder should contain at most **8** production `.ev` modules by default. Tests, generated sources, and metadata-only files do not count. Split by actual feature responsibility rather than mechanically creating arbitrary subpackages.

Ein Paketname und ein Dateiname sind unterschiedliche Konzepte: `app.session` bleibt klein, während `sessionService.ev` `camelCase` ist.

### PL-EV-018 — Sprachen-Native Regeln überschreiben bereichsübergreifende Imitation

Pureline-Tooling darf keine Verletzung melden, nur weil Emvus sich von Java, Emerald, Rust oder Go unterscheidet:

- Optional `()` in **parameterless-Methodendeklarationen** sind gültig; Anrufe benötigen immer `()`.
- Optionale Semikolone sind gültig..
- `where` ist die native generische Deklarationssyntax.
- `var` wird statisch abgeleitet; `dynamic` ist explizit dynamisch.
- `success`, `fail`, `?`, `!`, `scoped` und AST-Makros haben Emvus-spezifische Bedeutungen.
- `{ ... }` hat gültige kontextabhängige Anwendungen, einschließlich Wörterbüchern und positionalen Destrukturierung.
- `[ ... ]` wird als Liste oder Tupel gemäß Emvus' exakter Regel-Element-Typen eingegeben.

Die Formmaterie sollte AST-aware sein, Bedeutung bewahren und Emeralds `::`-Namensfelder oder Semikolon-Anforderungen niemals auf `.ev`-Dateien anwenden.
