# Naming

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Naming

### PL-NAME-001 — Names Must Be Meaningful

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

Also avoid names that are unnecessarily long:

```text
currentIncomingPlayerConnectionRequestObject
```

The rule is:

> **As short as possible, as explicit as necessary.**

Exceptions are allowed for established local conventions such as loop counters:

```java
for (int i = 0; i < size; i++) {
}
```
