# Style de code Astro

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil, ainsi que le [profil TypeScript](typescript.md) pour le script du frontmatter. Astro rend le HTML côté serveur ou au moment du build et n'envoie du JavaScript que là où il est nécessaire. Pureline Astro garde ce modèle visible : statique par défaut, interactif là où c'est déclaré. Pureline est compatible avec Astro 5 et les versions ultérieures.

## Profil Astro {#astro-profile}

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Les composants sont des fichiers `.astro` nommés en `PascalCase` {#pl-as-001--components-are-astro-files-named-in-pascalcase}

Un composant se trouve dans `src/components/` et porte le nom de ce qu'il rend (`SessionCard.astro`). Une page ou un layout se trouve dans `src/pages/` ou `src/layouts/`. Les fichiers de route restent minces : ils chargent les données et composent les composants.

### PL-AS-002 — Le frontmatter est linéaire et typé {#pl-as-002--frontmatter-is-linear-and-typed}

Le frontmatter (entre les clôtures `---`) fait quatre choses dans l'ordre : recevoir des props typées, charger les données, calculer les valeurs dérivées, puis rendre. Déclarez les props avec une `interface Props`. Gardez le frontmatter exempt de balisage.

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

### PL-AS-003 — Statique par défaut, îlots par déclaration {#pl-as-003--static-by-default-islands-by-declaration}

Rendez le HTML sans JavaScript, sauf si le composant doit réagir à l'utilisateur ou évoluer dans le temps. Dans ce cas, marquez l'unique composant interactif avec une directive client explicite : `client:visible` pour le contenu sous la ligne de flottaison, `client:idle` pour les widgets non urgents, `client:load` uniquement pour ce qui est nécessaire au premier affichage. Un composant sans directive n'envoie jamais de JavaScript.

### PL-AS-004 — Les templates restent lisibles {#pl-as-004--templates-stay-readable}

- Utilisez des conditions avec `&&` ou une variable nommée pour une seule branche ; utilisez un guard dans le frontmatter pour les sorties anticipées.
- Utilisez des maps sur les listes avec une `key` stable lorsque la liste est interactive.
- N'imbriquez pas plus de deux niveaux d'expression dans le balisage. Déplacez la partie interne dans un composant.

### PL-AS-005 — Les styles ont une portée limitée {#pl-as-005--styles-are-scoped}

Utilisez par défaut des blocs `<style>` dans le composant ; Astro leur donne automatiquement une portée limitée. N'utilisez `is:global` que pour les règles valables pour tout le document, comme le reset ou les tokens de thème, et gardez-les dans une seule feuille de style globale.

### PL-AS-006 — Les données ont une seule source {#pl-as-006--data-has-one-source}

Le contenu vit dans des collections de contenu (`src/content/`) avec un schéma (`defineCollection` et zod). Les pages interrogent la collection ; elles n'analysent pas elles-mêmes les fichiers Markdown. Les données distantes sont chargées une seule fois, dans le frontmatter de la page qui en a besoin.

### PL-AS-007 — Les îlots de framework suivent leur propre profil {#pl-as-007--framework-islands-follow-their-own-profile}

Un îlot React, Vue ou Svelte suit le profil de ce framework (pour React : [PL-REACT](react.md)). Astro ne change pas les règles du composant ; il décide seulement de l'endroit où le composant est hydraté.

### PL-AS-008 — Densité des dossiers {#pl-as-008--folder-density}

`src/components/` contient au maximum **10 fichiers** par défaut. Regroupez les composants par fonctionnalité (`components/blog/`) dès qu'une fonctionnalité comporte plusieurs fichiers.

### PL-AS-009 — Outillage {#pl-as-009--tooling}

Exécutez `astro check` (types et diagnostics de templates) et le build en CI. Utilisez la sortie de `astro build` pour vérifier que les pages sans îlots n'envoient aucun JavaScript.
