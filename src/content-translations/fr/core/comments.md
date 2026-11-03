# Commentaires

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Commentaires {#comments}

### PL-DOC-001 — Les commentaires expliquent le pourquoi, pas le quoi {#pl-doc-001--comments-explain-why-not-what}

À éviter :

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Les commentaires utiles expliquent des éléments tels que les contraintes d'un protocole, les contournements, les bogues externes, un comportement mathématique non évident ou des contraintes de performance inhabituelles.

Le code doit expliquer **ce qui** se passe. Les commentaires doivent expliquer **pourquoi** un comportement inhabituel est nécessaire.
