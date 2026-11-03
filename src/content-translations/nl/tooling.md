# Tooling en vaste regel-ID's

[Codestijlgids](README.md) · [Oorspronkelijke specificatie 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Toolingmodel {#tooling-model}

Pureline-tooling moet dezelfde regelspecificatie delen voor:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Diagnostiek moet verwijzen naar vaste regel-ID's.

Voorbeeld:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Zo blijven de website, de CLI, de formatter, de linter en de IDE-integraties consistent.

**Novus-tooling:** de Novus-taalserver meldt `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` en `PL-NAME-001` al onder de bron `pureline` wanneer `novus.pureline.enabled` is ingesteld. `.nvmd`-pagina's worden gecontroleerd via de `.nvh` die ze genereren, en de generator meldt fouten op de regel in het `.nvmd`-bestand. De drempelwaarden (30/50 regels per methode, 200 regels per bestand, 10 bestanden per map) zijn standaardwaarden die projecten kunnen aanpassen; de vrijstelling `// pureline:allow-else <reason>` moet een reden bevatten.

**Toolingvereiste voor Emerald en Emvus:** gebruik aparte grammatica's voor `.ems` en `.ev`. De checker moet echte syntaxis en geresolveerde AST-constructies kunnen onderscheiden van tekstuele lookalikes; door macro's gegenereerde declaraties, afgeleide tuple- en lijstvormen, optionele haakjes bij methodedeclaraties en optionele puntkomma's in Emvus vereisen taalbewuste verwerking. Bestaande en nieuw toegevoegde profiel-ID's moeten in alle tools tot consistente diagnostiek leiden.

**Versiebeheer:** Rust-regels gebruiken vaste `PL-RS-*`-ID's; regels voor Novus, React, Python, QML, Astro, HTML, CSS, Emerald en Emvus gebruiken respectievelijk de ID's `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` en `PL-EV-*`. De gevestigde ID's `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` en `PL-CR-*` worden niet hernummerd. Versie 1.4 voegde `PL-CORE-022` en `PL-STRUCT-003` toe; versie 1.5 voegde `PL-RS-001`–`PL-RS-020` toe; versie 1.6 voegde `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` en `PL-RS-021`–`PL-RS-024` toe; versie 1.7 voegt `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` en `PL-CSS-001`–`PL-CSS-012` toe, zonder bestaande regels te hernummeren.

**Talen in versie 1.7:** versie 1.7 voegt ook de profielen C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) en Kotlin (`PL-KT-001`–`PL-KT-011`) toe, zonder bestaande regels te hernummeren.
