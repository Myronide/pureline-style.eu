# Estilo de código Rust

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Rust {#rust-profile}

Pureline Rust sigue el **Rust idiomático** en lugar de traducir las convenciones de Java a la sintaxis de Rust. El ownership, los lifetimes, los enums, el pattern matching y el sistema de tipos son puntos fuertes del lenguaje, no obstáculos que haya que sortear.

### PL-RS-001 — Nombres y visibilidad idiomáticos {#pl-rs-001--idiomatic-naming-and-visibility}

- Tipos, traits y variantes de enum: `PascalCase`.
- Funciones, métodos, módulos, campos y variables locales: `snake_case`.
- Constantes y statics: `SCREAMING_SNAKE_CASE`.
- Crates: nombres descriptivos en `snake_case` (los nombres de paquete de Cargo pueden llevar guiones).
- Los traits **no** heredan el prefijo `I` de Java. Prefiere `Storage`, no `IStorage`.
- Mantén los elementos privados salvo que un consumidor real necesite una visibilidad mayor; prefiere `pub(crate)` cuando sea adecuado.
- Usa imports con `use` en lugar de repetir rutas largas totalmente cualificadas, salvo cuando la cualificación explícita resuelva una ambigüedad.

### PL-RS-002 — Guard clauses y flujo lineal {#pl-rs-002--guard-clauses-and-linear-flow}

Valida pronto y mantén el camino correcto en el nivel de sangría base.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Evita `else` después de una rama que ya hace return, break o continue. Se permite una **expresión** `if`/`else` para elegir entre dos valores cuando es más clara que las alternativas. `let ... else` es una **construcción de guarda preferida en Rust**, no una infracción del principio de evitar `else`.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Prefiere `Result`, `Option` y `?` {#pl-rs-003--prefer-result-option-and}

- Representa los fallos esperados con `Result<T, E>`.
- Representa la ausencia con `Option<T>`.
- Usa `?` para una propagación directa, y `map_err`/`ok_or_else` cuando el contexto del error realmente mejore.
- Usa `match` cuando los resultados necesiten un tratamiento distinto; evita las cadenas enrevesadas de combinadores.
- No descartes valores `Result` en silencio; decide si propagarlos, registrarlos, recuperarte o ignorarlos de forma deliberada con una explicación justificada.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Restringe `unwrap`, `expect` y `panic!` {#pl-rs-004--restrict-unwrap-expect-and-panic}

No uses nunca `unwrap()` ni `expect()` para fallos recuperables ordinarios en producción. Son aceptables ante invariantes documentadas que realmente no pueden violarse, y dentro del código de tests (módulos `#[cfg(test)]` y `tests/`), donde un pánico es el informe del fallo. `panic!` no es una estrategia normal de gestión de errores. Prefiere el tratamiento explícito a los fallos ocultos por indexaciones o conversiones sin comprobar.

### PL-RS-005 — Usa `match` y patrones para ramificar por estados reales {#pl-rs-005--use-match-and-patterns-for-real-state-branching}

Usa `match` exhaustivo para los enums y las alternativas con significado; usa `if let` o `let ... else` para el tratamiento simple de un único patrón. No fuerces `match` en comprobaciones booleanas ordinarias. Evita las ramas `_` amplias que enmascaran en silencio estados futuros cuando enumerar las variantes sería más claro.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — El ownership debe ser deliberado {#pl-rs-006--ownership-must-be-deliberate}

- Prefiere tomar prestado con `&T` o `&mut T` cuando no haga falta transferir el ownership.
- Acepta valores propios cuando el receptor realmente necesite el ownership.
- Minimiza la clonación; usa `.clone()` cuando su coste y su propósito en términos de ownership estén claros.
- Evita `Arc`, `Rc`, `Box` y envoltorios de mutabilidad interior innecesarios.
- Prefiere lifetimes cortos y límites de ownership explícitos; no luches contra el borrow checker con fugas artificiales ni con una propiedad compartida generalizada.

### PL-RS-007 — Inmutable por defecto {#pl-rs-007--immutable-by-default}

Usa `let` salvo que haga falta mutar. Mantén `let mut` local y con un ámbito reducido. Evita la mutabilidad interior como sustituto por defecto de un diseño de ownership normal. No crees globales mutables innecesarios.

### PL-RS-008 — Los traits requieren una abstracción real {#pl-rs-008--traits-require-a-real-abstraction}

Crea un trait para un comportamiento compartido real, un límite de API, una implementación intercambiable o un punto de sustitución para tests. No introduzcas traits solo para imitar las interfaces de Java o para crear capas de factory/manager. Prefiere métodos `impl` inherentes sencillos cuando solo haya una implementación concreta. Elige entre genéricos y trait objects según los requisitos reales de polimorfismo.

### PL-RS-009 — Cohesión antes que tamaño para `struct`, `impl` y módulos {#pl-rs-009--cohesion-over-size-for-struct-impl-and-modules}

`PL-STRUCT-003` se aplica a Rust como una **revisión de cohesión**, no como un límite fijo de líneas. Un `impl` o una máquina de estados cohesivos pueden ser largos. Divide según la responsabilidad independiente, no extrayendo traits, structs o archivos de forma mecánica. Evita los enormes cajones de sastre de `mod.rs` o `lib.rs` con contenido sin relación.

### PL-RS-010 — Densidad de módulos y archivos {#pl-rs-010--module-and-file-density}

Una carpeta de funcionalidad o de código fuente de Rust debe contener como máximo **10 archivos `.rs` de producción mantenidos a mano** por defecto. Los tests, el código generado, los bindings y los archivos que solo contienen metadatos no cuentan. `mod.rs`, `lib.rs` y `main.rs` cuentan cuando contienen lógica sustancial que se mantiene, no cuando solo sirven para declarar o reexportar módulos. Es un umbral de revisión: divide según los límites de responsabilidad reales, nunca en carpetas anidadas sin sentido.

Prefiere módulos explícitos con superficies públicas estrechas; mantén privada la implementación interna.

### PL-RS-011 — Usa Rustfmt como autoridad de formato {#pl-rs-011--use-rustfmt-as-the-formatting-authority}

- Sigue `rustfmt` / `cargo fmt` para la sangría, el ajuste de líneas, las comas finales y el formato idiomático.
- Prefiere las expresiones y llamadas compactas **cuando rustfmt las admita**; Pureline no debe exigir un formato manual que rustfmt deshará.
- Escribe una estructura de expresiones clara en lugar de usar directivas de formato para pelearte con el formateador.
- Usa el control de flujo ordinario delimitado por llaves; no imites las reglas de punto y coma de Java dentro de un Rust orientado a expresiones.

Esta regla prevalece sobre las preferencias de llamadas horizontales independientes del lenguaje cuando entran en conflicto con el formateador canónico de Rust.

### PL-RS-012 — Prefiere la iteración clara a las cadenas ingeniosas {#pl-rs-012--prefer-clear-iteration-over-clever-chains}

Se recomiendan los iteradores, las closures y los combinadores cuando expresan directamente una transformación. Prefiere un bucle normal cuando haga más claros la ramificación, los efectos secundarios, el borrowing, la depuración o el comportamiento de la ruta crítica. Evita encadenar adaptadores solo para reducir el número de líneas.

### PL-RS-013 — Las tareas asíncronas tienen dueño y apagado {#pl-rs-013--async-tasks-have-ownership-and-shutdown}

- Usa `async`/`.await` para las cargas de trabajo asíncronas cuando proceda.
- No bloquees un executor asíncrono con E/S síncrona o trabajo de CPU de larga duración; usa ejecución bloqueante dedicada o hilos de trabajo según haga falta.
- Haz un seguimiento de las tareas lanzadas, la cancelación, la propagación de errores y el apagado ordenado.
- No crees tareas ocultas de «lanzar y olvidar» para trabajo importante.
- Usa canales y primitivas de sincronización con una propiedad claramente definida y con backpressure.
- No mantengas nunca un lock bloqueante o asíncrono a través de un `.await`, salvo que el diseño lo exija explícitamente y lo admita de forma segura.

### PL-RS-014 — Los ciclos de vida de los recursos deben ser predecibles {#pl-rs-014--resource-lifecycles-should-be-predictable}

Prefiere RAII y `Drop` para la limpieza síncrona. Espera o coordina explícitamente el apagado de los recursos asíncronos, porque `Drop` no puede hacer await por sí mismo. Expón un método `close()` / `shutdown()` cuando la operación pueda fallar o deba completarse antes de que el proceso termine. Evita esconder una limpieza significativa que puede fallar solo dentro de los destructores.

### PL-RS-015 — El código unsafe debe estar aislado y justificado {#pl-rs-015--unsafe-code-must-be-isolated-and-justified}

Safe Rust es la opción por defecto. Usa `unsafe` solo donde lo exija un límite genuino de FFI, de hardware o de rendimiento. Mantén pequeñas las regiones unsafe, documenta sus invariantes con `// SAFETY:`, encapsúlalas tras una API segura mínima y prueba el límite. No uses `unsafe` simplemente para saltarte las comprobaciones normales de ownership.

### PL-RS-016 — Los límites de FFI y de plataforma son explícitos {#pl-rs-016--ffi-and-platform-boundaries-are-explicit}

Para Wayland, la GPU, las bibliotecas del sistema y otras integraciones nativas similares, mantén visibles los handles en bruto, las garantías de lifetime, la transferencia de ownership, las suposiciones sobre hilos y la conversión de errores. Aísla el código específico de plataforma en módulos concretos. Los bindings generados pueden quedar excluidos del formato ordinario y de los límites de densidad.

### PL-RS-017 — Prefiere los tipos que codifican invariantes {#pl-rs-017--prefer-types-that-encode-invariants}

Usa enums y newtypes pequeños donde eviten estados inválidos reales o aclaren los límites externos. No crees envoltorios para cada primitivo sin que aporten un beneficio. Prefiere constructores que validen las invariantes y expongan errores claros. Haz que los estados inválidos o sin inicializar sean difíciles de representar.

### PL-RS-018 — Evita la sofisticación con macros {#pl-rs-018--avoid-macro-cleverness}

Prefiere funciones, traits, enums y genéricos sencillos a las macros para el comportamiento rutinario. Usa macros declarativas o procedurales cuando eliminen una repetición estructural significativa. Mantén el comportamiento generado fácil de descubrir y los diagnósticos comprensibles.

### PL-RS-019 — Mide el rendimiento antes de añadir complejidad {#pl-rs-019--measure-performance-before-complexity}

Evita las asignaciones, los clones, el conteo de referencias y los locks innecesarios en las rutas críticas medidas. Prefiere una propiedad predecible y estructuras de datos adecuadas a la carga de trabajo. Haz un perfilado antes de sustituir código limpio por optimizaciones complejas de bajo nivel, y valida la latencia además del throughput en las cargas de trabajo de UI/compositor.

### PL-RS-020 — Tests y herramientas {#pl-rs-020--testing-and-tooling}

- Ejecuta `cargo fmt --check` para el formato y `cargo clippy` con la configuración de lints acordada por el proyecto.
- Prueba las rutas normales, las inválidas y las de fallo, sobre todo en los límites de cancelación, ciclo de vida, FFI y concurrencia.
- Haz que las advertencias sean intencionadas; evita los atributos `allow` generalizados que silencian grupos amplios de lints.
- Pureline Checker debe usar una inspección que conozca la sintaxis y el AST de Rust (incluidos `let ... else`, el pattern matching, las macros y los retornos de expresión), no una coincidencia de patrones textuales.

### PL-RS-021 — Los tipos de error se ajustan al papel del crate {#pl-rs-021--error-types-match-the-crate-role}

- Las bibliotecas exponen errores tipados: un `enum` que implementa `std::error::Error` y `Display`, con una variante por cada fallo distinto sobre el que pueda actuar quien llama.
- Las aplicaciones pueden usar un único tipo de error opaco de nivel superior en el límite (`main`, manejadores de peticiones, comandos de CLI) para transportar contexto. No filtres ese tipo opaco a través de la API pública de una biblioteca.
- Conserva el error de origen (`source()` o una variante envolvente) en lugar de convertirlo en una cadena.
- Los mensajes de `Display` van en minúsculas y sin puntuación final, para que quien llama pueda componerlos.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Los lints se configuran de forma centralizada {#pl-rs-022--lints-are-configured-centrally}

- Configura los niveles de los lints en el manifiesto (`[lints]` en `Cargo.toml`, o `[workspace.lints]` con `lints.workspace = true` en los crates miembros), no en atributos dispersos a nivel de crate.
- Activa los grupos de lints que el proyecto acuerde y enumera las excepciones individuales con un motivo junto a cada una.
- Un `#![allow(...)]` a nivel de crate es un hallazgo, salvo que un comentario explique por qué el lint no es adecuado para este código.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Código asíncrono seguro ante la cancelación {#pl-rs-023--cancellation-safe-async-code}

- Cuando un future se descarta antes de completarse (por ejemplo, como rama perdedora de un `select!` o por un timeout), indica si la operación es segura ante la cancelación. Documenta toda operación que no lo sea.
- No des por hecho que un future descartado ha revertido su trabajo. Confirma los cambios de estado después de que el paso en espera haya tenido éxito, o haz que el paso sea idempotente.
- Mantén el future que sostiene un lock o una transacción abierta fuera de las ramas de `select!` que puedan descartarlo a mitad de la operación.

### PL-RS-024 — Los tests están junto al comportamiento que comprueban {#pl-rs-024--tests-sit-next-to-the-behaviour-they-check}

- Los tests unitarios viven en un bloque `#[cfg(test)] mod tests` al final del archivo que prueban. Pueden acceder a elementos privados, lo que mantiene estrecha la superficie pública.
- Los tests de integración viven en `tests/` y usan solo la API pública.
- Los nombres de los tests indican el comportamiento (`rejects_expired_token`), no solo el nombre de la función.
- Los fixtures se construyen con pequeñas funciones auxiliares, no copiando bloques de preparación en cada test.
