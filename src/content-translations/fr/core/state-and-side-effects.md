# Effets de bord et immutabilité

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Effets de bord {#side-effects}

Les effets de bord importants doivent rester visibles.

Recommandé :

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potentiellement trompeur :

```java
sessions.createAndPersistAndNotify(user);
```

si la persistance et la publication d'événements sont des actions importantes, observables de l'extérieur.

Pureline n'exige pas d'exposer chaque opération interne. Il exige d'éviter les comportements cachés qui surprennent.

---

## Immutabilité {#immutability}

Préférez les valeurs immuables par défaut.

La mutation doit être intentionnelle, locale et facile à repérer.

Parmi les exemples recommandés : les records Java, les données readonly de TypeScript, `const` en JavaScript, les objets valeur immuables et un état local mutable de courte durée.

Évitez l'état mutable partagé dans la mesure du possible.
