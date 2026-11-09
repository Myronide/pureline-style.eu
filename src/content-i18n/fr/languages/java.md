# Style de code Java

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil Java

### PL-JAVA-001 — Ensemble par responsabilité

Préféré:

```text
src/main/java/
    space/example/project/
        api/
        runtime/
        service/
        network/
        storage/
        model/
```

Évitez les motifs génériques de dumping comme `util/`, `manager/`, `misc/` ou `helper/`, à moins que l'emballage ait un but réel et étroit.

### PL-JAVA-002 — Désignation

Classes:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Les interfaces utilisent le préfixe `I` :

```java
ISession
IStorage
IPacket
IConnection
```

Méthodes:

```java
open()
close()
load()
save()
execute()
resolve()
```

Variables & #160;:

```java
request
session
player
connection
```

Les variables à lettre unique sont interdites à moins qu'elles ne soient établies par des conventions locales telles que les compteurs de boucles.

### PL-JAVA-003 — Préférer les enregistrements pour les données immuables

Préféré:

```java
public record SessionId(UUID value) {
}
```

Évitez les POJOs de la plaque de chaudière lorsqu'un enregistrement est suffisant.

### PL-JAVA-004 — Manipulation explicite des nulls

Évitez:

```java
Objects.requireNonNull(value);
```

pour la validation normale du débit de commande.

Préférez :

```java
if (value == null) {
    return;
}
```

ou une défaillance spécifique au domaine:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Utiliser les importations au lieu des NCFQ

Évitez:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Préférez :

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Préférez Java moderne

Utilisez les fonctionnalités Java modernes lorsqu'elles améliorent le code:

```text
records
sealed types
pattern matching
switch expressions
var
virtual threads
text blocks
streams
```

La syntaxe moderne devrait réduire le bruit, et non créer de la nouveauté pour son propre bien.

Préférez un modèle `instanceof` quand un garde vérifie un type et le succès
chemin a besoin de la valeur comme ce type.

```text
− Separate cast                      │ ✓ Pureline
if (!(value instanceof String)) {   │ if (!(value instanceof String text)) {
    return "";                       │     return "";
}                                    │ }
                                     │
String text = (String) value;        │ return text.trim();
return text.trim();                  │
```

### PL-JAVA-007 — Commutateur de préférence pour la branchement d'État réel

Préféré:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Préférez-le plutôt que de longues chaînes de contrôles d'État indépendants.

### PL-JAVA-008 — Monnaie

Ne bloquez pas les threads principaux ou co-chers avec HTTP, les opérations de base de données, l'accès au système de fichiers ou le blocage des E/S du réseau.

Les fils virtuels sont préférés pour bloquer les E/S le cas échéant.

### PL-JAVA-009 — Flux seulement lorsque la valeur est plus claire

Les flux sont encouragés lorsqu'ils améliorent la lisibilité. Utilisez une boucle si elle est plus claire, plus facile à déboguer ou mieux adaptée au sentier chaud.

### PL-JAVA-010 — Symmétrie du cycle de vie

Tout ce qui est ouvert, enregistré, démarré, attribué ou souscrit doit avoir un chemin correspondant tout aussi clair, proche, désenregistrer, arrêter, libérer ou désinscrire.
