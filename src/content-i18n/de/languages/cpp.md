# C++ Code Style

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## C++ Profile

Pureline C++ folgt **modern C++17 und C++20** idioms. Eigentum lebt in Typen, Ressourcen werden von Destruktoren freigegeben, und Misserfolg wird als Wert zurückgegeben.

### PL-CPP-001 — RAII und einzigartige Eigentümerschaft

Jede Ressource ist im Besitz eines Objekts, dessen Destruktor es freigibt. Verwenden Sie `std::unique_ptr` (über `std::make_unique`) standardmäßig; `std::shared_ptr` nur für wirklich geteiltes Eigentum. Raw `new` und `delete` erscheinen nicht im Anwendungscode.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Standardmäßig konst

Markieren Sie Werte `const`, es sei denn, sie müssen sich ändern, und verwenden Sie `constexpr` für Compil-Zeitkonstanten. Nur-Lese-Argumente von `const &` übergeben; nur dann werten, wenn die Funktion sie speichert oder verbraucht.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Schutzklauseln und `std::expected`

Validierung an der Spitze der Funktion und halten Sie den Erfolgspfad bei der Basiseinrückung, nach [Kontrollfluss](../core/control-flow.md). Verwenden Sie `std::optional<T>` für Abwesenheit und `std::expected<T, E>` für Ausfälle, die der Anrufer handhaben muss (C++23; C++17/20 Projekte verwenden ein Äquivalent wie `tl::expected`). Fehlercodes nie durch Parameter zurückgeben.

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

### PL-CPP-004 — auf Reichweiten basierendes `for`

Bevorzugen Sie Range-basierte `for` über Indexschleifen... Verwenden Sie einen Standardalgorithmus nur, wenn sein Name die Absicht klarer als eine Schleife aussagt.

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

Bevorzugen Sie `const auto&` für Lese-Nur-Iteration, wenn der Elementtyp
vom umgebenden Code frei.

```text
− Explicit element type           │ ✓ Pureline
for (const User& user : users) {  │ for (const auto& user : users) {
    print(user.name);             │     print(user.name);
}                                 │ }
```

### PL-CPP-005 — Kleine Klassen mit einer Verantwortung

Eine Klasse besitzt ein kohärentes Konzept und seine Invarianten. Daten privat halten und eine schmale Schnittstelle freilegen. Split Klassen, die Speicher, Preisgestaltung, Persistenz oder Präsentation mischen. [Kohäsion über Größe](../core/structure.md) entscheidet, keine Zeilenzahl.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Kopfzeile und Quelle Split

Declare interfaces in a `.hpp` header and define them in a matching `.cpp`. Every header uses `#pragma once` or classic include guards, and never contains `using namespace`, which leaks names into every includer.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Ordnerdichte

A source folder holds at most **10 hand-maintained production files** (`.hpp` and `.cpp` both count) by default. Tests, generated code, and vendored code do not count. Past that threshold, split along real responsibility boundaries, never into meaningless nested folders.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Tooling Enforces the Baseline

Format with `clang-format`, lint with `clang-tidy`, and compile with `-Wall -Wextra -Werror`. Warnings are defects, not suggestions.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
