# JavaScript Code Style

[Code style guide](../README.md) · [Original specification 1.5](../../../PURELINE_SPECIFICATION_1.5.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## JavaScript Profile

### PL-JS-001 — Braces Are Mandatory

Preferred:

```js
if (!user) {
    return;
}
```

Not Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Use Semicolons

Preferred:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript uses semicolons consistently.

### PL-JS-003 — `const` First

Preferred:

```js
const user = loadUser();
```

Use `let` only for actual reassignment:

```js
let count = 0;
count++;
```

Do not use `var`.

### PL-JS-004 — Prefer `async` / `await`

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

Avoid promise chains when `async` / `await` produces clearer control flow.

### PL-JS-005 — Arrow Functions Are Contextual

Normal named logic may use regular functions:

```js
function createSession(user) {
    return new Session(user);
}
```

Arrow functions are well suited for local callbacks:

```js
users.filter(user => user.active());
```

Do not use arrow functions everywhere by default.

### PL-JS-006 — Destructuring Must Improve Clarity

Good:

```js
const { id, name } = user;
```

Avoid destructuring large objects only because the language allows it.

---

### PL-JS-007 — Folder Density

A JavaScript feature/source folder may contain at most **10 production source modules** by default.

Barrel files such as `index.js`, tests, generated files, and metadata-only files do not count.

If the folder exceeds the limit, split it by responsibility rather than by arbitrary file count.
