# Estilo de código Go

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Go {#go-profile}

Pureline Go debe seguir siendo Go idiomático. Pureline no intenta que Go se parezca a Java.

### PL-GO-001 — Guardas de error {#pl-go-001--error-guards}

Preferible:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Esto encaja de forma natural con la filosofía de Pureline de empezar por las guardas.

### PL-GO-002 — Evita `else` después de ramas que terminan {#pl-go-002--avoid-else-after-terminating-branches}

Evita:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Prefiere:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — Los nombres deben seguir siendo idiomáticos {#pl-go-003--naming-must-remain-idiomatic}

Bien:

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

Evita los nombres de una letra sin significado, salvo que sean convenciones locales muy consolidadas.

### PL-GO-004 — Se permiten los nombres cortos de receptor {#pl-go-004--short-receiver-names-are-allowed}

Preferible:

```go
func (s *Server) Start() error {
}
```

Los nombres de receptor son locales, convencionales y no ambiguos.

Pureline no impone:

```go
func (server *Server) Start() error {
}
```

cuando no aporta claridad.

### PL-GO-005 — Interfaces pequeñas {#pl-go-005--small-interfaces}

Preferible:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Evita las interfaces sobredimensionadas que reúnen responsabilidades sin relación entre sí.

### PL-GO-006 — Define las interfaces cerca de sus consumidores {#pl-go-006--define-interfaces-near-consumers}

Las interfaces deben definirse, por lo general, donde se consumen, y no diseñarse de antemano de forma global como grandes abstracciones al estilo de la herencia.

### PL-GO-007 — Usa `defer` para ciclos de vida de recursos claros {#pl-go-007--use-defer-for-clear-resource-lifecycles}

Preferible:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Las goroutines necesitan un dueño {#pl-go-008--goroutines-need-ownership}

Evita las goroutines de «lanzar y olvidar» sin un ciclo de vida explícito.

Una goroutine de larga duración debe tener un tratamiento claro de la cancelación, la propagación de errores, el apagado y la propiedad.

### PL-GO-009 — Evita la abstracción prematura con interfaces {#pl-go-009--avoid-premature-interface-abstraction}

No crees una interfaz solo porque un tipo concreto pudiera, en teoría, tener otra implementación más adelante. Crea abstracciones cuando exista una necesidad real de un consumidor.
