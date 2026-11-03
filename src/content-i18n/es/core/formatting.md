# Formato

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formato

### PL-FMT-001 — Prefiere llamadas horizontales compactas

Preferido:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Evitar la expansión vertical innecesaria:

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

El formato vertical está permitido cuando revela una estructura semántica significativa.

Ejemplo

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distingue entre expansión vertical innecesaria y agrupación semántica significativa.
