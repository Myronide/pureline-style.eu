# Classes, modules et densité des dossiers

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Classes et modules {#classes-and-modules}

### PL-STRUCT-001 — Une seule responsabilité claire {#pl-struct-001--one-clear-responsibility}

Évitez les structures comme :

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

Une classe a une responsabilité claire lorsque ses membres et son état interne contribuent à une seule préoccupation cohérente. **Le nombre de lignes seul ne détermine pas si une classe est bien conçue.** Voir `PL-STRUCT-003` pour les repères de taille.

---

## Densité des packages et des dossiers {#package-and-folder-density}

### PL-STRUCT-002 — Garder les espaces de noms assez petits pour être parcourus {#pl-struct-002--keep-namespaces-small-enough-to-scan}

Pureline considère la densité des fichiers et des types comme une composante de la lisibilité du code.

Un package ou un dossier source doit être assez petit pour qu'un développeur en comprenne le contenu d'un coup d'œil, sans avoir à chercher dans une longue liste plate de fichiers sans rapport.

Lorsque la limite est dépassée, découpez le package ou le dossier par responsabilité au lieu d'en faire un fourre-tout.

#### Limites par défaut {#default-limits}

| Langage | Valeur par défaut de Pureline |
|---|---|
| Java | Au maximum 8 types de premier niveau / fichiers sources de production par package |
| Emerald | Au maximum 8 fichiers sources `.ems` de production par dossier source/namespace |
| Emvus | Au maximum 8 fichiers sources `.ev` de production par package/dossier source |
| JavaScript | Au maximum 10 modules sources de production par dossier de fonctionnalité/source |
| TypeScript | Au maximum 10 modules sources de production par dossier de fonctionnalité/source |
| Go | Au maximum 12 fichiers `.go` hors tests et hors code généré par répertoire de package |
| Crystal | Au maximum 10 fichiers `.cr` de production par dossier source/namespace |
| Rust | Au maximum 10 fichiers `.rs` de production maintenus à la main par dossier de fonctionnalité/source |

Ces fichiers ne comptent pas dans la limite :

- les tests et les specs
- les fichiers sources générés
- les fichiers contenant uniquement des métadonnées
- `package-info.java`
- `module-info.java`
- les fichiers barrel JavaScript/TypeScript tels que `index.ts` ou `index.js`
- les bindings générés ou la sortie de protocole générée
- les snapshots de migration et autres artefacts comparables générés par machine

Le but de cette règle n'est pas d'imposer une imbrication arbitraire de dossiers. Un découpage doit introduire une véritable frontière de responsabilité.

Mauvais :

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

Recommandé :

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

Un projet pourra remplacer ces seuils via un futur fichier de configuration Pureline, mais la règle par défaut doit rester volontairement stricte.

---

## Cohésion avant la taille {#cohesion-over-size}

### PL-STRUCT-003 — Cohésion avant la taille (Zusammengehörigkeit vor Zeilenbegrenzung) {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung} {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung}

> **Cohésion avant la taille — Zusammengehörigkeit vor Zeilenbegrenzung.**

La taille maximale recommandée d'une classe est un **repère, jamais une limite stricte**. Gardez ensemble la logique fortement liée lorsque la séparer rendrait le code plus difficile à lire, à maintenir, à tester ou à raisonner. Une classe cohérente de grande taille vaut mieux que plusieurs classes artificielles reliées par une délégation inutile.

#### Repères de taille des classes {#class-size-guidance}

| Taille de la classe | Recommandation de Pureline |
|---|---|
| Jusqu'à 200 lignes | Cas normal à privilégier |
| 201–400 lignes | Sans problème lorsque la classe a une responsabilité claire |
| 401–600 lignes | Décision d'architecture délibérée ; veillez à ce que sa cohésion reste compréhensible |
| Plus de 600 lignes | Revue recommandée, **pas interdite** |

Ces fourchettes sont des **heuristiques, pas des limites strictes**. Franchir un seuil ne doit pas, à lui seul, produire une violation de style ni imposer un découpage.

#### Quand de grandes classes sont justifiées {#when-larger-classes-are-justified}

- **Parseurs et lexeurs :** une machine à états cohérente peut devenir plus compliquée lorsque ses états et ses transitions sont dispersés dans des abstractions artificielles.
- **Algorithmes :** des phases de traitement étroitement couplées peuvent être plus faciles à comprendre et à optimiser lorsqu'elles restent ensemble.
- **Structures de données centrales :** des méthodes qui partagent les mêmes invariants et le même état interne peuvent appartenir à une seule classe.
- **Logique complexe mais cohésive :** le découpage est contre-productif lorsqu'il ajoute de l'indirection, une délégation inutile ou plus de coordination que de clarté.

#### Quand découper malgré tout {#when-to-split-anyway}

Découpez selon de **véritables frontières de responsabilité**, pas selon le nombre de lignes. Parmi les indices : des sous-systèmes distincts qui évoluent indépendamment, des raisons de changer sans rapport entre elles, un faible couplage entre des groupes de méthodes, ou des cycles de vie distincts masqués par une seule classe.

**Règle d'outillage :** Pureline Checker et les inspections des IDE peuvent afficher un avis de taille informatif accompagné d'une suggestion de revue de cohésion, en particulier au-delà de 600 lignes. Ils ne doivent pas considérer le nombre de lignes comme une preuve suffisante de violation, ni extraire automatiquement des classes, ni exiger des suppressions uniquement pour préserver une classe cohésive.

Ce principe s'applique à **tous les profils de langage Pureline**, y compris Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald et Emvus. La syntaxe et les idiomes propres à chaque langage continuent de primer.
