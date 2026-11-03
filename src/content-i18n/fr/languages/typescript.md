# Style de code de type script

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

TypeScript hérite également du [Profil JavaScript](javascript.md).

## Profil de typeScript

TypeScript hérite de toutes les règles JavaScript de Pureline.

### PL-TS-001 — Éviter `any`

Évitez:

```ts
function load(value: any): any {
}
```

Préférez :

```ts
function load(value: UserId): User {
}
```

Utilisez `unknown` pour des données vraiment inconnues:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Utiliser des types de données délibérés

Les types locaux déduits et explicites sont conformes à Pureline.

```ts
const user = loadUser();
```

est valide lorsque le type inféré est évident.

La saisie explicite est également valable:

```ts
const user: User = loadUser();
```

Pureline fait **not** traiter une annotation explicite comme redondante simplement parce que TypeScript pourrait l'inférer.

Les types explicites sont particulièrement utiles lorsqu'ils :

- rendre l'intention plus claire
- documenter un contrat prévu
- protéger une frontière contre l'élargissement involontaire
- améliorer la confiance en matière de refactoration
- rendre le code plus facile à comprendre sans suivre une chaîne d'appels entière

L'inférence de type devrait éliminer le bruit. Il ne devrait jamais devenir une règle contre l'utilisation du système de type de TypeScript.

### PL-TS-003 — Pas de préfixe Java-Style `I`

Préféré:

```ts
interface Session {
}
```

Pas:

```ts
interface ISession {
}
```

Le préfixe `I` est spécifique au profil : Java, Emerald et Emvus l'utilisent; TypeScript ne le fait pas.

### PL-TS-004 — `interface` vs `type`

Utilisez `interface` pour les contrats de type objet :

```ts
interface User {
    id: string;
    name: string;
}
```

Utilisez `type` pour les syndicats, les alias et les formes appelables:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Types de syndicats préférentiels sur les nombres lorsque cela est approprié

Préféré:

```ts
type State = "idle" | "ready" | "closed";
```

Utilisez un énum seulement quand une construction réelle d'enum fournit la valeur.

### PL-TS-006 — Types forts aux frontières, liberté intérieure

Les IPA publics, les données externes, les limites de persistance et les charges utiles du réseau devraient normalement exposer les types clairs.

Dans une implémentation, les annotations et les inférences explicites sont valables. Choisissez le formulaire qui rend le code plus facile à comprendre. Pureline ne note pas un seul comme nettoyant uniquement parce qu'il contient moins d'annotations de type.

---

### PL-TS-007 — Densité du dossier

Un dossier TypeScript/source peut contenir au maximum des modules source de production **10** par défaut.

Les fichiers barres tels que `index.ts`, les fichiers de déclaration seulement, les tests, les fichiers générés et les fichiers de métadonnées seulement ne comptent pas.

Une division devrait représenter une véritable limite de responsabilité, par exemple :

```text
session/
session/state/
session/transport/
session/storage/
```
