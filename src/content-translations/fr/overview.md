# Pureline Code Style 1.7

[Guide de style de code](README.md) · [Spécification originale 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Définition {#definition}

**Pureline** est un style de code opinionné centré sur un flux de contrôle linéaire, une intention explicite, une mise en forme compacte, de petites unités, une responsabilité claire et un minimum de bruit syntaxique ou architectural.

Pureline ne cherche pas à minimiser les caractères. Il cherche à minimiser le **code inutile**.

Le sens de lecture privilégié est :

```text
Input
↓
Validation
↓
Transformation
↓
Execution
↓
Result
```

Et non :

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

Les principes centraux de Pureline sont :

> **Flux linéaire. Intention explicite. Bruit minimal. Petites unités. Responsabilité claire. Cohésion avant la taille.**

**Version 1.7 :** ajoute le profil Python (`PL-PY-001` à `PL-PY-012`), le profil QML (`PL-QML-001` à `PL-QML-011`), le profil Astro (`PL-AS-001` à `PL-AS-009`), le profil HTML (`PL-HTML-001` à `PL-HTML-009`) et le profil CSS (`PL-CSS-001` à `PL-CSS-012`). La version 1.6 avait ajouté le profil Novus (`PL-NV-001` à `PL-NV-013`) et le profil React (`PL-REACT-001` à `PL-REACT-014`), et étend le profil Rust avec `PL-RS-021` à `PL-RS-024` ainsi qu'une exemption précise pour les tests dans `PL-RS-004`. Tous les identifiants de règle existants et le principe de cohésion avant la taille introduit en 1.4 sont conservés. La version 1.5 avait ajouté le profil Rust (`PL-RS-001` à `PL-RS-020`).

**Version 1.7 (profils supplémentaires) :** la version 1.7 ajoute également les profils C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) et Kotlin (`PL-KT-001`–`PL-KT-011`), sans renuméroter les règles existantes.

---

## Résumé de Pureline {#pureline-summary}

Le code Pureline doit être :

- linéaire
- explicite
- compact
- moderne
- peu bruyant
- modulaire
- cohésif, quel que soit le nombre de lignes
- prévisible
- facile à parcourir
- facile à refactoriser
- difficile à mal comprendre

La règle fondamentale reste :

> **Du code sans bruit.**

Un second principe gouverne chaque profil de langage :

> **Pureline standardise des principes, pas la syntaxe.**

Un langage doit rester idiomatique. Pureline supprime le bruit inutile sans retirer les fonctionnalités qui font l'efficacité de Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald ou Emvus.
