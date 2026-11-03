# Fonctions

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Fonctions

### PL-FN-001 — Une responsabilité claire

Noms préférés:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Évitez les noms vagues :

```text
handleEverything()
process()
doStuff()
executeAll()
```

Une fonction doit normalement représenter une action clairement identifiable.

#### Guide de la taille

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Ce sont des heuristiques, pas des limites absolues.
