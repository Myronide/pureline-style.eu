# Controlestroom

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Controlestroom

De controlestroom is een van de belangrijkste onderdelen van Pureline.

Pureline standaardiseert **clarity en structuur, niet identieke syntaxis in talen**. Java, JavaScript, TypeScript, Go, Emerald en Emvus gebruiken expliciete blokken voor controlestroom. Talen met gevestigde leesbare steno, zoals Crystal postfix bewakers, kunnen die steno gebruiken wanneer de conditie en actie eenvoudig blijven.

### PL-CF-001. Bewakersclausules voorkeur

Voorkeur:

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

Vermijd:

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

Het gelukkige pad moet zo dicht mogelijk bij het basisinspringen blijven.

### PL-CF-002. Vermijd `else`

Vermijd:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Voorkeur:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Een ternaire uitdrukking kan worden gebruikt voor eenvoudige waardeselectie:

```java
var state = valid ? State.READY : State.INVALID;
```

Complexe nested ternaren zijn geen Pureline.

### PL-CF-003. Uitdrukkelijke blokken in Brace-based Talen

In Java, JavaScript, TypeScript, Go en andere brace-based talen gebruiken controle-flow lichamen expliciete blokken.

Niet Pureline:

```java
if (!valid) return;
```

Ook niet Pureline:

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

Hetzelfde principe geldt voor `for`, `while` en vergelijkbare besturingsstroomconstructies.

Deze regel doet **not** ban idiomatische steno in talen waar die steno een normaal, leesbaar deel van de taal is. Crystal postfix bewakers zoals `return unless valid` zijn Pureline-compliant wanneer ze eenvoudig worden gehouden.
