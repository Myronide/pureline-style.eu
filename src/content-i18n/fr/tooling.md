# Outillage et identifiants de règles stables

[Guide de style de code](README.md) · [Données originales 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Modèle d'outillage

L'outillage Pureline devrait partager la même spécification de règle dans l'ensemble :

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Les diagnostics doivent renvoyer des ID de règles stables.

Exemple :

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Cela permet au site Web, CLI, format, linter et les intégrations IDE de rester cohérents.

Outillage **Novus:** le serveur de langue Novus rapporte déjà `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` et `PL-NAME-001` sous `pureline` source lorsque `novus.pureline.enabled` est configuré. Les pages `.nvmd` sont vérifiées par le biais de la `.nvh` qu'elles génèrent, et le générateur signale des erreurs à la ligne `.nvmd`. Ses seuils (30/50 lignes par méthode, 200 lignes par fichier, 10 fichiers par dossier) sont des valeurs par défaut que les projets peuvent régler; l'exemption `// pureline:allow-else <reason>` doit porter une raison.

**Emerald et Emvus :** utilisent des grammaires séparées pour `.ems` et `.ev`. Le vérificateur doit distinguer la syntaxe réelle et les constructions AST résolues des looks textuels; les déclarations macro-générées, les formulaires de tuple/liste inférés, les parenthèses facultatives de déclaration de méthode et les semi-colons optionnels Emvus nécessitent une manipulation language-aware. Les ID de profil existants et nouvellement ajoutés doivent produire des diagnostics cohérents entre les outils.

Les règles Rust **Versioning:** utilisent des IDs stables `PL-RS-*`; Novus, React, Python, QML, Astro, HTML, CSS, Emerald et Emvus utilisent des ID `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` et `PL-EV-*`. Les ID `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` et `PL-CR-*` ne sont pas renumérotés. La version 1.4 a ajouté `PL-CORE-022` et `PL-STRUCT-003`; la version 1.5 a ajouté `PL-RS-001`–`PL-RS-020`; la version 1.6 a ajouté `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` et `PL-RS-021`–`PL-RS-024`; la version 1.7 a ajouté `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` et `PL-CSS-001`–`PL-CSS-012` sans renuméroter les règles existantes.

**Version 1.7 languages:** Version 1.7 also adds the C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) and Kotlin (`PL-KT-001`–`PL-KT-011`) profiles without renumbering existing rules.
