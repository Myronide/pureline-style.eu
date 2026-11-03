# Style de code Lua

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Lua est petit et centré sur les tables : un fichier est un chunk qui construit une table de module, et la structure vient de simples tables et fonctions. Pureline Lua cible **Lua 5.4**.

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

### PL-LUA-001 — Local par défaut {#pl-lua-001--local-by-default}

Déclarez chaque variable et chaque fonction avec `local`. Une globale est un état partagé que n'importe quel autre fichier peut écraser en silence. N'écrivez pas dans `_G` ni `_ENV` en dehors du point d'entrée d'un programme. Voir [nommage](../core/naming.md) et [état et effets de bord](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Une table de module par fichier {#pl-lua-002--one-module-table-per-file}

Chaque fichier construit une table locale, la remplit de ses fonctions publiques et la retourne. Requérez les dépendances en haut afin qu'elles restent visibles.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Guard clauses et retour anticipé {#pl-lua-003--guard-clauses-and-early-return}

Vérifiez d'abord les entrées manquantes et invalides, retournez tôt et gardez le chemin principal sans indentation supplémentaire. Suivez le [flux de contrôle](../core/control-flow.md) et les règles sur les [fonctions](../core/functions.md).

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

### PL-LUA-004 — Vérifications nil explicites {#pl-lua-004--explicit-nil-checks}

Comparez directement à `nil`. `false` est une vraie valeur en Lua ; `if not value` attrape donc aussi un `false` significatif. Testez `== nil` lorsque la différence compte.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

### PL-LUA-005 — Les erreurs sont des valeurs {#pl-lua-005--errors-are-values}

Retournez `nil, err` pour les échecs attendus, comme un fichier manquant ou une mauvaise entrée, et vérifiez la paire au point d'appel. N'utilisez `assert` que pour les erreurs de programmation et les invariants rompus, là où l'arrêt est la bonne réponse.

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

### PL-LUA-006 — Des métatables seulement quand elles clarifient {#pl-lua-006--metatables-only-when-they-clarify}

Les tables et fonctions simples sont la valeur par défaut. Utilisez une métatable (`__index` pour un type, `__tostring` pour la sortie de débogage) uniquement lorsqu'elle rend les points d'appel plus clairs. Ne construisez pas de chaînes d'héritage ni de surcharges d'opérateurs par commodité. Voir [éviter les abstractions inutiles](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Petites fonctions {#pl-lua-007--small-functions}

Chaque fonction fait une seule chose et tient sur un écran. Extrayez une fonction locale nommée plutôt qu'un long corps avec un commentaire marquant chaque section. Voir [fonctions](../core/functions.md).

### PL-LUA-008 — Clés de type chaîne pour les enregistrements {#pl-lua-008--string-keys-for-records}

Les enregistrements utilisent des clés de type chaîne et l'accès par point. Réservez les clés entières aux séquences, et ne mélangez jamais les deux dans une même table.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Les blocs se terminent sur leur propre ligne {#pl-lua-009--blocks-end-on-their-own-lines}

Chaque bloc `function`, `if`, `for`, `while` et `do` se ferme par `end` sur sa propre ligne, aligné avec son mot-clé d'ouverture. Gardez les blocs sur plusieurs lignes, même pour une seule instruction. Voir [mise en forme](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Pas de one-liners astucieux {#pl-lua-010--no-clever-one-liners}

Préférez une suite d'instructions simples à des expressions denses. N'utilisez pas `cond and a or b` lorsque `a` peut être `nil` ou `false`, car la valeur de repli se déclenche en silence. Utilisez plutôt un `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Densité des dossiers {#pl-lua-011--folder-density}

Un dossier de modules Lua maintenus à la main contient au maximum **10 fichiers** par défaut. Regroupez les modules par fonctionnalité (`session/`, `net/`) et gardez les utilitaires partagés dans un seul dossier `util/`. Voir [structure](../core/structure.md).

### PL-LUA-012 — Outillage {#pl-lua-012--tooling}

Exécutez `luacheck` en CI avec zéro avertissement, afin que les globales non définies et les locales inutilisées fassent échouer le build. Formatez chaque fichier avec `StyLua`. Considérez ces deux outils comme faisant autorité sur les détails de style qu'ils couvrent.
