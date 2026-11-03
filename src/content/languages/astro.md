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

### PL-AS-002 — Frontmatter Is Linear and Typed

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

Keep a short formatting expression in the template when it is used once
and reads clearly at the point of use.

```text
Named frontmatter value                         │ ✓ Pureline
---                                             │ ---
const { title } = Astro.props;                  │ const { title } = Astro.props;
const displayTitle = title.trim() || "Profil";  │ ---
---                                             │
                                                │ <h1>{title.trim() || "Profil"}</h1>
<h1>{displayTitle}</h1>                         │
```

### PL-AS-005 — Styles Are Scoped

Use `<style>` blocks in the component by default; Astro scopes them automatically. Use `is:global` only for document-wide rules such as reset or theme tokens, and keep those in one global stylesheet.

### PL-AS-006 — Data Has One Source

Content lives in content collections (`src/content/`) with a schema (`defineCollection` and zod). Pages query the collection; they do not parse Markdown files themselves. Remote data is loaded in the frontmatter of the page that needs it, once.

### PL-AS-007 — Framework Islands Follow Their Own Profile

A React, Vue, or Svelte island follows that framework's profile (for React: [PL-REACT](react.md)). Astro does not change the rules of the component; it only decides where the component is hydrated.

### PL-AS-008 — Folder Density

`src/components/` holds at most **10 files** by default. Group components by feature (`components/blog/`) once a feature has several files.

### PL-AS-009 — Tooling

Run `astro check` (types and template diagnostics) and the build in CI. Use `astro build` output to verify that pages without islands ship no JavaScript.
