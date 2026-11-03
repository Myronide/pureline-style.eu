# Functieseeeeeeee

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Functieseeeeeeee

### PL-FN-001. Eén duidelijke verantwoordelijkheid

Voorkeursnamen:e namen:e namen:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Vermijd vage namen:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Een functie moet normaal gesproken één duidelijk identificeerbare handeling zijn.

#### Groottegeleiding

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Dit zijn heuristiek, geen absolute grenzen.
