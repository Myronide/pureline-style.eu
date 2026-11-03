# Control de flujo

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Control de flujo

El flujo de control es una de las partes más importantes de Pureline.

Pureline estandariza la claridad y estructura de **, no una sintaxis idéntica entre los idiomas**. Java, JavaScript, TypeScript, Go, Emerald y Emvus usan bloques explícitos para controlar el flujo. Idiomas con taquigrafía legible establecida, como los protectores de Crystal postfix, pueden utilizar esa taquigrafía cuando la condición y la acción siguen siendo simples.

### PL-CF-001 — Prefiere cláusulas de protección

Preferido:

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

Evitar:

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

El camino feliz debe permanecer lo más cerca posible del nivel de sangrado de la base.

### PL-CF-002 — Evitar `else`

Evitar:

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

Una expresión de carácter temporal puede ser utilizada para la selección de valor simple:

```java
var state = valid ? State.READY : State.INVALID;
```

Las anidaciones de los complejos no son Pureline.

### PL-CF-003 — Bloques explícitos en idiomas basados en la braza

En Java, JavaScript, TypeScript, Go y otros lenguajes basados en ortodoncia, los cuerpos de flujo de control utilizan bloques explícitos.

No Pureline:

```java
if (!valid) return;
```

Tampoco Pureline:

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

El mismo principio se aplica a las construcciones de `for`, `while` y de flujo de control comparable.

Esta regla hace **not** ban Ñulática taquigrafía en idiomas donde esa taquigrafía es una parte normal y legible del idioma. Los protectores de postfix cristalinos como `return unless valid` cumplen con Pureline cuando se mantienen simples.
