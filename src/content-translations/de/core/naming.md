# Benennung

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Benennung {#naming}

### PL-NAME-001 — Namen müssen aussagekräftig sein {#pl-name-001--names-must-be-meaningful}

Gut:

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

Vermeiden:

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

Vermeide außerdem unnötig lange Namen:

```text
currentIncomingPlayerConnectionRequestObject
```

Die Regel lautet:

> **So kurz wie möglich, so explizit wie nötig.**

Ausnahmen sind für etablierte lokale Konventionen wie Schleifenzähler erlaubt:

```java
for (int i = 0; i < size; i++) {
}
```
