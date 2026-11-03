# Commentaires

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Commentaires

### PL-DOC-001 — Commentaires Expliquer pourquoi, pas quoi

Évitez:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Des commentaires utiles expliquent des choses telles que des contraintes de protocole, des solutions de rechange, des bogues externes, des comportements mathématiques non évidents ou des contraintes de performance inhabituelles.

Le code devrait expliquer **quand** se produit. Les commentaires doivent expliquer **why** quelque chose d'inhabituel est nécessaire.
