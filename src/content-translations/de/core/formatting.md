# Formatierung

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formatierung {#formatting}

### PL-FMT-001 — Kompakte horizontale Aufrufe bevorzugen {#pl-fmt-001--prefer-compact-horizontal-calls}

Bevorzugt:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Unnötige vertikale Aufspaltung vermeiden:

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

Vertikale Formatierung ist erlaubt, wenn sie eine sinnvolle semantische Struktur sichtbar macht.

Beispiel:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline unterscheidet zwischen unnötiger vertikaler Aufspaltung und sinnvoller semantischer Gruppierung.
