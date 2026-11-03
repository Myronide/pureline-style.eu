# Estilo de código C++

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de C++ {#c-profile}

Pureline C++ sigue los modismos del **C++17 y C++20 modernos**. La propiedad reside en los tipos, los destructores liberan los recursos y los fallos se devuelven como un valor.

### PL-CPP-001 — RAII y propiedad única {#pl-cpp-001--raii-and-unique-ownership}

Cada recurso pertenece a un objeto cuyo destructor lo libera. Usa `std::unique_ptr` (mediante `std::make_unique`) por defecto; `std::shared_ptr` solo para una propiedad realmente compartida. `new` y `delete` en bruto no aparecen en el código de aplicación.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Const por defecto {#pl-cpp-002--const-by-default}

Marca los valores como `const` salvo que deban cambiar, y usa `constexpr` para las constantes en tiempo de compilación. Pasa los argumentos de solo lectura por `const &`; toma por valor solo cuando la función los almacene o los consuma.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Guard clauses y `std::expected` {#pl-cpp-003--guard-clauses-and-stdexpected}

Valida al principio de la función y mantén el camino de éxito en la sangría base, siguiendo el [flujo de control](../core/control-flow.md). Usa `std::optional<T>` para la ausencia y `std::expected<T, E>` para los fallos que quien llama deba tratar (C++23; los proyectos en C++17/20 usan un equivalente como `tl::expected`). No devuelvas nunca códigos de error mediante parámetros de salida.

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

### PL-CPP-004 — `for` basado en rangos {#pl-cpp-004--range-based-for}

Prefiere el `for` basado en rangos a los bucles con índice. Usa un algoritmo estándar solo cuando su nombre exprese la intención con más claridad que un bucle.

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

### PL-CPP-005 — Clases pequeñas con una única responsabilidad {#pl-cpp-005--small-classes-with-one-responsibility}

Una clase es dueña de un concepto coherente y de sus invariantes. Mantén los datos privados y expón una interfaz estrecha. Divide las clases que mezclen almacenamiento, precios, persistencia o presentación. Decide la [cohesión antes que tamaño](../core/structure.md), no un número de líneas.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Separación entre cabecera y fuente {#pl-cpp-006--header-and-source-split}

Declara las interfaces en una cabecera `.hpp` y defínelas en un `.cpp` correspondiente. Cada cabecera usa `#pragma once` o las protecciones de inclusión clásicas, y nunca contiene `using namespace`, que filtra nombres a todos los que la incluyen.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Densidad de carpetas {#pl-cpp-007--folder-density}

Una carpeta de código fuente contiene como máximo **10 archivos de producción mantenidos a mano** (cuentan tanto los `.hpp` como los `.cpp`) por defecto. Los tests, el código generado y el código incluido (vendored) no cuentan. Superado ese umbral, divide según los límites de responsabilidad reales, nunca en carpetas anidadas sin sentido.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Las herramientas hacen cumplir la base {#pl-cpp-008--tooling-enforces-the-baseline}

Da formato con `clang-format`, haz lint con `clang-tidy` y compila con `-Wall -Wextra -Werror`. Las advertencias son defectos, no sugerencias.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
