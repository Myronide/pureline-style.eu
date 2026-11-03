# Novus Code Style

[Code style guide](../README.md) · [Original specification 1.6](../../../PURELINE_SPECIFICATION_1.6.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Novus is a self-hosting language that compiles to portable C, with dynamically typed values, optional static typing, `.nvh` server-rendered components, and `.nvmd` Markdown content through [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). The profile follows the Novus examples, the standard library, and the rules the Novus language server checks when Pureline style diagnostics are enabled (`novus.pureline.enabled`). [Cohesion over Size](../core/structure.md) applies throughout.

Rule IDs `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002`, and `PL-NAME-001` are the ones the Novus language server already reports under source `pureline`. The Novus-specific rules below use the `PL-NV-*` prefix.

## Novus Profile

### PL-NV-001 — Naming and Visibility

- Classes, enums, and components: `PascalCase`.
- Methods, fields, locals, and parameters: `lowerCamelCase`.
- Package (folder) names: short, lowercase, without separators.
- Constants: `private final SCREAMING_SNAKE_CASE` at file level.
- Keep members private unless another package or file uses them. Expose fields through `: get` or `: get, set` only when callers need them.
- Short names are allowed for loop counters (`i`, `j`, `k`). Other one-letter names and placeholders (`tmp`, `obj`, `thing`, `data2`) are reported by `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002 — Guard Clauses and Linear Flow

Validate first, return early, and keep the successful path at the base indentation.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Avoid `else` after a branch that already returns, breaks, or continues (`PL-CF-002`). When an `else` is genuinely the clearest form, mark the line with a justified exemption:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Declarations: `final`, `var`, and Explicit Types

- Use `final` for values that never change; use `var` for locals whose type is obvious from the initialiser.
- Write a declared type where the reader would otherwise have to guess, and at API boundaries (fields, parameters, return types).
- Remember that an explicit type converts the value: `integer x = 2.9` stores `2`. Make such conversions visible rather than relying on them by accident.
- Novus has no compound assignment. Write `count = count + 1`, not `count += 1`, and keep that statement on one line.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

### PL-NV-004 — Construction and Object Literals

- Use object literals (`Person{name="Tom"}`) for plain data with no behaviour.
- Use `construct()` when the object must establish invariants, derive fields, or validate arguments.
- Do not hide significant work in field initialisers; keep construction explicit in `construct()`.
- A `based` inheritance chain should describe a real is-a relationship. Prefer an `interface` when only the behaviour is shared.

### PL-NV-005 — Method Signatures

- Declare parameter and return types when the signature is part of an API, a module boundary, or an `.nvh` component.
- Use `method name(args): type { }` for ordinary methods; keep parameter lists short enough to scan.
- Method overloads by arity or parameter type are allowed when the meaning is identical. Do not use overloads to hide different behaviour behind one name.

### PL-NV-006 — Function Size Is a Review Signal

The language server reviews a method at 30 lines and reports it above 50 lines (`PL-FN-001`). These are review thresholds. A cohesive method that does one thing in sequence may stay longer; split it when it mixes responsibilities such as parsing, validation, and I/O.

### PL-NV-007 — Packages, Imports, and Folder Density

- A folder is a package. Import the narrowest unit that is needed: `import geo/circle` or `import @helpers` instead of importing a whole package when one file is enough.
- Keep at most **10 `.nv` / `.nvh` files** per folder by default (`PL-STRUCT-002`). Split along responsibility boundaries, not into meaningless nested folders.
- Review a file at **200 lines** (`PL-STRUCT-001`). This is a review threshold, not a hard limit: keep one responsibility per file and let cohesive logic stay together.

### PL-NV-008 — Concurrency Has Visible Ownership

- Make concurrency visible at the call site: `async` / `await`, `thread`, `virtual`, and `sync` state what runs where.
- Track every task that matters. Do not start fire-and-forget work for results the program later depends on.
- Guard shared mutable state explicitly with `sync` rather than relying on call order.
- Follow the same discipline as [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) for shutdown and cancellation.

### PL-NV-009 — Evaluation Order Is Documented, Not Assumed

Novus evaluates operands left to right and documents the exceptions. Do not write code whose result depends on an unusual ordering. Keep side effects in their own statements, and avoid combining a global or field read with a later call that changes it in one expression.

The `..` chain is for building an object or array in one linear sequence (`var names = []..append("Ada")..append("Grace")`). Use it when every step is a call or member assignment on the same receiver. Break a chain into named steps when a step needs a comment or a branch.

### PL-NV-010 — C Blocks and Platform Boundaries

A `c { ... }` block is a native boundary. Keep it small, isolate it in a focused file, and explain with a comment what the C code assumes about types, lifetimes, and the platform. Expose the native function through a Novus method with a typed signature, so the rest of the code never sees raw C details.

### PL-NV-011 — `.nvh` Components Keep Markup and Logic Apart

In a `.nvh` component:

- Declare reactive state with `ref` inside `<?nv ... ?>` at the top of the component.
- Keep handlers and computations in Novus blocks; keep the HTML focused on structure and presentation.
- Compute derived values in one place rather than repeating the expression in several places of the markup.
- Treat each component as one responsibility, the same way as a class (`PL-STRUCT-001`).

### PL-NV-012 — Comments and Diagnostics

- Comments explain why, not what: the reason for a workaround, a platform quirk, or a non-obvious invariant ([PL-DOC-001](../core/comments.md)).
- Pureline diagnostics are opt-in in the editor (`novus.pureline.enabled`). Enable them for shared projects so that the same rule IDs appear in every editor and in CI.
- Every `pureline:allow-else` exemption needs a reason on the same line. An exemption without a reason is a review finding.

### PL-NV-013 — Markdown Content (`.nvmd`)

A `.nvmd` file is Markdown with Novus in it, the way `.mdx` is Markdown with JSX. The generator in [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) turns `Page.nvmd` into `Page.nvh` before the compiler runs. Apply the rules above to the header block and to any `.nv` modules it imports; the Markdown body follows these rules:

- The body carries the content. The header block (`<?nv ... ?>`) carries only what the page needs: imports, props, and a few methods. Move logic longer than a few lines into a `.nv` module and import it.
- Frontmatter keys are the page's props. Keep them short and flat, and use `{title}` rather than repeating the value in the text.
- Keep each `{expr}` to one value or one call. Compute anything longer in the header or a module, so the body reads top-down like prose.
- Keep `{#if}` and `{#for}` blocks at most two levels deep. When a block repeats markup, use a component (`<Callout>`, `<Toc>`) instead.
- A heading whose text is dynamic gets an explicit id (`# {title} {#intro}`), so anchors and `markdown.headings` stay stable.
- Generated `.nvh` files are build output. Add them to `.gitignore`, never edit them, and fix the `.nvmd` source instead. Keep the `<?nv /* nvmd-generated */` mark intact.
- An HTML block with a handler (`<button @click="hit">`) is nvh inside Markdown. Keep such blocks short and separate them from the surrounding text with blank lines.
