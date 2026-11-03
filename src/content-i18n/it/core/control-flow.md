# Control Flow

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Control Flow

Control flow is one of the most important parts of Pureline.

Pureline standardizes **clarity and structure, not identical syntax across languages**. Java, JavaScript, TypeScript, Go, Emerald, and Emvus use explicit blocks for control flow. Languages with established readable shorthand, such as Crystal postfix guards, may use that shorthand when the condition and action remain simple.

### PL-CF-001 — Prefer Guard Clauses

Preferred:

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

Avoid:

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

The happy path should remain as close to the base indentation level as possible.

### PL-CF-002. Evitare `else`

Avoid:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Prefer:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Per la selezione dei valori si può usare un'espressione a gomito:.

```java
var state = valid ? State.READY : State.INVALID;
```

Complex nested ternaries are not Pureline.

### PL-CF-003. Blocchi espliciti in lingue basate sulle brace

In Java, JavaScript, TypeScript, Go, and other brace-based languages, control-flow bodies use explicit blocks.

Non Pureline:

```java
if (!valid) return;
```

Anche non Pureline:

```java
if (!valid)
    return;
```

Pureline:

```java
if (!valid) {
    return;
}
```

Lo stesso principio si applica a `for`, `while` e a costrutti di flusso-controllo comparabili.

Questa regola fa **not** ban idiomatico cortocircuito in lingue dove quella scorciatoia è una parte normale e leggibile della lingua.. Le protezioni postfix di cristallo come `return unless valid` sono conformi a Pureline quando sono mantenute semplici..
