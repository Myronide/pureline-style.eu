# Pureline Code Style

Standard kodowania Pureline 1.7, uporządkowany według tematów i języków. Zacznij od [przeglądu](overview.md), przeczytaj reguły wspólne, a następnie zastosuj odpowiedni profil języka.

**Liniowy przepływ. Jawny zamiar. Minimalny szum. Małe jednostki. Jasna własność. Spójność ponad rozmiar.**

## Jak stosować ten przewodnik {#how-to-apply-this-guide}

- Reguły wspólne obowiązują wszędzie tam, gdzie język pozwala je zastosować w naturalny sposób.
- Składnia właściwa danemu językowi i jawne wyjątki profilu mają pierwszeństwo. Na przykład Crystal dopuszcza proste guardy w postaci przyrostkowej, Rust dopuszcza `let ... else` i stosuje rustfmt, Novus używa `pureline:allow-else` dla uzasadnionych gałęzi `else`, a Emvus dopuszcza opcjonalne średniki.
- Profil React opiera się na profilach JavaScript i TypeScript. Dla plików `.tsx` / `.jsx` stosuj wszystkie trzy razem.
- TypeScript dziedziczy profil JavaScript, oprócz własnych reguł.
- Zakresy rozmiaru funkcji i klas są heurystykami do przeglądu kodu. Spójną logikę trzymaj razem; sama liczba linii nie jest naruszeniem.
- W przeglądach i diagnostyce zachowuj stabilne identyfikatory reguł. Zobacz [model narzędzi](tooling.md).

## Reguły wspólne {#shared-rules}

| Przewodnik | Zawartość |
|---|---|
| [Zasady podstawowe](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Przepływ sterowania](core/control-flow.md) | Guard clauses, wczesne błędy, jawne bloki, unikanie zbędnego `else` |
| [Nazewnictwo](core/naming.md) | Znaczące nazwy i konwencje lokalne |
| [Funkcje](core/functions.md) | Jedna odpowiedzialność i wskazówki dotyczące rozmiaru |
| [Klasy i moduły](core/structure.md) | Granice odpowiedzialności, gęstość folderów, Spójność ponad rozmiar |
| [Formatowanie](core/formatting.md) | Zwarte wywołania i sensowne grupowanie w pionie |
| [Komentarze](core/comments.md) | Wyjaśniaj, dlaczego nietypowe zachowanie jest konieczne |
| [Architektura](core/architecture.md) | Uzasadnione abstrakcje, kierunek zależności, jawne zależności |
| [Stan i efekty uboczne](core/state-and-side-effects.md) | Widoczne efekty i zamierzona mutacja |
| [Wydajność](core/performance.md) | Świadoma optymalizacja gorących ścieżek |

## Reguły specyficzne dla języków {#language-specific-rules}

| Profil | ID reguł | Szczególne wytyczne |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Rekordy, interfejsy z prefiksem `I`, obsługa null, współbieżność, symetria cyklu życia |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Nawiasy klamrowe, średniki, `const`, async/await, callbacki |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | Dziedziczenie po JavaScript, typy jawne lub wnioskowane, `unknown`, interfejsy i unie |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Guardy błędów, idiomatyczne nazewnictwo, małe interfejsy po stronie konsumenta, `defer`, gorutyny |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Guardy przyrostkowe, snake_case, wnioskowanie typów, obsługa nil, makra |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, średniki, klasy danych, makra AST, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, cykle życia zadań; zamierzony projekt języka |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Własność, Result/Option, dopasowanie wzorców, rustfmt, RAII, async i FFI, typy błędów, centralne lintery, bezpieczeństwo anulowania, umiejscowienie testów |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, pakiety i importy, komponenty `.nvh`, treść Markdown `.nvmd` |
| [React](languages/react.md) | `PL-REACT-001`–`PL-REACT-014` | React 19 ze ścisłym TypeScriptem: guardy, hooki, efekty, propsy, kontekst, klucze, czyste renderowanie, routing |
| [Python](languages/python.md) | `PL-PY-001`–`PL-PY-012` | Nazewnictwo wg PEP 8, guard clauses, podpowiedzi typów, konkretne wyjątki, dataclasses, ruff i kontrolery typów |
| [QML](languages/qml.md) | `PL-QML-001`–`PL-QML-011` | Komponenty Qt 6, `required property`, powiązania, tokeny Theme, layouty, qmllint |
| [Astro](languages/astro.md) | `PL-AS-001`–`PL-AS-009` | Typowany frontmatter, domyślnie statycznie, jawne wyspy, style o zasięgu lokalnym, kolekcje treści |
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` | Elementy semantyczne, jedna struktura nagłówków, etykiety, tekst alternatywny, nagłówek dokumentu, walidacja |
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` | Tokeny, warstwy kaskady, niska specyficzność, brak `!important`, właściwości logiczne, ograniczony ruch |
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Nazewnictwo, nullable reference types, rekordy, `using`, async z Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Komponenty standalone, sygnały, OnPush, typowane formularze, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, typowane propsy, computed, composables, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Typowanie statyczne, `@export`, `@onready`, sygnały, gdformat i gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Jawna własność sterty, kody błędów, guard clauses, clang-format i clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, wyłączna własność, domyślnie const, `std::expected`, podział nagłówków |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Domyślnie local, tablice modułów, jawne sprawdzanie nil, luacheck i StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` i `const`, solidna null safety, parametry nazwane, typy sealed |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Małe metody build, widżety const, jedno podejście do stanu, sprawdzanie mounted |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Domyślnie niezmienne, typy wyniku, `or {}`, typy opcji, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` zamiast `var`, guard let, typy wartościowe, kontrola dostępu, swift-format i SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` zamiast `var`, klasy danych, typy sealed, null safety, ktlint i detekt |

Zobacz także [przegląd profili języków](languages/README.md) i [wymagania dotyczące narzędzi](tooling.md).

## Specyfikacja i utrzymanie {#specification-and-maintenance}

Te pliki tematyczne zachowują reguły, przykłady, zastrzeżenia i stabilne identyfikatory ze [Specyfikacji Pureline 1.7](../../PURELINE_SPECIFICATION_1.7.md), wersjonowanego źródła referencyjnego. Numery sekcji pominięto, aby każdy temat można było czytać niezależnie; identyfikatory reguł pozostają bez zmian.

Przy zmianie wytycznych utrzymuj spójność oryginalnej specyfikacji z odpowiadającym jej plikiem tematycznym. Nie zmieniaj numeracji istniejących identyfikatorów reguł i nie zamieniaj heurystyk przeglądu w twarde naruszenia.
