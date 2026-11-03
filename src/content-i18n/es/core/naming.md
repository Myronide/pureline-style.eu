# Nombre

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Nombre

### PL-NAME-001: los nombres deben ser significativos

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

Evitar:

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

También evite nombres que son innecesariamente largos:

```text
currentIncomingPlayerConnectionRequestObject
```

La regla es:

> **As cortos como sea posible, tan explícito como sea necesario.**

Se permiten excepciones para convenciones locales establecidas, como contadores de bucles:

```java
for (int i = 0; i < size; i++) {
}
```
