# Effetti collaterali e immutabilità

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Effetti collaterali

Important side effects should remain visible.

Preferred:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potentially misleading:

```java
sessions.createAndPersistAndNotify(user);
```

if persistence and event publication are important externally observable actions.

Pureline does not require exposing every internal operation. It requires avoiding surprising hidden behavior.

---

## Immutability

Prefer immutable values by default.

Mutation should be intentional, local, and easy to identify.

Preferred examples include Java records, TypeScript readonly data, `const` in JavaScript, immutable value objects, and short-lived mutable local state.

Avoid shared mutable state where practical.
