# Style de code Python

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Python est fondé sur l'indentation ; les règles d'accolades du [profil JavaScript](javascript.md) ne s'appliquent donc pas. Pureline Python suit **PEP 8**, les **annotations de types PEP 484** et le formateur utilisé par le projet ([ruff](https://docs.astral.sh/ruff/) ou black). [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Python {#python-profile}

### PL-PY-001 — Nommage idiomatique {#pl-py-001--idiomatic-naming}

- Modules, packages, fonctions, méthodes et variables : `snake_case`.
- Classes et exceptions : `PascalCase`. Les exceptions se terminent par `Error`.
- Constantes de module : `UPPER_SNAKE_CASE`.
- Pas de préfixes à la Java (`IStorage`) ni de notation hongroise. Utilisez `Storage` pour un protocole et `FileStorage` pour une implémentation.

### PL-PY-002 — Guard clauses et flux linéaire {#pl-py-002--guard-clauses-and-linear-flow}

Validez d'abord, retournez ou levez une exception tôt, et gardez le chemin nominal à l'indentation de base.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Un guard sur une ligne est permis lorsque le corps est un simple `return` ou `raise`. N'utilisez pas de corps sur une ligne pour des instructions ayant des effets de bord.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Annotations de types aux frontières {#pl-py-003--type-hints-at-boundaries}

- Annotez les fonctions, méthodes et attributs de classe publics.
- N'annotez les variables locales que lorsque le type n'est pas évident d'après le membre de droite.
- Utilisez `X | None` plutôt que `Optional[X]` à partir de Python 3.10.
- Exécutez un vérificateur de types (mypy ou pyright) en mode strict pour le nouveau code.

### PL-PY-004 — Exceptions précises, jamais de `except` nu {#pl-py-004--specific-exceptions-never-bare-except}

Attrapez l'exception la plus étroite que le code sait traiter. N'écrivez jamais `except:` ni `except Exception: pass`. Préservez la cause lors de la conversion d'une erreur :

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Les ressources utilisent des gestionnaires de contexte {#pl-py-005--resources-use-context-managers}

Ouvrez les fichiers, sockets, verrous et sessions de base de données avec `with`. Ne comptez pas sur `__del__` ni sur le ramasse-miettes pour le nettoyage. N'enveloppez une ressource dans un petit gestionnaire de contexte que lorsque le même nettoyage est nécessaire à plusieurs endroits.

### PL-PY-006 — Les compréhensions seulement quand elles se lisent clairement {#pl-py-006--comprehensions-only-when-they-read-clearly}

Une compréhension exprime une transformation avec un filtre facultatif. Utilisez une boucle lorsque le corps a des effets de bord, des branches ou plus d'un niveau d'imbrication.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Des dataclasses plutôt que des dictionnaires ad hoc {#pl-py-007--data-classes-over-ad-hoc-dictionaries}

Les données qui franchissent une frontière de fonction ont une forme nommée. Utilisez `@dataclass(frozen=True, slots=True)` pour les données internes et un modèle validé (par exemple Pydantic) aux frontières externes. Ne passez pas de `dict[str, Any]` entre les modules.

### PL-PY-008 — Pas de valeurs par défaut mutables ni d'état global caché {#pl-py-008--no-mutable-defaults-and-no-hidden-global-state}

N'utilisez jamais d'argument par défaut mutable (`def f(items=[])`) ; utilisez `None` et créez la valeur à l'intérieur de la fonction. L'état au niveau du module se limite aux constantes et aux singletons configurés créés au démarrage. Passez les dépendances explicitement.

### PL-PY-009 — Les tâches async ont un propriétaire {#pl-py-009--async-tasks-have-an-owner}

Utilisez `asyncio.TaskGroup` (ou une portée structurée équivalente) afin que chaque tâche ait un parent qui l'attend et propage ses erreurs. Ne créez pas de tâches lancées sans suivi (fire-and-forget) avec `asyncio.create_task` pour un travail dont le programme dépend. N'appelez pas d'E/S bloquantes dans une coroutine ; déplacez-les vers `asyncio.to_thread`.

### PL-PY-010 — Densité des packages et des modules {#pl-py-010--package-and-module-density}

Un package contient au maximum **10 modules** par défaut, hors tests et code généré. Découpez selon la responsabilité. Limitez `__init__.py` aux réexportations et aux courtes docstrings de package ; placez la vraie logique dans des modules nommés.

### PL-PY-011 — La mise en forme est déléguée au formateur {#pl-py-011--formatting-is-delegated-to-the-formatter}

Suivez `ruff format` ou black pour la mise en page, les guillemets et les virgules finales. Pureline n'exige pas de mise en forme manuelle que le formateur défera.

### PL-PY-012 — Outillage {#pl-py-012--tooling}

- Exécutez `ruff check` pour le lint et un vérificateur de types pour les types, en CI.
- Testez les chemins normaux, invalides et d'échec. Utilisez `pytest` et ne gardez des fixtures dans `conftest.py` que lorsque plusieurs modules de test les partagent.
- Évitez les `# noqa` et `# type: ignore` généralisés, sans code de règle ni raison sur la même ligne.
