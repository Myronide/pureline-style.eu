# Stile del codice CSS

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo e il [profilo HTML](html.md) per il markup che stilizza. CSS è dichiarativo: una regola dice che aspetto ha un elemento, non come il browser debba calcolarlo. Pureline CSS usa il linguaggio moderno: proprietà personalizzate, cascade layer, nesting, proprietà logiche e container query. Le utility di Tailwind CSS seguono gli stessi principi quando un progetto le usa.

## Profilo CSS {#css-profile}

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — I token prima dei valori {#pl-css-001--tokens-before-values}

Colori, spaziature, raggi, dimensioni dei font e durate sono proprietà personalizzate dichiarate una sola volta su `:root` o in un ambito di tema. I componenti leggono `var(--space-3)`; non ripetono mai `#22d3ee` o `12px`.

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

### PL-CSS-002 — I cascade layer governano l'ordine {#pl-css-002--cascade-layers-own-the-order}

Dichiara una sola volta l'ordine dei layer: `@layer reset, base, components, utilities;`. Metti le regole di ogni file nel layer che corrisponde al loro ruolo. Non fare affidamento sull'ordine del sorgente né su `!important` per vincere un conflitto.

### PL-CSS-003 — Mantenere bassa la specificità {#pl-css-003--keep-specificity-low}

Stilizza con singole classi. Non stilizzare con catene di elementi (`div section ul li a`) né con gli id. Una specificità che cresce insieme al markup rende costose le modifiche successive. Un selettore più profondo di due livelli è un rilievo di revisione.

### PL-CSS-004 — Niente `!important` fuori dalle utility {#pl-css-004--no-important-outside-utilities}

`!important` è ammesso solo per le classi di utilità che devono sovrascrivere un componente, e solo nel layer delle utility. In qualsiasi altro punto è un rilievo.

### PL-CSS-005 — Il nesting rispecchia il componente {#pl-css-005--nesting-mirrors-the-component}

Usa il nesting nativo del CSS per gli stati e i figli di un solo componente (`&:hover`, `& .title`). Non annidare più di due livelli. Il nesting non sostituisce mai un componente separato.

### PL-CSS-006 — Proprietà logiche e moduli di layout {#pl-css-006--logical-properties-and-layout-modules}

Usa le proprietà logiche (`margin-inline`, `padding-block`, `inset-inline-start`) per i layout che devono funzionare in entrambe le direzioni di scrittura. Usa Flexbox per righe e colonne monodimensionali e Grid per i layout bidimensionali. Non usare i float per il layout.

### PL-CSS-007 — Le regole responsive seguono il componente {#pl-css-007--responsive-rules-follow-the-component}

Preferisci le container query (`@container`) per il layout proprio di un componente e le media query per la struttura a livello di pagina. Ogni breakpoint è un token con nome, non un letterale ripetuto.

### PL-CSS-008 — L'ordine delle proprietà è coerente {#pl-css-008--property-order-is-consistent}

All'interno di una regola, raggruppa le proprietà in quest'ordine, con una riga vuota tra i gruppi: layout (`display`, posizione, flex/grid), box (dimensione, margin, padding, bordo), tipografia, aspetto visivo (colore, sfondo, ombra) e movimento (transition, animation).

### PL-CSS-009 — Nomi {#pl-css-009--naming}

I nomi delle classi sono in `kebab-case` e descrivono il ruolo dell'elemento (`session-card`, `session-card-title`), non il suo aspetto (`red-box`). I nomi in stile BEM sono ammessi quando un progetto li usa già.

### PL-CSS-010 — Il movimento rispetta l'utente {#pl-css-010--motion-respects-the-user}

Ogni animazione o transizione ha un'alternativa `@media (prefers-reduced-motion: reduce)` che la rimuove o la accorcia. Anima solo `transform` e `opacity`.

### PL-CSS-011 — Densità delle cartelle {#pl-css-011--folder-density}

Una cartella di fogli di stile contiene al massimo **10 file**. Dividi per layer o per gruppo di componenti, non per tipo di proprietà (`colors.css`, `spacing.css`).

### PL-CSS-012 — Strumenti {#pl-css-012--tooling}

Esegui nella CI un linter come `stylelint` con le regole del progetto. Abilita le regole di stylelint per la specificità e per `!important`, così PL-CSS-003 e PL-CSS-004 vengono controllate automaticamente.
