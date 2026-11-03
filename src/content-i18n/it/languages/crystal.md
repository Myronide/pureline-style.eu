# Crystal Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Crystal Profile

Crystal keeps its own language identity while following Pureline principles.

### PL-CR-001. Le guardie postefix idiomatiche sono ammesse '.

Crystal postfix conditions are Pureline-compliant when they express a short, obvious guard.

Bene:

```crystal
return unless valid
return if closed
```

They fit Pureline well because they can keep guard logic compact and preserve a linear happy path.

Usare un blocco esplicito quando la condizione o l'azione protetta diventa più complessa:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

La regola non è "evitare le condizioni postfix." La regola è: utilizzare la forma che mantiene l'intento immediatamente evidente.

### PL-CR-002. Evitare `else`

Avoid:

```crystal
if valid
  execute
else
  reject
end
```

Prefer:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003. Name idiomatico

Variabili e metodi utilizzano `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Tipi di utilizzo PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004. Preferisci tipo di inferenza

Preferred:

```crystal
session = create_session(user)
```

Evitare annotazioni ridondanti:

```crystal
session : Session = create_session(user)
```

quando Crystal può dedurre il tipo chiaramente. il tipo. il tipo chiaramente.

### PL-CR-005. Guardie nil esplicite

Preferred:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Avoid burying expected nil handling inside deeply nested chains.

### PL-CR-006. Le eccezioni sono per gli Stati eccezionali

I risultati attesi dovrebbero preferibilmente utilizzare modelli di dominio normale come `nil`, tipi di unione, strutture simili a risultati, o eUMS...

Exceptions should represent exceptional failure, not ordinary branching.

### PL-CR-007. Evitare la macrocerba senza bisogno

Le macro cristalline sono potenti, ma Pureline evita di nascondere il comportamento ordinario dietro metang a meno che l'astrazione non produca un chiaro beneficio architettonico.

Generated behavior should remain predictable and discoverable.

---

### Densità della cartella PL-CR-008

A Crystal source or namespace folder may contain at most **10 production `.cr` files** by default.

Specs, generated files, bindings, and metadata-only files do not count.

When the limit is exceeded, split the namespace by responsibility while preserving idiomatic Crystal structure.
