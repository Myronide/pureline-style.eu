# Rust Code Style

[Code style guide](../README.md) · [Original specification 1.5](../../../PURELINE_SPECIFICATION_1.5.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Rust Profile

Pureline Rust follows **idiomatic Rust** rather than translating Java conventions into Rust syntax. Ownership, lifetimes, enums, pattern matching, and the type system are core strengths, not obstacles to work around.

### PL-RS-001 — Idiomatic Naming and Visibility

- Types, traits, and enum variants: `PascalCase`.
- Functions, methods, modules, fields, and locals: `snake_case`.
- Constants and statics: `SCREAMING_SNAKE_CASE`.
- Crates: descriptive `snake_case` names (Cargo package names may use hyphens).
- Traits do **not** inherit the Java `I` prefix. Prefer `Storage`, not `IStorage`.
- Keep items private unless an actual consumer needs wider visibility; prefer `pub(crate)` when suitable.
- Use `use` imports rather than repeating long fully-qualified paths, except where explicit qualification resolves ambiguity.

### PL-RS-002 — Guard Clauses and Linear Flow

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

Avoid `else` after a branch that already returns, breaks, or continues. An `if`/`else` **expression** is allowed for genuine two-way value selection where it is clearer than alternatives. `let ... else` is a **preferred Rust guard construct**, not a violation of the avoid-`else` principle.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Prefer `Result`, `Option`, and `?`

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

Never use `unwrap()` or `expect()` for ordinary recoverable production failures. They are acceptable in tests, prototypes, or documented invariants that really cannot be violated. `panic!` is not a normal error-handling strategy. Prefer explicit handling over hidden failure via unchecked indexing or conversions.

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

### PL-RS-006 — Ownership Must Be Deliberate

- Prefer borrowing `&T` or `&mut T` when ownership transfer is unnecessary.
- Accept owned values when the callee genuinely needs ownership.
- Minimize cloning; use `.clone()` when its ownership cost and purpose are clear.
- Avoid needless `Arc`, `Rc`, `Box`, and interior mutability wrappers.
- Prefer short lifetimes and explicit ownership boundaries; do not fight the borrow checker with artificial leaks or pervasive shared ownership.

### PL-RS-007 — Immutable by Default

Use `let` unless mutation is needed. Keep `let mut` local and narrowly scoped. Avoid interior mutability as a default substitute for ordinary ownership design. Do not create unnecessary mutable globals.

### PL-RS-008 — Traits Require a Real Abstraction

Create a trait for an actual shared behavior, API boundary, interchangeable implementation, or test seam. Do not introduce traits merely to mirror Java interfaces or create factory/manager layers. Prefer simple inherent `impl` methods for single concrete implementations. Choose generics or trait objects based on actual polymorphism requirements.

### PL-RS-009 — Cohesion over Size for `struct`, `impl`, and Modules

`PL-STRUCT-003` applies to Rust as a **cohesion review**, not as a fixed line-count limit. A cohesive `impl` or state machine may be long. Split by independent responsibility, not by mechanically extracting traits, structs, or files. Avoid huge unrelated `mod.rs` or `lib.rs` dumping grounds.

### PL-RS-010 — Module and File Density

A Rust feature/source folder should contain at most **10 hand-maintained production `.rs` files** by default. Tests, generated code, bindings, and metadata-only files do not count. `mod.rs`, `lib.rs`, and `main.rs` count when they contain substantial maintained logic, not when serving only as module declarations/re-exports. This is a review threshold: split along actual responsibility boundaries, never into meaningless nested folders.

Prefer explicit modules with narrow public surfaces; keep internal implementation private.

### PL-RS-011 — Use Rustfmt as the Formatting Authority

- Follow `rustfmt` / `cargo fmt` for indentation, line wrapping, trailing commas, and idiomatic formatting.
- Prefer compact expressions and calls **when rustfmt supports them**; Pureline must not demand manual formatting that rustfmt will undo.
- Write clear expression structure rather than using formatting directives to fight the formatter.
- Use ordinary brace-delimited control flow; do not emulate Java semicolon rules inside expression-oriented Rust.

This rule overrides language-independent horizontal-call preferences when they conflict with the canonical Rust formatter.

### PL-RS-012 — Prefer Clear Iteration over Clever Chains

Iterators, closures, and combinators are encouraged when they directly express a transformation. Prefer a regular loop when it makes branching, side effects, borrowing, debugging, or hot-path behavior clearer. Avoid chaining adapters simply to reduce line count.

### PL-RS-013 — Async Tasks Have Ownership and Shutdown

- Use `async`/`.await` for asynchronous workloads where appropriate.
- Do not block an async executor with long-running synchronous I/O or CPU work; use dedicated blocking execution or worker threads as needed.
- Track spawned tasks, cancellation, error propagation, and orderly shutdown.
- Do not create hidden fire-and-forget tasks for important work.
- Use channels and synchronization primitives with clearly defined ownership and backpressure.
- Never hold a blocking or asynchronous lock across `.await` unless the design explicitly requires and safely supports it.

### PL-RS-014 — Resource Lifecycles Should Be Predictable

Prefer RAII and `Drop` for synchronous cleanup. Explicitly await or coordinate shutdown for asynchronous resources because `Drop` cannot itself await. Expose a `close()` / `shutdown()` method when the operation can fail or must complete before process exit. Avoid hiding significant fallible cleanup inside destructors alone.

### PL-RS-015 — Unsafe Code Must Be Isolated and Justified

Safe Rust is the default. Use `unsafe` only where required by a genuine FFI, hardware, or performance boundary. Keep unsafe regions small, document their invariants with `// SAFETY:`, encapsulate them behind a minimal safe API, and test the boundary. Do not use `unsafe` simply to bypass normal ownership checks.

### PL-RS-016 — FFI and Platform Boundaries Are Explicit

For Wayland, GPU, system libraries, and similar native integration, keep raw handles, lifetime guarantees, ownership transfer, threading assumptions, and error conversion visible. Isolate platform-specific code in focused modules. Generated bindings may be excluded from ordinary formatting and density limits.

### PL-RS-017 — Prefer Types that Encode Invariants

Use enums and small newtypes where they prevent real invalid states or clarify external boundaries. Do not create wrappers for every primitive without benefit. Prefer constructors that validate invariants and expose clear errors. Make invalid or uninitialized states difficult to represent.

### PL-RS-018 — Avoid Macro Cleverness

Prefer functions, traits, enums, and straightforward generics over macros for routine behavior. Use declarative or procedural macros when they eliminate meaningful structural repetition. Keep generated behavior discoverable and diagnostics understandable.

### PL-RS-019 — Measure Performance Before Complexity

Avoid unnecessary allocations, clones, reference counting, and locking in measured hot paths. Prefer predictable ownership and data structures suited to the workload. Profile before replacing clean code with complex low-level optimizations, and validate latency as well as throughput for UI/compositor workloads.

### PL-RS-020 — Testing and Tooling

- Run `cargo fmt --check` for formatting and `cargo clippy` with project-agreed lint settings.
- Test normal, invalid, and failure paths, especially cancellation, lifecycle, FFI, and concurrency boundaries.
- Make warnings intentional; avoid blanket `allow` attributes to silence broad lint groups.
- Pureline Checker must use Rust syntax/AST-aware inspection (including `let ... else`, pattern matching, macros, and expression returns), not textual pattern matching.
