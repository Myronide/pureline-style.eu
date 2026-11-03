# Abstracties, architectuur en afhankelijkheden

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Regels voor abstractie {#abstraction-rules}

### PL-ARCH-001 — Abstractie vraagt om een reden {#pl-arch-001--abstraction-requires-a-reason}

Vermijd abstracties zoals:

```text
AbstractBaseFactoryManagerProvider
```

die alleen bedoeld zijn om duplicatie te beperken.

Goede redenen voor abstractie zijn onder meer:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architectuur {#architecture}

Pureline geeft de voorkeur aan een duidelijke afhankelijkheidsrichting.

Voorbeeld:

```text
domain
↓
service
↓
infrastructure
```

of featuregeoriënteerde modules:

```text
session/
network/
storage/
command/
runtime/
api/
```

Vermijd cycli zoals:

```text
network → session → storage → network
```

---

## Afhankelijkheden {#dependencies}

Afhankelijkheden moeten zichtbaar zijn in constructors, functieparameters of expliciete modulekoppeling.

Vermijd verborgen patronen voor globale toegang en onnodige service locators.

Dependency injection wordt aangemoedigd waar het de architectuur verbetert, maar Pureline vereist geen zwaar DI-framework.
