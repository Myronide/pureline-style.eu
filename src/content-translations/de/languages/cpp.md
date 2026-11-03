# C++ Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## C++-Profil {#c-profile}

Pureline C++ folgt den Idiomen von **modernem C++17 und C++20**. Ownership steckt in den Typen, Ressourcen werden von Destruktoren freigegeben, und Fehler werden als Wert zurückgegeben.

### PL-CPP-001 — RAII und eindeutige Ownership {#pl-cpp-001--raii-and-unique-ownership}

Jede Ressource gehört einem Objekt, dessen Destruktor sie freigibt. Verwende standardmäßig `std::unique_ptr` (über `std::make_unique`); `std::shared_ptr` nur für wirklich geteilte Ownership. Rohes `new` und `delete` kommen im Anwendungscode nicht vor.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Standardmäßig const {#pl-cpp-002--const-by-default}

Markiere Werte als `const`, solange sie sich nicht ändern müssen, und verwende `constexpr` für Konstanten zur Compile-Zeit. Übergib schreibgeschützte Argumente per `const &`; nimm sie nur dann per Wert, wenn die Funktion sie speichert oder verbraucht.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard Clauses und `std::expected` {#pl-cpp-003--guard-clauses-and-stdexpected}

Validiere am Anfang der Funktion und halte den Erfolgspfad auf der Basis-Einrückung, gemäß dem [Kontrollfluss](../core/control-flow.md). Verwende `std::optional<T>` für Abwesenheit und `std::expected<T, E>` für Fehler, die der Aufrufer behandeln muss (C++23; Projekte mit C++17/20 verwenden ein Äquivalent wie `tl::expected`). Gib Fehlercodes niemals über Out-Parameter zurück.

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

### PL-CPP-004 — Bereichsbasiertes `for` {#pl-cpp-004--range-based-for}

Bevorzuge das bereichsbasierte `for` gegenüber Index-Schleifen. Verwende einen Standardalgorithmus nur dann, wenn sein Name die Absicht klarer ausdrückt als eine Schleife.

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

### PL-CPP-005 — Kleine Klassen mit einer Verantwortung {#pl-cpp-005--small-classes-with-one-responsibility}

Eine Klasse besitzt ein kohärentes Konzept und dessen Invarianten. Halte Daten privat und stelle eine schmale Schnittstelle bereit. Teile Klassen auf, die Speicherung, Preisberechnung, Persistenz oder Darstellung vermischen. [Kohäsion vor Größe](../core/structure.md) entscheidet, nicht die Zeilenzahl.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Aufteilung in Header und Quelldatei {#pl-cpp-006--header-and-source-split}

Deklariere Schnittstellen in einem `.hpp`-Header und definiere sie in einer passenden `.cpp`. Jeder Header verwendet `#pragma once` oder klassische Include-Guards und enthält niemals `using namespace`, das Namen in jede einbindende Datei hineinträgt.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Ordnerdichte {#pl-cpp-007--folder-density}

Ein Quellordner enthält standardmäßig höchstens **10 von Hand gepflegte produktive Dateien** (`.hpp` und `.cpp` zählen beide). Tests, generierter Code und eingebundener Fremdcode zählen nicht. Ab dieser Schwelle teile entlang echter Verantwortungsgrenzen auf, niemals in sinnlos verschachtelte Ordner.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Tooling erzwingt die Basis {#pl-cpp-008--tooling-enforces-the-baseline}

Formatiere mit `clang-format`, linte mit `clang-tidy` und kompiliere mit `-Wall -Wextra -Werror`. Warnungen sind Defekte, keine Empfehlungen.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
