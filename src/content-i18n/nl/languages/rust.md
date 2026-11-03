# Codestijl voor Rust

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## Rust Profile

Pureline Rust volgt **idiomatic Rust** in plaats van Java-conventies te vertalen naar Rust syntaxis. Eigendom, levensduur, enums, patroon matching, en het type systeem zijn kern sterktes, geen obstakels om te werken.

### PL-RS-001. Idiomatische naamgeving en zichtbaarheid

- Types, kenmerken en enum varianten: `PascalCase`.
- Functies, methoden, modules, velden en locals: `snake_case`.
- Constanten en statische ruis: `SCREAMING_SNAKE_CASE`.
- Kratten: beschrijvende `snake_case` namen (Cargo verpakking namen kunnen hyphen gebruiken).
- Traits do **not** erfde het Java `I` voorvoegsel. Liever `Storage`, niet `IStorage`.
- Houd items privé, tenzij een werkelijke consument een breder zicht nodig heeft; geef de voorkeur aan `pub(crate)` indien dat geschikt is.
- Gebruik de invoer van `use` in plaats van lange, volledig gekwalificeerde paden te herhalen, tenzij expliciete kwalificatie dubbelzinnigheid oplost.

### PL-RS-002. Guard Clausles en Linear Flow

Valideer vroeg en houd het succesvolle pad op het basisinspringen niveau.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Vermijd `else` na een tak die al terugkomt, breekt of doorgaat. Een `if`/`else` **expression** is toegestaan voor echte tweerichtingswaardeselectie waar het duidelijker is dan alternatieven. `let ... else` is een **-voorkeurswacht **, geen schending van het never-`else`-principe.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003. Liever `Result`, `Option` en `?`

- Verwachte storingen met `Result<T, E>` weergeven.
- Verschijnen met `Option<T>`.
- Gebruik `?` voor eenvoudige voortplanting en `map_err`/`ok_or_else` wanneer foutcontext echt verbetert.
- Gebruik `match` wanneer de uitkomsten een aparte behandeling vereisen; vermijd ketens van combinatoren met een kromme.
- `Result`-waarden niet stilletjes weggooien; beslissen of ze zich verspreiden, loggen, herstellen of bewust negeren met een gerechtvaardigde verklaring.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Restrict `unwrap`, `expect`, and `panic!`

Never use `unwrap()` or `expect()` for ordinary recoverable production failures. They are acceptable in documented invariants that really cannot be violated, and inside test code (`#[cfg(test)]` modules and `tests/`), where a panic is the failure report. `panic!` is not a normal error-handling strategy. Prefer explicit handling over hidden failure via unchecked indexing or conversions.

### PL-RS-005. Gebruik `match` en patronen voor Real State Branching

Gebruik een uitgebreide `match` voor enums en zinvolle alternatieven; gebruik `if let` of `let ... else` voor eenvoudige enkele-pattern handling. Dwing `match` niet op gewone booleaanse controles. Vermijd brede `_`-armen die stilletjes toekomstige staten maskeren wanneer opsomming varianten zou duidelijker zijn.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006. Eigendom moet weloverwogen zijn

- Lenen van `&T` of `&mut T` is de voorkeur wanneer eigendomsoverdracht niet nodig is.
- Accepteer eigendomswaarden wanneer de calle echt eigendom nodig heeft.
- Minimaliseer klonen; gebruik `.clone()` wanneer de eigendomskosten en het doel ervan duidelijk zijn.
- Vermijd onnodig `Arc`, `Rc`, `Box` en interieur muteerbaarheidswikkels.
- Liever korte levensduurn en expliciete eigendomsgrenzen; vecht niet tegen de leningcontrole met kunstmatige lekken of doordringende gedeelde eigendom.

### PL-RS-007. Onveranderbaar door Standaard

Gebruik `let` tenzij mutatie nodig is. Houd `let mut` lokaal en nauw bereik. Vermijd interieurmuteerbaarheid als standaardvervanger voor gewoon eigendomsontwerp. Maak geen onnodige veranderlijke wereldbolen.

### PL-RS-008. Traits Vereist een echte abstractie

Maak een eigenschap voor een echt gedeeld gedrag, API grens, verwisselbare implementatie, of testnaden. Niet alleen kenmerken invoeren om Java-interfaces te spiegelen of fabrieks-/manager-lagen te maken. Voorkeur eenvoudige inherente `impl` methoden voor enkele concrete implementaties. Kies generische of kenmerkende objecten op basis van de werkelijke eisen inzake polymorfisme.

### PL-RS-009. Cohesie over grootte voor `struct`, `impl`, en modules

`PL-STRUCT-003` geldt voor Rust als **cohesion review**, niet als een vaste lijn-tellingslimiet. Een samenhangende `impl` of staat machine kan lang zijn. Splits door onafhankelijke verantwoordelijkheid, niet door het mechanisch uitpakken van eigenschappen, structuren of bestanden. Vermijd enorme niet-verbonden `mod.rs` of `lib.rs` dumping gronden.

### PL-RS-010. Module en bestandsdinensity

Een Rust-functie/bronmap moet maximaal **10 hand-onderhoud productie `.rs` bestanden** standaard bevatten. Tests, gegenereerde code, bindingen en alleen metadata bestanden tellen niet mee. `mod.rs`, `lib.rs` en `main.rs` tellen wanneer ze een aanzienlijke behouden logica bevatten, niet alleen als moduleaangiften/herexporten. Dit is een herzieningsdrempel: opsplitsen langs de werkelijke verantwoordelijkheidsgrenzen, nooit in betekenisloze nested mappen.

Prefereer expliciete modules met smalle publieke oppervlakken; houd interne implementatie privé.

### PL-RS-011. Gebruik Rustfmt als de opmaak-autoriteit

- Volg `rustfmt` / `cargo fmt` voor inspringen, lijnwikkeling, trailing komma's, en idiomatische formattering.
- Prefereer compacte expressies en belt ** wanneer de versterkers ** ondersteunen; Pureline mag geen handmatige opmaak eisen die de formattering ongedaan maakt.
- Schrijf een duidelijke expressiestructuur in plaats van het gebruik van formattering richtlijnen om de formatter te bestrijden.
- Gebruik gewone brace-delimited controle flow; niet emuleren Java semicolon regels binnen expressie-georiënteerde Rust.

Deze regel overschrijft taal-onafhankelijke horizontale-aanroep voorkeuren als ze in conflict komen met de canonieke Rust formatter.

### PL-RS-012. Prefereer duidelijke iteratie boven Clever-kettingen

Iteratoren, sluitingen en combinatoren worden aangemoedigd wanneer ze direct een transformatie uitdrukken. Liever een regelmatige lus wanneer het vertakking, bijwerkingen, lenen, debuggen of hot-path gedrag duidelijker maakt. Vermijd kettingadapters om het aantal lijnen te verminderen.

### PL-RS-013. Async taken hebben eigendom en afsluiten

- Gebruik `async`/`.await` waar nodig voor asynchrone workloads.
- Blokkeer geen async-executor met langlopend synchroon I/O of CPU werk; gebruik speciale blokkeeruitvoering of werkdraden indien nodig.
- Track gebroede taken, annulering, fout propagatie, en ordelijke uitschakeling.
- Maak geen verborgen brand-en-vergeet taken voor belangrijk werk.
- Gebruik kanalen en synchronisatie primitieven met duidelijk omschreven eigendom en tegendruk.
- Houd nooit een blokkerende of asynchrone vergrendeling over `.await`, tenzij het ontwerp expliciet vereist en veilig ondersteunt.

### PL-RS-014. Resource Lifecycles moeten voorspelbaar zijn

Voorkeur voor RAII en `Drop` voor synchrone opruiming. Expliciet wachten of coördineren afsluiten voor asynchrone resources omdat `Drop` zelf niet kan wachten. Stel een `close()` / `shutdown()` methode in werking wanneer de bewerking kan mislukken of voltooid moet zijn voordat het proces wordt afgesloten. Vermijd het verbergen van significante feilbare schoonmaak in de verwoesters alleen.

### PL-RS-015. Onveilige code moet worden geïsoleerd en gerechtvaardigd

Safe Rust is the default. Use `unsafe` only where required by a genuine FFI, hardware, or performance boundary. Keep unsafe regions small, document their invariants with `// SAFETY:`, encapsulate them behind a minimal safe API, and test the boundary. Do not use `unsafe` simply to bypass normal ownership checks.

### PL-RS-016. FFI en platform grenzen zijn expliciet

Voor Wayland, GPU, systeembibliotheken en soortgelijke inheemse integratie, houden rauwe handvatten, levenslange garanties, eigendomsoverdracht, threading aannames, en foutconversie zichtbaar. Isoleer platformspecifieke code in gerichte modules. Gegenereerde bindingen kunnen worden uitgesloten van gewone opmaak- en dichtheidslimieten.

### PL-RS-017. Liever typen die coderen in...

Gebruik enums en kleine nieuwe types waar ze echte ongeldige staten voorkomen of externe grenzen verduidelijken. Maak geen wikkels voor elke primitieve zonder voordeel. Liever constructors die valideren in de SUV's en duidelijke fouten blootleggen. Maak ongeldige of niet-geïnitialiseerde toestanden moeilijk te vertegenwoordigen.

### PL-RS-018. Vermijd macro-cleverigheid

Liever functies, eigenschappen, enums, en eenvoudige generics over macro's voor routine gedrag. Gebruik declaratieve of procedurele macro's wanneer ze een zinvolle structurele herhaling elimineren. Houd gegenereerd gedrag ontdekbaar en diagnostiek begrijpelijk.

### PL-RS-019. Meet prestaties vóór complexiteit

Vermijd onnodige toewijzingen, klonen, referentietellingen en vergrendeling in gemeten hete paden. Voorspelbare eigendoms- en datastructuren die geschikt zijn voor de werklast. Profiel voordat schone code te vervangen door complexe low-level optimalisaties, en valideren van de opslag en doorvoer voor UI/compositor workloads.

### PL-RS-020. Testen en bewerken

- Run `cargo fmt --check` voor opmaak en `cargo clippy` met project-agreed instellingen.
- Test normale, ongeldige en foutpaden, met name annulering, levenscyclus, FFI, en concurrency grenzen.
- Maak waarschuwingen opzettelijk; vermijd deken `allow` attributen om brede groepen te zwijgen.
- Pureline Checker moet gebruik maken van Rust syntax / AST-aware inspectie (inclusief `let ... else`, patroon matching, macro's, en expressie terugkeert), niet tekstuele patroon matching.

### PL-RS-021. Fouttypen komen overeen met de Crate rol

- Library's tonen getypte fouten: een `enum` die `std::error::Error` en `Display` implementeert, met één variant per duidelijke storing waar een beller op kan reageren.
- Toepassingen kunnen één ondoorzichtige top-level fouttype gebruiken aan de grens (`main`, verzoekverwerkers, CLI commando's) om context te dragen. Lek dat ondoorzichtige type niet via de openbare API van een bibliotheek.
- Bewaar de bronfout (`source()` of een omwikkelde variant) in plaats van het naar een string te converteren.
- `Display`-berichten zijn kleine letters en bevatten geen punctuatie, zodat bellers ze kunnen samenstellen.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022. Lints zijn centraal geconfigureerd

- Configure lint levels in the manifest (`[lints]` in `Cargo.toml`, or `[workspace.lints]` with `lints.workspace = true` in member crates), not in scattered crate-level attributes.
- Activeer de groepen van de die het project onderschrijft, en geef een lijst van individuele uitzonderingen met een reden ernaast.
- Een krate-niveau `#![allow(...)]` is een bevinding tenzij een commentaar verklaart waarom de krate-niveau is fout voor deze code.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023. Annulering-veilig Async Code

- Wanneer een toekomst wordt gesloopt voordat deze voltooid is (bijvoorbeeld als verliezende tak van `select!`, of op timeout), geef dan aan of de operatie annuleringsveilig is. Documenteer elke handeling die dat niet is.
- Neem niet aan dat een vervallen toekomst zijn werk heeft teruggedraaid. Verbind staat verandert nadat de verwachte stap slaagt, of maak de stap ideaal.
- Houd de toekomst die een slot of een open transactie uit `select!`-kantoren houdt die deze midden in werking kunnen laten vallen.

### PL-RS-024. Tests zitten naast het gedrag ze controleren

- De tests van de eenheid leven in een `#[cfg(test)] mod tests` blok aan het einde van het bestand dat ze testen. Ze kunnen privé-artikelen bereiken, waardoor het publieke oppervlak smal blijft.
- Integratietests leven in `tests/` en gebruiken alleen de publieke API.
- Testnamen geven het gedrag aan (`rejects_expired_token`), niet de functienaam alleen.
- Fixtures worden gebouwd door kleine helper functies, niet door het kopiëren van setup blokken in elke test.
