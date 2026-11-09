# C++ Style de code

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil C++

Pureline C++ suit les idiomes ** modernes C++17 et C++20**. La propriété vit en types, les ressources sont libérées par des destructeurs, et l'échec est retourné comme valeur.

### PL-CPP-001 — RAII et propriété unique

Chaque ressource appartient à un objet dont le destructeur la libère. Utilisez `std::unique_ptr` (via `std::make_unique`) par défaut; `std::shared_ptr` seulement pour une propriété réellement partagée. Les `new` bruts et `delete` n'apparaissent pas dans le code de demande.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Const par défaut

Marquez les valeurs `const` à moins qu'elles ne changent et utilisez `constexpr` pour compiler les années de référence. Passer les arguments en lecture seule par `const &`; prendre par valeur seulement lorsque la fonction les stocke ou les consomme.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Clauses de garde et `std::expected`

Valider en haut de la fonction et garder le chemin de succès à l'indentation de base, après [contrôle du flux](../core/control-flow.md). Utilisez `std::optional<T>` pour l'absence et `std::expected<T, E>` pour les défaillances que l'appelant doit gérer (C++23; les projets C++17/20 utilisent un équivalent tel que `tl::expected`). Ne jamais retourner les codes d'erreur à travers les paramètres.

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

### PL-CPP-004 — `for` basé sur la plage

Préférez `for` basé sur la plage sur les boucles d'index. Utilisez un algorithme standard seulement lorsque son nom indique l'intention plus clairement qu'une boucle.

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

Préférez `const auto&` pour l'itération en lecture seule lorsque le type d'élément est
clair du code environnant.

```text
− Explicit element type           │ ✓ Pureline
for (const User& user : users) {  │ for (const auto& user : users) {
    print(user.name);             │     print(user.name);
}                                 │ }
```

### PL-CPP-005 — Petites classes ayant une responsabilité unique

Une classe possède un concept cohérent et ses invariants. Gardez les données privées et exposez une interface étroite. Classes de fractionnement qui mélangent stockage, prix, persistance ou présentation. [Cohésion sur taille](../core/structure.md) décide, pas un nombre de lignes.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — En-tête et fractionnement des sources

Déclarez les interfaces dans un en-tête `.hpp` et définissez-les dans un `.cpp` correspondant. Chaque en-tête utilise `#pragma once` ou classique inclut des gardes, et ne contient jamais `using namespace`, qui fuit les noms dans chaque inclus.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Densité du dossier

Un dossier source contient au plus des fichiers de production **10 maintenus manuellement** (`.hpp` et `.cpp` tous les deux comptent) par défaut. Les tests, le code généré et le code de fournisseur ne comptent pas. Passé ce seuil, divisé le long des limites de responsabilité réelles, jamais dans des dossiers imbriqués sans signification.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — L'outillage fait appliquer la référence

Format avec `clang-format`, lint avec `clang-tidy`, et compiler avec `-Wall -Wextra -Werror`. Les avertissements sont des défauts, pas des suggestions.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
