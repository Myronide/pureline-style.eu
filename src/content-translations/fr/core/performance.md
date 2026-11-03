# Performance

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Performance {#performance}

Pureline privilégie par défaut la lisibilité, mais les chemins sensibles à la performance doivent être écrits de façon délibérée.

Dans les chemins critiques :

- évitez les allocations inutiles
- évitez la réflexion répétée
- mettez en cache les résolutions coûteuses
- utilisez les collections adaptées
- évitez les blocages cachés
- réduisez les copies inutiles
- gardez la propriété (ownership) claire

Les optimisations de performance doivent rester compréhensibles.
