# Estilo de código Emerald

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Emerald {#emerald-profile}

Pureline Emerald sigue la **sintaxis nativa de Emerald** en lugar de tomar prestada la sintaxis propuesta de Emvus. Emerald es además el lenguaje de arranque (bootstrap) de Emvus, por lo que esta distinción importa para las herramientas y el código del compilador.

### PL-EMS-001 — Mantén la sintaxis nativa de Emerald {#pl-ems-001--keep-emerald-syntax-native}

Emerald usa archivos `.ems`, declaraciones `namespace` y `use` con `::`, tipos de retorno antes del nombre del método y puntos y coma.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

**No** reescribas las declaraciones de Emerald como `package`, `method<T>` o `where` de Emvus, ni como código sin punto y coma. Son lenguajes distintos.

### PL-EMS-002 — Usa el punto y coma de forma coherente {#pl-ems-002--use-semicolons-consistently}

Sigue la sintaxis de sentencias de Emerald basada en el punto y coma. Un formateador no debe aplicar a los archivos `.ems` la regla de punto y coma opcional de Emvus.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Nombres y organización de archivos {#pl-ems-003--names-and-file-organization}

- Tipos: `PascalCase`.
- Interfaces: prefijo `I` (`IStorage`, `IPacket`).
- Métodos, parámetros, campos y variables locales: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE` cuando proceda.
- Mantén explícitas las declaraciones `namespace` y `use`.
- Prefiere archivos fuente con el nombre de su tipo principal, respetando las convenciones de nombres que ya tenga el repositorio de Emerald (por ejemplo, `SessionService.ems`).
- Usa como máximo **8** archivos `.ems` de producción por carpeta de fuentes o de namespace por defecto; se excluyen los tests y las fuentes generadas.

No renombres archivos fuente que ya funcionan solo para satisfacer una convención hipotética entre lenguajes.

### PL-EMS-004 — Guard clauses con llaves {#pl-ems-004--guard-clauses-with-braces}

Usa bloques explícitos y mantén sin anidar el camino correcto.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Evita `else` cuando un `return`, un `continue` u otra terminación temprana lo hace innecesario. Las sentencias `if` en línea y sin llaves no son Pureline Emerald.

### PL-EMS-005 — Los tipos explícitos y `var` son igualmente válidos {#pl-ems-005--explicit-types-and-var-are-both-valid}

Usa un tipo declarado cuando aclare un límite de API. Usa `var` cuando el tipo inferido estáticamente sea evidente al instante; `var` **no** es una petición de tipado dinámico.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Ninguna de las dos formas debe señalarse como infracción de estilo solo porque la otra sea posible.

### PL-EMS-006 — Conserva el modelo de objetos de Emerald {#pl-ems-006--preserve-emeralds-object-model}

Usa la forma normal de llamada a constructor de Emerald, sin la palabra clave `new` al estilo de Java.

```java
Connection connection = Connection();
```

Mantén explícitos los constructores, los campos, la herencia y las interfaces. Prefiere clases pequeñas y cohesivas a capas adicionales de manager/factory sin una responsabilidad concreta.

### PL-EMS-007 — Prefiere las data classes para los tipos con forma de datos {#pl-ems-007--prefer-data-classes-for-data-shaped-types}

Cuando un tipo agrupa principalmente datos relacionados y los miembros generados que admite Emerald son adecuados, prefiere una data class a repetir código estándar.

```java
public data class Coordinate(Int x, Int y);
```

La generación de data classes de Emerald incluye un constructor, `equals`, `toString`, `copy` y métodos `withX` cuando proceda. No des por hecho que las características de las data classes exclusivas de Emvus, como `copy` con argumentos con nombre, `hashCode` generado o la desestructuración de Emvus, ya forman parte de Emerald.

### PL-EMS-008 — Usa macros solo para abstracciones genuinas en tiempo de compilación {#pl-ems-008--use-macros-only-for-genuine-compile-time-abstractions}

El sistema de macros AST de Emerald es adecuado para la generación estructural repetitiva, no para disfrazar la lógica ordinaria del programa.

- Prefiere macros de anotación pequeñas y con nombres claros.
- Haz que los campos y métodos generados sean fáciles de descubrir para quienes mantienen el código y para las herramientas.
- Evita sustituir un método sencillo por un comportamiento de macro difícil de depurar.
- No dependas de capacidades de las macros que no estén documentadas ni modifiques en silencio declaraciones que no guardan relación.
- Mantén las transformaciones en tiempo de compilación separadas de los efectos secundarios en tiempo de ejecución.

### PL-EMS-009 — Haz explícitas las rutas de error {#pl-ems-009--make-error-paths-explicit}

Usa el mecanismo de errores que admita la API real de Emerald. Cuando una función devuelva `Result<T, E>`, trátalo o reenvíalo de forma intencionada. No copies a código Emerald las construcciones específicas de Emvus, como `success value`, `fail error`, el `?` postfijo o `scoped`, salvo que esa sintaxis esté implementada por separado en Emerald.

Protege pronto frente a las entradas inválidas y haz visible el fallo inesperado en lugar de tragártelo.

### PL-EMS-010 — La concurrencia tiene dueño {#pl-ems-010--concurrency-has-ownership}

Las facilidades `Fiber`, `@Async`, `@Synchronized` y de hilos de Emerald deben usarse con ciclos de vida explícitos.

- Mantén el trabajo bloqueante fuera de los hilos de ejecución inadecuados.
- Espera (await) las operaciones cuyos resultados o fallos importen.
- Sincroniza el estado mutable compartido de forma intencionada.
- No confundas la ejecución asíncrona con la seguridad automática entre hilos.

### PL-EMS-011 — Mantén comprensible el código sensible a Flow {#pl-ems-011--keep-flow-sensitive-code-understandable}

Emerald Flow puede optimizar las asignaciones y los tiempos de vida de los objetos, pero la semántica legible del código fuente tiene prioridad.

- Prefiere referencias locales estables cuando varias lecturas serían ambiguas.
- No dependas manualmente de las opciones de almacenamiento no documentadas `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` o `Static`.
- Evita los escapes ocultos y las referencias de larga vida accidentales en las rutas críticas.
- Trata las estrategias del optimizador como detalles de implementación del compilador, no como rituales de programación a nivel de código fuente.

### PL-EMS-012 — Prueba las abstracciones orientadas al compilador {#pl-ems-012--test-compiler-facing-abstractions}

En el código del compilador, del AST y del runtime, escribe tests para las condiciones límite, las rutas de error, los miembros generados y el comportamiento del tiempo de vida de los objetos. Un método más corto no es automáticamente mejor si oculta una transición de fase o un efecto secundario importante.
