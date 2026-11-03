# Style de code JavaScript

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil JavaScript {#javascript-profile}

### PL-JS-001 — Les accolades sont obligatoires {#pl-js-001--braces-are-mandatory}

Recommandé :

```js
if (!user) {
    return;
}
```

Pas du Pureline :

```js
if (!user) return;
```

### PL-JS-002 — Utiliser des points-virgules {#pl-js-002--use-semicolons}

Recommandé :

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript utilise les points-virgules de façon systématique.

### PL-JS-003 — `const` d'abord {#pl-js-003--const-first}

Recommandé :

```js
const user = loadUser();
```

N'utilisez `let` que pour une véritable réaffectation :

```js
let count = 0;
count++;
```

N'utilisez pas `var`.

### PL-JS-004 — Préférer `async` / `await` {#pl-js-004--prefer-async--await}

Recommandé :

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Évitez les chaînes de promesses lorsque `async` / `await` donne un flux de contrôle plus clair.

### PL-JS-005 — Les fonctions fléchées dépendent du contexte {#pl-js-005--arrow-functions-are-contextual}

La logique nommée ordinaire peut utiliser des fonctions classiques :

```js
function createSession(user) {
    return new Session(user);
}
```

Les fonctions fléchées conviennent bien aux callbacks locaux :

```js
users.filter(user => user.active());
```

N'utilisez pas les fonctions fléchées partout par défaut.

### PL-JS-006 — La déstructuration doit améliorer la clarté {#pl-js-006--destructuring-must-improve-clarity}

Bien :

```js
const { id, name } = user;
```

Évitez de déstructurer de gros objets uniquement parce que le langage le permet.

---

### PL-JS-007 — Densité des dossiers {#pl-js-007--folder-density}

Un dossier de fonctionnalité/source JavaScript peut contenir au maximum **10 modules sources de production** par défaut.

Les fichiers barrel comme `index.js`, les tests, les fichiers générés et les fichiers contenant uniquement des métadonnées ne comptent pas.

Si le dossier dépasse la limite, découpez-le par responsabilité plutôt que selon un nombre arbitraire de fichiers.
