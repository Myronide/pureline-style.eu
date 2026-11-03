# TypeScript Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

TypeScript dziedziczy także [profil JavaScript](javascript.md).

## Profil TypeScript {#typescript-profile}

TypeScript dziedziczy wszystkie reguły Pureline JavaScript.

### PL-TS-001 — Unikaj `any` {#pl-ts-001--avoid-any}

Unikaj:

```ts
function load(value: any): any {
}
```

Preferuj:

```ts
function load(value: UserId): User {
}
```

Dla naprawdę nieznanych danych używaj `unknown`:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Używaj typów świadomie {#pl-ts-002--use-types-deliberately}

Zarówno typy wnioskowane, jak i jawne typy lokalne są zgodne z Pureline.

```ts
const user = loadUser();
```

jest poprawne, gdy wnioskowany typ jest oczywisty.

Jawne typowanie jest równie poprawne:

```ts
const user: User = loadUser();
```

Pureline **nie** uznaje jawnej adnotacji za zbędną tylko dlatego, że TypeScript mógłby wywnioskować typ.

Jawne typy są szczególnie przydatne, gdy:

- wyraźniej pokazują zamiar
- dokumentują oczekiwany kontrakt
- chronią granicę przed niezamierzonym poszerzeniem typu
- zwiększają pewność przy refaktoryzacji
- ułatwiają zrozumienie kodu bez śledzenia całego łańcucha wywołań

Wnioskowanie typów powinno usuwać szum. Nigdy nie powinno stać się regułą przeciwko korzystaniu z systemu typów TypeScript.

### PL-TS-003 — Bez prefiksu `I` w stylu Javy {#pl-ts-003--no-java-style-i-prefix}

Zalecane:

```ts
interface Session {
}
```

Nie:

```ts
interface ISession {
}
```

Prefiks `I` jest specyficzny dla profilu: używają go Java, Emerald i Emvus; TypeScript nie.

### PL-TS-004 — `interface` a `type` {#pl-ts-004--interface-vs-type}

`interface` stosuj dla kontraktów przypominających obiekty:

```ts
interface User {
    id: string;
    name: string;
}
```

`type` stosuj dla unii, aliasów i kształtów wywoływalnych:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Tam, gdzie to właściwe, preferuj unie zamiast enumów {#pl-ts-005--prefer-union-types-over-enums-when-appropriate}

Zalecane:

```ts
type State = "idle" | "ready" | "closed";
```

Enum stosuj tylko wtedy, gdy właściwa konstrukcja enum wnosi wartość.

### PL-TS-006 — Silne typy na granicach, swoboda wewnątrz {#pl-ts-006--strong-types-at-boundaries-freedom-internally}

Publiczne API, dane zewnętrzne, granice persystencji i ładunki sieciowe powinny zwykle udostępniać jasne typy.

Wewnątrz implementacji poprawne są zarówno jawne adnotacje, jak i wnioskowanie. Wybierz formę, która najbardziej ułatwia zrozumienie kodu. Pureline nie uznaje jednej z nich za czystszą tylko dlatego, że zawiera mniej adnotacji typów.

---

### PL-TS-007 — Gęstość folderów {#pl-ts-007--folder-density}

Folder funkcji/źródłowy w TypeScript może domyślnie zawierać co najwyżej **10 produkcyjnych modułów źródłowych**.

Pliki barrel, takie jak `index.ts`, pliki pomocnicze zawierające wyłącznie deklaracje, testy, pliki generowane i pliki zawierające wyłącznie metadane, nie są wliczane.

Podział powinien odzwierciedlać rzeczywistą granicę odpowiedzialności, na przykład:

```text
session/
session/state/
session/transport/
session/storage/
```
