# Estilo de código Python

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Python se basa en la sangría, por lo que las reglas de llaves del [perfil de JavaScript](javascript.md) no se aplican. Pureline Python sigue **PEP 8**, los **type hints de PEP 484** y el formateador que use el proyecto ([ruff](https://docs.astral.sh/ruff/) o black). La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Python {#python-profile}

### PL-PY-001 — Nombres idiomáticos {#pl-py-001--idiomatic-naming}

- Módulos, paquetes, funciones, métodos y variables: `snake_case`.
- Clases y excepciones: `PascalCase`. Las excepciones terminan en `Error`.
- Constantes de módulo: `UPPER_SNAKE_CASE`.
- Sin prefijos al estilo de Java (`IStorage`) ni notación húngara. Usa `Storage` para un protocolo y `FileStorage` para una implementación.

### PL-PY-002 — Guard clauses y flujo lineal {#pl-py-002--guard-clauses-and-linear-flow}

Valida primero, retorna o lanza una excepción pronto, y mantén el camino correcto en la sangría base.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Se permite una guarda en una línea cuando el cuerpo es un único `return` o `raise`. No uses cuerpos de una línea para sentencias con efectos secundarios.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Type hints en los límites {#pl-py-003--type-hints-at-boundaries}

- Anota las funciones, los métodos y los atributos de clase públicos.
- Anota las variables locales solo cuando el tipo no sea evidente por el lado derecho.
- Usa `X | None` en lugar de `Optional[X]` en Python 3.10 y posteriores.
- Ejecuta un verificador de tipos (mypy o pyright) en modo estricto para el código nuevo.

### PL-PY-004 — Excepciones específicas, nunca `except` sin tipo {#pl-py-004--specific-exceptions-never-bare-except}

Captura la excepción más estrecha que el código pueda tratar. No escribas nunca `except:` ni `except Exception: pass`. Conserva la causa al convertir un error:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Los recursos usan gestores de contexto {#pl-py-005--resources-use-context-managers}

Abre archivos, sockets, locks y sesiones de base de datos con `with`. No dependas de `__del__` ni del recolector de basura para la limpieza. Envuelve un recurso en un pequeño gestor de contexto solo cuando la misma limpieza se necesite en varios lugares.

### PL-PY-006 — Comprensiones solo cuando se leen con claridad {#pl-py-006--comprehensions-only-when-they-read-clearly}

Una comprensión expresa una transformación con un filtro opcional. Usa un bucle cuando el cuerpo tenga efectos secundarios, ramificaciones o más de un nivel de anidamiento.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Data classes en lugar de diccionarios improvisados {#pl-py-007--data-classes-over-ad-hoc-dictionaries}

Los datos que cruzan el límite de una función tienen una forma con nombre. Usa `@dataclass(frozen=True, slots=True)` para los datos internos y un modelo validado (por ejemplo, Pydantic) en los límites externos. No pases `dict[str, Any]` entre módulos.

### PL-PY-008 — Sin valores por defecto mutables ni estado global oculto {#pl-py-008--no-mutable-defaults-and-no-hidden-global-state}

No uses nunca un argumento por defecto mutable (`def f(items=[])`); usa `None` y crea el valor dentro de la función. El estado a nivel de módulo se limita a constantes y a singletons configurados que se crean al arrancar. Pasa las dependencias de forma explícita.

### PL-PY-009 — Las tareas asíncronas tienen un dueño {#pl-py-009--async-tasks-have-an-owner}

Usa `asyncio.TaskGroup` (o un ámbito estructurado equivalente) para que cada tarea tenga un padre que la espere y propague sus errores. No crees tareas de «lanzar y olvidar» con `asyncio.create_task` para trabajo del que dependa el programa. No llames a E/S bloqueante dentro de una corrutina; muévela a `asyncio.to_thread`.

### PL-PY-010 — Densidad de paquetes y módulos {#pl-py-010--package-and-module-density}

Un paquete contiene como máximo **10 módulos** por defecto, sin contar los tests ni el código generado. Divide según la responsabilidad. Limita `__init__.py` a las reexportaciones y a docstrings breves del paquete; pon la lógica real en módulos con nombre.

### PL-PY-011 — El formato se delega en el formateador {#pl-py-011--formatting-is-delegated-to-the-formatter}

Sigue `ruff format` o black para la disposición, las comillas y las comas finales. Pureline no exige un formato manual que el formateador deshará.

### PL-PY-012 — Herramientas {#pl-py-012--tooling}

- Ejecuta `ruff check` para el lint y un verificador de tipos para los tipos, en la CI.
- Prueba las rutas normales, las inválidas y las de fallo. Usa `pytest` y deja los fixtures en `conftest.py` solo cuando varios módulos de test los compartan.
- Evita los `# noqa` y `# type: ignore` generalizados que no lleven un código de regla y un motivo en la misma línea.
