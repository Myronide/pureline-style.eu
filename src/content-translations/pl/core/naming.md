# Nazewnictwo

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Nazewnictwo {#naming}

### PL-NAME-001 — Nazwy muszą być znaczące {#pl-name-001--names-must-be-meaningful}

Dobrze:

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

Unikaj:

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

Unikaj też nazw niepotrzebnie długich:

```text
currentIncomingPlayerConnectionRequestObject
```

Reguła brzmi:

> **Tak krótko, jak to możliwe, tak jawnie, jak potrzeba.**

Wyjątki są dozwolone dla ugruntowanych konwencji lokalnych, takich jak liczniki pętli:

```java
for (int i = 0; i < size; i++) {
}
```
