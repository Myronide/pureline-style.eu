# Style de code Python

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Python est basé sur l'indentation, de sorte que les règles de l'accoudoir du [JavaScript profile](javascript.md) ne s'appliquent pas. Pureline Python suit **PEP 8**, **PEP 484 types de conseils**, et la matière utilisée par le projet ([ruff](https://docs.astral.sh/ruff/) ou noir). [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil Python

### PL-PY-001 — Désignation idiomatique

- Modules, paquets, fonctions, méthodes et variables : `snake_case`.
- Catégories et exceptions: `PascalCase`. Les exceptions se terminent par `Error`.
- Module constants: `UPPER_SNAKE_CASE`.
- Pas de préfixes de style Java (`IStorage`) ou hongrois. Utilisez `Storage` pour un protocole et `FileStorage` pour une implémentation.

### PL-PY-002 — Clauses de garde et débit linéaire

Valider d'abord, revenir ou lever tôt, et garder le chemin réussi à l'indentation de base.

```text
− Noisy                                      │ ✓ Pureline
                                             │
def display_name(user: User | None) -> str:   │ def display_name(user: User | None) -> str:
    if user is not None:                     │     if user is None or not user.active:
        if user.active:                      │         return "Gast"
            return user.name                 │
                                             │     return user.name
    return "Gast"                            │
```

Un garde à une ligne est autorisé lorsque le corps est un seul `return` ou `raise`. Ne pas utiliser de corps unilignes pour des déclarations avec des effets secondaires.

### PL-PY-003 — Décollage de type aux limites

- Annoter les fonctions, les méthodes et les attributs de classe publics.
- Annoter les locaux seulement lorsque le type n'est pas évident du côté droit.
- Utilisez `X | None` au lieu de `Optional[X]` sur Python 3.10 et plus tard.
- Lancer un contrôle de type (mypy ou pyright) en mode strict pour un nouveau code.

### PL-PY-004 — Exceptions spécifiques, jamais baré `except`

Cochez l'exception la plus étroite que le code puisse gérer. N'écrivez jamais `except:` ou `except Exception: pass`. Préserver la cause lors de la conversion d'une erreur :

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Gestionnaires de contexte d'utilisation des ressources

Ouvrez les fichiers, les sockets, les verrous et les sessions de base de données avec `with`. Ne pas compter sur `__del__` ou sur la collecte des ordures pour le nettoyage. Enveloppez une ressource dans un petit gestionnaire de contexte seulement lorsque le même nettoyage est nécessaire à plusieurs endroits.

### PL-PY-006 — Compréhension seulement quand ils lisent clairement

Une compréhension exprime une transformation avec un filtre optionnel. Utilisez une boucle lorsque le corps a des effets secondaires, des branches ou plus d'un niveau de nidification.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Classes de données sur les dictionnaires ad hoc

Les données qui traversent une limite de fonction ont une forme nommée. Utilisez `@dataclass(frozen=True, slots=True)` pour les données internes et un modèle validé (par exemple Pydantic) aux frontières extérieures. Ne pas appliquer `dict[str, Any]` entre les modules.

### PL-PY-008 — Pas de défaut mutable et pas d'État global caché

N'utilisez jamais un paramètre mutable par défaut (`def f(items=[])`); utilisez `None` et créez la valeur dans la fonction. L'état de niveau module est limité à l'année et configuré au démarrage. Passer les dépendances explicitement.

### PL-PY-009 — Tâches Async Avoir un propriétaire

Utilisez `asyncio.TaskGroup` (ou une portée structurée équivalente) afin que chaque tâche ait un parent qui l'attend et propage ses erreurs. Ne créez pas de tâches de feu et d'oubli avec `asyncio.create_task` pour le travail dont dépend le programme. Ne pas appeler bloquer les E/S dans une coroutine; déplacer vers `asyncio.to_thread`.

### PL-PY-010 — Densité du paquet et du module

Un paquet contient au plus les modules **10** par défaut, à l'exclusion des tests et du code généré. Divisez la responsabilité. Gardez `__init__.py` pour réexporter et des docstrings de paquets courts; mettez la logique réelle dans les modules nommés.

### PL-PY-011 — Le formatage est délégué à la matière

Suivez `ruff format` ou noir pour la disposition, l'assaisonnement et les virgules de suivi. Pureline n'exige pas de formatage manuel que la matière s'annulerait.

### PL-PY-012 — Outillage

- Exécutez `ruff check` pour lint et un contrôle de type pour les types, en CI.
- Testez les chemins normaux, invalides et de défaillance. Utilisez `pytest` et gardez les appareils dans `conftest.py` seulement lorsque plusieurs modules de test les partagent.
- Évitez la couverture `# noqa` et `# type: ignore` sans code de règle et une raison sur la même ligne.
