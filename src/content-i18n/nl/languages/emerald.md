# Smaragd Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Emerald Profile

Pureline Emerald volgt **native Emerald syntax** in plaats van de voorgestelde Emvus syntax te lenen. Emerald is ook de laarzentrap taal voor Emvus, dus dit onderscheid is belangrijk voor tools en compiler code.

### PL-EMS-001. Houd Emerald Syntax Inheems

Emerald gebruikt `.ems`-bestanden, `namespace`- en `use`-verklaringen met `::`, retourneren van types voor methodenamen, en puntkomma's.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Doe **not** herschrijven Emerald verklaringen als Emvus `package`, `method<T>`, `where`, of semi-kolonie-vrije code. Dit zijn verschillende talen.

### PL-EMS-002. Semicolons gebruiken consistent

Volg Emerald's semi-kolonie-gebaseerde verklaring syntax. A formatter mag de Emvus optionele-semikommaregel niet toepassen op `.ems`-bestanden.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003. Namen en Bestandsorganisatie

- Typen: `PascalCase`.
- Interfaces: `I`-prefix (`IStorage`, `IPacket`).
- Methoden, parameters, velden en lokale bevolking: `camelCase`.
- Constanten: `UPPER_SNAKE_CASE`, indien van toepassing.
- Houd `namespace` en `use` verklaringen expliciet.
- Liever bronbestanden genoemd naar hun primaire type, met respect voor bestaande Emerald repository's (bijvoorbeeld `SessionService.ems`).
- Gebruik op zijn hoogst **8** productie `.ems` bestanden per bron/naamruimte map standaard; testen en gegenereerde bronnen zijn uitgesloten.

Noem geen bestaande werkbronbestanden om te voldoen aan een hypothetische cross-language conventie.

### PL-EMS-004. Wachterclausules met Breuken

Gebruik expliciete blokken en houd het succesvolle pad ongestoord.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Vermijd `else` wanneer een vroege `return`, `continue` of andere beëindiging het onnodig maakt. Inline-brace-free `if`-verklaringen zijn geen Pureline Emerald.

### PL-EMS-005. Expliciete types en `var` zijn beide geldig

Gebruik een opgegeven type als het een API-grens verduidelijkt. Gebruik `var` als een statisch afgeleid type onmiddellijk duidelijk is; `var` is **not** een verzoek voor dynamisch typen.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Geen van beide vormen mag worden gemarkeerd als een stijl overtreding alleen maar omdat de andere mogelijk is.

### PL-EMS-006. Bewaar Emerald's objectmodel

Gebruik Emerald's normale constructor aanroepformulier zonder een Java-stijl `new` sleutelwoord.

```java
Connection connection = Connection();
```

Houd constructors, velden, erfenis, en interfaces expliciet. Liever kleine samenhangende klassen dan extra manager/fabriekslagen zonder concrete verantwoordelijkheid.

### PL-EMS-007. Gegevensklassen voor gegevens-gevormde types

Wanneer een type voornamelijk gerelateerde gegevens bundelt en Emerald's ondersteunde gegenereerde leden geschikt zijn, verkiest een dataklasse boven herhaalde ketelplaat.

```java
public data class Coordinate(Int x, Int y);
```

Emerald's data-class generatie omvat een constructor, `equals`, `toString`, `copy` en `withX` methoden, indien van toepassing. Ga er niet van uit dat Emvus-alleen data-klasse functies zoals named-36 `copy`, gegenereerd `hashCode`, of Emvus destructuring al deel uitmaken van Emerald.

Gebruik literals direct wanneer de constructeur en argumenten de waarde maken
onmiddellijk duidelijk, zoals bij de oorsprong.

```text
Intermediate values                                 │ ✓ Pureline
Int originX = 0;                                    │ Coordinate origin = Coordinate(0, 0);
Int originY = 0;                                    │
Coordinate origin = Coordinate(originX, originY);   │
```

### PL-EMS-008. Gebruik Macros alleen voor Genuine Compile-Time Abstractions

Emerald's AST macro systeem is geschikt voor repetitieve structurele generatie, niet voor het vermommen van gewone programma logica.

- Liever kleine, duidelijk benoemde annotatie macro's.
- Maak gegenereerde velden en methoden te ontdekken voor onderhouders en gereedschap.
- Vermijd het vervangen van een eenvoudige methode met moeilijk te debug macro gedrag.
- Vertrouw niet op niet-gedocumenteerde macro-capaciteiten of verander niet-gerelateerde verklaringen in stilte.
- Houd de compilatietijd-transformaties gescheiden van de runtime-bijwerkingen.

### PL-EMS-009. Maak foutpaden expliciet

Gebruik het foutmechanisme dat ondersteund wordt door de werkelijke Emerald API. Wanneer een functie `Result<T, E>` retourneert, moet deze opzettelijk worden behandeld of doorgestuurd. Kopieer Emvus-specifieke `success value`, `fail error`, postfix `?` of `scoped` niet in Emerald-code tenzij die syntax apart wordt geïmplementeerd.

Bewaker ongeldige invoer vroeg en maak onverwachte fout zichtbaar in plaats van het doorslikken.

### PL-EMS-010. Concurrency heeft eigendom

Emerald's `Fiber`, `@Async`, `@Synchronized` en draad faciliteiten moeten worden gebruikt met expliciete levenscyclus.

- Blijf werken blokkeren van ongepaste uitvoeringsdraden.
- Wacht op operaties waarvan de resultaten of mislukkingen belangrijk zijn.
- Synchroniseren van gedeelde veranderlijke staat opzettelijk.
- Verwar asynchrone uitvoering niet met automatische draadveiligheid.

### PL-EMS-011. Houd Flow-sensitive code begrijpelijk

Emerald Flow kan de allocatie en de levensduur van objecten optimaliseren, maar leesbare bronsemantiek heeft voorrang.

- Stabiele lokale referenties geven de voorkeur wanneer meerdere lezingen dubbelzinnig zouden zijn.
- Niet handmatig vertrouwen op ongedocumenteerde `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` of `Static` opslag keuzes.
- Vermijd verborgen ontsnappingen en toevallige langlevende referenties in hete paden.
- Behandel optimalisatiestrategieën als compiler implementatie details, niet bron-niveau codering rituelen.

### PL-EMS-012. Test compiler-Facing Abstractions

Voor compiler, AST en runtime code, schrijf tests voor grensvoorwaarden, foutpaden, gegenereerde leden en objectlevensgedrag. Een kortere methode is niet automatisch beter als het een faseovergang of belangrijke bijwerking verbergt.
