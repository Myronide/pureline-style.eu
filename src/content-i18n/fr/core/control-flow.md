# Débit de contrôle

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Débit de contrôle

Le débit de contrôle est l'une des parties les plus importantes de Pureline.

Pureline standardise la clarté et la structure de **, pas la syntaxe identique entre les langues**. Java, JavaScript, TypeScript, Go, Emerald et Emvus utilisent des blocs explicites pour le flux de contrôle. Les langues avec une courte main lisible établie, comme Crystal postfix garde, peuvent utiliser cette courte main lorsque l'état et l'action restent simples.

### PL-CF-001 — Clauses de garde préférentielles

Préféré:

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

Évitez:

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

Le chemin heureux devrait rester aussi proche que possible du niveau de base.

### PL-CF-002 — Éviter `else`

Évitez:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Préférez :

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Une expression ternaire peut être utilisée pour une sélection de valeurs simple:

```java
var state = valid ? State.READY : State.INVALID;
```

Les ternaires imbriqués complexes ne sont pas Pureline.

### PL-CF-003 — Blocs explicites dans les langues basées sur le Brace

En Java, JavaScript, TypeScript, Go et autres langages basés sur les supports, les organes de contrôle-flux utilisent des blocs explicites.

Pas Pureline:

```java
if (!valid) return;
```

Aussi pas Pureline:

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

Le même principe s'applique aux constructions `for`, `while` et des débits de commande comparables.

Cette règle fait de **not** une interdiction de raccourcis idiomatiques dans les langues où ce raccourci est une partie normale et lisible de la langue. Les protecteurs de postfixe en cristal tels que `return unless valid` sont conformes à Pureline lorsqu'ils sont maintenus simples.
