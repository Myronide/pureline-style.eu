# Estilo de código JavaScript

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de JavaScript

### PL-JS-001 — Los frenos son obligatorios

Preferido:

```js
if (!user) {
    return;
}
```

No Pureline:

```js
if (!user) return;
```

### PL-JS-002 — Utilizar semicolones

Preferido:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript utiliza semicolons consistentemente.

### PL-JS-003 — `const` Primero

Preferido:

```js
const user = loadUser();
```

Utilice `let` sólo para la reasignación real:

```js
let count = 0;
count++;
```

No utilice `var`.

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

### PL-JS-004 — Prefiere `async` / `await`

Preferido:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Evite las cadenas prometedoras cuando `async` / `await` produce un flujo de control más claro.

### PL-JS-005 — Las funciones de flecha son contextuales

La lógica normal puede utilizar funciones regulares:

```js
function createSession(user) {
    return new Session(user);
}
```

Las funciones de flecha son adecuadas para callbacks locales:

```js
users.filter(user => user.active());
```

No utilice funciones de flecha en todas partes por defecto.

### PL-JS-006: La destrucción debe mejorar la claridad

Good:

```js
const { id, name } = user;
```

Evite destruir objetos grandes sólo porque el lenguaje lo permite.

---

### PL-JS-007 — Densidad de la carpeta

Una carpeta de características/fuentes de JavaScript puede contener como máximo los módulos de origen de producción **10** por defecto.

Los archivos de barras como `index.js`, pruebas, archivos generados y archivos de metadatos no cuentan.

Si la carpeta supera el límite, divídala por responsabilidad en lugar de por recuento arbitrario de archivos.
