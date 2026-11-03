# Narzędzia i stabilne identyfikatory reguł

[Przewodnik po stylu kodu](README.md) · [Oryginalna specyfikacja 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Model narzędzi {#tooling-model}

Narzędzia Pureline powinny współdzielić tę samą specyfikację reguł w:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Diagnostyka powinna odwoływać się do stabilnych identyfikatorów reguł.

Przykład:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

Dzięki temu strona internetowa, CLI, formatter, linter i integracje z IDE pozostają spójne.

**Narzędzia Novus:** serwer języka Novus raportuje już `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` i `PL-NAME-001` ze źródłem `pureline`, gdy ustawiono `novus.pureline.enabled`. Strony `.nvmd` są sprawdzane przez wygenerowany z nich plik `.nvh`, a generator zgłasza błędy w linii pliku `.nvmd`. Jego progi (30/50 linii na metodę, 200 linii na plik, 10 plików w folderze) to wartości domyślne, które projekty mogą dostosować; wyjątek `// pureline:allow-else <reason>` musi zawierać uzasadnienie.

**Wymaganie dla narzędzi Emerald i Emvus:** używaj osobnych gramatyk dla `.ems` i `.ev`. Checker musi odróżniać prawdziwą składnię i rozwiązane konstrukcje AST od tekstowych sobowtórów; deklaracje generowane przez makra, wnioskowane formy krotek i list, opcjonalne nawiasy w deklaracjach metod oraz opcjonalne średniki w Emvus wymagają obsługi świadomej języka. Istniejące i nowo dodane identyfikatory profili muszą dawać spójną diagnostykę we wszystkich narzędziach.

**Wersjonowanie:** reguły Rust używają stabilnych identyfikatorów `PL-RS-*`; reguły Novus, React, Python, QML, Astro, HTML, CSS, Emerald i Emvus używają identyfikatorów `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*` i `PL-EV-*`. Ustalone identyfikatory `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*` i `PL-CR-*` nie są renumerowane. Wersja 1.4 dodała `PL-CORE-022` i `PL-STRUCT-003`; wersja 1.5 dodała `PL-RS-001`–`PL-RS-020`; wersja 1.6 dodała `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014` i `PL-RS-021`–`PL-RS-024`; wersja 1.7 dodaje `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009` i `PL-CSS-001`–`PL-CSS-012`, bez zmiany numeracji istniejących reguł.

**Języki wersji 1.7:** Wersja 1.7 dodaje również profile C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) i Kotlin (`PL-KT-001`–`PL-KT-011`), bez zmiany numeracji istniejących reguł.
