# Estilo de código TypeScript

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

TypeScript hereda también el [perfil de JavaScript](javascript.md).

## Perfil de TypeScript {#typescript-profile}

TypeScript hereda todas las reglas de Pureline JavaScript.

### PL-TS-001 — Evita `any` {#pl-ts-001--avoid-any}

Evita:

```ts
function load(value: any): any {
}
```

Prefiere:

```ts
function load(value: UserId): User {
}
```

Usa `unknown` para datos realmente desconocidos:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Usa los tipos con criterio {#pl-ts-002--use-types-deliberately}

Tanto los tipos locales inferidos como los explícitos cumplen Pureline.

```ts
const user = loadUser();
```

es válido cuando el tipo inferido es evidente.

El tipado explícito es igualmente válido:

```ts
const user: User = loadUser();
```

Pureline **no** considera redundante una anotación explícita solo porque TypeScript pueda inferirla.

Los tipos explícitos resultan especialmente útiles cuando:

- aclaran la intención
- documentan un contrato esperado
- protegen un límite frente a ensanchamientos no deseados
- dan más confianza al refactorizar
- hacen el código más fácil de entender sin seguir toda una cadena de llamadas

La inferencia de tipos debe quitar ruido. Nunca debe convertirse en una regla contra el uso del sistema de tipos de TypeScript.

### PL-TS-003 — Sin el prefijo `I` al estilo de Java {#pl-ts-003--no-java-style-i-prefix}

Preferible:

```ts
interface Session {
}
```

No así:

```ts
interface ISession {
}
```

El prefijo `I` depende del perfil: Java, Emerald y Emvus lo usan; TypeScript no.

### PL-TS-004 — `interface` frente a `type` {#pl-ts-004--interface-vs-type}

Usa `interface` para contratos con forma de objeto:

```ts
interface User {
    id: string;
    name: string;
}
```

Usa `type` para uniones, alias y formas invocables:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Prefiere los tipos de unión a los enums cuando proceda {#pl-ts-005--prefer-union-types-over-enums-when-appropriate}

Preferible:

```ts
type State = "idle" | "ready" | "closed";
```

Usa un enum solo cuando una construcción enum real aporte valor.

### PL-TS-006 — Tipos fuertes en los límites, libertad en el interior {#pl-ts-006--strong-types-at-boundaries-freedom-internally}

Las API públicas, los datos externos, los límites de persistencia y las cargas útiles de red deben exponer, por lo general, tipos claros.

Dentro de una implementación, son válidas tanto las anotaciones explícitas como la inferencia. Elige la forma que haga el código más fácil de entender. Pureline no considera una más limpia que la otra solo porque tenga menos anotaciones de tipo.

---

### PL-TS-007 — Densidad de carpetas {#pl-ts-007--folder-density}

Una carpeta de funcionalidad o de código fuente de TypeScript puede contener como máximo **10 módulos fuente de producción** por defecto.

Los archivos barrel como `index.ts`, los archivos de apoyo que solo contienen declaraciones, los tests, los archivos generados y los archivos que solo contienen metadatos no cuentan.

Una división debe representar un límite de responsabilidad real, como:

```text
session/
session/state/
session/transport/
session/storage/
```
