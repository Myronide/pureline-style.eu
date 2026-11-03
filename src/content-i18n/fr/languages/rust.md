# Style de code Rust

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Rust Profile

Pureline Rust suit **idiomatic Rust** plutôt que de traduire les conventions Java dans la syntaxe Rust. La propriété, les durées de vie, les enums, l'appariement des motifs et le système de type sont des forces fondamentales, et non des obstacles à travailler autour.

### PL-RS-001 — Nom et visibilité idiomatiques

- Types, caractères et variantes de l'enum: `PascalCase`.
- Fonctions, méthodes, modules, champs et locaux: `snake_case`.
- Constantes et statiques: `SCREAMING_SNAKE_CASE`.
- Taux: les noms descriptifs de `snake_case` (les noms de paquets de Cargo peuvent utiliser des tirets).
- Les caractères font que **not** hérite du préfixe Java `I`. Préférez `Storage`, pas `IStorage`.
- Gardez les articles privés à moins qu'un consommateur réel ait besoin d'une visibilité plus large; préférez `pub(crate)` quand cela est approprié.
- Utiliser les importations de `use` plutôt que de répéter des chemins longs et entièrement qualifiés, sauf lorsque la qualification explicite résout l'ambiguïté.

### PL-RS-002 — Clauses de garde et débit linéaire

Valider tôt et garder le chemin réussi au niveau de l'indentation de base.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Évitez `else` après une branche qui retourne, casse ou continue déjà. Une `if`/`else` ** expression** est autorisée pour une sélection de valeur bidirectionnelle réelle où elle est plus claire que les alternatives. `let ... else` est un **préféré Rust guard construit**, pas une violation du principe evite-`else`.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

### PL-RS-003 — Préférez `Result`, `Option` et `?`

- Représenter les échecs attendus avec `Result<T, E>`.
- Représenter l'absence avec `Option<T>`.
- Utilisez `?` pour une propagation simple et `map_err`/`ok_or_else` lorsque le contexte d'erreur s'améliore réellement.
- Utilisez `match` lorsque les résultats nécessitent une manipulation distincte; évitez les chaînes de combinateurs alternées.
- Ne pas jeter les valeurs `Result` silencieusement; décider si vous devez propager, loger, récupérer, ou délibérément ignorer avec une explication justifiée.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### PL-RS-004 — Restriction `unwrap`, `expect` et `panic!`

Ne jamais utiliser `unwrap()` ou `expect()` pour des échecs de production récupérables ordinaires. Ils sont acceptables dans les invariants documentés qui ne peuvent vraiment pas être violés, et dans le code d'essai intérieur (modules `#[cfg(test)]` et `tests/`), où une panique est le rapport de défaillance. `panic!` n'est pas une stratégie normale de gestion des erreurs. Préférez une manipulation explicite sur les défaillances cachées via l'indexation ou les conversions non contrôlées.

### PL-RS-005 — Utilisez `match` et les modèles pour la branchement de l'État réel

Utiliser `match` exhaustif pour les enums et les alternatives significatives; utiliser `if let` ou `let ... else` pour une simple manipulation à un seul motif. Ne forcez pas `match` sur des contrôles ordinaires du booléen. Évitez les bras larges `_` qui masquent silencieusement les états futurs lors de la énumération des variantes serait plus clair.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

### PL-RS-006 — La propriété doit être délibérée

- Préférez emprunter `&T` ou `&mut T` lorsque le transfert de propriété n'est pas nécessaire.
- Accepter les valeurs détenues lorsque l'appelant a réellement besoin de propriété.
- Minimiser le clonage; utiliser `.clone()` lorsque son coût de propriété et son objectif sont clairs.
- Évitez les aiguilles `Arc`, `Rc`, `Box` et les enveloppes de mutabilité intérieure.
- Préférez les durées de vie courtes et les limites de propriété explicites; ne combattez pas le vérificateur d'emprunts avec des fuites artificielles ou la propriété partagée généralisée.

### PL-RS-007 — Immutable par défaut

Utilisez `let` à moins que la mutation ne soit nécessaire. Gardez `let mut` local et étroitement ciblé. Éviter la mutabilité intérieure comme substitut par défaut au modèle de propriété ordinaire. Ne créez pas de globals mutables inutiles.

### PL-RS-008 — Les caractères exigent une véritable abstraction

Créer un trait pour un comportement partagé réel, une limite API, une implémentation de la marque ou une seam de test. Ne pas introduire des traits simplement pour miroirs des interfaces Java ou créer des couches d'usine/manager. Préférez des méthodes simples et intrinsèques `impl` pour des implémentations concrètes uniques. Choisissez des objets génériques ou des objets de trait en fonction des exigences réelles en matière de polymorphisme.

### PL-RS-009 — Cohésion sur la taille pour `struct`, `impl` et modules

`PL-STRUCT-003` s'applique à Rust en tant que **cohesion review**, pas en tant que limite fixe de nombre de lignes. Une machine à `impl` ou un état cohésif peut être longue. Séparer par une responsabilité indépendante, non par l'extraction mécanique de traits, de structures ou de fichiers. Évitez les grands motifs de dumping non liés `mod.rs` ou `lib.rs`.

### PL-RS-010 — Densité du module et du fichier

Un dossier Rust/source doit contenir au maximum **10 production manuelle `.rs` fichiers** par défaut. Les tests, le code généré, les liaisons et les fichiers de métadonnées seulement ne comptent pas. `mod.rs`, `lib.rs` et `main.rs` comptent lorsqu'ils contiennent une logique substantielle maintenue, et non pas lorsqu'ils servent seulement de déclarations de modules/réexportations. Il s'agit d'un seuil de révision: scindé le long des limites de responsabilité réelles, jamais dans des dossiers imbriqués sans signification.

Préférez des modules explicites avec des surfaces publiques étroites; gardez la mise en œuvre interne privée.

### PL-RS-011 — Utiliser Rustfmt comme autorité de formatage

- Suivez `rustfmt` / `cargo fmt` pour l'indentation, l'enveloppement de ligne, les virgules traînantes et le formatage idiomatique.
- Préférez les expressions compactes et les appels **lorsque rustfmt les supporte**; Pureline ne doit pas exiger le formatage manuel que rustfmt va annuler.
- Écrire une structure d'expression claire plutôt que d'utiliser des directives de formatage pour lutter contre la matière.
- Utilisez un flux de commande ordinaire délimité par les bretelles; ne pas imiter les règles de base de Java dans le Rust orienté vers l'expression.

Cette règle prime les préférences d'appel horizontal indépendantes du langage lorsqu'elles sont en conflit avec la substance Rust canonique.

### PL-RS-012 — Préférer une itération claire sur les chaînes C-S

Les items, les fermetures et les combinateurs sont encouragés lorsqu'ils expriment directement une transformation. Préférez une boucle régulière quand elle rend plus clair le comportement de branchement, les effets secondaires, l'emprunt, le débogage ou le chemin chaud. Évitez les adaptateurs enchaînés simplement pour réduire le nombre de lignes.

### PL-RS-013 — Les tâches d'Async ont la propriété et l'arrêt

- Utiliser `async`/`.await` pour les charges de travail asynchronous, le cas échéant.
- Ne bloquez pas un exécuteur async avec des travaux d'entrée/sortie ou de CPU de longue durée; utilisez des bloquants dédiés ou des threads de travail au besoin.
- Suivre les tâches engendrées, l'annulation, la propagation d'erreurs et l'arrêt ordonné.
- Ne créez pas de tâches cachées de feu et d'oubli pour un travail important.
- Utiliser des canaux et des primitives de synchronisation avec une propriété et une contre-pression clairement définies.
- Ne jamais tenir un blocage ou un verrouillage asynchroon sur `.await` à moins que la conception n'exige explicitement et en toute sécurité.

### PL-RS-014 — Les cycles de vie des ressources devraient être prévisibles

Préférez RAII et `Drop` pour le nettoyage de synchronous. En attendant ou en coordonnant explicitement l'arrêt des ressources asynchrones, car `Drop` ne peut pas attendre. Exposer une méthode `close()` / `shutdown()` lorsque l'opération peut échouer ou doit être terminée avant la sortie du processus. Évitez de cacher un nettoyage jauni important à l'intérieur des destructeurs seuls.

### PL-RS-015 — Code non sûr doit être isolé et justifié

Safe Rust est la valeur par défaut. Utilisez `unsafe` seulement lorsque requis par une véritable limite de FFI, matériel ou performance. Gardez les régions dangereuses petites, documentez leurs invariants avec `// SAFETY:`, encapsulez-les derrière une API minimale et sécuritaire, et testez la limite. N'utilisez pas `unsafe` simplement pour contourner les contrôles de propriété normaux.

### PL-RS-016 — Les frontières des FFI et des plates-formes sont explicites

Pour Wayland, GPU, bibliothèques système et intégration native similaire, garder les poignées brutes, les garanties à vie, le transfert de propriété, les hypothèses de filetage et la conversion d'erreurs visibles. Code de la plate-forme isolée dans des modules ciblés. Les fixations produites peuvent être exclues des limites de formatage et de densité ordinaires.

### PL-RS-017 — Préférez les types qui encodent les invariants

Utiliser des énums et des petits nouveaux types lorsqu'ils empêchent des états réels invalides ou clarifient les frontières extérieures. Ne créez pas d'emballages pour chaque primitif sans bénéfice. Préférez les constructeurs qui valident les invariants et exposent les erreurs claires. Rendre les états invalides ou non initialisés difficiles à représenter.

### PL-RS-018 — Éviter la monarchie

Préférez les fonctions, les traits, les enums et les génériques simples sur les macros pour le comportement de routine. Utiliser des macros déclaratives ou procédurales lorsqu'elles éliminent les répétitions structurelles significatives. Gardez le comportement généré décelable et diagnostics compréhensibles.

### PL-RS-019 — Mesurer la performance avant la complexité

Évitez les allocations inutiles, les clones, le comptage de référence et le verrouillage dans les voies chaudes mesurées. Préférez une propriété prévisible et des structures de données adaptées à la charge de travail. Profiler avant de remplacer le code propre par des optimisations complexes de bas niveau, et valider la latence ainsi que le débit pour les charges de travail UI/compositeur.

### PL-RS-020 — Essais et outillage

- Exécutez `cargo fmt --check` pour le formatage et `cargo clippy` avec les paramètres de lint de l'agreed-projet.
- Testez les voies normales, invalides et de défaillance, en particulier l'annulation, le cycle de vie, les limites FFI et la convergence.
- Faites des avertissements intentionnels; évitez les attributs de couverture `allow` pour réduire au silence les groupes à large lint.
- Le vérificateur Pureline doit utiliser la syntaxe Rust/l'inspection de l'AST-aware (y compris `let ... else`, correspondance de motifs, macros et retours d'expression), et non la correspondance de motifs textuels.

### PL-RS-021 — Types d'erreurs correspondent au rôle de la caisse

- Les bibliothèques exposent les erreurs dactylographiées : un `enum` qui implémente `std::error::Error` et `Display`, avec une variante par défaillance distincte, un appelant peut agir.
- Les applications peuvent utiliser un type d'erreur opaque de haut niveau à la limite (`main`, gestionnaires de requêtes, commandes CLI) pour transporter le contexte. Ne pas divulguer ce type opaque à travers l'API publique d'une bibliothèque.
- Préservez l'erreur source (`source()` ou une variante enveloppée) au lieu de la convertir en une chaîne.
- Les messages `Display` sont en minuscules et ne portent aucune ponctuation en fuite, de sorte que les appelants peuvent les composer.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

### PL-RS-022 — Les lints sont configurés au niveau central

- Configurer les niveaux de lint dans le manifeste (`[lints]` dans `Cargo.toml`, ou `[workspace.lints]` avec `lints.workspace = true` dans les caisses membres), non dans les attributs de niveau de caisse dispersés.
- Activer les groupes de lints sur lesquels le projet s'accorde et énumérer les exceptions individuelles avec une raison à côté d'eux.
- Un `#![allow(...)]` de niveau de caisse est une constatation à moins qu'un commentaire n'explique pourquoi le lint est incorrect pour ce code.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

### PL-RS-023 — Code Async de la résiliation-Safe

- Lorsqu'un futur est abandonné avant qu'il ne soit terminé (par exemple en tant que branche perdante de `select!`, ou lors d'un délai d'attente), indiquez si l'opération est sécuritaire par annulation. Documenter toute opération qui ne l'est pas.
- Ne présumez pas qu'un avenir abandonné a repoussé ses travaux. Commett états changements après l'étape attendue réussit, ou faire l'étape idémpotent.
- Gardez l'avenir qui maintient une serrure ou une transaction ouverte hors des branches `select!` qui peuvent la laisser tomber en milieu de fonctionnement.

### PL-RS-024 — Tests assis à côté du comportement qu'ils vérifient

- Les tests unitaires sont en direct dans un bloc `#[cfg(test)] mod tests` à la fin du fichier qu'ils testent. Ils peuvent atteindre des objets privés, ce qui maintient la surface publique étroite.
- Les tests d'intégration vivent dans `tests/` et n'utilisent que l'API publique.
- Les noms des tests indiquent le comportement (`rejects_expired_token`), et non le nom de la fonction.
- Les corrections sont construites par des fonctions de petite aide, et non par copie de blocs de configuration dans chaque test.
