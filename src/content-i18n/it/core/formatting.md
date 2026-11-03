# Formattazione

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formattazione

### PL-FMT-001. Preferire chiamate orizzontali compatte

Preferred:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Evitare l'espansione verticale inutile:

```java
var box = Block.box(
    min,
    min,
    max,
    max,
    max,
    16
);
```

Vertical formatting is allowed when it reveals meaningful semantic structure.

Example:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distinguishes between unnecessary vertical expansion and meaningful semantic grouping.
