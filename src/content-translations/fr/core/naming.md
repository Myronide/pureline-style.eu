# Nommage

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Nommage {#naming}

### PL-NAME-001 — Les noms doivent être significatifs {#pl-name-001--names-must-be-meaningful}

Bien :

```text
request
session
player
packet
handler
storage
result
connection
worker
```

À éviter :

```text
r
s
p
x
tmp
obj
data2
thing
```

Évitez aussi les noms inutilement longs :

```text
currentIncomingPlayerConnectionRequestObject
```

La règle est :

> **Aussi court que possible, aussi explicite que nécessaire.**

Des exceptions sont permises pour les conventions locales établies, comme les compteurs de boucle :

```java
for (int i = 0; i < size; i++) {
}
```
