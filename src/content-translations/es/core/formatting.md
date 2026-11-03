# Formato

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formato {#formatting}

### PL-FMT-001 — Prefiere las llamadas compactas en horizontal {#pl-fmt-001--prefer-compact-horizontal-calls}

Preferible:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Evita la expansión vertical innecesaria:

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

El formato vertical se permite cuando revela una estructura semántica con sentido.

Ejemplo:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distingue entre la expansión vertical innecesaria y la agrupación semántica con sentido.
