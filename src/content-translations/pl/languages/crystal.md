# Crystal Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Crystal {#crystal-profile}

Crystal zachowuje własną tożsamość, stosując się jednocześnie do zasad Pureline.

### PL-CR-001 — Idiomatyczne guardy przyrostkowe są dozwolone {#pl-cr-001--idiomatic-postfix-guards-are-allowed}

Warunki przyrostkowe w Crystal są zgodne z Pureline, gdy wyrażają krótki, oczywisty guard.

Dobrze:

```crystal
return unless valid
return if closed
```

Dobrze pasują do Pureline, ponieważ pozwalają zachować zwartą logikę guardów i liniową główną ścieżkę.

Gdy warunek lub chroniona akcja stają się bardziej złożone, użyj jawnego bloku:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

Reguła nie brzmi „unikaj warunków przyrostkowych”. Reguła brzmi: używaj formy, która sprawia, że zamiar jest od razu oczywisty.

### PL-CR-002 — Unikaj `else` {#pl-cr-002--avoid-else}

Unikaj:

```crystal
if valid
  execute
else
  reject
end
```

Preferuj:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Idiomatyczne nazewnictwo {#pl-cr-003--idiomatic-naming}

Zmienne i metody używają `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Typy używają PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004 — Preferuj wnioskowanie typów {#pl-cr-004--prefer-type-inference}

Zalecane:

```crystal
session = create_session(user)
```

Unikaj zbędnych adnotacji:

```crystal
session : Session = create_session(user)
```

gdy Crystal może jasno wywnioskować typ.

### PL-CR-005 — Jawne guardy nil {#pl-cr-005--explicit-nil-guards}

Zalecane:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Unikaj chowania oczekiwanej obsługi nil w głęboko zagnieżdżonych łańcuchach.

### PL-CR-006 — Wyjątki są od stanów wyjątkowych {#pl-cr-006--exceptions-are-for-exceptional-states}

Oczekiwane wyniki powinny preferencyjnie korzystać ze zwykłego modelowania domeny, np. `nil`, typów unii, struktur w stylu wyniku lub enumów.

Wyjątki powinny reprezentować wyjątkową awarię, a nie zwykłe rozgałęzienia.

### PL-CR-007 — Unikaj efekciarstwa z makrami bez potrzeby {#pl-cr-007--avoid-macro-cleverness-without-need}

Makra Crystal są potężne, ale Pureline unika ukrywania zwykłego zachowania za metaprogramowaniem, chyba że abstrakcja daje wyraźną korzyść architektoniczną.

Generowane zachowanie powinno pozostać przewidywalne i łatwe do odnalezienia.

---

### PL-CR-008 — Gęstość folderów {#pl-cr-008--folder-density}

Folder źródłowy lub przestrzeni nazw w Crystal może domyślnie zawierać co najwyżej **10 produkcyjnych plików `.cr`**.

Specyfikacje, pliki generowane, bindingi i pliki zawierające wyłącznie metadane nie są wliczane.

Po przekroczeniu limitu podziel przestrzeń nazw według odpowiedzialności, zachowując idiomatyczną strukturę Crystal.
