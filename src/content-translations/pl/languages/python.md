# Python Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Python opiera się na wcięciach, więc reguły dotyczące nawiasów klamrowych z [profilu JavaScript](javascript.md) nie mają zastosowania. Pureline Python stosuje **PEP 8**, **podpowiedzi typów z PEP 484** oraz formatter używany w projekcie ([ruff](https://docs.astral.sh/ruff/) lub black). [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil Python {#python-profile}

### PL-PY-001 — Idiomatyczne nazewnictwo {#pl-py-001--idiomatic-naming}

- Moduły, pakiety, funkcje, metody i zmienne: `snake_case`.
- Klasy i wyjątki: `PascalCase`. Wyjątki kończą się na `Error`.
- Stałe modułu: `UPPER_SNAKE_CASE`.
- Bez prefiksów w stylu Javy (`IStorage`) ani notacji węgierskiej. Dla protokołu używaj `Storage`, a dla implementacji `FileStorage`.

### PL-PY-002 — Guard clauses i liniowy przepływ {#pl-py-002--guard-clauses-and-linear-flow}

Waliduj najpierw, wracaj lub zgłaszaj wyjątek wcześnie i trzymaj główną ścieżkę na bazowym poziomie wcięcia.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Jednoliniowy guard jest dozwolony, gdy ciało to pojedynczy `return` lub `raise`. Nie używaj ciał jednoliniowych dla instrukcji z efektami ubocznymi.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Podpowiedzi typów na granicach {#pl-py-003--type-hints-at-boundaries}

- Adnotuj publiczne funkcje, metody i atrybuty klas.
- Zmienne lokalne adnotuj tylko wtedy, gdy typ nie jest oczywisty z prawej strony przypisania.
- W Pythonie 3.10 i nowszych używaj `X | None` zamiast `Optional[X]`.
- Dla nowego kodu uruchamiaj kontroler typów (mypy lub pyright) w trybie strict.

### PL-PY-004 — Konkretne wyjątki, nigdy gołe `except` {#pl-py-004--specific-exceptions-never-bare-except}

Łap najwęższy wyjątek, jaki kod potrafi obsłużyć. Nigdy nie pisz `except:` ani `except Exception: pass`. Przy konwersji błędu zachowaj jego przyczynę:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Zasoby używają menedżerów kontekstu {#pl-py-005--resources-use-context-managers}

Pliki, gniazda, blokady i sesje bazy danych otwieraj za pomocą `with`. Nie polegaj na `__del__` ani na garbage collection przy sprzątaniu. Zasób opakowuj w mały menedżer kontekstu tylko wtedy, gdy to samo sprzątanie jest potrzebne w kilku miejscach.

### PL-PY-006 — Comprehensions tylko wtedy, gdy czyta się je jasno {#pl-py-006--comprehensions-only-when-they-read-clearly}

Comprehension wyraża jedną transformację z opcjonalnym filtrem. Użyj pętli, gdy ciało ma efekty uboczne, rozgałęzienia lub więcej niż jeden poziom zagnieżdżenia.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Klasy danych zamiast doraźnych słowników {#pl-py-007--data-classes-over-ad-hoc-dictionaries}

Dane przekraczające granicę funkcji mają nazwany kształt. Dla danych wewnętrznych używaj `@dataclass(frozen=True, slots=True)`, a na granicach zewnętrznych walidowanego modelu (na przykład Pydantic). Nie przekazuj `dict[str, Any]` między modułami.

### PL-PY-008 — Bez modyfikowalnych wartości domyślnych i ukrytego stanu globalnego {#pl-py-008--no-mutable-defaults-and-no-hidden-global-state}

Nigdy nie używaj modyfikowalnego argumentu domyślnego (`def f(items=[])`); użyj `None` i utwórz wartość wewnątrz funkcji. Stan na poziomie modułu ogranicz do stałych i skonfigurowanych singletonów tworzonych przy starcie. Zależności przekazuj jawnie.

### PL-PY-009 — Zadania async mają właściciela {#pl-py-009--async-tasks-have-an-owner}

Używaj `asyncio.TaskGroup` (lub równoważnego zakresu ustrukturyzowanego), aby każde zadanie miało rodzica, który na nie czeka i propaguje jego błędy. Nie twórz zadań typu fire-and-forget za pomocą `asyncio.create_task` dla pracy, od której zależy program. Nie wywołuj blokującego I/O wewnątrz korutyny; przenieś je do `asyncio.to_thread`.

### PL-PY-010 — Gęstość pakietów i modułów {#pl-py-010--package-and-module-density}

Pakiet domyślnie zawiera co najwyżej **10 modułów**, nie licząc testów i kodu generowanego. Dziel według odpowiedzialności. W `__init__.py` trzymaj tylko reeksporty i krótkie docstringi pakietu; prawdziwą logikę umieszczaj w nazwanych modułach.

### PL-PY-011 — Formatowanie jest delegowane do formattera {#pl-py-011--formatting-is-delegated-to-the-formatter}

Układ, cudzysłowy i końcowe przecinki zostaw `ruff format` lub black. Pureline nie wymaga ręcznego formatowania, które formatter i tak cofnie.

### PL-PY-012 — Narzędzia {#pl-py-012--tooling}

- W CI uruchamiaj `ruff check` dla lintowania i kontroler typów dla typów.
- Testuj ścieżki normalne, niepoprawne i awaryjne. Używaj `pytest` i fixtury trzymaj w `conftest.py` tylko wtedy, gdy współdzieli je kilka modułów testowych.
- Unikaj zbiorczych `# noqa` i `# type: ignore` bez kodu reguły i uzasadnienia w tej samej linii.
