# Style de code HTML

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. HTML est la structure d'un document. Pureline HTML utilise **éléments sémantiques**, maintient la présentation dans CSS et maintient le comportement dans JavaScript. Pureline HTML cible les documents **HTML Living Standard** et les modèles de cadre qui les produisent (Astro, modèles JSX exclus : Voir les profils de cadre).

## Profil HTML

### PL-HTML-001 — Utiliser des éléments sémantiques

Choisissez l'élément pour la signification du contenu : `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Un `<div>` ou `<span>` est destiné au regroupement qui n'a pas de sens propre. Un bouton qui effectue une action est un `<button>`; un lien qui navigue est un `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

### PL-HTML-002 — Une structure de cap par page

Une page a une `<h1>`. Les caps suivent leur niveau dans l'ordre (`h2` après `h1`, `h3` après `h2`) et ne sont jamais choisis pour leur taille ; la taille appartient à CSS.

### PL-HTML-003 — Les attributs sont minimes et cités

Utilisez des noms d'éléments et d'attributs minuscules, une double estimation pour les valeurs d'attributs et aucun attribut `style` inline ou gestionnaire d'événements inline. Omit attributs qui égalent leur par défaut. Gardez les valeurs `class` courtes et nommées par rôle.

### PL-HTML-004 — Formulaires ayant des étiquettes

Chaque entrée a un `<label>` visible associé à `for` et `id`, ou enveloppe l'entrée. Le texte de placement n'est pas une étiquette. Contrôles liés au groupe avec `<fieldset>` et `<legend>`.

Prefer a wrapping label when the label text and input belong together in
the markup. Use an explicit `for` and `id` association when they need to be
separate.

```text
Explicit association                        │ ✓ Pureline
<label for="email">E-Mail</label>           │ <label>
<input id="email" name="email" type="email"> │     E-Mail
                                            │     <input name="email" type="email">
                                            │ </label>
```

### PL-HTML-005 — Les images et les médias ont des alternatives textuelles

Chaque `<img>` possède un attribut `alt` : une description pour des images informatives, un `alt=""` vide pour les images décoratives. Donnez `width` et `height` pour éviter le décalage de la disposition. Les vidéos fournissent des légendes via `<track>`.

### PL-HTML-006 — Tenir le comportement hors du balisage

Les scripts sont des fichiers externes chargés de `type="module"` ou `defer`. Ne placez pas les blocs `<script>` en ligne avec la logique d'application dans la page. Les données JSON en ligne pour un script unique sont la seule exception acceptée, marquée par `type="application/json"`.

### PL-HTML-007 — La tête de document est terminée

Chaque page définit `<html lang>`, un `<meta name="viewport">`, un `<title>` unique et un `<meta name="description">` lorsque la page est publique. Les Favicons et les métadonnées sociales sont déclarés une fois dans la mise en page, et non pas répétés par page.

### PL-HTML-008 — Niché compact

Gardez l'élément nichant peu profond. Lorsqu'un bloc niche plus de quatre niveaux de profondeur, extraire un composant ou un fragment de gabarit. Mettez un élément de bloc par ligne; maintenez en ligne le contenu phrasé sur la même ligne que son texte.

### PL-HTML-009 — La validation fait partie de la construction

Valider HTML en CI avec le validateur W3C ou `html-validate`. Un avertissement concernant un `alt` manquant ou une étiquette est une défaillance de construction, et non une suggestion.
