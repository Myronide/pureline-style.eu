# Flujo de control

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Flujo de control {#control-flow}

El flujo de control es una de las partes más importantes de Pureline.

Pureline estandariza **la claridad y la estructura, no una sintaxis idéntica en todos los lenguajes**. Java, JavaScript, TypeScript, Go, Emerald y Emvus usan bloques explícitos para el flujo de control. Los lenguajes con abreviaturas legibles ya consolidadas, como las guardas postfijas de Crystal, pueden usarlas mientras la condición y la acción sigan siendo simples.

### PL-CF-001 — Prefiere las guard clauses {#pl-cf-001--prefer-guard-clauses}

Preferible:

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

Evita:

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

El camino principal debe mantenerse lo más cerca posible del nivel de sangría base.

### PL-CF-002 — Evita `else` {#pl-cf-002--avoid-else}

Evita:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Prefiere:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Se puede usar una expresión ternaria para seleccionar un valor sencillo:

```java
var state = valid ? State.READY : State.INVALID;
```

Los ternarios anidados y complejos no son Pureline.

### PL-CF-003 — Bloques explícitos en los lenguajes con llaves {#pl-cf-003--explicit-blocks-in-brace-based-languages}

En Java, JavaScript, TypeScript, Go y otros lenguajes basados en llaves, los cuerpos de control de flujo usan bloques explícitos.

No es Pureline:

```java
if (!valid) return;
```

Tampoco es Pureline:

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

El mismo principio se aplica a `for`, `while` y a las construcciones de control de flujo comparables.

Esta regla **no** prohíbe las abreviaturas idiomáticas en los lenguajes donde son una parte normal y legible del lenguaje. Las guardas postfijas de Crystal, como `return unless valid`, cumplen Pureline siempre que se mantengan simples.
