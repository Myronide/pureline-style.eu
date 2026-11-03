# Rendimiento

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Rendimiento {#performance}

Pureline prioriza la legibilidad por defecto, pero las rutas sensibles al rendimiento deben escribirse de forma deliberada.

En las rutas críticas:

- evita las asignaciones innecesarias
- evita la reflexión repetida
- guarda en caché las resoluciones costosas
- usa las colecciones adecuadas
- evita los bloqueos ocultos
- reduce las copias innecesarias
- mantén clara la propiedad de los recursos

Las optimizaciones de rendimiento deben seguir siendo comprensibles.
