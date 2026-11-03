# Functies

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Functies {#functions}

### PL-FN-001 — Eén duidelijke verantwoordelijkheid {#pl-fn-001--one-clear-responsibility}

Aanbevolen namen:

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

Een functie moet normaal gesproken één duidelijk herkenbare actie vertegenwoordigen.

#### Richtlijn voor grootte {#size-guidance}

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Dit zijn vuistregels, geen absolute limieten.
