# Bijwerkingen en onveranderlijkheid

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Bijwerkingen

Belangrijke bijwerkingen moeten zichtbaar blijven.

Voorkeur:

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

indien persistentie en publicatie van gebeurtenissen belangrijke extern waarneembare acties zijn.

Pureline vereist niet elke interne handeling bloot te stellen. Het vereist het vermijden van verrassend verborgen gedrag.

---

## Onveranderlijkheid

Standaard voorkeur onveranderlijke waarden.

Mutation moet opzettelijk, lokaal en gemakkelijk te identificeren zijn.

Voorkeursvoorbeelden zijn onder meer Java records, TypeScript alleen-lezen data, `const` in JavaScript, onveranderlijke waarde objecten, en kortstondige veranderlijke lokale staat.

Vermijd gedeelde veranderlijke toestand waar dat praktisch is.
