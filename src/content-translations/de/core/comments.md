# Kommentare

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Kommentare {#comments}

### PL-DOC-001 — Kommentare erklären das Warum, nicht das Was {#pl-doc-001--comments-explain-why-not-what}

Vermeide:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Nützliche Kommentare erklären etwa Protokollbeschränkungen, Workarounds, Fehler in fremdem Code, nicht offensichtliches mathematisches Verhalten oder ungewöhnliche Performance-Anforderungen.

Code soll erklären, **was** passiert. Kommentare sollen erklären, **warum** etwas Ungewöhnliches nötig ist.
