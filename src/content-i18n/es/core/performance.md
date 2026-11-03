# Rendimiento

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Rendimiento

Pureline prioriza la legibilidad por defecto, pero las rutas sensibles al rendimiento deben escribirse deliberadamente.

En los caminos calientes:

- evitar asignaciones innecesarias
- evitar la reflexión repetida
- resolución de caché caro
- utilizar colecciones apropiadas
- evitar bloqueos ocultos
- reducir la copia innecesaria
- mantener la propiedad clara

Las optimizaciones de rendimiento deben seguir siendo comprensibles.
