# Python Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Python is op inspringen gebaseerd, dus de regels van het [JavaScript profiel](javascript.md) zijn niet van toepassing. Pureline Python volgt **PEP 8**, **PEP 484 type hints**, en de formatter die het project gebruikt ([ruff](https://docs.astral.sh/ruff/) of zwart). [Cohesie over Size](../core/structure.md) geldt voor alle.

## Pythonprofiel profiel

### PL-PY-001. Idiomatische naamgeving

- Modules, pakketten, functies, methoden en variabelen: `snake_case`.
- Klassen en uitzonderingen: `PascalCase`. Uitzonderingen eindigen in `Error`.
- Moduleconstanten:e processoren `UPPER_SNAKE_CASE`.
- Geen Java-stijl voorvoegsels (`IStorage`) of Hongaarse notatie. Gebruik `Storage` voor een protocol en `FileStorage` voor een implementatie.

### PL-PY-002. Guard Clausles en Linear Flow

Valideer eerst, keer terug of verhoog vroeg, en houd het succesvolle pad bij de basis inspringing.

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

Een one-line bewaker is toegestaan als het lichaam een enkele `return` of `raise` is. Gebruik geen one-line lichamen voor verklaringen met bijwerkingen.

### PL-PY-003. Type hints op grenzen

- Annoteer publieke functies, methoden en klasse-attributen.
- Annoteer locals alleen als het type niet duidelijk is aan de rechterkant.
- Gebruik `X | None` in plaats van `Optional[X]` op Python 3,10 en later.
- Een typecontrole (mypy of pyright) in strikte modus uitvoeren voor nieuwe code.

### PL-PY-004. Specifieke uitzonderingen, nooit bar `except`

Vang de smalste uitzondering die de code aankan. Schrijf nooit `except:` of `except Exception: pass`. Bewaar de oorzaak bij het omzetten van een fout:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005. Hulpbronnen gebruiken Context Managers

Open bestanden, sockets, sloten en databasesessies met `with`. Vertrouw niet op `__del__` of op vuilnisopruiming. Een hulpbron in een kleine contextbeheerder inpakken is alleen mogelijk als dezelfde opruiming op verschillende plaatsen nodig is.

### PL-PY-006. Begrijpen alleen wanneer ze duidelijk lezen

Een begrip drukt één transformatie uit met een optioneel filter. Gebruik een lus als het lichaam bijwerkingen, takken of meer dan één niveau van nestelen heeft.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007. Gegevensklassen boven ad-hocwoordenboeken

Gegevens die een functiegrens overschrijden, hebben een naam. Gebruik `@dataclass(frozen=True, slots=True)` voor interne gegevens en een gevalideerd model (bijvoorbeeld Pydantic) aan externe grenzen. Passeer `dict[str, Any]` niet tussen de modules.

### PL-PY-008. Geen veranderbare standaardwaarden en geen Hidden-mondiale status

Gebruik nooit een veranderlijk standaard argument (`def f(items=[])`); gebruik `None` en creëer de waarde binnen de functie. Module-niveau staat is beperkt tot constanten en geconfigureerde singletons gemaakt bij het opstarten. Passeer afhankelijkheden expliciet.

### PL-PY-009. Async taken hebben een eigenaar

Gebruik `asyncio.TaskGroup` (of een equivalent gestructureerd bereik) zodat elke taak een ouder heeft die erop wacht en zijn fouten voortplant. Maak geen fire-and-forget taken met `asyncio.create_task` voor werk dat het programma afhankelijk is van. Bel niet naar blokkeer I/O in een coroutine; verplaats het naar `asyncio.to_thread`.

### PL-PY-010. Pakket en module Dinnen

Een pakket bevat hooguit **10 modules** standaard, exclusief tests en gegenereerde code. Verdeel je verantwoordelijkheid. Houd `__init__.py` om opnieuw te exporteren en korte pakket docstrings; zet echte logica in benoemde modules.

### PL-PY-011. Opmaak is gedelegeerd aan de Formatter

Volg `ruff format` of zwart voor lay-out, citaten en trailing komma's. Pureline vereist geen handmatige opmaak die de formatter ongedaan zou maken.

### PL-PY-012. Gereedschape

- Run `ruff check` voor de checker en een typecontrole voor de types, in CI.
- Test normaal, ongeldig en foutpaden. Gebruik `pytest` en houd de armaturen in `conftest.py` alleen wanneer meerdere testmodules deze delen.
- Vermijd deken `# noqa` en `# type: ignore` zonder een regelcode en een reden op dezelfde lijn.
