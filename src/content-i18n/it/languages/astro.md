# Astro Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile, and the [TypeScript profile](typescript.md) for the frontmatter script. Astro renders HTML on the server or at build time and ships JavaScript only where it is needed. Pureline Astro keeps that model visible: static by default, interactive where declared. Pureline is compatible with Astro 5 and later.

## Astro Profile

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Components Are `.astro` Files Named in `PascalCase`

A component lives in `src/components/` and is named after what it renders (`SessionCard.astro`). A page or layout lives in `src/pages/` or `src/layouts/`. Route files stay thin: they load data and compose components.

### PL-AS-002. La materia anteriore è lineare e digitatane lamentatione

The frontmatter (between `---` fences) does four things in order: receive typed props, load data, compute derived values, and then render. Declare props with an `interface Props`. Keep the frontmatter free of markup.

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

### PL-AS-003 — Static by Default, Islands by Declaration

Render HTML without JavaScript unless the component must respond to the user or change over time. When it must, mark the one interactive component with an explicit client directive: `client:visible` for content below the fold, `client:idle` for non-urgent widgets, `client:load` only for what is needed at first paint. A component without a directive never ships JavaScript.

### PL-AS-004 — Templates Stay Readable

- Conditionals with `&&` or a named variable for a single branch; use a guard in the frontmatter for early exits.
- Maps over lists with a stable `key` when the list is interactive.
- Do not nest more than two expression levels inside the markup. Move the inner part to a component.

### PL-AS-005 — Styles Are Scoped

Usare i blocchi `<style>` nel componente per impostazione predefinita; Astro li controlla automaticamente. Usa `is:global` solo per regole a livello di documento come i tag a tema o a tessere, e conserva quelle in un foglio di stile globale.

### PL-AS-006. I dati hanno una fonte

Il contenuto vive in collezioni di contenuti (`src/content/`) con un schema (`defineCollection` e zod).. Pagine interrogano la raccolta; non analizzano i file Markdown stessi.. Remote data is loaded in the frontmatter of the page that needs it, once.

### PL-AS-007. Le isole quadro seguono il loro profilo

Un'isola di React, Vue o Svelte segue il profilo di tale struttura (per React:) [PL-REACT](react.md)). Astro does not change the rules of the component; it only decides where the component is hydrated.

### Densità della cartella PL-AS-008

`src/components/` holds at most **10 files** by default. Group components by feature (`components/blog/`) once a feature has several files.

### PL-AS-009. Troppo,, p.., p...

Run `astro check` (types and template diagnostics) and the build in CI. Use `astro build` output to verify that pages without islands ship no JavaScript.
