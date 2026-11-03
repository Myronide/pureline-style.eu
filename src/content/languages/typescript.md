# TypeScript Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

TypeScript also inherits the [JavaScript profile](javascript.md).

## TypeScript Profile

TypeScript inherits all Pureline JavaScript rules.

### PL-TS-001 — Avoid `any`

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

Use `unknown` for truly unknown data:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Use Types Deliberately

Both inferred and explicit local types are Pureline-compliant.

```ts
const user = loadUser();
```

is valid when the inferred type is obvious.

Explicit typing is equally valid:

```ts
const user: User = loadUser();
```

Pureline does **not** treat an explicit annotation as redundant merely because TypeScript could infer it.

Explicit types are especially useful when they:

- make intent clearer
- document an expected contract
- protect a boundary from unintended widening
- improve refactoring confidence
- make code easier to understand without following an entire call chain

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

### PL-TS-005 — Prefer Union Types Over Enums When Appropriate

Preferred:

```ts
type State = "idle" | "ready" | "closed";
```

Use an enum only when an actual enum construct provides value.

### PL-TS-006 — Strong Types at Boundaries, Freedom Internally

Public APIs, external data, persistence boundaries, and network payloads should normally expose clear types.

Inside an implementation, both explicit annotations and inference are valid. Choose the form that makes the code easiest to understand. Pureline does not score one as cleaner purely because it contains fewer type annotations.

---

### PL-TS-007 — Folder Density

A TypeScript feature/source folder may contain at most **10 production source modules** by default.

Barrel files such as `index.ts`, declaration-only support files, tests, generated files, and metadata-only files do not count.

A split should represent a real responsibility boundary such as:

```text
session/
session/state/
session/transport/
session/storage/
```
