# JavaScript Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## JavaScript-profiel

### PL-JS-001. Slijpen zijn verplicht

Voorkeur:

```js
if (!user) {
    return;
}
```

Niet Pureline:

```js
if (!user) return;
```

### PL-JS-002. Gebruik Semicolons

Voorkeur:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript maakt consequent gebruik van puntkomma's.

### PL-JS-003. `const` Eerste

Voorkeur:

```js
const user = loadUser();
```

Gebruik `let` alleen voor werkelijke herbestemming:

```js
let count = 0;
count++;
```

Gebruik `var` niet.

### PL-JS-004. Liever `async` / `await`

Voorkeur:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Vermijd belofteketens wanneer `async` / `await` een duidelijkere controlestroom produceert.

### PL-JS-005. Pijlfuncties zijn contextueel

Normale genoemde logica kan gebruik maken van reguliere functies:e functiese logica

```js
function createSession(user) {
    return new Session(user);
}
```

Pijlfuncties zijn zeer geschikt voor lokale callbacks:

```js
users.filter(user => user.active());
```

Gebruik standaard geen pijlfuncties.

### PL-JS-006. Ontstructureren moet duidelijkheid verbeteren

Goed:

```js
const { id, name } = user;
```

Vermijd het ontstructureren van grote objecten alleen omdat de taal het toelaat.

---

### PL-JS-007. Map Density

Een JavaScript-functie/bronmap kan standaard **10 productiebronmodules** bevatten.

Barrelbestanden zoals `index.js`, testen, gegenereerde bestanden en alleen metadata-bestanden tellen niet mee.

Als de map de limiet overschrijdt, deel het dan door verantwoordelijkheid in plaats van door willekeurig aantal bestanden.
