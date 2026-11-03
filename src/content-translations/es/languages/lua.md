# Estilo de código Lua

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil. Lua es pequeño y gira en torno a las tablas: un archivo es un chunk que construye una tabla de módulo, y la estructura procede de tablas y funciones simples. Pureline Lua está pensado para **Lua 5.4**.

## Perfil de Lua {#lua-profile}

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Local por defecto {#pl-lua-001--local-by-default}

Declara cada variable y cada función con `local`. Una global es un estado compartido que cualquier otro archivo puede sobrescribir en silencio. No escribas en `_G` ni en `_ENV` fuera del punto de entrada de un programa. Consulta los [nombres](../core/naming.md) y los [efectos secundarios y el estado](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Una tabla de módulo por archivo {#pl-lua-002--one-module-table-per-file}

Cada archivo construye una tabla local, la rellena con sus funciones públicas y la devuelve. Haz los `require` de las dependencias al principio para que sigan siendo visibles.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard clauses y retorno temprano {#pl-lua-003--guard-clauses-and-early-return}

Comprueba primero las entradas ausentes e inválidas, retorna pronto y mantén el camino principal sin sangrar. Sigue el [flujo de control](../core/control-flow.md) y las [funciones](../core/functions.md).

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

### PL-LUA-004 — Comprobaciones explícitas de nil {#pl-lua-004--explicit-nil-checks}

Compara directamente con `nil`. `false` es un valor real en Lua, así que `if not value` también atrapa un `false` con significado. Comprueba `== nil` cuando la diferencia importe.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

### PL-LUA-005 — Los errores son valores {#pl-lua-005--errors-are-values}

Devuelve `nil, err` para los fallos esperados, como un archivo inexistente o una entrada incorrecta, y comprueba el par en el punto de llamada. Usa `assert` solo para errores del programador e invariantes rotas, donde detenerse es la respuesta correcta.

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

### PL-LUA-006 — Metatablas solo cuando aclaran {#pl-lua-006--metatables-only-when-they-clarify}

Las tablas y funciones simples son la opción por defecto. Usa una metatabla (`__index` para un tipo, `__tostring` para la salida de depuración) solo cuando haga más claros los puntos de llamada. No construyas cadenas de herencia ni sobrecargas de operadores por comodidad. Consulta [evitar las abstracciones innecesarias](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Funciones pequeñas {#pl-lua-007--small-functions}

Cada función hace una sola cosa y cabe en una pantalla. Extrae una función local con nombre en lugar de un cuerpo largo con un comentario que marque cada sección. Consulta las [funciones](../core/functions.md).

### PL-LUA-008 — Claves de cadena para los registros {#pl-lua-008--string-keys-for-records}

Los registros usan claves de cadena y acceso con punto. Reserva las claves enteras para las secuencias y no mezcles nunca ambas en una misma tabla.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Los bloques terminan en su propia línea {#pl-lua-009--blocks-end-on-their-own-lines}

Cada bloque `function`, `if`, `for`, `while` y `do` se cierra con `end` en su propia línea, alineado con su palabra clave de apertura. Mantén los bloques en varias líneas, incluso para una sola sentencia. Consulta el [formato](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Sin líneas únicas ingeniosas {#pl-lua-010--no-clever-one-liners}

Prefiere una secuencia de sentencias simples a las expresiones densas. No uses `cond and a or b` cuando `a` pueda ser `nil` o `false`, porque la alternativa se activa en silencio. Usa un `if` en su lugar.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Densidad de carpetas {#pl-lua-011--folder-density}

Una carpeta de módulos de Lua mantenidos a mano contiene como máximo **10 archivos** por defecto. Agrupa los módulos por funcionalidad (`session/`, `net/`) y mantén los auxiliares compartidos en una única carpeta `util/`. Consulta la [estructura](../core/structure.md).

### PL-LUA-012 — Herramientas {#pl-lua-012--tooling}

Ejecuta `luacheck` en la CI sin ninguna advertencia, de modo que las globales no definidas y las locales sin usar rompan la compilación. Da formato a cada archivo con `StyLua`. Trata ambas herramientas como la autoridad en los detalles de estilo que cubren.
