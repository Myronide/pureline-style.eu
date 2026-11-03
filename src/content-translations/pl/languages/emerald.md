# Emerald Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Emerald {#emerald-profile}

Pureline Emerald stosuje **natywną składnię Emerald** zamiast zapożyczać proponowaną składnię Emvus. Emerald jest też językiem bootstrapu dla Emvus, więc to rozróżnienie ma znaczenie dla narzędzi i kodu kompilatora.

### PL-EMS-001 — Zachowaj natywną składnię Emerald {#pl-ems-001--keep-emerald-syntax-native}

Emerald używa plików `.ems`, deklaracji `namespace` i `use` z `::`, typów zwracanych przed nazwami metod oraz średników.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

**Nie** przepisuj deklaracji Emerald na `package`, `method<T>`, `where` ani kod bez średników z Emvus. To są różne języki.

### PL-EMS-002 — Używaj średników konsekwentnie {#pl-ems-002--use-semicolons-consistently}

Stosuj się do opartej na średnikach składni instrukcji Emerald. Formatter nie może stosować do plików `.ems` reguły opcjonalnych średników z Emvus.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Nazwy i organizacja plików {#pl-ems-003--names-and-file-organization}

- Typy: `PascalCase`.
- Interfejsy: prefiks `I` (`IStorage`, `IPacket`).
- Metody, parametry, pola i zmienne lokalne: `camelCase`.
- Stałe: `UPPER_SNAKE_CASE`, tam gdzie ma to zastosowanie.
- Deklaracje `namespace` i `use` utrzymuj jawne.
- Preferuj pliki źródłowe nazwane od ich głównego typu, z poszanowaniem istniejących konwencji nazewniczych repozytoriów Emerald (na przykład `SessionService.ems`).
- Domyślnie używaj co najwyżej **8** produkcyjnych plików `.ems` na folder źródłowy/przestrzeni nazw; testy i kod generowany są wyłączone.

Nie zmieniaj nazw istniejących, działających plików źródłowych tylko po to, by spełnić hipotetyczną konwencję międzyjęzykową.

### PL-EMS-004 — Guard clauses z nawiasami klamrowymi {#pl-ems-004--guard-clauses-with-braces}

Używaj jawnych bloków i trzymaj główną ścieżkę bez zagnieżdżeń.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Unikaj `else`, gdy wczesny `return`, `continue` lub inne zakończenie czyni go zbędnym. Jednoliniowe instrukcje `if` bez nawiasów klamrowych nie są Pureline Emerald.

### PL-EMS-005 — Zarówno jawne typy, jak i `var` są poprawne {#pl-ems-005--explicit-types-and-var-are-both-valid}

Używaj zadeklarowanego typu, gdy wyjaśnia granicę API. Używaj `var` tam, gdzie statycznie wnioskowany typ jest od razu oczywisty; `var` **nie** oznacza żądania typowania dynamicznego.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Żadnej z form nie należy zgłaszać jako naruszenia stylu tylko dlatego, że możliwa jest druga.

### PL-EMS-006 — Zachowaj model obiektowy Emerald {#pl-ems-006--preserve-emeralds-object-model}

Używaj zwykłej formy wywołania konstruktora z Emerald, bez słowa kluczowego `new` w stylu Javy.

```java
Connection connection = Connection();
```

Konstruktory, pola, dziedziczenie i interfejsy utrzymuj jawne. Preferuj małe, spójne klasy zamiast dodatkowych warstw manager/factory bez konkretnej odpowiedzialności.

### PL-EMS-007 — Preferuj klasy danych dla typów o charakterze danych {#pl-ems-007--prefer-data-classes-for-data-shaped-types}

Gdy typ głównie grupuje powiązane dane, a obsługiwane przez Emerald generowane składowe są odpowiednie, preferuj klasę danych zamiast powtarzalnego kodu szablonowego.

```java
public data class Coordinate(Int x, Int y);
```

Generowanie klas danych w Emerald obejmuje konstruktor, `equals`, `toString`, `copy` oraz metody `withX`, tam gdzie ma to zastosowanie. Nie zakładaj, że funkcje klas danych dostępne tylko w Emvus, takie jak `copy` z argumentami nazwanymi, generowane `hashCode` czy destrukturyzacja Emvus, są już częścią Emerald.

### PL-EMS-008 — Używaj makr tylko dla prawdziwych abstrakcji czasu kompilacji {#pl-ems-008--use-macros-only-for-genuine-compile-time-abstractions}

System makr AST w Emerald nadaje się do powtarzalnego generowania struktur, a nie do maskowania zwykłej logiki programu.

- Preferuj małe, wyraźnie nazwane makra adnotacji.
- Zadbaj, by generowane pola i metody były wykrywalne dla opiekunów kodu i narzędzi.
- Unikaj zastępowania prostej metody trudnym do debugowania zachowaniem makra.
- Nie polegaj na nieudokumentowanych możliwościach makr i nie modyfikuj po cichu niepowiązanych deklaracji.
- Oddzielaj transformacje czasu kompilacji od efektów ubocznych czasu wykonania.

### PL-EMS-009 — Uczyń ścieżki błędów jawnymi {#pl-ems-009--make-error-paths-explicit}

Używaj mechanizmu błędów obsługiwanego przez rzeczywiste API Emerald. Gdy funkcja zwraca `Result<T, E>`, obsłuż go lub przekaż dalej świadomie. Nie kopiuj do kodu Emerald konstrukcji specyficznych dla Emvus, takich jak `success value`, `fail error`, przyrostkowe `?` czy `scoped`, o ile ta składnia nie jest tam osobno zaimplementowana.

Odrzucaj niepoprawne dane wejściowe wcześnie i czyń nieoczekiwane awarie widocznymi, zamiast je połykać.

### PL-EMS-010 — Współbieżność ma właściciela {#pl-ems-010--concurrency-has-ownership}

Z `Fiber`, `@Async`, `@Synchronized` i mechanizmów wątków w Emerald należy korzystać z jawnymi cyklami życia.

- Nie wykonuj pracy blokującej na nieodpowiednich wątkach wykonawczych.
- Oczekuj na zakończenie operacji, których wyniki lub błędy mają znaczenie.
- Synchronizuj współdzielony stan modyfikowalny świadomie.
- Nie myl wykonania asynchronicznego z automatycznym bezpieczeństwem wątkowym.

### PL-EMS-011 — Utrzymuj kod wrażliwy na Flow w zrozumiałej postaci {#pl-ems-011--keep-flow-sensitive-code-understandable}

Emerald Flow może optymalizować alokacje i czas życia obiektów, ale czytelna semantyka kodu źródłowego ma priorytet.

- Preferuj stabilne referencje lokalne, gdy wielokrotne odczyty byłyby niejednoznaczne.
- Nie polegaj ręcznie na nieudokumentowanych wyborach przechowywania `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` ani `Static`.
- Unikaj ukrytych ucieczek i przypadkowych, długo żyjących referencji w gorących ścieżkach.
- Traktuj strategie optymalizatora jako szczegóły implementacyjne kompilatora, a nie rytuały kodowania na poziomie źródła.

### PL-EMS-012 — Testuj abstrakcje widoczne dla kompilatora {#pl-ems-012--test-compiler-facing-abstractions}

Dla kodu kompilatora, AST i środowiska uruchomieniowego pisz testy warunków brzegowych, ścieżek błędów, generowanych składowych i zachowania czasu życia obiektów. Krótsza metoda nie jest automatycznie lepsza, jeśli ukrywa przejście między fazami lub ważny efekt uboczny.
