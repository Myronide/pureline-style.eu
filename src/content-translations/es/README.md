# Estilo de código Pureline

El estándar de código Pureline 1.7, organizado por tema y lenguaje. Empieza por la [visión general](overview.md), lee las reglas compartidas y aplica después el perfil del lenguaje que corresponda.

**Flujo lineal. Intención explícita. Ruido mínimo. Unidades pequeñas. Responsabilidad clara. Cohesión antes que tamaño.**

## Cómo aplicar esta guía {#how-to-apply-this-guide}

- Las reglas compartidas se aplican siempre que el lenguaje lo permita de forma natural.
- La sintaxis propia del lenguaje y las excepciones explícitas de cada perfil tienen prioridad. Por ejemplo, Crystal admite guardas postfijas simples, Rust admite `let ... else` y sigue rustfmt, Novus usa `pureline:allow-else` para las ramas `else` justificadas, y Emvus admite puntos y coma opcionales.
- El perfil de React se apoya en los perfiles de JavaScript y TypeScript. Aplica los tres a la vez en los archivos `.tsx` / `.jsx`.
- TypeScript hereda el perfil de JavaScript además de sus propias reglas.
- Los rangos de tamaño de funciones y clases son heurísticas de revisión. Mantén junta la lógica cohesiva; el número de líneas por sí solo no es una infracción.
- Conserva los ID de regla estables en las revisiones y los diagnósticos. Consulta el [modelo de herramientas](tooling.md).

## Reglas compartidas {#shared-rules}

| Guía | Contenido |
|---|---|
| [Principios básicos](core/principles.md) | `PL-CORE-001`–`PL-CORE-022` |
| [Flujo de control](core/control-flow.md) | Guard clauses, errores tempranos, bloques explícitos, evitar `else` innecesarios |
| [Nombres](core/naming.md) | Nombres significativos y convenciones locales |
| [Funciones](core/functions.md) | Una sola responsabilidad y pautas de tamaño |
| [Clases y módulos](core/structure.md) | Límites de responsabilidad, densidad de carpetas, cohesión antes que tamaño |
| [Formato](core/formatting.md) | Llamadas compactas y agrupación vertical con sentido |
| [Comentarios](core/comments.md) | Explicar por qué es necesario un comportamiento inusual |
| [Arquitectura](core/architecture.md) | Abstracciones justificadas, dirección de las dependencias, dependencias explícitas |
| [Estado y efectos secundarios](core/state-and-side-effects.md) | Efectos visibles y mutación intencionada |
| [Rendimiento](core/performance.md) | Optimización deliberada de las rutas críticas |

## Reglas específicas por lenguaje {#language-specific-rules}

| Perfil | ID de reglas | Pautas particulares |
|---|---|---|
| [Java](languages/java.md) | `PL-JAVA-001`–`PL-JAVA-010` | Records, interfaces con prefijo `I`, manejo de null, concurrencia, simetría del ciclo de vida |
| [JavaScript](languages/javascript.md) | `PL-JS-001`–`PL-JS-007` | Llaves, puntos y coma, `const`, async/await, callbacks |
| [TypeScript](languages/typescript.md) | `PL-TS-001`–`PL-TS-007` | Herencia de JavaScript, tipos explícitos o inferidos, `unknown`, interfaces y uniones |
| [Go](languages/go.md) | `PL-GO-001`–`PL-GO-009` | Guardas de error, nombres idiomáticos, interfaces pequeñas del lado del consumidor, `defer`, goroutines |
| [Crystal](languages/crystal.md) | `PL-CR-001`–`PL-CR-008` | Guardas postfijas, snake_case, inferencia, manejo de nil, macros |
| [Emerald](languages/emerald.md) | `PL-EMS-001`–`PL-EMS-012` | `.ems`, `namespace`/`use`, puntos y coma, clases de datos, macros AST, Flow |
| [Emvus](languages/emvus.md) | `PL-EV-001`–`PL-EV-018` | `.ev`, `method<Type>`, `where`, Result, `scoped`, ciclos de vida de tareas; diseño de lenguaje previsto |
| [Rust](languages/rust.md) | `PL-RS-001`–`PL-RS-024` | Ownership, Result/Option, pattern matching, rustfmt, RAII, async y FFI, tipos de error, lints centralizados, seguridad ante cancelación, ubicación de los tests |
| [Novus](languages/novus.md) | `PL-NV-001`–`PL-NV-013` | `.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, paquetes e imports, componentes `.nvh`, contenido Markdown `.nvmd` |
| [React](languages/react.md) | `PL-REACT-001`–`PL-REACT-014` | React 19 con TypeScript estricto: guardas, hooks, efectos, props, contexto, keys, renderizado puro, enrutamiento |
| [Python](languages/python.md) | `PL-PY-001`–`PL-PY-012` | Nombres según PEP 8, guard clauses, type hints, excepciones específicas, dataclasses, ruff y verificadores de tipos |
| [QML](languages/qml.md) | `PL-QML-001`–`PL-QML-011` | Componentes de Qt 6, `required property`, bindings, tokens de Theme, layouts, qmllint |
| [Astro](languages/astro.md) | `PL-AS-001`–`PL-AS-009` | Frontmatter tipado, estático por defecto, islas explícitas, estilos con ámbito, colecciones de contenido |
| [HTML](languages/html.md) | `PL-HTML-001`–`PL-HTML-009` | Elementos semánticos, una única estructura de encabezados, etiquetas, texto alternativo, cabecera del documento, validación |
| [CSS](languages/css.md) | `PL-CSS-001`–`PL-CSS-012` | Tokens, capas de cascada, baja especificidad, sin `!important`, propiedades lógicas, movimiento reducido |
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` | Nombres, tipos de referencia anulables, records, `using`, async con Task, LINQ, dotnet format |
| [Angular](languages/angular.md) | `PL-NG-001`–`PL-NG-009` | Componentes standalone, signals, OnPush, formularios tipados, `ng lint` |
| [Vue](languages/vue.md) | `PL-VUE-001`–`PL-VUE-010` | `<script setup lang="ts">`, props tipadas, computed, composables, Pinia |
| [GDScript](languages/gdscript.md) | `PL-GD-001`–`PL-GD-010` | Tipado estático, `@export`, `@onready`, señales, gdformat y gdlint |
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` | Propiedad explícita del heap, códigos de error, guard clauses, clang-format y clang-tidy |
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` | RAII, propiedad única, const por defecto, `std::expected`, separación de cabeceras |
| [Lua](languages/lua.md) | `PL-LUA-001`–`PL-LUA-012` | Local por defecto, tablas de módulo, comprobaciones explícitas de nil, luacheck y StyLua |
| [Dart](languages/dart.md) | `PL-DART-001`–`PL-DART-012` | `final` y `const`, null safety sólida, parámetros con nombre, tipos sellados |
| [Flutter](languages/flutter.md) | `PL-FLUT-001`–`PL-FLUT-010` | Métodos build pequeños, widgets const, un único enfoque de estado, comprobaciones de mounted |
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` | Inmutable por defecto, tipos de resultado, `or {}`, tipos option, `v fmt` |
| [Swift](languages/swift.md) | `PL-SW-001`–`PL-SW-011` | `let` antes que `var`, guard let, tipos de valor, control de acceso, swift-format y SwiftLint |
| [Kotlin](languages/kotlin.md) | `PL-KT-001`–`PL-KT-011` | `val` antes que `var`, data classes, tipos sellados, null safety, ktlint y detekt |

Consulta también la [visión general de los perfiles de lenguaje](languages/README.md) y los [requisitos de herramientas](tooling.md).

## Especificación y mantenimiento {#specification-and-maintenance}

Estos archivos temáticos conservan las reglas, los ejemplos, las salvedades y los ID estables de la [Especificación Pureline 1.7](../../PURELINE_SPECIFICATION_1.7.md), la fuente de referencia versionada. Aquí se omiten los números de sección para que cada tema pueda leerse de forma independiente; los ID de las reglas no cambian.

Al revisar las pautas, mantén coherentes la especificación original y el archivo temático correspondiente. No renumeres los ID de regla existentes ni conviertas heurísticas de revisión en infracciones estrictas.
