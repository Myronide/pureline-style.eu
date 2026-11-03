# Estilo de código de Python

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Python está basado en la indentación, por lo que las reglas de ortodoncia del [perfil de JavaScript](javascript.md) no se aplican. Pureline Python sigue **PEP 8**, **PEP 484 tipo hints**, y la formatter que el proyecto utiliza ([ruff](https://docs.astral.sh/ruff/) o negro). [Cohesión sobre el tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de Python

### PL-PY-001 — Denominación popular

- Módulos, paquetes, funciones, métodos y variables: `snake_case`.
- Clases y excepciones: `PascalCase`. Las excepciones terminan en `Error`.
- Constantes del módulo: `UPPER_SNAKE_CASE`.
- No hay prefijos de estilo Java (`IStorage`) ni notación húngara. Utilice `Storage` para un protocolo y `FileStorage` para una implementación.

### PL-PY-002 — Cláusulas de protección y flujo lineal

Validar primero, volver o elevar temprano, y mantener el camino acertado en la sangría de la base.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

Se permite un protector de una línea cuando el cuerpo es un solo `return` o `raise`. No utilice cuerpos de una línea para declaraciones con efectos secundarios.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

### PL-PY-003 — Tipo de colchas en límites

- Annotate funciones públicas, métodos y atributos de clase.
- Annotate locales sólo cuando el tipo no es obvio por el lado derecho.
- Use `X | None` en lugar de `Optional[X]` en Python 3.10 y posteriores.
- Ejecute un corrector de tipo (mipy o pyright) en modo estricto para el nuevo código.

### PL-PY-004 — Excepciones específicas, nunca desnudas `except`

Atrapa la excepción más estrecha que el código puede manejar. Nunca escribas `except:` o `except Exception: pass`. Preservar la causa al convertir un error:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

### PL-PY-005 — Administradores de contexto de uso de recursos

Abra archivos, sockets, bloqueos y sesiones de base de datos con `with`. No confíe en `__del__` ni en la recogida de basura para su limpieza. Envuelve un recurso en un pequeño gestor de contextos sólo cuando se necesite la misma limpieza en varios lugares.

### PL-PY-006: Comprensiones sólo cuando se leen con claridad

Una comprensión expresa una transformación con un filtro opcional. Use un bucle cuando el cuerpo tenga efectos secundarios, ramas o más de un nivel de anidación.

```python
active_names = [user.name for user in users if user.active]
```

### PL-PY-007 — Clases de datos sobre diccionarios ad hoc

Los datos que cruzan un límite de función tienen una forma llamada. Utilice `@dataclass(frozen=True, slots=True)` para datos internos y un modelo validado (por ejemplo Pydantic) en los límites externos. No pase `dict[str, Any]` entre módulos.

### PL-PY-008 — No hay por defectos mutables y no hay estado global oculto

Nunca utilice un argumento predeterminado mutable (`def f(items=[])`); use `None` y cree el valor dentro de la función. El estado a nivel de módulo se limita a las constantes y los singletons configurados creados al inicio. Pasen las concesiones explícitamente.

### PL-PY-009 — Las tareas de Async tienen un propietario

Utilice `asyncio.TaskGroup` (o un alcance estructurado equivalente) para que cada tarea tenga un padre que lo espera y propague sus errores. No cree tareas de fuego y olvido con `asyncio.create_task` para el trabajo del que depende el programa. No llame a bloquear E/S dentro de una coroutina; muévalo a `asyncio.to_thread`.

### PL-PY-010 — Densidad de paquetes y módulos

Un paquete contiene como máximo los módulos **10** por defecto, excluyendo las pruebas y el código generado. Dividir la responsabilidad. Mantenga `__init__.py` para reexportar y paquetes cortos docstrings; ponga la lógica real en los módulos nombrados.

### PL-PY-011 — El formato está Delegado al Formate

Siga `ruff format` o negro para la presentación, comillas y comas posteriores. Pureline no requiere formateo manual que la formateria se desharía.

### PL-PY-012 — Herramientas

- Ejecute `ruff check` para pelusa y un tipo de comprobador para tipos, en CI.
- Prueba las rutas normales, inválidas y de fallas. Utilice `pytest` y mantenga los accesorios en `conftest.py` sólo cuando varios módulos de prueba los compartan.
- Evite la manta `# noqa` y `# type: ignore` sin un código de regla y una razón en la misma línea.
