# Abstractions, architecture et dépendances

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Règles d'abstraction

### PL-ARCH-001 — L'abstraction nécessite une raison

Évitez les abstractions comme :

```text
AbstractBaseFactoryManagerProvider
```

simplement pour réduire les doubles emplois.

Les raisons de l'abstraction sont les suivantes :

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

Pureline préfère une direction de dépendance claire.

Exemple :

```text
domain
↓
service
↓
infrastructure
```

ou des modules orientés vers les caractéristiques:

```text
session/
network/
storage/
command/
runtime/
api/
```

Éviter les cycles tels que:

```text
network → session → storage → network
```

---

## Dépendances

Les dépendances doivent être visibles dans les constructeurs, les paramètres de fonction ou le câblage explicite du module.

Évitez les modèles d'accès cachés et les locateurs de services inutiles.

L'injection de dépendance est encouragée là où elle améliore l'architecture, mais Pureline n'exige pas un cadre DI lourd.
