# Style de code de Lua

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Lua est petite et centrée sur la table: un fichier est un morceau qui construit une table de module, et la structure vient de tables et de fonctions simples. Pureline Lua cible **Lua 5.4**.

## Profil de Lua

```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

### PL-LUA-001 — Local par défaut

Déclarez chaque variable et fonction avec `local`. Un état global est partagé que tout autre fichier peut écraser silencieusement. N'écrivez pas à `_G` ou `_ENV` en dehors du point d'entrée d'un programme. Voir [nom](../core/naming.md) et [état et effets indésirables](../core/state-and-side-effects.md).

```lua
local function parse_port(text)
    return tonumber(text)
end
```

### PL-LUA-002 — Un seul tableau de module par fichier

Chaque fichier construit une table locale, la remplit de ses fonctions publiques, et la retourne. Exiger des dépendances au sommet pour qu'elles restent visibles.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

### PL-LUA-003 — Clauses de garde et retour anticipé

Vérifiez d'abord les entrées manquantes et non valides, retournez tôt et conservez le chemin principal sans dindent. Suivre [écoulement de commande](../core/control-flow.md) et [fonctions](../core/functions.md).

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

### PL-LUA-004 — Contrôles explicites

Comparer directement avec `nil`. `false` est une valeur réelle dans Lua, donc `if not value` capture également un `false` significatif. Testez `== nil` lorsque la différence compte.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

Utilisez une vérification explicite `nil` pour un booléen optionnel afin qu'un
`false` survit au recul.

```text
− Overrides false                          │ ✓ Pureline
local visible = options.visible or true   │ local visible = options.visible
                                          │ if visible == nil then
                                          │     visible = true
                                          │ end
```

### PL-LUA-005 — Les erreurs sont des valeurs

Retournez `nil, err` pour les échecs attendus comme un fichier manquant ou une mauvaise entrée, et vérifiez la paire sur le site d'appel. Utilisez `assert` uniquement pour les erreurs de programmeur et les invariants cassés, où l'arrêt est la réponse correcte.

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

### PL-LUA-006 — Métatables seulement lorsqu'ils s'éclaircissent

Les tables et les fonctions simples sont par défaut. Utilisez une métatable (`__index` pour un type, `__tostring` pour le débogage de sortie) seulement quand elle rend les sites d'appel plus clairs. Ne pas construire des chaînes de succession ou des surcharges d'opérateurs pour la commodité. Voir [éviter les abstractions inutiles](../core/principles.md).

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

### PL-LUA-007 — Petites fonctions

Chaque fonction fait une chose et s'adapte à un écran. Extraire une fonction locale nommée au lieu d'un long corps avec un commentaire indiquant chaque section. Voir [fonctions](../core/functions.md).

### PL-LUA-008 — Clés de chaîne pour les enregistrements

Les enregistrements utilisent des clés de chaîne et un accès par point. Réservez les touches de la liste des séquences et ne mélangez jamais les deux dans une seule table.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

### PL-LUA-009 — Les blocs se terminent sur leurs propres lignes

Chaque bloc `function`, `if`, `for`, `while` et `do` se ferme avec `end` sur sa propre ligne, aligné sur son mot-clé d'ouverture. Gardez les blocs multilignes, même pour une seule déclaration. Voir [formatage](../core/formatting.md).

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

### PL-LUA-010 — Pas de Clever monoligne

Préférez une séquence d'énoncés simples sur des expressions denses. N'utilisez pas `cond and a or b` lorsque `a` peut être `nil` ou `false`, car le recul s'enflamme silencieusement. Utilisez plutôt un `if`.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

### PL-LUA-011 — Densité du dossier

Un dossier de modules Lua entretenus manuellement détient au plus des fichiers **10** par défaut. Grouper les modules par fonction (`session/`, `net/`) et garder les aides partagées dans un dossier `util/`. Voir [structure](../core/structure.md).

### PL-LUA-012 — Outillage

Exécutez `luacheck` en CI avec zéro avertissement, si les globals non définis et les locaux inutilisés échouent la construction. Formater chaque fichier avec `StyLua`. Traitez les deux outils comme l'autorité sur les détails de style qu'ils couvrent.
