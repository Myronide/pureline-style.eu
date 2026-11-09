# Pureline Code Style

The Pureline 1.7 coding standard, organized by topic and language. Start with the [overview](overview.md), read the shared rules, then apply the relevant language profile.

**Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Cohesión sobre el tamaño.**

## Cómo aplicar esta guía

- Las reglas compartidas se aplican donde sea que el idioma los apoye de forma natural.
- La sintaxis de lenguaje nativo y las excepciones explícitas de perfil tienen prioridad. Por ejemplo, Crystal permite simples protectores post-fix, Rust permite `let ... else` y sigue oxidfmt, Novus utiliza `pureline:allow-else` para las ramas `else` justificadas, y Emvus permite semicolons opcionales.
- El perfil React está situado encima de los perfiles JavaScript y TypeScript.?? Aplica los tres juntos para los archivos `.tsx` / `.jsx`.
- TypeScript hereda el perfil JavaScript además de sus propias reglas.
- Función y rangos de tamaño de clase son heurística revisión. Mantengan la lógica cohesiva unida; el recuento de líneas por sí solo no es una violación.
- Preservar los ID de regla estable en revisiones y diagnósticos. Vea el [modelo de herramientas](tooling.md).

## Reglas compartidas

|Guía|Sumario|
|---|---|
|[Principios básicos](core/principles.md)| `PL-CORE-001`–`PL-CORE-022` |
|[Flujo de control](core/control-flow.md)|Cláusulas de protección, errores tempranos, bloqueos explícitos, evitando `else` innecesarios|
|[Naming](core/naming.md)|Nombres significativos y convenciones locales|
|[Funciones](core/functions.md)|Una sola responsabilidad y orientación sobre el tamaño|
|[Clases y módulos](core/structure.md)|Límites de responsabilidad, densidad de carpetas, cohesión sobre tamaño|
|[Formación](core/formatting.md)|Llamadas compactas y agrupamiento vertical significativo|
|[Comentarios](core/comments.md)|Explicar por qué es necesario un comportamiento inusual|
|[Arquitectura](core/architecture.md)|Abstraciones justificadas, dirección de dependencia, cesiones explícitas|
|[Estado y efectos secundarios](core/state-and-side-effects.md)|Efectos Viziales y mutación intencional|
|[Rendimiento](core/performance.md)|Optimización deliberada de los caminos calientes|

## Normas específicas para los idiomas

|Perfil|ID de las reglas|Orientación especial|
|---|---|---|
|[Java](languages/java.md)| `PL-JAVA-001`–`PL-JAVA-010` |Registros, `I`-prefijo r, manejo nulo, concurrencia, simetría del ciclo de vida|
|[JavaScript](languages/javascript.md)| `PL-JS-001`–`PL-JS-007` |Brazos, semicolons, `const`, async/await, callbacks|
|[TypeScript](languages/typescript.md)| `PL-TS-001`–`PL-TS-007` |Sucesiones de JavaScript, tipos explícitos o inferidos, `unknown`, < > y sindicatos|
|[Ir](languages/go.md)| `PL-GO-001`–`PL-GO-009` |Guardias de error, nombre ñactic, pequeño consumidor, `defer`, goroutines|
|[Crystal](languages/crystal.md)| `PL-CR-001`–`PL-CR-008` |Guardas de postfix, snake_case, inferencia, manejo de nil, macros|
|[Emerald](languages/emerald.md)| `PL-EMS-001`–`PL-EMS-012` |`.ems`, `namespace`/`use`, semicolons, clases de datos, macros AST, Flujo|
|[Emvus](languages/emvus.md)| `PL-EV-001`–`PL-EV-018` |`.ev`, `method<Type>`, `where`, Resultado, `scoped`, ciclos de vida de tareas; diseño de lenguaje previsto|
|[Rust](languages/rust.md)| `PL-RS-001`–`PL-RS-024` |Propiedad, Resultado/Opción, coincidencia de patrones, rustfmt, RAII, async y FFI, tipos de error, pelusas centrales, seguridad de cancelación, colocación de pruebas|
|[Novus](languages/novus.md)| `PL-NV-001`–`PL-NV-013` |`.nv` / `.nvh`, `final`/`var`, `construct()`, `pureline:allow-else`, envases e importaciones, componentes `.nvh`, contenido de `.nvmd` Markdown|
|[Reacción](languages/react.md)| `PL-REACT-001`–`PL-REACT-014` |Reaccionar 19 con TypeScript estricto: Guards, ganchos, efectos, accesorios, contexto, llaves, renderizado puro, enrutamiento|
|[Python](languages/python.md)| `PL-PY-001`–`PL-PY-012` |Nombre PEP 8, cláusulas de guardia, consejos de tipo, excepciones específicas, clases de datos, ruff y chequeras de tipo|
|[QML](languages/qml.md)| `PL-QML-001`–`PL-QML-011` |Qt 6 componentes, `required property`, fijaciones, tokens temáticos, diseños, qmllint|
|[Astro](languages/astro.md)| `PL-AS-001`–`PL-AS-009` |frontmatter tecleado, estático por defecto, islas explícitas, estilos con alcance, colecciones de contenido|
|[HTML](languages/html.md)| `PL-HTML-001`–`PL-HTML-009` |Elementos semánticos, estructura de un encabezado, etiquetas, texto alt, cabeza de documento, validación|
|[CSS](languages/css.md)| `PL-CSS-001`–`PL-CSS-012` |Tokens, capas en cascada, baja especificidad, sin `!important`, propiedades lógicas, movimiento reducido|
| [C#](languages/csharp.md) | `PL-CS-001`–`PL-CS-009` |Nombre, tipos de referencia anulables, registros, `using`, async con Task, LINQ, formato dotnet|
|[Angular](languages/angular.md)| `PL-NG-001`–`PL-NG-009` |Componentes independientes, señales, OnPush, formularios mecanografiados, `ng lint`|
|[80](languages/vue.md)| `PL-VUE-001`–`PL-VUE-010` |`<script setup lang="ts">`, atrezzos, computarizados, composable, Pinia|
|[GDScript](languages/gdscript.md)| `PL-GD-001`–`PL-GD-010` |Tipografía estática, `@export`, `@onready`, señales, gdformat y gdlint|
| [C](languages/c.md) | `PL-C-001`–`PL-C-009` |Propiedad implícita, códigos de error, cláusulas de guardia, formato de clang y tintineo|
| [C++](languages/cpp.md) | `PL-CPP-001`–`PL-CPP-008` |RAII, propiedad única, const por defecto, `std::expected`, encabezado dividido|
|[Lua](languages/lua.md)| `PL-LUA-001`–`PL-LUA-012` |Local por defecto, tablas de módulo, comprobaciones nil explícitas, luacheck y StyLua|
|[Dart](languages/dart.md)| `PL-DART-001`–`PL-DART-012` |`final` y `const`, seguridad de sonido nulo, parámetros nombrados, tipos sellados|
|[Flutter](languages/flutter.md)| `PL-FLUT-001`–`PL-FLUT-010` |Pequeños métodos de construcción, widgets de const, un enfoque de estado, cheques montados|
| [V](languages/v.md) | `PL-V-001`–`PL-V-010` |Inmutable por defecto, tipos de resultados, `or {}`, tipos de opciones, `v fmt`|
|[Swift](languages/swift.md)| `PL-SW-001`–`PL-SW-011` |`let` sobre `var`, let de guardia, tipos de valor, control de acceso, formato rápido y SwiftLint|
|[Kotlin](languages/kotlin.md)| `PL-KT-001`–`PL-KT-011` |`val` sobre `var`, clases de datos, tipos sellados, seguridad nula, ktlint y detekt|

Véase también la [vista general del perfil del idioma](languages/README.md) y [requisitos de herramientas](tooling.md).

## Especificación y mantenimiento

Estos archivos de temas preservan las reglas, ejemplos, cualificaciones e IDs estables de [la Especificación de Pureline 1.7](../../PURELINE_SPECIFICATION_1.7.md), la fuente de referencia versionado. Los números de sección se omiten aquí para que cada tema pueda leerse independientemente; los ID de reglas no cambian.

Al revisar la guía, mantenga la especificación original y el archivo de tema correspondiente consistente. No renumérese los ID de reglas existentes ni convierta la heurística de revisión en violaciones graves.
