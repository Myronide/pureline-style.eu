# Estilo de código HTML

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil. HTML es la estructura de un documento. Pureline HTML usa **elementos semánticos**, deja la presentación en CSS y el comportamiento en JavaScript. Pureline HTML está pensado para documentos del **HTML Living Standard** y para las plantillas de framework que los producen (Astro; quedan excluidas las plantillas JSX: consulta los perfiles de los frameworks).

## Perfil de HTML {#html-profile}

### PL-HTML-001 — Usa elementos semánticos {#pl-html-001--use-semantic-elements}

Elige el elemento según el significado del contenido: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Un `<div>` o un `<span>` sirve para agrupar algo que no tiene significado propio. Un botón que realiza una acción es un `<button>`; un enlace que navega es un `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Una estructura de encabezados por página {#pl-html-002--one-heading-structure-per-page}

Una página tiene un único `<h1>`. Los encabezados siguen su nivel en orden (`h2` después de `h1`, `h3` después de `h2`) y nunca se eligen por su tamaño; el tamaño corresponde a CSS.

### PL-HTML-003 — Los atributos son mínimos y van entrecomillados {#pl-html-003--attributes-are-minimal-and-quoted}

Usa nombres de elementos y de atributos en minúsculas, comillas dobles para los valores de los atributos y no uses atributos `style` en línea ni manejadores de eventos en línea. Omite los atributos que coinciden con su valor por defecto. Mantén cortos los valores de `class` y nómbralos según su función.

### PL-HTML-004 — Los formularios tienen etiquetas {#pl-html-004--forms-have-labels}

Cada campo de entrada tiene un `<label>` visible asociado mediante `for` e `id`, o que envuelve al campo. El texto de un placeholder no es una etiqueta. Agrupa los controles relacionados con `<fieldset>` y `<legend>`.

### PL-HTML-005 — Las imágenes y los medios tienen alternativas textuales {#pl-html-005--images-and-media-have-text-alternatives}

Cada `<img>` tiene un atributo `alt`: una descripción para las imágenes informativas y un `alt=""` vacío para las decorativas. Indica `width` y `height` para evitar desplazamientos de diseño. Los vídeos proporcionan subtítulos mediante `<track>`.

### PL-HTML-006 — Mantén el comportamiento fuera del marcado {#pl-html-006--keep-behaviour-out-of-markup}

Los scripts son archivos externos cargados con `type="module"` o `defer`. No pongas en la página bloques `<script>` en línea con lógica de aplicación. La única excepción aceptada son los datos JSON en línea para un único script, marcados con `type="application/json"`.

### PL-HTML-007 — La cabecera del documento está completa {#pl-html-007--document-head-is-complete}

Cada página define `<html lang>`, un `<meta name="viewport">`, un `<title>` único y un `<meta name="description">` cuando la página es pública. Los favicons y los metadatos para redes sociales se declaran una sola vez en el layout, no se repiten en cada página.

### PL-HTML-008 — Anidamiento compacto {#pl-html-008--compact-nesting}

Mantén poco profundo el anidamiento de elementos. Cuando un bloque se anide a más de cuatro niveles, extrae un componente o un fragmento de plantilla. Pon un elemento de bloque por línea; mantén el contenido en línea en la misma línea que su texto.

### PL-HTML-009 — La validación forma parte de la compilación {#pl-html-009--validation-is-part-of-the-build}

Valida el HTML en la CI con el validador del W3C o con `html-validate`. Una advertencia por un `alt` o una etiqueta que falta es un fallo de compilación, no una sugerencia.
