# Style de code Pureline 1.7

[Guide de style de code](README.md) · [Données originales 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Définition

**Pureline** est un style de codage opinionné axé sur le flux de contrôle linéaire, l'intention explicite, le formatage compact, les petites unités, la propriété claire et le bruit minimal syntaxique ou architectural.

Pureline ne vise pas à minimiser les caractères. Il vise à minimiser ** code non nécessaire**.

La direction de lecture préférée est:

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

Pas:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

Les principes centraux de Pureline sont les suivants:

> **Flux linéaire. Intention explicite. Un bruit minimal. Petites unités. Propriété claire. Cohésion sur Taille.**

**Version 1.7:** Ajoute le profil Python (`PL-PY-001` à `PL-PY-012`), le profil QML (`PL-QML-001` à `PL-QML-011`), le profil Astro (`PL-AS-001` à `PL-AS-009`), le profil HTML (`PL-HTML-001` à `PL-HTML-009`) et le profil CSS (`PL-CSS-001` à `PL-CSS-012`). La version 1.6 a ajouté le profil Novus (`PL-NV-001` à `PL-NV-013`) et le profil React (`PL-REACT-001` à `PL-REACT-014`), et étend le profil Rust avec `PL-RS-021` à `PL-RS-024` et une exemption de test précise en `PL-RS-004`. Toutes les règles existantes et le principe de cohésion sur taille 1.4 sont conservés. La version 1.5 a ajouté le profil Rust (`PL-RS-001` à `PL-RS-020`).

**Version 1.7 (profils supplémentaires):** Version 1.7 ajoute également les profils C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) et Kotlin (`PL-KT-001`–`PL-KT-011`) sans renuméroter les règles existantes.

---

## Sommaire de Pureline

Le code Pureline doit sentir :

- linéaire
- explicite
- compact
- moderne
- faible taux de
- modulaire
- Cohésion sans égard au nombre de lignes
- prévisible
- facile à analyser
- facile à refactorer
- difficile à comprendre

La règle fondamentale demeure :

> **Code sans bruit.**

Un deuxième principe régit chaque profil linguistique :

> **Pureline standardise les principes, pas la syntaxe.**

Une langue doit rester idiomatique. Pureline supprime le bruit inutile sans enlever les fonctionnalités qui rendent Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, ou Emvus efficace en premier lieu.
