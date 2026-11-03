# Herramientas e ID de regla estables

[Guía de estilo de código](README.md) · [Especificación original 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Modelo de herramientas {#tooling-model}

Las herramientas de Pureline deben compartir la misma especificación de reglas en:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Los diagnósticos deben hacer referencia a ID de regla estables.

Ejemplo:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Así, el sitio web, la CLI, el formateador, el linter y las integraciones con IDE se mantienen coherentes entre sí.

**Herramientas de Novus:** el servidor de lenguaje de Novus ya notifica `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` y `PL-NAME-001` con la fuente `pureline` cuando `novus.pureline.enabled` está activado. Las páginas `.nvmd` se comprueban a través del `.nvh` que generan, y el generador notifica los errores en la línea del `.nvmd`. Sus umbrales (30/50 líneas por método, 200 líneas por archivo, 10 archivos por carpeta) son valores por defecto que los proyectos pueden ajustar; la exención `// pureline:allow-else <reason>` debe incluir un motivo.

**Requisito de herramientas para Emerald y Emvus:** usa gramáticas separadas para `.ems` y `.ev`. El verificador debe distinguir la sintaxis real y las construcciones AST resueltas de las coincidencias meramente textuales; las declaraciones generadas por macros, las formas de tupla/lista inferidas, los paréntesis opcionales en las declaraciones de método y los puntos y coma opcionales de Emvus requieren un tratamiento que conozca el lenguaje. Los ID de perfil existentes y los recién añadidos deben producir diagnósticos coherentes en todas las herramientas.

**Versionado:** las reglas de Rust usan ID estables `PL-RS-*`; las reglas de Novus, React, Python, QML, Astro, HTML, CSS, Emerald y Emvus usan los ID `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` y `PL-EV-*`. Los ID ya establecidos `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` y `PL-CR-*` no se renumeran. La versión 1.4 añadió `PL-CORE-022` y `PL-STRUCT-003`; la versión 1.5 añadió `PL-RS-001`–`PL-RS-020`; la versión 1.6 añadió `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` y `PL-RS-021`–`PL-RS-024`; la versión 1.7 añade `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` y `PL-CSS-001`–`PL-CSS-012`, sin renumerar las reglas existentes.

**Lenguajes de la versión 1.7:** la versión 1.7 añade también los perfiles de C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) y Kotlin (`PL-KT-001`–`PL-KT-011`), sin renumerar las reglas existentes.
