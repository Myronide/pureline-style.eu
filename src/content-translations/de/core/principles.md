# Grundprinzipien

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Pureline Core {#pureline-core}

Diese Regeln gelten für alle unterstützten Sprachen, soweit die Sprache sie natürlich zulässt.

| ID | Regel |
|---|---|
| PL-CORE-001 | Der Kontrollfluss soll so linear wie möglich sein |
| PL-CORE-002 | `else` vermeiden |
| PL-CORE-003 | Guard Clauses bevorzugen |
| PL-CORE-004 | Die klarste Kontrollfluss-Form der Sprache verwenden; klammerbasierte Sprachen nutzen explizite Blöcke |
| PL-CORE-005 | Idiomatische, sprachnative Kurzschreibweisen sind erlaubt, solange sie sofort lesbar bleiben |
| PL-CORE-006 | Funktionen sollen klein und fokussiert sein |
| PL-CORE-007 | Namen müssen Bedeutung tragen |
| PL-CORE-008 | Unnötige Abstraktionen vermeiden |
| PL-CORE-009 | God Classes und God Modules vermeiden |
| PL-CORE-010 | Unveränderlichen Zustand bevorzugen |
| PL-CORE-011 | Moderne Sprachfeatures bevorzugen, wo sie die Klarheit verbessern |
| PL-CORE-012 | Unnötige vertikale Formatierung vermeiden |
| PL-CORE-013 | Kommentare dürfen unklaren Code nicht ausgleichen |
| PL-CORE-014 | Ungültige und fehlerhafte Zustände früh behandeln |
| PL-CORE-015 | Wichtige Seiteneffekte sichtbar halten |
| PL-CORE-016 | Ressourcen brauchen einen klaren Lebenszyklus |
| PL-CORE-017 | Framework-native APIs bevorzugen |
| PL-CORE-018 | Magische Werte vermeiden |
| PL-CORE-019 | Abhängigkeiten explizit machen |
| PL-CORE-020 | Hot Paths gezielt statt zufällig optimieren |
| PL-CORE-021 | Pakete und Quellordner klein genug halten, um sie auf einen Blick zu überschauen |
| PL-CORE-022 | Kohäsion vor Größe: eine kohärente Verantwortung ist willkürlichen Zeilenlimits für Klassen vorzuziehen |
