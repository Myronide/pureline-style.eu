# JavaScript-Code-Stil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## JavaScript-Profil

### PL-JS-001 — Klammern sind zwingend erforderlich

Preferred:

```js
if (!user) {
    return;
}
```

Nicht Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Semikolone verwenden

Preferred:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript verwendet Semikolone konsequent.

### PL-JS-003 — `const` Erste

Preferred:

```js
const user = loadUser();
```

`let` nur für die tatsächliche Neuzuweisung verwenden:

```js
let count = 0;
count++;
```

`var` darf nicht angewendet werden.

Prefer `??` when only `null` and `undefined` should trigger a default.
Values such as `0`, `false`, and `""` are preserved.

```text
− Noisy                                │ ✓ Pureline
                                       │
let timeout = options.timeout;         │ const timeout = options.timeout ?? DEFAULT_TIMEOUT;
if (timeout == null) {                 │
    timeout = DEFAULT_TIMEOUT;         │
}                                      │
```

### PL-JS-004 — bevorzugt `async` / `await`

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

Vermeiden Sie Versprechungsketten, wenn `async` / `await` einen klareren Regelfluss erzeugt.

### PL-JS-005 — Pfeilfunktionen sind kontextuell

Normale benannte Logik kann regelmäßige Funktionen verwenden:

```js
function createSession(user) {
    return new Session(user);
}
```

Pfeilfunktionen eignen sich gut für lokale Rückrufe:

```js
users.filter(user => user.active());
```

Verwenden Sie standardmäßig nicht überall Pfeilfunktionen..

### PL-JS-006 — Zerstörung muss Klarheit verbessern

Good:

```js
const { id, name } = user;
```

Vermeiden Sie die Zerstörung großer Objekte nur, weil die Sprache es erlaubt.

---

### PL-JS-007 — Ordnerdichte

A JavaScript feature/source folder may contain at most **10 production source modules** by default.

Fassdateien wie `index.js`, Tests, generierte Dateien und Metadaten-nur-Dateien zählen nicht.

Wenn der Ordner die Grenze überschreitet, teilen Sie ihn durch Verantwortung und nicht durch willkürliche Dateianzahl.
