# Lua Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Lua jest mała i skoncentrowana na tablicach: plik to chunk, który buduje jedną tablicę modułu, a struktura wynika ze zwykłych tablic i funkcji. Pureline Lua dotyczy **Lua 5.4**.

## Profil Lua {#lua-profile}

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Domyślnie local {#pl-lua-001--local-by-default}

Każdą zmienną i funkcję deklaruj za pomocą `local`. Zmienna globalna to współdzielony stan, który każdy inny plik może po cichu nadpisać. Nie zapisuj do `_G` ani `_ENV` poza punktem wejścia programu. Zobacz [nazewnictwo](../core/naming.md) oraz [stan i efekty uboczne](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Jedna tablica modułu na plik {#pl-lua-002--one-module-table-per-file}

Każdy plik buduje lokalną tablicę, wypełnia ją swoimi funkcjami publicznymi i ją zwraca. Zależności wczytuj przez require na początku, aby pozostały widoczne.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard clauses i wczesny zwrot {#pl-lua-003--guard-clauses-and-early-return}

Najpierw sprawdzaj brakujące i niepoprawne dane wejściowe, wracaj wcześnie i trzymaj główną ścieżkę bez wcięć. Stosuj [przepływ sterowania](../core/control-flow.md) i [funkcje](../core/functions.md).

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

### PL-LUA-004 — Jawne sprawdzanie nil {#pl-lua-004--explicit-nil-checks}

Porównuj bezpośrednio z `nil`. `false` jest w Lua pełnoprawną wartością, więc `if not value` łapie także znaczące `false`. Gdy różnica ma znaczenie, testuj `== nil`.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

### PL-LUA-005 — Błędy są wartościami {#pl-lua-005--errors-are-values}

Dla oczekiwanych awarii, takich jak brakujący plik lub błędne dane wejściowe, zwracaj `nil, err` i sprawdzaj tę parę w miejscu wywołania. `assert` stosuj tylko dla błędów programisty i naruszonych niezmienników, gdzie zatrzymanie jest właściwą reakcją.

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

### PL-LUA-006 — Metatablice tylko wtedy, gdy coś wyjaśniają {#pl-lua-006--metatables-only-when-they-clarify}

Domyślnie używaj zwykłych tablic i funkcji. Metatablicy (`__index` dla typu, `__tostring` dla wyjścia debugowania) używaj tylko wtedy, gdy sprawia, że miejsca wywołań są czytelniejsze. Nie buduj łańcuchów dziedziczenia ani przeciążeń operatorów dla wygody. Zobacz [unikanie zbędnych abstrakcji](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Małe funkcje {#pl-lua-007--small-functions}

Każda funkcja robi jedną rzecz i mieści się na jednym ekranie. Wydziel nazwaną funkcję lokalną zamiast długiego ciała z komentarzem oznaczającym każdą sekcję. Zobacz [funkcje](../core/functions.md).

### PL-LUA-008 — Klucze tekstowe dla rekordów {#pl-lua-008--string-keys-for-records}

Rekordy używają kluczy tekstowych i dostępu przez kropkę. Klucze całkowitoliczbowe zarezerwuj dla sekwencji i nigdy nie mieszaj obu w jednej tablicy.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Bloki kończą się w osobnych liniach {#pl-lua-009--blocks-end-on-their-own-lines}

Każdy blok `function`, `if`, `for`, `while` i `do` zamykaj słowem `end` w osobnej linii, wyrównanym z słowem otwierającym. Bloki utrzymuj wieloliniowe, nawet dla pojedynczej instrukcji. Zobacz [formatowanie](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Bez sprytnych jednolinijkowców {#pl-lua-010--no-clever-one-liners}

Preferuj ciąg zwykłych instrukcji zamiast gęstych wyrażeń. Nie używaj `cond and a or b`, gdy `a` może być `nil` lub `false`, ponieważ wartość zapasowa uruchamia się po cichu. Zamiast tego użyj `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Gęstość folderów {#pl-lua-011--folder-density}

Folder z ręcznie utrzymywanymi modułami Lua domyślnie zawiera co najwyżej **10 plików**. Grupuj moduły według funkcji (`session/`, `net/`), a wspólne helpery trzymaj w jednym folderze `util/`. Zobacz [strukturę](../core/structure.md).

### PL-LUA-012 — Narzędzia {#pl-lua-012--tooling}

W CI uruchamiaj `luacheck` bez ostrzeżeń, aby niezdefiniowane globale i nieużywane zmienne lokalne powodowały błąd budowania. Każdy plik formatuj za pomocą `StyLua`. Oba narzędzia traktuj jako autorytet w szczegółach stylu, które obejmują.
