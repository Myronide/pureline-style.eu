# Fonctions

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Fonctions {#functions}

### PL-FN-001 — Une seule responsabilité claire {#pl-fn-001--one-clear-responsibility}

Noms recommandés :

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

Une fonction doit normalement représenter une seule action clairement identifiable.

#### Repères de taille {#size-guidance}

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

Ce sont des heuristiques, pas des limites absolues.
