# Lua-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Lua is klein en tabelgericht: een bestand is een chunk die één moduletabel opbouwt, en structuur komt voort uit gewone tabellen en functies. Pureline Lua richt zich op **Lua 5.4**.

## Lua-profiel {#lua-profile}

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Standaard local {#pl-lua-001--local-by-default}

Declareer elke variabele en functie met `local`. Een global is gedeelde toestand die elk ander bestand ongemerkt kan overschrijven. Schrijf niet naar `_G` of `_ENV` buiten het startpunt van een programma. Zie [naamgeving](../core/naming.md) en [toestand en neveneffecten](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Eén moduletabel per bestand {#pl-lua-002--one-module-table-per-file}

Elk bestand bouwt een lokale tabel op, vult die met zijn publieke functies en retourneert haar. Require afhankelijkheden bovenaan, zodat ze zichtbaar blijven.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard clauses en vroege return {#pl-lua-003--guard-clauses-and-early-return}

Controleer ontbrekende en ongeldige invoer eerst, keer vroeg terug en houd het hoofdpad zonder extra inspringing. Volg [besturingsstroom](../core/control-flow.md) en [functies](../core/functions.md).

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

### PL-LUA-004 — Expliciete nil-controles {#pl-lua-004--explicit-nil-checks}

Vergelijk rechtstreeks met `nil`. `false` is in Lua een echte waarde, dus `if not value` vangt ook een betekenisvolle `false` af. Test op `== nil` wanneer het verschil ertoe doet.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

### PL-LUA-005 — Fouten zijn waarden {#pl-lua-005--errors-are-values}

Retourneer `nil, err` voor verwachte fouten, zoals een ontbrekend bestand of ongeldige invoer, en controleer het paar op de plek van de aanroep. Gebruik `assert` alleen voor programmeerfouten en geschonden invarianten, waar stoppen de juiste reactie is.

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

### PL-LUA-006 — Metatables alleen wanneer ze verduidelijken {#pl-lua-006--metatables-only-when-they-clarify}

Gewone tabellen en functies zijn de standaard. Gebruik een metatable (`__index` voor een type, `__tostring` voor uitvoer bij het debuggen) alleen wanneer dat de aanroepen duidelijker maakt. Bouw geen overervingsketens of operator-overloads voor het gemak. Zie [vermijd onnodige abstracties](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Kleine functies {#pl-lua-007--small-functions}

Elke functie doet één ding en past op één scherm. Extraheer een benoemde lokale functie in plaats van een lange body met een opmerking bij elke sectie. Zie [functies](../core/functions.md).

### PL-LUA-008 — Stringsleutels voor records {#pl-lua-008--string-keys-for-records}

Records gebruiken stringsleutels en puntnotatie. Bewaar integersleutels voor reeksen en meng de twee nooit in één tabel.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Blokken eindigen op een eigen regel {#pl-lua-009--blocks-end-on-their-own-lines}

Elk `function`-, `if`-, `for`-, `while`- en `do`-blok sluit af met `end` op een eigen regel, uitgelijnd met het openende sleutelwoord. Houd blokken meerregelig, ook voor één enkele statement. Zie [opmaak](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Geen slimme one-liners {#pl-lua-010--no-clever-one-liners}

Geef de voorkeur aan een reeks gewone statements boven compacte expressies. Gebruik `cond and a or b` niet wanneer `a` `nil` of `false` kan zijn, omdat de terugvalwaarde dan ongemerkt wordt gebruikt. Gebruik in plaats daarvan een `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Mapdichtheid {#pl-lua-011--folder-density}

Een map met handmatig onderhouden Lua-modules bevat standaard maximaal **10 bestanden**. Groepeer modules per feature (`session/`, `net/`) en houd gedeelde hulpfuncties in één map `util/`. Zie [structuur](../core/structure.md).

### PL-LUA-012 — Tooling {#pl-lua-012--tooling}

Voer in CI `luacheck` uit zonder waarschuwingen, zodat ongedefinieerde globals en ongebruikte locals de build laten mislukken. Formatteer elk bestand met `StyLua`. Beschouw beide tools als autoriteit over de stijldetails die ze afdekken.
