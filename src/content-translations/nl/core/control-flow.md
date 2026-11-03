# Besturingsstroom

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Besturingsstroom {#control-flow}

Besturingsstroom is een van de belangrijkste onderdelen van Pureline.

Pureline standaardiseert **duidelijkheid en structuur, niet identieke syntaxis in alle talen**. Java, JavaScript, TypeScript, Go, Emerald en Emvus gebruiken expliciete blokken voor besturingsstroom. Talen met een gevestigde, leesbare verkorting, zoals de postfix-guards van Crystal, mogen die verkorting gebruiken zolang de voorwaarde en de actie eenvoudig blijven.

### PL-CF-001 — Geef de voorkeur aan guard clauses {#pl-cf-001--prefer-guard-clauses}

Aanbevolen:

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

Het happy path moet zo dicht mogelijk bij het basisinspringniveau blijven.

### PL-CF-002 — Vermijd `else` {#pl-cf-002--avoid-else}

Vermijd:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Aanbevolen:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Een ternaire expressie mag worden gebruikt voor eenvoudige waardeselectie:

```java
var state = valid ? State.READY : State.INVALID;
```

Complexe geneste ternaire expressies zijn geen Pureline.

### PL-CF-003 — Expliciete blokken in talen met accolades {#pl-cf-003--explicit-blocks-in-brace-based-languages}

In Java, JavaScript, TypeScript, Go en andere talen met accolades gebruiken de bodies van besturingsstromen expliciete blokken.

Geen Pureline:

```java
if (!valid) return;
```

Ook geen Pureline:

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

Hetzelfde principe geldt voor `for`, `while` en vergelijkbare besturingsconstructies.

Deze regel verbiedt **geen** idiomatische verkortingen in talen waar die verkorting een normaal, leesbaar onderdeel van de taal is. Postfix-guards in Crystal, zoals `return unless valid`, voldoen aan Pureline zolang ze eenvoudig blijven.
