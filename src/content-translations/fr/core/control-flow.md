# Flux de contrôle

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Flux de contrôle {#control-flow}

Le flux de contrôle est l'un des éléments les plus importants de Pureline.

Pureline standardise **la clarté et la structure, pas une syntaxe identique d'un langage à l'autre**. Java, JavaScript, TypeScript, Go, Emerald et Emvus utilisent des blocs explicites pour le flux de contrôle. Les langages qui disposent d'un raccourci lisible bien établi, comme les guards postfixes de Crystal, peuvent l'utiliser tant que la condition et l'action restent simples.

### PL-CF-001 — Préférer les guard clauses {#pl-cf-001--prefer-guard-clauses}

Recommandé :

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

À éviter :

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

Le chemin nominal doit rester aussi proche que possible du niveau d'indentation de base.

### PL-CF-002 — Éviter `else` {#pl-cf-002--avoid-else}

À éviter :

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Recommandé :

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Une expression ternaire peut servir à choisir une valeur simple :

```java
var state = valid ? State.READY : State.INVALID;
```

Les ternaires imbriqués complexes ne sont pas du Pureline.

### PL-CF-003 — Blocs explicites dans les langages à accolades {#pl-cf-003--explicit-blocks-in-brace-based-languages}

En Java, JavaScript, TypeScript, Go et dans les autres langages à accolades, les corps de structures de contrôle utilisent des blocs explicites.

Pas du Pureline :

```java
if (!valid) return;
```

Pas du Pureline non plus :

```java
if (!valid)
    return;
```

Pureline :

```java
if (!valid) {
    return;
}
```

Le même principe s'applique à `for`, `while` et aux structures de contrôle comparables.

Cette règle n'interdit **pas** les raccourcis idiomatiques dans les langages où ils font naturellement partie d'un usage lisible. Les guards postfixes de Crystal, comme `return unless valid`, sont conformes à Pureline lorsqu'ils restent simples.
