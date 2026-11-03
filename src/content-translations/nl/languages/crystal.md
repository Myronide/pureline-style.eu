# Crystal-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Crystal-profiel {#crystal-profile}

Crystal behoudt zijn eigen taalidentiteit en volgt tegelijk de principes van Pureline.

### PL-CR-001 — Idiomatische postfix-guards zijn toegestaan {#pl-cr-001--idiomatic-postfix-guards-are-allowed}

Postfix-voorwaarden in Crystal voldoen aan Pureline wanneer ze een korte, vanzelfsprekende guard uitdrukken.

Goed:

```crystal
return unless valid
return if closed
```

Ze passen goed bij Pureline omdat ze guardlogica compact kunnen houden en een lineair happy path behouden.

Gebruik een expliciet blok wanneer de voorwaarde of de bewaakte actie complexer wordt:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

De regel is niet "vermijd postfix-voorwaarden". De regel is: gebruik de vorm waarin de intentie direct duidelijk blijft.

### PL-CR-002 — Vermijd `else` {#pl-cr-002--avoid-else}

Vermijd:

```crystal
if valid
  execute
else
  reject
end
```

Aanbevolen:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Idiomatische naamgeving {#pl-cr-003--idiomatic-naming}

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

### PL-CR-004 — Geef de voorkeur aan typeinferentie {#pl-cr-004--prefer-type-inference}

Aanbevolen:

```crystal
session = create_session(user)
```

Vermijd overbodige annotaties:

```crystal
session : Session = create_session(user)
```

wanneer Crystal het type duidelijk kan afleiden.

### PL-CR-005 — Expliciete nil-guards {#pl-cr-005--explicit-nil-guards}

Aanbevolen:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Vermijd het wegstoppen van verwachte nil-afhandeling in diep geneste ketens.

### PL-CR-006 — Uitzonderingen zijn voor uitzonderlijke toestanden {#pl-cr-006--exceptions-are-for-exceptional-states}

Verwachte uitkomsten moeten bij voorkeur worden gemodelleerd met gewone domeinmodellering, zoals `nil`, uniontypen, resultaatachtige structuren of enums.

Uitzonderingen moeten een uitzonderlijke fout vertegenwoordigen, geen gewone vertakking.

### PL-CR-007 — Vermijd onnodig vernuftige macro's {#pl-cr-007--avoid-macro-cleverness-without-need}

Macro's in Crystal zijn krachtig, maar Pureline vermijdt het verbergen van gewoon gedrag achter metaprogrammering, tenzij de abstractie een duidelijk architecturaal voordeel oplevert.

Gegenereerd gedrag moet voorspelbaar en vindbaar blijven.

---

### PL-CR-008 — Mapdichtheid {#pl-cr-008--folder-density}

Een bron- of namespacemap in Crystal mag standaard maximaal **10 `.cr`-bestanden voor productie** bevatten.

Specs, gegenereerde bestanden, bindings en bestanden met alleen metadata tellen niet mee.

Wanneer de limiet wordt overschreden, splits de namespace dan op verantwoordelijkheid, met behoud van een idiomatische Crystal-structuur.
