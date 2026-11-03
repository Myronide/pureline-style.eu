# CSS Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem, a dla stylizowanego markupu [profil HTML](html.md). CSS jest deklaratywny: reguła mówi, jak wygląda element, a nie jak przeglądarka ma to obliczyć. Pureline CSS korzysta z nowoczesnego języka: właściwości własnych, warstw kaskady, zagnieżdżania, właściwości logicznych i zapytań kontenerowych. Narzędzia użytkowe Tailwind CSS podlegają tym samym zasadom, gdy projekt z nich korzysta.

## Profil CSS {#css-profile}

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Tokeny przed wartościami {#pl-css-001--tokens-before-values}

Kolory, odstępy, promienie, rozmiary czcionek i czasy trwania to właściwości własne deklarowane raz na `:root` lub w zasięgu motywu. Komponenty odczytują `var(--space-3)`; nigdy nie powtarzają `#22d3ee` ani `12px`.

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

### PL-CSS-002 — Warstwy kaskady ustalają kolejność {#pl-css-002--cascade-layers-own-the-order}

Kolejność warstw deklaruj raz: `@layer reset, base, components, utilities;`. Reguły każdego pliku umieszczaj w warstwie odpowiadającej ich roli. Nie polegaj na kolejności w kodzie źródłowym ani na `!important`, by wygrać konflikt.

### PL-CSS-003 — Utrzymuj niską specyficzność {#pl-css-003--keep-specificity-low}

Stylizuj pojedynczymi klasami. Nie stylizuj łańcuchami elementów (`div section ul li a`) ani identyfikatorami. Specyficzność rosnąca wraz z markupem sprawia, że późniejsze zmiany są kosztowne. Selektor głębszy niż dwa poziomy jest uwagą w przeglądzie.

### PL-CSS-004 — Bez `!important` poza klasami użytkowymi {#pl-css-004--no-important-outside-utilities}

`!important` jest dozwolone tylko dla klas użytkowych, które muszą nadpisać komponent, i tylko w warstwie utilities. Gdziekolwiek indziej jest uwagą w przeglądzie.

### PL-CSS-005 — Zagnieżdżanie odzwierciedla komponent {#pl-css-005--nesting-mirrors-the-component}

Używaj natywnego zagnieżdżania CSS dla stanów i elementów potomnych jednego komponentu (`&:hover`, `& .title`). Nie zagnieżdżaj głębiej niż na dwa poziomy. Zagnieżdżanie nigdy nie zastępuje osobnego komponentu.

### PL-CSS-006 — Właściwości logiczne i moduły layoutu {#pl-css-006--logical-properties-and-layout-modules}

Używaj właściwości logicznych (`margin-inline`, `padding-block`, `inset-inline-start`) dla układów, które muszą działać w obu kierunkach pisma. Flexbox stosuj dla jednowymiarowych wierszy i kolumn, a Grid dla układów dwuwymiarowych. Nie używaj float do layoutu.

### PL-CSS-007 — Reguły responsywne podążają za komponentem {#pl-css-007--responsive-rules-follow-the-component}

Dla własnego układu komponentu preferuj zapytania kontenerowe (`@container`), a dla struktury na poziomie strony zapytania mediów. Każdy punkt przełamania jest nazwanym tokenem, a nie powtarzanym literałem.

### PL-CSS-008 — Kolejność właściwości jest spójna {#pl-css-008--property-order-is-consistent}

W obrębie reguły grupuj właściwości w tej kolejności, z pustą linią między grupami: układ (`display`, pozycja, flex/grid), pudełko (rozmiar, margines, padding, obramowanie), typografia, wygląd (kolor, tło, cień) i ruch (transition, animation).

### PL-CSS-009 — Nazewnictwo {#pl-css-009--naming}

Nazwy klas są w `kebab-case` i opisują rolę elementu (`session-card`, `session-card-title`), a nie jego wygląd (`red-box`). Nazwy w stylu BEM są dozwolone, gdy projekt już ich używa.

### PL-CSS-010 — Ruch szanuje użytkownika {#pl-css-010--motion-respects-the-user}

Każda animacja lub przejście ma alternatywę w `@media (prefers-reduced-motion: reduce)`, która ją usuwa lub skraca. Animuj tylko `transform` i `opacity`.

### PL-CSS-011 — Gęstość folderów {#pl-css-011--folder-density}

Folder arkuszy stylów zawiera co najwyżej **10 plików**. Dziel według warstwy lub grupy komponentów, a nie według typu właściwości (`colors.css`, `spacing.css`).

### PL-CSS-012 — Narzędzia {#pl-css-012--tooling}

W CI uruchamiaj linter, taki jak `stylelint`, z regułami projektu. Włącz reguły stylelint dotyczące specyficzności i `!important`, aby PL-CSS-003 i PL-CSS-004 były sprawdzane automatycznie.
