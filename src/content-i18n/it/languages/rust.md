# Rust Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Rust Profile

Pureline Rust follows **idiomatic Rust** rather than translating Java conventions into Rust syntax. Ownership, lifetimes, enums, pattern matching, and the type system are core strengths, not obstacles to work around.

### PL-RS-001. Name e visibilità idiomatica

- Tipi, caratteristiche e varianti e UM: `PascalCase`.
- Funzioni, metodi, moduli, campi e locali: `snake_case`.
- Costanti e statici: `SCREAMING_SNAKE_CASE`.
- Crates: nomi `snake_case` descrittivi (i nomi dei pacchetti Cargo possono usare i trattini)..
- Le caratteristiche fanno **not** ereditano il prefisso Java `I`. Prefer `Storage`, not `IStorage`.
- Mantenere gli oggetti privati a meno che un consumatore effettivo non abbia bisogno di una maggiore visibilità; preferire `pub(crate)` quando appropriato..
- Use `use` imports rather than repeating long fully-qualified paths, except where explicit qualification resolves ambiguity.

### PL-RS-002. Clausole di guardia e flusso lineare

Validate early and keep the successful path at the base indentation level.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Avoid `else` after a branch that already returns, breaks, or continues. Per una selezione a due vie autentica, è consentito un valore `if`/`else` **expression** dove è più chiaro delle alternative. `let ... else` è un costrutto ** di protezione Rust preferito **, non una violazione del principio di evitare-`else`...

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

```text
− Noisy                                       │ ✓ Pureline
                                              │
fn display_name(user: Option<&User>) -> &str { │ fn display_name(user: Option<&User>) -> &str {
    match user {                              │     let Some(user) = user else {
        Some(user) => user.name.as_str(),     │         return "Gast";
        None => "Gast",                       │     };
    }                                         │
}                                             │     user.name.as_str()
                                              │ }
```

### PL-RS-003. Preferire `Result`, `Option` e `?`

- Represent expected failures with `Result<T, E>`.
- Represent absence with `Option<T>`.
- Use `?` for straightforward propagation and `map_err`/`ok_or_else` when error context genuinely improves.
- Use `match` when outcomes need distinct handling; avoid convoluted chains of combinators.
- Do not discard `Result` values silently; decide whether to propagate, log, recover, or deliberately ignore with a justified explanation.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Restrict `unwrap`, `expect`, and `panic!`

Never use `unwrap()` or `expect()` for ordinary recoverable production failures. They are acceptable in documented invariants that really cannot be violated, and inside test code (`#[cfg(test)]` modules and `tests/`), where a panic is the failure report. `panic!` is not a normal error-handling strategy. Prefer explicit handling over hidden failure via unchecked indexing or conversions.

### PL-RS-005 — Use `match` and Patterns for Real State Branching

Use exhaustive `match` for enums and meaningful alternatives; use `if let` or `let ... else` for simple single-pattern handling. Do not force `match` onto ordinary boolean checks. Avoid broad `_` arms that silently mask future states when enumerating variants would be clearer.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006. La proprietà deve essere Deliberate

- Prefer borrowing `&T` or `&mut T` when ownership transfer is unnecessary.
- Accept owned values when the callee genuinely needs ownership.
- Minimize cloning; use `.clone()` when its ownership cost and purpose are clear.
- Evitare inutili incarti `Arc`, `Rc`, `Box` e incartolatori di mutabilità interni.
- Preferire brevi vite e limiti di proprietà espliciti; non combattere il checker prestito con perdite artificiali o pervasive proprietà condivisa...

### PL-RS-007. Immutabile per impostazione predefinita

Use `let` unless mutation is needed. Keep `let mut` local and narrowly scoped. Evitare la mutabilità interna come sostituto predefinito della proprietà ordinaria. Non creare globali mutabili inutili..

### PL-RS-008. I tratti richiedono una reale astrazione

Crea un tratto per un effettivo behavior condiviso, confine API, implementazione intercambiabile, o test seam.. Do not introduce traits merely to mirror Java interfaces or create factory/manager layers. Prefer simple inherent `impl` methods for single concrete implementations. Choose generics or trait objects based on actual polymorphism requirements.

### PL-RS-009. Coesione su dimensioni per `struct`, `impl` e moduli

`PL-STRUCT-003` si applica a Rust come una recensione **cohesion**, non come un limite fisso di conteggio delle linee. A cohesive `impl` or state machine may be long. Split by independent responsibility, not by mechanically extracting traits, structs, or files. Avoid huge unrelated `mod.rs` or `lib.rs` dumping grounds.

### PL-RS-010. Modulo e densità file

A Rust feature/source folder should contain at most **10 hand-maintained production `.rs` files** by default. Tests, generated code, bindings, and metadata-only files do not count. `mod.rs`, `lib.rs`, and `main.rs` count when they contain substantial maintained logic, not when serving only as module declarations/re-exports. This is a review threshold: split along actual responsibility boundaries, never into meaningless nested folders.

Prefer explicit modules with narrow public surfaces; keep internal implementation private.

### PL-RS-011. Usare Rustfmt come autorità di formattazione

- Follow `rustfmt` / `cargo fmt` for indentation, line wrapping, trailing commas, and idiomatic formatting.
- Prefer compact expressions and calls **when rustfmt supports them**; Pureline must not demand manual formatting that rustfmt will undo.
- Write clear expression structure rather than using formatting directives to fight the formatter.
- Use ordinary brace-delimited control flow; do not emulate Java semicolon rules inside expression-oriented Rust.

This rule overrides language-independent horizontal-call preferences when they conflict with the canonical Rust formatter.

### PL-RS-012. Preferisci l'iterazione libera sulle catene Clever

Iterators, closures, and combinators are encouraged when they directly express a transformation. Prefer a regular loop when it makes branching, side effects, borrowing, debugging, or hot-path behavior clearer. Avoid chaining adapters simply to reduce line count.

### PL-RS-013. Attività asincrone hanno proprietà e chiusura

- Use `async`/`.await` for asynchronous workloads where appropriate.
- Do not block an async executor with long-running synchronous I/O or CPU work; use dedicated blocking execution or worker threads as needed.
- Track spawned tasks, cancellation, error propagation, and orderly shutdown.
- Do not create hidden fire-and-forget tasks for important work.
- Use channels and synchronization primitives with clearly defined ownership and backpressure.
- Never hold a blocking or asynchronous lock across `.await` unless the design explicitly requires and safely supports it.

### PL-RS-014 — Resource Lifecycles Should Be Predictable

Prefer RAII and `Drop` for synchronous cleanup. Explicitly await or coordinate shutdown for asynchronous resources because `Drop` cannot itself await. Expose a `close()` / `shutdown()` method when the operation can fail or must complete before process exit. Avoid hiding significant fallible cleanup inside destructors alone.

### PL-RS-015. Codice non sicuro deve essere isolato e giustificato

Safe Rust is the default. Use `unsafe` only where required by a genuine FFI, hardware, or performance boundary. Keep unsafe regions small, document their invariants with `// SAFETY:`, encapsulate them behind a minimal safe API, and test the boundary. Do not use `unsafe` simply to bypass normal ownership checks.

### PL-RS-016 — FFI and Platform Boundaries Are Explicit

For Wayland, GPU, system libraries, and similar native integration, keep raw handles, lifetime guarantees, ownership transfer, threading assumptions, and error conversion visible. Isolate platform-specific code in focused modules. Generated bindings may be excluded from ordinary formatting and density limits.

### PL-RS-017. Preferire tipi che codificano le variabiline

Use enums and small newtypes where they prevent real invalid states or clarify external boundaries. Do not create wrappers for every primitive without benefit. Prefer constructors that validate invariants and expose clear errors. Make invalid or uninitialized states difficult to represent.

### PL-RS-018. Evitare la macrocerbalità

Prefer functions, traits, enums, and straightforward generics over macros for routine behavior. Use declarative or procedural macros when they eliminate meaningful structural repetition. Keep generated behavior discoverable and diagnostics understandable.

### PL-RS-019. Misurare le prestazioni prima della complessitàne

Avoid unnecessary allocations, clones, reference counting, and locking in measured hot paths. Prefer predictable ownership and data structures suited to the workload. Profile before replacing clean code with complex low-level optimizations, and validate latency as well as throughput for UI/compositor workloads.

### PL-RS-020. Testing e Tooling

- Run `cargo fmt --check` for formatting and `cargo clippy` with project-agreed lint settings.
- Test normal, invalid, and failure paths, especially cancellation, lifecycle, FFI, and concurrency boundaries.
- Make warnings intentional; avoid blanket `allow` attributes to silence broad lint groups.
- Pureline Checker must use Rust syntax/AST-aware inspection (including `let ... else`, pattern matching, macros, and expression returns), not textual pattern matching.

### PL-RS-021. Tipi di errore Adattare il ruolo della cassa

- Libraries expose typed errors: an `enum` that implements `std::error::Error` and `Display`, with one variant per distinct failure a caller can act on.
- Applications may use one opaque top-level error type at the boundary (`main`, request handlers, CLI commands) to carry context. Do not leak that opaque type through a library's public API.
- Preserve the source error (`source()` or a wrapped variant) instead of converting it to a string.
- `Display` messages are lowercase and carry no trailing punctuation, so that callers can compose them.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022. Le righe sono configurate centralmentenexe.

- Configure lint levels in the manifest (`[lints]` in `Cargo.toml`, or `[workspace.lints]` with `lints.workspace = true` in member crates), not in scattered crate-level attributes.
- Enable the lint groups the project agrees on, and list individual exceptions with a reason next to them.
- A crate-level `#![allow(...)]` is a finding unless a comment explains why the lint is wrong for this code.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023. Codice Async sicuro per la cancellazione

- When a future is dropped before it completes (for example as a losing branch of `select!`, or on timeout), state whether the operation is cancellation-safe. Document any operation that is not.
- Do not assume that a dropped future has rolled back its work. Commit state changes after the awaited step succeeds, or make the step idempotent.
- Keep the future that holds a lock or an open transaction out of `select!` branches that can drop it mid-operation.

### PL-RS-024. Test Sit accanto al Behaviour che controllano

- Unit tests live in a `#[cfg(test)] mod tests` block at the end of the file they test. They can reach private items, which keeps the public surface narrow.
- Integration tests live in `tests/` and use only the public API.
- Test names state the behaviour (`rejects_expired_token`), not the function name alone.
- Fixtures are built by small helper functions, not by copying setup blocks into every test.
