# Aufgaben

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Aufgaben

### PL-FN-001 — Eine klare Verantwortung

Bevorzugte Bezeichnungen:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Vermeiden Sie vage Namen:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Eine Funktion sollte normalerweise eine eindeutig identifizierbare Aktion darstellen.

#### Größenvorgabe

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Das sind Heuristiken, keine absoluten Grenzen.
