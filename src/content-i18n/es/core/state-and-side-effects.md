# Efectos secundarios e inmutabilidad

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Efectos secundarios

Los efectos secundarios importantes deben permanecer visibles.

Preferido:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Posible error:

```java
sessions.createAndPersistAndNotify(user);
```

si la persistencia y la publicación de eventos son acciones importantes desde el exterior.

Pureline no requiere exponer todas las operaciones internas. Requiere evitar comportamientos ocultos sorprendentes.

---

## Inmutabilidad

Prefiere valores inmutables por defecto.

La mutación debe ser intencional, local y fácil de identificar.

Ejemplos preferidos incluyen registros Java, datos de sólo lectura TypeScript, `const` en JavaScript, objetos de valor inmutables y estado local mutable de corta duración.

Evite el estado mutable compartido cuando sea práctico.
