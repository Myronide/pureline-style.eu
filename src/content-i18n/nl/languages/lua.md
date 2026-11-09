# Lua Codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. Lua is klein en tafel-centrisch: Een bestand is een chunk die één moduletabel bouwt, en structuur komt van platte tabellen en functies. Pureline Lua richt zich op **Lua 5.4**.

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

### PL-LUA-001. Local volgens standaard

Geef elke variabele en functie met `local` aan. Een globale staat is gedeeld dat elk ander bestand kan overschrijven in stilte. Schrijf niet naar `_G` of `_ENV` buiten het inschrijfpunt van een programma. Zie [namen](../core/naming.md) en [toestand en bijwerkingen](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002. Eén Moduletabel per Bestand

Elk bestand bouwt een lokale tabel, vult het met zijn publieke functies, en geeft het terug. Vergissing afhankelijkheden aan de bovenkant, zodat ze zichtbaar blijven.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003. Bewakersclausules en vroegtijdige terugkeer

Controleer de ontbrekende en ongeldige invoer eerst, keer eerder terug en houd het hoofdpad onbedoeld. Volg [controlestroom](../core/control-flow.md) en [functies](../core/functions.md).

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

### PL-LUA-004. Expliciete Nil-controles

Vergelijk het direct met `nil`. `false` is een echte waarde in Lua, dus `if not value` vangt ook een betekenisvolle `false`. Test `== nil` als het verschil belangrijk is.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

Gebruik een expliciete `nil` check voor een optionele booleaan, zodat een expliciete
`false` overleeft de terugval.

```text
− Overrides false                          │ ✓ Pureline
local visible = options.visible or true   │ local visible = options.visible
                                          │ if visible == nil then
                                          │     visible = true
                                          │ end
```

### PL-LUA-005. Fouten zijn waarden

Geef `nil, err` terug voor verwachte fouten zoals een ontbrekende bestand of slechte invoer, en controleer het paar op de call site. Gebruik `assert` alleen voor programmeurfouten en gebroken in de SUV's, waar stoppen de juiste reactie is.

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

### PL-LUA-006. Metatables alleen wanneer ze duidelijker worden

Gewone tabellen en functies zijn de standaard. Gebruik een metatelable (`__index` voor een type, `__tostring` voor debuguitvoer) alleen als het call sites duidelijker maakt. Bouw geen erf- of overbelastingsketens voor het gemak. Zie [vermijd onnodige abstracties](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007. Kleine functies

Elke functie doet één ding en past op een scherm. Uitpakken van een lokale functie in plaats van een lange lichaam met een commentaar markering elke sectie. Zie [functies](../core/functions.md).

### PL-LUA-008. String Keys for Records

Records gebruiken string keys en punt toegang. Reserveer integer keys voor sequenties, en meng nooit de twee in één tabel.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009. Blokken eindigen op hun eigen lijnen

Elke `function`, `if`, `for`, `while` en `do` blok sluit met `end` op zijn eigen lijn, uitgelijnd met zijn openingssleutelwoord. Houd blokken multi-line, zelfs voor een enkele verklaring. Zie [formatteren](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010. nr. Clever One-Liners

Liever een reeks duidelijke uitspraken dan dichte uitdrukkingen. Gebruik `cond and a or b` niet als `a` `nil` of `false` kan zijn, omdat de terugval stilletjes brandt. Gebruik een `if` in plaats daarvan.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011. Map Density

Een map met hand-onderhoud Lua modules bevat hooguit **10 bestanden** standaard. Groepsmodules per functie (`session/`, `net/`) en houd gedeelde helpers in één `util/`-map. Zie [structuur](../core/structure.md).

### PL-LUA-012. Gereedschape

Run `luacheck` in CI met nul waarschuwingen, dus ongedefinieerde globals en ongebruikte locals falen de bouw. Formatteer elk bestand met `StyLua`. Behandel beide instrumenten als de autoriteit over stijldetails die ze behandelen.
