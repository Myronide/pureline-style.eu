# Python-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Python ist einrückungsbasiert, so dass die Klammerregeln des [JavaScript-Profils] (javascript.md) nicht gelten. Pureline Python folgt **PEP 8**, **PEP 484 Typ-Anweisungen** und die Formmater, die das Projekt verwendet ([ruff](https://docs.astral.sh/ruff/) oder schwarz). [Cohesion over Size](../core/structure.md) applies throughout.

## Pythonprofil

### PL-PY-001 — Idiomatische Bezeichnung

- Module, Pakete, Funktionen, Methoden und Variablen: `snake_case`.
- Klassen und Ausnahmen: `PascalCase`. Ausnahmen enden im `Error`.
- Modulkonstanten: `UPPER_SNAKE_CASE`.
- Keine Java-Style-Präfixe (`IStorage`) oder ungarische Notation. Verwenden Sie `Storage` für ein Protokoll und `FileStorage` für eine Implementierung.

### PL-PY-002 — Schutzklauseln und linearer Fluss

Erst bestätigen, früh zurückgeben oder erhöhen und den erfolgreichen Pfad bei der Basiseinrückung halten.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Ein Einlinienschutz ist zulässig, wenn der Körper ein einziges `return` oder `raise` ist. Verwenden Sie keine Einlinien-Körper für Aussagen mit Nebenwirkungen.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Typ Hints an den Boundarien

- Bemerken Sie öffentliche Funktionen, Methoden und Klassenattribute.
- Lokalen nur dann notieren, wenn der Typ nicht von der rechten Seite aus offensichtlich ist.
- Verwenden Sie `X | None` anstelle von `Optional[X]` auf Python 3.10 und später.
- Führen Sie einen Type Checker (Mypy oder Pyryright) im strengen Modus für neuen Code aus.

### PL-PY-004 — Spezifische Ausnahmen, niemals verbarren `except`

Fangen Sie die schmalste Ausnahme, die der Code verarbeiten kann.. Schreib niemals `except:` oder `except Exception: pass`. Preserve die Ursache bei der Konvertierung eines Fehlers:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Ressourcen Verwendung Kontextmanager

Öffnen Sie Dateien, Sockets, Sperren und Datenbanksitzungen mit `with`. Verlassen Sie sich nicht auf `__del__` oder auf Müllsammeln zur Aufräumarbeiten. Eine Ressource nur dann in einem kleinen Kontextmanager einpacken, wenn an mehreren Stellen dieselbe Reinigung erforderlich ist.

### PL-PY-006 — Einsichten nur, wenn sie deutlich lesen

Ein Verständnis drückt eine Transformation mit einem optionalen Filter aus. Verwenden Sie eine Schleife, wenn der Körper Nebenwirkungen, Äste oder mehr als eine Ebene der Nestung hat.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Datenklassen über Ad-hoc-Wörterbücher

Daten, die eine Funktionsgrenze überschreiten, haben eine benannte Form.. Verwenden Sie `@dataclass(frozen=True, slots=True)` für interne Daten und ein validiertes Modell (z.B. Pydantik) an externen Grenzen. `dict[str, Any]` zwischen den Modulen nicht übergeben.

### PL-PY-008 — Keine mutierbaren Voreinstellungen und kein versteckter globaler Staat

Verwenden Sie niemals ein mutierbares Standardargument (`def f(items=[])`); verwenden Sie `None` und erstellen Sie den Wert innerhalb der Funktion. Der Status auf Modulebene ist auf Konstanten und konfigurierte Singletons begrenzt, die beim Starten erstellt wurden. Abhängigkeiten explizit übergeben.

### PL-PY-009 — Async Aufgaben haben einen Eigentümer

Verwenden Sie `asyncio.TaskGroup` (oder einen gleichwertig strukturierten Bereich), damit jede Aufgabe ein Elternteil hat, das darauf wartet und seine Fehler verbreitet. Erstellen Sie keine Feuer-und-Vergessen Aufgaben mit `asyncio.create_task` für die Arbeit, die das Programm abhängig ist. Rufen Sie nicht Blockierung I/O innerhalb eines Koroutin; verschieben Sie es auf `asyncio.to_thread`.

### PL-PY-010 — Paket- und Moduldichte

Ein Paket enthält standardmäßig höchstens **10 Module**, ausgenommen Tests und generierten Code. Verteilt euch mit der Verantwortung. Halten Sie `__init__.py`, um wieder zu exportieren und kurze Paket-docstrings; setzen Sie echte Logik in benannten Modulen.

### PL-PY-011 — Formatierung wird dem Formatter übertragen

Folgen Sie `ruff format` oder Schwarz für Layout, Anführungszeichen und folgende Kommas. Pureline erfordert keine manuelle Formatierung, die das Formatieren rückgängig machen würde..

### PL-PY-012 — Werkzeugbau

- Führen Sie `ruff check` für Flint und einen Typprüfer für Typen in CI aus.
- Testen Sie normale, ungültige und Ausfallpfade. Verwenden Sie `pytest` und halten Sie die Befestigungen in `conftest.py` nur, wenn mehrere Testmodule sie teilen.
- Vermeiden Sie Decken `# noqa` und `# type: ignore` ohne Regelcode und einen Grund auf der gleichen Zeile.
