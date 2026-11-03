# Novus Code Style

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Novus es un lenguaje de auto-alojado que compila a C portátil, con valores dinámicamente mecanografiados, escritura estática opcional, componentes de representación del servidor `.nvh` y contenido de `.nvmd` Markdown a través de [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). El perfil sigue los ejemplos de Novus, la biblioteca estándar y las reglas del servidor de idiomas Novus comprueba cuando se habilitan diagnósticos de estilo Pureline (`novus.pureline.enabled`). [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

IDs de reglas `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` y `PL-NAME-001` son los que el servidor de lenguaje Novus ya informa bajo el código fuente `pureline`. Las reglas específicas de Novus a continuación usan el prefijo `PL-NV-*`.

## Perfil de Novus

### PL-NV-001 — Denominación y visibilidad

- Clases, enumes y componentes: `PascalCase`.
- Métodos, campos, locales y parámetros: `lowerCamelCase`.
- Nombres de los paquetes (carpeta): corto, en minúsculas, sin los tirantes..
- Constantes: `private final SCREAMING_SNAKE_CASE` a nivel de archivo.
- Mantenga los miembros privados a menos que otro paquete o archivo los use. Exponga los campos a través de `: get` o `: get, set` sólo cuando los llamantes los necesiten.
- Se permiten nombres cortos para contadores de bucles (`i`, `j`, `k`). Otros nombres de una letra y marcadores de posición (`tmp`, `obj`, `thing`, `data2`) son reportados por `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002 — Cláusulas de protección y flujo lineal

Validar primero, volver temprano, y mantener el camino acertado en la sangría base.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Evite `else` después de una rama que ya devuelve, rompe o continúa (`PL-CF-002`). Cuando un `else` sea realmente la forma más clara, marque la línea con una exención justificada:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Declaraciones: `final`, `var` y tipos explícitos

- Use `final` para valores que nunca cambian; use `var` para locales cuyo tipo es obvio en el inicializador.
- Escriba un tipo declarado donde el lector tendría que adivinar de otra manera, y en los límites de API (campos, parámetros, tipos de retorno).
- Recuerde que un tipo explícito convierte el valor: `integer x = 2.9` almacena `2`. Hacer visibles tales conversiones en lugar de confiar en ellas por accidente.
- Novus no tiene ninguna asignación compuesta.. Escriba `count = count + 1`, no `count += 1`, y mantenga esa declaración en una línea.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

```text
Explicit local type         │ ✓ Pureline
integer attempts = 0        │ var attempts = 0
attempts = attempts + 1     │ attempts = attempts + 1
```

### PL-NV-004 — Construcción y objetos literales

- Use literales de objetos (`Person{name="Tom"}`) para datos simples sin comportamiento.
- Utilice `construct()` cuando el objeto debe establecer invariantes, derivar campos o validar argumentos.
- No ocultar trabajos significativos en los inicializadores de campo; mantener la construcción explícita en `construct()`.
- Una cadena de herencia `based` debe describir una relación real es-una. Prefiere un `interface` cuando solo se comparta el comportamiento.

### PL-NV-005 — Firmas del método

- Declarar parámetros y devolver tipos cuando la firma es parte de una API, un módulo de límites, o un componente `.nvh`.
- Utilice `method name(args): type { }` para métodos ordinarios; mantenga listas de parámetros lo suficientemente cortas como para escanear.
- Se permiten sobrecargas de método por aridad o tipo de parámetro cuando el significado es idéntico. No utilice sobrecargas para ocultar diferentes comportamientos detrás de un nombre.

### PL-NV-006 — El tamaño de la función es una señal de revisión

El servidor de idiomas revisa un método en 30 líneas e informa sobre 50 líneas (`PL-FN-001`). Se trata de umbrales de revisión. Un método cohesivo que hace una cosa en secuencia puede permanecer más tiempo; dividirlo cuando mezcla responsabilidades como el análisis, la validación y la E/S.

### PL-NV-007 — Paquetes, importaciones y densidad de la carpeta

- Una carpeta es un paquete. Importar la unidad más estrecha necesaria: `import geo/circle` o `import @helpers` en lugar de importar un paquete entero cuando un archivo es suficiente.
- Keep at most **10 `.nv` / `.nvh` files** per folder by default (`PL-STRUCT-002`). Split along responsibility boundaries, not into meaningless nested folders.
- Revise un archivo en las líneas **200** (`PL-STRUCT-001`). Se trata de un umbral de revisión, no de un límite difícil: mantener una responsabilidad por archivo y dejar que la lógica cohesiva permanezca unida.

### PL-NV-008 — Conmoneda tiene propiedad Visible

- Hacer visible la concurrencia en el sitio de llamada: `async` / `await`, `thread`, `virtual`, y `sync` indicar lo que se ejecuta donde.
- Seguimiento de cada tarea que importa. No inicie el trabajo de fuego y olvido para obtener resultados del programa depende más adelante.
- Guard compartió el estado mutable explícitamente con `sync` en lugar de depender de la orden de llamada.
- Siga la misma disciplina que [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) para el apagado y la cancelación.

### PL-NV-009 — La orden de evaluación está documentada, no se supone

Novus evalúa las operaciones de izquierda a derecha y documenta las excepciones. No escriba código cuyo resultado depende de un pedido inusual. Mantenga los efectos secundarios en sus propias declaraciones, y evite combinar un campo o lectura global con una llamada posterior que lo cambie en una expresión.

La cadena `..` es para construir un objeto o matriz en una secuencia lineal (`var names = []..append("Ada")..append("Grace")`). Úselo cuando cada paso sea una llamada o asignación de miembro en el mismo receptor. Rompe una cadena en pasos nombrados cuando un paso necesita un comentario o una sucursal.

### PL-NV-010 — Bloques C y límites de plataforma

Un bloque `c { ... }` es un límite nativo. Manténgalo pequeño, aíslelo en un archivo enfocado, y explique con un comentario lo que el código C asume sobre los tipos, vidas y la plataforma. Exponga la función nativa a través de un método Novus con una firma tecleada, por lo que el resto del código nunca ve detalles crudos de C.

### PL-NV-011 — Componentes `.nvh` mantienen alejados el marcado y la lógica

En un componente `.nvh`:

- Declarar estado reactivo con `ref` dentro de `<?nv ... ?>` en la parte superior del componente.
- Mantenga los manejadores y los cálculos en los bloques de Novus; mantenga el HTML enfocado en la estructura y presentación.
- El compte derivó valores en un lugar en lugar de repetir la expresión en varios lugares del marcado.
- Tratar cada componente como una sola responsabilidad, de la misma manera que una clase (`PL-STRUCT-001`).

### PL-NV-012 — Comentarios y diagnósticos

- Los comentarios explican por qué, no qué: la razón de una solución, una peculiaridad de plataforma o una invariante no obvia [PL-DOC-001](../core/comments.md)].
- Los diagnósticos de Pureline son opcionales en el editor (`novus.pureline.enabled`). Habilitelos para proyectos compartidos de modo que aparezcan los mismos ID de reglas en cada editor y en CI.
- Cada exención `pureline:allow-else` necesita una razón en la misma línea. Una exención sin motivo es una conclusión de revisión.

### PL-NV-013 — Contenido de marcado (`.nvmd`)

Un archivo `.nvmd` es Markdown con Novus en él, la forma en que `.mdx` es Markdown con JSX. El generador en [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) convierte `Page.nvmd` en `Page.nvh` antes de que el compilador se ejecute. Aplicar las normas anteriores al bloque de cabecera y a cualquier módulo `.nv` que importe; el organismo Markdown sigue estas normas:

- El cuerpo lleva el contenido. El bloque de cabecera (`<?nv ... ?>`) lleva sólo lo que necesita la página: Importación, apoyo y algunos métodos. Mover la lógica más larga que unas pocas líneas a un módulo `.nv` e importarlo.
- Las teclas de la portada son los accesorios de la página. Manténgalos cortos y planos, y utilice `{title}` en lugar de repetir el valor en el texto.
- Mantenga cada `{expr}` a un valor o una llamada. Componga cualquier cosa más tiempo en la cabecera o un módulo, por lo que el cuerpo lee de arriba hacia abajo como prosa.
- Mantenga los bloques `{#if}` y `{#for}` en un máximo de dos niveles profundos. Cuando un bloque repite el marcado, utilice un componente (`<Callout>`, `<Toc>`) en su lugar.
- Un encabezado cuyo texto es dinámico obtiene un id explícito (`# {title} {#intro}`), por lo que los anclajes y `markdown.headings` permanecen estables.
- Los archivos `.nvh` generados son salida de compilación. Añádalos a `.gitignore`, nunca edite y arregle el origen `.nvmd` en su lugar. Mantenga intacta la marca `<?nv /* nvmd-generated */`.
- Un bloque HTML con un controlador (`<button @click="hit">`) es nvh dentro de Markdown. Mantenga tales bloques cortos y separarlos del texto circundante con líneas en blanco.
