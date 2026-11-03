# Rust Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Rust-Profil {#rust-profile}

Pureline Rust folgt **idiomatischem Rust**, statt Java-Konventionen in Rust-Syntax zu übertragen. Ownership, Lifetimes, Enums, Pattern Matching und das Typsystem sind zentrale Stärken und keine Hindernisse, die man umgehen müsste.

### PL-RS-001 — Idiomatische Benennung und Sichtbarkeit {#pl-rs-001--idiomatic-naming-and-visibility}

- Typen, Traits und Enum-Varianten: `PascalCase`.
- Funktionen, Methoden, Module, Felder und lokale Variablen: `snake_case`.
- Konstanten und Statics: `SCREAMING_SNAKE_CASE`.
- Crates: aussagekräftige Namen in `snake_case` (Cargo-Paketnamen dürfen Bindestriche enthalten).
- Traits übernehmen das Java-Präfix `I` **nicht**. Bevorzuge `Storage`, nicht `IStorage`.
- Halte Items privat, solange kein tatsächlicher Konsument größere Sichtbarkeit braucht; bevorzuge `pub(crate)`, wenn es passt.
- Verwende `use`-Imports, statt lange vollqualifizierte Pfade zu wiederholen, außer wo eine explizite Qualifizierung Mehrdeutigkeit auflöst.

### PL-RS-002 — Guard Clauses und linearer Fluss {#pl-rs-002--guard-clauses-and-linear-flow}

Validiere früh und halte den erfolgreichen Pfad auf der Basis-Einrückung.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Vermeide `else` nach einem Zweig, der bereits mit return, break oder continue endet. Ein `if`/`else`-**Ausdruck** ist für eine echte Wertauswahl zwischen zwei Möglichkeiten erlaubt, wenn er klarer ist als die Alternativen. `let ... else` ist ein **bevorzugtes Rust-Guard-Konstrukt** und kein Verstoß gegen das Prinzip, `else` zu vermeiden.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — `Result`, `Option` und `?` bevorzugen {#pl-rs-003--prefer-result-option-and}

- Erwartete Fehler mit `Result<T, E>` darstellen.
- Abwesenheit mit `Option<T>` darstellen.
- `?` für unkomplizierte Weitergabe verwenden und `map_err`/`ok_or_else`, wenn Fehlerkontext wirklich Mehrwert bringt.
- `match` verwenden, wenn Ergebnisse unterschiedlich behandelt werden müssen; verschachtelte Ketten aus Combinators vermeiden.
- `Result`-Werte nicht stillschweigend verwerfen; entscheide, ob du weiterreichst, protokollierst, dich erholst oder sie bewusst mit einer begründeten Erklärung ignorierst.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — `unwrap`, `expect` und `panic!` einschränken {#pl-rs-004--restrict-unwrap-expect-and-panic}

Verwende `unwrap()` oder `expect()` niemals für gewöhnliche behebbare Fehler im Produktivcode. Akzeptabel sind sie bei dokumentierten Invarianten, die sich wirklich nicht verletzen lassen, und in Testcode (`#[cfg(test)]`-Module und `tests/`), wo ein Panic die Fehlermeldung ist. `panic!` ist keine normale Strategie zur Fehlerbehandlung. Bevorzuge explizite Behandlung gegenüber versteckten Fehlern durch ungeprüfte Indizierung oder Konvertierungen.

### PL-RS-005 — `match` und Patterns für echte Zustandsverzweigungen verwenden {#pl-rs-005--use-match-and-patterns-for-real-state-branching}

Verwende ein erschöpfendes `match` für Enums und sinnvolle Alternativen; verwende `if let` oder `let ... else` für die einfache Behandlung eines einzelnen Musters. Zwinge `match` nicht auf gewöhnliche boolesche Prüfungen. Vermeide breite `_`-Zweige, die künftige Zustände stillschweigend verdecken, wenn das Aufzählen der Varianten klarer wäre.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — Ownership muss bewusst sein {#pl-rs-006--ownership-must-be-deliberate}

- Bevorzuge das Ausleihen von `&T` oder `&mut T`, wenn eine Übertragung der Ownership unnötig ist.
- Nimm Werte mit Ownership entgegen, wenn der Aufgerufene sie wirklich braucht.
- Minimiere das Klonen; verwende `.clone()`, wenn Ownership-Kosten und Zweck klar sind.
- Vermeide überflüssiges `Arc`, `Rc`, `Box` und Wrapper für Interior Mutability.
- Bevorzuge kurze Lifetimes und explizite Ownership-Grenzen; kämpfe nicht mit künstlichen Leaks oder allgegenwärtiger geteilter Ownership gegen den Borrow Checker.

### PL-RS-007 — Standardmäßig unveränderlich {#pl-rs-007--immutable-by-default}

Verwende `let`, solange keine Mutation nötig ist. Halte `let mut` lokal und eng begrenzt. Vermeide Interior Mutability als Standardersatz für ein gewöhnliches Ownership-Design. Lege keine unnötigen veränderlichen Globals an.

### PL-RS-008 — Traits erfordern eine echte Abstraktion {#pl-rs-008--traits-require-a-real-abstraction}

Erstelle einen Trait für ein tatsächlich gemeinsames Verhalten, eine API-Grenze, eine austauschbare Implementierung oder eine Test-Naht. Führe Traits nicht ein, nur um Java-Interfaces nachzubilden oder Factory-/Manager-Schichten zu schaffen. Bevorzuge einfache inhärente `impl`-Methoden für einzelne konkrete Implementierungen. Wähle Generics oder Trait-Objekte nach den tatsächlichen Polymorphie-Anforderungen.

### PL-RS-009 — Kohäsion vor Größe bei `struct`, `impl` und Modulen {#pl-rs-009--cohesion-over-size-for-struct-impl-and-modules}

`PL-STRUCT-003` gilt für Rust als **Kohäsionsprüfung**, nicht als festes Zeilenlimit. Ein kohäsives `impl` oder eine Zustandsmaschine darf lang sein. Teile nach unabhängiger Verantwortung auf, nicht durch mechanisches Herauslösen von Traits, Structs oder Dateien. Vermeide riesige, unzusammenhängende `mod.rs`- oder `lib.rs`-Sammelbecken.

### PL-RS-010 — Modul- und Dateidichte {#pl-rs-010--module-and-file-density}

Ein Rust-Feature-/Quellordner soll standardmäßig höchstens **10 von Hand gepflegte produktive `.rs`-Dateien** enthalten. Tests, generierter Code, Bindings und reine Metadaten-Dateien zählen nicht. `mod.rs`, `lib.rs` und `main.rs` zählen mit, wenn sie substanzielle gepflegte Logik enthalten, nicht wenn sie nur als Moduldeklarationen oder Re-Exports dienen. Dies ist eine Review-Schwelle: Teile entlang tatsächlicher Verantwortungsgrenzen auf, niemals in sinnlos verschachtelte Ordner.

Bevorzuge explizite Module mit schmaler öffentlicher Oberfläche; halte die interne Implementierung privat.

### PL-RS-011 — Rustfmt als Autorität für die Formatierung verwenden {#pl-rs-011--use-rustfmt-as-the-formatting-authority}

- Folge `rustfmt` / `cargo fmt` für Einrückung, Zeilenumbruch, Trailing Commas und idiomatische Formatierung.
- Bevorzuge kompakte Ausdrücke und Aufrufe, **wenn rustfmt sie unterstützt**; Pureline darf keine manuelle Formatierung verlangen, die rustfmt wieder rückgängig macht.
- Schreibe eine klare Ausdrucksstruktur, statt mit Formatierungsdirektiven gegen den Formatter anzukämpfen.
- Verwende gewöhnlichen Kontrollfluss mit geschweiften Klammern; ahme die Semikolon-Regeln von Java nicht in ausdrucksorientiertem Rust nach.

Diese Regel hat Vorrang vor sprachunabhängigen Präferenzen für horizontale Aufrufe, wenn diese dem kanonischen Rust-Formatter widersprechen.

### PL-RS-012 — Klare Iteration statt cleverer Ketten bevorzugen {#pl-rs-012--prefer-clear-iteration-over-clever-chains}

Iteratoren, Closures und Combinators werden empfohlen, wenn sie eine Transformation direkt ausdrücken. Bevorzuge eine reguläre Schleife, wenn sie Verzweigungen, Seiteneffekte, Borrowing, Debugging oder das Verhalten im Hot Path klarer macht. Verkette Adapter nicht allein, um Zeilen zu sparen.

### PL-RS-013 — Async-Tasks haben Ownership und Shutdown {#pl-rs-013--async-tasks-have-ownership-and-shutdown}

- Verwende `async`/`.await` für asynchrone Workloads, wo es passt.
- Blockiere einen Async-Executor nicht mit lang laufendem synchronem I/O oder CPU-Arbeit; nutze bei Bedarf dedizierte blockierende Ausführung oder Worker-Threads.
- Verfolge gestartete Tasks, Abbruch, Fehlerweitergabe und geordneten Shutdown.
- Erzeuge keine versteckten Fire-and-forget-Tasks für wichtige Arbeit.
- Verwende Channels und Synchronisationsprimitive mit klar definierter Ownership und Backpressure.
- Halte niemals einen blockierenden oder asynchronen Lock über ein `.await` hinweg, es sei denn, das Design verlangt es ausdrücklich und unterstützt es sicher.

### PL-RS-014 — Ressourcen-Lebenszyklen sollen vorhersehbar sein {#pl-rs-014--resource-lifecycles-should-be-predictable}

Bevorzuge RAII und `Drop` für synchrones Aufräumen. Warte bei asynchronen Ressourcen ausdrücklich auf den Shutdown oder koordiniere ihn, denn `Drop` kann selbst nicht awaiten. Biete eine `close()`- / `shutdown()`-Methode an, wenn die Operation scheitern kann oder vor dem Prozessende abgeschlossen sein muss. Vermeide es, bedeutsames fehleranfälliges Aufräumen allein in Destruktoren zu verstecken.

### PL-RS-015 — Unsafe-Code muss isoliert und begründet sein {#pl-rs-015--unsafe-code-must-be-isolated-and-justified}

Safe Rust ist der Standard. Verwende `unsafe` nur dort, wo eine echte FFI-, Hardware- oder Performance-Grenze es erfordert. Halte Unsafe-Bereiche klein, dokumentiere ihre Invarianten mit `// SAFETY:`, kapsle sie hinter einer minimalen sicheren API und teste die Grenze. Verwende `unsafe` nicht, nur um die normalen Ownership-Prüfungen zu umgehen.

### PL-RS-016 — FFI und Plattformgrenzen sind explizit {#pl-rs-016--ffi-and-platform-boundaries-are-explicit}

Halte bei Wayland, GPU, Systembibliotheken und ähnlicher nativer Integration rohe Handles, Lifetime-Garantien, Ownership-Übergabe, Threading-Annahmen und Fehlerkonvertierung sichtbar. Isoliere plattformspezifischen Code in fokussierten Modulen. Generierte Bindings dürfen von der gewöhnlichen Formatierung und den Dichtelimits ausgenommen werden.

### PL-RS-017 — Typen bevorzugen, die Invarianten kodieren {#pl-rs-017--prefer-types-that-encode-invariants}

Verwende Enums und kleine Newtypes, wo sie echte ungültige Zustände verhindern oder externe Grenzen klären. Erstelle nicht ohne Nutzen für jedes Primitiv einen Wrapper. Bevorzuge Konstruktoren, die Invarianten validieren und klare Fehler liefern. Mache ungültige oder uninitialisierte Zustände schwer darstellbar.

### PL-RS-018 — Makro-Cleverness vermeiden {#pl-rs-018--avoid-macro-cleverness}

Bevorzuge für Routineverhalten Funktionen, Traits, Enums und unkomplizierte Generics gegenüber Makros. Verwende deklarative oder prozedurale Makros, wenn sie bedeutsame strukturelle Wiederholung beseitigen. Halte generiertes Verhalten auffindbar und Diagnosen verständlich.

### PL-RS-019 — Erst die Performance messen, dann Komplexität einführen {#pl-rs-019--measure-performance-before-complexity}

Vermeide unnötige Allokationen, Klone, Referenzzählung und Locking in gemessenen Hot Paths. Bevorzuge vorhersehbare Ownership und Datenstrukturen, die zur Workload passen. Profiliere, bevor du sauberen Code durch komplexe Low-Level-Optimierungen ersetzt, und prüfe bei UI-/Compositor-Workloads neben dem Durchsatz auch die Latenz.

### PL-RS-020 — Tests und Tooling {#pl-rs-020--testing-and-tooling}

- Führe `cargo fmt --check` für die Formatierung und `cargo clippy` mit projektweit vereinbarten Lint-Einstellungen aus.
- Teste normale, ungültige und fehlerhafte Pfade, besonders an Grenzen zu Abbruch, Lebenszyklus, FFI und Nebenläufigkeit.
- Mache Warnungen bewusst; vermeide pauschale `allow`-Attribute, die breite Lint-Gruppen zum Schweigen bringen.
- Der Pureline Checker muss eine Rust-Syntax-/AST-bewusste Analyse verwenden (einschließlich `let ... else`, Pattern Matching, Makros und Ausdrucks-Rückgaben), keinen textuellen Mustervergleich.

### PL-RS-021 — Fehlertypen passen zur Rolle des Crates {#pl-rs-021--error-types-match-the-crate-role}

- Bibliotheken stellen typisierte Fehler bereit: ein `enum`, das `std::error::Error` und `Display` implementiert, mit einer Variante pro unterscheidbarem Fehler, auf den ein Aufrufer reagieren kann.
- Anwendungen dürfen an der Grenze (`main`, Request-Handler, CLI-Befehle) einen einzigen opaken Fehlertyp der obersten Ebene verwenden, um Kontext mitzuführen. Gib diesen opaken Typ nicht über die öffentliche API einer Bibliothek preis.
- Bewahre den ursprünglichen Fehler (`source()` oder eine umschließende Variante), statt ihn in einen String umzuwandeln.
- `Display`-Meldungen sind kleingeschrieben und enden ohne Satzzeichen, damit Aufrufer sie zusammensetzen können.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Lints werden zentral konfiguriert {#pl-rs-022--lints-are-configured-centrally}

- Konfiguriere Lint-Level im Manifest (`[lints]` in `Cargo.toml` oder `[workspace.lints]` mit `lints.workspace = true` in Member-Crates), nicht in verstreuten Attributen auf Crate-Ebene.
- Aktiviere die Lint-Gruppen, auf die sich das Projekt einigt, und führe einzelne Ausnahmen mit einer Begründung direkt daneben auf.
- Ein `#![allow(...)]` auf Crate-Ebene ist ein Befund, es sei denn, ein Kommentar erklärt, warum der Lint für diesen Code falsch ist.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Cancellation-sicherer Async-Code {#pl-rs-023--cancellation-safe-async-code}

- Wird ein Future verworfen, bevor es abgeschlossen ist (zum Beispiel als unterlegener Zweig eines `select!` oder bei einem Timeout), gib an, ob die Operation cancellation-sicher ist. Dokumentiere jede Operation, die es nicht ist.
- Nimm nicht an, dass ein verworfenes Future seine Arbeit zurückgerollt hat. Übernimm Zustandsänderungen erst, nachdem der awaitete Schritt erfolgreich war, oder mache den Schritt idempotent.
- Halte das Future, das einen Lock oder eine offene Transaktion hält, aus `select!`-Zweigen heraus, die es mitten in der Operation verwerfen können.

### PL-RS-024 — Tests stehen neben dem Verhalten, das sie prüfen {#pl-rs-024--tests-sit-next-to-the-behaviour-they-check}

- Unit-Tests stehen in einem `#[cfg(test)] mod tests`-Block am Ende der Datei, die sie testen. Sie erreichen private Items, wodurch die öffentliche Oberfläche schmal bleibt.
- Integrationstests stehen in `tests/` und verwenden nur die öffentliche API.
- Testnamen geben das Verhalten an (`rejects_expired_token`), nicht allein den Funktionsnamen.
- Fixtures werden durch kleine Hilfsfunktionen aufgebaut, nicht indem Setup-Blöcke in jeden Test kopiert werden.
