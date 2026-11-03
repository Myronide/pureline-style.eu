# Tooling und stabile Regel-IDs

[Code-Style-Leitfaden](README.md) · [Originalspezifikation 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Tooling-Modell {#tooling-model}

Das Pureline-Tooling soll dieselbe Regelspezifikation gemeinsam nutzen, und zwar in:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Diagnosen sollen auf stabile Regel-IDs verweisen.

Beispiel:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

So bleiben Website, CLI, Formatter, Linter und IDE-Integrationen konsistent.

**Novus-Tooling:** Der Novus-Language-Server meldet bereits `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` und `PL-NAME-001` unter der Quelle `pureline`, sobald `novus.pureline.enabled` gesetzt ist. `.nvmd`-Seiten werden über die `.nvh` geprüft, die aus ihnen erzeugt wird, und der Generator meldet Fehler in der jeweiligen `.nvmd`-Zeile. Die Schwellenwerte (30/50 Zeilen pro Methode, 200 Zeilen pro Datei, 10 Dateien pro Ordner) sind Standardwerte, die Projekte anpassen dürfen; die Ausnahme `// pureline:allow-else <reason>` muss eine Begründung enthalten.

**Tooling-Anforderung für Emerald und Emvus:** Verwende getrennte Grammatiken für `.ems` und `.ev`. Der Checker muss echte Syntax und aufgelöste AST-Konstrukte von textuellen Doppelgängern unterscheiden; makrogenerierte Deklarationen, inferierte Tupel-/Listenformen, optionale Klammern bei Methodendeklarationen und optionale Emvus-Semikolons erfordern sprachbewusste Verarbeitung. Bestehende und neu hinzugefügte Profil-IDs müssen in allen Werkzeugen konsistente Diagnosen erzeugen.

**Versionierung:** Rust-Regeln verwenden stabile `PL-RS-*`-IDs; Regeln für Novus, React, Python, QML, Astro, HTML, CSS, Emerald und Emvus verwenden die IDs `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` und `PL-EV-*`. Die etablierten IDs `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` und `PL-CR-*` werden nicht neu nummeriert. Version 1.4 ergänzte `PL-CORE-022` und `PL-STRUCT-003`; Version 1.5 ergänzte `PL-RS-001`–`PL-RS-020`; Version 1.6 ergänzte `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` und `PL-RS-021`–`PL-RS-024`; Version 1.7 ergänzt `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` und `PL-CSS-001`–`PL-CSS-012`, ohne bestehende Regeln neu zu nummerieren.

**Sprachen in Version 1.7:** Version 1.7 ergänzt außerdem die Profile für C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) und Kotlin (`PL-KT-001`–`PL-KT-011`), ohne bestehende Regeln neu zu nummerieren.
