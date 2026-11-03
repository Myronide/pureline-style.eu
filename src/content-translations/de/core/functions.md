# Funktionen

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Funktionen {#functions}

### PL-FN-001 — Eine klare Verantwortung {#pl-fn-001--one-clear-responsibility}

Bevorzugte Namen:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Vage Namen vermeiden:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Eine Funktion soll normalerweise genau eine klar erkennbare Aktion darstellen.

#### Größenrichtwerte {#size-guidance}

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Das sind Heuristiken, keine absoluten Grenzen.
