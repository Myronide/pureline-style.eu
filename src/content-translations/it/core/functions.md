# Funzioni

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Funzioni {#functions}

### PL-FN-001 — Una responsabilità chiara {#pl-fn-001--one-clear-responsibility}

Nomi preferiti:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Evita i nomi vaghi:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Una funzione dovrebbe normalmente rappresentare un'unica azione chiaramente identificabile.

#### Indicazioni sulle dimensioni {#size-guidance}

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Sono euristiche, non limiti assoluti.
