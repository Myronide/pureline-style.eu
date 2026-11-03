# Style de code HTML

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. HTML est la structure d'un document. Pureline HTML utilise des **éléments sémantiques**, garde la présentation dans le CSS et le comportement dans le JavaScript. Pureline HTML cible les documents conformes au **HTML Living Standard** et les templates de framework qui les produisent (Astro ; les templates JSX sont exclus : voir les profils de frameworks).

## Profil HTML {#html-profile}

### PL-HTML-001 — Utiliser des éléments sémantiques {#pl-html-001--use-semantic-elements}

Choisissez l'élément d'après la signification du contenu : `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Un `<div>` ou un `<span>` sert à regrouper ce qui n'a pas de signification propre. Un bouton qui exécute une action est un `<button>` ; un lien qui navigue est un `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Une seule structure de titres par page {#pl-html-002--one-heading-structure-per-page}

Une page a un seul `<h1>`. Les titres suivent leur niveau dans l'ordre (`h2` après `h1`, `h3` après `h2`) et ne sont jamais choisis pour leur taille ; la taille relève du CSS.

### PL-HTML-003 — Les attributs sont minimaux et entre guillemets {#pl-html-003--attributes-are-minimal-and-quoted}

Utilisez des noms d'éléments et d'attributs en minuscules, des guillemets doubles pour les valeurs d'attributs, et aucun attribut `style` en ligne ni gestionnaire d'événements en ligne. Omettez les attributs égaux à leur valeur par défaut. Gardez les valeurs de `class` courtes et nommées d'après le rôle.

### PL-HTML-004 — Les formulaires ont des étiquettes {#pl-html-004--forms-have-labels}

Chaque champ a un `<label>` visible, associé par `for` et `id`, ou qui enveloppe le champ. Le texte indicatif (placeholder) n'est pas une étiquette. Regroupez les contrôles liés avec `<fieldset>` et `<legend>`.

### PL-HTML-005 — Les images et les médias ont des alternatives textuelles {#pl-html-005--images-and-media-have-text-alternatives}

Chaque `<img>` a un attribut `alt` : une description pour les images informatives, un `alt=""` vide pour les images décoratives. Donnez `width` et `height` pour éviter les décalages de mise en page. Les vidéos fournissent des sous-titres via `<track>`.

### PL-HTML-006 — Garder le comportement hors du balisage {#pl-html-006--keep-behaviour-out-of-markup}

Les scripts sont des fichiers externes chargés avec `type="module"` ou `defer`. Ne placez pas dans la page de blocs `<script>` en ligne contenant de la logique applicative. Les données JSON en ligne destinées à un seul script constituent la seule exception acceptée, marquée avec `type="application/json"`.

### PL-HTML-007 — L'en-tête du document est complet {#pl-html-007--document-head-is-complete}

Chaque page définit `<html lang>`, un `<meta name="viewport">`, un `<title>` unique, et un `<meta name="description">` lorsque la page est publique. Les favicons et les métadonnées sociales sont déclarés une seule fois dans le layout, et non répétés page par page.

### PL-HTML-008 — Imbrication compacte {#pl-html-008--compact-nesting}

Gardez l'imbrication des éléments peu profonde. Lorsqu'un bloc s'imbrique sur plus de quatre niveaux, extrayez un composant ou un fragment de template. Placez un élément de type bloc par ligne ; gardez le contenu de phrasé en ligne sur la même ligne que son texte.

### PL-HTML-009 — La validation fait partie du build {#pl-html-009--validation-is-part-of-the-build}

Validez le HTML en CI avec le validateur W3C ou `html-validate`. Un avertissement concernant un `alt` ou une étiquette manquants est un échec du build, pas une suggestion.
