# Clases, módulos y densidad de carpeta

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Clases y módulos

### PL-STRUCT-001: una responsabilidad clara

Evite estructuras como:

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

A class has one clear responsibility when its members and internal state contribute to one cohesive concern. **Line count alone does not determine whether a class is well designed.** See `PL-STRUCT-003` for size guidance.

---

## Densidad de paquete y carpeta

### PL-STRUCT-002 — Mantenga los espacios de nombres lo suficientemente pequeños como para explorar

Pureline trata el archivo y la densidad de tipo como parte de la legibilidad del código.

Un paquete o carpeta fuente debe ser lo suficientemente pequeño como para que un desarrollador pueda entender su contenido de un vistazo sin buscar a través de una larga lista plana de archivos no relacionados.

Cuando se supere el límite, dividir el paquete o carpeta por responsabilidad en lugar de permitir que se convierta en un vertedero.

#### Límites predeterminados

|Idioma|Pureline predeterminado|
|---|---|
|Java|Máximo 8 tipos de producción de nivel superior/archivos de origen por paquete|
|Emerald|Máximo 8 archivos fuente `.ems` de producción por carpeta fuente/espacio de nombres|
|Emvus|Máximo 8 archivos fuente `.ev` de producción por carpeta de paquete/fuente|
|JavaScript|Máximo 10 módulos de fuente de producción por carpeta de función/fuente|
|TypeScript|Máximo 10 módulos de fuente de producción por carpeta de función/fuente|
|Vamos|Máximo 12 archivos `.go` no probados, no incluidos en el rango de +1 % por directorio de paquetes|
|Cristal|Máximo 10 archivos `.cr` de producción por carpeta fuente/namespace|
|Rust|Máximo 10 archivos `.rs` de producción mantenidos a mano por carpeta de función/fuente|

Estos archivos no cuentan hacia el límite:

- pruebas y especificaciones
- archivos de origen generados
- archivos de sólo metadatos
- `package-info.java`
- `module-info.java`
- Archivos de barril JavaScript/TypeScript como `index.ts` o `index.js`
- Acoplamientos generados o salida del protocolo
- instantáneas de migración y artefactos similares con la máquina-general

El propósito de esta regla no es forzar la anidación arbitraria de carpetas. Una división debería introducir un límite de responsabilidad real.

Mal::

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

Preferido:

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

Un proyecto puede anular estos umbrales a través de un futuro archivo de configuración Pureline, pero la regla por defecto debe permanecer intencionalmente estricta.

---

## Cohesión sobre el tamaño

### PL-STRUCT-003 — Cohesión sobre tamaño (Zusammengehörigkeit vor Zeilenbegrenzung)

> **Cohesión sobre el tamaño — Zusammengehörigkeit vor Zeilenbegrenzung.**

El tamaño máximo preferido de clase es **guidance, nunca un límite duro**. Mantenga la lógica fuertemente relacionada cuando se divide haría el código más difícil de leer, mantener, probar o razonar. Una clase cohesiva más grande es preferible a múltiples clases artificiales conectadas por delegación innecesaria.

#### Guía del tamaño de la clase

|Tamaño de la clase|Recomendación Pureline|
|---|---|
|Hasta 200 líneas|Caso normal preferido|
|Líneas 201–400|Un año de vida cuando la clase tiene una clara responsabilidad|
|401–600 líneas|Decisión arquitectónica deliberada; mantener su cohesión comprensible|
|Más de 600 líneas|Revisión recomendada, **not prohibido**|

Las gamas son **heurísticas, no límites duros**. Cruzar un umbral no debe, por sí mismo, producir una violación de estilo o requerir una división.

#### Cuando se justifiquen clases más grandes

- **Parsers y lexers:** Una máquina de estado cohesionado puede complicarse cuando sus estados y transiciones están dispersos a través de abstracciones artificiales.
- **:** Las fases de procesamiento apretadas pueden ser más fáciles de entender y optimizar cuando se mantienen juntas.
- **Estructuras de datos centrales:** Los métodos que comparten las mismas invariantes y el estado interno pueden pertenecer a una clase.
- **Lógica compleja pero cohesiva:** La división es contraproducente cuando añade una indirecta, delegación innecesaria o más coordinación que claridad.

#### Cuándo dividir de todos modos

Dividido por **real responsabilidad límites**, no por conteo de líneas. Los indicadores incluyen subsistemas distintos que evolucionan de manera independiente, razones no relacionadas para cambiar, acoplamiento débil entre grupos de métodos, o ciclos de vida separados que son oscurecidos por una clase.

**Tooling rule:** Pureline Checker and IDE inspections may show an informational size notice with a cohesion-review suggestion, particularly above 600 lines. They must not treat the number of lines as sufficient evidence of a violation, automatically extract classes, or require suppressions merely to keep a cohesive class intact.

This principle applies to **all Pureline language profiles**, including Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, and Emvus. Language-specific syntax and idioms continue to take precedence.
