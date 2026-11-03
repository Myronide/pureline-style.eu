# Go Code Style

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Aller au profil

Pureline Go doit rester idiomatique Go. Pureline n'essaie pas de faire ressembler Go à Java.

### PL-GO-001 — Garde-erreurs

Préféré:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Cela correspond naturellement à la philosophie de Pureline en première garde.

### PL-GO-002 — Évitez les branches `else` après la nomination

Évitez:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Préférez :

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — La désignation doit rester idiomatique

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

Évitez les noms d'une lettre sans signification, sauf s'ils sont des conventions locales solidement établies.

### PL-GO-004 — Noms courts des récepteurs autorisés

Préféré:

```go
func (s *Server) Start() error {
}
```

Les noms de récepteurs sont locaux, conventionnels et sans ambiguïté.

Pureline ne doit pas forcer:

```go
func (server *Server) Start() error {
}
```

quand il n'y a pas de clarté.

### PL-GO-005 — Petites interfaces

Préféré:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Évitez les interfaces surdimensionnées qui comportent des responsabilités non liées.

### PL-GO-006 — Définir des interfaces près des consommateurs

Les interfaces doivent généralement être définies là où elles sont consommées plutôt que globalement pré-conçues comme de grandes abstractions de style héritage.

### PL-GO-007 — Utiliser `defer` pour des cycles de vie clairs des ressources

Préféré:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Goroutines ont besoin de propriété

Évitez les goroutines sans cycle de vie explicite.

Une goroutine à longue durée de vie devrait avoir une gestion claire pour l'annulation, la propagation d'erreurs, l'arrêt et la propriété.

### PL-GO-009 — Éviter l'abstraction de l'interface prématurée

Ne créez pas une interface simplement parce qu'un type concret pourrait théoriquement avoir une autre mise en œuvre plus tard. Créer des abstractions quand il y a un besoin réel du consommateur.
