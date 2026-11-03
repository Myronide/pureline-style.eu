# Abstracties, Architectuur en Onderhorigheden

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Afkortingsregels

### PL-ARCH-001. Abstractie vereist een reden

Vermijd abstracties zoals:

```text
AbstractBaseFactoryManagerProvider
```

alleen om dubbel werk te voorkomen.

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

## Architectuureeeeeee

Pureline geeft de voorkeur aan een duidelijke afhankelijkheidsrichting.

Voorbeeld:

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

Vermijd cycli zoals:

```text
network → session → storage → network
```

---

## Afhankelijkheden

Afhankelijkheden moeten zichtbaar zijn in constructors, functieparameters of expliciete modulebedrading.

Vermijd verborgen wereldwijde toegangspatronen en onnodige servicelocators.

Afhankelijkheidsinjectie wordt aangemoedigd waar het de architectuur verbetert, maar Pureline heeft geen zwaar DI-kader nodig.
