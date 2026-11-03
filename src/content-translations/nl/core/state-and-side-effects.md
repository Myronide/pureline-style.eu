# Neveneffecten en onveranderlijkheid

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Neveneffecten {#side-effects}

Belangrijke neveneffecten moeten zichtbaar blijven.

Aanbevolen:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Mogelijk misleidend:

```java
sessions.createAndPersistAndNotify(user);
```

als persistentie en het publiceren van events belangrijke, extern waarneembare acties zijn.

Pureline vereist niet dat elke interne bewerking zichtbaar wordt gemaakt. Het vereist wel dat verrassend verborgen gedrag wordt vermeden.

---

## Onveranderlijkheid {#immutability}

Geef standaard de voorkeur aan onveranderlijke waarden.

Mutatie moet bewust, lokaal en makkelijk herkenbaar zijn.

Voorbeelden van aanbevolen keuzes zijn Java-records, readonly data in TypeScript, `const` in JavaScript, onveranderlijke waardeobjecten en kortlevende, veranderlijke lokale toestand.

Vermijd gedeelde veranderlijke toestand waar dat praktisch mogelijk is.
