# Rust-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## Rust-profiel {#rust-profile}

Pureline Rust volgt **idiomatisch Rust** en vertaalt Java-conventies niet naar Rust-syntaxis. Ownership, lifetimes, enums, patroonherkenning en het typesysteem zijn de kernsterktes van de taal, geen obstakels waar je omheen moet werken.

### PL-RS-001 — Idiomatische naamgeving en zichtbaarheid {#pl-rs-001--idiomatic-naming-and-visibility}

- Typen, traits en enumvarianten: `PascalCase`.
- Functies, methoden, modules, velden en lokale variabelen: `snake_case`.
- Constanten en statics: `SCREAMING_SNAKE_CASE`.
- Crates: beschrijvende namen in `snake_case` (Cargo-packagenamen mogen koppeltekens gebruiken).
- Traits erven het Java-voorvoegsel `I` **niet**. Geef de voorkeur aan `Storage`, niet aan `IStorage`.
- Houd items privé, tenzij een daadwerkelijke consument bredere zichtbaarheid nodig heeft; geef waar passend de voorkeur aan `pub(crate)`.
- Gebruik `use`-imports in plaats van lange volledig gekwalificeerde paden te herhalen, behalve waar expliciete kwalificatie een dubbelzinnigheid oplost.

### PL-RS-002 — Guard clauses en lineaire stroom {#pl-rs-002--guard-clauses-and-linear-flow}

Valideer vroeg en houd het succespad op het basisinspringniveau.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Vermijd `else` na een tak die al terugkeert, afbreekt of doorgaat. Een `if`/`else`-**expressie** is toegestaan voor echte keuze tussen twee waarden wanneer die duidelijker is dan de alternatieven. `let ... else` is een **aanbevolen guardconstructie in Rust** en geen schending van het principe om `else` te vermijden.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Geef de voorkeur aan `Result`, `Option` en `?` {#pl-rs-003--prefer-result-option-and}

- Stel verwachte fouten voor met `Result<T, E>`.
- Stel afwezigheid voor met `Option<T>`.
- Gebruik `?` voor eenvoudige propagatie en `map_err`/`ok_or_else` wanneer foutcontext de zaak echt verbetert.
- Gebruik `match` wanneer uitkomsten een eigen afhandeling nodig hebben; vermijd ingewikkelde ketens van combinators.
- Negeer `Result`-waarden niet stilzwijgend; beslis of je ze doorgeeft, logt, herstelt of bewust negeert met een onderbouwde toelichting.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Beperk `unwrap`, `expect` en `panic!` {#pl-rs-004--restrict-unwrap-expect-and-panic}

Gebruik `unwrap()` of `expect()` nooit voor gewone, herstelbare fouten in productie. Ze zijn acceptabel bij gedocumenteerde invarianten die echt niet geschonden kunnen worden, en in testcode (`#[cfg(test)]`-modules en `tests/`), waar een panic de foutmelding is. `panic!` is geen normale strategie voor foutafhandeling. Geef de voorkeur aan expliciete afhandeling boven verborgen fouten door ongecontroleerde indexering of conversies.

### PL-RS-005 — Gebruik `match` en patronen voor echte toestandsvertakking {#pl-rs-005--use-match-and-patterns-for-real-state-branching}

Gebruik een uitputtende `match` voor enums en betekenisvolle alternatieven; gebruik `if let` of `let ... else` voor eenvoudige afhandeling van één patroon. Dwing `match` niet af op gewone booleaanse controles. Vermijd brede `_`-armen die toekomstige toestanden stilzwijgend maskeren wanneer het opsommen van de varianten duidelijker zou zijn.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — Ownership moet bewust zijn {#pl-rs-006--ownership-must-be-deliberate}

- Geef de voorkeur aan lenen met `&T` of `&mut T` wanneer overdracht van ownership onnodig is.
- Accepteer eigen waarden wanneer de aangeroepen functie echt ownership nodig heeft.
- Beperk klonen; gebruik `.clone()` wanneer de ownershipkosten en het doel duidelijk zijn.
- Vermijd overbodige `Arc`, `Rc`, `Box` en wrappers voor interne mutabiliteit.
- Geef de voorkeur aan korte lifetimes en expliciete ownershipgrenzen; vecht niet tegen de borrow checker met kunstmatige leaks of alomtegenwoordig gedeeld ownership.

### PL-RS-007 — Standaard onveranderlijk {#pl-rs-007--immutable-by-default}

Gebruik `let`, tenzij mutatie nodig is. Houd `let mut` lokaal en beperkt in bereik. Vermijd interne mutabiliteit als standaardvervanger voor een gewoon ownershipontwerp. Maak geen onnodige veranderlijke globals.

### PL-RS-008 — Traits vereisen een echte abstractie {#pl-rs-008--traits-require-a-real-abstraction}

Maak een trait voor een daadwerkelijk gedeeld gedrag, een API-grens, een verwisselbare implementatie of een testnaad. Introduceer geen traits alleen om Java-interfaces te spiegelen of factory-/managerlagen te maken. Geef de voorkeur aan eenvoudige inherente `impl`-methoden voor enkelvoudige concrete implementaties. Kies generics of trait objects op basis van de werkelijke polymorfiebehoefte.

### PL-RS-009 — Samenhang boven omvang voor `struct`, `impl` en modules {#pl-rs-009--cohesion-over-size-for-struct-impl-and-modules}

`PL-STRUCT-003` geldt voor Rust als een **samenhangsreview**, niet als vaste limiet voor het aantal regels. Een samenhangende `impl` of toestandsmachine mag lang zijn. Splits op onafhankelijke verantwoordelijkheid, niet door mechanisch traits, structs of bestanden te extraheren. Vermijd enorme, niet-gerelateerde stortplaatsen in `mod.rs` of `lib.rs`.

### PL-RS-010 — Module- en bestandsdichtheid {#pl-rs-010--module-and-file-density}

Een feature- of bronmap in Rust moet standaard maximaal **10 handmatig onderhouden `.rs`-bestanden voor productie** bevatten. Tests, gegenereerde code, bindings en bestanden met alleen metadata tellen niet mee. `mod.rs`, `lib.rs` en `main.rs` tellen mee wanneer ze substantiële onderhouden logica bevatten, niet wanneer ze alleen dienen voor moduledeclaraties of re-exports. Dit is een drempel voor review: splits langs echte verantwoordelijkheidsgrenzen, nooit in zinloze geneste mappen.

Geef de voorkeur aan expliciete modules met een smal publiek oppervlak; houd de interne implementatie privé.

### PL-RS-011 — Gebruik rustfmt als autoriteit voor opmaak {#pl-rs-011--use-rustfmt-as-the-formatting-authority}

- Volg `rustfmt` / `cargo fmt` voor inspringing, regelafbreking, afsluitende komma's en idiomatische opmaak.
- Geef de voorkeur aan compacte expressies en aanroepen **wanneer rustfmt ze ondersteunt**; Pureline mag geen handmatige opmaak eisen die rustfmt ongedaan maakt.
- Schrijf een heldere expressiestructuur in plaats van opmaakdirectieven te gebruiken om de formatter tegen te werken.
- Gebruik gewone besturingsstroom met accolades; boots de puntkomma-regels van Java niet na in expressiegeoriënteerd Rust.

Deze regel gaat voor op taalonafhankelijke voorkeuren voor horizontale aanroepen wanneer die botsen met de canonieke Rust-formatter.

### PL-RS-012 — Geef de voorkeur aan duidelijke iteratie boven slimme ketens {#pl-rs-012--prefer-clear-iteration-over-clever-chains}

Iterators, closures en combinators worden aangemoedigd wanneer ze een transformatie direct uitdrukken. Geef de voorkeur aan een gewone lus wanneer die vertakking, neveneffecten, borrowing, debugging of het gedrag van hot paths duidelijker maakt. Vermijd het aaneenschakelen van adapters alleen om het aantal regels te beperken.

### PL-RS-013 — Async-taken hebben eigenaarschap en afsluiting {#pl-rs-013--async-tasks-have-ownership-and-shutdown}

- Gebruik `async`/`.await` voor asynchrone werklasten waar passend.
- Blokkeer een async executor niet met langlopende synchrone I/O of CPU-werk; gebruik waar nodig aparte blokkerende uitvoering of workerthreads.
- Houd gestarte taken, annulering, foutpropagatie en ordelijke afsluiting bij.
- Maak geen verborgen fire-and-forget-taken voor belangrijk werk.
- Gebruik channels en synchronisatieprimitieven met duidelijk gedefinieerd eigenaarschap en backpressure.
- Houd nooit een blokkerende of asynchrone lock vast over een `.await` heen, tenzij het ontwerp dat uitdrukkelijk vereist en veilig ondersteunt.

### PL-RS-014 — Levenscycli van resources moeten voorspelbaar zijn {#pl-rs-014--resource-lifecycles-should-be-predictable}

Geef de voorkeur aan RAII en `Drop` voor synchrone opruiming. Wacht expliciet op of coördineer de afsluiting van asynchrone resources, want `Drop` kan zelf niet awaiten. Bied een methode `close()` / `shutdown()` aan wanneer de bewerking kan mislukken of moet zijn voltooid voordat het proces eindigt. Verberg significante opruiming die kan falen niet uitsluitend in destructors.

### PL-RS-015 — Unsafe code moet geïsoleerd en onderbouwd zijn {#pl-rs-015--unsafe-code-must-be-isolated-and-justified}

Safe Rust is de standaard. Gebruik `unsafe` alleen waar een echte FFI-, hardware- of prestatiegrens dat vereist. Houd unsafe-gebieden klein, documenteer hun invarianten met `// SAFETY:`, kapsel ze in achter een minimale safe API en test de grens. Gebruik `unsafe` niet alleen om de normale ownershipcontroles te omzeilen.

### PL-RS-016 — FFI- en platformgrenzen zijn expliciet {#pl-rs-016--ffi-and-platform-boundaries-are-explicit}

Houd bij Wayland, GPU, systeembibliotheken en vergelijkbare native integratie ruwe handles, lifetimegaranties, ownershipoverdracht, aannames over threading en foutconversie zichtbaar. Isoleer platformspecifieke code in afgebakende modules. Gegenereerde bindings mogen worden uitgesloten van gewone opmaak- en dichtheidslimieten.

### PL-RS-017 — Geef de voorkeur aan typen die invarianten vastleggen {#pl-rs-017--prefer-types-that-encode-invariants}

Gebruik enums en kleine newtypes waar ze echte ongeldige toestanden voorkomen of externe grenzen verduidelijken. Maak niet zonder reden voor elk primitief type een wrapper. Geef de voorkeur aan constructors die invarianten valideren en duidelijke fouten teruggeven. Maak ongeldige of niet-geïnitialiseerde toestanden moeilijk voorstelbaar.

### PL-RS-018 — Vermijd onnodig vernuftige macro's {#pl-rs-018--avoid-macro-cleverness}

Geef voor routinegedrag de voorkeur aan functies, traits, enums en eenvoudige generics boven macro's. Gebruik declaratieve of procedurele macro's wanneer ze betekenisvolle structurele herhaling wegnemen. Houd gegenereerd gedrag vindbaar en diagnostiek begrijpelijk.

### PL-RS-019 — Meet prestaties vóór complexiteit {#pl-rs-019--measure-performance-before-complexity}

Vermijd onnodige allocaties, clones, referentietelling en locking in gemeten hot paths. Geef de voorkeur aan voorspelbaar ownership en datastructuren die bij de werklast passen. Profileer voordat je schone code vervangt door complexe optimalisaties op laag niveau, en valideer bij UI-/compositorwerklasten zowel de latency als de doorvoer.

### PL-RS-020 — Testen en tooling {#pl-rs-020--testing-and-tooling}

- Voer `cargo fmt --check` uit voor de opmaak en `cargo clippy` met de lintinstellingen waarover het project het eens is.
- Test normale paden, ongeldige paden en foutpaden, vooral rond annulering, levenscyclus, FFI en concurrencygrenzen.
- Maak waarschuwingen bewust; vermijd algemene `allow`-attributen om brede lintgroepen het zwijgen op te leggen.
- Pureline Checker moet Rust-bewuste inspectie op basis van syntaxis/AST gebruiken (inclusief `let ... else`, patroonherkenning, macro's en retourwaarden van expressies) en geen tekstuele patroonherkenning.

### PL-RS-021 — Foutentypen passen bij de rol van de crate {#pl-rs-021--error-types-match-the-crate-role}

- Bibliotheken stellen getypeerde fouten beschikbaar: een `enum` die `std::error::Error` en `Display` implementeert, met één variant per afzonderlijke fout waar een aanroeper iets mee kan.
- Applicaties mogen aan de grens (`main`, requesthandlers, CLI-commando's) één ondoorzichtig foutentype op het hoogste niveau gebruiken om context mee te geven. Laat dat ondoorzichtige type niet doorlekken in de publieke API van een bibliotheek.
- Behoud de oorspronkelijke fout (`source()` of een ingepakte variant) in plaats van die naar een string om te zetten.
- `Display`-berichten staan in kleine letters en hebben geen afsluitende leestekens, zodat aanroepers ze kunnen samenstellen.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Lints worden centraal geconfigureerd {#pl-rs-022--lints-are-configured-centrally}

- Configureer lintniveaus in het manifest (`[lints]` in `Cargo.toml`, of `[workspace.lints]` met `lints.workspace = true` in member crates), niet in verspreide attributen op cratniveau.
- Schakel de lintgroepen in waarover het project het eens is en vermeld individuele uitzonderingen met een reden erbij.
- Een `#![allow(...)]` op cratniveau is een bevinding, tenzij een opmerking uitlegt waarom de lint voor deze code niet klopt.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Annuleringsveilige async-code {#pl-rs-023--cancellation-safe-async-code}

- Wanneer een future wordt gedropt voordat hij is voltooid (bijvoorbeeld als verliezende tak van `select!`, of bij een timeout), geef dan aan of de bewerking annuleringsveilig is. Documenteer elke bewerking die dat niet is.
- Ga er niet van uit dat een gedropte future zijn werk heeft teruggedraaid. Leg toestandswijzigingen pas vast nadat de awaited stap is gelukt, of maak de stap idempotent.
- Houd de future die een lock of open transactie vasthoudt uit `select!`-takken die hem halverwege een bewerking kunnen droppen.

### PL-RS-024 — Tests staan naast het gedrag dat ze controleren {#pl-rs-024--tests-sit-next-to-the-behaviour-they-check}

- Unittests staan in een blok `#[cfg(test)] mod tests` aan het einde van het bestand dat ze testen. Ze hebben toegang tot private items, waardoor het publieke oppervlak smal blijft.
- Integratietests staan in `tests/` en gebruiken alleen de publieke API.
- Testnamen beschrijven het gedrag (`rejects_expired_token`) en niet alleen de functienaam.
- Fixtures worden opgebouwd met kleine hulpfuncties en niet door setupblokken in elke test te kopiëren.
