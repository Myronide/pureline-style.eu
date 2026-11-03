# JavaScript Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## JavaScript-Profil {#javascript-profile}

### PL-JS-001 — Geschweifte Klammern sind Pflicht {#pl-js-001--braces-are-mandatory}

Bevorzugt:

```js
if (!user) {
    return;
}
```

Nicht Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Semikolons verwenden {#pl-js-002--use-semicolons}

Bevorzugt:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript verwendet Semikolons konsequent.

### PL-JS-003 — Zuerst `const` {#pl-js-003--const-first}

Bevorzugt:

```js
const user = loadUser();
```

Verwende `let` nur für tatsächliche Neuzuweisung:

```js
let count = 0;
count++;
```

Verwende kein `var`.

### PL-JS-004 — `async` / `await` bevorzugen {#pl-js-004--prefer-async--await}

Bevorzugt:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Vermeide Promise-Ketten, wenn `async` / `await` einen klareren Kontrollfluss ergibt.

### PL-JS-005 — Arrow Functions sind kontextabhängig {#pl-js-005--arrow-functions-are-contextual}

Normale benannte Logik darf reguläre Funktionen verwenden:

```js
function createSession(user) {
    return new Session(user);
}
```

Arrow Functions eignen sich gut für lokale Callbacks:

```js
users.filter(user => user.active());
```

Verwende Arrow Functions nicht standardmäßig überall.

### PL-JS-006 — Destrukturierung muss die Klarheit verbessern {#pl-js-006--destructuring-must-improve-clarity}

Gut:

```js
const { id, name } = user;
```

Vermeide es, große Objekte nur deshalb zu destrukturieren, weil die Sprache es erlaubt.

---

### PL-JS-007 — Ordnerdichte {#pl-js-007--folder-density}

Ein JavaScript-Feature-/Quellordner darf standardmäßig höchstens **10 produktive Quellmodule** enthalten.

Barrel-Dateien wie `index.js`, Tests, generierte Dateien und reine Metadaten-Dateien zählen nicht.

Überschreitet der Ordner das Limit, teile ihn nach Verantwortung auf und nicht nach willkürlicher Dateizahl.
