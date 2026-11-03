# Pureline-codestijl 1.7

[Codestijlgids](README.md) · [Oorspronkelijke specificatie 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definitie {#definition}

**Pureline** is een eigenzinnige codeerstijl die draait om lineaire besturingsstroom, expliciete intentie, compacte opmaak, kleine eenheden, helder eigenaarschap en minimale syntactische of architecturale ruis.

Pureline streeft er niet naar om het aantal tekens te minimaliseren, maar om **onnodige code** te minimaliseren.

De voorkeursleesrichting is:

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

De centrale principes van Pureline zijn:

> **Lineaire stroom. Expliciete intentie. Minimale ruis. Kleine eenheden. Helder eigenaarschap. Samenhang boven omvang.**

**Versie 1.7:** voegt het Python-profiel (`PL-PY-001` t/m `PL-PY-012`), het QML-profiel (`PL-QML-001` t/m `PL-QML-011`), het Astro-profiel (`PL-AS-001` t/m `PL-AS-009`), het HTML-profiel (`PL-HTML-001` t/m `PL-HTML-009`) en het CSS-profiel (`PL-CSS-001` t/m `PL-CSS-012`) toe. Versie 1.6 voegde het Novus-profiel (`PL-NV-001` t/m `PL-NV-013`) en het React-profiel (`PL-REACT-001` t/m `PL-REACT-014`) toe en breidt het Rust-profiel uit met `PL-RS-021` t/m `PL-RS-024` en een nauwkeurige testvrijstelling in `PL-RS-004`. Alle bestaande regel-ID's en het principe Samenhang boven omvang uit 1.4 blijven behouden. Versie 1.5 voegde het Rust-profiel (`PL-RS-001` t/m `PL-RS-020`) toe.

**Versie 1.7 (aanvullende profielen):** versie 1.7 voegt ook de profielen C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) en Kotlin (`PL-KT-001`–`PL-KT-011`) toe, zonder bestaande regels te hernummeren.

---

## Pureline in het kort {#pureline-summary}

Pureline-code moet aanvoelen als:

- lineair
- expliciet
- compact
- modern
- ruisarm
- modulair
- samenhangend, ongeacht het aantal regels
- voorspelbaar
- makkelijk te scannen
- makkelijk te refactoren
- moeilijk verkeerd te begrijpen

De kernregel blijft:

> **Code zonder ruis.**

Een tweede principe geldt voor elk taalprofiel:

> **Pureline standaardiseert principes, geen syntaxis.**

Een taal moet idiomatisch blijven. Pureline haalt onnodige ruis weg zonder de eigenschappen te ontnemen die Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald of Emvus in de eerste plaats effectief maken.
