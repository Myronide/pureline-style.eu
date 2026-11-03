# Emerald Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Emerald-Profil {#emerald-profile}

Pureline Emerald folgt der **nativen Emerald-Syntax**, statt die vorgeschlagene Emvus-Syntax zu übernehmen. Emerald ist zugleich die Bootstrap-Sprache für Emvus, deshalb ist diese Unterscheidung für Werkzeuge und Compiler-Code wichtig.

### PL-EMS-001 — Emerald-Syntax nativ halten {#pl-ems-001--keep-emerald-syntax-native}

Emerald verwendet `.ems`-Dateien, `namespace`- und `use`-Deklarationen mit `::`, Rückgabetypen vor Methodennamen und Semikolons.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Schreibe Emerald-Deklarationen **nicht** in Emvus-`package`, `method<T>`, `where` oder semikolonfreien Code um. Das sind unterschiedliche Sprachen.

### PL-EMS-002 — Semikolons konsequent verwenden {#pl-ems-002--use-semicolons-consistently}

Folge der semikolonbasierten Anweisungssyntax von Emerald. Ein Formatter darf die optionale Semikolon-Regel von Emvus nicht auf `.ems`-Dateien anwenden.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Namen und Dateiorganisation {#pl-ems-003--names-and-file-organization}

- Typen: `PascalCase`.
- Interfaces: Präfix `I` (`IStorage`, `IPacket`).
- Methoden, Parameter, Felder und lokale Variablen: `camelCase`.
- Konstanten: `UPPER_SNAKE_CASE`, wo anwendbar.
- `namespace`- und `use`-Deklarationen explizit halten.
- Quelldateien bevorzugt nach ihrem Haupttyp benennen und dabei die bestehenden Namenskonventionen des Emerald-Repositorys beachten (zum Beispiel `SessionService.ems`).
- Standardmäßig höchstens **8** produktive `.ems`-Dateien pro Quell-/Namespace-Ordner verwenden; Tests und generierte Quellen sind ausgenommen.

Benenne bestehende, funktionierende Quelldateien nicht um, nur um einer hypothetischen sprachübergreifenden Konvention zu genügen.

### PL-EMS-004 — Guard Clauses mit geschweiften Klammern {#pl-ems-004--guard-clauses-with-braces}

Verwende explizite Blöcke und halte den erfolgreichen Pfad unverschachtelt.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Vermeide `else`, wenn ein frühes `return`, `continue` oder eine andere Beendigung es überflüssig macht. Einzeilige `if`-Anweisungen ohne Klammern sind nicht Pureline Emerald.

### PL-EMS-005 — Explizite Typen und `var` sind beide gültig {#pl-ems-005--explicit-types-and-var-are-both-valid}

Verwende einen deklarierten Typ, wenn er eine API-Grenze verdeutlicht. Verwende `var`, wo ein statisch inferierter Typ sofort offensichtlich ist; `var` ist **keine** Aufforderung zu dynamischer Typisierung.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Keine der beiden Formen soll allein deshalb als Stilverstoß markiert werden, weil auch die andere möglich wäre.

### PL-EMS-006 — Das Objektmodell von Emerald beibehalten {#pl-ems-006--preserve-emeralds-object-model}

Verwende die normale Konstruktoraufruf-Form von Emerald ohne ein `new`-Schlüsselwort im Java-Stil.

```java
Connection connection = Connection();
```

Halte Konstruktoren, Felder, Vererbung und Interfaces explizit. Bevorzuge kleine kohäsive Klassen gegenüber zusätzlichen Manager-/Factory-Schichten ohne konkrete Verantwortung.

### PL-EMS-007 — Datenklassen für datenförmige Typen bevorzugen {#pl-ems-007--prefer-data-classes-for-data-shaped-types}

Wenn ein Typ hauptsächlich zusammengehörige Daten bündelt und die von Emerald unterstützten generierten Member passen, bevorzuge eine Datenklasse gegenüber wiederholtem Boilerplate.

```java
public data class Coordinate(Int x, Int y);
```

Die Datenklassen-Generierung von Emerald umfasst einen Konstruktor, `equals`, `toString`, `copy` und `withX`-Methoden, wo anwendbar. Gehe nicht davon aus, dass Datenklassen-Features, die es nur in Emvus gibt, etwa `copy` mit benannten Argumenten, generiertes `hashCode` oder die Emvus-Destrukturierung, bereits Teil von Emerald sind.

Verwende Literale direkt, wenn der Konstruktor und seine Argumente den
Wert sofort verständlich machen, wie beim Koordinatenursprung.

```text
Intermediate values                                 │ ✓ Pureline
Int originX = 0;                                    │ Coordinate origin = Coordinate(0, 0);
Int originY = 0;                                    │
Coordinate origin = Coordinate(originX, originY);   │
```

### PL-EMS-008 — Makros nur für echte Abstraktionen zur Compile-Zeit verwenden {#pl-ems-008--use-macros-only-for-genuine-compile-time-abstractions}

Das AST-Makrosystem von Emerald eignet sich für repetitive strukturelle Generierung, nicht dazu, gewöhnliche Programmlogik zu verschleiern.

- Kleine, klar benannte Annotationsmakros bevorzugen.
- Generierte Felder und Methoden für Maintainer und Tooling auffindbar machen.
- Keine einfache Methode durch schwer zu debuggendes Makroverhalten ersetzen.
- Sich nicht auf undokumentierte Makrofähigkeiten verlassen und keine fremden Deklarationen stillschweigend verändern.
- Transformationen zur Compile-Zeit von Seiteneffekten zur Laufzeit trennen.

### PL-EMS-009 — Fehlerpfade explizit machen {#pl-ems-009--make-error-paths-explicit}

Verwende den Fehlermechanismus, den die tatsächliche Emerald-API unterstützt. Gibt eine Funktion `Result<T, E>` zurück, behandle oder reiche es bewusst weiter. Übernimm keine Emvus-spezifischen Konstrukte wie `success value`, `fail error`, das nachgestellte `?` oder `scoped` in Emerald-Code, solange diese Syntax dort nicht eigens implementiert ist.

Fange ungültige Eingaben früh ab und mache unerwartete Fehler sichtbar, statt sie zu verschlucken.

### PL-EMS-010 — Nebenläufigkeit hat Ownership {#pl-ems-010--concurrency-has-ownership}

`Fiber`, `@Async`, `@Synchronized` und die Thread-Funktionen von Emerald sollen mit expliziten Lebenszyklen verwendet werden.

- Blockierende Arbeit von ungeeigneten Ausführungs-Threads fernhalten.
- Operationen abwarten, deren Ergebnisse oder Fehler wichtig sind.
- Gemeinsam genutzten veränderlichen Zustand gezielt synchronisieren.
- Asynchrone Ausführung nicht mit automatischer Thread-Sicherheit verwechseln.

### PL-EMS-011 — Flow-sensitiven Code verständlich halten {#pl-ems-011--keep-flow-sensitive-code-understandable}

Emerald Flow darf Allokation und Objektlebensdauern optimieren, doch lesbare Quellsemantik hat Vorrang.

- Stabile lokale Referenzen bevorzugen, wenn mehrfaches Lesen mehrdeutig wäre.
- Sich nicht manuell auf undokumentierte Speicherentscheidungen wie `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` oder `Static` verlassen.
- Versteckte Escapes und versehentlich langlebige Referenzen in Hot Paths vermeiden.
- Optimierungsstrategien als Implementierungsdetails des Compilers behandeln, nicht als Rituale auf Quellcode-Ebene.

### PL-EMS-012 — Compilernahe Abstraktionen testen {#pl-ems-012--test-compiler-facing-abstractions}

Schreibe für Compiler-, AST- und Laufzeitcode Tests für Randbedingungen, Fehlerpfade, generierte Member und das Verhalten bei Objektlebensdauern. Eine kürzere Methode ist nicht automatisch besser, wenn sie einen Phasenübergang oder einen wichtigen Seiteneffekt verbirgt.
