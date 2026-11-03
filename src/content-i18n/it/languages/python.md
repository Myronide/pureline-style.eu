# Python Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Python is indentation-based, so the brace rules of the [JavaScript profile](javascript.md) do not apply. Pureline Python follows **PEP 8**, **PEP 484 type hints**, and the formatter the project uses ([ruff](https://docs.astral.sh/ruff/) or black). [Cohesion over Size](../core/structure.md) applies throughout.

## Python Profile

### PL-PY-001. Name idiomatico

- Modules, packages, functions, methods, and variables: `snake_case`.
- Classes and exceptions: `PascalCase`. Exceptions end in `Error`.
- Module constants: `UPPER_SNAKE_CASE`.
- No Java-style prefixes (`IStorage`) or Hungarian notation. Use `Storage` for a protocol and `FileStorage` for an implementation.

### PL-PY-002. Clausole di guardia e flusso lineare

Validate first, return or raise early, and keep the successful path at the base indentation.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

A one-line guard is allowed when the body is a single `return` or `raise`. Do not use one-line bodies for statements with side effects.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Type Hints at Boundaries

- Annotate public functions, methods, and class attributes.
- Annotate locals only when the type is not obvious from the right-hand side.
- Usa `X | None` invece di `Optional[X]` su Python 3.10 e più tardi.
- Eseguire un tipo di checker (mito o pyright) in modalità rigida per il nuovo codice..

### PL-PY-004. Eccezioni specifiche, mai Bare `except`

Catch the narrowest exception that the code can handle. Non scrivere mai `except:` o `except Exception: pass`.. Preservare la causa durante la conversione di un errore:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005. Risorse Usa i gestori di contesto

Open files, sockets, locks, and database sessions with `with`. Do not rely on `__del__` or on garbage collection for cleanup. Wrap a resource in a small context manager only when the same cleanup is needed in several places.

### PL-PY-006 — Comprehensions Only When They Read Clearly

A comprehension expresses one transformation with an optional filter. Use a loop when the body has side effects, branches, or more than one level of nesting.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Data Classes Over Ad-hoc Dictionaries

Data that crosses a function boundary has a named shape. Use `@dataclass(frozen=True, slots=True)` for internal data and a validated model (for example Pydantic) at external boundaries. Non passare `dict[str, Any]` tra i moduli..

### PL-PY-008. Nessun valore predefinito mutabile e nessun stato globale nascosto

Non usare mai un argomento mutable predefinito (`def f(items=[])`); usare `None` e creare il valore all'interno della funzione. Module-level state is limited to constants and configured singletons created at startup. Pass dependencies explicitly.

### PL-PY-009. Attività async hanno un proprietario

Usa `asyncio.TaskGroup` (o un campo di applicazione strutturato equivalente) in modo che ogni attività abbia un genitore che lo aspetta e propaga i suoi errori. Non creare attività di fuoco e dimentico con `asyncio.create_task` per il lavoro da cui il programma dipende.. Do not call blocking I/O inside a coroutine; move it to `asyncio.to_thread`.

### PL-PY-010 — Package and Module Density

A package holds at most **10 modules** by default, excluding tests and generated code. Split along responsibility. Keep `__init__.py` to re-exports and short package docstrings; put real logic in named modules.

### PL-PY-011. La formattazione è delegata al materiale

Follow `ruff format` or black for layout, quotes, and trailing commas. Pureline does not require manual formatting that the formatter would undo.

### PL-PY-012. Troppo,, p.., p...

- Run `ruff check` for lint and a type checker for types, in CI.
- Test normal, invalid, and failure paths. Utilizzare `pytest` e mantenere i dispositivi in `conftest.py` solo quando diversi moduli di prova li condividono.
- Evitare coperta `# noqa` e `# type: ignore` senza un codice di regola e un motivo sulla stessa linea...
