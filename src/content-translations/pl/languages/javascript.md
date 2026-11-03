# JavaScript Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil JavaScript {#javascript-profile}

### PL-JS-001 — Nawiasy klamrowe są obowiązkowe {#pl-js-001--braces-are-mandatory}

Zalecane:

```js
if (!user) {
    return;
}
```

To nie jest Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Używaj średników {#pl-js-002--use-semicolons}

Zalecane:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript konsekwentnie używa średników.

### PL-JS-003 — Najpierw `const` {#pl-js-003--const-first}

Zalecane:

```js
const user = loadUser();
```

`let` stosuj tylko przy faktycznym przypisaniu ponownym:

```js
let count = 0;
count++;
```

Nie używaj `var`.

### PL-JS-004 — Preferuj `async` / `await` {#pl-js-004--prefer-async--await}

Zalecane:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Unikaj łańcuchów promise, gdy `async` / `await` daje czytelniejszy przepływ sterowania.

### PL-JS-005 — Funkcje strzałkowe zależą od kontekstu {#pl-js-005--arrow-functions-are-contextual}

Zwykła, nazwana logika może używać funkcji tradycyjnych:

```js
function createSession(user) {
    return new Session(user);
}
```

Funkcje strzałkowe dobrze nadają się do lokalnych callbacków:

```js
users.filter(user => user.active());
```

Nie używaj funkcji strzałkowych wszędzie jako domyślnego wyboru.

### PL-JS-006 — Destrukturyzacja musi poprawiać czytelność {#pl-js-006--destructuring-must-improve-clarity}

Dobrze:

```js
const { id, name } = user;
```

Unikaj destrukturyzacji dużych obiektów tylko dlatego, że język na to pozwala.

---

### PL-JS-007 — Gęstość folderów {#pl-js-007--folder-density}

Folder funkcji/źródłowy w JavaScript może domyślnie zawierać co najwyżej **10 produkcyjnych modułów źródłowych**.

Pliki barrel, takie jak `index.js`, testy, pliki generowane i pliki zawierające wyłącznie metadane, nie są wliczane.

Jeśli folder przekracza limit, podziel go według odpowiedzialności, a nie według dowolnej liczby plików.
