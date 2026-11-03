# CSS-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) mit diesem Profil an, und das [HTML profile](html.md) für die Markup-Stile. CSS ist deklarativ: eine Regel sagt, wie ein Element aussieht, nicht wie der Browser es berechnen sollte. Pureline CSS verwendet die moderne Sprache: Benutzerdefinierte Eigenschaften, Kaskadenschichten, Nesting, logische Eigenschaften und Containerabfragen. Tailwind CSS-Dienstprogramme folgen den gleichen Prinzipien, wenn ein Projekt sie verwendet.

## CSS-Profil

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Zeichen vor Werten

Farben, Abstand, Radien, Schriftgrößen und Dauern sind benutzerdefinierte Eigenschaften, die einmal auf `:root` oder in einem Themenbereich deklariert werden. Komponenten lesen `var(--space-3)`; sie wiederholen niemals `#22d3ee` oder `12px`.

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

### PL-CSS-002 — Cascade Layers Own the Order

Declare the order of layers once: `@layer reset, base, components, utilities;`. Put each file's rules into the layer that matches their role. Do not rely on source order or on `!important` to win a conflict.

### PL-CSS-003 — Keep Specificity Low

Style with single classes. Do not style with element chains (`div section ul li a`) or ids. Specificity that grows with the markup makes later changes expensive. A selector deeper than two levels is a review finding.

### PL-CSS-004 — No `!important` Outside Utilities

`!important` is allowed only for utility classes that must override a component, and only in the utilities layer. Anywhere else it is a finding.

### PL-CSS-005 — Nesting Mirrors the Component

Use native CSS nesting for states and children of one component (`&:hover`, `& .title`). Do not nest more than two levels. Nesting never replaces a separate component.

### PL-CSS-006 — Logische Eigenschaften und Layoutmodule

Verwenden Sie logische Eigenschaften (`margin-inline`, `padding-block`, `inset-inline-start`) für Layouts, die in beiden Schreibrichtungen funktionieren müssen. Verwenden Sie Flexbox für eindimensionale Reihen und Spalten und Grid für zweidimensionale Layouts. Verwenden Sie keine Schwimmer für das Layout.

### PL-CSS-007 — Responsive Regeln folgen der Komponente

Bevorzugen Sie Containerabfragen (`@container`) für das eigene Layout einer Komponente und Medienabfragen für die Seitenstruktur. Jeder Haltepunkt ist ein benanntes Zeichen, nicht ein wiederholtes Wort.

### PL-CSS-008 — Die Verfügung über das Eigentum ist konsequent

In einer Regel gruppieren Sie Eigenschaften in dieser Reihenfolge mit einer Leerzeile zwischen Gruppen: Layout (`display`, Position, Flex/Grid), Box (Größe, Rand, Polsterung, Rand), Typografie, Bild (Farbe, Hintergrund, Schatten) und Bewegung (Übergang, Animation).

### PL-CSS-009 — Benennung

Klassennamen sind `kebab-case` und beschreiben die Rolle des Elements (`session-card`, `session-card-title`), nicht sein Aussehen (`red-box`). BEM-Namen sind zulässig, wenn ein Projekt sie bereits verwendet.

### PL-CSS-010 — Bewegung respektiert den Benutzer

Jede Animation oder Übergänge hat eine `@media (prefers-reduced-motion: reduce)`-Alternative, die sie entfernt oder verkürzt. Nur `transform` und `opacity` animieren.

### PL-CSS-011 — Ordnerdichte

Ein Stylesheet-Ordner enthält höchstens **10 Dateien**. Aufteilen nach Schicht oder nach Komponentengruppe, nicht nach Eigenschaftstyp (`colors.css`, `spacing.css`).

### PL-CSS-012 — Werkzeugbau

Führen Sie eine Interinter wie `stylelint` mit den Regeln des Projekts in CI. Aktivieren Sie die Stylelint-Regeln für Spezifität und `!important`, so dass PL-CSS-003 und PL-CSS-004 automatisch überprüft werden.
