# C++ Code Style

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe] (../core/structure.md) gilt in allen Bereichen.

## C++ Profile

Pureline C++ follows **modern C++17 and C++20** idioms. Ownership lives in types, resources are released by destructors, and failure is returned as a value.

### PL-CPP-001 — RAII and Unique Ownership

Every resource is owned by an object whose destructor releases it. Use `std::unique_ptr` (via `std::make_unique`) by default; `std::shared_ptr` only for genuinely shared ownership. Raw `new` and `delete` do not appear in application code.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Const by Default

Mark values `const` unless they must change, and use `constexpr` for compile-time constants. Pass read-only arguments by `const &`; take by value only when the function stores or consumes them.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard Clauses and `std::expected`

Validate at the top of the function and keep the success path at base indentation, following [control flow](../core/control-flow.md). Use `std::optional<T>` for absence and `std::expected<T, E>` for failures the caller must handle (C++23; C++17/20 projects use an equivalent such as `tl::expected`). Never return error codes through out parameters.

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

### PL-CPP-004 — Range-Based `for`

Prefer range-based `for` over index loops. Use a standard algorithm only when its name states the intent more clearly than a loop.

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

### PL-CPP-005 — Small Classes with One Responsibility

A class owns one coherent concept and its invariants. Keep data private and expose a narrow interface. Split classes that mix storage, pricing, persistence, or presentation. [Cohesion over Size](../core/structure.md) decides, not a line count.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Header and Source Split

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
