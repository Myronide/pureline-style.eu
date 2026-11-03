# Nebenwirkungen und Unwandelbarkeit

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Nebenwirkungen

Wichtige Nebenwirkungen sollten sichtbar bleiben.

Preferred:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Kann irreführend sein:

```java
sessions.createAndPersistAndNotify(user);
```

wenn Persistenz und Ereignisveröffentlichungen wichtige extern beobachtbare Aktionen sind.

Pureline erfordert nicht die Entlarvung jedes internen Betriebs. Es erfordert, dass man überraschendes, verborgenes Verhalten vermeidet.

---

## Unumkehrbarkeit

Bevorzugen Sie standardmäßig unveränderliche Werte.

Die Navigation sollte absichtlich, lokal und leicht zu identifizieren sein.

Bevorzugte Beispiele sind Java-Datensätze, TypeScript-Lesedaten, `const` in JavaScript, unveränderliche Werteobjekte und kurzlebige mutierbare Lokalzustände.

Vermeiden Sie einen gemeinsamen, wandelbaren Zustand, wo praktisch.
