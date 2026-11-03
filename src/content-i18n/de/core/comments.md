# Bemerkungen

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Bemerkungen

### PL-DOC-001 — Kommentare erklären, warum, nicht was

Avoid:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Nützliche Kommentare erklären Dinge wie Protokoll-Beschränkungen, Workarounds, externe Fehler, nicht-offensichtliches mathematisches Verhalten oder ungewöhnliche Leistungsbeschränkungen.

Code sollte erklären, **what** passiert. Kommentare sollten **why** etwas Ungewöhnliches erklären.
