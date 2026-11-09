# Estilo de código Lua

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [compartidas](../README.md#shared-rules) con este perfil. Lua es pequeña y céntrica en la mesa: un archivo es un trozo que construye una tabla de módulo, y la estructura proviene de tablas y funciones simples. Pureline Lua tiene como objetivo **Lua 5.4**.

## Perfil de Lua

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Local por defecto

Declarar cada variable y función con `local`. Un estado global es compartido que cualquier otro archivo puede sobreescribir en silencio. No escriba a `_G` o `_ENV` fuera del punto de entrada del programa. Véase [nombre](../core/naming.md) y [estado y efectos secundarios](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Un módulo de tabla por archivo

Cada archivo construye una tabla local, la llena con sus funciones públicas y la devuelve. Requieren las idas y venidas en la parte superior para que se mantengan visibles.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Cláusulas de guardia y retorno temprano

Compruebe que la entrada no está disponible y no es válida primero, regrese temprano y mantenga la ruta principal sin identificar. Siga [el flujo de control](../core/control-flow.md) y [funciones](../core/functions.md).

```lua
function session.rename(current, name)
    if current == nil then
        return nil, "missing session"
    end
    if type(name) ~= "string" or name == "" then
        return nil, "invalid name"
    end

    current.name = name
    return current
end
```

### PL-LUA-004 — Explicit Nil Checks

Compare directamente con `nil`. `false` es un valor real en Lua, por lo que `if not value` también captura un `false` significativo. Prueba `== nil` cuando la diferencia importe.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

Utilice una comprobación `nil` explícita para un booleano opcional para que un explícito
`false` sobrevive al retroceso.

```text
− Overrides false                          │ ✓ Pureline
local visible = options.visible or true   │ local visible = options.visible
                                          │ if visible == nil then
                                          │     visible = true
                                          │ end
```

### PL-LUA-005 — Los errores son valores

Devuelve `nil, err` para fallos esperados como un archivo faltante o entrada incorrecta, y comprueba el par en el sitio de llamada. Utilice `assert` sólo para errores del programador y invariantes rotos, donde detenerse es la respuesta correcta.

```lua
local function read_config(path)
    local file, err = io.open(path, "r")
    if file == nil then
        return nil, err
    end

    local text = file:read("a")
    file:close()
    return text
end
```

### PL-LUA-006: Metables sólo cuando se aclaran

Las tablas y funciones simples son el valor predeterminado. Utilice un metatable (`__index` para un tipo, `__tostring` para la salida de depuración) sólo cuando hace los sitios de llamadas más claros. No construya cadenas de herencia ni sobrecargas de operador para mayor comodidad. Véase [evitar abstracciones innecesarias](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Funciones pequeñas

Cada función hace una cosa y cabe en una pantalla. Extraer una función local nombrada en lugar de un cuerpo largo con un comentario que marca cada sección. Véase [funciones](../core/functions.md).

### PL-LUA-008 — Claves de cadena para registros

Los registros usan teclas de cadena y acceso a puntos. Reserva las teclas enteras para las secuencias, y nunca mezcles las dos en una tabla.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Los bloques terminan en sus propias líneas

Cada bloque `function`, `if`, `for`, `while` y `do` cierra con `end` en su propia línea, alineado con su palabra clave de apertura. Mantenga bloques multilínea, incluso para una sola declaración. Véase [formato](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Sin una línea de Clever

Prefiere una secuencia de afirmaciones simples sobre expresiones densas. No utilice `cond and a or b` cuando `a` puede ser `nil` o `false`, porque el fuego de reserva se enciende silenciosamente. En su lugar, utilice un `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Densidad de la carpeta

Una carpeta de módulos Lua mantenidos a mano contiene como máximo archivos **10** por defecto. Agrupar módulos por función (`session/`, `net/`), y mantener ayudantes compartidos en una carpeta `util/`. Véase [estructura](../core/structure.md).

### PL-LUA-012 — Herramientas

Ejecute `luacheck` en CI con cero advertencias, por lo que los globales indefinidos y los locales no utilizados fallan la compilación. Formatee cada archivo con `StyLua`. Tratar ambas herramientas como la autoridad en los detalles de estilo que cubren.
