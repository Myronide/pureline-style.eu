# Denominazione

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Denominazione

### PL-NAME-001. I nomi devono essere significativi

Bene:

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

Avoid:

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

Evitate anche i nomi che sono inutilmente lunghi:

```text
currentIncomingPlayerConnectionRequestObject
```

La regola è:.

> **As breve il più possibile, il più esplicito possibile.**

Sono ammesse eccezioni per convenzioni locali stabilite, come i contatori di ciclo:

```java
for (int i = 0; i < size; i++) {
}
```
