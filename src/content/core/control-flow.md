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

### PL-CF-002 — Avoid `else`

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

A ternary expression may be used for simple value selection:

```java
var state = valid ? State.READY : State.INVALID;
```

Complex nested ternaries are not Pureline.

### PL-CF-003 — Explicit Blocks in Brace-Based Languages

In Java, JavaScript, TypeScript, Go, and other brace-based languages, control-flow bodies use explicit blocks.

Not Pureline:

```java
if (!valid) return;
```

Also not Pureline:

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

The same principle applies to `for`, `while`, and comparable control-flow constructs.

This rule does **not** ban idiomatic shorthand in languages where that shorthand is a normal, readable part of the language. Crystal postfix guards such as `return unless valid` are Pureline-compliant when kept simple.
