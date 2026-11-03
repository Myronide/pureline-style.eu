# Formatting

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formatting

### PL-FMT-001. Prefereren Compacte horizontale oproepen

Voorkeur:

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

Verticale opmaak is toegestaan wanneer het betekenisvolle semantische structuur onthult.

Voorbeeld:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline maakt onderscheid tussen onnodige verticale uitbreiding en betekenisvolle semantische groepering.
