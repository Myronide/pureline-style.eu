# Estilo de código de rudo

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de corrosión

Pureline Rust sigue a **idiomatic Rust** en lugar de traducir las convenciones de Java a sintaxis Rust. La propiedad, las vidas, los enums, la coincidencia de patrones y el sistema de tipo son fortalezas centrales, no obstáculos para trabajar alrededor.

### PL-RS-001: Denominación y visibilidad de los pueblos

- Tipos, rasgos y variantes de enum: `PascalCase`.
- Funciones, métodos, módulos, campos y locales: `snake_case`.
- Constantes y estáticas: `SCREAMING_SNAKE_CASE`.
- Crates: nombres descriptivos `snake_case` (los nombres de paquetes de Cargo pueden usar guiones).
- Los rasgos hacen **not** heredan el prefijo Java `I`. Prefiere `Storage`, no `IStorage`.
- Mantenga los artículos privados a menos que un consumidor real necesite una mayor visibilidad; prefiera `pub(crate)` cuando sea adecuado.
- Utilice las importaciones de `use` en lugar de repetir largas rutas totalmente cualificadas, excepto cuando la calificación explícita resuelva la ambigüedad.

### PL-RS-002 — Cláusulas de protección y flujo lineal

Validar temprano y mantener el camino acertado en el nivel de sangrado de la base.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Evite `else` después de una rama que ya devuelve, rompe o continúa. Una `if`/`else` **expression** está permitida para una auténtica selección de valor bidireccional donde es más clara que las alternativas. `let ... else` es un protector de Rust preferred ** construct**, no una violación del principio de evitar-`else`.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Prefiere `Result`, `Option` y `?`

- Representan los fallos esperados con `Result<T, E>`.
- Representar la ausencia con `Option<T>`.
- Utilice `?` para una propagación sencilla y `map_err`/`ok_or_else` cuando el contexto de error realmente mejore.
- Use `match` cuando los resultados necesiten un manejo distinto; evite las cadenas conmutadas de los que los dan.
- No descarte los valores de `Result` en silencio; decida si propagar, registrar, recuperar o ignorar deliberadamente con una explicación justificada.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Restricción de `unwrap`, `expect` y `panic!`

Nunca utilice `unwrap()` o `expect()` para fallos ordinarios de producción recuperables. Son aceptables en invariantes documentadas que realmente no pueden ser violadas, y dentro del código de prueba (modulos `#[cfg(test)]` y `tests/`), donde un pánico es el informe de fracaso. `panic!` no es una estrategia normal de manejo de errores. Prefiere manejar explícitamente sobre un fallo oculto a través de indexación o conversiones no controladas.

### PL-RS-005 — Usar `match` y patrones para la ramificación del estado real

Use `match` exhaustivo para los enums y alternativas significativas; use `if let` o `let ... else` para el manejo simple de un solo patrón. No obligue a `match` a realizar comprobaciones booleanas ordinarias. Evite los amplios brazos `_` que enmascaran silenciosamente los estados futuros cuando las variantes victoriosas serían más claras.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006: La propiedad debe ser deliberada

- Prefiere pedir prestado `&T` o `&mut T` cuando la transferencia de propiedad es innecesaria.
- Aceptar los valores propios cuando la calle necesita realmente la propiedad.
- Minimizar la clonación; utilizar `.clone()` cuando su costo de propiedad y propósito son claros.
- Evite las envoltorios de `Arc`, `Rc`, `Box` y de mutabilidad interior innecesarios.
- Prefiere vidas cortas y límites de propiedad explícitos; no luche contra el cajero de préstamos con fugas artificiales o propiedad compartida generalizada.

### PL-RS-007 — Inmutable por defecto

Use `let` a menos que sea necesaria una mutación. Mantenga `let mut` local y con un alcance limitado. Evite la mutabilidad interior como sustituto por defecto del diseño de propiedad ordinario. No cree globales mutables innecesarios.

### PL-RS-008: rasgos que requieren una verdadera abstracción

Cree un rasgo para un comportamiento compartido real, límite de API, implementación intercambiable o seam de prueba. No introduzca rasgos simplemente para reflejar Java < o crear capas de fábrica / >. Prefiere métodos simples y inherentes a `impl` para implementaciones de concreto. Elija objetos genéricos u características basados en los requerimientos reales de polimorfismo.

### PL-RS-009 — Cohesión sobre el tamaño para `struct`, `impl` y módulos

`PL-STRUCT-003` se aplica a Rust como una revisión **cohesion**, no como un límite de cuenta de línea fija. Una máquina cohesiva `impl` o de estado puede ser larga. Dividido por responsabilidad independiente, no por extraer mecánicamente rasgos, estructuras, o archivos. Evitar los grandes terrenos de dumping no relacionados con `mod.rs` o `lib.rs`.

### PL-RS-010 — Densidad de módulos y archivos

Una carpeta de características/fuentes Rust debe contener como máximo **10 producción manual `.rs` archivos** por defecto. Pruebas, código generado, enlaces y archivos de sólo metadatos no cuentan. `mod.rs`, `lib.rs` y `main.rs` cuentan cuando contienen lógica sustancial mantenida, no cuando sirven sólo como declaraciones de módulos/reexportaciones. Se trata de un umbral de revisión: divididos a lo largo de los límites de responsabilidad reales, nunca en carpetas sin sentido anidadas.

Prefiere módulos explícitos con superficies públicas estrechas; mantenga la implementación interna privada.

### PL-RS-011 — Utilizar Rustfmt como autoridad de formato

- Siga `rustfmt` / `cargo fmt` para la sangría, envoltorio de línea, comas de seguimiento y formato de idioma.
- Prefiere expresiones compactas y llamadas ** cuando rushfmt los soporta**; Pureline no debe exigir un formato manual que oxidfmt deshace.
- Escriba una estructura de expresión clara en lugar de usar directivas de formato para luchar contra la formateria.
- Utilice corriente de control ordinaria delimitada por la ortodoncia; no emule las reglas de Java semicolon dentro de Rust orientado a la expresión.

Esta regla anula las preferencias de llamada horizontal independientes del idioma cuando entran en conflicto con la forma de forma de Rust.

### PL-RS-012: Prefiere la iteración clara sobre las cadenas de clítoris

Se alienta a los iteradores, los cierres y los partos cuando expresan directamente una transformación. Prefiere un bucle regular cuando hace que el ramificado, efectos secundarios, préstamos, depuración o comportamiento de camino caliente sean más claros. Evite encadenar adaptadores simplemente para reducir el recuento de líneas.

### PL-RS-013 — Tareas de sincronización tienen propiedad y apagado

- Utilizar `async`/`.await` para cargas de trabajo asíncronas cuando proceda.
- No bloquee un ejecutante de async con trabajo de E/S o CPU sincrónico de larga duración; use ejecución de bloqueos o hilos de trabajo dedicados según sea necesario.
- Seguimiento de tareas generadas, cancelación, propagación de errores y apagado ordenado.
- No cree tareas ocultas de fuego y olvido para trabajos importantes.
- Use canales y primitivos de sincronización con propiedad y contrapresión claramente definidas.
- Nunca mantenga un bloqueo o bloqueo asíncrono a través de `.await` a menos que el diseño lo requiera explícitamente y lo apoye de forma segura.

### PL-RS-014 — Los ciclos de vida de los recursos deberían ser predecibles

Prefiere RAI y `Drop` para la limpieza sincrónica. Exactamente esperar o coordinar el apagado de los recursos asíncronos porque `Drop` no puede esperar. Exponga un método `close()` / `shutdown()` cuando la operación puede fallar o debe completarse antes de que el proceso salga. Evite ocultar una limpieza falible significativa dentro de los dúctiles solos.

### PL-RS-015 — Código inseguro debe aislarse y justificarse

El Rust Seguro es el predeterminado. Utilice `unsafe` solo cuando lo requiera un FFI, hardware o límite de rendimiento genuino. Mantenga pequeñas regiones inseguras, documente sus invariantes con `// SAFETY:`, encapsulelas detrás de una API mínima y segura, y pruebe el límite. No utilice `unsafe` simplemente para eludir los controles de propiedad normales.

### PL-RS-016 — Las FFI y los límites de plataforma son explícitos

Para Wayland, GPU, bibliotecas de sistemas y una integración nativa similar, mantenga visibles las asas sin procesar, las garantías de por vida, la transferencia de propiedad, las suposiciones de roscado y la conversión de errores. Aislar el código específico de la plataforma en módulos enfocados. las fijaciones de color pueden excluirse del formato ordinario y los límites de densidad.

### PL-RS-017: prefiere los tipos que codifican las variables

Use enums y nuevos tipos pequeños donde impidan estados reales inválidos o aclaren los límites externos. No cree envolturas para cada primitivo sin beneficio. Prefieren los vulnerantes que validan invariantes y exponen errores claros. Hacer que los estados inválidos o no iniciados sean difíciles de representar.

### PL-RS-018: Evitar la clíveresidad macro

Prefiere funciones, rasgos, enums y genéricos sencillos sobre macros para el comportamiento rutinario. Utilice macros de procedimiento o de procedimiento cuando eliminen la repetición estructural significativa. Mantener el comportamiento generado que se puede descubrir y los diagnósticos comprensibles.

### PL-RS-019 — Medir el rendimiento antes de la complejidad

Evite asignaciones innecesarias, clones, recuento de referencias y bloqueo en rutas calientes medidas. Prefieren estructuras de propiedad y datos previsibles adaptadas a la carga de trabajo. Perfil antes de reemplazar código limpio con complejas optimizaciones de bajo nivel, y validar la latencia y rendimiento para cargas de trabajo de UI/comturar.

### PL-RS-020 — Ensayos y herramientas

- Ejecute `cargo fmt --check` para formatear y `cargo clippy` con ajustes de pelusas de proyecto.
- Prueba las rutas normales, inválidas y de fallo, especialmente los límites de cancelación, ciclo de vida, FFI y concurrencia.
- Haz advertencias intencionales; evita los atributos de `allow` de manta para silenciar a los grupos de pelusas amplias.
- Pureline Checker debe usar la sintaxis Rust/AST-aware inspection (incluyendo `let ... else`, patrón de coincidencia, macros y devoluciones de expresiones), no coincidencia de patrones de sexo.

### PL-RS-021 — Tipos de error coinciden con el rol de la caja

- Las bibliotecas exponen errores escritos: un `enum` que implementa `std::error::Error` y `Display`, con una variante por cada fallo distinto que un llamante puede actuar.
- Las aplicaciones pueden utilizar un tipo de error opaco de nivel superior en el límite (`main`, manejadores de solicitudes, comandos CLI) para llevar contexto. No se escape ese tipo opaco a través de la API pública de una biblioteca.
- Preservar el error de origen (`source()` o una variante envuelta) en lugar de convertirlo a una cadena.
- Los mensajes `Display` son en minúsculas y no llevan ningún momento de sucesión, de modo que los que llaman pueden componerlos.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Las lintas se configuran centralmente

- Configure los niveles de pelusa en el manifiesto (`[lints]` en `Cargo.toml`, o `[workspace.lints]` con `lints.workspace = true` en cajas de miembros), no en atributos de nivel de caja dispersa.
- Habilitar los grupos de pelusas en los que el proyecto está de acuerdo, y enumerar excepciones individuales con una razón junto a ellos.
- Un `#![allow(...)]` de nivel de caja es un hallazgo a menos que un comentario explique por qué la pelusa está mal para este código.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Código de sincronización seguro de cancelación

- Cuando un futuro se cae antes de que se complete (por ejemplo, como una rama perdedora de `select!`, o en tiempo de espera), indique si la operación es segura para cancelación. Documente cualquier operación que no lo sea.
- No asuma que un futuro caído ha revertido su trabajo. Comete cambios de estado después de que el paso esperado tenga éxito, o haga el paso idePotent.
- Mantenga el futuro que mantiene un bloqueo o una transacción abierta fuera de las sucursales `select!` que pueden dejarlo en funcionamiento medio.

### PL-RS-024 — Pruebas se sientan al lado del comportamiento que comprueban

- Las pruebas de unidad viven en un bloque `#[cfg(test)] mod tests` al final del archivo que prueban. Pueden llegar a artículos privados, lo que mantiene la superficie pública estrecha.
- Las pruebas de integración se realizan en `tests/` y solo se utiliza la API pública.
- Los nombres de los ensayos indican el comportamiento (`rejects_expired_token`), no el nombre de la función solo.
- Los accesorios se construyen mediante pequeñas funciones de ayuda, no copiando bloques de configuración en cada prueba.
