# Pureline Code Style 1.7

[Code-Style-Leitfaden](README.md) · [Originalspezifikation 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definition {#definition}

**Pureline** ist ein meinungsstarker Coding-Stil mit Fokus auf linearen Kontrollfluss, explizite Absicht, kompakte Formatierung, kleine Einheiten, klare Verantwortung und minimalen syntaktischen und architektonischen Lärm.

Pureline zielt nicht darauf ab, Zeichen zu minimieren. Es zielt darauf ab, **unnötigen Code** zu minimieren.

Die bevorzugte Leserichtung ist:

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

Nicht:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

Die zentralen Pureline-Prinzipien lauten:

> **Linearer Fluss. Explizite Absicht. Minimaler Lärm. Kleine Einheiten. Klare Verantwortung. Kohäsion vor Größe.**

**Version 1.7:** Ergänzt das Python-Profil (`PL-PY-001` bis `PL-PY-012`), das QML-Profil (`PL-QML-001` bis `PL-QML-011`), das Astro-Profil (`PL-AS-001` bis `PL-AS-009`), das HTML-Profil (`PL-HTML-001` bis `PL-HTML-009`) und das CSS-Profil (`PL-CSS-001` bis `PL-CSS-012`). Version 1.6 führte das Novus-Profil (`PL-NV-001` bis `PL-NV-013`) und das React-Profil (`PL-REACT-001` bis `PL-REACT-014`) ein und erweitert das Rust-Profil um `PL-RS-021` bis `PL-RS-024` sowie eine präzise Testausnahme in `PL-RS-004`. Alle bestehenden Regel-IDs und das Prinzip Kohäsion vor Größe aus Version 1.4 bleiben erhalten. Version 1.5 führte das Rust-Profil (`PL-RS-001` bis `PL-RS-020`) ein.

**Version 1.7 (zusätzliche Profile):** Version 1.7 ergänzt außerdem die Profile für C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) und Kotlin (`PL-KT-001`–`PL-KT-011`), ohne bestehende Regeln neu zu nummerieren.

---

## Pureline im Überblick {#pureline-summary}

Pureline-Code soll sich anfühlen:

- linear
- explizit
- kompakt
- modern
- lärmarm
- modular
- kohäsiv, unabhängig von der Zeilenzahl
- vorhersehbar
- leicht zu überfliegen
- leicht zu refaktorieren
- schwer misszuverstehen

Die Kernregel bleibt:

> **Code ohne Lärm.**

Ein zweites Prinzip gilt für jedes Sprachprofil:

> **Pureline standardisiert Prinzipien, nicht Syntax.**

Eine Sprache soll idiomatisch bleiben. Pureline entfernt unnötigen Lärm, ohne die Eigenschaften zu beschneiden, die Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald oder Emvus überhaupt erst leistungsfähig machen.
