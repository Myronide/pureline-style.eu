# CSS Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile, and the [HTML profile](html.md) for the markup it styles. CSS is declarative: a rule states what an element looks like, not how the browser should compute it. Pureline CSS utilizza il linguaggio moderno: proprietà personalizzate, strati a cascata, nidificazione, proprietà logiche e query dei container. Tailwind CSS utilities follow the same principles when a project uses them.

## Profilo CSS

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001. Token prima dei valori

Colours, spacing, radii, font sizes, and durations are custom properties declared once on `:root` or in a theme scope. Components read `var(--space-3)`; they never repeat `#22d3ee` or `12px`.

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

### PL-CSS-002. I livelli di cascata possiedono l'ordine..

Declare the order of layers once: `@layer reset, base, components, utilities;`. Put each file's rules into the layer that matches their role. Do not rely on source order or on `!important` to win a conflict.

### PL-CSS-003 — Keep Specificity Low

Style with single classes. Do not style with element chains (`div section ul li a`) or ids. Specificity that grows with the markup makes later changes expensive. A selector deeper than two levels is a review finding.

### PL-CSS-004 — No `!important` Outside Utilities

`!important` is allowed only for utility classes that must override a component, and only in the utilities layer. Anywhere else it is a finding.

### PL-CSS-005. Nesting Mirrors il componente il il il '.

Use native CSS nesting for states and children of one component (`&:hover`, `& .title`). Do not nest more than two levels. Nesting never replaces a separate component.

### PL-CSS-006 — Logical Properties and Layout Modules

Usare proprietà logiche (`margin-inline`, `padding-block`, `inset-inline-start`) per layout che devono funzionare in entrambe le direzioni di scrittura. Utilizzare Flexbox per righe e colonne monodimensionali e Griglia per layout bidimensionali. Do not use floats for layout.

### PL-CSS-007. Regole di risposta Seguire il componente

Preferisci le query dei container (`@container`) per il layout di un componente e le query dei media per la struttura a livello di pagina. Each breakpoint is a named token, not a repeated literal.

### PL-CSS-008. L'ordine di proprietà è coerente

All'interno di una regola, le proprietà di gruppo in questo ordine con una linea vuota tra i gruppi: layout (`display`, position, flex/grid), box (size, margin, padding, border), typography, visual (colour, background, shadow), and motion (transition, animation).

### PL-CSS-009. Naming

Class names are `kebab-case` and describe the role of the element (`session-card`, `session-card-title`), not its appearance (`red-box`). BEM-style names are allowed when a project already uses them.

### PL-CSS-010. Motion rispetta l'utentenexe.

Every animation or transition has a `@media (prefers-reduced-motion: reduce)` alternative that removes or shortens it. Animate `transform` and `opacity` only.

### Densità della cartella PL-CSS-011

A stylesheet folder holds at most **10 files**. Split by layer or by component group, not by property type (`colors.css`, `spacing.css`).

### PL-CSS-012. Troppo,, p.., p...

Run a linter such as `stylelint` with the project's rules in CI. Enable the stylelint rules for specificity and `!important`, so that PL-CSS-003 and PL-CSS-004 are checked automatically.
