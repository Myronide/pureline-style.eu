# Estilo de código Astro

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil, y el [perfil de TypeScript](typescript.md) para el script del frontmatter. Astro renderiza HTML en el servidor o en tiempo de compilación y envía JavaScript solo donde hace falta. Pureline Astro mantiene visible ese modelo: estático por defecto, interactivo donde se declara. Pureline es compatible con Astro 5 y posteriores.

## Perfil de Astro {#astro-profile}

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Los componentes son archivos `.astro` con nombre en `PascalCase` {#pl-as-001--components-are-astro-files-named-in-pascalcase}

Un componente vive en `src/components/` y se nombra según lo que renderiza (`SessionCard.astro`). Una página o un layout vive en `src/pages/` o `src/layouts/`. Los archivos de rutas se mantienen delgados: cargan datos y componen componentes.

### PL-AS-002 — El frontmatter es lineal y tipado {#pl-as-002--frontmatter-is-linear-and-typed}

El frontmatter (entre las vallas `---`) hace cuatro cosas en orden: recibe props tipadas, carga datos, calcula valores derivados y, después, renderiza. Declara las props con una `interface Props`. Mantén el frontmatter libre de marcado.

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

### PL-AS-003 — Estático por defecto, islas por declaración {#pl-as-003--static-by-default-islands-by-declaration}

Renderiza HTML sin JavaScript salvo que el componente deba responder al usuario o cambiar con el tiempo. Cuando deba hacerlo, marca el único componente interactivo con una directiva de cliente explícita: `client:visible` para el contenido que queda fuera de la pantalla inicial, `client:idle` para los widgets no urgentes y `client:load` solo para lo que se necesita en el primer renderizado. Un componente sin directiva nunca envía JavaScript.

### PL-AS-004 — Las plantillas siguen siendo legibles {#pl-as-004--templates-stay-readable}

- Condicionales con `&&` o una variable con nombre para una sola rama; usa una guarda en el frontmatter para las salidas tempranas.
- Mapeos sobre listas con una `key` estable cuando la lista es interactiva.
- No anides más de dos niveles de expresiones dentro del marcado. Mueve la parte interna a un componente.

### PL-AS-005 — Los estilos tienen ámbito propio {#pl-as-005--styles-are-scoped}

Usa por defecto bloques `<style>` en el componente; Astro les aplica el ámbito automáticamente. Usa `is:global` solo para reglas que afecten a todo el documento, como el reset o los tokens del tema, y mantenlas en una única hoja de estilos global.

### PL-AS-006 — Los datos tienen una única fuente {#pl-as-006--data-has-one-source}

El contenido vive en colecciones de contenido (`src/content/`) con un esquema (`defineCollection` y zod). Las páginas consultan la colección; no analizan por sí mismas los archivos Markdown. Los datos remotos se cargan en el frontmatter de la página que los necesita, una sola vez.

### PL-AS-007 — Las islas de framework siguen su propio perfil {#pl-as-007--framework-islands-follow-their-own-profile}

Una isla de React, Vue o Svelte sigue el perfil de ese framework (para React: [PL-REACT](react.md)). Astro no cambia las reglas del componente; solo decide dónde se hidrata.

### PL-AS-008 — Densidad de carpetas {#pl-as-008--folder-density}

`src/components/` contiene como máximo **10 archivos** por defecto. Agrupa los componentes por funcionalidad (`components/blog/`) en cuanto una funcionalidad tenga varios archivos.

### PL-AS-009 — Herramientas {#pl-as-009--tooling}

Ejecuta `astro check` (diagnósticos de tipos y de plantillas) y la compilación en la CI. Usa la salida de `astro build` para verificar que las páginas sin islas no envían JavaScript.
