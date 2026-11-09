# TipoScript Codice Stile

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

TypeScript eredita anche il [Profilo JavaScript](javascript.md).

## TipoProfiloscript

TypeScript eredita tutte le regole di JavaScript Pureline...

### PL-TS-001. Evitare `any`

Avoid:

```ts
function load(value: any): any {
}
```

Prefer:

```ts
function load(value: UserId): User {
}
```

Use `unknown` for untrusted input. Preferisci un tipo di guardia quando il
la validazione descrive un concetto di dominio come una porta valida..

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

### PL-TS-002. Usa i tipi Deliberately

Both inferred and explicit local types are Pureline-compliant.

```ts
const user = loadUser();
```

is valid when the inferred type is obvious.

La digitazione esplicita è ugualmente valida:

```ts
const user: User = loadUser();
```

Pureline fa **not** tratta un'annotazione esplicita come ridondante solo perché TypeScript potrebbe dedurre. la data di inizio della registrazione.

Explicit types are especially useful when they:

- rendere più chiaro l'intento
- documenta un contratto previsto
- proteggere un confine dall'ampliamento non intenzionale
- migliorare la fiducia
- rendere il codice più facile da capire senza seguire un'intera catena di chiamate le

Type inference should remove noise. It should never become a rule against using TypeScript's type system.

### PL-TS-003 — No Java-Style `I` Prefix

Preferred:

```ts
interface Session {
}
```

Not:

```ts
interface ISession {
}
```

The `I` prefix is profile-specific: Java, Emerald, and Emvus use it; TypeScript does not.

### PL-TS-004 — `interface` vs `type`

Use `interface` for object-like contracts:

```ts
interface User {
    id: string;
    name: string;
}
```

Use `type` for unions, aliases, and callable shapes:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005. Preferire tipi di Union oltre ENO quando appropriatone le mercieeeeeeeeeeeeeeeeeeeeeeeee

Preferred:

```ts
type State = "idle" | "ready" | "closed";
```

Use an enum only when an actual enum construct provides value.

### PL-TS-006. Tipi forti a confini, libertà interna..

Public APIs, external data, persistence boundaries, and network payloads should normally expose clear types.

Inside an implementation, both explicit annotations and inference are valid. Choose the form that makes the code easiest to understand. Pureline does not score one as cleaner purely because it contains fewer type annotations.

---

### Densità della cartella PL-TS-007

A TypeScript feature/source folder may contain at most **10 production source modules** by default.

Barrel files such as `index.ts`, declaration-only support files, tests, generated files, and metadata-only files do not count.

A split should represent a real responsibility boundary such as:

```text
session/
session/state/
session/transport/
session/storage/
```
