# Estilo de código Java

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Java {#java-profile}

### PL-JAVA-001 — Paquetes por responsabilidad {#pl-java-001--package-by-responsibility}

Preferible:

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

Evita los cajones de sastre genéricos como `util/`, `manager/`, `misc/` o `helper/`, salvo que el paquete tenga un propósito real y acotado.

### PL-JAVA-002 — Nombres {#pl-java-002--naming}

Clases:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Las interfaces usan el prefijo `I`:

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

No se permiten las variables de una sola letra, salvo que sean convenciones locales consolidadas, como los contadores de bucle.

### PL-JAVA-003 — Prefiere los records para los datos inmutables {#pl-java-003--prefer-records-for-immutable-data}

Preferible:

```java
public record SessionId(UUID value) {
}
```

Evita los POJO con código repetitivo cuando un record es suficiente.

### PL-JAVA-004 — Manejo explícito de null {#pl-java-004--explicit-null-handling}

Evita:

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

o un fallo propio del dominio:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Usa imports en lugar de nombres totalmente cualificados {#pl-java-005--use-imports-instead-of-fqcns}

Evita:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Prefiere:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Prefiere el Java moderno {#pl-java-006--prefer-modern-java}

Usa las características modernas de Java cuando mejoren el código:

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

La sintaxis moderna debe reducir el ruido, no introducir novedades por el mero hecho de serlo.

### PL-JAVA-007 — Prefiere switch para ramificar por estados reales {#pl-java-007--prefer-switch-for-real-state-branching}

Preferible:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Prefiérelo a las cadenas largas de comprobaciones de estado sin relación entre sí.

### PL-JAVA-008 — Concurrencia {#pl-java-008--concurrency}

No bloquees los hilos principales ni los de tick con HTTP, operaciones de base de datos, acceso al sistema de archivos o E/S de red bloqueante.

Se prefieren los virtual threads para la E/S bloqueante cuando proceda.

### PL-JAVA-009 — Streams solo cuando aclaren {#pl-java-009--streams-only-when-clearer}

Se recomiendan los streams cuando mejoran la legibilidad. Usa un bucle si es más claro, más fácil de depurar o más adecuado para la ruta crítica.

### PL-JAVA-010 — Simetría del ciclo de vida {#pl-java-010--lifecycle-symmetry}

Todo lo que se abre, registra, inicia, reserva o suscribe debe tener un camino de cierre, baja, parada, liberación o cancelación de la suscripción igual de claro.
