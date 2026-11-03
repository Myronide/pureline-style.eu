# Clases, módulos y densidad de carpetas

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Clases y módulos {#classes-and-modules}

### PL-STRUCT-001 — Una responsabilidad clara {#pl-struct-001--one-clear-responsibility}

Evita estructuras como:

```text
ServerManager
 ├─ database
 ├─ players
 ├─ packets
 ├─ commands
 ├─ configuration
 ├─ HTTP
 └─ logging
```

Prefiere:

```text
server/
    ServerRuntime

network/
    Connection
    PacketRegistry
    PacketDispatcher

session/
    Session
    SessionService

storage/
    UserStorage
    SessionStorage
```

Una clase tiene una responsabilidad clara cuando sus miembros y su estado interno contribuyen a un único ámbito cohesivo. **El número de líneas por sí solo no determina si una clase está bien diseñada.** Consulta `PL-STRUCT-003` para las pautas de tamaño.

---

## Densidad de paquetes y carpetas {#package-and-folder-density}

### PL-STRUCT-002 — Mantén los espacios de nombres lo bastante pequeños para recorrerlos de un vistazo {#pl-struct-002--keep-namespaces-small-enough-to-scan}

Pureline considera que la densidad de archivos y tipos forma parte de la legibilidad del código.

Un paquete o una carpeta de código fuente debe ser lo bastante pequeño como para que un desarrollador entienda su contenido de un vistazo, sin tener que buscar en una larga lista plana de archivos sin relación.

Cuando se supera el límite, divide el paquete o la carpeta por responsabilidades en lugar de dejar que se convierta en un cajón de sastre.

#### Límites por defecto {#default-limits}

| Lenguaje | Valor por defecto de Pureline |
|---|---|
| Java | Máximo de 8 tipos de nivel superior o archivos fuente de producción por paquete |
| Emerald | Máximo de 8 archivos fuente `.ems` de producción por carpeta de fuentes o de namespace |
| Emvus | Máximo de 8 archivos fuente `.ev` de producción por paquete o carpeta de fuentes |
| JavaScript | Máximo de 10 módulos fuente de producción por funcionalidad o carpeta de fuentes |
| TypeScript | Máximo de 10 módulos fuente de producción por funcionalidad o carpeta de fuentes |
| Go | Máximo de 12 archivos `.go` por directorio de paquete, sin contar tests ni código generado |
| Crystal | Máximo de 10 archivos `.cr` de producción por carpeta de fuentes o de namespace |
| Rust | Máximo de 10 archivos `.rs` de producción mantenidos a mano por funcionalidad o carpeta de fuentes |

Los siguientes archivos no cuentan para el límite:

- tests y specs
- archivos fuente generados
- archivos que solo contienen metadatos
- `package-info.java`
- `module-info.java`
- archivos barrel de JavaScript/TypeScript, como `index.ts` o `index.js`
- bindings o salidas de protocolo generados
- instantáneas de migraciones y artefactos comparables generados por máquina

El propósito de esta regla no es forzar un anidamiento arbitrario de carpetas. Una división debe introducir un límite de responsabilidad real.

Mal:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java
    PacketHandler.java
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Preferible:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java

network/packet/
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java

network/runtime/
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Un proyecto puede modificar estos umbrales mediante un futuro archivo de configuración de Pureline, pero la regla por defecto debe seguir siendo estricta a propósito.

---

## Cohesión antes que tamaño {#cohesion-over-size}

### PL-STRUCT-003 — Cohesión antes que tamaño (Zusammengehörigkeit vor Zeilenbegrenzung) {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung}

> **Cohesión antes que tamaño — Zusammengehörigkeit vor Zeilenbegrenzung.**

El tamaño máximo preferido de una clase es **una orientación, nunca un límite estricto**. Mantén junta la lógica fuertemente relacionada cuando dividirla haría el código más difícil de leer, mantener, probar o razonar. Es preferible una clase cohesiva más grande a varias clases artificiales conectadas por una delegación innecesaria.

#### Pautas de tamaño de las clases {#class-size-guidance}

| Tamaño de la clase | Recomendación de Pureline |
|---|---|
| Hasta 200 líneas | Caso normal preferido |
| 201–400 líneas | Sin problema si la clase tiene una responsabilidad clara |
| 401–600 líneas | Decisión arquitectónica deliberada; mantén comprensible su cohesión |
| Más de 600 líneas | Se recomienda revisarla, **no está prohibida** |

Los rangos son **heurísticas, no límites estrictos**. Superar un umbral no debe, por sí solo, producir una infracción de estilo ni exigir una división.

#### Cuándo se justifican las clases más grandes {#when-larger-classes-are-justified}

- **Parsers y lexers:** una máquina de estados cohesiva puede volverse más complicada cuando sus estados y transiciones se dispersan entre abstracciones artificiales.
- **Algoritmos:** las fases de procesamiento fuertemente acopladas pueden ser más fáciles de entender y optimizar si se mantienen juntas.
- **Estructuras de datos centrales:** los métodos que comparten las mismas invariantes y el mismo estado interno pueden pertenecer a una sola clase.
- **Lógica compleja pero cohesiva:** dividir es contraproducente cuando añade indirección, delegación innecesaria o más coordinación que claridad.

#### Cuándo dividir de todos modos {#when-to-split-anyway}

Divide según los **límites de responsabilidad reales**, no según el número de líneas. Son indicios los subsistemas distintos que evolucionan de forma independiente, los motivos de cambio sin relación entre sí, el acoplamiento débil entre grupos de métodos o los ciclos de vida separados que una sola clase deja ocultos.

**Regla para las herramientas:** Pureline Checker y las inspecciones de los IDE pueden mostrar un aviso informativo de tamaño con una sugerencia de revisar la cohesión, sobre todo por encima de las 600 líneas. No deben tratar el número de líneas como prueba suficiente de una infracción, extraer clases automáticamente ni exigir supresiones solo para mantener intacta una clase cohesiva.

Este principio se aplica a **todos los perfiles de lenguaje de Pureline**, incluidos Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald y Emvus. La sintaxis y los modismos propios de cada lenguaje siguen teniendo prioridad.
