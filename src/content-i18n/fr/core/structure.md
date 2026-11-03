# Classes, modules et densité du dossier

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Classes et modules

### PL-STRUCT-001 — Une responsabilité claire

Évitez les structures comme:

```text
ServerManager
 ├─ database
 ├─ players
 ├─ packets
 ├─ commands
 ├─ configuration
 ├─ HTTP
 └─ logging
```

Préférez :

```text
server/
    ServerRuntime

network/
    Connection
    PacketRegistry
    PacketDispatcher

session/
    Session
    SessionService

storage/
    UserStorage
    SessionStorage
```

Une classe a une responsabilité claire lorsque ses membres et l'État interne contribuent à une préoccupation cohérente. **Le nombre de lignes seul ne détermine pas si une classe est bien conçue.** Voir `PL-STRUCT-003` pour le guide de taille.

---

## Densité de l'emballage et du dossier

### PL-STRUCT-002 — Gardez les espaces Nam assez petits pour scanner

Pureline traite la densité de fichier et de type comme faisant partie de la lisibilité du code.

Un paquet ou un dossier source devrait être suffisamment petit pour qu'un développeur puisse comprendre son contenu en un coup d'oeil sans chercher dans une longue liste plate de fichiers non liés.

Lorsque la limite est dépassée, diviser le paquet ou le dossier par responsabilité au lieu de permettre qu'il devienne un motif de dumping.

#### Limites par défaut

|Langue|Pureline par défaut|
|---|---|
|Java|Maximum 8 types de production de premier niveau/fichiers source par paquet|
|Emeraude|8 fichiers source de production maximum `.ems` par dossier source/nam espace|
| Emvus |Maximum 8 fichiers source de production `.ev` par dossier paquet/source|
|JavaScript|Maximum 10 modules source de production par dossier fonctionnalité/source|
|TypeScript|Maximum 10 modules source de production par dossier fonctionnalité/source|
|Allez|Maximum 12 fichiers `.go` non-test non-générés par répertoire de paquets|
|Cristal|10 fichiers `.cr` maximum de production par dossier source/nam espace|
|Résistant|Maximum 10 fichiers de production manuel `.rs` par dossier de fonctionnalités/source|

Ces fichiers ne comptent pas vers la limite :

- essais et spécifications
- fichiers sources générés
- fichiers métadonnées seulement
- `package-info.java`
- `module-info.java`
- Fichiers de barils JavaScript/TypeScript tels que `index.ts` ou `index.js`
- des liaisons générées ou des sorties de protocole
- des instantanés de migration et des artefacts comparables créés par la machine

Le but de cette règle n'est pas de forcer la nidification arbitraire des dossiers. Une division devrait introduire une véritable limite de responsabilité.

Bad:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java
    PacketHandler.java
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Préféré:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java

network/packet/
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java

network/runtime/
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Un projet peut dépasser ces seuils par un futur fichier de configuration Pureline, mais la règle par défaut devrait rester intentionnellement stricte.

---

## Cohésion sur taille

### PL-STRUCT-003 — Cohésion sur la taille (Zusammengehörigkeit v. Zeilenbegrenzung)

> **Cohésion sur la taille — Zusamengehörigkeit vr Zeilenbegrenzung.**

La taille maximale de la classe préférée est **guidance, jamais une limite dure**. Conservez une logique fortement liée lors du fractionnement, ce qui rendrait le code plus difficile à lire, à maintenir, à tester ou à raisonner. Une classe plus grande et cohésive est préférable à plusieurs classes artificielles reliées par une délégation inutile.

#### Guide de la taille des classes

|Taille de la classe|Recommandation Pureline|
|---|---|
|Jusqu'à 200 lignes|Cas normal privilégié|
|201 à 400 lignes|Non problématique lorsque la classe a une responsabilité claire|
|401 à 600 lignes|Délibérer la décision architecturale; maintenir sa cohésion compréhensible|
|Plus de 600 lignes|Examen recommandé, **non interdit**|

Les gammes sont **heuristiques, pas les limites dures**. Le franchissement d'un seuil ne doit pas, en soi, entraîner une violation de style ou exiger une scission.

#### Lorsque des classes plus grandes sont justifiées

- **Parsers et lexers:** Une machine d'état cohésive peut devenir plus compliquée lorsque ses états et transitions sont dispersés dans des abstractions artificielles.
- **Algorithms:** Les phases de traitement couplées de façon étroite peuvent être plus faciles à comprendre et à optimiser lorsqu'elles sont maintenues ensemble.
- **Structures de données centrales:** Les méthodes partageant les mêmes invariants et l'état interne peuvent appartenir à une classe.
- ** Logique complexe mais cohésive :** Le fractionnement est contreproductif lorsqu'il ajoute une direction, une délégation inutile ou une coordination plus que la clarté.

#### Quand se séparer de toute façon

Split par **Real responsibility limits**, pas par le nombre de lignes. Les indicateurs comprennent des sous-systèmes distincts qui évoluent de façon indépendante, des raisons de changement non liées, un faible couplage entre les groupes de méthodes ou des cycles de vie distincts qui sont classés par classe.

**Règle d'utilisation:** Les inspections de la vérification et de l'IDE Pureline peuvent présenter un avis de taille informative avec une suggestion de révision de cohésion, particulièrement au-dessus de 600 lignes. Ils ne doivent pas traiter le nombre de lignes comme une preuve suffisante d'une violation, extraire automatiquement des classes ou exiger des suppressions simplement pour maintenir une classe cohérente intacte.

This principle applies to **all Pureline language profiles**, including Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, and Emvus. Language-specific syntax and idioms continue to take precedence.
