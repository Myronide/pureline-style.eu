# JavaScript-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## JavaScript-profiel {#javascript-profile}

### PL-JS-001 — Accolades zijn verplicht {#pl-js-001--braces-are-mandatory}

Aanbevolen:

```js
if (!user) {
    return;
}
```

Geen Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Gebruik puntkomma's {#pl-js-002--use-semicolons}

Aanbevolen:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript gebruikt consequent puntkomma's.

### PL-JS-003 — Eerst `const` {#pl-js-003--const-first}

Aanbevolen:

```js
const user = loadUser();
```

Gebruik `let` alleen voor echte hertoewijzing:

```js
let count = 0;
count++;
```

Gebruik geen `var`.

### PL-JS-004 — Geef de voorkeur aan `async` / `await` {#pl-js-004--prefer-async--await}

Aanbevolen:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Vermijd promise chains wanneer `async` / `await` een duidelijkere besturingsstroom oplevert.

### PL-JS-005 — Arrow functions zijn contextafhankelijk {#pl-js-005--arrow-functions-are-contextual}

Gewone benoemde logica mag reguliere functies gebruiken:

```js
function createSession(user) {
    return new Session(user);
}
```

Arrow functions zijn zeer geschikt voor lokale callbacks:

```js
users.filter(user => user.active());
```

Gebruik niet standaard overal arrow functions.

### PL-JS-006 — Destructuring moet de duidelijkheid vergroten {#pl-js-006--destructuring-must-improve-clarity}

Goed:

```js
const { id, name } = user;
```

Vermijd het destructureren van grote objecten alleen omdat de taal het toestaat.

---

### PL-JS-007 — Mapdichtheid {#pl-js-007--folder-density}

Een feature- of bronmap in JavaScript mag standaard maximaal **10 bronmodules voor productie** bevatten.

Barrel-bestanden zoals `index.js`, tests, gegenereerde bestanden en bestanden met alleen metadata tellen niet mee.

Als de map de limiet overschrijdt, splits die dan op verantwoordelijkheid en niet op een willekeurig aantal bestanden.
