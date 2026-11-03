# Naamgeving

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Naamgeving

### PL-NAME-001. Namen moeten betekenisvol zijn

Goed:

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

Vermijd:

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

Vermijd ook namen die onnodig lang zijn:

```text
currentIncomingPlayerConnectionRequestObject
```

De regel is:

> **A's kort mogelijk, zo expliciet als nodig.**

Uitzonderingen zijn toegestaan voor gevestigde lokale verdragen zoals looptellers:

```java
for (int i = 0; i < size; i++) {
}
```
