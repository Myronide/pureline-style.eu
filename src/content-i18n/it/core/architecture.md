# Abstracts, Architettura e Dipendenze dime... le proprie imprese.

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Abstraction Rules

### PL-ARCH-001. L'astrazione richiede una ragione.nexe..xe..

Avoid abstractions such as:

```text
AbstractBaseFactoryManagerProvider
```

merely to reduce duplication.

Good reasons for abstraction include:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architecture

Pureline prefers clear dependency direction.

Example:

```text
domain
↓
service
↓
infrastructure
```

or feature-oriented modules:

```text
session/
network/
storage/
command/
runtime/
api/
```

Avoid cycles such as:

```text
network → session → storage → network
```

---

## Dependencies

Dependencies should be visible in constructors, function parameters, or explicit module wiring.

Avoid hidden global access patterns and unnecessary service locators.

Dependency injection is encouraged where it improves architecture, but Pureline does not require a heavy DI framework.
