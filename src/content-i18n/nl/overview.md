# Pureline Codestijl 1.7

[Code stijl gids](README.md) · [Original specificatie 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definitie

**Pureline** is een doordachte coderingsstijl gericht op lineaire controlestroom, expliciete intentie, compacte opmaak, kleine eenheden, duidelijke eigendom en minimale syntactische of architectonische ruis.

Pureline is niet bedoeld om tekens te minimaliseren. Het doel is om **unne need code** te minimaliseren.

De voorkeursrichting voor de lezing is:

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

Niet:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

De centrale Pureline-beginselen zijn:

> **Linear Flow. Expliciete intentie. Minimale ruis. Small Units. Clear Ownership. Cohesie over Size.**

**Version 1.7:** Voegt het Python-profiel (`PL-PY-001` via `PL-PY-012`), het QML-profiel (`PL-QML-001` via `PL-QML-011`), het Astro-profiel (`PL-AS-001` via `PL-AS-009`), het HTML-profiel (`PL-HTML-001` via `PL-HTML-009`) en het CSS-profiel (`PL-CSS-001` via `PL-CSS-012`). Versie 1.6 voegde het Novus profiel (`PL-NV-001` tot `PL-NV-013`) en het React profiel (`PL-REACT-001` tot `PL-REACT-014`) toe en breidde het Rustprofiel uit met `PL-RS-021` tot `PL-RS-024` en een nauwkeurige testvrijstelling in `PL-RS-004`. Alle bestaande regel-ID's en het 1.4 Cohesie-over-groottebeginsel blijven behouden. Versie 1.5 voegde het Rustprofiel (`PL-RS-001` tot `PL-RS-020`) toe.

**Version 1.7 (additional profiles):** Version 1.7 also adds the C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) and Kotlin (`PL-KT-001`–`PL-KT-011`) profiles without renumbering existing rules.

---

## Pureline Summary

Pureline-code moet voelen:

- lineair
- expliciet
- compact
- modern
- laag lawaai
- modulair
- samenhangend ongeacht het aantal lijnene
- voorspelbaar
- gemakkelijk te scannen
- gemakkelijk te refactoreren
- moeilijk te begrijpen

De kernregel blijft:

> **Code zonder lawaai.**

Een tweede principe geldt voor elk taalprofiel:

> **Pureline standaardiseert principes, geen syntaxis.**

Een taal moet idiomatisch blijven. Pureline verwijdert onnodig lawaai zonder de functies weg te nemen die Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald of Emvus effectief maken.
