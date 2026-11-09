# Estilo de código Emvus

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de Emvus

Pureline Emvus sigue el diseño del lenguaje de ** Emvus actual**. Este es un perfil de estilo para la sintaxis `.ev` prevista, no una afirmación de que cada característica mostrada ya está implementada por el anillo 1. Mantenga a Emvus distinto de Emerald.

### PL-EV-001 — Declaraciones sobre los métodos nativos

Declarar métodos con `method` y, cuando sea necesario, un tipo de retorno en `method<Type>`. Las variables de tipo genérico se introducen a través de `where`, no mediante la adición de otra lista de parámetros genéricos al nombre del método.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Un método sin un tipo de retorno explícito devuelve `Void`.

### PL-EV-002 — Declaración vacía Parenth de los años 24 son opcionales; Llamar a Parenth de los años 24 no

Ambas declaraciones sin parámetros son conformes con Pureline:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Ambas ortografías declaran métodos de cero-agüero; la diferencia es cosmética, **not** una distinción de sobrecarga. Always write `refresh()` or `shutdown()` to execute the method; `object.refresh` is not a method call. Formatters should preserve or consistently configure either valid declaration style without marking the other as an error.

### PL-EV-003 — Braces Required; Semicolons Optional

Use explicit `{ ... }` blocks for `if`, loops, and comparable control flow. Prefer omitting optional semicolons in idiomatic Emvus, but do not reject existing valid semicolon-terminated code.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Brace-free inline guards and unnecessary `else` blocks are not Pureline. Keep continuation lines and long expressions unambiguous.

### PL-EV-004 — Naming, Imports, and Visibility

- Tipos: `PascalCase`; interfaces: Prefijo `I` (`IStorage`, `IConnection`).
- Métodos, campos, propiedades, parámetros y locales: `camelCase`.
- Constantes: `UPPER_SNAKE_CASE`.
- Envases: caminos punteados en minúsculas.
- Nombres de archivo de origen: **camelCase**, por ejemplo `sessionService.ev`, incluso si la clase primaria es `SessionService`.
- La visibilidad predeterminada es `public`; especifique `private` o `protected` cuando sea necesario.
- La resolución del símbolo es insensible a las mayúsculas pero se preserva la ortografía fuente: utilizar la ortografía **declarada** consistentemente y no definir nombres que difieren sólo en caso de que.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Utilizar importaciones y alias explícitos en lugar de depender de colisiones confusas.

### PL-EV-005 — Los tipos deben comunicar la rédito

Emvus está tecleado estáticamente por defecto. `var` realiza inferencia de tipo **static**; `dynamic` solicita explícitamente comportamiento tipo ejecución.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Utilice `dynamic` en los límites realmente dinámicos, no para evitar las comprobaciones de tipo normales. Tanto los tipos locales estáticos explícitos como los inferidos son compatibles con Pureline.

### PL-EV-006: Manipular la neutralidad a través del flujo estable

Emvus no requiere una anotación `T?`. Rastrea estados nulos a través del flujo de control. Guarda un valor posiblemente nulo temprano y prefiere una instantánea local estable de propiedades mutables antes de razonar sobre su nulidad.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Nunca confíes en lecturas repetidas y sin sincronizar de una propiedad mutable que tenga el mismo valor. Haga explícita la inicialización de campo requerida.

### PL-EV-007 — Manipulación de resultados tipografiado en lugar de fallos previstos

Emvus no tiene sintaxis `try/catch/finally`. Use `Result<T, E>`, `success`, `fail`, `?` y `switch` como el idioma especifica.

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

- `?` es para propagación de errores deliberada donde los tipos lo permiten.
- `!` causa pánico por el error; reserve para invariantes establecidos o controles de fronteras que realmente no pueden recuperarse.
- No descarte un `Result` ni esconda el fallo esperado tras `panic`.
- Mantenga `success`, `fail` y `return` distintos en lugar de envolver cada operación innecesariamente.

Prefiere `?` cuando se reenvíe el error sin cambios y el método de inclusión
El tipo de resultado lo acepta.

```text
Explicit result branches                │ ✓ Pureline
switch (validatePort(port)) {            │ Int validPort = validatePort(port)?
    success(value) -> success value     │ success validPort
    error(problem) -> fail problem      │
}                                       │
```

### PL-EV-008 — Hacer que los recursos Vi1000 Vi1000 con `scoped`

Utilice la construcción `scoped` de Emvus para recursos que deben cerrarse cuando su alcance termine.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

No reemplace `scoped` con Java `try-with-resources`, Go `defer`, o un inexistente Emvus `finally`. La vida útil de un recurso debe permanecer clara incluso cuando el compilador optimiza la memoria.

### PL-EV-009 — Prefiere clases de datos a la placa de caldera

Use `data class` para tipos pequeños, nombrados, centrados en datos con el comportamiento generado por la incorporación.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Las propiedades de datos primarios son sólo de lectura fuera de la inicialización. `copy()` y `withX(...)` expresan copias modificadas y son poco profundas por defecto. Preferir generar igualdad, hashing, y representación de la  cuando sea apropiado en lugar de reescribirlos manualmente. Mantenga tipos más grandes ricos en comportamiento como clases regulares.

**No introduzca un requisito de estilo `record` separado:** el diseño acordado Emvus utiliza `data class` para los modelos de datos nombrados y `Dictionary` para los datos del diccionario/objeto-literal.

### PL-EV-010: Listas, Tuplas y Diccionarios conservan su semántica definida

Para los literales de `[...]`, los tipos de elementos **all son exactamente iguales** implica un `List`; de lo contrario la expresión es una tupla. No haga que Pureline sobrescriba la regla de tipo del idioma con una preferencia estilística.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Diccionario literales utilizan `{ key: value }`; inferido tipos de valor mixto utilizan `dynamic` cuando lo requiere el modelo de idioma. Los diccionarios son accedidos por **keys**, no por notación de punto de registro estructural.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Un tipo de elemento cambiante puede cambiar legítimamente la inferencia de lista contra tupla. Mantener ese comportamiento visible en los límites de API a través de tipos declarados explícitos cuando sea apropiado.

### PL-EV-011 — Desestructuración es posicional

Utilice `{ ... }` para desestructurar componentes de tupla o clase de datos en orden de declaración. `_` puede saltarse un elemento.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

No reinterprete la destrucción como coincidencia de registros. Prefiere uniones cortas significativas, no desempaquetaciones indiscriminadas.

### PL-EV-012 — `switch` debe exponer la ramificación completa

Utilice las declaraciones o expresiones de `switch` para alternativas de estado real. Las expresiones deben ser exhaustivas o tener un brazo definido para atrapar todo / fallar.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Prefiere los patrones `success(...)` y `error(...)` claros a condiciones anidadas para `Result`. Mantengan patrones de captura deliberados, no una manera de ocultar casos olvidados.

### PL-EV-013: Utilice las cascadas sólo cuando aclaren a un receptor único

Las cascadas con `..` son útiles para una breve secuencia de operaciones en el mismo receptor.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Evite las cadenas que ocultan efectos no relacionados, que envuelven varios objetos implícitamente o que se extienden a través de muchas declaraciones.

### PL-EV-014 — Las fibras y los hilos necesitan ciclos de vida claros

`fiber {}`, `virtual {}` y `thread {}` son constructos de ejecución distintos con un patrón de resultado de tarea común. Elija basado en la carga de trabajo real, no porque la concurrencia se vea compacta.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Esperar resultados y fracasos que importan.
- Haga la cancelación y la propiedad clara para las tareas de larga duración.
- Sincronizar estado mutable compartido; `@Synchronized` está disponible cuando proceda.
- No asuma que el objeto capturado de una tarea es apilado-local o puede ser liberado cuando el método de desove regrese.
- Evite el trabajo oculto de fuego y olvido en métodos de negocio ordinarios.

### PL-EV-015 — Las macros deben mejorar la capacidad de descubrir, no obscurecerlo

Las macros Emvus son transformaciones AST de tiempo de compilación con declaraciones de destino, `quote`, sustitución `$(...)` y APIs de constructores AST.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline requiere:

- Pequeñas macros con responsabilidades claramente establecidas y objetivos apoyados.
- Expansión determinista; comportamiento de orden fuente y miembros resultantes permanecen detectables.
- Higiene para evitar colisiones accidentales de nombres.
- Diagnóstico de compilador cuando la expansión crea código conflictivo o no válido.
- Métodos ordinarios en lugar de macros cuando no existe beneficio sustancial de tiempo de compilación.
- No depende de E/S macro-tiempo no revisado, red, reloj, o efectos secundarios aleatorios.

El código generado debe satisfacer las comprobaciones semánticas; las herramientas de control/formateado no deben tratar las ubicaciones generadas como archivos normales mantenidos a mano.

### PL-EV-016 — No programe contra internos de flujo de HyperAlloc

El código Emvus puede optimizarse a través de Sublang, Optimind e HyperAlloc Flow. Los desarrolladores deben expresar **semantics y Lifetimes**, no adivinar manualmente una estrategia de asignación futura.

- Favor de los ciclos de vida de objetos simples y la propiedad estable.
- Mantenga el estado mutable compartido explícito, especialmente en las tareas.
- Prefiere clases de datos inmutables para valores simples cuando se ajusten al dominio.
- No construya APIs en torno a supuestos de que un objeto siempre está apilado, remplazado o agrupado.
- Evalúe la asignación de senderos calientes y el comportamiento de escape a través de mediciones y diagnósticos, no del folclore.

### PL-EV-017 — Organización de la densidad y fuente de los paquetes

Una carpeta de paquete/fuente debe contener como máximo los módulos **8** de producción `.ev` por defecto. Pruebas, fuentes generadas y archivos de solo metadatos no cuentan. Dividir por la responsabilidad real de las características en lugar de crear subpaquetes arbitrarios mecánicamente.

Un nombre de paquete y un nombre de archivo son conceptos diferentes: `app.session` sigue siendo minúscula, mientras que `sessionService.ev` es `camelCase`.

### PL-EV-018 — Las reglas de idioma-nativo anulan la imitación entre idiomas

Las herramientas Pureline no deben reportar una violación simplemente porque Emvus difiere de Java, Emerald, Rust o Go:

- Las declaraciones opcionales del método `()` en **parameterless** son válidas; las llamadas siempre requieren `()`.
- Los semicolons opcionales son válidos.
- `where` es la sintaxis nativa de la declaración genérica.
- `var` se infiere estáticamente; `dynamic` es explícitamente dinámico.
- `success`, `fail`, `?`, `!`, `scoped` y AST macros tienen significados específicos de Emvus.
- `{ ... }` tiene usos válidos dependientes del contexto, incluyendo diccionarios y destrucciones posicionales.
- `[ ... ]` se escribe como una lista o tupla de acuerdo con la regla de Emvus de tipo de elemento exacto.

El formulario debe ser AST-aware, preservar el significado, y nunca aplicar los espacios de nombres `::` de Emerald o requisitos de semicolon a los archivos `.ev`.
