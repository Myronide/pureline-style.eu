# Formatage

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Formatage

### PL-FMT-001 — Préférez les appels horizontaux compacts

Préféré:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Éviter toute expansion verticale inutile:

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

Le formatage vertical est autorisé lorsqu'il révèle une structure sémantique significative.

Exemple :

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distingue entre l'expansion verticale inutile et le groupement sémantique significatif.
