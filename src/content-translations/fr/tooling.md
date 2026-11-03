# Outillage et identifiants de règle stables

[Guide de style de code](README.md) · [Spécification originale 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Modèle d'outillage {#tooling-model}

L'outillage Pureline doit partager la même spécification de règles entre :

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Les diagnostics doivent référencer des identifiants de règle stables.

Exemple :

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Cela permet au site web, à la CLI, au formateur, au linter et aux intégrations IDE de rester cohérents.

**Outillage Novus :** le serveur de langage Novus signale déjà `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` et `PL-NAME-001` sous la source `pureline` lorsque `novus.pureline.enabled` est activé. Les pages `.nvmd` sont vérifiées à travers le `.nvh` qu'elles génèrent, et le générateur signale les erreurs à la ligne du `.nvmd`. Ses seuils (30/50 lignes par méthode, 200 lignes par fichier, 10 fichiers par dossier) sont des valeurs par défaut que les projets peuvent ajuster ; l'exemption `// pureline:allow-else <reason>` doit comporter une raison.

**Exigence d'outillage pour Emerald et Emvus :** utilisez des grammaires distinctes pour `.ems` et `.ev`. Le vérificateur doit distinguer la vraie syntaxe et les constructions AST résolues des faux-semblants textuels ; les déclarations générées par macro, les formes de tuple/liste inférées, les parenthèses facultatives dans les déclarations de méthode et les points-virgules facultatifs d'Emvus exigent un traitement conscient du langage. Les identifiants de profil existants et nouvellement ajoutés doivent produire des diagnostics cohérents d'un outil à l'autre.

**Versionnement :** les règles Rust utilisent des identifiants `PL-RS-*` stables ; les règles Novus, React, Python, QML, Astro, HTML, CSS, Emerald et Emvus utilisent les identifiants `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` et `PL-EV-*`. Les identifiants établis `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` et `PL-CR-*` ne sont pas renumérotés. La version 1.4 a ajouté `PL-CORE-022` et `PL-STRUCT-003` ; la version 1.5 a ajouté `PL-RS-001`–`PL-RS-020` ; la version 1.6 a ajouté `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` et `PL-RS-021`–`PL-RS-024` ; la version 1.7 ajoute `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` et `PL-CSS-001`–`PL-CSS-012`, sans renuméroter les règles existantes.

**Langages de la version 1.7 :** la version 1.7 ajoute également les profils C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) et Kotlin (`PL-KT-001`–`PL-KT-011`), sans renuméroter les règles existantes.
