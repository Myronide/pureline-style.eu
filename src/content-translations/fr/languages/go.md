# Style de code Go

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Go {#go-profile}

Pureline Go doit rester du Go idiomatique. Pureline n'essaie pas de faire ressembler Go à Java.

### PL-GO-001 — Guards d'erreur {#pl-go-001--error-guards}

Recommandé :

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Cela correspond naturellement à la philosophie de Pureline, qui place les guards en premier.

### PL-GO-002 — Éviter `else` après une branche terminale {#pl-go-002--avoid-else-after-terminating-branches}

À éviter :

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

### PL-GO-003 — Le nommage doit rester idiomatique {#pl-go-003--naming-must-remain-idiomatic}

Bien :

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

Évitez les noms d'une lettre dénués de sens, sauf s'il s'agit de conventions locales solidement établies.

### PL-GO-004 — Les noms de récepteur courts sont permis {#pl-go-004--short-receiver-names-are-allowed}

Recommandé :

```go
func (s *Server) Start() error {
}
```

Les noms de récepteur sont locaux, conventionnels et sans ambiguïté.

Pureline n'impose pas :

```go
func (server *Server) Start() error {
}
```

lorsque cela n'apporte aucune clarté.

### PL-GO-005 — Petites interfaces {#pl-go-005--small-interfaces}

Recommandé :

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Évitez les interfaces surdimensionnées qui regroupent des responsabilités sans rapport.

### PL-GO-006 — Définir les interfaces près des consommateurs {#pl-go-006--define-interfaces-near-consumers}

Les interfaces doivent généralement être définies là où elles sont consommées, plutôt que conçues globalement à l'avance comme de grandes abstractions de type héritage.

### PL-GO-007 — Utiliser `defer` pour des cycles de vie de ressources clairs {#pl-go-007--use-defer-for-clear-resource-lifecycles}

Recommandé :

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Les goroutines ont besoin d'un propriétaire {#pl-go-008--goroutines-need-ownership}

Évitez les goroutines lancées sans suivi (fire-and-forget) et dépourvues de cycle de vie explicite.

Une goroutine de longue durée doit gérer clairement l'annulation, la propagation des erreurs, l'arrêt et la propriété.

### PL-GO-009 — Éviter l'abstraction prématurée par interface {#pl-go-009--avoid-premature-interface-abstraction}

Ne créez pas une interface simplement parce qu'un type concret pourrait théoriquement avoir une autre implémentation plus tard. Créez des abstractions lorsqu'un vrai besoin côté consommateur existe.
