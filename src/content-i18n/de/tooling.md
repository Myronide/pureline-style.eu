# Tooling and Stable Rule IDs

[Code-Stil-Führer](README.md) · [Original-Spezifikation 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Tooling Model

Pureline tooling should share the same rule specification across:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Diagnostics should reference stable rule IDs.

Beispiel:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

This allows the website, CLI, formatter, linter, and IDE integrations to stay consistent.

**Novus tooling:** the Novus language server already reports `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002`, and `PL-NAME-001` under source `pureline` when `novus.pureline.enabled` is set. `.nvmd` pages are checked through the `.nvh` they generate, and the generator reports errors at the `.nvmd` line. Its thresholds (30/50 lines per method, 200 lines per file, 10 files per folder) are defaults that projects may tune; the `// pureline:allow-else <reason>` exemption must carry a reason.

**Emerald and Emvus tooling requirement:** use separate grammars for `.ems` and `.ev`. The checker must distinguish real syntax and resolved AST constructs from textual lookalikes; macro-generated declarations, inferred tuple/list forms, optional method-declaration parentheses, and optional Emvus semicolons require language-aware handling. Existing and newly added profile IDs must produce consistent diagnostics across tools.

**Versioning:** Rust rules use stable `PL-RS-*` IDs; Novus, React, Python, QML, Astro, HTML, CSS, Emerald, and Emvus rules use `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*`, and `PL-EV-*` IDs. The established `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*`, and `PL-CR-*` IDs are not renumbered. Version 1.4 hinzugefügt `PL-CORE-022` und `PL-STRUCT-003`; Version 1.5 hinzugefügt `PL-RS-001`–`PL-RS-020`; Version 1.6 hinzugefügt `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` und `PL-RS-021`–`PL-RS-024`; Version 1.7 hinzugefügt `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` und `PL-CSS-001`–`PL-CSS-012` ohne Umnummerierung bestehender Regeln.
