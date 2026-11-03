# Emvus Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Emvus {#emvus-profile}

Pureline Emvus opiera się na **aktualnym projekcie języka Emvus**. To profil stylu dla zamierzonej składni `.ev`, a nie twierdzenie, że każda prezentowana funkcja jest już zaimplementowana w Ring 1. Utrzymuj Emvus oddzielnie od Emerald.

### PL-EV-001 — Natywne deklaracje metod {#pl-ev-001--native-method-declarations}

Deklaruj metody za pomocą `method` i, w razie potrzeby, typu zwracanego w `method<Type>`. Zmienne typów generycznych wprowadza się przez `where`, a nie przez dołączanie kolejnej listy parametrów generycznych do nazwy metody.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Metoda bez jawnego typu zwracanego zwraca `Void`.

### PL-EV-002 — Puste nawiasy w deklaracjach są opcjonalne; nawiasy przy wywołaniu nie {#pl-ev-002--empty-declaration-parentheses-are-optional-call-parentheses-are-not}

Obie deklaracje bez parametrów są zgodne z Pureline:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Obie formy zapisu deklarują metody bez argumentów; różnica jest kosmetyczna i **nie** stanowi rozróżnienia przeciążeń. Aby wykonać metodę, zawsze pisz `refresh()` lub `shutdown()`; `object.refresh` nie jest wywołaniem metody. Formattery powinny zachowywać lub konsekwentnie konfigurować każdy z poprawnych stylów deklaracji, nie oznaczając drugiego jako błąd.

### PL-EV-003 — Nawiasy klamrowe wymagane; średniki opcjonalne {#pl-ev-003--braces-required-semicolons-optional}

Dla `if`, pętli i porównywalnych konstrukcji sterujących używaj jawnych bloków `{ ... }`. W idiomatycznym Emvus preferuj pomijanie opcjonalnych średników, ale nie odrzucaj istniejącego poprawnego kodu zakończonego średnikami.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Jednoliniowe guardy bez nawiasów klamrowych oraz zbędne bloki `else` nie są Pureline. Linie kontynuacji i długie wyrażenia zapisuj jednoznacznie.

### PL-EV-004 — Nazewnictwo, importy i widoczność {#pl-ev-004--naming-imports-and-visibility}

- Typy: `PascalCase`; interfejsy: prefiks `I` (`IStorage`, `IConnection`).
- Metody, pola, właściwości, parametry i zmienne lokalne: `camelCase`.
- Stałe: `UPPER_SNAKE_CASE`.
- Pakiety: ścieżki rozdzielone kropkami, pisane małymi literami.
- Nazwy plików źródłowych: **camelCase**, na przykład `sessionService.ev`, nawet jeśli główna klasa to `SessionService`.
- Domyślna widoczność to `public`; w razie potrzeby podaj `private` lub `protected`.
- Rozwiązywanie symboli nie rozróżnia wielkości liter, ale pisownia w kodzie źródłowym jest zachowywana: konsekwentnie używaj **zadeklarowanej pisowni** i nie definiuj nazw różniących się tylko wielkością liter.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Używaj jawnych importów i aliasów zamiast polegać na mylących kolizjach.

### PL-EV-005 — Typy powinny komunikować zamiar {#pl-ev-005--types-should-communicate-intent}

Emvus jest domyślnie typowany statycznie. `var` wykonuje **statyczne wnioskowanie typów**; `dynamic` jawnie żąda zachowania z typowaniem w czasie wykonania.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Używaj `dynamic` na granicach rzeczywiście dynamicznych, a nie po to, by omijać zwykłe sprawdzanie typów. Zarówno jawne, jak i wnioskowane statyczne typy lokalne są zgodne z Pureline.

### PL-EV-006 — Obsługuj nullowalność przez stabilny przepływ {#pl-ev-006--handle-nullability-through-stable-flow}

Emvus nie wymaga adnotacji `T?`. Śledzi stany null przez przepływ sterowania. Wcześnie zabezpiecz wartość, która może być null, i przed rozumowaniem o jej nullowalności preferuj stabilną lokalną migawkę modyfikowalnych właściwości.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Nigdy nie zakładaj, że wielokrotne, niezsynchronizowane odczyty modyfikowalnej właściwości zwrócą tę samą wartość. Wymaganą inicjalizację pól uczyń jawną.

### PL-EV-007 — Dla oczekiwanych błędów preferuj typowaną obsługę Result {#pl-ev-007--prefer-typed-result-handling-for-expected-failures}

Emvus nie ma składni `try/catch/finally`. Używaj `Result<T, E>`, `success`, `fail`, `?` i `switch`, zgodnie ze specyfikacją języka.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` służy do świadomej propagacji błędów tam, gdzie pozwalają na to typy.
- `!` powoduje panic w razie błędu; zarezerwuj go dla ugruntowanych niezmienników lub kontroli na granicach, po których naprawdę nie da się wrócić do poprawnego stanu.
- Nie porzucaj `Result` ani nie ukrywaj oczekiwanej awarii za `panic`.
- Zachowuj rozdział między `success`, `fail` i `return`, zamiast niepotrzebnie opakowywać każdą operację.

### PL-EV-008 — Uwidoczniaj czas życia zasobów za pomocą `scoped` {#pl-ev-008--make-resource-lifetimes-visible-with-scoped}

Używaj konstrukcji `scoped` z Emvus dla zasobów, które muszą zostać zamknięte po zakończeniu ich zakresu.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Nie zastępuj `scoped` konstrukcją `try-with-resources` z Javy, `defer` z Go ani nieistniejącym `finally` w Emvus. Czas życia zasobu powinien pozostać jasny nawet wtedy, gdy kompilator optymalizuje pamięć.

### PL-EV-009 — Preferuj klasy danych zamiast kodu szablonowego {#pl-ev-009--prefer-data-classes-to-boilerplate}

Używaj `data class` dla małych, nazwanych typów skoncentrowanych na danych, korzystając z wbudowanego generowanego zachowania.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Główne właściwości danych są tylko do odczytu poza inicjalizacją. `copy()` i `withX(...)` wyrażają zmodyfikowane kopie i domyślnie są płytkie. Tam, gdzie to właściwe, preferuj generowane porównywanie, haszowanie i reprezentację tekstową zamiast pisania ich ręcznie. Większe typy z bogatym zachowaniem pozostaw jako zwykłe klasy.

**Nie wprowadzaj osobnego wymogu stylu `record`:** uzgodniony projekt Emvus używa `data class` dla nazwanych modeli danych i `Dictionary` dla danych w postaci słowników/literałów obiektowych.

### PL-EV-010 — Listy, krotki i słowniki zachowują zdefiniowaną semantykę {#pl-ev-010--lists-tuples-and-dictionaries-retain-their-defined-semantics}

Dla literałów `[...]` **dokładna równość typów wszystkich elementów** oznacza `List`; w przeciwnym razie wyrażenie jest krotką. Nie pozwól, by Pureline nadpisywał sterowaną typami regułę języka preferencją stylistyczną.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Literały słowników mają postać `{ key: value }`; wnioskowane mieszane typy wartości używają `dynamic`, tam gdzie wymaga tego model języka. Do słowników odwołujemy się przez **klucze**, a nie przez notację z kropką właściwą strukturalnym rekordom.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Zmiana typu elementu może zasadnie zmienić wnioskowanie listy lub krotki. Tam, gdzie to właściwe, utrzymuj to zachowanie widoczne na granicach API przez jawnie zadeklarowane typy.

### PL-EV-011 — Destrukturyzacja jest pozycyjna {#pl-ev-011--destructuring-is-positional}

Używaj `{ ... }` do destrukturyzacji składowych krotki lub klasy danych w kolejności deklaracji. `_` pozwala pominąć element.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Nie interpretuj destrukturyzacji na nowo jako dopasowania nazwanych rekordów. Preferuj krótkie, znaczące powiązania zamiast bezrefleksyjnego rozpakowywania.

### PL-EV-012 — `switch` powinien ujawniać pełne rozgałęzienie {#pl-ev-012--switch-should-expose-complete-branching}

Używaj instrukcji lub wyrażeń `switch` dla rzeczywistych alternatyw stanu. Wyrażenia muszą być wyczerpujące albo mieć zdefiniowaną gałąź domyślną / awaryjną.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Dla `Result` preferuj czytelne wzorce `success(...)` i `error(...)` zamiast zagnieżdżonych warunków. Wzorce wychwytujące wszystko stosuj świadomie, a nie jako sposób na ukrycie zapomnianych przypadków.

### PL-EV-013 — Kaskad używaj tylko wtedy, gdy wyjaśniają pojedynczego odbiorcę {#pl-ev-013--use-cascades-only-when-they-clarify-a-single-receiver}

Kaskady z `..` są przydatne przy krótkiej sekwencji operacji na tym samym odbiorcy.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Unikaj łańcuchów, które ukrywają niepowiązane efekty, niejawnie modyfikują kilka obiektów lub rozciągają się na wiele instrukcji.

### PL-EV-014 — Fibery i wątki wymagają jasnych cykli życia {#pl-ev-014--fibers-and-threads-need-clear-lifecycles}

`fiber {}`, `virtual {}` i `thread {}` to odrębne konstrukcje wykonawcze o wspólnym wzorcu wyniku zadania. Wybieraj je według rzeczywistego obciążenia, a nie dlatego, że współbieżność wygląda zwięźle.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Oczekuj na wyniki i błędy, które mają znaczenie.
- Dla długo działających zadań uczyń anulowanie i własność jasnymi.
- Synchronizuj współdzielony stan modyfikowalny; tam, gdzie to właściwe, dostępny jest `@Synchronized`.
- Nie zakładaj, że obiekt przechwycony przez zadanie jest lokalny dla stosu ani że można go zwolnić po powrocie z metody uruchamiającej.
- Unikaj ukrytej pracy typu fire-and-forget w zwykłych metodach biznesowych.

### PL-EV-015 — Makra muszą poprawiać wykrywalność, nie ją zaciemniać {#pl-ev-015--macros-must-improve-discoverability-not-obscure-it}

Makra Emvus to transformacje AST w czasie kompilacji z deklaracjami celu, `quote`, podstawianiem `$(...)` i API budowniczych AST.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline wymaga:

- Małych makr z jasno określoną odpowiedzialnością i obsługiwanymi celami.
- Deterministycznej ekspansji; kolejność wykonania w kodzie źródłowym i powstające składowe pozostają wykrywalne.
- Higieny, aby uniknąć przypadkowych kolizji nazw.
- Diagnostyki kompilatora, gdy ekspansja tworzy kod konfliktowy lub niepoprawny.
- Zwykłych metod zamiast makr, gdy nie ma istotnej korzyści z czasu kompilacji.
- Braku polegania na niezweryfikowanych efektach ubocznych w czasie działania makra: operacjach I/O, sieci, zegarze lub losowości.

Wygenerowany kod musi spełniać kontrole semantyczne; narzędzia checker/formatter nie powinny traktować wygenerowanych miejsc jak zwykłych, ręcznie utrzymywanych plików.

### PL-EV-016 — Nie programuj pod wewnętrzne mechanizmy HyperAlloc Flow {#pl-ev-016--do-not-program-against-hyperalloc-flow-internals}

Kod Emvus może być optymalizowany przez Sublang, Optimind i HyperAlloc Flow. Programiści powinni wyrażać **semantykę i czasy życia**, a nie ręcznie zgadywać przyszłą strategię alokacji.

- Preferuj proste cykle życia obiektów i stabilną własność.
- Utrzymuj współdzielony stan modyfikowalny jawnym, zwłaszcza między zadaniami.
- Dla prostych wartości preferuj niezmienne klasy danych, gdy pasują do domeny.
- Nie buduj API wokół założeń, że obiekt jest zawsze alokowany na stosie, zastępowany skalarami lub pulowany.
- Alokacje i ucieczki w gorących ścieżkach oceniaj za pomocą pomiarów i diagnostyki, a nie folkloru.

### PL-EV-017 — Gęstość pakietów i organizacja źródeł {#pl-ev-017--package-density-and-source-organization}

Pakiet/folder źródłowy powinien domyślnie zawierać co najwyżej **8** produkcyjnych modułów `.ev`. Testy, kod generowany i pliki zawierające wyłącznie metadane nie są wliczane. Dziel według rzeczywistej odpowiedzialności funkcji, zamiast mechanicznie tworzyć dowolne podpakiety.

Nazwa pakietu i nazwa pliku to różne pojęcia: `app.session` pozostaje pisane małymi literami, a `sessionService.ev` jest w `camelCase`.

### PL-EV-018 — Reguły natywne dla języka mają pierwszeństwo przed naśladowaniem innych języków {#pl-ev-018--language-native-rules-override-cross-language-imitation}

Narzędzia Pureline nie mogą zgłaszać naruszenia tylko dlatego, że Emvus różni się od Javy, Emerald, Rusta czy Go:

- Opcjonalne `()` w **deklaracjach metod bez parametrów** są poprawne; wywołania zawsze wymagają `()`.
- Opcjonalne średniki są poprawne.
- `where` jest natywną składnią deklaracji generycznych.
- `var` jest wnioskowany statycznie; `dynamic` jest jawnie dynamiczny.
- `success`, `fail`, `?`, `!`, `scoped` i makra AST mają w Emvus swoje własne znaczenia.
- `{ ... }` ma poprawne zastosowania zależne od kontekstu, w tym słowniki i destrukturyzację pozycyjną.
- `[ ... ]` jest typowane jako lista lub krotka zgodnie z regułą Emvus dotyczącą dokładnego typu elementów.

Formatter powinien rozumieć AST, zachowywać znaczenie i nigdy nie stosować do plików `.ev` przestrzeni nazw `::` ani wymogu średników z Emerald.
