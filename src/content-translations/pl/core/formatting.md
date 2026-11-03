# Formatowanie

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formatowanie {#formatting}

### PL-FMT-001 — Preferuj zwarte wywołania w poziomie {#pl-fmt-001--prefer-compact-horizontal-calls}

Zalecane:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Unikaj zbędnego rozbijania w pionie:

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

Formatowanie w pionie jest dozwolone, gdy ujawnia znaczącą strukturę semantyczną.

Przykład:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline odróżnia zbędne rozbijanie w pionie od znaczącego grupowania semantycznego.
