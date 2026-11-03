# Lua Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an. Lua ist klein und tabellenzentriert: Eine Datei ist ein Chunk, der eine Modultabelle aufbaut, und Struktur entsteht aus einfachen Tabellen und Funktionen. Pureline Lua zielt auf **Lua 5.4**.

## Lua-Profil {#lua-profile}

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Standardmäßig local {#pl-lua-001--local-by-default}

Deklariere jede Variable und jede Funktion mit `local`. Eine globale Variable ist gemeinsamer Zustand, den jede andere Datei stillschweigend überschreiben kann. Schreibe außerhalb des Einstiegspunkts eines Programms nicht in `_G` oder `_ENV`. Siehe [Benennung](../core/naming.md) sowie [Zustand und Seiteneffekte](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Eine Modultabelle pro Datei {#pl-lua-002--one-module-table-per-file}

Jede Datei baut eine lokale Tabelle auf, füllt sie mit ihren öffentlichen Funktionen und gibt sie zurück. Binde Abhängigkeiten am Anfang per require ein, damit sie sichtbar bleiben.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard Clauses und frühe Rückgabe {#pl-lua-003--guard-clauses-and-early-return}

Prüfe fehlende und ungültige Eingaben zuerst, kehre früh zurück und halte den Hauptpfad ohne Einrückung. Folge dem [Kontrollfluss](../core/control-flow.md) und den Regeln für [Funktionen](../core/functions.md).

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

### PL-LUA-004 — Explizite nil-Prüfungen {#pl-lua-004--explicit-nil-checks}

Vergleiche direkt mit `nil`. `false` ist in Lua ein echter Wert, daher fängt `if not value` auch ein bedeutungsvolles `false` ab. Teste auf `== nil`, wenn der Unterschied zählt.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

Prüfe optionale Boolean-Werte ausdrücklich auf `nil`, damit ein explizites
`false` beim Setzen des Standardwerts erhalten bleibt.

```text
− Overrides false                          │ ✓ Pureline
local visible = options.visible or true   │ local visible = options.visible
                                          │ if visible == nil then
                                          │     visible = true
                                          │ end
```

### PL-LUA-005 — Fehler sind Werte {#pl-lua-005--errors-are-values}

Gib für erwartete Fehler wie eine fehlende Datei oder fehlerhafte Eingaben `nil, err` zurück und prüfe das Paar an der Aufrufstelle. Verwende `assert` nur für Programmierfehler und gebrochene Invarianten, bei denen das Anhalten die richtige Reaktion ist.

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

### PL-LUA-006 — Metatables nur, wenn sie Klarheit schaffen {#pl-lua-006--metatables-only-when-they-clarify}

Einfache Tabellen und Funktionen sind der Standard. Verwende eine Metatable (`__index` für einen Typ, `__tostring` für Debug-Ausgaben) nur, wenn sie die Aufrufstellen klarer macht. Baue aus Bequemlichkeit keine Vererbungsketten oder Operator-Überladungen. Siehe [Unnötige Abstraktionen vermeiden](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Kleine Funktionen {#pl-lua-007--small-functions}

Jede Funktion tut eine Sache und passt auf einen Bildschirm. Extrahiere eine benannte lokale Funktion, statt einen langen Rumpf mit einem Kommentar je Abschnitt zu schreiben. Siehe [Funktionen](../core/functions.md).

### PL-LUA-008 — String-Schlüssel für Records {#pl-lua-008--string-keys-for-records}

Records verwenden String-Schlüssel und Punktzugriff. Ganzzahlschlüssel sind Sequenzen vorbehalten, und beides wird nie in einer Tabelle gemischt.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Blöcke enden in eigenen Zeilen {#pl-lua-009--blocks-end-on-their-own-lines}

Jeder Block aus `function`, `if`, `for`, `while` und `do` schließt mit `end` in einer eigenen Zeile, ausgerichtet am öffnenden Schlüsselwort. Halte Blöcke mehrzeilig, auch bei einer einzelnen Anweisung. Siehe [Formatierung](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Keine cleveren Einzeiler {#pl-lua-010--no-clever-one-liners}

Bevorzuge eine Folge einfacher Anweisungen gegenüber dichten Ausdrücken. Verwende nicht `cond and a or b`, wenn `a` `nil` oder `false` sein kann, denn dann greift der Fallback stillschweigend. Verwende stattdessen ein `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Ordnerdichte {#pl-lua-011--folder-density}

Ein Ordner mit von Hand gepflegten Lua-Modulen enthält standardmäßig höchstens **10 Dateien**. Gruppiere Module nach Feature (`session/`, `net/`) und halte gemeinsame Helfer in einem einzigen Ordner `util/`. Siehe [Struktur](../core/structure.md).

### PL-LUA-012 — Tooling {#pl-lua-012--tooling}

Führe in der CI `luacheck` ohne Warnungen aus, sodass undefinierte Globals und ungenutzte lokale Variablen den Build scheitern lassen. Formatiere jede Datei mit `StyLua`. Betrachte beide Werkzeuge als maßgeblich für die Stildetails, die sie abdecken.
