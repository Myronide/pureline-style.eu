# Estilo de código Novus

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Novus es un lenguaje autoalojado (self-hosting) que compila a C portable, con valores de tipado dinámico, tipado estático opcional, componentes `.nvh` renderizados en el servidor y contenido Markdown `.nvmd` mediante [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). El perfil sigue los ejemplos de Novus, la biblioteca estándar y las reglas que comprueba el servidor de lenguaje de Novus cuando están activados los diagnósticos de estilo de Pureline (`novus.pureline.enabled`). La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

Los ID de regla `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` y `PL-NAME-001` son los que el servidor de lenguaje de Novus ya notifica con la fuente `pureline`. Las reglas específicas de Novus que siguen usan el prefijo `PL-NV-*`.

## Perfil de Novus {#novus-profile}

### PL-NV-001 — Nombres y visibilidad {#pl-nv-001--naming-and-visibility}

- Clases, enums y componentes: `PascalCase`.
- Métodos, campos, variables locales y parámetros: `lowerCamelCase`.
- Nombres de paquetes (carpetas): cortos, en minúsculas y sin separadores.
- Constantes: `private final SCREAMING_SNAKE_CASE` a nivel de archivo.
- Mantén los miembros privados salvo que los use otro paquete o archivo. Expón los campos mediante `: get` o `: get, set` solo cuando quien llama los necesite.
- Se permiten nombres cortos para los contadores de bucle (`i`, `j`, `k`). `PL-NAME-001` notifica los demás nombres de una letra y los marcadores de posición (`tmp`, `obj`, `thing`, `data2`).

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

### PL-NV-002 — Guard clauses y flujo lineal {#pl-nv-002--guard-clauses-and-linear-flow}

Valida primero, retorna pronto y mantén el camino correcto en la sangría base.

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

Evita `else` después de una rama que ya hace return, break o continue (`PL-CF-002`). Cuando un `else` sea realmente la forma más clara, marca la línea con una exención justificada:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Declaraciones: `final`, `var` y tipos explícitos {#pl-nv-003--declarations-final-var-and-explicit-types}

- Usa `final` para los valores que nunca cambian; usa `var` para las variables locales cuyo tipo sea evidente por el inicializador.
- Escribe un tipo declarado donde el lector tendría que adivinarlo y en los límites de API (campos, parámetros, tipos de retorno).
- Recuerda que un tipo explícito convierte el valor: `integer x = 2.9` almacena `2`. Haz visibles esas conversiones en lugar de depender de ellas por accidente.
- Novus no tiene asignación compuesta. Escribe `count = count + 1`, no `count += 1`, y mantén esa sentencia en una sola línea.

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

### PL-NV-004 — Construcción y literales de objeto {#pl-nv-004--construction-and-object-literals}

- Usa literales de objeto (`Person{name="Tom"}`) para datos simples sin comportamiento.
- Usa `construct()` cuando el objeto deba establecer invariantes, derivar campos o validar argumentos.
- No ocultes trabajo significativo en los inicializadores de campos; mantén la construcción explícita en `construct()`.
- Una cadena de herencia con `based` debe describir una relación «es un» real. Prefiere una `interface` cuando solo se comparta el comportamiento.

### PL-NV-005 — Firmas de métodos {#pl-nv-005--method-signatures}

- Declara los tipos de los parámetros y de retorno cuando la firma forme parte de una API, de un límite de módulo o de un componente `.nvh`.
- Usa `method name(args): type { }` para los métodos ordinarios; mantén las listas de parámetros lo bastante cortas como para recorrerlas de un vistazo.
- Se permiten las sobrecargas de métodos por aridad o por tipo de parámetro cuando el significado es idéntico. No uses sobrecargas para ocultar comportamientos distintos tras un mismo nombre.

### PL-NV-006 — El tamaño de las funciones es una señal de revisión {#pl-nv-006--function-size-is-a-review-signal}

El servidor de lenguaje revisa un método a las 30 líneas y lo notifica por encima de las 50 líneas (`PL-FN-001`). Son umbrales de revisión. Un método cohesivo que hace una sola cosa en secuencia puede seguir siendo más largo; divídelo cuando mezcle responsabilidades como el análisis sintáctico, la validación y la E/S.

### PL-NV-007 — Paquetes, imports y densidad de carpetas {#pl-nv-007--packages-imports-and-folder-density}

- Una carpeta es un paquete. Importa la unidad más estrecha que se necesite: `import geo/circle` o `import @helpers` en lugar de importar un paquete entero cuando basta un archivo.
- Mantén como máximo **10 archivos `.nv` / `.nvh`** por carpeta por defecto (`PL-STRUCT-002`). Divide según los límites de responsabilidad, no en carpetas anidadas sin sentido.
- Revisa un archivo a las **200 líneas** (`PL-STRUCT-001`). Es un umbral de revisión, no un límite estricto: mantén una responsabilidad por archivo y deja junta la lógica cohesiva.

### PL-NV-008 — La concurrencia tiene una propiedad visible {#pl-nv-008--concurrency-has-visible-ownership}

- Haz visible la concurrencia en el punto de llamada: `async` / `await`, `thread`, `virtual` y `sync` indican qué se ejecuta y dónde.
- Haz un seguimiento de cada tarea que importe. No inicies trabajo de «lanzar y olvidar» cuyos resultados el programa necesite más adelante.
- Protege explícitamente el estado mutable compartido con `sync` en lugar de depender del orden de las llamadas.
- Sigue la misma disciplina que [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) para el apagado y la cancelación.

### PL-NV-009 — El orden de evaluación se documenta, no se da por supuesto {#pl-nv-009--evaluation-order-is-documented-not-assumed}

Novus evalúa los operandos de izquierda a derecha y documenta las excepciones. No escribas código cuyo resultado dependa de un orden inusual. Mantén los efectos secundarios en sus propias sentencias y evita combinar en una misma expresión la lectura de una variable global o de un campo con una llamada posterior que lo modifique.

La cadena `..` sirve para construir un objeto o un array en una única secuencia lineal (`var names = []..append("Ada")..append("Grace")`). Úsala cuando cada paso sea una llamada o una asignación de miembro sobre el mismo receptor. Divide una cadena en pasos con nombre cuando un paso necesite un comentario o una bifurcación.

### PL-NV-010 — Bloques C y límites de plataforma {#pl-nv-010--c-blocks-and-platform-boundaries}

Un bloque `c { ... }` es un límite nativo. Mantenlo pequeño, aíslalo en un archivo específico y explica con un comentario qué supone el código C sobre los tipos, los tiempos de vida y la plataforma. Expón la función nativa mediante un método de Novus con una firma tipada, de modo que el resto del código nunca vea los detalles en bruto de C.

### PL-NV-011 — Los componentes `.nvh` mantienen separados el marcado y la lógica {#pl-nv-011--nvh-components-keep-markup-and-logic-apart}

En un componente `.nvh`:

- Declara el estado reactivo con `ref` dentro de `<?nv ... ?>` al principio del componente.
- Mantén los manejadores y los cálculos en bloques de Novus; mantén el HTML centrado en la estructura y la presentación.
- Calcula los valores derivados en un solo lugar en lugar de repetir la expresión en varios puntos del marcado.
- Trata cada componente como una única responsabilidad, igual que una clase (`PL-STRUCT-001`).

### PL-NV-012 — Comentarios y diagnósticos {#pl-nv-012--comments-and-diagnostics}

- Los comentarios explican el porqué, no el qué: el motivo de una solución provisional, una peculiaridad de la plataforma o una invariante poco evidente ([PL-DOC-001](../core/comments.md)).
- Los diagnósticos de Pureline son opcionales en el editor (`novus.pureline.enabled`). Actívalos en los proyectos compartidos para que los mismos ID de regla aparezcan en todos los editores y en la CI.
- Toda exención `pureline:allow-else` necesita un motivo en la misma línea. Una exención sin motivo es un hallazgo de revisión.

### PL-NV-013 — Contenido Markdown (`.nvmd`) {#pl-nv-013--markdown-content-nvmd}

Un archivo `.nvmd` es Markdown con Novus dentro, igual que `.mdx` es Markdown con JSX. El generador de [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) convierte `Page.nvmd` en `Page.nvh` antes de que se ejecute el compilador. Aplica las reglas anteriores al bloque de cabecera y a cualquier módulo `.nv` que importe; el cuerpo en Markdown sigue estas reglas:

- El cuerpo contiene el contenido. El bloque de cabecera (`<?nv ... ?>`) contiene solo lo que la página necesita: imports, props y unos pocos métodos. Traslada la lógica de más de unas pocas líneas a un módulo `.nv` e impórtalo.
- Las claves del frontmatter son las props de la página. Mantenlas cortas y planas, y usa `{title}` en lugar de repetir el valor en el texto.
- Limita cada `{expr}` a un valor o a una llamada. Calcula cualquier cosa más larga en la cabecera o en un módulo, para que el cuerpo se lea de arriba abajo como prosa.
- Mantén los bloques `{#if}` y `{#for}` con una profundidad máxima de dos niveles. Cuando un bloque repita marcado, usa un componente (`<Callout>`, `<Toc>`).
- Un encabezado cuyo texto es dinámico recibe un id explícito (`# {title} {#intro}`), para que los anclajes y `markdown.headings` se mantengan estables.
- Los archivos `.nvh` generados son salida de la compilación. Añádelos a `.gitignore`, no los edites nunca y corrige en su lugar el origen `.nvmd`. Conserva intacta la marca `<?nv /* nvmd-generated */`.
- Un bloque HTML con un manejador (`<button @click="hit">`) es nvh dentro de Markdown. Mantén esos bloques cortos y sepáralos del texto que los rodea con líneas en blanco.
