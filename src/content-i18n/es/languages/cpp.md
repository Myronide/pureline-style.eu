# Estilo de código C++

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil C++

Pureline C++ sigue a **modern C++17 y C++20** idioms. La propiedad vive en tipos, los recursos son liberados por los machistas y el fracaso es devuelto como valor.

### PL-CPP-001 — RAI y propiedad única

Cada recurso es propiedad de un objeto cuyo objetivo es liberarlo. Utilice `std::unique_ptr` (vía `std::make_unique`) por defecto; `std::shared_ptr` sólo para la propiedad compartida genuinamente. Raw `new` y `delete` no aparecen en el código de aplicación.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

### PL-CPP-002 — Const por defecto

Marcar valores `const` a menos que deban cambiar, y utilizar `constexpr` para las constantes de tiempo de compilación. Pase los argumentos de sólo lectura por `const &`; tome por valor sólo cuando la función los almacena o los consume.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

### PL-CPP-003 — Cláusulas de protección y `std::expected`

Validar en la parte superior de la función y mantener la ruta de éxito en la sangría de la base, siguiendo [flujo de control](../core/control-flow.md). Utilice `std::optional<T>` para ausencias y `std::expected<T, E>` para fallos que el llamante debe manejar (los proyectos C++23; C++17/20 utilizan un equivalente como `tl::expected`). Nunca devuelva códigos de error a través de parámetros.

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

### PL-CPP-004 — `for` basado en el rango

Prefiere los bucles basados en rango `for` sobre los índices. Use un algoritmo estándar sólo cuando su nombre indique la intent más claramente que un bucle.

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

Prefiere `const auto&` para la iteración de sólo lectura cuando el tipo de elemento es
claro del código circundante.

```text
− Explicit element type           │ ✓ Pureline
for (const User& user : users) {  │ for (const auto& user : users) {
    print(user.name);             │     print(user.name);
}                                 │ }
```

### PL-CPP-005: clases pequeñas con una sola responsabilidad

Una clase posee un concepto coherente y sus invariantes. Mantenga los datos privados y exponga una interfaz estrecha. Dividir clases que midan almacenamiento, precios, persistencia o presentación. [Cohesión sobre Tamaño](../core/structure.md) decide, no un recuento de líneas.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

### PL-CPP-006 — Encabezado y división de fuentes

Declarar rúbrica en una cabecera `.hpp` y definirlos en una `.cpp` que coincida. Cada cabecera utiliza `#pragma once` o clásico incluyen guardias, y nunca contiene `using namespace`, que filtra nombres en cada inclusor.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

### PL-CPP-007 — Densidad de la carpeta

Una carpeta de origen contiene como máximo archivos de producción **10 mantenidos a mano** (`.hpp` y `.cpp` ambos cuentan) de forma predeterminada. Las pruebas, código generado y código de proveedor no cuentan. Pasado ese umbral, dividido a lo largo de límites de responsabilidad reales, nunca en carpetas sin sentido anidadas.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

### PL-CPP-008 — Herramientas hace cumplir la línea de base

Formatee con `clang-format`, pelusa con `clang-tidy` y compile con `-Wall -Wextra -Werror`. Las advertencias son defectos, no sugerencias.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```
