# Python Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Python ist einrückungsbasiert, daher gelten die Klammerregeln des [JavaScript-Profils](javascript.md) nicht. Pureline Python folgt **PEP 8**, den **Typannotationen nach PEP 484** und dem Formatter, den das Projekt verwendet ([ruff](https://docs.astral.sh/ruff/) oder black). [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Python-Profil {#python-profile}

### PL-PY-001 — Idiomatische Benennung {#pl-py-001--idiomatic-naming}

- Module, Pakete, Funktionen, Methoden und Variablen: `snake_case`.
- Klassen und Ausnahmen: `PascalCase`. Ausnahmen enden auf `Error`.
- Modulkonstanten: `UPPER_SNAKE_CASE`.
- Keine Präfixe im Java-Stil (`IStorage`) und keine ungarische Notation. Verwende `Storage` für ein Protocol und `FileStorage` für eine Implementierung.

### PL-PY-002 — Guard Clauses und linearer Fluss {#pl-py-002--guard-clauses-and-linear-flow}

Validiere zuerst, kehre früh zurück oder löse früh eine Ausnahme aus, und halte den erfolgreichen Pfad auf der Basis-Einrückung.

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

Ein einzeiliger Guard ist erlaubt, wenn der Rumpf ein einzelnes `return` oder `raise` ist. Verwende keine einzeiligen Rümpfe für Anweisungen mit Seiteneffekten.

### PL-PY-003 — Typannotationen an den Grenzen {#pl-py-003--type-hints-at-boundaries}

- Annotiere öffentliche Funktionen, Methoden und Klassenattribute.
- Annotiere lokale Variablen nur, wenn der Typ aus der rechten Seite nicht offensichtlich ist.
- Verwende ab Python 3.10 `X | None` statt `Optional[X]`.
- Führe für neuen Code einen Typchecker (mypy oder pyright) im Strict-Modus aus.

### PL-PY-004 — Spezifische Ausnahmen, niemals ein nacktes `except` {#pl-py-004--specific-exceptions-never-bare-except}

Fange die engste Ausnahme ab, die der Code behandeln kann. Schreibe niemals `except:` oder `except Exception: pass`. Bewahre die Ursache, wenn du einen Fehler umwandelst:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Ressourcen verwenden Context Manager {#pl-py-005--resources-use-context-managers}

Öffne Dateien, Sockets, Locks und Datenbanksitzungen mit `with`. Verlasse dich beim Aufräumen nicht auf `__del__` oder die Garbage Collection. Verpacke eine Ressource nur dann in einen kleinen Context Manager, wenn dasselbe Aufräumen an mehreren Stellen nötig ist.

### PL-PY-006 — Comprehensions nur, wenn sie klar lesbar sind {#pl-py-006--comprehensions-only-when-they-read-clearly}

Eine Comprehension drückt eine Transformation mit optionalem Filter aus. Verwende eine Schleife, wenn der Rumpf Seiteneffekte, Verzweigungen oder mehr als eine Verschachtelungsebene hat.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Dataclasses statt ad-hoc-Dictionaries {#pl-py-007--data-classes-over-ad-hoc-dictionaries}

Daten, die eine Funktionsgrenze überschreiten, haben eine benannte Form. Verwende `@dataclass(frozen=True, slots=True)` für interne Daten und ein validiertes Modell (zum Beispiel Pydantic) an externen Grenzen. Reiche kein `dict[str, Any]` zwischen Modulen weiter.

### PL-PY-008 — Keine veränderlichen Defaults und kein versteckter globaler Zustand {#pl-py-008--no-mutable-defaults-and-no-hidden-global-state}

Verwende niemals ein veränderliches Standardargument (`def f(items=[])`); nimm `None` und erzeuge den Wert innerhalb der Funktion. Zustand auf Modulebene beschränkt sich auf Konstanten und konfigurierte Singletons, die beim Start erzeugt werden. Reiche Abhängigkeiten explizit weiter.

### PL-PY-009 — Async-Tasks haben einen Eigentümer {#pl-py-009--async-tasks-have-an-owner}

Verwende `asyncio.TaskGroup` (oder einen gleichwertigen strukturierten Scope), damit jeder Task einen Parent hat, der auf ihn wartet und seine Fehler weiterreicht. Erzeuge mit `asyncio.create_task` keine Fire-and-forget-Tasks für Arbeit, von der das Programm abhängt. Rufe innerhalb einer Coroutine kein blockierendes I/O auf; verlagere es mit `asyncio.to_thread`.

### PL-PY-010 — Paket- und Modul-Dichte {#pl-py-010--package-and-module-density}

Ein Paket enthält standardmäßig höchstens **10 Module**, ohne Tests und generierten Code. Teile entlang der Verantwortung auf. Beschränke `__init__.py` auf Re-Exports und kurze Paket-Docstrings; echte Logik gehört in benannte Module.

### PL-PY-011 — Die Formatierung wird dem Formatter überlassen {#pl-py-011--formatting-is-delegated-to-the-formatter}

Folge `ruff format` oder black bei Layout, Anführungszeichen und Trailing Commas. Pureline verlangt keine manuelle Formatierung, die der Formatter wieder rückgängig machen würde.

### PL-PY-012 — Tooling {#pl-py-012--tooling}

- Führe in der CI `ruff check` für den Lint und einen Typchecker für die Typen aus.
- Teste normale, ungültige und fehlerhafte Pfade. Verwende `pytest` und lege Fixtures nur dann in `conftest.py` ab, wenn mehrere Testmodule sie gemeinsam nutzen.
- Vermeide pauschale `# noqa` und `# type: ignore` ohne Regelcode und Begründung in derselben Zeile.
