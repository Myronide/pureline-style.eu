# Emerald-Codestil...

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe] (../core/structure.md) gilt in allen Bereichen.

## Emerald-Profil

Pureline Emerald folgt **native Emerald Syntax** anstatt die vorgeschlagene Emvus Syntax zu leihen. Emerald ist auch die Bootstrap-Sprache für Emvus, daher ist diese Unterscheidung für Tools und Compiler-Code wichtig.

### PL-EMS-001 — Halten Sie Emerald-Syntax-Native

Emerald verwendet `.ems`-Dateien, `namespace`- und `use`-Deklarationen mit `::`, Rückgabetypen vor Methodennamen und Semikolonen.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

**not** Umschreiben Emerald-Deklarationen als Emvus `package`, `method<T>`, `where` oder semikolon-freier Code. Das sind verschiedene Sprachen.

### PL-EMS-002 — Semikolone konsequent verwenden

Folgen Sie Emeralds semikolon-basierte Anweisungssyntax.. Eine Formter darf die Emvus-optional-semicon-Regel nicht auf `.ems`-Dateien anwenden.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Namen und Dateiorganisation

- Typen: `PascalCase`.
- Schnittstellen: `I`-Präfix (`IStorage`, `IPacket`).
- Methoden, Parameter, Felder und Einheimische: `camelCase`.
- Konstanten: `UPPER_SNAKE_CASE`, falls zutreffend.
- `namespace` und `use`-Erklärungen explizit aufbewahren.
- Bevorzugen Sie Quelldateien, die nach ihrem primären Typ benannt wurden, unter Beachtung bestehender Emerald-Repository-Namenskonventionen (z.B. `SessionService.ems`).
- Verwenden Sie höchstens **8** Produktion `.ems` Dateien pro Quell-/Namespace Ordner standardmäßig; Tests und generierte Quellen sind ausgeschlossen.

Benannt bestehende Working Source-Dateien nicht nur um, um eine hypothetische cross-language Konvention zu erfüllen.

### PL-EMS-004 — Schutzklauseln mit Klammern

Verwenden Sie explizite Blöcke und halten Sie den erfolgreichen Pfad unverniert.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Vermeiden Sie `else`, wenn ein frühes `return`, `continue` oder andere Beendigungen es unnötig macht. Inline-Sortiment-freie `if`-Anweisungen sind nicht Pureline Emerald.

### PL-EMS-005 — Explizite Typen und `var` sind beide gültig

Verwenden Sie einen deklarierten Typ, wenn er eine API-Grenze klärt. Verwenden Sie `var`, wo ein statisch abgeleiteter Typ sofort offensichtlich ist; `var` ist **not** eine Anforderung für dynamisches Tippen.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Neither form should be flagged as a style violation merely because the other is possible.

### PL-EMS-006 — Preserve Emerald's Object Model

Use Emerald's normal constructor call form without a Java-style `new` keyword.

```java
Connection connection = Connection();
```

Keep constructors, fields, inheritance, and interfaces explicit. Prefer small cohesive classes over extra manager/factory layers with no concrete responsibility.

### PL-EMS-007 — Prefer Data Classes for Data-Shaped Types

When a type primarily bundles related data and Emerald's supported generated members are suitable, prefer a data class over repeated boilerplate.

```java
public data class Coordinate(Int x, Int y);
```

Emeralds Datenklasse-Generierung umfasst gegebenenfalls einen Konstruktor, `equals`, `toString`, `copy` und `withX`-Methoden. Nehmen Sie nicht an, dass Emvus-only-Datenklasse-Funktionen wie z.B. benanntes-Argument `copy`, generiertes `hashCode` oder Emvus-Destrukturierung bereits Teil von Emerald sind.

### PL-EMS-008 — Makros nur für echte Compile-Time-Abstractions verwenden

Emeralds AST-Makrosystem ist für die repetitive strukturelle Generierung geeignet, nicht für die Verschleierung der normalen Programmlogik.

- Bevorzugen Sie kleine, klar benannte Annotations-Makros.
- Erzeugen Sie generierte Felder und Methoden für Betreuer und Werkzeugerfinder auffindbar.
- Vermeiden Sie, eine einfache Methode durch schwer zu debug-Makro-Verhalten zu ersetzen.
- Verlassen Sie sich nicht auf nicht dokumentierte Makrofunktionen oder mutieren Sie nicht auf unüberlegte Erklärungen.
- Halten Sie Compil-Zeit-Transformationen getrennt von Runtime Nebenwirkungen..

### PL-EMS-009 — Fehlerpfade explizit machen

Verwenden Sie den Fehlermechanismus, der von der aktuellen Emerald API unterstützt wird. Wo eine Funktion `Result<T, E>` zurückgibt, handle oder laufe sie absichtlich weiter. Kopieren Sie Emvus-spezifische `success value`, `fail error`, Postfix `?` oder `scoped`-Konstrukte nicht in Emerald-Code, es sei denn, die Syntax ist dort separat implementiert.

Bewahren Sie ungültige Eingaben früh und machen unerwartete Fehler sichtbar, anstatt sie zu schlucken.

### PL-EMS-010 — Konkurrenz hat Eigentum

Emeralds `Fiber`, `@Async`, `@Synchronized` und Gewindeeinrichtungen sollten mit expliziten Lebenszyklus verwendet werden.

- Blockieren Sie weiterhin die Arbeit von unangemessenen Ausführungsthreads.
- Warten Sie auf Operationen, deren Ergebnisse oder Ausfälle von Bedeutung sind.
- Automatisieren Sie gemeinsam wandelbaren Zustand absichtlich..
- Verwechseln Sie nicht die asynchrone Ausführung mit automatischer Gewindesicherheit.

### PL-EMS-011 — Fluss-67e Code verständlich halten

Emerald Flow kann die Allokation und Objektlebensdauer optimieren, aber lesbare Quellensemantik hat Priorität.

- Bevorzugen Sie stabile lokale Referenzen, wenn mehrere Lesevorgänge mehrdeutig wären.
- Verlassen Sie sich nicht manuell auf undokumentierte `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` oder `Static` Speicheroptionen.
- Vermeiden Sie versteckte Fluchten und versehentliche langlebige Referenzen in heißen Pfaden.
- Optimizer-Strategien als Compiler-Implementierungsdetails behandeln, nicht als quellbasierte Codierungsrituale.

### PL-EMS-012 — Abstrahierungen mit Prüfstandserkennung

Für Compiler, AST und Laufzeitcode schreiben Sie Tests für Randbedingungen, Fehlerpfade, generierte Mitglieder und Objektlebensdauerverhalten. Eine kürzere Methode ist nicht automatisch besser, wenn sie einen Phasenübergang oder wichtigen Nebeneffekt versteckt.
