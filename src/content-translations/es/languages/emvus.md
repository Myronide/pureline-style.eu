# Estilo de código Emvus

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Emvus {#emvus-profile}

Pureline Emvus sigue el **diseño actual del lenguaje Emvus**. Es un perfil de estilo para la sintaxis `.ev` prevista, no una afirmación de que Ring 1 ya implemente todas las características mostradas. Mantén Emvus diferenciado de Emerald.

### PL-EV-001 — Declaraciones de método nativas {#pl-ev-001--native-method-declarations}

Declara los métodos con `method` y, cuando haga falta, un tipo de retorno en `method<Type>`. Las variables de tipo genéricas se introducen mediante `where`, no añadiendo otra lista de parámetros genéricos al nombre del método.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Un método sin tipo de retorno explícito devuelve `Void`.

### PL-EV-002 — Los paréntesis vacíos en las declaraciones son opcionales; en las llamadas no {#pl-ev-002--empty-declaration-parentheses-are-optional-call-parentheses-are-not}

Las dos declaraciones sin parámetros cumplen Pureline:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Ambas formas declaran métodos sin argumentos; la diferencia es meramente estética, **no** distingue sobrecargas. Escribe siempre `refresh()` o `shutdown()` para ejecutar el método; `object.refresh` no es una llamada a método. Los formateadores deben conservar, o configurar de forma coherente, cualquiera de los dos estilos de declaración válidos sin marcar el otro como error.

### PL-EV-003 — Llaves obligatorias; punto y coma opcional {#pl-ev-003--braces-required-semicolons-optional}

Usa bloques explícitos `{ ... }` para `if`, los bucles y el control de flujo comparable. Prefiere omitir los puntos y coma opcionales en el Emvus idiomático, pero no rechaces el código válido ya existente que termine en punto y coma.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Las guardas en línea sin llaves y los bloques `else` innecesarios no son Pureline. Mantén sin ambigüedad las líneas de continuación y las expresiones largas.

### PL-EV-004 — Nombres, imports y visibilidad {#pl-ev-004--naming-imports-and-visibility}

- Tipos: `PascalCase`; interfaces: prefijo `I` (`IStorage`, `IConnection`).
- Métodos, campos, propiedades, parámetros y variables locales: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE`.
- Paquetes: rutas con puntos en minúsculas.
- Nombres de archivos fuente: **camelCase**, por ejemplo `sessionService.ev`, aunque la clase principal sea `SessionService`.
- La visibilidad por defecto es `public`; especifica `private` o `protected` cuando haga falta.
- La resolución de símbolos no distingue mayúsculas de minúsculas, pero se conserva la ortografía del código fuente: usa la **ortografía declarada** de forma coherente y no definas nombres que solo se diferencien en mayúsculas y minúsculas.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Usa imports y alias explícitos en lugar de depender de colisiones confusas.

### PL-EV-005 — Los tipos deben comunicar la intención {#pl-ev-005--types-should-communicate-intent}

Emvus tiene tipado estático por defecto. `var` realiza **inferencia estática de tipos**; `dynamic` solicita explícitamente un comportamiento tipado en tiempo de ejecución.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Usa `dynamic` en los límites que sean realmente dinámicos, no para esquivar las comprobaciones de tipos normales. Tanto los tipos locales estáticos explícitos como los inferidos cumplen Pureline.

### PL-EV-006 — Trata la nulabilidad mediante un flujo estable {#pl-ev-006--handle-nullability-through-stable-flow}

Emvus no exige una anotación `T?`. Sigue los estados nulos a través del flujo de control. Protege pronto un valor que pueda ser nulo y prefiere una instantánea local estable de las propiedades mutables antes de razonar sobre su nulabilidad.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Nunca confíes en que lecturas repetidas y no sincronizadas de una propiedad mutable devuelvan el mismo valor. Haz explícita la inicialización de los campos obligatorios.

### PL-EV-007 — Prefiere el tratamiento tipado con Result para los fallos esperados {#pl-ev-007--prefer-typed-result-handling-for-expected-failures}

Emvus no tiene la sintaxis `try/catch/finally`. Usa `Result<T, E>`, `success`, `fail`, `?` y `switch` tal como los especifica el lenguaje.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` sirve para propagar errores de forma deliberada cuando los tipos lo permiten.
- `!` provoca un pánico ante un error; resérvalo para invariantes establecidas o comprobaciones de límites de las que realmente no se pueda recuperar.
- No descartes un `Result` ni ocultes un fallo esperado tras un `panic`.
- Mantén diferenciados `success`, `fail` y `return` en lugar de envolver cada operación sin necesidad.

### PL-EV-008 — Haz visibles los tiempos de vida de los recursos con `scoped` {#pl-ev-008--make-resource-lifetimes-visible-with-scoped}

Usa la construcción `scoped` de Emvus para los recursos que deben cerrarse cuando termina su ámbito.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

No sustituyas `scoped` por el `try-with-resources` de Java, el `defer` de Go ni un `finally` inexistente en Emvus. El tiempo de vida de un recurso debe seguir siendo claro incluso cuando el compilador optimiza la memoria.

### PL-EV-009 — Prefiere las data classes al código repetitivo {#pl-ev-009--prefer-data-classes-to-boilerplate}

Usa `data class` para tipos pequeños, con nombre y centrados en los datos, con el comportamiento generado integrado.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Las propiedades de datos primarias son de solo lectura fuera de la inicialización. `copy()` y `withX(...)` expresan copias modificadas y son superficiales por defecto. Prefiere la igualdad, el hash y la representación textual generados cuando proceda, en lugar de reescribirlos a mano. Mantén como clases normales los tipos más grandes y ricos en comportamiento.

**No introduzcas un requisito de estilo `record` aparte:** el diseño acordado de Emvus usa `data class` para los modelos de datos con nombre y `Dictionary` para los datos de tipo diccionario o literal de objeto.

### PL-EV-010 — Las listas, las tuplas y los diccionarios conservan su semántica definida {#pl-ev-010--lists-tuples-and-dictionaries-retain-their-defined-semantics}

En los literales `[...]`, que **todos los tipos de elemento sean exactamente iguales** implica una `List`; en caso contrario, la expresión es una tupla. No hagas que Pureline sobrescriba la regla del lenguaje, basada en tipos, con una preferencia estilística.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Los literales de diccionario usan `{ key: value }`; los tipos de valor mixtos inferidos usan `dynamic` donde lo exija el modelo del lenguaje. A los diccionarios se accede por **claves**, no con la notación de punto propia de los registros estructurales.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Un tipo de elemento cambiante puede cambiar legítimamente la inferencia entre lista y tupla. Mantén visible ese comportamiento en los límites de las API mediante tipos declarados explícitamente cuando proceda.

### PL-EV-011 — La desestructuración es posicional {#pl-ev-011--destructuring-is-positional}

Usa `{ ... }` para desestructurar los componentes de una tupla o de una data class en el orden de declaración. `_` puede omitir un elemento.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

No reinterpretes la desestructuración como una coincidencia de registros por nombre. Prefiere enlaces cortos y con significado, no un desempaquetado indiscriminado.

### PL-EV-012 — `switch` debe exponer una ramificación completa {#pl-ev-012--switch-should-expose-complete-branching}

Usa sentencias o expresiones `switch` para las alternativas de estado reales. Las expresiones deben ser exhaustivas o tener una rama comodín o de fallo definida.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Para `Result`, prefiere los patrones claros `success(...)` y `error(...)` a las condiciones anidadas. Mantén deliberados los patrones comodín; no deben servir para ocultar casos olvidados.

### PL-EV-013 — Usa las cascadas solo cuando aclaren un único receptor {#pl-ev-013--use-cascades-only-when-they-clarify-a-single-receiver}

Las cascadas con `..` son útiles para una secuencia corta de operaciones sobre el mismo receptor.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Evita las cadenas que ocultan efectos sin relación, mutan varios objetos de forma implícita o se extienden a lo largo de muchas sentencias.

### PL-EV-014 — Las fibers y los hilos necesitan ciclos de vida claros {#pl-ev-014--fibers-and-threads-need-clear-lifecycles}

`fiber {}`, `virtual {}` y `thread {}` son construcciones de ejecución distintas con un patrón común de resultado de tarea. Elige según la carga de trabajo real, no porque la concurrencia se vea compacta.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Espera (await) los resultados y los fallos que importen.
- Aclara la cancelación y la propiedad en las tareas de larga duración.
- Sincroniza el estado mutable compartido; `@Synchronized` está disponible cuando proceda.
- No des por hecho que el objeto capturado por una tarea es local a la pila ni que puede liberarse cuando el método que la lanzó retorna.
- Evita el trabajo oculto de «lanzar y olvidar» en los métodos de negocio ordinarios.

### PL-EV-015 — Las macros deben mejorar la capacidad de descubrimiento, no ocultarla {#pl-ev-015--macros-must-improve-discoverability-not-obscure-it}

Las macros de Emvus son transformaciones AST en tiempo de compilación, con declaraciones de destino, `quote`, sustitución `$(...)` y API de construcción de AST.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline exige:

- Macros pequeñas, con responsabilidades y destinos admitidos claramente indicados.
- Expansión determinista; el comportamiento según el orden del código fuente y los miembros resultantes siguen siendo fáciles de descubrir.
- Higiene para evitar colisiones de nombres accidentales.
- Diagnósticos del compilador cuando la expansión cree código conflictivo o inválido.
- Métodos ordinarios en lugar de macros cuando no exista un beneficio sustancial en tiempo de compilación.
- No depender de efectos secundarios de E/S, de red, de reloj o de aleatoriedad en tiempo de macro que no hayan sido revisados.

El código generado debe superar las comprobaciones semánticas; las herramientas de verificación y formato no deben tratar las ubicaciones generadas como archivos ordinarios mantenidos a mano.

### PL-EV-016 — No programes contra los detalles internos de HyperAlloc Flow {#pl-ev-016--do-not-program-against-hyperalloc-flow-internals}

El código de Emvus puede optimizarse mediante Sublang, Optimind y HyperAlloc Flow. Los desarrolladores deben expresar **semántica y tiempos de vida**, no adivinar a mano una estrategia de asignación futura.

- Favorece ciclos de vida de objetos sencillos y una propiedad estable.
- Mantén explícito el estado mutable compartido, sobre todo entre tareas.
- Prefiere las data classes inmutables para los valores simples cuando encajen en el dominio.
- No construyas API sobre la suposición de que un objeto siempre se asigna en la pila, se sustituye por escalares o se agrupa en un pool.
- Evalúa la asignación de memoria y el comportamiento de escape en las rutas críticas mediante mediciones y diagnósticos, no con folclore.

### PL-EV-017 — Densidad de paquetes y organización del código fuente {#pl-ev-017--package-density-and-source-organization}

Un paquete o una carpeta de fuentes debe contener como máximo **8** módulos `.ev` de producción por defecto. Los tests, las fuentes generadas y los archivos que solo contienen metadatos no cuentan. Divide según la responsabilidad real de cada funcionalidad en lugar de crear subpaquetes arbitrarios de forma mecánica.

El nombre de un paquete y el nombre de un archivo son conceptos distintos: `app.session` sigue en minúsculas, mientras que `sessionService.ev` está en `camelCase`.

### PL-EV-018 — Las reglas propias del lenguaje prevalecen sobre la imitación entre lenguajes {#pl-ev-018--language-native-rules-override-cross-language-imitation}

Las herramientas de Pureline no deben notificar una infracción solo porque Emvus se diferencie de Java, Emerald, Rust o Go:

- Los `()` opcionales en las **declaraciones de métodos sin parámetros** son válidos; las llamadas siempre requieren `()`.
- Los puntos y coma opcionales son válidos.
- `where` es la sintaxis nativa de declaración de genéricos.
- `var` se infiere estáticamente; `dynamic` es explícitamente dinámico.
- `success`, `fail`, `?`, `!`, `scoped` y las macros AST tienen significados específicos de Emvus.
- `{ ... }` tiene usos válidos que dependen del contexto, entre ellos los diccionarios y la desestructuración posicional.
- `[ ... ]` se tipa como lista o como tupla según la regla de Emvus del tipo de elemento exacto.

El formateador debe conocer el AST, preservar el significado y no aplicar nunca a los archivos `.ev` los namespaces `::` ni los requisitos de punto y coma de Emerald.
