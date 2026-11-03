# Commenti

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Commenti {#comments}

### PL-DOC-001 — I commenti spiegano il perché, non il cosa {#pl-doc-001--comments-explain-why-not-what}

Evita:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

I commenti utili spiegano cose come vincoli di protocollo, soluzioni di ripiego, bug esterni, comportamenti matematici non ovvi o vincoli di prestazioni insoliti.

Il codice dovrebbe spiegare **cosa** accade. I commenti dovrebbero spiegare **perché** qualcosa di insolito è necessario.
