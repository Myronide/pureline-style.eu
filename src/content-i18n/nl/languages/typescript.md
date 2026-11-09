# TypeScript Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

TypeScript erft ook het [JavaScript profiel](javascript.md).

## TypeScript-profiel

TypeScript erft alle Pureline JavaScript regels.

### PL-TS-001. Vermijd `any`

Vermijd:

```ts
function load(value: any): any {
}
```

Voorkeur:

```ts
function load(value: UserId): User {
}
```

Gebruik `unknown` voor onbetrouwbare invoer. Geef de voorkeur aan een benoemde type-wacht wanneer deeeeeeeeeeeeeee
validatie beschrijft een domeinconcept zoals een geldige poort.

```text
A · Inline validation                        │ ✓ Pureline · Named type guard
function readPort(input: unknown): number {  │ function readPort(input: unknown): number {
    if (typeof input !== "number"            │     if (!isPort(input)) {
        || !Number.isInteger(input)          │         throw new InvalidPortError();
        || input < 1 || input > 65535) {     │     }
        throw new InvalidPortError();        │
    }                                        │     return input;
                                             │ }
    return input;                            │
}                                            │ function isPort(value: unknown): value is number {
                                             │     return typeof value === "number"
                                             │         && Number.isInteger(value)
                                             │         && value >= 1 && value <= 65535;
                                             │ }
```

### PL-TS-002. Gebruik Types opzettelijk

Zowel afgeleide als expliciete lokale types zijn Pureline-compliant.

```ts
const user = loadUser();
```

geldig is wanneer het afgeleide type duidelijk is.

Expliciete typen is even geldig:

```ts
const user: User = loadUser();
```

Pureline behandelt **not** een expliciete annotatie als overbodig, alleen omdat TypeScript het kan afdrukken.

Expliciete types zijn vooral nuttig wanneer zij:

- Inzet duidelijker maken
- documenteren van een verwacht contract
- een grens te beschermen tegen onbedoelde verbreding
- het vertrouwen in de refactoring verbetereneeeeeeeeeeee
- code gemakkelijker te begrijpen zonder een hele call chain te volgen

De aard van de invoe ring moet het geluid verwijderen. Het mag nooit een regel worden tegen het gebruik van TypeScript's type systeem.

### PL-TS-003. Geen Java-Stijl `I` Prefix

Voorkeur:

```ts
interface Session {
}
```

Niet:

```ts
interface ISession {
}
```

Het `I` voorvoegsel is profielspecifiek: Java, Emerald en Emvus gebruiken het; TypeScript niet.

### PL-TS-004. `interface` vs `type`

`interface` gebruiken voor objectachtige contracten:

```ts
interface User {
    id: string;
    name: string;
}
```

Gebruik `type` voor vakbonden,den en aanspreekbare vormen:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005. Liever Unietypen boven Enums indien passend

Voorkeur:

```ts
type State = "idle" | "ready" | "closed";
```

Gebruik een enum alleen als een werkelijke enum construction waarde geeft.

### PL-TS-006. Sterke types bij grenzen, Vrijheid Intern

Openbare API's, externe gegevens, persistentiegrenzen en netwerkladingen moeten normaal gesproken duidelijke types blootleggen.

Binnen een implementatie zijn zowel expliciete annotaties als gevolgtrekkingen geldig. Kies het formulier dat de code het makkelijkst te begrijpen maakt. Pureline scoort niet als schoner, alleen omdat het minder annotaties bevat.

---

### PL-TS-007. Map Density

Een TypeScript-functie/bronmap kan standaard **10 productiebronmodules** bevatten.

Barrel bestanden zoals `index.ts`, ondersteuningsbestanden die alleen een verklaring bevatten, testen, gegenereerde bestanden en alleen metadata tellen niet mee.

Een splitsing moet een echte verantwoordelijkheidsgrens vormen, zoals:eeeeeeeeeeeeeeeeee

```text
session/
session/state/
session/transport/
session/storage/
```
