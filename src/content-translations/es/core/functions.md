# Funciones

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Funciones {#functions}

### PL-FN-001 — Una responsabilidad clara {#pl-fn-001--one-clear-responsibility}

Nombres preferibles:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Evita los nombres vagos:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Una función debe representar, por lo general, una acción claramente identificable.

#### Pautas de tamaño {#size-guidance}

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Son heurísticas, no límites absolutos.
