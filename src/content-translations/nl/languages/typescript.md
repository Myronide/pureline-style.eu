# TypeScript-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

TypeScript erft ook het [JavaScript-profiel](javascript.md).

## TypeScript-profiel {#typescript-profile}

TypeScript erft alle Pureline-regels voor JavaScript.

### PL-TS-001 — Vermijd `any` {#pl-ts-001--avoid-any}

Vermijd:

```ts
function load(value: any): any {
}
```

Aanbevolen:

```ts
function load(value: UserId): User {
}
```

Gebruik `unknown` voor werkelijk onbekende data:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Gebruik typen bewust {#pl-ts-002--use-types-deliberately}

Zowel afgeleide als expliciete lokale typen voldoen aan Pureline.

```ts
const user = loadUser();
```

is geldig wanneer het afgeleide type duidelijk is.

Expliciete typering is even geldig:

```ts
const user: User = loadUser();
```

Pureline beschouwt een expliciete annotatie **niet** als overbodig alleen omdat TypeScript het type zou kunnen afleiden.

Expliciete typen zijn vooral nuttig wanneer ze:

- de intentie duidelijker maken
- een verwacht contract documenteren
- een grens beschermen tegen onbedoelde verbreding
- het vertrouwen bij refactoring vergroten
- code makkelijker te begrijpen maken zonder een hele aanroepketen te hoeven volgen

Typeinferentie moet ruis wegnemen. Het mag nooit een regel worden tegen het gebruik van het typesysteem van TypeScript.

### PL-TS-003 — Geen `I`-prefix in Java-stijl {#pl-ts-003--no-java-style-i-prefix}

Aanbevolen:

```ts
interface Session {
}
```

Niet:

```ts
interface ISession {
}
```

Het voorvoegsel `I` is profielspecifiek: Java, Emerald en Emvus gebruiken het; TypeScript niet.

### PL-TS-004 — `interface` versus `type` {#pl-ts-004--interface-vs-type}

Gebruik `interface` voor objectachtige contracten:

```ts
interface User {
    id: string;
    name: string;
}
```

Gebruik `type` voor unions, aliassen en aanroepbare vormen:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Geef waar passend de voorkeur aan uniontypen boven enums {#pl-ts-005--prefer-union-types-over-enums-when-appropriate}

Aanbevolen:

```ts
type State = "idle" | "ready" | "closed";
```

Gebruik een enum alleen wanneer een echte enum-constructie meerwaarde biedt.

### PL-TS-006 — Sterke typen aan de grenzen, vrijheid binnenin {#pl-ts-006--strong-types-at-boundaries-freedom-internally}

Publieke API's, externe data, persistentiegrenzen en netwerkpayloads moeten normaal gesproken duidelijke typen blootstellen.

Binnen een implementatie zijn zowel expliciete annotaties als inferentie geldig. Kies de vorm waarmee de code het makkelijkst te begrijpen is. Pureline beschouwt de ene vorm niet als schoner alleen omdat die minder typeannotaties bevat.

---

### PL-TS-007 — Mapdichtheid {#pl-ts-007--folder-density}

Een feature- of bronmap in TypeScript mag standaard maximaal **10 bronmodules voor productie** bevatten.

Barrel-bestanden zoals `index.ts`, ondersteunende bestanden met alleen declaraties, tests, gegenereerde bestanden en bestanden met alleen metadata tellen niet mee.

Een splitsing moet een echte verantwoordelijkheidsgrens vertegenwoordigen, zoals:

```text
session/
session/state/
session/transport/
session/storage/
```
