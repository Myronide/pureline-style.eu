# Abstrakcje, architektura i zależności

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Reguły dotyczące abstrakcji {#abstraction-rules}

### PL-ARCH-001 — Abstrakcja wymaga powodu {#pl-arch-001--abstraction-requires-a-reason}

Unikaj abstrakcji takich jak:

```text
AbstractBaseFactoryManagerProvider
```

stosowanych wyłącznie po to, by ograniczyć duplikację.

Dobre powody do wprowadzenia abstrakcji to:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architektura {#architecture}

Pureline preferuje jasny kierunek zależności.

Przykład:

```text
domain
↓
service
↓
infrastructure
```

lub moduły zorientowane na funkcje:

```text
session/
network/
storage/
command/
runtime/
api/
```

Unikaj cykli takich jak:

```text
network → session → storage → network
```

---

## Zależności {#dependencies}

Zależności powinny być widoczne w konstruktorach, parametrach funkcji lub jawnym łączeniu modułów.

Unikaj ukrytych wzorców dostępu globalnego i zbędnych service locatorów.

Wstrzykiwanie zależności jest zalecane tam, gdzie poprawia architekturę, ale Pureline nie wymaga ciężkiego frameworka DI.
