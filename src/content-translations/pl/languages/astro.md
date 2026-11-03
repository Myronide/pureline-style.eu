# Astro Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem, a dla skryptu frontmatter także [profil TypeScript](typescript.md). Astro renderuje HTML na serwerze lub w czasie budowania i dostarcza JavaScript tylko tam, gdzie jest potrzebny. Pureline Astro utrzymuje ten model widocznym: domyślnie statycznie, interaktywnie tam, gdzie zadeklarowano. Pureline jest zgodny z Astro 5 i nowszymi wersjami.

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

### PL-AS-001 — Komponenty to pliki `.astro` nazwane w `PascalCase` {#pl-as-001--components-are-astro-files-named-in-pascalcase}

Komponent znajduje się w `src/components/` i nosi nazwę od tego, co renderuje (`SessionCard.astro`). Strona lub layout znajduje się w `src/pages/` lub `src/layouts/`. Pliki tras pozostają cienkie: ładują dane i składają komponenty.

### PL-AS-002 — Frontmatter jest liniowy i typowany {#pl-as-002--frontmatter-is-linear-and-typed}

Frontmatter (między ogrodzeniami `---`) wykonuje cztery rzeczy w kolejności: odbiera typowane propsy, ładuje dane, oblicza wartości pochodne, a następnie renderuje. Propsy deklaruj za pomocą `interface Props`. Frontmatter utrzymuj wolny od markupu.

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

### PL-AS-003 — Domyślnie statycznie, wyspy przez deklarację {#pl-as-003--static-by-default-islands-by-declaration}

Renderuj HTML bez JavaScriptu, chyba że komponent musi reagować na użytkownika lub zmieniać się w czasie. Gdy musi, oznacz jeden interaktywny komponent jawną dyrektywą klienta: `client:visible` dla treści poniżej linii przewijania, `client:idle` dla niepilnych widżetów, `client:load` tylko dla tego, co jest potrzebne przy pierwszym malowaniu. Komponent bez dyrektywy nigdy nie dostarcza JavaScriptu.

### PL-AS-004 — Szablony pozostają czytelne {#pl-as-004--templates-stay-readable}

- Warunki z `&&` lub nazwaną zmienną dla pojedynczej gałęzi; dla wczesnych wyjść użyj guarda we frontmatterze.
- Mapowania list ze stabilnym `key`, gdy lista jest interaktywna.
- Nie zagnieżdżaj więcej niż dwóch poziomów wyrażeń wewnątrz markupu. Wewnętrzną część przenieś do komponentu.

### PL-AS-005 — Style mają zasięg lokalny {#pl-as-005--styles-are-scoped}

Domyślnie używaj bloków `<style>` w komponencie; Astro automatycznie nadaje im zasięg lokalny. `is:global` stosuj tylko dla reguł obejmujących cały dokument, takich jak reset lub tokeny motywu, i trzymaj je w jednym globalnym arkuszu stylów.

### PL-AS-006 — Dane mają jedno źródło {#pl-as-006--data-has-one-source}

Treść znajduje się w kolekcjach treści (`src/content/`) ze schematem (`defineCollection` i zod). Strony odpytują kolekcję; same nie parsują plików Markdown. Dane zdalne ładuje się raz, we frontmatterze strony, która ich potrzebuje.

### PL-AS-007 — Wyspy frameworków podlegają własnemu profilowi {#pl-as-007--framework-islands-follow-their-own-profile}

Wyspa React, Vue lub Svelte podlega profilowi tego frameworka (dla React: [PL-REACT](react.md)). Astro nie zmienia reguł komponentu; decyduje tylko o tym, gdzie komponent jest hydratowany.

### PL-AS-008 — Gęstość folderów {#pl-as-008--folder-density}

`src/components/` zawiera domyślnie co najwyżej **10 plików**. Gdy funkcja ma kilka plików, grupuj komponenty według funkcji (`components/blog/`).

### PL-AS-009 — Narzędzia {#pl-as-009--tooling}

W CI uruchamiaj `astro check` (typy i diagnostykę szablonów) oraz build. Użyj wyniku `astro build`, aby zweryfikować, że strony bez wysp nie dostarczają JavaScriptu.
