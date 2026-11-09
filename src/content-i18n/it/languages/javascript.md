# Stile codice JavaScript

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Profilo JavaScript

### PL-JS-001. I braci sono obbligatori

Preferred:

```js
if (!user) {
    return;
}
```

Non Pureline:

```js
if (!user) return;
```

### PL-JS-002. Usa i punti e virgola

Preferred:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript utilizza i punti e virgola in modo coerente.

### PL-JS-003, `const` First

Preferred:

```js
const user = loadUser();
```

Usa `let` solo per la spedizione reale:

```js
let count = 0;
count++;
```

Do not use `var`.

Preferisci `??` quando solo `null` e `undefined` dovrebbero attivare un default.
Values such as `0`, `false`, and `""` are preserved.

```text
− Noisy                                │ ✓ Pureline
                                       │
let timeout = options.timeout;         │ const timeout = options.timeout ?? DEFAULT_TIMEOUT;
if (timeout == null) {                 │
    timeout = DEFAULT_TIMEOUT;         │
}                                      │
```

### PL-JS-004. Preferire `async` / `await`

Preferred:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Evitare catene di promesse quando `async` / `await` produce flusso di controllo più chiaro.

### PL-JS-005. Le funzioni delle frecce sono contestuali

La logica normale con nome può utilizzare funzioni regolari:

```js
function createSession(user) {
    return new Session(user);
}
```

Le funzioni Freccia sono adatte per le chiamate locali:

```js
users.filter(user => user.active());
```

Do not use arrow functions everywhere by default.

### PL-JS-006. Destructuring deve migliorare la chiarezza

Bene:

```js
const { id, name } = user;
```

Avoid destructuring large objects only because the language allows it.

---

### Densità della cartella PL-JS-007

A JavaScript feature/source folder may contain at most **10 production source modules** by default.

Barrel files such as `index.js`, tests, generated files, and metadata-only files do not count.

If the folder exceeds the limit, split it by responsibility rather than by arbitrary file count.
