# Abstraktionen, Architektur und Abhängigkeiten

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Abstractionsregeln

### PL-ARCH-001 — Abstraktion erfordert einen Grund

Vermeiden Sie Abstraktionen wie:

```text
AbstractBaseFactoryManagerProvider
```

nur um die Doppelarbeit zu verringern.

Gute Gründe für die Abstraktion sind:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architektur

Pureline bevorzugt klare Abhängigkeitsrichtung.

Beispiel:

```text
domain
↓
service
↓
infrastructure
```

oder funktionsorientierte Module:

```text
session/
network/
storage/
command/
runtime/
api/
```

Vermeiden Sie Zyklen wie:

```text
network → session → storage → network
```

---

## Abhängigkeiten

Abhängigkeiten sollten in Konstruktoren, Funktionsparametern oder expliziten Modulverdrahtungen sichtbar sein.

Vermeiden Sie versteckte globale Zugangsmuster und unnötige Service-Lokatoren.

Abhängigkeitsinjektion wird empfohlen, wo es die Architektur verbessert, aber Pureline erfordert keine schweren DI-Framework.
