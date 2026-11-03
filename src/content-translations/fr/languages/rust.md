# Style de code Rust

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Rust {#rust-profile}

Pureline Rust suit le **Rust idiomatique** plutôt que de traduire les conventions de Java en syntaxe Rust. L'ownership, les durées de vie (lifetimes), les enums, le pattern matching et le système de types sont des forces essentielles, pas des obstacles à contourner.

### PL-RS-001 — Nommage et visibilité idiomatiques {#pl-rs-001--idiomatic-naming-and-visibility}

- Types, traits et variantes d'enum : `PascalCase`.
- Fonctions, méthodes, modules, champs et variables locales : `snake_case`.
- Constantes et statics : `SCREAMING_SNAKE_CASE`.
- Crates : noms descriptifs en `snake_case` (les noms de packages Cargo peuvent contenir des traits d'union).
- Les traits n'héritent **pas** du préfixe `I` de Java. Préférez `Storage` à `IStorage`.
- Gardez les éléments privés, sauf si un consommateur réel a besoin d'une visibilité plus large ; préférez `pub(crate)` lorsque c'est adapté.
- Utilisez des imports `use` plutôt que de répéter de longs chemins entièrement qualifiés, sauf lorsqu'une qualification explicite lève une ambiguïté.

### PL-RS-002 — Guard clauses et flux linéaire {#pl-rs-002--guard-clauses-and-linear-flow}

Validez tôt et gardez le chemin nominal au niveau d'indentation de base.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Évitez `else` après une branche qui fait déjà un return, un break ou un continue. Une **expression** `if`/`else` est permise pour un véritable choix de valeur entre deux possibilités, lorsqu'elle est plus claire que les alternatives. `let ... else` est une **construction de guard privilégiée en Rust**, et non une violation du principe d'évitement de `else`.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Préférer `Result`, `Option` et `?` {#pl-rs-003--prefer-result-option-and}

- Représentez les échecs attendus avec `Result<T, E>`.
- Représentez l'absence avec `Option<T>`.
- Utilisez `?` pour une propagation directe, et `map_err`/`ok_or_else` lorsque le contexte d'erreur apporte vraiment quelque chose.
- Utilisez `match` lorsque les résultats demandent des traitements distincts ; évitez les chaînes alambiquées de combinateurs.
- Ne jetez pas silencieusement les valeurs `Result` ; décidez s'il faut les propager, les journaliser, s'en remettre, ou les ignorer délibérément avec une justification.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Restreindre `unwrap`, `expect` et `panic!` {#pl-rs-004--restrict-unwrap-expect-and-panic}

N'utilisez jamais `unwrap()` ni `expect()` pour des échecs ordinaires et récupérables en production. Ils sont acceptables pour des invariants documentés qui ne peuvent vraiment pas être violés, et dans le code de test (modules `#[cfg(test)]` et `tests/`), où un panic tient lieu de rapport d'échec. `panic!` n'est pas une stratégie normale de gestion d'erreurs. Préférez un traitement explicite à un échec caché par des indexations ou des conversions non vérifiées.

### PL-RS-005 — Utiliser `match` et les patterns pour les vraies branches d'état {#pl-rs-005--use-match-and-patterns-for-real-state-branching}

Utilisez un `match` exhaustif pour les enums et les alternatives significatives ; utilisez `if let` ou `let ... else` pour le traitement simple d'un seul pattern. N'imposez pas `match` aux vérifications booléennes ordinaires. Évitez les branches `_` trop larges qui masquent silencieusement des états futurs lorsque l'énumération des variantes serait plus claire.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — L'ownership doit être délibéré {#pl-rs-006--ownership-must-be-deliberate}

- Préférez emprunter `&T` ou `&mut T` lorsque le transfert d'ownership n'est pas nécessaire.
- Acceptez des valeurs possédées lorsque l'appelé a réellement besoin de l'ownership.
- Réduisez le clonage au minimum ; utilisez `.clone()` lorsque son coût et son objectif en matière d'ownership sont clairs.
- Évitez les `Arc`, `Rc`, `Box` et wrappers de mutabilité intérieure superflus.
- Préférez des durées de vie courtes et des frontières d'ownership explicites ; ne luttez pas contre le borrow checker avec des fuites artificielles ou une propriété partagée omniprésente.

### PL-RS-007 — Immuable par défaut {#pl-rs-007--immutable-by-default}

Utilisez `let`, sauf si une mutation est nécessaire. Gardez `let mut` local et de portée étroite. Évitez la mutabilité intérieure comme substitut par défaut à une conception d'ownership ordinaire. Ne créez pas de globales mutables inutiles.

### PL-RS-008 — Les traits exigent une vraie abstraction {#pl-rs-008--traits-require-a-real-abstraction}

Créez un trait pour un comportement réellement partagé, une frontière d'API, une implémentation interchangeable ou un point d'insertion pour les tests. N'introduisez pas de traits simplement pour imiter les interfaces Java ou pour créer des couches de factory/manager. Préférez de simples méthodes `impl` inhérentes pour les implémentations concrètes uniques. Choisissez entre génériques et objets trait selon les besoins réels de polymorphisme.

### PL-RS-009 — Cohésion avant la taille pour `struct`, `impl` et les modules {#pl-rs-009--cohesion-over-size-for-struct-impl-and-modules}

`PL-STRUCT-003` s'applique à Rust comme une **revue de cohésion**, et non comme une limite fixe de nombre de lignes. Un `impl` ou une machine à états cohésifs peuvent être longs. Découpez selon une responsabilité indépendante, pas en extrayant mécaniquement des traits, des structs ou des fichiers. Évitez les énormes fourre-tout `mod.rs` ou `lib.rs` sans lien interne.

### PL-RS-010 — Densité des modules et des fichiers {#pl-rs-010--module-and-file-density}

Un dossier de fonctionnalité/source Rust doit contenir au maximum **10 fichiers `.rs` de production maintenus à la main** par défaut. Les tests, le code généré, les bindings et les fichiers contenant uniquement des métadonnées ne comptent pas. `mod.rs`, `lib.rs` et `main.rs` comptent lorsqu'ils contiennent une logique maintenue substantielle, mais pas lorsqu'ils ne servent qu'à des déclarations de modules ou à des réexportations. Il s'agit d'un seuil de revue : découpez selon de véritables frontières de responsabilité, jamais en dossiers imbriqués dénués de sens.

Préférez des modules explicites aux surfaces publiques étroites ; gardez l'implémentation interne privée.

### PL-RS-011 — Utiliser rustfmt comme autorité de mise en forme {#pl-rs-011--use-rustfmt-as-the-formatting-authority}

- Suivez `rustfmt` / `cargo fmt` pour l'indentation, le retour à la ligne, les virgules finales et la mise en forme idiomatique.
- Préférez des expressions et des appels compacts **lorsque rustfmt les supporte** ; Pureline ne doit pas exiger une mise en forme manuelle que rustfmt défera.
- Écrivez une structure d'expression claire plutôt que d'utiliser des directives de mise en forme pour lutter contre le formateur.
- Utilisez un flux de contrôle ordinaire délimité par des accolades ; n'imitez pas les règles de points-virgules de Java dans un Rust orienté expressions.

Cette règle l'emporte sur les préférences d'appel horizontal indépendantes du langage lorsqu'elles entrent en conflit avec le formateur canonique de Rust.

### PL-RS-012 — Préférer une itération claire aux chaînes astucieuses {#pl-rs-012--prefer-clear-iteration-over-clever-chains}

Les itérateurs, les closures et les combinateurs sont encouragés lorsqu'ils expriment directement une transformation. Préférez une boucle ordinaire lorsqu'elle rend plus clairs le branchement, les effets de bord, l'emprunt, le débogage ou le comportement du chemin critique. Évitez d'enchaîner des adaptateurs uniquement pour réduire le nombre de lignes.

### PL-RS-013 — Les tâches async ont un propriétaire et un arrêt {#pl-rs-013--async-tasks-have-ownership-and-shutdown}

- Utilisez `async`/`.await` pour les charges de travail asynchrones lorsque c'est approprié.
- Ne bloquez pas un exécuteur async avec des E/S synchrones ou du calcul CPU de longue durée ; utilisez une exécution bloquante dédiée ou des threads de travail selon les besoins.
- Suivez les tâches lancées, l'annulation, la propagation des erreurs et l'arrêt ordonné.
- Ne créez pas de tâches cachées lancées sans suivi (fire-and-forget) pour un travail important.
- Utilisez les canaux et les primitives de synchronisation avec une propriété et une contre-pression (backpressure) clairement définies.
- Ne conservez jamais un verrou bloquant ou asynchrone à travers un `.await`, sauf si la conception l'exige explicitement et le supporte en toute sûreté.

### PL-RS-014 — Les cycles de vie des ressources doivent être prévisibles {#pl-rs-014--resource-lifecycles-should-be-predictable}

Préférez RAII et `Drop` pour le nettoyage synchrone. Attendez explicitement ou coordonnez l'arrêt des ressources asynchrones, car `Drop` ne peut pas attendre lui-même. Exposez une méthode `close()` / `shutdown()` lorsque l'opération peut échouer ou doit se terminer avant la fin du processus. Évitez de cacher un nettoyage significatif et susceptible d'échouer uniquement dans des destructeurs.

### PL-RS-015 — Le code unsafe doit être isolé et justifié {#pl-rs-015--unsafe-code-must-be-isolated-and-justified}

Le Rust sûr est la valeur par défaut. N'utilisez `unsafe` que là où une frontière FFI, matérielle ou de performance authentique l'exige. Gardez les régions unsafe petites, documentez leurs invariants avec `// SAFETY:`, encapsulez-les derrière une API sûre minimale et testez la frontière. N'utilisez pas `unsafe` simplement pour contourner les vérifications d'ownership normales.

### PL-RS-016 — Les frontières FFI et plateforme sont explicites {#pl-rs-016--ffi-and-platform-boundaries-are-explicit}

Pour Wayland, le GPU, les bibliothèques système et les intégrations natives similaires, gardez visibles les handles bruts, les garanties de durée de vie, les transferts d'ownership, les hypothèses de threading et la conversion des erreurs. Isolez le code propre à une plateforme dans des modules ciblés. Les bindings générés peuvent être exclus de la mise en forme ordinaire et des limites de densité.

### PL-RS-017 — Préférer les types qui encodent les invariants {#pl-rs-017--prefer-types-that-encode-invariants}

Utilisez des enums et de petits newtypes lorsqu'ils empêchent de réels états invalides ou clarifient des frontières externes. Ne créez pas de wrapper pour chaque primitive sans bénéfice. Préférez des constructeurs qui valident les invariants et exposent des erreurs claires. Rendez difficiles à représenter les états invalides ou non initialisés.

### PL-RS-018 — Éviter l'astuce des macros {#pl-rs-018--avoid-macro-cleverness}

Préférez les fonctions, les traits, les enums et les génériques simples aux macros pour les comportements courants. Utilisez des macros déclaratives ou procédurales lorsqu'elles éliminent une répétition structurelle significative. Gardez le comportement généré découvrable et les diagnostics compréhensibles.

### PL-RS-019 — Mesurer la performance avant d'introduire de la complexité {#pl-rs-019--measure-performance-before-complexity}

Évitez les allocations, les clones, le comptage de références et les verrous inutiles dans les chemins critiques mesurés. Préférez un ownership prévisible et des structures de données adaptées à la charge de travail. Faites un profilage avant de remplacer du code propre par des optimisations bas niveau complexes, et validez la latence autant que le débit pour les charges de travail d'interface ou de compositeur.

### PL-RS-020 — Tests et outillage {#pl-rs-020--testing-and-tooling}

- Exécutez `cargo fmt --check` pour la mise en forme et `cargo clippy` avec les réglages de lints convenus dans le projet.
- Testez les chemins normaux, invalides et d'échec, en particulier aux frontières d'annulation, de cycle de vie, de FFI et de concurrence.
- Rendez les avertissements intentionnels ; évitez les attributs `allow` généralisés qui font taire de larges groupes de lints.
- Pureline Checker doit utiliser une inspection qui comprend la syntaxe et l'AST de Rust (y compris `let ... else`, le pattern matching, les macros et les retours d'expression), et non une recherche textuelle de motifs.

### PL-RS-021 — Les types d'erreur correspondent au rôle de la crate {#pl-rs-021--error-types-match-the-crate-role}

- Les bibliothèques exposent des erreurs typées : un `enum` qui implémente `std::error::Error` et `Display`, avec une variante par échec distinct sur lequel un appelant peut agir.
- Les applications peuvent utiliser un unique type d'erreur opaque de haut niveau à la frontière (`main`, gestionnaires de requêtes, commandes CLI) pour porter le contexte. Ne laissez pas ce type opaque fuir dans l'API publique d'une bibliothèque.
- Préservez l'erreur source (`source()` ou une variante qui l'enveloppe) au lieu de la convertir en chaîne de caractères.
- Les messages `Display` sont en minuscules et sans ponctuation finale, afin que les appelants puissent les composer.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Les lints sont configurés de façon centralisée {#pl-rs-022--lints-are-configured-centrally}

- Configurez les niveaux de lint dans le manifeste (`[lints]` dans `Cargo.toml`, ou `[workspace.lints]` avec `lints.workspace = true` dans les crates membres), et non dans des attributs dispersés au niveau des crates.
- Activez les groupes de lints convenus par le projet, et listez les exceptions individuelles avec une raison à côté de chacune.
- Un `#![allow(...)]` au niveau de la crate est un constat à traiter, sauf si un commentaire explique pourquoi le lint est inadapté à ce code.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Code async sûr à l'annulation {#pl-rs-023--cancellation-safe-async-code}

- Lorsqu'un future est abandonné (dropped) avant d'être terminé (par exemple comme branche perdante d'un `select!`, ou lors d'un timeout), indiquez si l'opération est sûre à l'annulation. Documentez toute opération qui ne l'est pas.
- Ne supposez pas qu'un future abandonné a annulé son travail. Validez les changements d'état une fois que l'étape attendue a réussi, ou rendez l'étape idempotente.
- Gardez le future qui détient un verrou ou une transaction ouverte hors des branches de `select!` susceptibles de l'abandonner en cours d'opération.

### PL-RS-024 — Les tests se placent à côté du comportement qu'ils vérifient {#pl-rs-024--tests-sit-next-to-the-behaviour-they-check}

- Les tests unitaires se trouvent dans un bloc `#[cfg(test)] mod tests` à la fin du fichier qu'ils testent. Ils peuvent accéder aux éléments privés, ce qui garde la surface publique étroite.
- Les tests d'intégration se trouvent dans `tests/` et n'utilisent que l'API publique.
- Les noms de test énoncent le comportement (`rejects_expired_token`), et pas seulement le nom de la fonction.
- Les fixtures sont construites par de petites fonctions utilitaires, et non en copiant des blocs de préparation dans chaque test.
