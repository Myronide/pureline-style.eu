# Abstraktionen, Architektur und Abhängigkeiten

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Regeln für Abstraktionen {#abstraction-rules}

### PL-ARCH-001 — Abstraktion braucht einen Grund {#pl-arch-001--abstraction-requires-a-reason}

Vermeide Abstraktionen wie:

```text
AbstractBaseFactoryManagerProvider
```

nur um Duplikate zu reduzieren.

Gute Gründe für eine Abstraktion sind unter anderem:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architektur {#architecture}

Pureline bevorzugt eine klare Abhängigkeitsrichtung.

Beispiel:

```text
domain
↓
service
↓
infrastructure
```

oder featureorientierte Module:

```text
session/
network/
storage/
command/
runtime/
api/
```

Vermeide Zyklen wie:

```text
network → session → storage → network
```

---

## Abhängigkeiten {#dependencies}

Abhängigkeiten sollen in Konstruktoren, Funktionsparametern oder explizit verdrahteten Modulen sichtbar sein.

Vermeide versteckte globale Zugriffsmuster und unnötige Service Locators.

Dependency Injection wird empfohlen, wo sie die Architektur verbessert, doch Pureline verlangt kein schwergewichtiges DI-Framework.
