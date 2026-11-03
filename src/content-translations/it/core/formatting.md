# Formattazione

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formattazione {#formatting}

### PL-FMT-001 — Preferire chiamate compatte in orizzontale {#pl-fmt-001--prefer-compact-horizontal-calls}

Preferito:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Evita l'espansione verticale superflua:

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

La formattazione verticale è ammessa quando rivela una struttura semantica significativa.

Esempio:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distingue tra espansione verticale superflua e raggruppamento semantico significativo.
