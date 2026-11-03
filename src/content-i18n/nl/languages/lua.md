# Lua Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. Lua is small and table-centric: a file is a chunk that builds one module table, and structure comes from plain tables and functions. Pureline Lua targets **Lua 5.4**.

## Lua Profile

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Local by Default

Declare every variable and function with `local`. A global is shared state that any other file can overwrite silently. Do not write to `_G` or `_ENV` outside a program's entry point. See [naming](../core/naming.md) and [state and side effects](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — One Module Table per File

Each file builds a local table, fills it with its public functions, and returns it. Require dependencies at the top so they stay visible.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard Clauses and Early Return

Check missing and invalid input first, return early, and keep the main path unindented. Follow [control flow](../core/control-flow.md) and [functions](../core/functions.md).

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

Compare against `nil` directly. `false` is a real value in Lua, so `if not value` also catches a meaningful `false`. Test `== nil` when the difference matters.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

Use an explicit `nil` check for an optional boolean so that an explicit
`false` survives the fallback.

```text
− Overrides false                          │ ✓ Pureline
local visible = options.visible or true   │ local visible = options.visible
                                          │ if visible == nil then
                                          │     visible = true
                                          │ end
```

### PL-LUA-005 — Errors Are Values

Return `nil, err` for expected failures such as a missing file or bad input, and check the pair at the call site. Use `assert` only for programmer errors and broken invariants, where stopping is the correct response.

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

### PL-LUA-006 — Metatables Only When They Clarify

Plain tables and functions are the default. Use a metatable (`__index` for a type, `__tostring` for debugging output) only when it makes call sites clearer. Do not build inheritance chains or operator overloads for convenience. See [avoid unnecessary abstractions](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Small Functions

Each function does one thing and fits on a screen. Extract a named local function instead of a long body with a comment marking each section. See [functions](../core/functions.md).

### PL-LUA-008 — String Keys for Records

Records use string keys and dot access. Reserve integer keys for sequences, and never mix the two in one table.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Blocks End on Their Own Lines

Every `function`, `if`, `for`, `while`, and `do` block closes with `end` on its own line, aligned with its opening keyword. Keep blocks multi-line, even for a single statement. See [formatting](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — No Clever One-Liners

Prefer a sequence of plain statements over dense expressions. Do not use `cond and a or b` when `a` can be `nil` or `false`, because the fallback fires silently. Use an `if` instead.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011. Map Density

A folder of hand-maintained Lua modules holds at most **10 files** by default. Group modules by feature (`session/`, `net/`), and keep shared helpers in one `util/` folder. See [structure](../core/structure.md).

### PL-LUA-012. Gereedschape

Run `luacheck` in CI with zero warnings, so undefined globals and unused locals fail the build. Format every file with `StyLua`. Treat both tools as the authority on style details they cover.
