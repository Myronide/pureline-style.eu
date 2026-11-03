# C++ Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil C++ {#c-profile}

Pureline C++ opiera się na idiomach **nowoczesnego C++17 i C++20**. Własność mieszka w typach, zasoby zwalniają destruktory, a awaria jest zwracana jako wartość.

### PL-CPP-001 — RAII i wyłączna własność {#pl-cpp-001--raii-and-unique-ownership}

Każdy zasób należy do obiektu, którego destruktor go zwalnia. Domyślnie używaj `std::unique_ptr` (przez `std::make_unique`); `std::shared_ptr` tylko dla rzeczywiście współdzielonej własności. Surowe `new` i `delete` nie pojawiają się w kodzie aplikacji.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Domyślnie const {#pl-cpp-002--const-by-default}

Wartości oznaczaj jako `const`, chyba że muszą się zmieniać, a dla stałych czasu kompilacji używaj `constexpr`. Argumenty tylko do odczytu przekazuj przez `const &`; przez wartość przyjmuj tylko wtedy, gdy funkcja je przechowuje lub zużywa.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard clauses i `std::expected` {#pl-cpp-003--guard-clauses-and-stdexpected}

Waliduj na początku funkcji i trzymaj ścieżkę sukcesu na bazowym poziomie wcięcia, zgodnie z [przepływem sterowania](../core/control-flow.md). Dla braku wartości używaj `std::optional<T>`, a dla awarii, które wywołujący musi obsłużyć, `std::expected<T, E>` (C++23; projekty w C++17/20 używają odpowiednika, takiego jak `tl::expected`). Nigdy nie zwracaj kodów błędów przez parametry wyjściowe.

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

### PL-CPP-004 — Pętla `for` oparta na zakresie {#pl-cpp-004--range-based-for}

Preferuj pętlę `for` opartą na zakresie zamiast pętli indeksowych. Algorytmu standardowego używaj tylko wtedy, gdy jego nazwa wyraża zamiar jaśniej niż pętla.

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

### PL-CPP-005 — Małe klasy z jedną odpowiedzialnością {#pl-cpp-005--small-classes-with-one-responsibility}

Klasa jest właścicielem jednego spójnego pojęcia i jego niezmienników. Dane utrzymuj prywatne i udostępniaj wąski interfejs. Dziel klasy, które mieszają przechowywanie, wycenę, trwałość lub prezentację. Rozstrzyga [Spójność ponad rozmiar](../core/structure.md), a nie liczba linii.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Podział na nagłówek i źródło {#pl-cpp-006--header-and-source-split}

Interfejsy deklaruj w nagłówku `.hpp`, a definiuj w odpowiadającym mu `.cpp`. Każdy nagłówek używa `#pragma once` lub klasycznych include guardów i nigdy nie zawiera `using namespace`, które przecieka nazwami do każdego pliku, który go dołącza.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Gęstość folderów {#pl-cpp-007--folder-density}

Folder źródłowy domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików produkcyjnych** (liczą się zarówno `.hpp`, jak i `.cpp`). Testy, kod generowany i kod vendorowany nie są wliczane. Po przekroczeniu progu dziel wzdłuż rzeczywistych granic odpowiedzialności, nigdy na bezsensowne zagnieżdżone foldery.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Narzędzia egzekwują poziom bazowy {#pl-cpp-008--tooling-enforces-the-baseline}

Formatuj za pomocą `clang-format`, lintuj za pomocą `clang-tidy` i kompiluj z `-Wall -Wextra -Werror`. Ostrzeżenia są defektami, a nie sugestiami.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
