# Stile del codice Lua

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo. Lua è piccolo e incentrato sulle tabelle: un file è un chunk che costruisce una tabella di modulo, e la struttura nasce da semplici tabelle e funzioni. Pureline Lua ha come obiettivo **Lua 5.4**.

## Profilo Lua {#lua-profile}

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Locale per impostazione predefinita {#pl-lua-001--local-by-default}

Dichiara ogni variabile e ogni funzione con `local`. Una variabile globale è uno stato condiviso che qualsiasi altro file può sovrascrivere in silenzio. Non scrivere su `_G` o `_ENV` al di fuori del punto di ingresso di un programma. Vedi i [nomi](../core/naming.md) e [stato ed effetti collaterali](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Una tabella di modulo per file {#pl-lua-002--one-module-table-per-file}

Ogni file costruisce una tabella locale, la riempie con le proprie funzioni pubbliche e la restituisce. Richiedi le dipendenze all'inizio, così restano visibili.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard clause e ritorno anticipato {#pl-lua-003--guard-clauses-and-early-return}

Controlla per prima cosa l'input mancante e non valido, ritorna subito e mantieni il percorso principale senza indentazione. Segui il [controllo di flusso](../core/control-flow.md) e le [funzioni](../core/functions.md).

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

### PL-LUA-004 — Controlli espliciti di nil {#pl-lua-004--explicit-nil-checks}

Confronta direttamente con `nil`. `false` è un valore reale in Lua, quindi `if not value` cattura anche un `false` significativo. Verifica `== nil` quando la differenza conta.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

### PL-LUA-005 — Gli errori sono valori {#pl-lua-005--errors-are-values}

Restituisci `nil, err` per i fallimenti previsti, come un file mancante o un input errato, e controlla la coppia nel punto della chiamata. Usa `assert` solo per gli errori del programmatore e le invarianti violate, dove fermarsi è la risposta corretta.

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

### PL-LUA-006 — Metatable solo quando chiariscono {#pl-lua-006--metatables-only-when-they-clarify}

Tabelle e funzioni semplici sono la scelta predefinita. Usa una metatable (`__index` per un tipo, `__tostring` per l'output di debug) solo quando rende più chiari i punti di chiamata. Non costruire catene di ereditarietà né overload di operatori per comodità. Vedi [evitare le astrazioni superflue](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Funzioni piccole {#pl-lua-007--small-functions}

Ogni funzione fa una sola cosa e sta in una schermata. Estrai una funzione locale con nome invece di un corpo lungo con un commento a segnare ogni sezione. Vedi le [funzioni](../core/functions.md).

### PL-LUA-008 — Chiavi stringa per i record {#pl-lua-008--string-keys-for-records}

I record usano chiavi stringa e l'accesso con il punto. Riserva le chiavi intere alle sequenze e non mescolare mai le due cose nella stessa tabella.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — I blocchi terminano su righe proprie {#pl-lua-009--blocks-end-on-their-own-lines}

Ogni blocco `function`, `if`, `for`, `while` e `do` si chiude con `end` su una riga propria, allineato alla sua parola chiave di apertura. Mantieni i blocchi su più righe, anche per una singola istruzione. Vedi la [formattazione](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Niente espressioni astute su una riga {#pl-lua-010--no-clever-one-liners}

Preferisci una sequenza di istruzioni semplici a espressioni dense. Non usare `cond and a or b` quando `a` può essere `nil` o `false`, perché il valore di ripiego scatta in silenzio. Usa invece un `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Densità delle cartelle {#pl-lua-011--folder-density}

Una cartella di moduli Lua mantenuti a mano contiene al massimo **10 file** per impostazione predefinita. Raggruppa i moduli per funzionalità (`session/`, `net/`) e tieni le funzioni di supporto condivise in un'unica cartella `util/`. Vedi la [struttura](../core/structure.md).

### PL-LUA-012 — Strumenti {#pl-lua-012--tooling}

Esegui `luacheck` nella CI con zero avvisi, così le variabili globali non definite e le variabili locali inutilizzate fanno fallire la build. Formatta ogni file con `StyLua`. Considera entrambi gli strumenti come l'autorità sui dettagli di stile che coprono.
