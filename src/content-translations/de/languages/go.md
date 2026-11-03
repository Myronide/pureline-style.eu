# Go Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Go-Profil {#go-profile}

Pureline Go muss idiomatisches Go bleiben. Pureline versucht nicht, Go wie Java aussehen zu lassen.

### PL-GO-001 — Fehler-Guards {#pl-go-001--error-guards}

Bevorzugt:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Das passt natürlich zur Guard-first-Philosophie von Pureline.

### PL-GO-002 — `else` nach abschließenden Zweigen vermeiden {#pl-go-002--avoid-else-after-terminating-branches}

Vermeiden:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Bevorzugen:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — Die Benennung muss idiomatisch bleiben {#pl-go-003--naming-must-remain-idiomatic}

Gut:

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

Vermeide bedeutungslose einbuchstabige Namen, es sei denn, es sind fest etablierte lokale Konventionen.

### PL-GO-004 — Kurze Receiver-Namen sind erlaubt {#pl-go-004--short-receiver-names-are-allowed}

Bevorzugt:

```go
func (s *Server) Start() error {
}
```

Receiver-Namen sind lokal, konventionell und eindeutig.

Pureline erzwingt nicht:

```go
func (server *Server) Start() error {
}
```

wenn das keine zusätzliche Klarheit bringt.

### PL-GO-005 — Kleine Interfaces {#pl-go-005--small-interfaces}

Bevorzugt:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Vermeide überdimensionierte Interfaces mit unzusammenhängenden Verantwortlichkeiten.

### PL-GO-006 — Interfaces nah bei den Konsumenten definieren {#pl-go-006--define-interfaces-near-consumers}

Interfaces sollen in der Regel dort definiert werden, wo sie verwendet werden, und nicht global als große, vererbungsartige Abstraktionen vorab entworfen werden.

### PL-GO-007 — `defer` für klare Ressourcen-Lebenszyklen verwenden {#pl-go-007--use-defer-for-clear-resource-lifecycles}

Bevorzugt:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Goroutines brauchen Ownership {#pl-go-008--goroutines-need-ownership}

Vermeide Fire-and-forget-Goroutines ohne expliziten Lebenszyklus.

Eine langlebige Goroutine soll Abbruch, Fehlerweitergabe, Shutdown und Ownership klar behandeln.

### PL-GO-009 — Voreilige Interface-Abstraktion vermeiden {#pl-go-009--avoid-premature-interface-abstraction}

Erstelle kein Interface nur deshalb, weil ein konkreter Typ theoretisch später eine weitere Implementierung bekommen könnte. Schaffe Abstraktionen, wenn es einen echten Bedarf auf Konsumentenseite gibt.
