# CSS Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an, und das [HTML-Profil](html.md) für das Markup, das gestylt wird. CSS ist deklarativ: Eine Regel sagt, wie ein Element aussieht, nicht, wie der Browser es berechnen soll. Pureline CSS nutzt die moderne Sprache: Custom Properties, Cascade Layers, Nesting, logische Eigenschaften und Container Queries. Tailwind-CSS-Utilities folgen denselben Prinzipien, wenn ein Projekt sie verwendet.

## CSS-Profil {#css-profile}

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Tokens vor Werten {#pl-css-001--tokens-before-values}

Farben, Abstände, Radien, Schriftgrößen und Dauern sind Custom Properties, die einmal auf `:root` oder in einem Theme-Scope deklariert werden. Komponenten lesen `var(--space-3)`; sie wiederholen nie `#22d3ee` oder `12px`.

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

### PL-CSS-002 — Cascade Layers bestimmen die Reihenfolge {#pl-css-002--cascade-layers-own-the-order}

Deklariere die Reihenfolge der Layer einmalig: `@layer reset, base, components, utilities;`. Lege die Regeln jeder Datei in den Layer, der ihrer Rolle entspricht. Verlasse dich nicht auf die Quellreihenfolge oder auf `!important`, um einen Konflikt zu gewinnen.

### PL-CSS-003 — Spezifität niedrig halten {#pl-css-003--keep-specificity-low}

Style mit einzelnen Klassen. Style nicht mit Elementketten (`div section ul li a`) oder IDs. Spezifität, die mit dem Markup wächst, macht spätere Änderungen teuer. Ein Selektor, der tiefer als zwei Ebenen reicht, ist ein Review-Befund.

### PL-CSS-004 — Kein `!important` außerhalb von Utilities {#pl-css-004--no-important-outside-utilities}

`!important` ist nur für Utility-Klassen erlaubt, die eine Komponente überschreiben müssen, und nur im Utilities-Layer. Überall sonst ist es ein Befund.

### PL-CSS-005 — Nesting spiegelt die Komponente {#pl-css-005--nesting-mirrors-the-component}

Verwende natives CSS-Nesting für Zustände und Kinder einer einzelnen Komponente (`&:hover`, `& .title`). Verschachtele nicht tiefer als zwei Ebenen. Nesting ersetzt nie eine eigene Komponente.

### PL-CSS-006 — Logische Eigenschaften und Layout-Module {#pl-css-006--logical-properties-and-layout-modules}

Verwende logische Eigenschaften (`margin-inline`, `padding-block`, `inset-inline-start`) für Layouts, die in beiden Schreibrichtungen funktionieren müssen. Nutze Flexbox für eindimensionale Zeilen und Spalten und Grid für zweidimensionale Layouts. Verwende keine Floats fürs Layout.

### PL-CSS-007 — Responsive Regeln folgen der Komponente {#pl-css-007--responsive-rules-follow-the-component}

Bevorzuge Container Queries (`@container`) für das eigene Layout einer Komponente und Media Queries für die Struktur auf Seitenebene. Jeder Breakpoint ist ein benanntes Token, kein wiederholtes Literal.

### PL-CSS-008 — Die Reihenfolge der Eigenschaften ist konsistent {#pl-css-008--property-order-is-consistent}

Gruppiere die Eigenschaften innerhalb einer Regel in dieser Reihenfolge, mit einer Leerzeile zwischen den Gruppen: Layout (`display`, Position, Flex/Grid), Box (Größe, Margin, Padding, Border), Typografie, Optik (Farbe, Hintergrund, Schatten) und Bewegung (Transition, Animation).

### PL-CSS-009 — Benennung {#pl-css-009--naming}

Klassennamen sind `kebab-case` und beschreiben die Rolle des Elements (`session-card`, `session-card-title`), nicht sein Aussehen (`red-box`). Namen im BEM-Stil sind erlaubt, wenn ein Projekt sie bereits verwendet.

### PL-CSS-010 — Bewegung respektiert den Benutzer {#pl-css-010--motion-respects-the-user}

Jede Animation oder Transition hat eine Alternative mit `@media (prefers-reduced-motion: reduce)`, die sie entfernt oder verkürzt. Animiere nur `transform` und `opacity`.

### PL-CSS-011 — Ordnerdichte {#pl-css-011--folder-density}

Ein Stylesheet-Ordner enthält höchstens **10 Dateien**. Teile nach Layer oder nach Komponentengruppe auf, nicht nach Art der Eigenschaft (`colors.css`, `spacing.css`).

### PL-CSS-012 — Tooling {#pl-css-012--tooling}

Führe in der CI einen Linter wie `stylelint` mit den Regeln des Projekts aus. Aktiviere die stylelint-Regeln für Spezifität und `!important`, damit PL-CSS-003 und PL-CSS-004 automatisch geprüft werden.
