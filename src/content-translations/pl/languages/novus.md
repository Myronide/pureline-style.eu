# Novus Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Novus to samohostujący się język kompilowany do przenośnego C, z wartościami typowanymi dynamicznie, opcjonalnym typowaniem statycznym, renderowanymi po stronie serwera komponentami `.nvh` oraz treścią Markdown `.nvmd` przez [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Profil opiera się na przykładach Novus, bibliotece standardowej i regułach, które serwer języka Novus sprawdza, gdy włączona jest diagnostyka stylu Pureline (`novus.pureline.enabled`). [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

Identyfikatory reguł `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` i `PL-NAME-001` to te, które serwer języka Novus już raportuje ze źródłem `pureline`. Reguły specyficzne dla Novus poniżej używają prefiksu `PL-NV-*`.

## Profil Novus {#novus-profile}

### PL-NV-001 — Nazewnictwo i widoczność {#pl-nv-001--naming-and-visibility}

- Klasy, enumy i komponenty: `PascalCase`.
- Metody, pola, zmienne lokalne i parametry: `lowerCamelCase`.
- Nazwy pakietów (folderów): krótkie, małymi literami, bez separatorów.
- Stałe: `private final SCREAMING_SNAKE_CASE` na poziomie pliku.
- Składowe utrzymuj prywatne, dopóki nie używa ich inny pakiet lub plik. Pola udostępniaj przez `: get` lub `: get, set` tylko wtedy, gdy wywołujący ich potrzebują.
- Krótkie nazwy są dozwolone dla liczników pętli (`i`, `j`, `k`). Inne nazwy jednoliterowe i zastępcze (`tmp`, `obj`, `thing`, `data2`) są zgłaszane przez `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002 — Guard clauses i liniowy przepływ {#pl-nv-002--guard-clauses-and-linear-flow}

Waliduj najpierw, wracaj wcześnie i trzymaj główną ścieżkę na bazowym poziomie wcięcia.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Unikaj `else` po gałęzi, która już robi return, break lub continue (`PL-CF-002`). Gdy `else` jest naprawdę najczytelniejszą formą, oznacz linię uzasadnionym wyjątkiem:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Deklaracje: `final`, `var` i jawne typy {#pl-nv-003--declarations-final-var-and-explicit-types}

- Używaj `final` dla wartości, które nigdy się nie zmieniają; używaj `var` dla zmiennych lokalnych, których typ jest oczywisty z inicjalizatora.
- Podawaj zadeklarowany typ tam, gdzie czytelnik musiałby inaczej zgadywać, oraz na granicach API (pola, parametry, typy zwracane).
- Pamiętaj, że jawny typ konwertuje wartość: `integer x = 2.9` zapisuje `2`. Czyń takie konwersje widocznymi, zamiast polegać na nich przypadkiem.
- Novus nie ma przypisań złożonych. Pisz `count = count + 1`, a nie `count += 1`, i trzymaj tę instrukcję w jednej linii.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

### PL-NV-004 — Konstrukcja i literały obiektowe {#pl-nv-004--construction-and-object-literals}

- Używaj literałów obiektowych (`Person{name="Tom"}`) dla zwykłych danych bez zachowania.
- Używaj `construct()`, gdy obiekt musi ustanawiać niezmienniki, wyprowadzać pola lub walidować argumenty.
- Nie ukrywaj istotnej pracy w inicjalizatorach pól; konstrukcję utrzymuj jawną w `construct()`.
- Łańcuch dziedziczenia `based` powinien opisywać rzeczywistą relację „jest czymś”. Gdy współdzielone jest tylko zachowanie, preferuj `interface`.

### PL-NV-005 — Sygnatury metod {#pl-nv-005--method-signatures}

- Deklaruj typy parametrów i zwracane, gdy sygnatura jest częścią API, granicy modułu lub komponentu `.nvh`.
- Dla zwykłych metod używaj `method name(args): type { }`; listy parametrów utrzymuj na tyle krótkie, by dało się je ogarnąć wzrokiem.
- Przeciążenia metod według liczby lub typu parametrów są dozwolone, gdy znaczenie jest identyczne. Nie używaj przeciążeń, by ukryć różne zachowania pod jedną nazwą.

### PL-NV-006 — Rozmiar funkcji jest sygnałem do przeglądu {#pl-nv-006--function-size-is-a-review-signal}

Serwer języka przegląda metodę przy 30 liniach i zgłasza ją powyżej 50 linii (`PL-FN-001`). To progi przeglądowe. Spójna metoda, która wykonuje jedną rzecz sekwencyjnie, może pozostać dłuższa; podziel ją, gdy miesza odpowiedzialności, takie jak parsowanie, walidacja i I/O.

### PL-NV-007 — Pakiety, importy i gęstość folderów {#pl-nv-007--packages-imports-and-folder-density}

- Folder jest pakietem. Importuj najwęższą potrzebną jednostkę: `import geo/circle` lub `import @helpers` zamiast importować cały pakiet, gdy wystarczy jeden plik.
- Domyślnie utrzymuj co najwyżej **10 plików `.nv` / `.nvh`** na folder (`PL-STRUCT-002`). Dziel wzdłuż granic odpowiedzialności, a nie na bezsensowne zagnieżdżone foldery.
- Plik przeglądaj przy **200 liniach** (`PL-STRUCT-001`). To próg przeglądowy, a nie twardy limit: utrzymuj jedną odpowiedzialność na plik i pozwól spójnej logice zostać razem.

### PL-NV-008 — Współbieżność ma widocznego właściciela {#pl-nv-008--concurrency-has-visible-ownership}

- Uwidoczniaj współbieżność w miejscu wywołania: `async` / `await`, `thread`, `virtual` i `sync` mówią, co działa i gdzie.
- Śledź każde zadanie, które ma znaczenie. Nie uruchamiaj pracy typu fire-and-forget, jeśli program później zależy od jej wyników.
- Współdzielony stan modyfikowalny chroń jawnie za pomocą `sync`, zamiast polegać na kolejności wywołań.
- Przy zamykaniu i anulowaniu stosuj tę samą dyscyplinę co w [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown).

### PL-NV-009 — Kolejność ewaluacji jest udokumentowana, a nie zakładana {#pl-nv-009--evaluation-order-is-documented-not-assumed}

Novus oblicza operandy od lewej do prawej i dokumentuje wyjątki. Nie pisz kodu, którego wynik zależy od nietypowej kolejności. Efekty uboczne trzymaj w osobnych instrukcjach i unikaj łączenia w jednym wyrażeniu odczytu zmiennej globalnej lub pola z późniejszym wywołaniem, które je zmienia.

Łańcuch `..` służy do budowania obiektu lub tablicy w jednej liniowej sekwencji (`var names = []..append("Ada")..append("Grace")`). Używaj go, gdy każdy krok jest wywołaniem lub przypisaniem składowej na tym samym odbiorcy. Rozbij łańcuch na nazwane kroki, gdy któryś krok wymaga komentarza lub rozgałęzienia.

### PL-NV-010 — Bloki C i granice platformy {#pl-nv-010--c-blocks-and-platform-boundaries}

Blok `c { ... }` jest granicą natywną. Utrzymuj go małym, izoluj w wyspecjalizowanym pliku i wyjaśnij komentarzem, co kod C zakłada o typach, czasach życia i platformie. Udostępnij funkcję natywną przez metodę Novus z typowaną sygnaturą, tak aby reszta kodu nigdy nie widziała surowych szczegółów C.

### PL-NV-011 — Komponenty `.nvh` rozdzielają markup i logikę {#pl-nv-011--nvh-components-keep-markup-and-logic-apart}

W komponencie `.nvh`:

- Stan reaktywny deklaruj za pomocą `ref` wewnątrz `<?nv ... ?>` na początku komponentu.
- Handlery i obliczenia trzymaj w blokach Novus; HTML niech skupia się na strukturze i prezentacji.
- Wartości pochodne obliczaj w jednym miejscu, zamiast powtarzać wyrażenie w kilku miejscach markupu.
- Traktuj każdy komponent jako jedną odpowiedzialność, tak samo jak klasę (`PL-STRUCT-001`).

### PL-NV-012 — Komentarze i diagnostyka {#pl-nv-012--comments-and-diagnostics}

- Komentarze wyjaśniają dlaczego, a nie co: powód obejścia, osobliwość platformy lub nieoczywisty niezmiennik ([PL-DOC-001](../core/comments.md)).
- Diagnostyka Pureline jest w edytorze opcjonalna (`novus.pureline.enabled`). Włącz ją we wspólnych projektach, aby te same identyfikatory reguł pojawiały się w każdym edytorze i w CI.
- Każdy wyjątek `pureline:allow-else` wymaga uzasadnienia w tej samej linii. Wyjątek bez uzasadnienia jest uwagą w przeglądzie.

### PL-NV-013 — Treść Markdown (`.nvmd`) {#pl-nv-013--markdown-content-nvmd}

Plik `.nvmd` to Markdown z Novus w środku, tak jak `.mdx` to Markdown z JSX. Generator z [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) zamienia `Page.nvmd` na `Page.nvh` przed uruchomieniem kompilatora. Powyższe reguły stosuj do bloku nagłówka i do wszelkich modułów `.nv`, które importuje; treść Markdown podlega następującym regułom:

- Treść niesie zawartość. Blok nagłówka (`<?nv ... ?>`) niesie tylko to, czego potrzebuje strona: importy, propsy i kilka metod. Logikę dłuższą niż kilka linii przenieś do modułu `.nv` i zaimportuj ją.
- Klucze frontmattera to propsy strony. Utrzymuj je krótkie i płaskie oraz używaj `{title}` zamiast powtarzać wartość w tekście.
- Każde `{expr}` ogranicz do jednej wartości lub jednego wywołania. Wszystko dłuższe oblicz w nagłówku lub w module, aby treść czytała się od góry do dołu jak proza.
- Bloki `{#if}` i `{#for}` utrzymuj na głębokości najwyżej dwóch poziomów. Gdy blok powtarza markup, użyj komponentu (`<Callout>`, `<Toc>`).
- Nagłówek o dynamicznym tekście dostaje jawny identyfikator (`# {title} {#intro}`), aby kotwice i `markdown.headings` pozostały stabilne.
- Wygenerowane pliki `.nvh` są wynikiem budowania. Dodaj je do `.gitignore`, nigdy ich nie edytuj, a popraw źródło `.nvmd`. Znacznik `<?nv /* nvmd-generated */` pozostaw nietknięty.
- Blok HTML z handlerem (`<button @click="hit">`) to nvh wewnątrz Markdown. Takie bloki utrzymuj krótkie i oddzielaj od otaczającego tekstu pustymi liniami.
