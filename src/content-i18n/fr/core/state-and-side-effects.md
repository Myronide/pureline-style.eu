# Effets secondaires et immuabilité

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Effets secondaires

Les effets indésirables importants doivent rester visibles.

Préféré:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potentiellement trompeuse:

```java
sessions.createAndPersistAndNotify(user);
```

si la persistance et la publication d'événements sont des actions importantes à l'extérieur et observables.

Pureline n'exige pas d'exposer chaque opération interne. Il faut éviter un comportement surprenant et caché.

---

## Immuabilité

Préférez les valeurs immutables par défaut.

La mutation doit être intentionnelle, locale et facile à identifier.

Les exemples préférés incluent les enregistrements Java, les données en lecture seule TypeScript, `const` en JavaScript, les objets de valeur immutable et l'état local mutable à courte durée de vie.

Évitez l'état mutable partagé là où c'est pratique.
