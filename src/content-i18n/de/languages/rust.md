# Stil für Rust-Code

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Rostprofil

Pureline Rust folgt **idiomatic Rust** anstatt Java-Konventionen in die Rust-Syntax zu übersetzen. Ownership, lifetimes, enums, pattern matching, and the type system are core strengths, not obstacles to work around.

### PL-RS-001 — Idiomatic Naming and Visibility

- Types, traits, and enum variants: `PascalCase`.
- Functions, methods, modules, fields, and locals: `snake_case`.
- Constants and statics: `SCREAMING_SNAKE_CASE`.
- Crates: descriptive `snake_case` names (Cargo package names may use hyphens).
- Die Eigenschaften machen **not** erben das Java `I` Präfix. Bevorzuge `Storage`, nicht `IStorage`.
- Halten Sie Gegenstände privat, es sei denn, ein echter Verbraucher braucht eine breitere Sichtbarkeit; bevorzugen `pub(crate)`, wenn geeignet.
- Verwenden Sie `use`-Importe, anstatt lange voll qualifizierte Pfade zu wiederholen, außer wenn explizite Qualifikation Zweideutigkeit löst.

### PL-RS-002 — Schutzklauseln und linearer Fluss

Validierung früh und halten Sie den erfolgreichen Pfad auf der Basiseinrückungsebene.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Vermeiden Sie `else` nach einem Zweig, der bereits zurückkommt, bricht oder weitergeht. Eine `if`/`else` **expression** ist für die echte Zwei-Wege-Wertauswahl erlaubt, wo sie klarer als Alternativen ist. `let ... else` ist ein **vorgeschlagener Rust-Guard-Konstrukt**, nicht ein Verstoß gegen das Prinzip der avoid-`else`.

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

### PL-RS-003 — bevorzugt `Result`, `Option` und `?`

- Erwartete Fehler mit `Result<T, E>` darstellen.
- Stellen Sie Abwesenheit mit `Option<T>` dar.
- Verwenden Sie `?` für einfache Ausbreitung und `map_err`/`ok_or_else`, wenn sich der Fehlerkontext wirklich verbessert.
- Verwenden Sie `match`, wenn Ergebnisse eine eindeutige Handhabung benötigen; vermeiden Sie verwobene Ketten von Kombinatoren.
- Nicht stillschweigend `Result`-Werte verwerfen; entscheiden, ob man mit einer begründeten Erklärung propagiert, protokolliert, erholt oder bewusst ignoriert.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Beschränken `unwrap`, `expect` und `panic!`

Verwenden Sie `unwrap()` oder `expect()` niemals für gewöhnliche auswertbare Produktionsausfälle. Sie sind akzeptabel in dokumentierten Invarianten, die wirklich nicht verletzt werden können, und in Testcode (`#[cfg(test)]` Module und `tests/`), wo eine Panik ist der Fehlerbericht. `panic!` ist keine normale Fehlerbehandlungsstrategie. Bevorzugen Sie die explizite Handhabung über versteckte Fehler durch ungeprüfte Indexierung oder Konvertierungen.

### PL-RS-005 — `match` und Muster für die Verzweigung von Realstaaten verwenden

Verwenden Sie erschöpfende `match` für Enums und sinnvolle Alternativen; verwenden Sie `if let` oder `let ... else` für einfache Single-Pattern-Handhabung. `match` nicht auf normale boolesche Kontrollen zwingen. Vermeiden Sie breite `_` Arme, die still zukunftssichere Zustände masken, wenn enumerating Varianten klarer wäre.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — Eigentum muss abgestumpft werden

- Bevorzugen Sie die Kreditaufnahme von `&T` oder `&mut T`, wenn eine Eigentumsübertragung unnötig ist.
- Akzeptieren Sie die Werte, wenn die Callee wirklich Eigentum braucht.
- Minimieren Sie Klonen; verwenden Sie `.clone()`, wenn die Kosten und Zweck des Eigentums klar sind.
- Vermeiden Sie Nadeln `Arc`, `Rc`, `Box` und Innenveränderlichkeits-Wrapper.
- Bevorzugen Sie kurze Lebensdauern und explizite Eigentumsgrenzen; kämpfen Sie nicht mit künstlichen Lecks oder pervasive geteilten Besitz.

### PL-RS-007 — Standardmäßig nicht wandelbar

Verwenden Sie `let`, es sei denn, eine Mutation ist erforderlich. `let mut` lokal und eng scoped aufbewahren. Vermeiden Sie die Veränderlichkeit des Innenraums als Standard-Ersatz für gewöhnliche Eigentumsgestaltung. Nicht unnötig wandelbare Globale schaffen.

### PL-RS-008 — Züge erfordern eine echte Abstraktion

Erstellen Sie eine Eigenschaft für ein tatsächliches geteiltes Verhalten, API-Grenze, austauschbare Implementierung oder Testnaht. Nicht nur Eigenschaften einführen, um Java-Schnittstellen zu spiegeln oder Werks-/Manager-Schichten zu erstellen. Bevorzugen Sie einfache inhärente `impl`-Methoden für einzelne konkrete Implementierungen. Wählen Sie Generika oder Merkmalsobjekte basierend auf den tatsächlichen Anforderungen an Polymorphismus.

### PL-RS-009 — Kohäsion über Größe für `struct`, `impl` und Module

`PL-STRUCT-003` gilt für Rust als **kohesionsbewertung**, nicht als feste Zeilenanzahl. Eine zusammenhängende `impl` oder Staatsmaschine kann lang sein.. Durch unabhängige Verantwortung getrennt, nicht durch mechanische Extraktion von Merkmalen, Strukturen oder Dateien. Vermeiden Sie riesige unabhängige `mod.rs` oder `lib.rs` Dumpinggründe.

### PL-RS-010 — Modul und Dateidichte

Ein Rust-Feature/Quellordner sollte standardmäßig höchstens **10 handgepflegete Produktion `.rs`-Dateien** enthalten. Die Dateien werden nicht mit einem Code, Bindings und Metadaten-nur gezählt. `mod.rs`, `lib.rs` und `main.rs` zählen, wenn sie eine wesentliche, beibehaltene Logik enthalten, nicht wenn sie nur als Moduldeklarationen/Wiederexporte dienen. Dies ist ein Überprüfungsschwellenwert: die tatsächlichen Verantwortungsgrenzen entlang teilen, niemals in bedeutungslose verschachtelte Ordner.

Vorzugs explizite Module mit schmalen öffentlichen Oberflächen; interne Implementierung privat halten.

### PL-RS-011 — Verwendung von Rustfmt als Formatierungsbehörde

- Folgen Sie `rustfmt` / `cargo fmt` für Einrückung, Zeilenumbruch, Folgekommas und idiomatische Formatierung.
- Bevorzugen Sie kompakte Ausdrücke und ruft **, wenn rustfmt unterstützt sie**; Pureline darf nicht verlangen manuelle Formatierung, die rustfmt rückgängig macht.
- Schreiben Sie klare Ausdrucksstruktur anstatt Formatierung Direktiven, um die Sache zu bekämpfen.
- Verwenden Sie normale spange-begrenzte Steuerungsfluss; nicht emulieren Java Semikolon Regeln innerhalb expression-orientierten Rust.

Diese Regel überschreibt sprachunabhängige horizontal-call-Einstellungen, wenn sie mit der kanonischen Rust-Formatter kollidieren.

### PL-RS-012 — Vorziehen der klaren Iteration über Kleieketten

Iteratoren, Verschlüsse und Kombinatoren werden ermutigt, wenn sie direkt eine Transformation zum Ausdruck bringen. Bevorzugen Sie eine regelmäßige Schleife, wenn es Verzweigung, Nebenwirkungen, Kreditaufnahme, Debugging oder Hot-path Verhalten klarer macht. Vermeiden Sie Kettenadapter einfach, um die Linienzahl zu reduzieren.

### PL-RS-013 — Async Aufgaben haben Eigentum und Shutdown

- Verwenden Sie `async`/`.await` gegebenenfalls für eine synchrone Arbeitsbelastung.
- Blockieren Sie keinen Async-Executor mit langlaufender synchroner I/O- oder CPU-Arbeit; verwenden Sie bei Bedarf eine spezielle Blockierungsausführung oder Arbeiter-Threads.
- Verfolgen Sie Laichaufgaben, Annullierung, Fehlerausbreitung und geordnetes Herunterfahren.
- Do not create hidden fire-and-forget tasks for important work.
- Use channels and synchronization primitives with clearly defined ownership and backpressure.
- Never hold a blocking or asynchronous lock across `.await` unless the design explicitly requires and safely supports it.

### PL-RS-014 — Resource Lifecycles Should Be Predictable

Prefer RAII and `Drop` for synchronous cleanup. Explicitly await or coordinate shutdown for asynchronous resources because `Drop` cannot itself await. Expose a `close()` / `shutdown()` method when the operation can fail or must complete before process exit. Avoid hiding significant fallible cleanup inside destructors alone.

### PL-RS-015 — Unsafe Code Must Be Isolated and Justified

Safe Rust is the default. Use `unsafe` only where required by a genuine FFI, hardware, or performance boundary. Keep unsafe regions small, document their invariants with `// SAFETY:`, encapsulate them behind a minimal safe API, and test the boundary. Do not use `unsafe` simply to bypass normal ownership checks.

### PL-RS-016 — FFI and Platform Boundaries Are Explicit

For Wayland, GPU, system libraries, and similar native integration, keep raw handles, lifetime guarantees, ownership transfer, threading assumptions, and error conversion visible. Isolate platform-specific code in focused modules. Generierte Bindungen können von den üblichen Formatierungs- und Dichtegrenzen ausgeschlossen werden.

### PL-RS-017 — Bevorzugte Typen, die Invarianten kodieren

Verwenden Sie Enums und kleine neue Typen, wo sie reale ungültige Zustände verhindern oder äußere Grenzen klären. Nicht für jedes primitive ohne Nutzen Wickeln erstellen.. Bevorzugen Sie Konstruktoren, die Invarianten validieren und klare Fehler aufdecken. Machen Sie ungültige oder nicht nitialisierte Zustände schwierig zu repräsentieren.

### PL-RS-018 — Makroklüfte vermeiden

Bevorzugen Sie Funktionen, Merkmale, Enums und einfache Generika über Makros für Routineverhalten. Verwenden Sie deklarative Makros oder prozedurale Makros, wenn sie sinnvolle strukturelle Wiederholungen eliminieren. Erzeugtes Verhalten auffindbar und Diagnose verständlich halten..

### PL-RS-019 — Leistungsmessung vor Komplexität

Vermeiden Sie unnötige Zuweisungen, Klone, Referenzzählungen und Verriegeln gemessener Heißpfade. Bevorzugen Sie vorhersehbare Eigentümer- und Datenstrukturen, die dem Arbeitsaufwand entsprechen. Profil, bevor sauberer Code durch komplexe Low-Level-Optimierungen ersetzt wird, sowie Latenz und Durchsatz für UI/com-Stimor-Workloads validieren.

### PL-RS-020 — Prüfung und Werkzeugierung

- Führen Sie `cargo fmt --check` für die Formatierung und `cargo clippy` mit projektabhängigen Flinteneinstellungen aus.
- Testen Sie normale, ungültige und Ausfallpfade, insbesondere Stornierung, Lebenszyklus, FFI und Grenzen der Übereinstimmung.
- Warnungen absichtlich machen; Decken-`allow`-Attribute vermeiden, um breite funte Gruppen zum Schweigen zu bringen.
- Pureline Checker muss die Rust Syntax/AST-aware Inspektion (einschließlich `let ... else`, Muster-Matching, Makros und Ausdrucksrückgabe) verwenden, nicht Textmuster-Matching.

### PL-RS-021 — Fehlertypen entsprechen der Crate-Rolle

- Bibliotheken zeigen Fehler auf: ein `enum`, das `std::error::Error` und `Display` implementiert, mit einer Variante pro unterschiedlichen Fehler kann ein Anrufer auf handeln.
- Anwendungen können einen opaken Fehlertyp der oberen Ebene an der Grenze (`main`, Request-Handler, CLI-Befehle) verwenden, um Kontext zu tragen. Nicht diesen undurchsichtigen Typ durch die öffentliche API einer Bibliothek auslaufen.
- Preserve den Quellfehler (`source()` oder eine gewickelte Variante) anstatt ihn in einen String zu konvertieren.
- `Display`-Nachrichten sind klein und tragen keine hinterhältigen Interpunktionen, so dass Anrufer sie komponieren können.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Lints sind zentral konfiguriert

- Konfigurieren Sie die Füllstandsstufen im Manifest (`[lints]` in `Cargo.toml` oder `[workspace.lints]` mit `lints.workspace = true` in Stabkisten), nicht in Streukisten-Attributen.
- Aktivieren Sie die Flintengruppen, auf die sich das Projekt einigt, und listen Sie einzelne Ausnahmen mit einem Grund neben ihnen auf.
- Eine Kistenebene `#![allow(...)]` ist ein Ergebnis, es sei denn, ein Kommentar erklärt, warum die Flinte falsch für diesen Code ist.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Annullierungssicherer Async-Code

- Wenn eine Zukunft vor Abschluss der Operation fallen gelassen wird (z.B. als Verlustzweig von `select!` oder im Timeout), geben Sie an, ob die Operation stornierungssicher ist. Dokumentieren Sie jede Operation, die nicht ist..
- Nehmen Sie nicht an, dass eine fallende Zukunft ihre Arbeit zurückgerollt hat. Commit Zustandsänderungen nach dem erwarteten Schritt gelingt, oder machen Sie den Schritt idempotent.
- Halten Sie die Zukunft, die eine Sperre oder eine offene Transaktion aus `select!`-Zweigen, die es mitten in der Operation fallen lassen kann hält.

### PL-RS-024 — Die Parameter sitzen neben dem Verhalten, das sie überprüfen

- Unit Tests live in einem `#[cfg(test)] mod tests`-Block am Ende der Datei, die sie testen. Sie können private Gegenstände erreichen, die die öffentliche Oberfläche schmal halten..
- Integrationstests leben in `tests/` und verwenden nur die öffentliche API.
- Testnamen geben das Verhalten (`rejects_expired_token`) an, nicht der Funktionsname allein.
- Fixtures werden durch kleine Helferfunktionen aufgebaut, nicht durch Kopieren von Setup-Blöcken in jeden Test.
