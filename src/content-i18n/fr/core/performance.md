# Résultats

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Résultats

Pureline priorise la lisibilité par défaut, mais les chemins sensibles aux performances doivent être écrits délibérément.

Dans les sentiers chauds:

- éviter les allocations inutiles
- éviter une réflexion répétée
- cache résolution coûteuse
- utiliser les collections appropriées
- éviter le blocage caché
- réduire la copie inutile
- de garder la propriété claire

Les optimisations de performance doivent rester compréhensibles.
