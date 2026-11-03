# Emvus Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Emvus-Profil {#emvus-profile}

Pureline Emvus folgt dem **aktuellen Emvus-Sprachdesign**. Dies ist ein Stilprofil für die beabsichtigte `.ev`-Syntax, keine Behauptung, dass jedes vorgestellte Feature bereits von Ring 1 implementiert ist. Halte Emvus klar von Emerald getrennt.

### PL-EV-001 — Native Methodendeklarationen {#pl-ev-001--native-method-declarations}

Deklariere Methoden mit `method` und, wenn nötig, einem Rückgabetyp in `method<Type>`. Generische Typvariablen werden über `where` eingeführt, nicht indem eine weitere generische Parameterliste an den Methodennamen gehängt wird.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Eine Methode ohne expliziten Rückgabetyp gibt `Void` zurück.

### PL-EV-002 — Leere Klammern bei Deklarationen sind optional, bei Aufrufen nicht {#pl-ev-002--empty-declaration-parentheses-are-optional-call-parentheses-are-not}

Beide parameterlosen Deklarationen sind Pureline-konform:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Beide Schreibweisen deklarieren Methoden ohne Argumente; der Unterschied ist rein kosmetisch und **keine** Überladungsunterscheidung. Schreibe immer `refresh()` oder `shutdown()`, um die Methode auszuführen; `object.refresh` ist kein Methodenaufruf. Formatter sollen beide gültigen Deklarationsstile beibehalten oder einheitlich konfigurieren, ohne den jeweils anderen als Fehler zu markieren.

### PL-EV-003 — Geschweifte Klammern sind Pflicht, Semikolons optional {#pl-ev-003--braces-required-semicolons-optional}

Verwende explizite `{ ... }`-Blöcke für `if`, Schleifen und vergleichbaren Kontrollfluss. Im idiomatischen Emvus ist es bevorzugt, optionale Semikolons wegzulassen, aber bestehenden gültigen Code mit Semikolons solltest du nicht ablehnen.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Einzeilige Guards ohne Klammern und unnötige `else`-Blöcke sind nicht Pureline. Halte Fortsetzungszeilen und lange Ausdrücke eindeutig.

### PL-EV-004 — Benennung, Imports und Sichtbarkeit {#pl-ev-004--naming-imports-and-visibility}

- Typen: `PascalCase`; Interfaces: Präfix `I` (`IStorage`, `IConnection`).
- Methoden, Felder, Properties, Parameter und lokale Variablen: `camelCase`.
- Konstanten: `UPPER_SNAKE_CASE`.
- Pakete: Pfade in Kleinbuchstaben, durch Punkte getrennt.
- Quelldateinamen: **camelCase**, zum Beispiel `sessionService.ev`, auch wenn die Hauptklasse `SessionService` heißt.
- Die Standardsichtbarkeit ist `public`; gib `private` oder `protected` an, wenn es nötig ist.
- Die Symbolauflösung ist unabhängig von Groß- und Kleinschreibung, die Schreibweise im Quelltext bleibt aber erhalten: Verwende durchgängig die **deklarierte Schreibweise** und definiere keine Namen, die sich nur in der Groß-/Kleinschreibung unterscheiden.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Verwende explizite Imports und Aliasse, statt dich auf verwirrende Kollisionen zu verlassen.

### PL-EV-005 — Typen sollen die Absicht vermitteln {#pl-ev-005--types-should-communicate-intent}

Emvus ist standardmäßig statisch typisiert. `var` führt **statische Typinferenz** durch; `dynamic` fordert ausdrücklich ein zur Laufzeit typisiertes Verhalten an.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Verwende `dynamic` an wirklich dynamischen Grenzen, nicht um die normalen Typprüfungen zu umgehen. Explizite und inferierte statische lokale Typen sind beide Pureline-konform.

### PL-EV-006 — Nullability über einen stabilen Fluss behandeln {#pl-ev-006--handle-nullability-through-stable-flow}

Emvus verlangt keine `T?`-Annotation. Es verfolgt Null-Zustände entlang des Kontrollflusses. Fange einen möglicherweise null-wertigen Wert früh ab und bevorzuge einen stabilen lokalen Snapshot veränderlicher Properties, bevor du über deren Nullability argumentierst.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Verlasse dich nie darauf, dass wiederholtes, unsynchronisiertes Lesen einer veränderlichen Property denselben Wert liefert. Mache die erforderliche Feldinitialisierung explizit.

### PL-EV-007 — Typisierte Result-Behandlung für erwartete Fehler bevorzugen {#pl-ev-007--prefer-typed-result-handling-for-expected-failures}

Emvus kennt keine `try/catch/finally`-Syntax. Verwende `Result<T, E>`, `success`, `fail`, `?` und `switch`, wie die Sprache es vorsieht.

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

- `?` dient der bewussten Fehlerweitergabe, wo die Typen es erlauben.
- `!` löst bei einem Fehler einen Panic aus; setze es nur für gesicherte Invarianten oder Grenzprüfungen ein, von denen man sich wirklich nicht erholen kann.
- Verwirf kein `Result` und verstecke erwartete Fehler nicht hinter `panic`.
- Halte `success`, `fail` und `return` auseinander, statt jede Operation unnötig zu verpacken.

Bevorzuge `?`, wenn der Fehler unverändert weitergegeben wird und der
Rückgabetyp der umgebenden Methode ihn aufnehmen kann.

```text
Explicit result branches                │ ✓ Pureline
switch (validatePort(port)) {            │ Int validPort = validatePort(port)?
    success(value) -> success value     │ success validPort
    error(problem) -> fail problem      │
}                                       │
```

### PL-EV-008 — Ressourcenlebensdauern mit `scoped` sichtbar machen {#pl-ev-008--make-resource-lifetimes-visible-with-scoped}

Verwende das Emvus-Konstrukt `scoped` für Ressourcen, die am Ende ihres Gültigkeitsbereichs geschlossen werden müssen.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Ersetze `scoped` nicht durch Javas `try-with-resources`, Gos `defer` oder ein nicht existierendes Emvus-`finally`. Die Lebensdauer einer Ressource soll auch dann klar bleiben, wenn der Compiler den Speicher optimiert.

### PL-EV-009 — Datenklassen statt Boilerplate bevorzugen {#pl-ev-009--prefer-data-classes-to-boilerplate}

Verwende `data class` für kleine, benannte, datenzentrierte Typen mit dem eingebauten generierten Verhalten.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Primäre Daten-Properties sind außerhalb der Initialisierung schreibgeschützt. `copy()` und `withX(...)` drücken veränderte Kopien aus und sind standardmäßig flach (shallow). Bevorzuge, wo passend, die generierte Gleichheit, das generierte Hashing und die generierte Textdarstellung, statt sie von Hand neu zu schreiben. Größere, verhaltensreiche Typen bleiben reguläre Klassen.

**Führe keine separate `record`-Stilanforderung ein:** Das vereinbarte Emvus-Design verwendet `data class` für benannte Datenmodelle und `Dictionary` für Dictionary-/Objektliteral-Daten.

### PL-EV-010 — Listen, Tupel und Dictionaries behalten ihre definierte Semantik {#pl-ev-010--lists-tuples-and-dictionaries-retain-their-defined-semantics}

Bei `[...]`-Literalen bedeutet **vollständig identische Elementtypen** eine `List`; andernfalls ist der Ausdruck ein Tupel. Lass Pureline die typgesteuerte Regel der Sprache nicht durch eine stilistische Präferenz überschreiben.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Dictionary-Literale verwenden `{ key: value }`; inferierte gemischte Werttypen nutzen `dynamic`, wo das Sprachmodell es verlangt. Auf Dictionaries wird über **Schlüssel** zugegriffen, nicht über die Punktnotation strukturierter Records.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Ein wechselnder Elementtyp kann die Inferenz zwischen Liste und Tupel zu Recht ändern. Halte dieses Verhalten an API-Grenzen durch explizit deklarierte Typen sichtbar, wo es angemessen ist.

### PL-EV-011 — Destrukturierung ist positional {#pl-ev-011--destructuring-is-positional}

Verwende `{ ... }`, um Tupel- oder Datenklassen-Komponenten in Deklarationsreihenfolge zu destrukturieren. Mit `_` lässt sich ein Element überspringen.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Deute Destrukturierung nicht als Matching auf benannte Records um. Bevorzuge kurze, aussagekräftige Bindungen statt wahllosem Entpacken.

### PL-EV-012 — `switch` soll die vollständige Verzweigung offenlegen {#pl-ev-012--switch-should-expose-complete-branching}

Verwende `switch`-Anweisungen oder -Ausdrücke für echte Zustandsalternativen. Ausdrücke müssen erschöpfend sein oder einen definierten Catch-all-/Fehlerzweig haben.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Bevorzuge für `Result` klare `success(...)`- und `error(...)`-Muster gegenüber verschachtelten Bedingungen. Halte Catch-all-Muster bewusst, nicht als Mittel, um vergessene Fälle zu verbergen.

### PL-EV-013 — Kaskaden nur verwenden, wenn sie einen einzelnen Empfänger verdeutlichen {#pl-ev-013--use-cascades-only-when-they-clarify-a-single-receiver}

Kaskaden mit `..` sind nützlich für eine kurze Folge von Operationen auf demselben Empfänger.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Vermeide Ketten, die unzusammenhängende Effekte verbergen, mehrere Objekte implizit verändern oder sich über viele Anweisungen erstrecken.

### PL-EV-014 — Fibers und Threads brauchen klare Lebenszyklen {#pl-ev-014--fibers-and-threads-need-clear-lifecycles}

`fiber {}`, `virtual {}` und `thread {}` sind unterschiedliche Ausführungskonstrukte mit einem gemeinsamen Muster für Task-Ergebnisse. Wähle nach der tatsächlichen Last, nicht weil Nebenläufigkeit kompakt aussieht.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Ergebnisse und Fehler, die wichtig sind, abwarten.
- Abbruch und Ownership bei langlebigen Tasks klar regeln.
- Gemeinsam genutzten veränderlichen Zustand synchronisieren; `@Synchronized` steht zur Verfügung, wo es passt.
- Nicht annehmen, dass das von einem Task erfasste Objekt stacklokal ist oder freigegeben werden kann, sobald die startende Methode zurückkehrt.
- Verstecktes Fire-and-forget in gewöhnlichen Geschäftsmethoden vermeiden.

### PL-EV-015 — Makros müssen die Auffindbarkeit verbessern, nicht verschleiern {#pl-ev-015--macros-must-improve-discoverability-not-obscure-it}

Emvus-Makros sind AST-Transformationen zur Compile-Zeit mit Zieldeklarationen, `quote`, `$(...)`-Substitution und AST-Builder-APIs.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline verlangt:

- Kleine Makros mit klar benannten Verantwortlichkeiten und unterstützten Zielen.
- Deterministische Expansion; das Verhalten in Quellreihenfolge und die entstehenden Member bleiben auffindbar.
- Hygiene, um versehentliche Namenskollisionen zu vermeiden.
- Compiler-Diagnosen, wenn die Expansion widersprüchlichen oder ungültigen Code erzeugt.
- Gewöhnliche Methoden statt Makros, wenn es keinen wesentlichen Vorteil zur Compile-Zeit gibt.
- Kein Verlassen auf ungeprüfte Seiteneffekte durch I/O, Netzwerk, Uhr oder Zufall zur Makrozeit.

Generierter Code muss die semantischen Prüfungen bestehen; Checker- und Formatter-Werkzeuge sollen generierte Stellen nicht wie gewöhnliche, von Hand gepflegte Dateien behandeln.

### PL-EV-016 — Nicht gegen die Interna von HyperAlloc Flow programmieren {#pl-ev-016--do-not-program-against-hyperalloc-flow-internals}

Emvus-Code kann über Sublang, Optimind und HyperAlloc Flow optimiert werden. Entwickler sollen **Semantik und Lebensdauern** ausdrücken und nicht manuell eine künftige Allokationsstrategie erraten.

- Unkomplizierte Objektlebenszyklen und stabile Ownership bevorzugen.
- Gemeinsam genutzten veränderlichen Zustand explizit halten, besonders über Tasks hinweg.
- Unveränderliche Datenklassen für einfache Werte bevorzugen, wenn sie zur Domäne passen.
- APIs nicht auf der Annahme aufbauen, ein Objekt sei immer auf dem Stack allokiert, skalar ersetzt oder gepoolt.
- Allokation und Escape-Verhalten in Hot Paths durch Messung und Diagnosen bewerten, nicht nach Hörensagen.

### PL-EV-017 — Paketdichte und Organisation der Quellen {#pl-ev-017--package-density-and-source-organization}

Ein Paket- bzw. Quellordner soll standardmäßig höchstens **8** produktive `.ev`-Module enthalten. Tests, generierte Quellen und reine Metadaten-Dateien zählen nicht. Teile nach tatsächlicher Feature-Verantwortung auf, statt mechanisch willkürliche Unterpakete anzulegen.

Ein Paketname und ein Dateiname sind unterschiedliche Konzepte: `app.session` bleibt kleingeschrieben, während `sessionService.ev` in `camelCase` geschrieben wird.

### PL-EV-018 — Sprachnative Regeln haben Vorrang vor sprachübergreifender Nachahmung {#pl-ev-018--language-native-rules-override-cross-language-imitation}

Pureline-Tooling darf keinen Verstoß melden, nur weil sich Emvus von Java, Emerald, Rust oder Go unterscheidet:

- Optionale `()` bei **parameterlosen Methodendeklarationen** sind gültig; Aufrufe erfordern immer `()`.
- Optionale Semikolons sind gültig.
- `where` ist die native Syntax für generische Deklarationen.
- `var` wird statisch inferiert; `dynamic` ist ausdrücklich dynamisch.
- `success`, `fail`, `?`, `!`, `scoped` und AST-Makros haben Emvus-spezifische Bedeutungen.
- `{ ... }` hat gültige kontextabhängige Verwendungen, darunter Dictionaries und positionale Destrukturierung.
- `[ ... ]` wird nach der Regel der exakt gleichen Elementtypen von Emvus als Liste oder Tupel typisiert.

Der Formatter soll AST-bewusst sein, die Bedeutung bewahren und weder die `::`-Namespaces noch die Semikolon-Pflicht von Emerald auf `.ev`-Dateien anwenden.
