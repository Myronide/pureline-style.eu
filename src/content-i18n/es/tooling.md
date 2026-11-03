# Tooling and Stable Rule IDs

[Guía de estilo del código](README.md) · [Especificaciones originales 1.7](../../PURELINE_SPECIFICATION_1.7.md)

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

Ejemplo

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

**Emerald and Emvus tooling requirement:** use separate grammars for `.ems` and `.ev`. El verificador debe distinguir la sintaxis real y los constructos AST resueltos de lookalikes < < < < > > > ; las declaraciones macro-generadas, los formularios inferidos de tuple/list, la declaración opcional de método < < < < > >, y los Emvus semicolons opcionales requieren un manejo con conocimiento de idioma. < > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > Existing and newly added profile IDs must produce consistent diagnostics across tools.

**Versioning:** Las reglas Rust usan IDs estables de `PL-RS-*`; Novus, React, Python, QML, Astro, HTML, CSS, Emerald, y Emvus las reglas usan IDs `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*`, y `PL-EV-*`.!!!!!!!!!!!!!!!!!!!!!!!!!!!!! The established `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*`, and `PL-CR-*` IDs are not renumbered. La versión 1.4 añadió `PL-CORE-022` y `PL-STRUCT-003`; la versión 1.5 añadió `PL-RS-001`–`PL-RS-020`; la versión 1.6 añadió `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` y `PL-RS-021`–`PL-RS-024`; la versión 1.7 añade `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` y `PL-CSS-001`–`PL-CSS-012` sin renumerar las normas existentes. © © © © © © © © © © © © © © © © © © © © © © © © © eutra version version version version version version version version version version version version version version version version 
