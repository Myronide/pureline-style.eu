# Formatierung

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formatierung

### PL-FMT-001 — Kompakte horizontale Anrufe bevorzugen

Preferred:

```java
var box = Block.box(min, min, max, max, max, 16);
```

unnötige vertikale Erweiterung vermeiden:

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

Vertikale Formatierung ist erlaubt, wenn sie eine sinnvolle semantische Struktur offenbart.

Beispiel:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline unterscheidet zwischen unnötiger vertikaler Ausdehnung und sinnvoller semantischer Gruppierung.
