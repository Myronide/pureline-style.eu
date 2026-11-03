# Stile del codice Crystal

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Crystal {#crystal-profile}

Crystal mantiene la propria identità di linguaggio pur seguendo i principi di Pureline.

### PL-CR-001 — Le guardie postfisse idiomatiche sono ammesse {#pl-cr-001--idiomatic-postfix-guards-are-allowed}

Le condizioni postfisse di Crystal sono conformi a Pureline quando esprimono una guardia breve e ovvia.

Bene:

```crystal
return unless valid
return if closed
```

Si adattano bene a Pureline perché mantengono compatta la logica delle guardie e preservano un percorso principale lineare.

Usa un blocco esplicito quando la condizione o l'azione protetta diventa più complessa:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

La regola non è «evita le condizioni postfisse». La regola è: usa la forma che rende l'intento immediatamente ovvio.

### PL-CR-002 — Evitare `else` {#pl-cr-002--avoid-else}

Evita:

```crystal
if valid
  execute
else
  reject
end
```

Preferisci:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Nomi idiomatici {#pl-cr-003--idiomatic-naming}

Variabili e metodi usano `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

I tipi usano PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004 — Preferire l'inferenza dei tipi {#pl-cr-004--prefer-type-inference}

Preferito:

```crystal
session = create_session(user)
```

Evita le annotazioni ridondanti:

```crystal
session : Session = create_session(user)
```

quando Crystal può inferire il tipo con chiarezza.

### PL-CR-005 — Guardie esplicite su nil {#pl-cr-005--explicit-nil-guards}

Preferito:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Evita di seppellire la gestione di un nil previsto dentro catene profondamente annidate.

### PL-CR-006 — Le eccezioni sono per gli stati eccezionali {#pl-cr-006--exceptions-are-for-exceptional-states}

Gli esiti previsti dovrebbero preferibilmente usare la normale modellazione del dominio, come `nil`, tipi unione, strutture simili a result o enum.

Le eccezioni dovrebbero rappresentare un fallimento eccezionale, non la normale ramificazione.

### PL-CR-007 — Evitare l'astuzia delle macro senza necessità {#pl-cr-007--avoid-macro-cleverness-without-need}

Le macro di Crystal sono potenti, ma Pureline evita di nascondere il comportamento ordinario dietro la metaprogrammazione, a meno che l'astrazione non produca un chiaro beneficio architetturale.

Il comportamento generato dovrebbe restare prevedibile e facile da individuare.

---

### PL-CR-008 — Densità delle cartelle {#pl-cr-008--folder-density}

Una cartella sorgente o di namespace Crystal può contenere al massimo **10 file `.cr` di produzione** per impostazione predefinita.

Le specifiche, i file generati, i binding e i file con soli metadati non contano.

Quando il limite viene superato, dividi il namespace per responsabilità, preservando la struttura idiomatica di Crystal.
