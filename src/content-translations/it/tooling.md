# Strumenti e ID stabili delle regole

[Guida allo stile del codice](README.md) · [Specifica originale 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Modello degli strumenti {#tooling-model}

Gli strumenti Pureline dovrebbero condividere la stessa specifica delle regole in:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Le diagnostiche dovrebbero fare riferimento a ID di regola stabili.

Esempio:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Così il sito web, la CLI, il formatter, il linter e le integrazioni con gli IDE restano coerenti tra loro.

**Strumenti per Novus:** il language server di Novus segnala già `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` e `PL-NAME-001` con la sorgente `pureline` quando `novus.pureline.enabled` è attivo. Le pagine `.nvmd` vengono controllate tramite il `.nvh` che generano, e il generatore segnala gli errori alla riga del `.nvmd`. Le sue soglie (30/50 righe per metodo, 200 righe per file, 10 file per cartella) sono valori predefiniti che i progetti possono regolare; l'esenzione `// pureline:allow-else <reason>` deve indicare un motivo.

**Requisito degli strumenti per Emerald ed Emvus:** usare grammatiche separate per `.ems` ed `.ev`. Il checker deve distinguere la sintassi reale e i costrutti AST risolti dalle somiglianze solo testuali; le dichiarazioni generate dalle macro, le forme inferite di tuple e liste, le parentesi facoltative nelle dichiarazioni di metodo e i punti e virgola facoltativi di Emvus richiedono una gestione consapevole del linguaggio. Gli ID dei profili esistenti e di quelli appena aggiunti devono produrre diagnostiche coerenti tra gli strumenti.

**Versionamento:** le regole Rust usano ID stabili `PL-RS-*`; le regole di Novus, React, Python, QML, Astro, HTML, CSS, Emerald ed Emvus usano rispettivamente gli ID `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` e `PL-EV-*`. Gli ID già consolidati `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` e `PL-CR-*` non vengono rinumerati. La versione 1.4 ha aggiunto `PL-CORE-022` e `PL-STRUCT-003`; la versione 1.5 ha aggiunto `PL-RS-001`–`PL-RS-020`; la versione 1.6 ha aggiunto `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` e `PL-RS-021`–`PL-RS-024`; la versione 1.7 aggiunge `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` e `PL-CSS-001`–`PL-CSS-012`, senza rinumerare le regole esistenti.

**Linguaggi della versione 1.7:** la versione 1.7 aggiunge anche i profili C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) e Kotlin (`PL-KT-001`–`PL-KT-011`), senza rinumerare le regole esistenti.
