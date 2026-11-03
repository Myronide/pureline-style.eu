# Efectos secundarios e inmutabilidad

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Efectos secundarios {#side-effects}

Los efectos secundarios importantes deben seguir siendo visibles.

Preferible:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potencialmente engañoso:

```java
sessions.createAndPersistAndNotify(user);
```

si la persistencia y la publicación del evento son acciones importantes y observables desde fuera.

Pureline no exige exponer cada operación interna. Exige evitar los comportamientos ocultos que sorprenden.

---

## Inmutabilidad {#immutability}

Prefiere los valores inmutables por defecto.

La mutación debe ser intencionada, local y fácil de identificar.

Entre los ejemplos preferibles están los records de Java, los datos readonly de TypeScript, `const` en JavaScript, los objetos de valor inmutables y el estado local mutable de corta vida.

Evita el estado mutable compartido siempre que sea posible.
