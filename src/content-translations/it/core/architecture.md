# Astrazioni, architettura e dipendenze

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Regole sulle astrazioni {#abstraction-rules}

### PL-ARCH-001 — L'astrazione richiede una ragione {#pl-arch-001--abstraction-requires-a-reason}

Evita astrazioni come:

```text
AbstractBaseFactoryManagerProvider
```

solo per ridurre la duplicazione.

Buone ragioni per introdurre un'astrazione sono:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

## Architettura {#architecture}

Pureline preferisce una direzione chiara delle dipendenze.

Esempio:

```text
domain
↓
service
↓
infrastructure
```

oppure moduli organizzati per funzionalità:

```text
session/
network/
storage/
command/
runtime/
api/
```

Evita i cicli come:

```text
network → session → storage → network
```

---

## Dipendenze {#dependencies}

Le dipendenze dovrebbero essere visibili nei costruttori, nei parametri delle funzioni o nel collegamento esplicito dei moduli.

Evita i pattern di accesso globale nascosto e i service locator superflui.

L'iniezione delle dipendenze è incoraggiata dove migliora l'architettura, ma Pureline non richiede un framework di DI pesante.
