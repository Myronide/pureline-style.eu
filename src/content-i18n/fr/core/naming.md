# Naming

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Naming

### PL-NAME-001 — Les noms doivent avoir un sens

Good:

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

Évitez:

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

Évitez également les noms qui sont inutilement longs:

```text
currentIncomingPlayerConnectionRequestObject
```

La règle est la suivante :

> **As court aussi court que possible, aussi explicite que nécessaire.**

Des exceptions sont autorisées pour les conventions locales établies telles que les comptoirs de boucles :

```java
for (int i = 0; i < size; i++) {
}
```
