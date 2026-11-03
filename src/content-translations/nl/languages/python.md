# Python-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Python is gebaseerd op inspringing, dus de accoladeregels van het [JavaScript-profiel](javascript.md) gelden niet. Pureline Python volgt **PEP 8**, **PEP 484-typehints** en de formatter die het project gebruikt ([ruff](https://docs.astral.sh/ruff/) of black). [Samenhang boven omvang](../core/structure.md) geldt overal.

## Python-profiel {#python-profile}

### PL-PY-001 — Idiomatische naamgeving {#pl-py-001--idiomatic-naming}

- Modules, packages, functies, methoden en variabelen: `snake_case`.
- Klassen en uitzonderingen: `PascalCase`. Uitzonderingen eindigen op `Error`.
- Moduleconstanten: `UPPER_SNAKE_CASE`.
- Geen voorvoegsels in Java-stijl (`IStorage`) en geen Hongaarse notatie. Gebruik `Storage` voor een protocol en `FileStorage` voor een implementatie.

### PL-PY-002 — Guard clauses en lineaire stroom {#pl-py-002--guard-clauses-and-linear-flow}

Valideer eerst, keer vroeg terug of gooi vroeg een uitzondering en houd het succespad op het basisinspringniveau.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Een guard van één regel is toegestaan wanneer de body één enkele `return` of `raise` is. Gebruik geen bodies van één regel voor statements met neveneffecten.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Typehints aan de grenzen {#pl-py-003--type-hints-at-boundaries}

- Annoteer publieke functies, methoden en klasseattributen.
- Annoteer lokale variabelen alleen wanneer het type niet duidelijk is uit de rechterkant.
- Gebruik vanaf Python 3.10 `X | None` in plaats van `Optional[X]`.
- Voer voor nieuwe code een typechecker (mypy of pyright) uit in strikte modus.

### PL-PY-004 — Specifieke uitzonderingen, nooit een kale `except` {#pl-py-004--specific-exceptions-never-bare-except}

Vang de smalste uitzondering af die de code kan afhandelen. Schrijf nooit `except:` of `except Exception: pass`. Behoud de oorzaak bij het omzetten van een fout:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Resources gebruiken contextmanagers {#pl-py-005--resources-use-context-managers}

Open bestanden, sockets, locks en databasesessies met `with`. Vertrouw voor opruiming niet op `__del__` of op garbage collection. Verpak een resource alleen in een kleine contextmanager wanneer dezelfde opruiming op meerdere plekken nodig is.

### PL-PY-006 — Comprehensions alleen wanneer ze duidelijk lezen {#pl-py-006--comprehensions-only-when-they-read-clearly}

Een comprehension drukt één transformatie uit met een optioneel filter. Gebruik een lus wanneer de body neveneffecten, vertakkingen of meer dan één niveau nesting heeft.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Dataklassen boven ad-hocdictionaries {#pl-py-007--data-classes-over-ad-hoc-dictionaries}

Data die een functiegrens oversteekt, heeft een benoemde vorm. Gebruik `@dataclass(frozen=True, slots=True)` voor interne data en een gevalideerd model (bijvoorbeeld Pydantic) aan externe grenzen. Geef geen `dict[str, Any]` door tussen modules.

### PL-PY-008 — Geen veranderlijke standaardwaarden en geen verborgen globale toestand {#pl-py-008--no-mutable-defaults-and-no-hidden-global-state}

Gebruik nooit een veranderlijk standaardargument (`def f(items=[])`); gebruik `None` en maak de waarde binnen de functie aan. Toestand op moduleniveau blijft beperkt tot constanten en geconfigureerde singletons die bij het opstarten worden aangemaakt. Geef afhankelijkheden expliciet door.

### PL-PY-009 — Async-taken hebben een eigenaar {#pl-py-009--async-tasks-have-an-owner}

Gebruik `asyncio.TaskGroup` (of een gelijkwaardige gestructureerde scope), zodat elke taak een parent heeft die erop wacht en de fouten ervan doorgeeft. Maak geen fire-and-forget-taken met `asyncio.create_task` voor werk waar het programma van afhangt. Roep geen blokkerende I/O aan binnen een coroutine; verplaats die naar `asyncio.to_thread`.

### PL-PY-010 — Package- en moduledichtheid {#pl-py-010--package-and-module-density}

Een package bevat standaard maximaal **10 modules**, exclusief tests en gegenereerde code. Splits op verantwoordelijkheid. Beperk `__init__.py` tot re-exports en korte package-docstrings; zet echte logica in benoemde modules.

### PL-PY-011 — Opmaak wordt aan de formatter overgelaten {#pl-py-011--formatting-is-delegated-to-the-formatter}

Volg `ruff format` of black voor layout, aanhalingstekens en afsluitende komma's. Pureline vereist geen handmatige opmaak die de formatter ongedaan zou maken.

### PL-PY-012 — Tooling {#pl-py-012--tooling}

- Voer in CI `ruff check` uit voor linting en een typechecker voor typen.
- Test normale paden, ongeldige paden en foutpaden. Gebruik `pytest` en zet fixtures alleen in `conftest.py` wanneer meerdere testmodules ze delen.
- Vermijd algemene `# noqa` en `# type: ignore` zonder regelcode en een reden op dezelfde regel.
