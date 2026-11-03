# C++-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## C++-profiel {#c-profile}

Pureline C++ volgt de idiomen van **modern C++17 en C++20**. Eigenaarschap zit in typen, resources worden door destructors vrijgegeven en fouten worden als waarde teruggegeven.

### PL-CPP-001 — RAII en uniek eigenaarschap {#pl-cpp-001--raii-and-unique-ownership}

Elke resource is eigendom van een object waarvan de destructor haar vrijgeeft. Gebruik standaard `std::unique_ptr` (via `std::make_unique`); `std::shared_ptr` alleen voor werkelijk gedeeld eigenaarschap. Kale `new` en `delete` komen niet voor in applicatiecode.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Standaard const {#pl-cpp-002--const-by-default}

Markeer waarden als `const`, tenzij ze moeten veranderen, en gebruik `constexpr` voor constanten tijdens compilatie. Geef argumenten die alleen gelezen worden door als `const &`; neem ze alleen op waarde over wanneer de functie ze opslaat of verbruikt.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard clauses en `std::expected` {#pl-cpp-003--guard-clauses-and-stdexpected}

Valideer bovenaan de functie en houd het succespad op het basisinspringniveau, volgens [besturingsstroom](../core/control-flow.md). Gebruik `std::optional<T>` voor afwezigheid en `std::expected<T, E>` voor fouten die de aanroeper moet afhandelen (C++23; projecten in C++17/20 gebruiken een gelijkwaardig alternatief zoals `tl::expected`). Retourneer foutcodes nooit via uitvoerparameters.

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

### PL-CPP-004 — Range-based `for` {#pl-cpp-004--range-based-for}

Geef de voorkeur aan range-based `for` boven indexlussen. Gebruik een standaardalgoritme alleen wanneer de naam ervan de intentie duidelijker uitdrukt dan een lus.

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

### PL-CPP-005 — Kleine klassen met één verantwoordelijkheid {#pl-cpp-005--small-classes-with-one-responsibility}

Een klasse bezit één samenhangend concept en de bijbehorende invarianten. Houd data privé en maak een smalle interface beschikbaar. Splits klassen die opslag, prijsbepaling, persistentie of presentatie vermengen. [Samenhang boven omvang](../core/structure.md) beslist, niet het aantal regels.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Scheiding van header en bron {#pl-cpp-006--header-and-source-split}

Declareer interfaces in een `.hpp`-header en definieer ze in een bijbehorende `.cpp`. Elke header gebruikt `#pragma once` of klassieke include guards en bevat nooit `using namespace`, dat namen laat doorlekken naar elk bestand dat de header insluit.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Mapdichtheid {#pl-cpp-007--folder-density}

Een bronmap bevat standaard maximaal **10 handmatig onderhouden bestanden voor productie** (`.hpp` en `.cpp` tellen allebei mee). Tests, gegenereerde code en gevendorde code tellen niet mee. Splits boven die drempel langs echte verantwoordelijkheidsgrenzen, nooit in zinloze geneste mappen.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Tooling dwingt de basislijn af {#pl-cpp-008--tooling-enforces-the-baseline}

Formatteer met `clang-format`, lint met `clang-tidy` en compileer met `-Wall -Wextra -Werror`. Waarschuwingen zijn defecten, geen suggesties.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
