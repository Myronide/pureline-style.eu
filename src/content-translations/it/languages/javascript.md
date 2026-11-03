# Stile del codice JavaScript

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo JavaScript {#javascript-profile}

### PL-JS-001 — Le parentesi graffe sono obbligatorie {#pl-js-001--braces-are-mandatory}

Preferito:

```js
if (!user) {
    return;
}
```

Non è Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Usare i punti e virgola {#pl-js-002--use-semicolons}

Preferito:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript usa i punti e virgola in modo coerente.

### PL-JS-003 — Prima `const` {#pl-js-003--const-first}

Preferito:

```js
const user = loadUser();
```

Usa `let` solo per una vera riassegnazione:

```js
let count = 0;
count++;
```

Non usare `var`.

### PL-JS-004 — Preferire `async` / `await` {#pl-js-004--prefer-async--await}

Preferito:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Evita le catene di promise quando `async` / `await` produce un controllo di flusso più chiaro.

### PL-JS-005 — Le arrow function dipendono dal contesto {#pl-js-005--arrow-functions-are-contextual}

La normale logica con nome può usare funzioni tradizionali:

```js
function createSession(user) {
    return new Session(user);
}
```

Le arrow function si adattano bene alle callback locali:

```js
users.filter(user => user.active());
```

Non usare le arrow function ovunque per impostazione predefinita.

### PL-JS-006 — La destrutturazione deve migliorare la chiarezza {#pl-js-006--destructuring-must-improve-clarity}

Bene:

```js
const { id, name } = user;
```

Evita di destrutturare oggetti grandi solo perché il linguaggio lo permette.

---

### PL-JS-007 — Densità delle cartelle {#pl-js-007--folder-density}

Una cartella di funzionalità/sorgenti JavaScript può contenere al massimo **10 moduli sorgente di produzione** per impostazione predefinita.

I barrel file come `index.js`, i test, i file generati e i file con soli metadati non contano.

Se la cartella supera il limite, dividila per responsabilità e non in base a un numero arbitrario di file.
