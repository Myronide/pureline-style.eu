# Estilo de código Java

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de Java

### PL-JAVA-001 — Paquete por responsabilidad

Preferido:

```text
src/main/java/
    space/example/project/
        api/
        runtime/
        service/
        network/
        storage/
        model/
```

Evite los motivos genéricos de dumping como `util/`, `manager/`, `misc/` o `helper/`, a menos que el paquete tenga un propósito real y estrecho.

### PL-JAVA-002 — Denominación

Clases:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Las interfaces utilizan el prefijo `I`:

```java
ISession
IStorage
IPacket
IConnection
```

Métodos:

```java
open()
close()
load()
save()
execute()
resolve()
```

Variables:

```java
request
session
player
connection
```

Las variables de una sola letra son denegadas a menos que sean convenciones locales establecidas, como contadores de bucles.

### PL-JAVA-003 — Prefiere registros de datos inmutables

Preferido:

```java
public record SessionId(UUID value) {
}
```

Evite la placa de caldera POjos cuando un registro es suficiente.

### PL-JAVA-004 — Manipulación explícita de los nulos

Evitar:

```java
Objects.requireNonNull(value);
```

para la validación normal del flujo de control.

Prefiere:

```java
if (value == null) {
    return;
}
```

o un fallo específico del dominio:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Usar importaciones en lugar de FQCN

Evitar:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Prefiere:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Prefiere Java moderno

Utilice las funciones Java modernas cuando mejoren el código:

```text
records
sealed types
pattern matching
switch expressions
var
virtual threads
text blocks
streams
```

La sintaxis moderna debe reducir el ruido, no crear novedad por sí misma.

Prefiere un patrón `instanceof` cuando un guardia comprueba un tipo y el éxito
path necesita el valor como ese tipo.

```text
− Separate cast                      │ ✓ Pureline
if (!(value instanceof String)) {   │ if (!(value instanceof String text)) {
    return "";                       │     return "";
}                                    │ }
                                     │
String text = (String) value;        │ return text.trim();
return text.trim();                  │
```

### PL-JAVA-007 — Prefiere cambiar para la sucursal de un estado real

Preferido:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Prefiere esto a largas cadenas de controles estatales no relacionados.

### PL-JAVA-008 — Condición monetaria

No bloquee los hilos principales ni marque los hilos con HTTP, operaciones de base de datos, acceso al sistema de archivos o bloqueo de E/S de red.

Los hilos virtuales son preferidos para bloquear E/S cuando sea apropiado.

### PL-JAVA-009 — Sólo se transmite cuando es más claro

Se alientan las corrientes cuando mejoran la legibilidad. Use un bucle si es más claro, más fácil de depurar, o mejor adaptado a la ruta caliente.

### PL-JAVA-010 — Lifecycle Symmetry

Cualquier cosa que se abra, registre, inicie, asigne o suscriba debe tener una ruta igual de clara correspondiente, cerrar, desregistrar, detener, liberar o cancelar la suscripción.
