# Style de code CSS

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil, ainsi que le [profil HTML](html.md) pour le balisage qu'il stylise. CSS est déclaratif : une règle énonce l'apparence d'un élément, pas la façon dont le navigateur doit la calculer. Pureline CSS utilise le langage moderne : propriétés personnalisées, couches de cascade, imbrication, propriétés logiques et container queries. Les utilitaires Tailwind CSS suivent les mêmes principes lorsqu'un projet les utilise.

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

### PL-CSS-001 — Des tokens avant les valeurs {#pl-css-001--tokens-before-values}

Les couleurs, les espacements, les rayons, les tailles de police et les durées sont des propriétés personnalisées déclarées une seule fois sur `:root` ou dans une portée de thème. Les composants lisent `var(--space-3)` ; ils ne répètent jamais `#22d3ee` ni `12px`.

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

### PL-CSS-002 — Les couches de cascade gouvernent l'ordre {#pl-css-002--cascade-layers-own-the-order}

Déclarez l'ordre des couches une seule fois : `@layer reset, base, components, utilities;`. Placez les règles de chaque fichier dans la couche qui correspond à leur rôle. Ne comptez ni sur l'ordre des sources ni sur `!important` pour gagner un conflit.

### PL-CSS-003 — Garder une faible spécificité {#pl-css-003--keep-specificity-low}

Stylez avec des classes simples. Ne stylez pas avec des chaînes d'éléments (`div section ul li a`) ni avec des ids. Une spécificité qui croît avec le balisage rend les modifications ultérieures coûteuses. Un sélecteur de plus de deux niveaux de profondeur est un constat de revue.

### PL-CSS-004 — Pas de `!important` hors des utilitaires {#pl-css-004--no-important-outside-utilities}

`!important` n'est permis que pour les classes utilitaires qui doivent l'emporter sur un composant, et uniquement dans la couche des utilitaires. Partout ailleurs, c'est un constat à traiter.

### PL-CSS-005 — L'imbrication reflète le composant {#pl-css-005--nesting-mirrors-the-component}

Utilisez l'imbrication CSS native pour les états et les enfants d'un seul composant (`&:hover`, `& .title`). N'imbriquez pas sur plus de deux niveaux. L'imbrication ne remplace jamais un composant distinct.

### PL-CSS-006 — Propriétés logiques et modules de mise en page {#pl-css-006--logical-properties-and-layout-modules}

Utilisez les propriétés logiques (`margin-inline`, `padding-block`, `inset-inline-start`) pour les mises en page qui doivent fonctionner dans les deux sens d'écriture. Utilisez Flexbox pour les lignes et colonnes unidimensionnelles, et Grid pour les mises en page bidimensionnelles. N'utilisez pas les floats pour la mise en page.

### PL-CSS-007 — Les règles responsives suivent le composant {#pl-css-007--responsive-rules-follow-the-component}

Préférez les container queries (`@container`) pour la mise en page propre à un composant, et les media queries pour la structure au niveau de la page. Chaque point de rupture est un token nommé, et non un littéral répété.

### PL-CSS-008 — L'ordre des propriétés est cohérent {#pl-css-008--property-order-is-consistent}

Au sein d'une règle, regroupez les propriétés dans cet ordre, avec une ligne vide entre les groupes : mise en page (`display`, position, flex/grid), boîte (taille, marge, remplissage, bordure), typographie, visuel (couleur, arrière-plan, ombre) et mouvement (transition, animation).

### PL-CSS-009 — Nommage {#pl-css-009--naming}

Les noms de classes sont en `kebab-case` et décrivent le rôle de l'élément (`session-card`, `session-card-title`), et non son apparence (`red-box`). Les noms de style BEM sont permis lorsqu'un projet les utilise déjà.

### PL-CSS-010 — Le mouvement respecte l'utilisateur {#pl-css-010--motion-respects-the-user}

Chaque animation ou transition a une alternative `@media (prefers-reduced-motion: reduce)` qui la supprime ou la raccourcit. N'animez que `transform` et `opacity`.

### PL-CSS-011 — Densité des dossiers {#pl-css-011--folder-density}

Un dossier de feuilles de style contient au maximum **10 fichiers**. Découpez par couche ou par groupe de composants, et non par type de propriété (`colors.css`, `spacing.css`).

### PL-CSS-012 — Outillage {#pl-css-012--tooling}

Exécutez en CI un linter tel que `stylelint` avec les règles du projet. Activez les règles stylelint relatives à la spécificité et à `!important`, afin que PL-CSS-003 et PL-CSS-004 soient vérifiées automatiquement.
