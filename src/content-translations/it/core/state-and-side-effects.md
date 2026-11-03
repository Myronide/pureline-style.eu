# Effetti collaterali e immutabilità

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Effetti collaterali {#side-effects}

Gli effetti collaterali importanti dovrebbero restare visibili.

Preferito:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potenzialmente fuorviante:

```java
sessions.createAndPersistAndNotify(user);
```

se la persistenza e la pubblicazione dell'evento sono azioni importanti, osservabili dall'esterno.

Pureline non richiede di esporre ogni operazione interna. Richiede di evitare comportamenti nascosti che sorprendono.

---

## Immutabilità {#immutability}

Preferisci i valori immutabili per impostazione predefinita.

La mutazione dovrebbe essere intenzionale, locale e facile da individuare.

Esempi preferiti sono i record di Java, i dati readonly di TypeScript, `const` in JavaScript, i value object immutabili e lo stato locale mutabile di breve durata.

Evita lo stato mutabile condiviso, quando è praticabile.
