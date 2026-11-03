# Bezeichnung

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Bezeichnung

### PL-NAME-001 — Namen müssen sinnvoll sein

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

Vermeiden Sie auch Namen, die unnötig lang sind:

```text
currentIncomingPlayerConnectionRequestObject
```

Die Regel lautet:

> **As kurz wie möglich, so explizit wie nötig.**

Ausnahmen sind für etablierte lokale Konventionen wie z. B. Schleifenzähler zulässig:

```java
for (int i = 0; i < size; i++) {
}
```
