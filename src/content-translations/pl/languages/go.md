# Go Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Go {#go-profile}

Pureline Go musi pozostać idiomatycznym Go. Pureline nie próbuje upodobnić Go do Javy.

### PL-GO-001 — Guardy błędów {#pl-go-001--error-guards}

Zalecane:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

To naturalnie odpowiada filozofii Pureline, w której guardy są na pierwszym miejscu.

### PL-GO-002 — Unikaj `else` po gałęziach kończących {#pl-go-002--avoid-else-after-terminating-branches}

Unikaj:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Preferuj:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — Nazewnictwo musi pozostać idiomatyczne {#pl-go-003--naming-must-remain-idiomatic}

Dobrze:

```text
user
session
conn
server
packet
request
ctx
err
wg
tx
```

Unikaj pozbawionych znaczenia nazw jednoliterowych, chyba że są silnie ugruntowanymi konwencjami lokalnymi.

### PL-GO-004 — Krótkie nazwy receiverów są dozwolone {#pl-go-004--short-receiver-names-are-allowed}

Zalecane:

```go
func (s *Server) Start() error {
}
```

Nazwy receiverów są lokalne, konwencjonalne i jednoznaczne.

Pureline nie wymusza:

```go
func (server *Server) Start() error {
}
```

jeśli nie wnosi to żadnej czytelności.

### PL-GO-005 — Małe interfejsy {#pl-go-005--small-interfaces}

Zalecane:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Unikaj przerośniętych interfejsów zawierających niepowiązane odpowiedzialności.

### PL-GO-006 — Definiuj interfejsy blisko konsumentów {#pl-go-006--define-interfaces-near-consumers}

Interfejsy należy zwykle definiować tam, gdzie są używane, zamiast z góry projektować je globalnie jako duże abstrakcje w stylu dziedziczenia.

### PL-GO-007 — Używaj `defer` dla jasnych cykli życia zasobów {#pl-go-007--use-defer-for-clear-resource-lifecycles}

Zalecane:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Gorutyny potrzebują właściciela {#pl-go-008--goroutines-need-ownership}

Unikaj gorutyn typu fire-and-forget bez jawnego cyklu życia.

Długo działająca gorutyna powinna mieć jasną obsługę anulowania, propagacji błędów, zamykania i własności.

### PL-GO-009 — Unikaj przedwczesnej abstrakcji interfejsów {#pl-go-009--avoid-premature-interface-abstraction}

Nie twórz interfejsu tylko dlatego, że konkretny typ teoretycznie mógłby mieć kiedyś inną implementację. Abstrakcje twórz wtedy, gdy istnieje rzeczywista potrzeba konsumenta.
