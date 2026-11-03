# Opmaak

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Opmaak {#formatting}

### PL-FMT-001 — Geef de voorkeur aan compacte horizontale aanroepen {#pl-fmt-001--prefer-compact-horizontal-calls}

Aanbevolen:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Vermijd onnodige verticale uitbreiding:

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

Verticale opmaak is toegestaan wanneer die een betekenisvolle semantische structuur zichtbaar maakt.

Voorbeeld:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline maakt onderscheid tussen onnodige verticale uitbreiding en betekenisvolle semantische groepering.
