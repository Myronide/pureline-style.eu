# Stile del codice C++

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo C++ {#c-profile}

Pureline C++ segue gli idiomi del **C++17 e C++20 moderni**. L'ownership vive nei tipi, le risorse sono rilasciate dai distruttori e il fallimento viene restituito come valore.

### PL-CPP-001 — RAII e ownership unico {#pl-cpp-001--raii-and-unique-ownership}

Ogni risorsa è posseduta da un oggetto il cui distruttore la rilascia. Usa `std::unique_ptr` (tramite `std::make_unique`) per impostazione predefinita; `std::shared_ptr` solo per un'ownership davvero condivisa. `new` e `delete` grezzi non compaiono nel codice applicativo.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Const per impostazione predefinita {#pl-cpp-002--const-by-default}

Contrassegna i valori come `const`, a meno che debbano cambiare, e usa `constexpr` per le costanti a tempo di compilazione. Passa gli argomenti di sola lettura per `const &`; prendi per valore solo quando la funzione li memorizza o li consuma.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard clause e `std::expected` {#pl-cpp-003--guard-clauses-and-stdexpected}

Valida all'inizio della funzione e mantieni il percorso di successo all'indentazione di base, seguendo il [controllo di flusso](../core/control-flow.md). Usa `std::optional<T>` per l'assenza e `std::expected<T, E>` per i fallimenti che il chiamante deve gestire (C++23; i progetti C++17/20 usano un equivalente come `tl::expected`). Non restituire mai codici di errore tramite parametri di output.

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

### PL-CPP-004 — `for` basato su intervallo {#pl-cpp-004--range-based-for}

Preferisci il `for` basato su intervallo ai cicli con indice. Usa un algoritmo standard solo quando il suo nome dichiara l'intento più chiaramente di un ciclo.

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

### PL-CPP-005 — Classi piccole con una sola responsabilità {#pl-cpp-005--small-classes-with-one-responsibility}

Una classe possiede un unico concetto coerente e le sue invarianti. Mantieni privati i dati ed esponi un'interfaccia ristretta. Dividi le classi che mescolano archiviazione, calcolo dei prezzi, persistenza o presentazione. A decidere è la [Coesione prima della dimensione](../core/structure.md), non un numero di righe.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Separazione tra header e sorgente {#pl-cpp-006--header-and-source-split}

Dichiara le interfacce in un header `.hpp` e definiscile in un `.cpp` corrispondente. Ogni header usa `#pragma once` o i classici include guard e non contiene mai `using namespace`, che fa trapelare i nomi in ogni file che lo include.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Densità delle cartelle {#pl-cpp-007--folder-density}

Una cartella sorgente contiene al massimo **10 file di produzione mantenuti a mano** (contano sia `.hpp` sia `.cpp`) per impostazione predefinita. Test, codice generato e codice incluso (vendored) non contano. Oltre quella soglia, dividi lungo reali confini di responsabilità, mai in cartelle annidate prive di senso.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Gli strumenti impongono la base minima {#pl-cpp-008--tooling-enforces-the-baseline}

Formatta con `clang-format`, fai il lint con `clang-tidy` e compila con `-Wall -Wextra -Werror`. Gli avvisi sono difetti, non suggerimenti.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
