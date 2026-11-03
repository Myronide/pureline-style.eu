# Funkcje

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Funkcje {#functions}

### PL-FN-001 — Jedna jasna odpowiedzialność {#pl-fn-001--one-clear-responsibility}

Zalecane nazwy:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Unikaj mglistych nazw:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Funkcja powinna zwykle reprezentować jedną wyraźnie określoną czynność.

#### Wskazówki dotyczące rozmiaru {#size-guidance}

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

To heurystyki, a nie bezwzględne limity.
