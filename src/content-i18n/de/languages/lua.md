# Codestil Lua

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) mit diesem Profil an. Lua ist klein und tischzentriert: Eine Datei ist ein Stück, das eine Modultabelle erstellt, und die Struktur kommt aus einfachen Tabellen und Funktionen. Pureline Lua zielt auf **Lua 5.4**.

## Profil Lua

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Lokale nach Standard

Deklarieren Sie jede Variable und Funktion mit `local`. Ein globaler Zustand wird geteilt, dass jede andere Datei stillschweigend überschreiben kann. Schreiben Sie nicht an `_G` oder `_ENV` außerhalb des Einsteigerpunktes eines Programms. Siehe [Naming](../core/naming.md) und [Zustand und Nebenwirkungen](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Eine Modultabelle pro Datei

Jede Datei baut eine lokale Tabelle auf, füllt sie mit ihren öffentlichen Funktionen und gibt sie zurück. Benötigt Abhängigkeiten an der Spitze, damit sie sichtbar bleiben..

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Wachklauseln und vorzeitige Rückkehr

Überprüfen Sie zuerst fehlende und ungültige Eingaben, kehren Sie früh zurück und halten Sie den Hauptpfad uninndented. Folgen Sie [Kontrollfluss](../core/control-flow.md) und [Funktionen](../core/functions.md).

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

### PL-LUA-004 — Explizite Nil-Kontrollen

Vergleichen Sie mit `nil` direkt. `false` ist ein echter Wert in Lua, daher fängt `if not value` auch ein sinnvolles `false` ein. Testen Sie `== nil`, wenn der Unterschied wichtig ist.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

Verwenden Sie einen expliziten `nil`-Check für einen optionalen Boolean, so dass ein expliziter
`false` überlebt den Rückfall..

```text
− Overrides false                          │ ✓ Pureline
local visible = options.visible or true   │ local visible = options.visible
                                          │ if visible == nil then
                                          │     visible = true
                                          │ end
```

### PL-LUA-005 — Fehler sind Werte

Gibt `nil, err` für erwartete Fehler wie eine fehlende Datei oder schlechte Eingabe zurück und überprüft das Paar auf der Anrufseite. Use `assert` only for programmer errors and broken invariants, where stopping is the correct response.

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

Every `function`, `if`, `for`, `while`, and `do` block closes with `end` on its own line, aligned with its opening keyword. Keep blocks multi-line, even for a single statement. Siehe [Formatierung](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Keine Einleiner für Klever

Bevorzugen Sie eine Folge von einfachen Aussagen über dichte Ausdrücke... Verwenden Sie `cond and a or b` nicht, wenn `a` `nil` oder `false` sein kann, weil der Rückfall leise feuert. Verwenden Sie stattdessen ein `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Ordnerdichte

Ein Ordner mit handgepflegeten Lua-Modulen enthält standardmäßig höchstens **10-Dateien**. Gruppenmodule nach Feature (`session/`, `net/`) und halten gemeinsam genutzte Helfer in einem `util/`-Ordner. Siehe [Struktur](../core/structure.md)...

### PL-LUA-012 — Werkzeugbau

Führen Sie `luacheck` in CI mit Nullwarnungen aus, sodass undefinierte Globale und nicht verwendete Locals nicht Build sind. Formatieren Sie jede Datei mit `StyLua`. Behandeln Sie beide Werkzeuge als die Autorität für Stildetails, die sie abdecken.
