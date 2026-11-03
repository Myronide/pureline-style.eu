# Nombres

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Nombres {#naming}

### PL-NAME-001 — Los nombres deben tener significado {#pl-name-001--names-must-be-meaningful}

Bien:

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

Evita:

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

Evita también los nombres innecesariamente largos:

```text
currentIncomingPlayerConnectionRequestObject
```

La regla es:

> **Lo más corto posible, lo más explícito necesario.**

Se admiten excepciones para convenciones locales consolidadas, como los contadores de bucle:

```java
for (int i = 0; i < size; i++) {
}
```
