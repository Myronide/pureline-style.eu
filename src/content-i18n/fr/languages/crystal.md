# Style de code cristal

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## Profil cristal

Crystal conserve sa propre identité linguistique tout en suivant les principes de Pureline.

### PL-CR-001 — Les dispositifs de protection postfixe idiomatiques sont autorisés

Les conditions de postfixe cristal sont conformes à Pureline lorsqu'elles expriment un garde court et évident.

Good:

```crystal
return unless valid
return if closed
```

Ils s'adaptent bien à Pureline car ils peuvent garder la logique compacte et préserver un chemin linéaire heureux.

Utilisez un bloc explicite lorsque l'état ou l'action surveillée devient plus complexe:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

La règle n'est pas "éviter les conditions postfixes". La règle est: utiliser le formulaire qui maintient l'intention immédiatement évidente.

### PL-CR-002 — Éviter `else`

Évitez:

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

### PL-CR-003 — Désignation idiomatique

Les variables et les méthodes utilisent `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Types utilisent PascalCase :

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004 — Inférence de type de préférence

Préféré:

```crystal
session = create_session(user)
```

Éviter les annotations redondantes :

```crystal
session : Session = create_session(user)
```

quand Crystal peut déduire clairement le type.

### PL-CR-005 — Gardes à corps explicites

Préféré:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Évitez d'enterrer les manipulations attendues de la néon à l'intérieur de chaînes profondément nichées.

### PL-CR-006 — Les exceptions s'appliquent aux États exceptionnels

Les résultats attendus devraient de préférence utiliser la modélisation de domaine normale comme `nil`, les types d'union, les structures result-like ou les enums.

Les exceptions devraient représenter un échec exceptionnel, et non une branche ordinaire.

### PL-CR-007 — Évitez la monarchie sans nécessité

Les macros cristallines sont puissantes, mais Pureline évite de cacher un comportement ordinaire derrière la métaprogrammation, sauf si l'abstraction produit un avantage architectural clair.

Le comportement généré doit rester prévisible et décelable.

---

### PL-CR-008 — Densité du dossier

Un dossier Crystal source ou namespace peut contenir au maximum **10 production `.cr` fichiers** par défaut.

Les spécifications, les fichiers générés, les liaisons et les fichiers métadonnées seulement ne comptent pas.

Lorsque la limite est dépassée, diviser l'espace de noms par responsabilité tout en préservant la structure du cristal idiomatique.
