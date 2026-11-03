# Emerald-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Emerald-profiel {#emerald-profile}

Pureline Emerald volgt de **eigen syntaxis van Emerald** in plaats van de voorgestelde syntaxis van Emvus over te nemen. Emerald is bovendien de bootstraptaal voor Emvus, dus dit onderscheid is belangrijk voor tooling en compilercode.

### PL-EMS-001 — Houd de syntaxis van Emerald eigen {#pl-ems-001--keep-emerald-syntax-native}

Emerald gebruikt `.ems`-bestanden, `namespace`- en `use`-declaraties met `::`, retourtypen vóór methodenamen en puntkomma's.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Herschrijf Emerald-declaraties **niet** als Emvus-`package`, `method<T>`, `where` of code zonder puntkomma's. Dit zijn verschillende talen.

### PL-EMS-002 — Gebruik puntkomma's consequent {#pl-ems-002--use-semicolons-consistently}

Volg de syntaxis van Emerald, waarin statements met een puntkomma eindigen. Een formatter mag de regel voor optionele puntkomma's van Emvus niet toepassen op `.ems`-bestanden.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Namen en bestandsorganisatie {#pl-ems-003--names-and-file-organization}

- Typen: `PascalCase`.
- Interfaces: voorvoegsel `I` (`IStorage`, `IPacket`).
- Methoden, parameters, velden en lokale variabelen: `camelCase`.
- Constanten: `UPPER_SNAKE_CASE`, waar van toepassing.
- Houd `namespace`- en `use`-declaraties expliciet.
- Geef de voorkeur aan bronbestanden die zijn vernoemd naar hun primaire type, met respect voor de bestaande naamconventies van Emerald-repositories (bijvoorbeeld `SessionService.ems`).
- Gebruik standaard maximaal **8** `.ems`-bestanden voor productie per bron-/namespacemap; tests en gegenereerde bronnen blijven buiten beschouwing.

Hernoem bestaande werkende bronbestanden niet alleen om aan een hypothetische conventie voor alle talen te voldoen.

### PL-EMS-004 — Guard clauses met accolades {#pl-ems-004--guard-clauses-with-braces}

Gebruik expliciete blokken en houd het succespad ongenest.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Vermijd `else` wanneer een vroege `return`, `continue` of andere beëindiging het overbodig maakt. Inline `if`-statements zonder accolades zijn geen Pureline Emerald.

### PL-EMS-005 — Expliciete typen en `var` zijn beide geldig {#pl-ems-005--explicit-types-and-var-are-both-valid}

Gebruik een gedeclareerd type wanneer het een API-grens verduidelijkt. Gebruik `var` waar een statisch afgeleid type direct duidelijk is; `var` is **geen** verzoek om dynamische typering.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Geen van beide vormen mag als stijlovertreding worden gemarkeerd alleen omdat de andere ook mogelijk is.

### PL-EMS-006 — Behoud het objectmodel van Emerald {#pl-ems-006--preserve-emeralds-object-model}

Gebruik de normale constructoraanroep van Emerald zonder het sleutelwoord `new` uit Java.

```java
Connection connection = Connection();
```

Houd constructors, velden, overerving en interfaces expliciet. Geef de voorkeur aan kleine, samenhangende klassen boven extra manager-/factorylagen zonder concrete verantwoordelijkheid.

### PL-EMS-007 — Geef de voorkeur aan dataklassen voor datavormige typen {#pl-ems-007--prefer-data-classes-for-data-shaped-types}

Wanneer een type vooral samenhangende data bundelt en de ondersteunde gegenereerde leden van Emerald geschikt zijn, geef dan de voorkeur aan een dataklasse boven herhaalde boilerplate.

```java
public data class Coordinate(Int x, Int y);
```

De dataklassegeneratie van Emerald omvat een constructor, `equals`, `toString`, `copy` en `withX`-methoden, waar van toepassing. Ga er niet van uit dat functies van dataklassen die alleen in Emvus bestaan, zoals `copy` met benoemde argumenten, gegenereerde `hashCode` of destructuring uit Emvus, al onderdeel van Emerald zijn.

### PL-EMS-008 — Gebruik macro's alleen voor echte abstracties tijdens compilatie {#pl-ems-008--use-macros-only-for-genuine-compile-time-abstractions}

Het AST-macrosysteem van Emerald is geschikt voor repetitieve structurele generatie, niet om gewone programmalogica te verbergen.

- Geef de voorkeur aan kleine, duidelijk benoemde annotatiemacro's.
- Maak gegenereerde velden en methoden vindbaar voor beheerders en tooling.
- Vervang een eenvoudige methode niet door macrogedrag dat moeilijk te debuggen is.
- Vertrouw niet op ongedocumenteerde macromogelijkheden en wijzig niet stilzwijgend niet-gerelateerde declaraties.
- Houd transformaties tijdens compilatie gescheiden van neveneffecten tijdens runtime.

### PL-EMS-009 — Maak foutpaden expliciet {#pl-ems-009--make-error-paths-explicit}

Gebruik het foutmechanisme dat de daadwerkelijke Emerald-API ondersteunt. Wanneer een functie `Result<T, E>` retourneert, handel die dan bewust af of geef hem door. Kopieer de Emvus-specifieke constructies `success value`, `fail error`, postfix `?` of `scoped` niet naar Emerald-code, tenzij die syntaxis daar apart is geïmplementeerd.

Bewaak ongeldige invoer vroeg en maak onverwachte fouten zichtbaar in plaats van ze te negeren.

### PL-EMS-010 — Concurrency heeft een eigenaar {#pl-ems-010--concurrency-has-ownership}

De voorzieningen `Fiber`, `@Async`, `@Synchronized` en threads van Emerald moeten met expliciete levenscycli worden gebruikt.

- Houd blokkerend werk weg van ongeschikte uitvoeringsthreads.
- Wacht op bewerkingen waarvan het resultaat of de fouten ertoe doen.
- Synchroniseer gedeelde veranderlijke toestand bewust.
- Verwar asynchrone uitvoering niet met automatische thread-veiligheid.

### PL-EMS-011 — Houd Flow-gevoelige code begrijpelijk {#pl-ems-011--keep-flow-sensitive-code-understandable}

Emerald Flow mag allocatie en levensduur van objecten optimaliseren, maar leesbare broncodesemantiek gaat voor.

- Geef de voorkeur aan stabiele lokale referenties wanneer meervoudig lezen dubbelzinnig zou zijn.
- Vertrouw niet handmatig op ongedocumenteerde opslagkeuzes als `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` of `Static`.
- Vermijd verborgen escapes en onbedoelde langlevende referenties in hot paths.
- Beschouw optimalisatiestrategieën als implementatiedetails van de compiler, niet als programmeerrituelen op bronniveau.

### PL-EMS-012 — Test abstracties die de compiler raken {#pl-ems-012--test-compiler-facing-abstractions}

Schrijf voor compiler-, AST- en runtimecode tests voor randvoorwaarden, foutpaden, gegenereerde leden en het gedrag rond de levensduur van objecten. Een kortere methode is niet automatisch beter als ze een fasewisseling of een belangrijk neveneffect verbergt.
