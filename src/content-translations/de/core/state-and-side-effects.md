# Seiteneffekte und Unveränderlichkeit

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Seiteneffekte {#side-effects}

Wichtige Seiteneffekte sollen sichtbar bleiben.

Bevorzugt:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potenziell irreführend:

```java
sessions.createAndPersistAndNotify(user);
```

wenn Persistierung und Event-Veröffentlichung wichtige, von außen beobachtbare Aktionen sind.

Pureline verlangt nicht, jede interne Operation offenzulegen. Es verlangt, überraschendes verstecktes Verhalten zu vermeiden.

---

## Unveränderlichkeit {#immutability}

Unveränderliche Werte sind der Standard.

Mutation soll bewusst, lokal und leicht erkennbar sein.

Bevorzugte Beispiele sind Java-Records, schreibgeschützte Daten in TypeScript, `const` in JavaScript, unveränderliche Value Objects und kurzlebiger veränderlicher lokaler Zustand.

Vermeide gemeinsam genutzten veränderlichen Zustand, wo es praktikabel ist.
