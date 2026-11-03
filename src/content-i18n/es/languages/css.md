# Estilo de código CSS

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [core compartido](../README.md#shared-rules) con este perfil, y el [filis HTML](html.md) para el marcado que le da. El CSS es de carácter declarativo: una regla establece lo que un elemento parece, no cómo el navegador debe calcularlo. Pureline CSS utiliza el lenguaje moderno: propiedades personalizadas, capas en cascada, nidos, propiedades lógicas y consultas de contenedores. Las utilidades CSS de Tailwind siguen los mismos principios cuando un proyecto las utiliza.

## Perfil CSS

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Tokens Before Values

Los colores, el espaciado, los radios, los tamaños de fuentes y las duraciones son propiedades personalizadas declaradas una vez en `:root` o en un ámbito temático. Los componentes leen `var(--space-3)`; nunca repiten `#22d3ee` o `12px`.

```css
:root {
  --color-accent: #22d3ee;
  --space-3: 0.75rem;
}

.badge {
  color: var(--color-accent);
  padding: var(--space-3);
}
```

### PL-CSS-002 — Capas de cascadas son propietarias de la orden

Declarar el orden de las capas una vez: `@layer reset, base, components, utilities;`. Ponga las reglas de cada archivo en la capa que coincida con su papel. No confíe en el orden fuente o en `!important` para ganar un conflicto.

### PL-CSS-003: mantener baja la especificidad

Estilo con clases individuales.. No teclee con cadenas de elementos (`div section ul li a`) o ids. La especificidad que crece con el margen de beneficio hace que los cambios posteriores sean caros. Un selector más profundo que dos niveles es un hallazgo de revisión.

### PL-CSS-004 — No `!important` fuera de los servicios públicos

`!important` está permitido sólo para las clases de utilidad que deben anular un componente, y sólo en la capa de utilidades. En cualquier otro lugar es un hallazgo.

### PL-CSS-005 — Anidación refleja el componente

Utilice la anidación CSS nativa para estados y niños de un componente (`&:hover`, `& .title`). No anidar más de dos niveles. La anidación nunca reemplaza un componente separado.

### PL-CSS-006 — Propiedades lógicas y módulos de disposición

Utilice las propiedades lógicas (`margin-inline`, `padding-block`, `inset-inline-start`) para diseños que deben funcionar en ambas direcciones de escritura. Utilice Flexbox para filas y columnas unidimensionales, y Grid para diseños bidimensionales. No utilice flotadores para la distribución.

### PL-CSS-007 — Reglas de respuesta Siga el componente

Prefiere consultas de contenedor (`@container`) para el diseño propio de un componente, y consultas de medios para la estructura de nivel de página. Cada punto de ruptura es un símbolo llamado, no un literal repetido.

### PL-CSS-008 — La orden de propiedad es consistente

Dentro de una regla, las propiedades de grupo en este orden con una línea en blanco entre los grupos: diseño (`display`, posición, flex/grid), caja (tamaño, margen, relleno, borde), tipografía, visual (color, fondo, sombra), y movimiento (transición, animación).

### PL-CSS-009 — Denominación

Los nombres de clase son `kebab-case` y describen el papel del elemento (`session-card`, `session-card-title`), no su apariencia (`red-box`). Se permiten nombres de estilo BEM cuando un proyecto ya los utiliza.

### PL-CSS-010 — Moción respeta al usuario

Cada animación o transición tiene una alternativa `@media (prefers-reduced-motion: reduce)` que lo elimina o acorta. Únicamente para la edición `transform` y `opacity`.

### PL-CSS-011 — Densidad de la carpeta

Una carpeta de hoja de estilo contiene como máximo archivos **10**. Dividir por capa o por grupo de componentes, no por tipo de propiedad (`colors.css`, `spacing.css`).

### PL-CSS-012 — Herramientas

Ejecute un linter como `stylelint` con las reglas del proyecto en CI. Habilitar las reglas de estilolint para la especificidad y `!important`, de modo que PL-CSS-003 y PL-CSS-004 se comprueban automáticamente.
