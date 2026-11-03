# Style de code CSS

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil, et le [Profil HTML](html.md) pour les styles de balisage. CSS est déclaratif : Une règle indique à quoi ressemble un élément, pas comment le navigateur devrait le calculer. Pureline CSS utilise la langue moderne: propriétés personnalisées, cascades, nichoirs, propriétés logiques et requêtes de conteneurs. Les utilitaires CSS Tailwind suivent les mêmes principes lorsqu'un projet les utilise.

## Profil CSS

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

### PL-CSS-001 — Les jetons avant les valeurs

Les couleurs, l'espacement, les rayons, les tailles de police et les durées sont des propriétés personnalisées déclarées une fois sur `:root` ou dans une portée thématique. Les composants lisent `var(--space-3)`; ils ne répètent jamais `#22d3ee` ou `12px`.

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

### PL-CSS-002 — Les couches de cascade possèdent l'ordre

Déclarez l'ordre des calques une fois: `@layer reset, base, components, utilities;`. Mettez les règles de chaque fichier dans la couche qui correspond à leur rôle. Ne comptez pas sur l'ordre de source ou sur `!important` pour gagner un conflit.

### PL-CSS-003 — Maintenir la spécificité faible

Style avec des cours simples. Ne pas styler avec les chaînes d'éléments (`div section ul li a`) ou les ids. La spécificité qui se développe avec le balisage rend les changements plus coûteux. Un sélecteur plus profond que deux niveaux est une constatation d'examen.

### PL-CSS-004 — Non `!important` Services publics extérieurs

`!important` est autorisé uniquement pour les classes d'utilité qui doivent remplacer un composant, et seulement dans la couche d'utilité. N'importe où ailleurs c'est une découverte.

### PL-CSS-005 — Miroirs de nidification du composant

Utiliser la nidification CSS native pour les états et les enfants d'un seul composant (`&:hover`, `& .title`). Ne niez pas plus de deux niveaux. Niding ne remplace jamais un composant distinct.

### PL-CSS-006 — Propriétés logiques et modules de mise en page

Utilisez des propriétés logiques (`margin-inline`, `padding-block`, `inset-inline-start`) pour les mises en page qui doivent fonctionner dans les deux directions d'écriture. Utilisez Flexbox pour les lignes et colonnes unidimensionnelles, et Grid pour les mises en page bidimensionnelles. Ne pas utiliser de flotteurs pour la mise en page.

### PL-CSS-007 — Règles de réponse Suivez l'élément

Préférez les requêtes de conteneur (`@container`) pour la mise en page d'un composant et les requêtes médias pour la structure de niveau page. Chaque point d'arrêt est un jeton nommé, et non un jeton littéral répété.

### PL-CSS-008 — L'ordre de propriété est cohérent

Dans une règle, les propriétés de groupe dans cet ordre avec une ligne vide entre les groupes: mise en page (`display`, position, flex/grid), boîte (taille, marge, rembourrage, bordure), typographie, visuel (couleur, fond, ombre) et mouvement (transition, animation).

### PL-CSS-009 — Désignation

Les noms de classes sont `kebab-case` et décrivent le rôle de l'élément (`session-card`, `session-card-title`), et non son apparence (`red-box`). Les noms de type BEM sont autorisés lorsqu'un projet les utilise déjà.

### PL-CSS-010 — Motion respecte l'utilisateur

Chaque animation ou transition a une alternative `@media (prefers-reduced-motion: reduce)` qui supprime ou raccourcit la version. Animer `transform` et `opacity` seulement.

### PL-CSS-011 — Densité du dossier

Un dossier de feuille de style contient au plus des fichiers **10**. Séparer par couche ou par groupe de composants, non par type de propriété (`colors.css`, `spacing.css`).

### PL-CSS-012 — Outillage

Lancez un linter comme `stylelint` avec les règles du projet en CI. Activer les règles de stylelint pour la spécificité et `!important`, de sorte que PL-CSS-003 et PL-CSS-004 soient cochés automatiquement.
