# Go-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Go-profiel {#go-profile}

Pureline Go moet idiomatisch Go blijven. Pureline probeert Go niet op Java te laten lijken.

### PL-GO-001 — Foutguards {#pl-go-001--error-guards}

Aanbevolen:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Dit sluit van nature aan bij de guard-first-filosofie van Pureline.

### PL-GO-002 — Vermijd `else` na afsluitende takken {#pl-go-002--avoid-else-after-terminating-branches}

Vermijd:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Aanbevolen:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — Naamgeving moet idiomatisch blijven {#pl-go-003--naming-must-remain-idiomatic}

Goed:

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

Vermijd betekenisloze namen van één letter, tenzij het sterk gevestigde lokale conventies zijn.

### PL-GO-004 — Korte receivernamen zijn toegestaan {#pl-go-004--short-receiver-names-are-allowed}

Aanbevolen:

```go
func (s *Server) Start() error {
}
```

Receivernamen zijn lokaal, conventioneel en ondubbelzinnig.

Pureline dwingt niet af:

```go
func (server *Server) Start() error {
}
```

wanneer dat geen duidelijkheid toevoegt.

### PL-GO-005 — Kleine interfaces {#pl-go-005--small-interfaces}

Aanbevolen:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Vermijd te grote interfaces met niet-gerelateerde verantwoordelijkheden.

### PL-GO-006 — Definieer interfaces bij de consumenten {#pl-go-006--define-interfaces-near-consumers}

Interfaces moeten over het algemeen worden gedefinieerd waar ze worden gebruikt, in plaats van vooraf globaal te worden ontworpen als grote abstracties in overervingsstijl.

### PL-GO-007 — Gebruik `defer` voor duidelijke levenscycli van resources {#pl-go-007--use-defer-for-clear-resource-lifecycles}

Aanbevolen:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Goroutines hebben een eigenaar nodig {#pl-go-008--goroutines-need-ownership}

Vermijd fire-and-forget-goroutines zonder expliciete levenscyclus.

Een langlevende goroutine moet een duidelijke afhandeling hebben voor annulering, foutpropagatie, afsluiten en eigenaarschap.

### PL-GO-009 — Vermijd voorbarige interface-abstractie {#pl-go-009--avoid-premature-interface-abstraction}

Maak geen interface alleen omdat een concreet type theoretisch later een andere implementatie zou kunnen krijgen. Maak abstracties wanneer er een echte behoefte bij de consument is.
