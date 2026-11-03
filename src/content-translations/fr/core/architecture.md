# Abstractions, architecture et dépendances

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Règles d'abstraction {#abstraction-rules}

### PL-ARCH-001 — Une abstraction exige une raison {#pl-arch-001--abstraction-requires-a-reason}

Évitez les abstractions telles que :

```text
AbstractBaseFactoryManagerProvider
```

dans le seul but de réduire la duplication.

Parmi les bonnes raisons de créer une abstraction :

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architecture {#architecture}

Pureline privilégie un sens de dépendance clair.

Exemple :

```text
domain
↓
service
↓
infrastructure
```

ou des modules orientés fonctionnalité :

```text
session/
network/
storage/
command/
runtime/
api/
```

Évitez les cycles tels que :

```text
network → session → storage → network
```

---

## Dépendances {#dependencies}

Les dépendances doivent être visibles dans les constructeurs, les paramètres de fonction ou un câblage de modules explicite.

Évitez les accès globaux cachés et les service locators inutiles.

L'injection de dépendances est encouragée lorsqu'elle améliore l'architecture, mais Pureline n'exige pas de framework d'injection lourd.
