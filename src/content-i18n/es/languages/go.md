# Ir al estilo de código

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Ir Perfil

Pureline Go must remain idiomatic Go. Pureline no intenta hacer que Go parezca Java.

### PL-GO-001 — Guardias de error

Preferido:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Esto coincide con la filosofía de Pureline..

### PL-GO-002 — Evite `else` después de las ramas de la formación de terratenientes

Evitar:

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

### PL-GO-003: El nombre debe permanecer como un idioma

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

Evite los nombres sin sentido de una letra a menos que sean convenciones locales fuertemente establecidas.

### PL-GO-004 — Se permiten los nombres de receptores cortos

Preferido:

```go
func (s *Server) Start() error {
}
```

Los nombres de los receptores son locales, convencionales e inequívocos.

Pureline no fuerza:

```go
func (server *Server) Start() error {
}
```

cuando no aporta claridad.

### PL-GO-005 — Interfaces pequeñas

Preferido:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Evitar que la sobredimensión de la vida laboral contenga responsabilidades no relacionadas.

### PL-GO-006 — Definir interfaces con los consumidores cercanos

Las interfaces deben definirse generalmente donde se consumen en lugar de prediseñarse globalmente como grandes abstracciones de estilo de herencia.

### PL-GO-007 — Utilice `defer` para ciclos de vida claros de recursos

Preferido:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Goroutines necesita propiedad

Evite el fuego y olvide las goroutinas sin un ciclo de vida explícito.

Una gorutina de larga vida debe tener un manejo claro para la cancelación, propagación de errores, apagado y propiedad.

### PL-GO-009 — Evite la Abstracción de Interfaz Prematura

No cree una interfaz simplemente porque un tipo concreto podría teóricamente tener otra implementación más adelante. Crear abstracciones cuando hay una necesidad real del consumidor.
