# Controllo di flusso

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Controllo di flusso {#control-flow}

Il controllo di flusso è una delle parti più importanti di Pureline.

Pureline standardizza **chiarezza e struttura, non una sintassi identica tra i linguaggi**. Java, JavaScript, TypeScript, Go, Emerald ed Emvus usano blocchi espliciti per il controllo di flusso. I linguaggi con una scorciatoia consolidata e leggibile, come le guardie postfisse di Crystal, possono usarla finché la condizione e l'azione restano semplici.

### PL-CF-001 — Preferire le guard clause {#pl-cf-001--prefer-guard-clauses}

Preferito:

```java
if (request == null) {
    return Result.empty();
}

if (!request.valid()) {
    return Result.invalid();
}

var session = sessions.create(request.user());
return executor.execute(session, request);
```

Da evitare:

```java
if (request != null) {
    if (request.valid()) {
        var session = sessions.create(request.user());
        return executor.execute(session, request);
    } else {
        return Result.invalid();
    }
}

return Result.empty();
```

Il percorso principale dovrebbe restare il più vicino possibile al livello di indentazione di base.

### PL-CF-002 — Evitare `else` {#pl-cf-002--avoid-else}

Da evitare:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Preferito:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Per la semplice scelta di un valore si può usare un'espressione ternaria:

```java
var state = valid ? State.READY : State.INVALID;
```

I ternari annidati complessi non sono Pureline.

### PL-CF-003 — Blocchi espliciti nei linguaggi con parentesi graffe {#pl-cf-003--explicit-blocks-in-brace-based-languages}

In Java, JavaScript, TypeScript, Go e negli altri linguaggi con parentesi graffe, i corpi del controllo di flusso usano blocchi espliciti.

Non è Pureline:

```java
if (!valid) return;
```

Non è Pureline nemmeno:

```java
if (!valid)
    return;
```

È Pureline:

```java
if (!valid) {
    return;
}
```

Lo stesso principio vale per `for`, `while` e i costrutti di controllo di flusso analoghi.

Questa regola **non** vieta le scorciatoie idiomatiche nei linguaggi in cui sono una parte normale e leggibile del linguaggio. Le guardie postfisse di Crystal come `return unless valid` sono conformi a Pureline se restano semplici.
