# Hulpmiddel en stabiele regel-ID's

[Code stijl gids](README.md) · [Original specificatie 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Werktuigmodel model

Pureline-gereedschappen moeten dezelfde regelspecificatie delen over:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Diagnostics moeten verwijzen naar stabiele regel ID's.

Voorbeeld:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Hierdoor kunnen de website, CLI, formatter,er en IDE-integraties consistent blijven.

**Novus tooling:** de Novus taalserver rapporteert `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` en `PL-NAME-001` onder bron `pureline` als `novus.pureline.enabled` is ingesteld. `.nvmd` pagina's worden gecontroleerd door de `.nvh` die ze genereren, en de generator rapporteert fouten op de `.nvmd` lijn. De drempels (30/50 regels per methode, 200 regels per bestand, 10 bestanden per map) zijn standaards die projecten kunnen afstemmen; de `// pureline:allow-else <reason>` vrijstelling moet een reden hebben.

**Emerald en Emvus tooling requirement:** gebruik aparte grammars voor `.ems` en `.ev`. De checker moet echte syntax onderscheiden en opgelost AST-constructies van tekstuele lookalikes; macro-gegenereerde verklaringen, afgeleide tupel/lijstformulieren, optionele methode-aangifte haakjes, en optionele Emvus-semikomma's vereisen taal-bewuste behandeling.definie-requenties zijn niet-vergelijkbaar. Bestaande en nieuw toegevoegde profiel-ID's moeten consistente diagnostiek produceren tussen de instrumenten.

**Versioning:** Rustregels gebruiken stabiele `PL-RS-*` ID's; Novus, React, Python, QML, Astro, HTML, CSS, Emerald en Emvus regels gebruiken `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*`, en `PL-EV-*` ID's. De gevestigde `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` en `PL-CR-*` ID's worden niet hernummerd. Versie 1.4 toegevoegd `PL-CORE-022` en `PL-STRUCT-003`; versie 1.5 toegevoegd `PL-RS-001`.`PL-RS-020`; versie 1.6 toegevoegd `PL-NV-001`.`PL-NV-013`, `PL-REACT-001`.`PL-REACT-014`, en `PL-RS-021`.`PL-RS-024`; versie 1.7 voegt `PL-PY-001`.`PL-PY-012`, `PL-QML-001`.`PL-QML-011`, `PL-AS-001`.`PL-AS-009`, `PL-HTML-001`.`PL-HTML-009`, en `PL-CSS-001`.`PL-CSS-012` zonder hernummering van bestaande regels.
