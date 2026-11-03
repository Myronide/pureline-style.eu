# Estilo de código CSS

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil, y el [perfil de HTML](html.md) para el marcado al que da estilo. CSS es declarativo: una regla indica cómo se ve un elemento, no cómo debe calcularlo el navegador. Pureline CSS usa el lenguaje moderno: propiedades personalizadas, capas de cascada, anidamiento, propiedades lógicas y container queries. Las utilidades de Tailwind CSS siguen los mismos principios cuando un proyecto las usa.

## Perfil de CSS {#css-profile}

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Tokens antes que valores {#pl-css-001--tokens-before-values}

Los colores, los espaciados, los radios, los tamaños de fuente y las duraciones son propiedades personalizadas declaradas una sola vez en `:root` o en un ámbito de tema. Los componentes leen `var(--space-3)`; nunca repiten `#22d3ee` ni `12px`.

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

### PL-CSS-002 — Las capas de cascada controlan el orden {#pl-css-002--cascade-layers-own-the-order}

Declara el orden de las capas una sola vez: `@layer reset, base, components, utilities;`. Pon las reglas de cada archivo en la capa que corresponda a su función. No dependas del orden del código fuente ni de `!important` para ganar un conflicto.

### PL-CSS-003 — Mantén baja la especificidad {#pl-css-003--keep-specificity-low}

Aplica estilos con clases sencillas. No uses cadenas de elementos (`div section ul li a`) ni ids. Una especificidad que crece con el marcado encarece los cambios posteriores. Un selector con más de dos niveles de profundidad es un hallazgo de revisión.

### PL-CSS-004 — Sin `!important` fuera de las utilidades {#pl-css-004--no-important-outside-utilities}

`!important` solo se permite en las clases de utilidad que deban sobrescribir un componente, y únicamente en la capa de utilidades. En cualquier otro lugar es un hallazgo.

### PL-CSS-005 — El anidamiento refleja el componente {#pl-css-005--nesting-mirrors-the-component}

Usa el anidamiento nativo de CSS para los estados y los hijos de un único componente (`&:hover`, `& .title`). No anides más de dos niveles. El anidamiento nunca sustituye a un componente separado.

### PL-CSS-006 — Propiedades lógicas y módulos de layout {#pl-css-006--logical-properties-and-layout-modules}

Usa propiedades lógicas (`margin-inline`, `padding-block`, `inset-inline-start`) para los layouts que deban funcionar en ambas direcciones de escritura. Usa Flexbox para filas y columnas unidimensionales, y Grid para los layouts bidimensionales. No uses floats para el layout.

### PL-CSS-007 — Las reglas responsivas siguen al componente {#pl-css-007--responsive-rules-follow-the-component}

Prefiere las container queries (`@container`) para el layout propio de un componente, y las media queries para la estructura a nivel de página. Cada punto de corte es un token con nombre, no un literal repetido.

### PL-CSS-008 — El orden de las propiedades es coherente {#pl-css-008--property-order-is-consistent}

Dentro de una regla, agrupa las propiedades en este orden, con una línea en blanco entre grupos: layout (`display`, posición, flex/grid), caja (tamaño, margen, relleno, borde), tipografía, aspecto visual (color, fondo, sombra) y movimiento (transición, animación).

### PL-CSS-009 — Nombres {#pl-css-009--naming}

Los nombres de clase usan `kebab-case` y describen la función del elemento (`session-card`, `session-card-title`), no su aspecto (`red-box`). Se permiten los nombres al estilo BEM cuando un proyecto ya los usa.

### PL-CSS-010 — El movimiento respeta al usuario {#pl-css-010--motion-respects-the-user}

Toda animación o transición tiene una alternativa `@media (prefers-reduced-motion: reduce)` que la elimina o la acorta. Anima solo `transform` y `opacity`.

### PL-CSS-011 — Densidad de carpetas {#pl-css-011--folder-density}

Una carpeta de hojas de estilo contiene como máximo **10 archivos**. Divide por capa o por grupo de componentes, no por tipo de propiedad (`colors.css`, `spacing.css`).

### PL-CSS-012 — Herramientas {#pl-css-012--tooling}

Ejecuta en la CI un linter como `stylelint` con las reglas del proyecto. Activa las reglas de stylelint sobre la especificidad y `!important`, de modo que PL-CSS-003 y PL-CSS-004 se comprueben automáticamente.
