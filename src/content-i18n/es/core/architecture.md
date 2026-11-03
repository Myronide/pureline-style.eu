# Abstracciones, arquitectura y dependencias

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Reglas de Abstracción

### PL-ARCH-001 — La abstracción requiere una razón

Evitar abstracciones como:

```text
AbstractBaseFactoryManagerProvider
```

sólo para reducir la duplicación.

Entre las buenas razones de la abstracción se incluyen:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Arquitectura

Pureline prefiere una dirección de dependencia clara.

Ejemplo

```text
domain
↓
service
↓
infrastructure
```

o módulos orientados a las características:

```text
session/
network/
storage/
command/
runtime/
api/
```

Evite ciclos como:

```text
network → session → storage → network
```

---

## Dependencias

Las dependencias deben ser visibles en los grenos, parámetros de función o cableado explícito del módulo.

Evite patrones de acceso mundiales ocultos y los usuarios de servicios innecesarios.

Se recomienda la inyección de dependencia donde se mejora la arquitectura, pero Pureline no requiere un marco de DI pesado.
