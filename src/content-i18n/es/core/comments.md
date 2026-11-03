# Observaciones

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Observaciones

### PL-DOC-001 — Los comentarios explican por qué, no qué

Evitar:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Los comentarios útiles explican cosas como restricciones del protocolo, soluciones, fallos externos, comportamiento matemático no obvio o limitaciones de rendimiento inusuales.

El código debe explicar **what** sucede. Los comentarios deben explicar **whyZ** algo inusual es necesario.
