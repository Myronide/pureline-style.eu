# Tooling and Stable Rule IDs

[Code style guide](README.md) · [Original specification 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Tooling Model

Lo strumento Pureline dovrebbe condividere le stesse specifiche di regola:nexe's sp...

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

**Novus tooling:** the Novus language server already reports `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002`, and `PL-NAME-001` under source `pureline` when `novus.pureline.enabled` is set. `.nvmd` pages are checked through the `.nvh` they generate, and the generator reports errors at the `.nvmd` line. Its thresholds (30/50 lines per method, 200 lines per file, 10 files per folder) are defaults that projects may tune; the `// pureline:allow-else <reason>` exemption must carry a reason.

**Emerald and Emvus tooling requirement:** use separate grammars for `.ems` and `.ev`. The checker must distinguish real syntax and resolved AST constructs from textual lookalikes; macro-generated declarations, inferred tuple/list forms, optional method-declaration parentheses, and optional Emvus semicolons require language-aware handling. Existing and newly added profile IDs must produce consistent diagnostics across tools.

**Versioning:** Rust rules use stable `PL-RS-*` IDs; Novus, React, Python, QML, Astro, HTML, CSS, Emerald, and Emvus rules use `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*`, and `PL-EV-*` IDs. The established `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*`, and `PL-CR-*` IDs are not renumbered. Version 1.4 added `PL-CORE-022` and `PL-STRUCT-003`; version 1.5 added `PL-RS-001`–`PL-RS-020`; version 1.6 added `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014`, and `PL-RS-021`–`PL-RS-024`; version 1.7 adds `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009`, and `PL-CSS-001`–`PL-CSS-012` without renumbering existing rules.

**Version 1.7 languages:** Version 1.7 also adds the C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) and Kotlin (`PL-KT-001`–`PL-KT-011`) profiles without renumbering existing rules.
