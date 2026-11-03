# Style de code Java

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Java {#java-profile}

### PL-JAVA-001 — Organiser les packages par responsabilité {#pl-java-001--package-by-responsibility}

Recommandé :

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

Évitez les fourre-tout génériques tels que `util/`, `manager/`, `misc/` ou `helper/`, sauf si le package a un objectif réel et précis.

### PL-JAVA-002 — Nommage {#pl-java-002--naming}

Classes :

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Les interfaces portent le préfixe `I` :

```java
ISession
IStorage
IPacket
IConnection
```

Méthodes :

```java
open()
close()
load()
save()
execute()
resolve()
```

Variables :

```java
request
session
player
connection
```

Les variables d'une seule lettre sont interdites, sauf s'il s'agit de conventions locales établies comme les compteurs de boucle.

### PL-JAVA-003 — Préférer les records pour les données immuables {#pl-java-003--prefer-records-for-immutable-data}

Recommandé :

```java
public record SessionId(UUID value) {
}
```

Évitez les POJO à base de code répétitif lorsqu'un record suffit.

### PL-JAVA-004 — Gestion explicite de null {#pl-java-004--explicit-null-handling}

Évitez :

```java
Objects.requireNonNull(value);
```

pour la validation ordinaire du flux de contrôle.

Préférez :

```java
if (value == null) {
    return;
}
```

ou un échec propre au domaine :

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

### PL-JAVA-005 — Utiliser des imports plutôt que des FQCN {#pl-java-005--use-imports-instead-of-fqcns}

À éviter :

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Préférez :

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Préférer le Java moderne {#pl-java-006--prefer-modern-java}

Utilisez les fonctionnalités modernes de Java lorsqu'elles améliorent le code :

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

La syntaxe moderne doit réduire le bruit, pas introduire de la nouveauté pour elle-même.

### PL-JAVA-007 — Préférer switch pour les vraies branches d'état {#pl-java-007--prefer-switch-for-real-state-branching}

Recommandé :

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Préférez cette forme aux longues chaînes de vérifications d'état sans rapport entre elles.

### PL-JAVA-008 — Concurrence {#pl-java-008--concurrency}

Ne bloquez pas les threads principaux ou de tick avec du HTTP, des opérations de base de données, des accès au système de fichiers ou des E/S réseau bloquantes.

Les threads virtuels sont à privilégier pour les E/S bloquantes lorsque c'est approprié.

### PL-JAVA-009 — Les streams seulement quand ils sont plus clairs {#pl-java-009--streams-only-when-clearer}

Les streams sont encouragés lorsqu'ils améliorent la lisibilité. Utilisez une boucle si elle est plus claire, plus facile à déboguer ou mieux adaptée au chemin critique.

### PL-JAVA-010 — Symétrie du cycle de vie {#pl-java-010--lifecycle-symmetry}

Tout ce qui est ouvert, enregistré, démarré, alloué ou souscrit doit avoir un chemin correspondant tout aussi clair pour fermer, désenregistrer, arrêter, libérer ou se désabonner.
