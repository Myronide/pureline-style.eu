# Pureline Code Style 1.7

[Przewodnik po stylu kodu](README.md) · [Oryginalna specyfikacja 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definicja {#definition}

**Pureline** to zdecydowany styl kodowania skoncentrowany na liniowym przepływie sterowania, jawnym zamiarze, zwartym formatowaniu, małych jednostkach, jasnej własności oraz minimalnym szumie składniowym i architektonicznym.

Pureline nie dąży do minimalizacji liczby znaków. Dąży do minimalizacji **zbędnego kodu**.

Preferowany kierunek czytania to:

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

A nie:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

Główne zasady Pureline to:

> **Liniowy przepływ. Jawny zamiar. Minimalny szum. Małe jednostki. Jasna własność. Spójność ponad rozmiar.**

**Wersja 1.7:** Dodaje profil Python (`PL-PY-001` do `PL-PY-012`), profil QML (`PL-QML-001` do `PL-QML-011`), profil Astro (`PL-AS-001` do `PL-AS-009`), profil HTML (`PL-HTML-001` do `PL-HTML-009`) oraz profil CSS (`PL-CSS-001` do `PL-CSS-012`). Wersja 1.6 dodała profil Novus (`PL-NV-001` do `PL-NV-013`) i profil React (`PL-REACT-001` do `PL-REACT-014`) oraz rozszerzyła profil Rust o `PL-RS-021` do `PL-RS-024` i precyzyjny wyjątek dla testów w `PL-RS-004`. Wszystkie istniejące identyfikatory reguł oraz zasada Spójność ponad rozmiar z wersji 1.4 zostały zachowane. Wersja 1.5 dodała profil Rust (`PL-RS-001` do `PL-RS-020`).

**Wersja 1.7 (dodatkowe profile):** Wersja 1.7 dodaje również profile C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) i Kotlin (`PL-KT-001`–`PL-KT-011`), bez zmiany numeracji istniejących reguł.

---

## Podsumowanie Pureline {#pureline-summary}

Kod w stylu Pureline powinien być:

- liniowy
- jawny
- zwarty
- nowoczesny
- ubogi w szum
- modularny
- spójny niezależnie od liczby linii
- przewidywalny
- łatwy do przejrzenia wzrokiem
- łatwy do refaktoryzacji
- trudny do zrozumienia opacznie

Podstawowa zasada pozostaje niezmienna:

> **Kod bez szumu.**

Drugą zasadą, która obowiązuje w każdym profilu języka, jest:

> **Pureline standaryzuje zasady, nie składnię.**

Język powinien pozostać idiomatyczny. Pureline usuwa zbędny szum, nie odbierając przy tym cech, które sprawiają, że Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald czy Emvus są w ogóle skuteczne.
