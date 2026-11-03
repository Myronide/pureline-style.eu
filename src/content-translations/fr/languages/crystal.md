# Style de code Crystal

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil Crystal {#crystal-profile}

Crystal garde sa propre identité de langage tout en suivant les principes de Pureline.

### PL-CR-001 — Les guards postfixes idiomatiques sont permis {#pl-cr-001--idiomatic-postfix-guards-are-allowed}

Les conditions postfixes de Crystal sont conformes à Pureline lorsqu'elles expriment un guard court et évident.

Bien :

```crystal
return unless valid
return if closed
```

Elles conviennent bien à Pureline parce qu'elles gardent la logique de guard compacte et préservent un chemin nominal linéaire.

Utilisez un bloc explicite dès que la condition ou l'action gardée devient plus complexe :

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

La règle n'est pas « évitez les conditions postfixes ». La règle est : utilisez la forme qui garde l'intention immédiatement évidente.

### PL-CR-002 — Éviter `else` {#pl-cr-002--avoid-else}

À éviter :

```crystal
if valid
  execute
else
  reject
end
```

Préférez :

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Nommage idiomatique {#pl-cr-003--idiomatic-naming}

Les variables et les méthodes utilisent `snake_case` :

```crystal
session_service
packet_registry
load_user
create_session
```

Les types utilisent PascalCase :

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004 — Préférer l'inférence de types {#pl-cr-004--prefer-type-inference}

Recommandé :

```crystal
session = create_session(user)
```

Évitez les annotations redondantes :

```crystal
session : Session = create_session(user)
```

lorsque Crystal peut inférer clairement le type.

### PL-CR-005 — Guards nil explicites {#pl-cr-005--explicit-nil-guards}

Recommandé :

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Évitez d'enfouir un traitement de nil attendu dans des chaînes profondément imbriquées.

### PL-CR-006 — Les exceptions sont réservées aux états exceptionnels {#pl-cr-006--exceptions-are-for-exceptional-states}

Les résultats attendus devraient de préférence passer par une modélisation de domaine normale : `nil`, types union, structures de type résultat ou enums.

Les exceptions doivent représenter un échec exceptionnel, pas un branchement ordinaire.

### PL-CR-007 — Éviter l'astuce des macros sans nécessité {#pl-cr-007--avoid-macro-cleverness-without-need}

Les macros de Crystal sont puissantes, mais Pureline évite de cacher un comportement ordinaire derrière de la métaprogrammation, sauf si l'abstraction apporte un net bénéfice architectural.

Le comportement généré doit rester prévisible et facile à découvrir.

---

### PL-CR-008 — Densité des dossiers {#pl-cr-008--folder-density}

Un dossier source ou de namespace Crystal peut contenir au maximum **10 fichiers `.cr` de production** par défaut.

Les specs, les fichiers générés, les bindings et les fichiers contenant uniquement des métadonnées ne comptent pas.

Lorsque la limite est dépassée, découpez le namespace par responsabilité tout en préservant une structure Crystal idiomatique.
