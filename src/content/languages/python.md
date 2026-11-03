# Python Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Python is indentation-based, so the brace rules of the [JavaScript profile](javascript.md) do not apply. Pureline Python follows **PEP 8**, **PEP 484 type hints**, and the formatter the project uses ([ruff](https://docs.astral.sh/ruff/) or black). [Cohesion over Size](../core/structure.md) applies throughout.

## Python Profile

### PL-PY-001 — Idiomatic Naming

- Modules, packages, functions, methods, and variables: `snake_case`.
- Classes and exceptions: `PascalCase`. Exceptions end in `Error`.
- Module constants: `UPPER_SNAKE_CASE`.
- No Java-style prefixes (`IStorage`) or Hungarian notation. Use `Storage` for a protocol and `FileStorage` for an implementation.

### PL-PY-002 — Guard Clauses and Linear Flow

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
- Use `X | None` instead of `Optional[X]` on Python 3.10 and later.
- Run a type checker (mypy or pyright) in strict mode for new code.

### PL-PY-004 — Specific Exceptions, Never Bare `except`

Catch the narrowest exception that the code can handle. Never write `except:` or `except Exception: pass`. Preserve the cause when converting an error:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Resources Use Context Managers

Open files, sockets, locks, and database sessions with `with`. Do not rely on `__del__` or on garbage collection for cleanup. Wrap a resource in a small context manager only when the same cleanup is needed in several places.

### PL-PY-006 — Comprehensions Only When They Read Clearly

A comprehension expresses one transformation with an optional filter. Use a loop when the body has side effects, branches, or more than one level of nesting.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Data Classes Over Ad-hoc Dictionaries

Data that crosses a function boundary has a named shape. Use `@dataclass(frozen=True, slots=True)` for internal data and a validated model (for example Pydantic) at external boundaries. Do not pass `dict[str, Any]` between modules.

### PL-PY-008 — No Mutable Defaults and No Hidden Global State

Never use a mutable default argument (`def f(items=[])`); use `None` and create the value inside the function. Module-level state is limited to constants and configured singletons created at startup. Pass dependencies explicitly.

### PL-PY-009 — Async Tasks Have an Owner

Use `asyncio.TaskGroup` (or an equivalent structured scope) so that every task has a parent that waits for it and propagates its errors. Do not create fire-and-forget tasks with `asyncio.create_task` for work the program depends on. Do not call blocking I/O inside a coroutine; move it to `asyncio.to_thread`.

### PL-PY-010 — Package and Module Density

A package holds at most **10 modules** by default, excluding tests and generated code. Split along responsibility. Keep `__init__.py` to re-exports and short package docstrings; put real logic in named modules.

### PL-PY-011 — Formatting Is Delegated to the Formatter

Follow `ruff format` or black for layout, quotes, and trailing commas. Pureline does not require manual formatting that the formatter would undo.

### PL-PY-012 — Tooling

- Run `ruff check` for lint and a type checker for types, in CI.
- Test normal, invalid, and failure paths. Use `pytest` and keep fixtures in `conftest.py` only when several test modules share them.
- Avoid blanket `# noqa` and `# type: ignore` without a rule code and a reason on the same line.
