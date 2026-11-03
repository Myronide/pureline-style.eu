# Klasy, moduły i gęstość folderów

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Klasy i moduły {#classes-and-modules}

### PL-STRUCT-001 — Jedna jasna odpowiedzialność {#pl-struct-001--one-clear-responsibility}

Unikaj struktur takich jak:

```text
ServerManager
 ├─ database
 ├─ players
 ├─ packets
 ├─ commands
 ├─ configuration
 ├─ HTTP
 └─ logging
```

Preferuj:

```text
server/
    ServerRuntime

network/
    Connection
    PacketRegistry
    PacketDispatcher

session/
    Session
    SessionService

storage/
    UserStorage
    SessionStorage
```

Klasa ma jedną jasną odpowiedzialność, gdy jej składowe i stan wewnętrzny służą jednemu spójnemu zagadnieniu. **Sama liczba linii nie rozstrzyga o tym, czy klasa jest dobrze zaprojektowana.** Wskazówki dotyczące rozmiaru znajdziesz w `PL-STRUCT-003`.

---

## Gęstość pakietów i folderów {#package-and-folder-density}

### PL-STRUCT-002 — Utrzymuj przestrzenie nazw na tyle małe, by dało się je ogarnąć wzrokiem {#pl-struct-002--keep-namespaces-small-enough-to-scan}

Pureline traktuje gęstość plików i typów jako część czytelności kodu.

Pakiet lub folder źródłowy powinien być na tyle mały, by programista mógł zrozumieć jego zawartość jednym spojrzeniem, bez przeszukiwania długiej, płaskiej listy niepowiązanych plików.

Gdy limit zostanie przekroczony, podziel pakiet lub folder według odpowiedzialności, zamiast pozwalać, by stał się wysypiskiem.

#### Domyślne limity {#default-limits}

| Język | Domyślna wartość Pureline |
|---|---|
| Java | Maksymalnie 8 produkcyjnych typów najwyższego poziomu/plików źródłowych na pakiet |
| Emerald | Maksymalnie 8 produkcyjnych plików źródłowych `.ems` na folder źródłowy/przestrzeni nazw |
| Emvus | Maksymalnie 8 produkcyjnych plików źródłowych `.ev` na pakiet/folder źródłowy |
| JavaScript | Maksymalnie 10 produkcyjnych modułów źródłowych na folder funkcji/źródłowy |
| TypeScript | Maksymalnie 10 produkcyjnych modułów źródłowych na folder funkcji/źródłowy |
| Go | Maksymalnie 12 plików `.go` niebędących testami ani kodem generowanym na katalog pakietu |
| Crystal | Maksymalnie 10 produkcyjnych plików `.cr` na folder źródłowy/przestrzeni nazw |
| Rust | Maksymalnie 10 ręcznie utrzymywanych produkcyjnych plików `.rs` na folder funkcji/źródłowy |

Do limitu nie wliczają się:

- testy i specyfikacje
- generowane pliki źródłowe
- pliki zawierające wyłącznie metadane
- `package-info.java`
- `module-info.java`
- pliki barrel w JavaScript/TypeScript, takie jak `index.ts` lub `index.js`
- wygenerowane bindingi lub wyjście protokołu
- migawki migracji i porównywalne artefakty generowane maszynowo

Celem tej reguły nie jest wymuszanie dowolnego zagnieżdżania folderów. Podział powinien wprowadzać rzeczywistą granicę odpowiedzialności.

Źle:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java
    PacketHandler.java
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Zalecane:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java

network/packet/
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java

network/runtime/
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Projekt może zmienić te progi za pomocą przyszłego pliku konfiguracyjnego Pureline, ale reguła domyślna powinna pozostać celowo ścisła.

---

## Spójność ponad rozmiar {#cohesion-over-size}

### PL-STRUCT-003 — Spójność ponad rozmiar (Zusammengehörigkeit vor Zeilenbegrenzung) {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung}

> **Spójność ponad rozmiar — Zusammengehörigkeit vor Zeilenbegrenzung.**

Preferowany maksymalny rozmiar klasy to **wskazówka, nigdy twardy limit**. Silnie powiązaną logikę trzymaj razem, jeśli jej podział utrudniłby czytanie, utrzymanie, testowanie lub rozumowanie o kodzie. Większa, spójna klasa jest lepsza niż kilka sztucznych klas połączonych zbędną delegacją.

#### Wskazówki dotyczące rozmiaru klasy {#class-size-guidance}

| Rozmiar klasy | Rekomendacja Pureline |
|---|---|
| Do 200 linii | Preferowany przypadek normalny |
| 201–400 linii | Bez zastrzeżeń, gdy klasa ma jasną odpowiedzialność |
| 401–600 linii | Świadoma decyzja architektoniczna; zadbaj, by jej spójność pozostała zrozumiała |
| Ponad 600 linii | Zalecany przegląd, **nie zakaz** |

Zakresy są **heurystykami, nie twardymi limitami**. Przekroczenie progu samo w sobie nie może powodować naruszenia stylu ani wymagać podziału.

#### Kiedy większe klasy są uzasadnione {#when-larger-classes-are-justified}

- **Parsery i lexery:** Spójna maszyna stanów może się skomplikować, gdy jej stany i przejścia są rozproszone po sztucznych abstrakcjach.
- **Algorytmy:** Ściśle sprzężone fazy przetwarzania mogą być łatwiejsze do zrozumienia i optymalizacji, gdy zostają razem.
- **Centralne struktury danych:** Metody współdzielące te same niezmienniki i stan wewnętrzny mogą należeć do jednej klasy.
- **Złożona, ale spójna logika:** Podział przynosi odwrotny skutek, gdy dodaje pośrednictwo, zbędną delegację lub więcej koordynacji niż czytelności.

#### Kiedy mimo to dzielić {#when-to-split-anyway}

Dziel według **rzeczywistych granic odpowiedzialności**, a nie według liczby linii. Wskazówki to: odrębne podsystemy rozwijane niezależnie, niepowiązane powody zmian, słabe sprzężenie między grupami metod lub oddzielne cykle życia ukryte w jednej klasie.

**Reguła dla narzędzi:** Pureline Checker i inspekcje IDE mogą wyświetlać informacyjną uwagę o rozmiarze wraz z sugestią przeglądu spójności, zwłaszcza powyżej 600 linii. Nie mogą traktować liczby linii jako wystarczającego dowodu naruszenia, automatycznie wydzielać klas ani wymuszać supresji tylko po to, by zachować spójną klasę w całości.

Ta zasada dotyczy **wszystkich profili języków Pureline**, w tym Javy, JavaScript, TypeScript, Go, Crystal, Rust, Emerald i Emvus. Składnia i idiomy właściwe danemu językowi nadal mają pierwszeństwo.
