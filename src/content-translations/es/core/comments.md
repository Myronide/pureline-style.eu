# Comentarios

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Comentarios {#comments}

### PL-DOC-001 — Los comentarios explican el porqué, no el qué {#pl-doc-001--comments-explain-why-not-what}

Evita:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Los comentarios útiles explican cosas como restricciones de un protocolo, soluciones provisionales, errores de terceros, comportamientos matemáticos poco evidentes o restricciones de rendimiento inusuales.

El código debe explicar **qué** ocurre. Los comentarios deben explicar **por qué** es necesario algo inusual.
