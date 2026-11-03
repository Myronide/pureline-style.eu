# Estilo de código HTML

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [compartidas](../README.md#shared-rules) con este perfil. HTML es la estructura de un documento. Pureline HTML utiliza elementos **semantic**, mantiene la presentación en CSS y mantiene el comportamiento en JavaScript. Pureline HTML se dirige a documentos **HTML Living Standard** y las plantillas de marco que los producen (Astro, las plantillas JSX excluidas: ver los perfiles del marco).

## Perfil HTML

### PL-HTML-001 — Usar elementos semánticos

Elija el elemento para el significado del contenido: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Un `<div>` o `<span>` es para agrupar que no tiene significado propio. Un botón que realiza una acción es un `<button>`; un enlace que navega es un `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Estructura de un encabezado por página

Una página tiene un `<h1>`. Los encabezados siguen su nivel en orden (`h2` después de `h1`, `h3` después de `h2`) y nunca se elige para su tamaño; el tamaño pertenece a CSS.

### PL-HTML-003 — Los atributos son mínimos y se citan

Use nombres de elementos y atributos en minúsculas, comillas dobles para valores de atributos y sin atributos `style` o manejadores de eventos en línea. Omitir atributos que equivalgan a su defecto. Mantenga los valores de `class` cortos y nombrados por rol.

### PL-HTML-004 — Los formularios tienen etiquetas

Cada entrada tiene un `<label>` visible asociado con `for` y `id`, o envuelve la entrada. El texto del marcador de posición no es una etiqueta. Controles relacionados con el grupo con `<fieldset>` y `<legend>`.

### PL-HTML-005 — Imágenes y medios tienen alternativas de texto

Cada `<img>` tiene un atributo `alt`: una descripción para imágenes informativas, un `alt=""` vacío para las decorativas. Dé `width` y `height` para evitar el cambio de diseño. Los vídeos proporcionan subtítulos a través de `<track>`.

### PL-HTML-006: Mantener el comportamiento fuera del margen de riesgo

Los scripts son archivos externos cargados con `type="module"` o `defer`. No coloques en línea los bloques `<script>` con la lógica de aplicación en la página. Los datos en línea de JSON para un único script es la única excepción aceptada, marcada con `type="application/json"`.

### PL-HTML-007 — El jefe del documento está completo

Cada página establece `<html lang>`, un `<meta name="viewport">`, un `<title>` único y un `<meta name="description">` cuando la página es pública. Los favicones y los metadatos sociales se declaran una vez en el diseño, no se repiten por página.

### PL-HTML-008 — Anidación compacta

Mantenga el elemento anidando poco profundo. Cuando un bloque anida más de cuatro niveles de profundidad, extraiga un componente o un fragmento de plantilla. Ponga un elemento de bloque por línea; mantenga el contenido de fraseado en línea en la misma línea que su texto.

### PL-HTML-009 — La validación es parte de la construcción

Validar HTML en CI con el validador W3C o `html-validate`. Una advertencia sobre un `alt` o etiqueta que falta es un fallo de construcción, no una sugerencia.
