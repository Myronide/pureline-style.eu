# Rust Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Rust {#rust-profile}

Pureline Rust opiera się na **idiomatycznym Ruście**, zamiast przenosić konwencje Javy do składni Rusta. Własność, czasy życia, enumy, dopasowanie wzorców i system typów to główne mocne strony, a nie przeszkody do obejścia.

### PL-RS-001 — Idiomatyczne nazewnictwo i widoczność {#pl-rs-001--idiomatic-naming-and-visibility}

- Typy, traity i warianty enumów: `PascalCase`.
- Funkcje, metody, moduły, pola i zmienne lokalne: `snake_case`.
- Stałe i statyki: `SCREAMING_SNAKE_CASE`.
- Crate'y: opisowe nazwy w `snake_case` (nazwy pakietów Cargo mogą zawierać myślniki).
- Traity **nie** dziedziczą prefiksu `I` z Javy. Preferuj `Storage`, a nie `IStorage`.
- Elementy utrzymuj prywatne, dopóki rzeczywisty konsument nie potrzebuje szerszej widoczności; gdy to możliwe, preferuj `pub(crate)`.
- Używaj importów `use` zamiast powtarzać długie w pełni kwalifikowane ścieżki, z wyjątkiem sytuacji, gdy jawna kwalifikacja rozstrzyga niejednoznaczność.

### PL-RS-002 — Guard clauses i liniowy przepływ {#pl-rs-002--guard-clauses-and-linear-flow}

Waliduj wcześnie i trzymaj główną ścieżkę na bazowym poziomie wcięcia.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Unikaj `else` po gałęzi, która już robi return, break lub continue. **Wyrażenie** `if`/`else` jest dozwolone przy rzeczywistym dwukierunkowym wyborze wartości, gdy jest czytelniejsze od alternatyw. `let ... else` to **preferowana w Ruście konstrukcja guard**, a nie naruszenie zasady unikania `else`.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Preferuj `Result`, `Option` i `?` {#pl-rs-003--prefer-result-option-and}

- Oczekiwane błędy reprezentuj za pomocą `Result<T, E>`.
- Brak wartości reprezentuj za pomocą `Option<T>`.
- Używaj `?` do prostej propagacji oraz `map_err`/`ok_or_else`, gdy kontekst błędu rzeczywiście zwiększa czytelność.
- Używaj `match`, gdy wyniki wymagają odrębnej obsługi; unikaj zawiłych łańcuchów kombinatorów.
- Nie odrzucaj po cichu wartości `Result`; zdecyduj, czy je propagować, zalogować, naprawić, czy świadomie zignorować z uzasadnionym wyjaśnieniem.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Ogranicz `unwrap`, `expect` i `panic!` {#pl-rs-004--restrict-unwrap-expect-and-panic}

Nigdy nie używaj `unwrap()` ani `expect()` dla zwykłych, możliwych do naprawienia błędów w kodzie produkcyjnym. Są dopuszczalne w udokumentowanych niezmiennikach, których naprawdę nie da się naruszyć, oraz w kodzie testowym (moduły `#[cfg(test)]` i `tests/`), gdzie panic jest raportem o niepowodzeniu. `panic!` nie jest normalną strategią obsługi błędów. Preferuj jawną obsługę zamiast ukrytych awarii wynikających z niesprawdzanego indeksowania lub konwersji.

### PL-RS-005 — Używaj `match` i wzorców przy rzeczywistym rozgałęzianiu po stanie {#pl-rs-005--use-match-and-patterns-for-real-state-branching}

Używaj wyczerpującego `match` dla enumów i znaczących alternatyw; do prostej obsługi pojedynczego wzorca używaj `if let` lub `let ... else`. Nie wymuszaj `match` przy zwykłych sprawdzeniach logicznych. Unikaj szerokich gałęzi `_`, które po cichu maskują przyszłe stany, gdy wyliczenie wariantów byłoby czytelniejsze.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — Własność musi być świadoma {#pl-rs-006--ownership-must-be-deliberate}

- Preferuj pożyczanie `&T` lub `&mut T`, gdy przekazanie własności jest zbędne.
- Przyjmuj wartości na własność, gdy wywoływany kod naprawdę potrzebuje własności.
- Minimalizuj klonowanie; używaj `.clone()`, gdy jego koszt własnościowy i cel są jasne.
- Unikaj niepotrzebnych `Arc`, `Rc`, `Box` i wrapperów mutowalności wewnętrznej.
- Preferuj krótkie czasy życia i jawne granice własności; nie walcz z borrow checkerem sztucznymi wyciekami ani wszechobecną współdzieloną własnością.

### PL-RS-007 — Domyślnie niezmienne {#pl-rs-007--immutable-by-default}

Używaj `let`, chyba że potrzebna jest mutacja. `let mut` utrzymuj lokalnie i w wąskim zakresie. Unikaj mutowalności wewnętrznej jako domyślnego zamiennika zwykłego projektu własności. Nie twórz zbędnych modyfikowalnych globali.

### PL-RS-008 — Traity wymagają prawdziwej abstrakcji {#pl-rs-008--traits-require-a-real-abstraction}

Twórz trait dla rzeczywistego wspólnego zachowania, granicy API, wymiennej implementacji lub punktu podstawienia w testach. Nie wprowadzaj traitów tylko po to, by odtwarzać interfejsy Javy lub tworzyć warstwy factory/manager. Dla pojedynczych konkretnych implementacji preferuj proste metody w `impl`. Generyki lub obiekty cech (trait objects) wybieraj na podstawie rzeczywistych wymagań polimorfizmu.

### PL-RS-009 — Spójność ponad rozmiar dla `struct`, `impl` i modułów {#pl-rs-009--cohesion-over-size-for-struct-impl-and-modules}

`PL-STRUCT-003` dotyczy Rusta jako **przegląd spójności**, a nie stały limit liczby linii. Spójny `impl` lub maszyna stanów może być długi. Dziel według niezależnej odpowiedzialności, a nie przez mechaniczne wyodrębnianie traitów, structów lub plików. Unikaj ogromnych, niepowiązanych wysypisk w `mod.rs` lub `lib.rs`.

### PL-RS-010 — Gęstość modułów i plików {#pl-rs-010--module-and-file-density}

Folder funkcji/źródłowy w Ruście powinien domyślnie zawierać co najwyżej **10 ręcznie utrzymywanych produkcyjnych plików `.rs`**. Testy, kod generowany, bindingi i pliki zawierające wyłącznie metadane nie są wliczane. `mod.rs`, `lib.rs` i `main.rs` liczą się, gdy zawierają istotną, utrzymywaną logikę, a nie wtedy, gdy służą wyłącznie jako deklaracje modułów/reeksporty. To próg przeglądowy: dziel wzdłuż rzeczywistych granic odpowiedzialności, nigdy na bezsensowne zagnieżdżone foldery.

Preferuj jawne moduły z wąskimi publicznymi powierzchniami; implementację wewnętrzną utrzymuj prywatną.

### PL-RS-011 — Używaj rustfmt jako autorytetu formatowania {#pl-rs-011--use-rustfmt-as-the-formatting-authority}

- Stosuj `rustfmt` / `cargo fmt` w kwestii wcięć, zawijania linii, końcowych przecinków i idiomatycznego formatowania.
- Preferuj zwarte wyrażenia i wywołania, **gdy rustfmt je obsługuje**; Pureline nie może wymagać ręcznego formatowania, które rustfmt i tak cofnie.
- Pisz czytelną strukturę wyrażeń, zamiast walczyć z formatterem dyrektywami formatowania.
- Używaj zwykłego sterowania przepływem w nawiasach klamrowych; nie naśladuj reguł średników z Javy w Ruście zorientowanym na wyrażenia.

Ta reguła ma pierwszeństwo przed niezależnymi od języka preferencjami dotyczącymi wywołań w poziomie, gdy kolidują z kanonicznym formatterem Rusta.

### PL-RS-012 — Preferuj czytelną iterację zamiast sprytnych łańcuchów {#pl-rs-012--prefer-clear-iteration-over-clever-chains}

Iteratory, domknięcia i kombinatory są zalecane, gdy bezpośrednio wyrażają transformację. Preferuj zwykłą pętlę, gdy czyni bardziej czytelnymi rozgałęzienia, efekty uboczne, pożyczanie, debugowanie lub zachowanie gorącej ścieżki. Unikaj łączenia adapterów w łańcuch tylko po to, by zmniejszyć liczbę linii.

### PL-RS-013 — Zadania async mają właściciela i zamknięcie {#pl-rs-013--async-tasks-have-ownership-and-shutdown}

- Tam, gdzie to właściwe, używaj `async`/`.await` dla obciążeń asynchronicznych.
- Nie blokuj wykonawcy async długotrwałym synchronicznym I/O ani pracą CPU; w razie potrzeby używaj dedykowanego wykonania blokującego lub wątków roboczych.
- Śledź uruchomione zadania, anulowanie, propagację błędów i uporządkowane zamykanie.
- Nie twórz ukrytych zadań typu fire-and-forget dla ważnej pracy.
- Kanałów i prymitywów synchronizacji używaj z jasno zdefiniowaną własnością i backpressure.
- Nigdy nie trzymaj blokady, blokującej ani asynchronicznej, przez `.await`, chyba że projekt wyraźnie tego wymaga i bezpiecznie to wspiera.

### PL-RS-014 — Cykle życia zasobów powinny być przewidywalne {#pl-rs-014--resource-lifecycles-should-be-predictable}

Dla synchronicznego sprzątania preferuj RAII i `Drop`. Dla zasobów asynchronicznych jawnie oczekuj na zamknięcie lub je koordynuj, ponieważ `Drop` sam nie może używać await. Udostępnij metodę `close()` / `shutdown()`, gdy operacja może się nie powieść lub musi zakończyć się przed wyjściem z procesu. Unikaj ukrywania istotnego sprzątania, które może zawieść, wyłącznie w destruktorach.

### PL-RS-015 — Kod unsafe musi być izolowany i uzasadniony {#pl-rs-015--unsafe-code-must-be-isolated-and-justified}

Domyślnie stosuje się bezpieczny Rust. Używaj `unsafe` tylko tam, gdzie wymaga tego rzeczywista granica FFI, sprzętowa lub wydajnościowa. Regiony unsafe utrzymuj małe, dokumentuj ich niezmienniki za pomocą `// SAFETY:`, hermetyzuj je za minimalnym bezpiecznym API i testuj granicę. Nie używaj `unsafe` po prostu po to, by ominąć zwykłe kontrole własności.

### PL-RS-016 — FFI i granice platformy są jawne {#pl-rs-016--ffi-and-platform-boundaries-are-explicit}

Przy integracji natywnej, np. z Wayland, GPU, bibliotekami systemowymi i podobnymi, utrzymuj widoczne surowe uchwyty, gwarancje czasu życia, przekazywanie własności, założenia dotyczące wątków i konwersję błędów. Kod specyficzny dla platformy izoluj w wyspecjalizowanych modułach. Wygenerowane bindingi mogą być wyłączone ze zwykłego formatowania i limitów gęstości.

### PL-RS-017 — Preferuj typy, które kodują niezmienniki {#pl-rs-017--prefer-types-that-encode-invariants}

Używaj enumów i małych newtype'ów tam, gdzie zapobiegają rzeczywistym niepoprawnym stanom lub wyjaśniają granice zewnętrzne. Nie twórz wrapperów dla każdego typu prostego bez korzyści. Preferuj konstruktory, które walidują niezmienniki i zwracają jasne błędy. Utrudniaj reprezentowanie stanów niepoprawnych lub niezainicjalizowanych.

### PL-RS-018 — Unikaj efekciarstwa z makrami {#pl-rs-018--avoid-macro-cleverness}

Dla rutynowego zachowania preferuj funkcje, traity, enumy i proste generyki zamiast makr. Makr deklaratywnych lub proceduralnych używaj, gdy eliminują znaczące strukturalne powtórzenia. Generowane zachowanie utrzymuj wykrywalne, a diagnostykę zrozumiałą.

### PL-RS-019 — Mierz wydajność, zanim dodasz złożoność {#pl-rs-019--measure-performance-before-complexity}

Unikaj zbędnych alokacji, klonowania, zliczania referencji i blokowania w zmierzonych gorących ścieżkach. Preferuj przewidywalną własność i struktury danych dopasowane do obciążenia. Profiluj, zanim zastąpisz czysty kod złożonymi optymalizacjami niskiego poziomu, a dla obciążeń UI/kompozytora weryfikuj zarówno opóźnienie, jak i przepustowość.

### PL-RS-020 — Testowanie i narzędzia {#pl-rs-020--testing-and-tooling}

- Uruchamiaj `cargo fmt --check` dla formatowania oraz `cargo clippy` z ustawieniami lintów uzgodnionymi w projekcie.
- Testuj ścieżki normalne, niepoprawne i awaryjne, zwłaszcza anulowanie, cykl życia, FFI i granice współbieżności.
- Ostrzeżenia traktuj świadomie; unikaj zbiorczych atrybutów `allow`, które wyciszają szerokie grupy lintów.
- Pureline Checker musi używać inspekcji świadomej składni/AST Rusta (w tym `let ... else`, dopasowania wzorców, makr i zwracania wyrażeń), a nie dopasowania wzorców tekstowych.

### PL-RS-021 — Typy błędów odpowiadają roli crate'a {#pl-rs-021--error-types-match-the-crate-role}

- Biblioteki udostępniają typowane błędy: `enum` implementujący `std::error::Error` i `Display`, z jednym wariantem na każdą odrębną awarię, na którą wywołujący może zareagować.
- Aplikacje mogą używać jednego nieprzezroczystego typu błędu najwyższego poziomu na granicy (`main`, handlery żądań, polecenia CLI), aby przenosić kontekst. Nie udostępniaj tego nieprzezroczystego typu przez publiczne API biblioteki.
- Zachowuj błąd źródłowy (`source()` lub opakowany wariant), zamiast zamieniać go na tekst.
- Komunikaty `Display` są pisane małymi literami i nie mają końcowej interpunkcji, aby wywołujący mogli je składać.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Linty konfiguruje się centralnie {#pl-rs-022--lints-are-configured-centrally}

- Poziomy lintów konfiguruj w manifeście (`[lints]` w `Cargo.toml` albo `[workspace.lints]` z `lints.workspace = true` w crate'ach członkowskich), a nie w rozproszonych atrybutach na poziomie crate'a.
- Włączaj grupy lintów uzgodnione w projekcie, a poszczególne wyjątki wymieniaj wraz z powodem obok nich.
- Atrybut `#![allow(...)]` na poziomie crate'a jest uwagą w przeglądzie, chyba że komentarz wyjaśnia, dlaczego lint jest błędny dla tego kodu.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Kod async bezpieczny przy anulowaniu {#pl-rs-023--cancellation-safe-async-code}

- Gdy future zostaje porzucone przed zakończeniem (na przykład jako przegrywająca gałąź `select!` albo po przekroczeniu limitu czasu), określ, czy operacja jest bezpieczna przy anulowaniu. Udokumentuj każdą operację, która nie jest.
- Nie zakładaj, że porzucone future wycofało swoją pracę. Zatwierdzaj zmiany stanu po powodzeniu oczekiwanego kroku albo uczyń ten krok idempotentnym.
- Future, które trzyma blokadę lub otwartą transakcję, trzymaj poza gałęziami `select!`, które mogą je porzucić w trakcie operacji.

### PL-RS-024 — Testy leżą obok zachowania, które sprawdzają {#pl-rs-024--tests-sit-next-to-the-behaviour-they-check}

- Testy jednostkowe znajdują się w bloku `#[cfg(test)] mod tests` na końcu testowanego pliku. Mają dostęp do elementów prywatnych, co pozwala utrzymać wąską powierzchnię publiczną.
- Testy integracyjne znajdują się w `tests/` i korzystają wyłącznie z publicznego API.
- Nazwy testów opisują zachowanie (`rejects_expired_token`), a nie samą nazwę funkcji.
- Fixtury buduj małymi funkcjami pomocniczymi, a nie kopiowaniem bloków przygotowania do każdego testu.
