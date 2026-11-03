# Mise en forme

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Mise en forme {#formatting}

### PL-FMT-001 — Préférer les appels compacts à l'horizontale {#pl-fmt-001--prefer-compact-horizontal-calls}

Recommandé :

```java
var box = Block.box(min, min, max, max, max, 16);
```

Évitez l'éclatement vertical inutile :

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

La mise en forme verticale est permise lorsqu'elle révèle une structure sémantique significative.

Exemple :

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distingue l'éclatement vertical inutile du regroupement sémantique pertinent.
