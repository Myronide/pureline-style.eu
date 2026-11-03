# Estilo de código JavaScript

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de JavaScript {#javascript-profile}

### PL-JS-001 — Las llaves son obligatorias {#pl-js-001--braces-are-mandatory}

Preferible:

```js
if (!user) {
    return;
}
```

No es Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Usa punto y coma {#pl-js-002--use-semicolons}

Preferible:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript usa el punto y coma de forma coherente.

### PL-JS-003 — Primero `const` {#pl-js-003--const-first}

Preferible:

```js
const user = loadUser();
```

Usa `let` solo cuando haya una reasignación real:

```js
let count = 0;
count++;
```

No uses `var`.

### PL-JS-004 — Prefiere `async` / `await` {#pl-js-004--prefer-async--await}

Preferible:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Evita las cadenas de promesas cuando `async` / `await` produce un flujo de control más claro.

### PL-JS-005 — Las funciones flecha dependen del contexto {#pl-js-005--arrow-functions-are-contextual}

La lógica normal con nombre puede usar funciones regulares:

```js
function createSession(user) {
    return new Session(user);
}
```

Las funciones flecha son adecuadas para callbacks locales:

```js
users.filter(user => user.active());
```

No uses funciones flecha en todas partes por defecto.

### PL-JS-006 — La desestructuración debe mejorar la claridad {#pl-js-006--destructuring-must-improve-clarity}

Bien:

```js
const { id, name } = user;
```

Evita desestructurar objetos grandes solo porque el lenguaje lo permite.

---

### PL-JS-007 — Densidad de carpetas {#pl-js-007--folder-density}

Una carpeta de funcionalidad o de código fuente de JavaScript puede contener como máximo **10 módulos fuente de producción** por defecto.

Los archivos barrel como `index.js`, los tests, los archivos generados y los archivos que solo contienen metadatos no cuentan.

Si la carpeta supera el límite, divídela por responsabilidades y no por un número arbitrario de archivos.
