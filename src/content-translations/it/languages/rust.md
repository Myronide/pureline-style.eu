# Stile del codice Rust

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Rust {#rust-profile}

Pureline Rust segue il **Rust idiomatico**, invece di tradurre le convenzioni di Java nella sintassi di Rust. Ownership, lifetime, enum, pattern matching e sistema dei tipi sono punti di forza fondamentali, non ostacoli da aggirare.

### PL-RS-001 — Nomi idiomatici e visibilità {#pl-rs-001--idiomatic-naming-and-visibility}

- Tipi, trait e varianti di enum: `PascalCase`.
- Funzioni, metodi, moduli, campi e variabili locali: `snake_case`.
- Costanti e static: `SCREAMING_SNAKE_CASE`.
- Crate: nomi descrittivi in `snake_case` (i nomi dei pacchetti Cargo possono usare i trattini).
- I trait **non** ereditano il prefisso `I` di Java. Preferisci `Storage`, non `IStorage`.
- Mantieni gli elementi privati, a meno che un consumatore reale non richieda una visibilità più ampia; preferisci `pub(crate)` quando è adatto.
- Usa gli import con `use` invece di ripetere lunghi percorsi completamente qualificati, tranne dove la qualificazione esplicita risolve un'ambiguità.

### PL-RS-002 — Guard clause e flusso lineare {#pl-rs-002--guard-clauses-and-linear-flow}

Valida subito e mantieni il percorso di successo al livello di indentazione di base.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Evita `else` dopo un ramo che già esegue return, break o continue. Un'**espressione** `if`/`else` è ammessa per una vera scelta tra due valori, dove è più chiara delle alternative. `let ... else` è un **costrutto di guardia preferito in Rust**, non una violazione del principio di evitare `else`.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Preferire `Result`, `Option` e `?` {#pl-rs-003--prefer-result-option-and}

- Rappresenta i fallimenti previsti con `Result<T, E>`.
- Rappresenta l'assenza con `Option<T>`.
- Usa `?` per una propagazione diretta e `map_err`/`ok_or_else` quando il contesto dell'errore migliora davvero le cose.
- Usa `match` quando gli esiti richiedono una gestione distinta; evita catene contorte di combinatori.
- Non scartare in silenzio i valori `Result`: decidi se propagare, registrare nel log, ripristinare o ignorare deliberatamente con una motivazione giustificata.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Limitare `unwrap`, `expect` e `panic!` {#pl-rs-004--restrict-unwrap-expect-and-panic}

Non usare mai `unwrap()` o `expect()` per i normali fallimenti recuperabili in produzione. Sono accettabili per invarianti documentate che non possono davvero essere violate e nel codice di test (moduli `#[cfg(test)]` e `tests/`), dove un panic è il modo di segnalare il fallimento. `panic!` non è una normale strategia di gestione degli errori. Preferisci una gestione esplicita ai fallimenti nascosti dovuti a indicizzazioni o conversioni non controllate.

### PL-RS-005 — Usare `match` e i pattern per le vere ramificazioni di stato {#pl-rs-005--use-match-and-patterns-for-real-state-branching}

Usa un `match` esaustivo per gli enum e per le alternative significative; usa `if let` o `let ... else` per la gestione semplice di un singolo pattern. Non forzare `match` su normali controlli booleani. Evita rami `_` troppo ampi che mascherano in silenzio gli stati futuri, quando elencare le varianti sarebbe più chiaro.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — L'ownership deve essere deliberata {#pl-rs-006--ownership-must-be-deliberate}

- Preferisci il borrowing `&T` o `&mut T` quando il trasferimento di ownership non serve.
- Accetta valori posseduti quando il chiamato ha davvero bisogno dell'ownership.
- Riduci al minimo le clonazioni; usa `.clone()` quando il costo in termini di ownership e lo scopo sono chiari.
- Evita `Arc`, `Rc`, `Box` e wrapper di mutabilità interna non necessari.
- Preferisci lifetime brevi e confini di ownership espliciti; non lottare contro il borrow checker con leak artificiali o con un'ownership condivisa ovunque.

### PL-RS-007 — Immutabile per impostazione predefinita {#pl-rs-007--immutable-by-default}

Usa `let`, a meno che serva la mutazione. Mantieni `let mut` locale e con un ambito ristretto. Evita la mutabilità interna come sostituto predefinito di una normale progettazione dell'ownership. Non creare variabili globali mutabili superflue.

### PL-RS-008 — I trait richiedono una vera astrazione {#pl-rs-008--traits-require-a-real-abstraction}

Crea un trait per un comportamento condiviso reale, un confine di API, un'implementazione intercambiabile o un punto di innesto per i test. Non introdurre trait solo per rispecchiare le interfacce di Java o per creare livelli di factory/manager. Per una singola implementazione concreta preferisci semplici metodi `impl` inerenti. Scegli tra generics e trait object in base alle effettive esigenze di polimorfismo.

### PL-RS-009 — Coesione prima della dimensione per `struct`, `impl` e moduli {#pl-rs-009--cohesion-over-size-for-struct-impl-and-modules}

`PL-STRUCT-003` si applica a Rust come **revisione della coesione**, non come limite fisso di righe. Un `impl` o una macchina a stati coesi possono essere lunghi. Dividi per responsabilità indipendenti, non estraendo meccanicamente trait, struct o file. Evita enormi discariche non correlate in `mod.rs` o `lib.rs`.

### PL-RS-010 — Densità di moduli e file {#pl-rs-010--module-and-file-density}

Una cartella di funzionalità/sorgenti Rust dovrebbe contenere al massimo **10 file `.rs` di produzione mantenuti a mano** per impostazione predefinita. Test, codice generato, binding e file con soli metadati non contano. `mod.rs`, `lib.rs` e `main.rs` contano quando contengono una logica sostanziale mantenuta a mano, non quando servono solo per dichiarazioni di moduli o re-export. È una soglia di revisione: dividi lungo i reali confini di responsabilità, mai in cartelle annidate prive di senso.

Preferisci moduli espliciti con superfici pubbliche ristrette; mantieni privata l'implementazione interna.

### PL-RS-011 — Usare Rustfmt come autorità di formattazione {#pl-rs-011--use-rustfmt-as-the-formatting-authority}

- Segui `rustfmt` / `cargo fmt` per indentazione, a capo, virgole finali e formattazione idiomatica.
- Preferisci espressioni e chiamate compatte **quando rustfmt le supporta**; Pureline non deve pretendere una formattazione manuale che rustfmt annullerebbe.
- Scrivi una struttura delle espressioni chiara, invece di usare direttive di formattazione per contrastare il formatter.
- Usa il normale controllo di flusso delimitato da parentesi graffe; non imitare le regole di Java sui punti e virgola in un Rust orientato alle espressioni.

Questa regola prevale sulle preferenze indipendenti dal linguaggio per le chiamate orizzontali, quando sono in conflitto con il formatter canonico di Rust.

### PL-RS-012 — Preferire un'iterazione chiara alle catene astute {#pl-rs-012--prefer-clear-iteration-over-clever-chains}

Iteratori, closure e combinatori sono incoraggiati quando esprimono direttamente una trasformazione. Preferisci un normale ciclo quando rende più chiari ramificazioni, effetti collaterali, borrowing, debugging o comportamento dei percorsi critici. Evita di concatenare adapter solo per ridurre il numero di righe.

### PL-RS-013 — I task async hanno proprietà e arresto {#pl-rs-013--async-tasks-have-ownership-and-shutdown}

- Usa `async`/`.await` per i carichi di lavoro asincroni, dove opportuno.
- Non bloccare un executor async con I/O sincrono o lavoro di CPU di lunga durata; usa, se serve, un'esecuzione bloccante dedicata o thread worker.
- Tieni traccia dei task avviati, della cancellazione, della propagazione degli errori e di un arresto ordinato.
- Non creare task fire-and-forget nascosti per lavoro importante.
- Usa canali e primitive di sincronizzazione con proprietà e backpressure definite con chiarezza.
- Non mantenere mai un lock bloccante o asincrono attraverso un `.await`, a meno che il progetto non lo richieda esplicitamente e lo supporti in modo sicuro.

### PL-RS-014 — I cicli di vita delle risorse dovrebbero essere prevedibili {#pl-rs-014--resource-lifecycles-should-be-predictable}

Preferisci RAII e `Drop` per la pulizia sincrona. Per le risorse asincrone attendi esplicitamente o coordina l'arresto, perché `Drop` non può fare await. Esponi un metodo `close()` / `shutdown()` quando l'operazione può fallire o deve completarsi prima dell'uscita del processo. Evita di nascondere una pulizia significativa e fallibile soltanto nei distruttori.

### PL-RS-015 — Il codice unsafe deve essere isolato e giustificato {#pl-rs-015--unsafe-code-must-be-isolated-and-justified}

Safe Rust è la scelta predefinita. Usa `unsafe` solo dove lo richiede un vero confine di FFI, hardware o prestazioni. Mantieni piccole le regioni unsafe, documenta le loro invarianti con `// SAFETY:`, incapsulale dietro un'API sicura minimale e testa il confine. Non usare `unsafe` semplicemente per aggirare i normali controlli sull'ownership.

### PL-RS-016 — FFI e confini di piattaforma sono espliciti {#pl-rs-016--ffi-and-platform-boundaries-are-explicit}

Per Wayland, GPU, librerie di sistema e integrazioni native simili, mantieni visibili handle grezzi, garanzie sui lifetime, trasferimento dell'ownership, ipotesi sul threading e conversione degli errori. Isola il codice specifico della piattaforma in moduli mirati. I binding generati possono essere esclusi dalla normale formattazione e dai limiti di densità.

### PL-RS-017 — Preferire tipi che codificano le invarianti {#pl-rs-017--prefer-types-that-encode-invariants}

Usa enum e piccoli newtype dove impediscono stati non validi reali o chiariscono i confini esterni. Non creare wrapper per ogni primitivo senza un beneficio. Preferisci costruttori che validano le invarianti ed espongono errori chiari. Rendi difficile rappresentare stati non validi o non inizializzati.

### PL-RS-018 — Evitare l'astuzia delle macro {#pl-rs-018--avoid-macro-cleverness}

Per il comportamento di routine preferisci funzioni, trait, enum e semplici generics alle macro. Usa macro dichiarative o procedurali quando eliminano una ripetizione strutturale significativa. Mantieni individuabile il comportamento generato e comprensibili le diagnostiche.

### PL-RS-019 — Misurare le prestazioni prima della complessità {#pl-rs-019--measure-performance-before-complexity}

Evita allocazioni, clonazioni, conteggio dei riferimenti e locking superflui nei percorsi critici misurati. Preferisci un'ownership prevedibile e strutture dati adatte al carico di lavoro. Fai il profiling prima di sostituire codice pulito con ottimizzazioni complesse di basso livello, e valida la latenza oltre al throughput per i carichi di lavoro di UI/compositor.

### PL-RS-020 — Test e strumenti {#pl-rs-020--testing-and-tooling}

- Esegui `cargo fmt --check` per la formattazione e `cargo clippy` con le impostazioni di lint concordate nel progetto.
- Testa i percorsi normali, non validi e di fallimento, in particolare ai confini di cancellazione, ciclo di vita, FFI e concorrenza.
- Rendi intenzionali gli avvisi; evita gli attributi `allow` generalizzati che silenziano interi gruppi di lint.
- Pureline Checker deve usare un'ispezione basata sulla sintassi/AST di Rust (inclusi `let ... else`, pattern matching, macro e return di espressioni), non una corrispondenza testuale di pattern.

### PL-RS-021 — I tipi di errore corrispondono al ruolo del crate {#pl-rs-021--error-types-match-the-crate-role}

- Le librerie espongono errori tipizzati: un `enum` che implementa `std::error::Error` e `Display`, con una variante per ogni distinto fallimento su cui il chiamante può agire.
- Le applicazioni possono usare un unico tipo di errore opaco di primo livello al confine (`main`, gestori di richieste, comandi CLI) per portare il contesto. Non far trapelare quel tipo opaco attraverso l'API pubblica di una libreria.
- Preserva l'errore sorgente (`source()` o una variante che lo incapsula) invece di convertirlo in stringa.
- I messaggi `Display` sono in minuscolo e senza punteggiatura finale, così i chiamanti possono comporli.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — I lint sono configurati in modo centralizzato {#pl-rs-022--lints-are-configured-centrally}

- Configura i livelli dei lint nel manifest (`[lints]` in `Cargo.toml`, oppure `[workspace.lints]` con `lints.workspace = true` nei crate membri), non in attributi sparsi a livello di crate.
- Abilita i gruppi di lint concordati nel progetto ed elenca le singole eccezioni con una motivazione accanto.
- Un `#![allow(...)]` a livello di crate è un rilievo, a meno che un commento non spieghi perché il lint è sbagliato per questo codice.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Codice async sicuro rispetto alla cancellazione {#pl-rs-023--cancellation-safe-async-code}

- Quando una future viene rilasciata prima di completarsi (ad esempio come ramo perdente di `select!`, o per un timeout), dichiara se l'operazione è sicura rispetto alla cancellazione. Documenta ogni operazione che non lo è.
- Non dare per scontato che una future rilasciata abbia annullato il proprio lavoro. Conferma le modifiche di stato dopo che il passaggio atteso è riuscito, oppure rendi il passaggio idempotente.
- Tieni la future che detiene un lock o una transazione aperta fuori dai rami di `select!` che possono rilasciarla a metà operazione.

### PL-RS-024 — I test stanno accanto al comportamento che verificano {#pl-rs-024--tests-sit-next-to-the-behaviour-they-check}

- I test unitari stanno in un blocco `#[cfg(test)] mod tests` alla fine del file che testano. Possono accedere agli elementi privati, il che mantiene stretta la superficie pubblica.
- I test di integrazione stanno in `tests/` e usano solo l'API pubblica.
- I nomi dei test dichiarano il comportamento (`rejects_expired_token`), non solo il nome della funzione.
- Le fixture si costruiscono con piccole funzioni di supporto, non copiando i blocchi di setup in ogni test.
