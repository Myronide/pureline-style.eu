# Style de code Astro

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil, et le [Profil de TypeScript](typescript.md) pour le script frontmater. Astro rend HTML sur le serveur ou à l'heure de la construction et ne livre JavaScript que là où il est nécessaire. Pureline Astro garde ce modèle visible: statique par défaut, interactif où déclaré. Pureline est compatible avec Astro 5 et plus tard.

## Profil d'astro

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Les composants sont des fichiers `.astro` nommés dans `PascalCase`

Un composant vit dans `src/components/` et est nommé d'après ce qu'il rend (`SessionCard.astro`). Une page ou une mise en page vit en `src/pages/` ou `src/layouts/`. Les fichiers de parcours restent minces & #160;: ils chargent les données et composent des composants.

### PL-AS-002 — La matière première est linéaire et tapée

La matière première (entre clôtures `---`) fait quatre choses dans l'ordre : recevoir les accessoires dactylographiés, charger les données, calculer les valeurs dérivées, puis rendre. Déclarez les accessoires avec un `interface Props`. Gardez la matière première exempte de balisage.

```astro
---
interface Props {
    title: string;
    draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
    return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
```

### PL-AS-003 — Static par défaut, Îles par déclaration

Rendu HTML sans JavaScript à moins que le composant ne doive répondre à l'utilisateur ou changer au fil du temps. Quand il faut, marquer le composant interactif avec une directive explicite sur les clients: `client:visible` pour le contenu sous le pli, `client:idle` pour les widgets non-urgents, `client:load` seulement pour ce qui est nécessaire au début de la peinture. Un composant sans directive ne peut jamais être livré JavaScript.

### PL-AS-004 — Les modèles restent lisibles

- Conditionnels avec `&&` ou une variable nommée pour une seule branche; utiliser un garde dans la matière avant pour les sorties précoces.
- Cartes sur les listes avec un `key` stable lorsque la liste est interactive.
- Ne pas nier plus de deux niveaux d'expression à l'intérieur du balisage. Déplacer la partie intérieure vers un composant.

Gardez une expression de formatage courte dans le modèle quand il est utilisé une fois
et lit clairement au point d'utilisation.

```text
Named frontmatter value                         │ ✓ Pureline
---                                             │ ---
const { title } = Astro.props;                  │ const { title } = Astro.props;
const displayTitle = title.trim() || "Profil";  │ ---
---                                             │
                                                │ <h1>{title.trim() || "Profil"}</h1>
<h1>{displayTitle}</h1>                         │
```

### PL-AS-005 — Les styles sont éparpillés

Utilisez les blocs `<style>` dans le composant par défaut ; Astro les exécute automatiquement. Utilisez `is:global` uniquement pour les règles à l'échelle du document telles que les jetons réinitialisants ou thématiques, et conservez-les dans une feuille de style globale.

### PL-AS-006 — Les données ont une source unique

Le contenu vit dans les collections de contenu (`src/content/`) avec un schéma (`defineCollection` et zod). Les pages interrogent la collection; elles n'analysent pas les fichiers Markdown eux-mêmes. Les données distantes sont chargées dans la partie avant de la page qui en a besoin, une fois.

### PL-AS-007 — Les îles-cadres suivent leur propre profil

Une île de React, de Vue ou de Svelte suit le profil de ce cadre (pour React : [PL-REACT](react.md)). Astro ne modifie pas les règles du composant; il décide seulement où le composant est hydraté.

### PL-AS-008 — Densité du dossier

`src/components/` détient au plus les fichiers **10** par défaut. Grouper les composants par fonction (`components/blog/`) une fois qu'une fonctionnalité a plusieurs fichiers.

### PL-AS-009 — Outillage

Exécutez `astro check` (types et modèles de diagnostic) et la construction dans CI. Utilisez la sortie `astro build` pour vérifier que les pages sans îles ne envoient pas de JavaScript.
