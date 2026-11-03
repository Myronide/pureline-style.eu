# Estilo de código TypeScript

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

TypeScript también hereda el [perfil de JavaScript](javascript.md).

## Perfil TypeScript

TypeScript hereda todas las reglas de Pureline JavaScript.

### PL-TS-001 — Evitar `any`

Evitar:

```ts
function load(value: any): any {
}
```

Prefiere:

```ts
function load(value: UserId): User {
}
```

Use `unknown` for untrusted input. Prefer a named type guard when the
validation describes a domain concept such as a valid port.

```text
A · Inline validation                        │ ✓ Pureline · Named type guard
function readPort(input: unknown): number {  │ function readPort(input: unknown): number {
    if (typeof input !== "number"            │     if (!isPort(input)) {
        || !Number.isInteger(input)          │         throw new InvalidPortError();
        || input < 1 || input > 65535) {     │     }
        throw new InvalidPortError();        │
    }                                        │     return input;
                                             │ }
    return input;                            │
}                                            │ function isPort(value: unknown): value is number {
                                             │     return typeof value === "number"
                                             │         && Number.isInteger(value)
                                             │         && value >= 1 && value <= 65535;
                                             │ }
```

### PL-TS-002 — Tipos de uso deliberado

Los tipos locales inferidos y explícitos cumplen con Pureline.

```ts
const user = loadUser();
```

es válido cuando el tipo inferido es obvio.

El tecleo explícito es igualmente válido:

```ts
const user: User = loadUser();
```

Pureline hace **not** tratar una anotación explícita como redundante simplemente porque TypeScript podría inferir.

Los tipos explícitos son especialmente útiles cuando:

- aclarar la intención
- documentar un contrato previsto
- proteger un límite de la ampliación no deseada
- mejorar la confianza en el refactoreo
- hacer código más fácil de entender sin seguir una cadena de llamadas entera

La inferencia de tipo debe eliminar el ruido. Nunca debería convertirse en una regla contra el uso del sistema de tipo TypeScript.

### PL-TS-003 — No hay prefijo Java-Style `I`

Preferido:

```ts
interface Session {
}
```

No:

```ts
interface ISession {
}
```

El prefijo `I` es específico para cada perfil: Java, Emerald y Emvus lo usan; TypeScript no lo hace.

### PL-TS-004 — `interface` vs `type`

Utilice `interface` para contratos similares a objetos:

```ts
interface User {
    id: string;
    name: string;
}
```

Utilice `type` para sindicatos, alias y formas llamables:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005: Prefieren los tipos de unión sobre los enumes cuando proceda

Preferido:

```ts
type State = "idle" | "ready" | "closed";
```

Use un enum sólo cuando un constructo real de enum proporcione valor.

### PL-TS-006: Tipos fuertes en límites, libertad interna

Las API públicas, los datos externos, los límites de persistencia y las cargas útiles de la red normalmente deben exponer tipos claros.

Dentro de una implementación, tanto las anotaciones explícitas como la inferencia son válidas. Elija el formulario que hace que el código sea más fácil de entender. Pureline no hace una puntuación como limpia puramente porque contiene menos anotaciones de tipo.

---

### PL-TS-007 — Densidad de la carpeta

Una carpeta de características/fuentes TypeScript puede contener como máximo los módulos de origen de producción **10** por defecto.

Los archivos de barras como `index.ts`, los archivos de sólo declaración de soporte, pruebas, archivos generados y los archivos de sólo metadatos no cuentan.

Una división debe representar un verdadero límite de responsabilidad, como:??

```text
session/
session/state/
session/transport/
session/storage/
```
