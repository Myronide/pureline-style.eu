# Principes fondamentaux

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Le noyau de Pureline {#pureline-core}

Ces règles s'appliquent à tous les langages pris en charge, dans la mesure où le langage les permet naturellement.

| ID | Règle |
|---|---|
| PL-CORE-001 | Le flux de contrôle doit être aussi linéaire que possible |
| PL-CORE-002 | Éviter `else` |
| PL-CORE-003 | Préférer les guard clauses |
| PL-CORE-004 | Utiliser la forme de flux de contrôle la plus claire pour le langage ; les langages à accolades utilisent des blocs explicites |
| PL-CORE-005 | Les raccourcis idiomatiques natifs du langage sont permis tant qu'ils restent immédiatement lisibles |
| PL-CORE-006 | Les fonctions doivent être petites et ciblées |
| PL-CORE-007 | Les noms doivent porter du sens |
| PL-CORE-008 | Éviter les abstractions inutiles |
| PL-CORE-009 | Éviter les God Classes et les God Modules |
| PL-CORE-010 | Préférer l'état immuable |
| PL-CORE-011 | Préférer les fonctionnalités modernes du langage lorsqu'elles améliorent la clarté |
| PL-CORE-012 | Éviter la mise en forme verticale inutile |
| PL-CORE-013 | Les commentaires ne doivent pas compenser un code peu clair |
| PL-CORE-014 | Traiter tôt les états invalides et les erreurs |
| PL-CORE-015 | Garder visibles les effets de bord importants |
| PL-CORE-016 | Les ressources doivent avoir un cycle de vie clair |
| PL-CORE-017 | Préférer les API natives du framework |
| PL-CORE-018 | Éviter les valeurs magiques |
| PL-CORE-019 | Rendre les dépendances explicites |
| PL-CORE-020 | Optimiser les chemins critiques de façon délibérée, pas par accident |
| PL-CORE-021 | Garder les packages et les dossiers sources assez petits pour être parcourus d'un coup d'œil |
| PL-CORE-022 | Cohésion avant la taille : préférer une responsabilité cohérente à des limites de lignes arbitraires par classe |
