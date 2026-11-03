# Stile del codice Python

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Python si basa sull'indentazione, quindi le regole sulle parentesi graffe del [profilo JavaScript](javascript.md) non si applicano. Pureline Python segue **PEP 8**, i **type hint di PEP 484** e il formatter usato dal progetto ([ruff](https://docs.astral.sh/ruff/) o black). [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Python {#python-profile}

### PL-PY-001 — Nomi idiomatici {#pl-py-001--idiomatic-naming}

- Moduli, pacchetti, funzioni, metodi e variabili: `snake_case`.
- Classi ed eccezioni: `PascalCase`. Le eccezioni terminano con `Error`.
- Costanti di modulo: `UPPER_SNAKE_CASE`.
- Nessun prefisso alla Java (`IStorage`) né notazione ungherese. Usa `Storage` per un protocol e `FileStorage` per un'implementazione.

### PL-PY-002 — Guard clause e flusso lineare {#pl-py-002--guard-clauses-and-linear-flow}

Valida per prima cosa, ritorna o solleva un'eccezione subito, e mantieni il percorso di successo all'indentazione di base.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Una guardia su una riga è ammessa quando il corpo è un singolo `return` o `raise`. Non usare corpi su una riga per istruzioni con effetti collaterali.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Type hint ai confini {#pl-py-003--type-hints-at-boundaries}

- Annota le funzioni pubbliche, i metodi e gli attributi di classe.
- Annota le variabili locali solo quando il tipo non è ovvio dal lato destro.
- Usa `X | None` invece di `Optional[X]` da Python 3.10 in poi.
- Esegui un type checker (mypy o pyright) in modalità strict per il nuovo codice.

### PL-PY-004 — Eccezioni specifiche, mai `except` generico {#pl-py-004--specific-exceptions-never-bare-except}

Cattura l'eccezione più ristretta che il codice sa gestire. Non scrivere mai `except:` né `except Exception: pass`. Quando converti un errore, preserva la causa:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Le risorse usano i context manager {#pl-py-005--resources-use-context-managers}

Apri file, socket, lock e sessioni di database con `with`. Non fare affidamento su `__del__` né sul garbage collection per la pulizia. Avvolgi una risorsa in un piccolo context manager solo quando la stessa pulizia serve in più punti.

### PL-PY-006 — Le comprehension solo quando si leggono con chiarezza {#pl-py-006--comprehensions-only-when-they-read-clearly}

Una comprehension esprime una sola trasformazione con un filtro facoltativo. Usa un ciclo quando il corpo ha effetti collaterali, ramificazioni o più di un livello di annidamento.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Data class al posto di dizionari ad hoc {#pl-py-007--data-classes-over-ad-hoc-dictionaries}

I dati che attraversano il confine di una funzione hanno una forma con nome. Usa `@dataclass(frozen=True, slots=True)` per i dati interni e un modello validato (ad esempio Pydantic) ai confini esterni. Non passare `dict[str, Any]` tra i moduli.

### PL-PY-008 — Niente valori predefiniti mutabili né stato globale nascosto {#pl-py-008--no-mutable-defaults-and-no-hidden-global-state}

Non usare mai un argomento predefinito mutabile (`def f(items=[])`); usa `None` e crea il valore dentro la funzione. Lo stato a livello di modulo si limita a costanti e singleton configurati creati all'avvio. Passa le dipendenze in modo esplicito.

### PL-PY-009 — I task async hanno un proprietario {#pl-py-009--async-tasks-have-an-owner}

Usa `asyncio.TaskGroup` (o un ambito strutturato equivalente), così ogni task ha un genitore che lo attende e ne propaga gli errori. Non creare task fire-and-forget con `asyncio.create_task` per lavoro da cui il programma dipende. Non chiamare I/O bloccante dentro una coroutine; spostalo in `asyncio.to_thread`.

### PL-PY-010 — Densità di pacchetti e moduli {#pl-py-010--package-and-module-density}

Un pacchetto contiene al massimo **10 moduli** per impostazione predefinita, esclusi test e codice generato. Dividi in base alla responsabilità. Limita `__init__.py` ai re-export e a brevi docstring del pacchetto; metti la logica vera in moduli con nome.

### PL-PY-011 — La formattazione è delegata al formatter {#pl-py-011--formatting-is-delegated-to-the-formatter}

Segui `ruff format` o black per impaginazione, virgolette e virgole finali. Pureline non richiede una formattazione manuale che il formatter annullerebbe.

### PL-PY-012 — Strumenti {#pl-py-012--tooling}

- Esegui `ruff check` per il lint e un type checker per i tipi, nella CI.
- Testa i percorsi normali, non validi e di fallimento. Usa `pytest` e tieni le fixture in `conftest.py` solo quando più moduli di test le condividono.
- Evita `# noqa` e `# type: ignore` generalizzati senza un codice di regola e un motivo sulla stessa riga.
