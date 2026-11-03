# Style de code JavaScript

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille] (../core/structure.md) s'applique tout au long.

## Profil JavaScript

### PL-JS-001 — Les bretelles sont obligatoires

Préféré:

```js
if (!user) {
    return;
}
```

Pas Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Utiliser des semi-conducteurs

Préféré:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript utilise des point-virgule de façon constante.

### PL-JS-003 — `const` D'abord

Préféré:

```js
const user = loadUser();
```

Utilisez `let` uniquement pour la réaffectation réelle :

```js
let count = 0;
count++;
```

N'utilisez pas `var`.

### PL-JS-004 — Préférez `async` / `await`

Préféré:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Évitez les chaînes prometteuses lorsque `async` / `await` produit un débit de contrôle plus clair.

### PL-JS-005 — Les fonctions de flèche sont contextuelles

La logique normale nommée peut utiliser des fonctions régulières :

```js
function createSession(user) {
    return new Session(user);
}
```

Les fonctions Arrow sont bien adaptées aux callbacks locaux :

```js
users.filter(user => user.active());
```

N'utilisez pas les fonctions de flèches partout par défaut.

### PL-JS-006 — La destruction doit améliorer la transparence

Good:

```js
const { id, name } = user;
```

Évitez de détruire les objets de grande taille seulement parce que le langage le permet.

---

### PL-JS-007 — Densité du dossier

Un dossier de fonctionnalités/sources JavaScript peut contenir au maximum des modules source de production **10** par défaut.

Les fichiers barres tels que `index.js`, les tests, les fichiers générés et les fichiers métadonnées seuls ne comptent pas.

Si le dossier dépasse la limite, le diviser par responsabilité plutôt que par un compte de fichier arbitraire.
