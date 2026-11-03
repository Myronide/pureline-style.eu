# Kontrollfluss

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Kontrollfluss {#control-flow}

Der Kontrollfluss ist einer der wichtigsten Teile von Pureline.

Pureline standardisiert **Klarheit und Struktur, nicht identische Syntax über alle Sprachen hinweg**. Java, JavaScript, TypeScript, Go, Emerald und Emvus verwenden für den Kontrollfluss explizite Blöcke. Sprachen mit etablierter, gut lesbarer Kurzschreibweise, etwa die nachgestellten Guards in Crystal, dürfen diese verwenden, solange Bedingung und Aktion einfach bleiben.

### PL-CF-001 — Guard Clauses bevorzugen {#pl-cf-001--prefer-guard-clauses}

Bevorzugt:

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

Vermeiden:

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

Der Happy Path soll so nah an der Basis-Einrückung bleiben wie möglich.

### PL-CF-002 — `else` vermeiden {#pl-cf-002--avoid-else}

Vermeiden:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Bevorzugen:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Ein ternärer Ausdruck darf für eine einfache Wertauswahl verwendet werden:

```java
var state = valid ? State.READY : State.INVALID;
```

Komplexe verschachtelte Ternaries sind nicht Pureline.

### PL-CF-003 — Explizite Blöcke in klammerbasierten Sprachen {#pl-cf-003--explicit-blocks-in-brace-based-languages}

In Java, JavaScript, TypeScript, Go und anderen klammerbasierten Sprachen verwenden Kontrollfluss-Rümpfe explizite Blöcke.

Nicht Pureline:

```java
if (!valid) return;
```

Ebenfalls nicht Pureline:

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

Dasselbe Prinzip gilt für `for`, `while` und vergleichbare Kontrollfluss-Konstrukte.

Diese Regel verbietet idiomatische Kurzschreibweisen **nicht** in Sprachen, in denen sie ein normaler, gut lesbarer Teil der Sprache sind. Nachgestellte Guards in Crystal wie `return unless valid` sind Pureline-konform, solange sie einfach bleiben.
