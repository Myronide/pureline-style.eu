# C++ Codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## C++-profiel

Pureline C++ volgt **moderne C++17 en C++20** idiomen. Eigendom leeft in soorten, middelen worden vrijgegeven door destructors, en mislukking wordt teruggegeven als een waarde.

### PL-CPP-001. RAII en Uniek eigendom

Elke bron is eigendom van een object waarvan de vernietiging het vrijgeeft. Gebruik `std::unique_ptr` (via `std::make_unique`) standaard; `std::shared_ptr` alleen voor echt gedeelde eigendom. Raw `new` en `delete` komen niet voor in de toepassingscode.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002. Conteren met standaard

Markeer waarden `const` tenzij ze moeten veranderen, en gebruik `constexpr` voor compileer-tijd constanten. Alleen-lezen argumenten door `const &` doorgeven; alleen waarde aannemen wanneer de functie deze opslaat of verbruikt.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003. Guard Clausles en `std::expected`

Valideer bovenaan de functie en houd het succespad bij het inspringen op de basis, na [controlestroom](../core/control-flow.md). Gebruik `std::optional<T>` voor afwezigheid en `std::expected<T, E>` voor storingen die de beller moet verwerken (C+23; C++17/20 projecten gebruiken een equivalent zoals `tl::expected`). Geef nooit foutcodes terug via parameters.

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

### PL-CPP-004. Afstandsgestuurd `for`

Liever op range-gebaseerde `for` over index loops. Gebruik een standaard algoritme alleen als de naam de bedoeling duidelijker dan een lus aangeeft.

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

Voorkeur `const auto&` voor alleen-lezen iteratie wanneer het elementtype is
Duidelijk uit de omringende code.

```text
− Explicit element type           │ ✓ Pureline
for (const User& user : users) {  │ for (const auto& user : users) {
    print(user.name);             │     print(user.name);
}                                 │ }
```

### PL-CPP-005. Kleine klassen met één verantwoordelijkheid

Een klasse bezit één coherent concept en zijn in de augurken. Houd gegevens privé en onthul een smalle interface. Splits klassen die opslag, prijszetting, persistentie of presentatie mengen. [Cohesie over Size](../core/structure.md) beslist, geen regeltelling.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006. Header en bron Splitsen

Definieer interfaces in een `.hpp` header en definieer ze in een bijpassende `.cpp`. Elke header gebruikt `#pragma once` of klassieker zijn bewakers, en bevat nooit `using namespace`, die namen lekt in elke includer.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007. Map Density

Een bronmap bevat hooguit **10 met de hand onderhouden productiebestanden** (`.hpp` en `.cpp` beide tellingen) standaard. Tests, gegenereerde code en verkochte code tellen niet mee. Die drempel voorbij, opsplitsen langs echte verantwoordelijkheidsgrenzen, nooit in betekenisloze nested mappen.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008. Het gereedschap zorgt voor de uitlijning

Formatteer met `clang-format`, met `clang-tidy`, en compileer met `-Wall -Wextra -Werror`. Waarschuwingen zijn gebreken, geen suggesties.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
