# Crystal Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Crystal-profiel

Crystal behoudt zijn eigen taalidentiteit terwijl het Pureline principes volgt.

### PL-CR-001. Idiomatische postfix-guards zijn toegestaan

De voorwaarden van de Crystal postfix zijn Pureline-compliant als ze een korte, duidelijke bewaker uitdrukken.

Goed:

```crystal
return unless valid
return if closed
```

Ze passen goed bij Pureline omdat ze de logica compact kunnen houden en een lineair gelukkig pad kunnen behouden.

Gebruik een expliciet blok wanneer de conditie of de bewaakte actie complexer wordt:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

De regel is niet "vermijd postfix voorwaarden." De regel is: gebruik de vorm die de intentie onmiddellijk duidelijk houdt.

Prefer the postfix form for a single short check with an immediate return.

```text
Block guard                 │ ✓ Pureline
if session.closed?          │ return if session.closed?
  return                    │
end                         │ session.send(packet)
                            │
session.send(packet)        │
```

### PL-CR-002. Vermijd `else`

Vermijd:

```crystal
if valid
  execute
else
  reject
end
```

Voorkeur:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003. Idiomatische naamgeving

Variabelen en methoden gebruiken `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Typen gebruiken PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004. Type-invloeden voorkeur

Voorkeur:

```crystal
session = create_session(user)
```

Vermijd overbodige annotaties:

```crystal
session : Session = create_session(user)
```

wanneer Crystal het type duidelijk kan afleiden.

### PL-CR-005. Expliciete Nil Guards

Voorkeur:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Vermijd het begraven van verwachte nul-behandeling binnen diep nested ketens.

### PL-CR-006. Uitzonderingen zijn voor uitzonderlijke staten

Verwachte resultaten moeten bij voorkeur gebruik maken van normale domeinmodellen zoals `nil`, vakbondstypes, resultaat-achtige structuren of enums.

Uitzonderingen moeten een uitzonderlijke mislukking zijn, niet een gewone vertakking.

### PL-CR-007. Vermijd macro-kleverigheid zonder noodzaak

Crystal macro's zijn krachtig, maar Pureline vermijdt het verbergen van gewoon gedrag achter metaprogrammeren, tenzij de abstractie een duidelijk architectonisch voordeel oplevert.

Gegenereerd gedrag moet voorspelbaar en ontdekbaar blijven.

---

### PL-CR-008. Map Density

Een broncode of naamruimtemap van het Crystal kan maximaal **10 productie `.cr` bestanden** bevatten.

Specificaties, gegenereerde bestanden, bindingen en alleen metadata tellen niet mee.

Wanneer de limiet wordt overschreden, de naamruimte splitsen door verantwoordelijkheid met behoud van idiomatische structuur van het Crystal.
