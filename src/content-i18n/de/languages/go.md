# Code-Stil gehen

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Go Profile

Pureline Go muss idiomatisch bleiben... Pureline does not try to make Go look like Java.

### PL-GO-001 — Error Guards

Preferred:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Das passt natürlich zu Purelines erster Philosophie...

When the caller would otherwise lack the operation's context, wrap the
error with `%w` to preserve the underlying cause.

```text
− Without operation context       │ ✓ Pureline
                                  │
data, err := os.ReadFile(path)    │ data, err := os.ReadFile(path)
if err != nil {                   │ if err != nil {
    return nil, err               │     return nil, fmt.Errorf("load config: %w", err)
}                                 │ }
```

### PL-GO-002 — Avoid `else` After Terminating Branches

Avoid:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Prefer:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — Naming Must Remain Idiomatic

Good:

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

Avoid meaningless one-letter names unless they are strongly established local conventions.

### PL-GO-004 — Kurze Receiver-Namen sind gestattet

Preferred:

```go
func (s *Server) Start() error {
}
```

Receiver-Namen sind lokal, konventionell und eindeutig..

Pureline erzwingt nicht:

```go
func (server *Server) Start() error {
}
```

wenn es keine Klarheit bringt.

### PL-GO-005 — Kleine Schnittstellen

Preferred:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Avoid oversized interfaces containing unrelated responsibilities.

### PL-GO-006 — Schnittstellen in der Nähe von Verbrauchern definieren

Schnittstellen sollten im Allgemeinen dort definiert werden, wo sie verbraucht werden, anstatt global als große Abstraktionen im Erbstil vorgefasst zu werden.

### PL-GO-007 — `defer` für klare Ressourcenlebenszyklen verwenden

Preferred:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Goroutinen brauchen Eigentum

Vermeiden Sie Brand-und-vergessen Goroutinen ohne einen expliziten Lebenszyklus.

Eine langlebige Goroutine sollte eine klare Handhabung für die Löschung, Fehlerausbreitung, Abschaltung und Eigentum haben.

### PL-GO-009 — Vermeiden Sie vorzeitige Schnittstellenabstraction

Erstellen Sie keine Schnittstelle, nur weil ein konkreter Typ theoretisch später eine weitere Implementierung haben könnte. Schaffen Sie Abstraktionen, wenn es ein echter Verbraucherbedarf...
