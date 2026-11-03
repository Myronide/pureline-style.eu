# Estilo de código Emerald

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de Emerald

Pureline Emerald sigue la sintaxis **native Emerald** en lugar de tomar prestada la sintaxis Emvus propuesta. Emerald es también el lenguaje bootstrap para Emvus, por lo que esta distinción importa para las herramientas y el código compilador.

### PL-EMS-001: Mantener a los nativos de Emerald Syntax

Emerald utiliza archivos `.ems`, declaraciones `namespace` y `use` con `::`, tipos de retorno antes de nombres de método, y semicolons.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Haz que **not** reescribir las declaraciones Emerald como Emvus `package`, `method<T>`, `where`, o código libre de semicolon. Estos son idiomas diferentes.

### PL-EMS-002 — Usar semicolons de manera consistente

Siga la sintaxis de la instrucción basada en semicolon de Emerald. Un formulario no debe aplicar la regla de Emvus opcional-semicolon a los archivos `.ems`.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Nombres y organización de archivos

- Tipos: `PascalCase`.
- Interfaces: Prefijo `I` (`IStorage`, `IPacket`).
- Métodos, parámetros, campos y locales: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE`, cuando proceda.
- Mantenga las declaraciones `namespace` y `use` explícitas.
- Prefiere los archivos de origen que llevan el nombre de su tipo primario, respetando las convenciones existentes de nombres de repositorios Emerald (por ejemplo, `SessionService.ems`).
- Utilizar como máximo **8** producción `.ems` archivos por carpeta fuente/namespace por defecto; se excluyen las pruebas y las fuentes generadas.

No renombrar archivos de origen de trabajo existentes simplemente para satisfacer una convención hipotética en varios idiomas.

### PL-EMS-004 — Cláusulas de protección con frenos

Utilice bloques explícitos y mantenga el camino acertado sin asnes.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Evite `else` cuando una `return` temprana, `continue` u otra terminación lo haga innecesario. Las declaraciones `if` sin tirantes en línea no son Pureline Emerald.

### PL-EMS-005 — Tipos explícitos y `var` son válidos

Use un tipo declarado cuando aclare un límite de API. Utilice `var` donde un tipo inferido estáticamente es inmediatamente obvio; `var` es **not** una solicitud de tipeo dinámico.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Neither form should be flagged as a style violation merely because the other is possible.

### PL-EMS-006 — Preserve Emerald's Object Model

Use Emerald's normal constructor call form without a Java-style `new` keyword.

```java
Connection connection = Connection();
```

Keep constructors, fields, inheritance, and interfaces explicit. Prefer small cohesive classes over extra manager/factory layers with no concrete responsibility.

### PL-EMS-007 — Prefer Data Classes for Data-Shaped Types

When a type primarily bundles related data and Emerald's supported generated members are suitable, prefer a data class over repeated boilerplate.

```java
public data class Coordinate(Int x, Int y);
```

Emerald's data-class generation includes a constructor, `equals`, `toString`, `copy`, and `withX` methods where applicable. No asuma que las características de clase de datos de Emvus-solamente como `copy` nombre-agmento, `hashCode` generado, o Emvus destructing ya son parte de Emerald.

### PL-EMS-008 — Usar macros solo para abstracciones de tiempo de compilación genuino

El sistema AST macro de Emerald es apropiado para la generación estructural repetitiva, no para disfrazar la lógica del programa ordinario.

- Prefiere macros pequeñas y claramente llamadas anotación.?
- Hacer que los campos y métodos generados sean detectables para los mantenedores y herramientas.
- Evite reemplazar un método sencillo con un comportamiento macro difícil de depurar.
- No confíe en las capacidades macro indocumentadas ni en las declaraciones no relacionadas.
- Mantenga las transformaciones de tiempo de compilación separadas de los efectos secundarios de tiempo de ejecución.

### PL-EMS-009: hacer explícitas las rutas de error

Utilice el mecanismo de error soportado por la API Emerald real. Cuando una función devuelve `Result<T, E>`, manéjalo o reenvíalo intencionalmente. No copie `success value`, `fail error`, postfix `?` o `scoped` específicos de Emvus se construye en código Emerald a menos que esa sintaxis se implemente separadamente allí.

Guarda temprano la entrada inválida y haz visible un fallo inesperado en lugar de tragarla.

### PL-EMS-010 — La moneda concurrente tiene propiedad

Las instalaciones `Fiber`, `@Async`, `@Synchronized` y el hilo de Emerald deben utilizarse con ciclos de vida explícitos.

- Sigue bloqueando el trabajo de los hilos de ejecución inapropiados.
- Operaciones de espera cuyos resultados o fracasos importan.
- Sincronizar estado mutable compartido intencionalmente.
- No confunda la ejecución asíncrona con la seguridad automática del hilo.

### PL-EMS-011 — Mantener comprensible el código de flujo-sensitivo

Emerald Flow puede optimizar la asignación y la vida útil de los objetos, pero la semántica de origen legible tiene prioridad.

- Prefiere referencias locales estables cuando las lecturas múltiples serían ambiguas.
- No confíe manualmente en las opciones de almacenamiento de `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` o `Static`.
- Evite escapes ocultos y referencias accidentales de larga vida en los caminos calientes.
- Tratar las estrategias optimizadoras como detalles de implementación del compilador, no rituales de codificación a nivel de fuente.

### PL-EMS-012 — Abstraciones de la función de compilación de pruebas

Para el compilador, AST y código de tiempo de ejecución, escriba pruebas para condiciones de límite, rutas de error, miembros generados y comportamiento de vida útil de los objetos. Un método más corto no es automáticamente mejor si oculta una transición de fase o un efecto secundario importante.
