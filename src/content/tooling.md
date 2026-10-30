# Tooling and Stable Rule IDs

[Code style guide](README.md) · [Original specification 1.5](../../PURELINE_SPECIFICATION_1.5.md)

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

Example:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

This allows the website, CLI, formatter, linter, and IDE integrations to stay consistent.

**Emerald and Emvus tooling requirement:** use separate grammars for `.ems` and `.ev`. The checker must distinguish real syntax and resolved AST constructs from textual lookalikes; macro-generated declarations, inferred tuple/list forms, optional method-declaration parentheses, and optional Emvus semicolons require language-aware handling. Existing and newly added profile IDs must produce consistent diagnostics across tools.

**Versioning:** Rust rules use stable `PL-RS-*` IDs; Emerald and Emvus rules retain `PL-EMS-*` and `PL-EV-*` IDs. The established `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*`, and `PL-CR-*` IDs are not renumbered. Version 1.4 added `PL-CORE-022` and `PL-STRUCT-003`; version 1.5 adds `PL-RS-001`–`PL-RS-020` without renumbering existing rules.
