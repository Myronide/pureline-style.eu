# Abstracciones, arquitectura y dependencias

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Reglas de abstracción {#abstraction-rules}

### PL-ARCH-001 — Toda abstracción requiere una razón {#pl-arch-001--abstraction-requires-a-reason}

Evita abstracciones como:

```text
AbstractBaseFactoryManagerProvider
```

solo para reducir la duplicación.

Entre las buenas razones para abstraer se cuentan:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Arquitectura {#architecture}

Pureline prefiere una dirección de dependencias clara.

Ejemplo:

```text
domain
↓
service
↓
infrastructure
```

o módulos orientados a funcionalidades:

```text
session/
network/
storage/
command/
runtime/
api/
```

Evita ciclos como:

```text
network → session → storage → network
```

---

## Dependencias {#dependencies}

Las dependencias deben ser visibles en los constructores, en los parámetros de las funciones o en un cableado de módulos explícito.

Evita los patrones de acceso global oculto y los localizadores de servicios innecesarios.

Se recomienda la inyección de dependencias cuando mejora la arquitectura, pero Pureline no exige un framework de DI pesado.
