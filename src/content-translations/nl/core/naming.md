# Naamgeving

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Naamgeving {#naming}

### PL-NAME-001 — Namen moeten betekenisvol zijn {#pl-name-001--names-must-be-meaningful}

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

Vermijd ook onnodig lange namen:

```text
currentIncomingPlayerConnectionRequestObject
```

De regel luidt:

> **Zo kort als mogelijk, zo expliciet als nodig.**

Uitzonderingen zijn toegestaan voor gevestigde lokale conventies, zoals lusteller:

```java
for (int i = 0; i < size; i++) {
}
```
