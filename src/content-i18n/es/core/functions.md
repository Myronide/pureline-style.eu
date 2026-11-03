# Funciones

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Funciones

### PL-FN-001: una responsabilidad clara

Nombres preferidos:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Evite nombres vagos:

```text
handleEverything()
process()
doStuff()
executeAll()
```

Una función debe representar normalmente una acción claramente identificable.

#### Guía de tallas

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Son heurísticas, no límites absolutos.
