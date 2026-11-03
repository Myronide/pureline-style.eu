# Stile del codice Go

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Go {#go-profile}

Pureline Go deve restare Go idiomatico. Pureline non cerca di far sembrare Go simile a Java.

### PL-GO-001 — Guardie sugli errori {#pl-go-001--error-guards}

Preferito:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

Questo si accorda naturalmente con la filosofia di Pureline di mettere le guardie per prime.

### PL-GO-002 — Evitare `else` dopo i rami che terminano {#pl-go-002--avoid-else-after-terminating-branches}

Evita:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Preferisci:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

### PL-GO-003 — I nomi devono restare idiomatici {#pl-go-003--naming-must-remain-idiomatic}

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

Evita i nomi di una lettera privi di significato, a meno che non siano convenzioni locali molto consolidate.

### PL-GO-004 — I nomi brevi dei receiver sono ammessi {#pl-go-004--short-receiver-names-are-allowed}

Preferito:

```go
func (s *Server) Start() error {
}
```

I nomi dei receiver sono locali, convenzionali e non ambigui.

Pureline non impone:

```go
func (server *Server) Start() error {
}
```

quando non aggiunge chiarezza.

### PL-GO-005 — Interfacce piccole {#pl-go-005--small-interfaces}

Preferito:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Evita le interfacce sovradimensionate che contengono responsabilità non correlate.

### PL-GO-006 — Definire le interfacce vicino ai consumatori {#pl-go-006--define-interfaces-near-consumers}

In generale le interfacce dovrebbero essere definite dove vengono consumate, anziché progettate in anticipo a livello globale come grandi astrazioni in stile ereditarietà.

### PL-GO-007 — Usare `defer` per cicli di vita chiari delle risorse {#pl-go-007--use-defer-for-clear-resource-lifecycles}

Preferito:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

### PL-GO-008 — Le goroutine hanno bisogno di un proprietario {#pl-go-008--goroutines-need-ownership}

Evita le goroutine fire-and-forget senza un ciclo di vita esplicito.

Una goroutine di lunga durata dovrebbe gestire in modo chiaro cancellazione, propagazione degli errori, arresto e proprietà (ownership).

### PL-GO-009 — Evitare l'astrazione prematura con le interfacce {#pl-go-009--avoid-premature-interface-abstraction}

Non creare un'interfaccia solo perché un tipo concreto potrebbe, in teoria, avere un'altra implementazione in futuro. Crea le astrazioni quando c'è una reale esigenza di un consumatore.
