# Ga Codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Ga profiel

Pureline Go moet idiomatisch blijven. Pureline probeert Go niet op Java te laten lijken.

### PL-GO-001. Foutguards

Voorkeur:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Dit komt natuurlijk overeen met Pureline's eerste filosofie.

### PL-GO-002. Vermijd `else` na het beëindigen van branches

Vermijd:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Voorkeur:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003. Naam moet Idiomatisch blijven

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

Vermijd zinloze éénletternamen tenzij ze sterk gevestigde lokale conventies zijn.

### PL-GO-004. Korte namen van de ontvanger zijn toegestaan

Voorkeur:

```go
func (s *Server) Start() error {
}
```

Ontvangersnamen zijn lokaal, conventioneel en ondubbelzinnig.

Pureline forceert niet:

```go
func (server *Server) Start() error {
}
```

Als het geen duidelijkheid geeft.

### PL-GO-005. Kleine interfaces

Voorkeur:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Vermijd te grote interfaces met niet-gerelateerde verantwoordelijkheden.

### PL-GO-006. Define Interfaces in de buurt van consumenten

Interfaces moeten over het algemeen worden gedefinieerd waar ze worden verbruikt in plaats van wereldwijd vooraf ontworpen als grote successie-achtige abstracties.

### PL-GO-007. Gebruik `defer` voor het wissen van Resource-levenscycli

Voorkeur:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008. Goroutines behoefte eigendom

Vermijd brand-en-vergeten goroutines zonder expliciete levenscyclus.

Een langlevende goroutine moet een duidelijke behandeling hebben voor annulering, foutverruiming, uitschakeling en eigendom.

### PL-GO-009. Vermijd premature Interface Abstractie

Maak geen interface omdat een concreet type theoretisch later een andere implementatie kan hebben. Ontsluitingen creëren als er een echte behoefte aan consumenten bestaat.
