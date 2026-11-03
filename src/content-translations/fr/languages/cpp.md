# Style de code C++

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil C++ {#c-profile}

Pureline C++ suit les idiomes du **C++17 et du C++20 modernes**. La propriété vit dans les types, les ressources sont libérées par les destructeurs, et l'échec est retourné comme une valeur.

### PL-CPP-001 — RAII et propriété unique {#pl-cpp-001--raii-and-unique-ownership}

Chaque ressource appartient à un objet dont le destructeur la libère. Utilisez `std::unique_ptr` (via `std::make_unique`) par défaut ; `std::shared_ptr` uniquement pour une propriété réellement partagée. `new` et `delete` bruts n'apparaissent pas dans le code applicatif.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Const par défaut {#pl-cpp-002--const-by-default}

Marquez les valeurs `const`, sauf si elles doivent changer, et utilisez `constexpr` pour les constantes de compilation. Passez les arguments en lecture seule par `const &` ; ne prenez par valeur que lorsque la fonction les stocke ou les consomme.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard clauses et `std::expected` {#pl-cpp-003--guard-clauses-and-stdexpected}

Validez en haut de la fonction et gardez le chemin de succès à l'indentation de base, conformément au [flux de contrôle](../core/control-flow.md). Utilisez `std::optional<T>` pour l'absence et `std::expected<T, E>` pour les échecs que l'appelant doit traiter (C++23 ; les projets C++17/20 utilisent un équivalent tel que `tl::expected`). Ne retournez jamais de codes d'erreur par des paramètres de sortie.

```cpp
#include <expected>
#include <string>

enum class ConfigError { Missing };

std::expected<std::string, ConfigError> load_path(const std::string& path) {
    if (path.empty()) {
        return std::unexpected{ConfigError::Missing};
    }
    return path;
}
```

### PL-CPP-004 — `for` sur intervalle {#pl-cpp-004--range-based-for}

Préférez le `for` sur intervalle (range-based) aux boucles à index. N'utilisez un algorithme standard que lorsque son nom énonce l'intention plus clairement qu'une boucle.

```cpp
#include <string>
#include <vector>

int count_long(const std::vector<std::string>& names) {
    int count = 0;
    for (const auto& name : names) {
        if (name.size() > 8) {
            ++count;
        }
    }
    return count;
}
```

### PL-CPP-005 — Petites classes à responsabilité unique {#pl-cpp-005--small-classes-with-one-responsibility}

Une classe possède un concept cohérent et ses invariants. Gardez les données privées et exposez une interface étroite. Découpez les classes qui mélangent stockage, tarification, persistance ou présentation. C'est la [cohésion avant la taille](../core/structure.md) qui tranche, et non un nombre de lignes.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Séparation en-tête et source {#pl-cpp-006--header-and-source-split}

Déclarez les interfaces dans un en-tête `.hpp` et définissez-les dans un `.cpp` correspondant. Chaque en-tête utilise `#pragma once` ou des gardes d'inclusion classiques, et ne contient jamais `using namespace`, qui fait fuiter des noms dans tous les fichiers qui l'incluent.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Densité des dossiers {#pl-cpp-007--folder-density}

Un dossier source contient au maximum **10 fichiers de production maintenus à la main** (`.hpp` et `.cpp` comptent tous deux) par défaut. Les tests, le code généré et le code embarqué (vendored) ne comptent pas. Au-delà de ce seuil, découpez selon de véritables frontières de responsabilité, jamais en dossiers imbriqués dénués de sens.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — L'outillage impose la base de référence {#pl-cpp-008--tooling-enforces-the-baseline}

Formatez avec `clang-format`, analysez avec `clang-tidy` et compilez avec `-Wall -Wextra -Werror`. Les avertissements sont des défauts, pas des suggestions.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
