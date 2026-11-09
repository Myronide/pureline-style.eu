# Estilo de código Astro

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [core compartido](../README.md#shared-rules) con este perfil, y el [TypeScript profile](typescript.md) para el script frontmatter. Astro renderiza HTML en el servidor o en el tiempo de construcción y envía JavaScript sólo donde sea necesario. Pureline Astro mantiene visible ese modelo: estática por defecto, interactiva cuando se haya declarado. Pureline es compatible con Astro 5 y posteriores.

## Perfil Astro

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Los componentes son archivos `.astro` nombrados en `PascalCase`

Un componente vive en `src/components/` y lleva el nombre de lo que representa (`SessionCard.astro`). Una página o diseño vive en `src/pages/` o `src/layouts/`. Los archivos de ruta permanecen delgados: cargan datos y componen componentes.

### PL-AS-002 — La materia delantera es lineal y se escribe

El frontmatter (entre las cercas `---`) hace cuatro cosas en orden: recibir props mecanografiados, datos de carga, calcular valores derivados, y luego renderizar. Declarar utilería con un `interface Props`. Mantenga la delantera libre de marcas.

```astro
---
interface Props {
    title: string;
    draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
    return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
```

### PL-AS-003 — Estatica por defecto, Islas por declaración

Renderizar HTML sin JavaScript a menos que el componente deba responder al usuario o cambiar con el tiempo. Cuando deba marcar el componente interactivo con una directiva de cliente explícita: `client:visible` para contenido debajo del pliegue, `client:idle` para widgets no urgentes, `client:load` sólo para lo que se necesita al principio pintar. Un componente sin una directiva nunca envía JavaScript.

### PL-AS-004 — Plantillas que permanecen legibles

- Condicional con `&&` o una variable nombrada para una sola rama; use un protector en la parte delantera para salidas tempranas.
- Mapas sobre listas con un `key` estable cuando la lista es interactiva.
- No anidar más de dos niveles de expresión dentro del marcado. Mueva la parte interna a un componente.

Mantenga una expresión de formato corta en la plantilla cuando se use una vez
y lee claramente en el punto de uso.

```text
Named frontmatter value                         │ ✓ Pureline
---                                             │ ---
const { title } = Astro.props;                  │ const { title } = Astro.props;
const displayTitle = title.trim() || "Profil";  │ ---
---                                             │
                                                │ <h1>{title.trim() || "Profil"}</h1>
<h1>{displayTitle}</h1>                         │
```

### PL-AS-005 — Los estilos están al alcance de la mano

Utilice los bloques `<style>` en el componente por defecto; Astro los visorea automáticamente. Utilice `is:global` sólo para reglas de todo el documento como restablecer o tokens del tema, y mantenga los en una hoja de estilo global.

### PL-AS-006 — Los datos tienen una fuente

El contenido vive en colecciones de contenido (`src/content/`) con un esquema (`defineCollection` y zod). Las páginas consultan la colección; no se analiza los archivos Markdown por sí mismos. Los datos remotos se cargan en la parte delantera de la página que los necesita, una vez.

### PL-AS-007 — Islas marco siguen su propio perfil

Una isla React, Vue, o Svelte sigue el perfil de ese marco (para React: [PL-REACT](react.md)). Astro no cambia las reglas del componente; sólo decide dónde está hidratado el componente.

### PL-AS-008 — Densidad de la carpeta

`src/components/` tiene como máximo archivos **10** por defecto. Agrupar componentes por función (`components/blog/`) una vez que una característica tiene varios archivos.

### PL-AS-009 — Herramientas

Ejecute `astro check` (tipos y diagnósticos de plantilla) y la compilación en CI. Utilice la salida `astro build` para verificar que las páginas sin islas no envían JavaScript.
