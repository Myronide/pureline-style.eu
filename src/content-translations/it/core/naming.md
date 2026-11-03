# Nomi

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Nomi {#naming}

### PL-NAME-001 — I nomi devono essere significativi {#pl-name-001--names-must-be-meaningful}

Buoni:

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

Da evitare:

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

Evita anche i nomi inutilmente lunghi:

```text
currentIncomingPlayerConnectionRequestObject
```

La regola è:

> **Il più corto possibile, il più esplicito necessario.**

Sono ammesse eccezioni per le convenzioni locali consolidate, come i contatori di ciclo:

```java
for (int i = 0; i < size; i++) {
}
```
