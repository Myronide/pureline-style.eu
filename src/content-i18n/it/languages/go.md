# Go Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Go Profile

Pureline Go must remain idiomatic Go. Pureline does not try to make Go look like Java.

### PL-GO-001. Guardie degli errori l' '

Preferred:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

This naturally matches Pureline's guard-first philosophy.

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

Bene:

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

### PL-GO-004. I nomi brevi del destinatario sono ammessi'(H)'(H))

Preferred:

```go
func (s *Server) Start() error {
}
```

Receiver names are local, conventional, and unambiguous.

Pureline non forza:

```go
func (server *Server) Start() error {
}
```

when it adds no clarity.

### PL-GO-005. Piccole interfacce

Preferred:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Evitare interfacce sovradimensionate contenenti responsabilità non correlate..

### PL-GO-006. Interfacce precise nei confronti dei consumatori

Le interfacce dovrebbero essere generalmente definite dove vengono consumate piuttosto che pre-progettato globalmente come grandi astrazioni in stile ereditario.

### PL-GO-007. Usa `defer` per cicli di vita delle risorse chiari

Preferred:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008. Goroutines bisogno di proprietà

Avoid fire-and-forget goroutines without an explicit lifecycle.

A long-lived goroutine should have clear handling for cancellation, error propagation, shutdown, and ownership.

### PL-GO-009 — Avoid Premature Interface Abstraction

Do not create an interface merely because a concrete type might theoretically have another implementation later. Create abstractions when there is a real consumer need.
