# Style de code TypeScript

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

TypeScript hérite également du [profil JavaScript](javascript.md).

## Profil TypeScript {#typescript-profile}

TypeScript hérite de toutes les règles Pureline JavaScript.

### PL-TS-001 — Éviter `any` {#pl-ts-001--avoid-any}

À éviter :

```ts
function load(value: any): any {
}
```

Préférez :

```ts
function load(value: UserId): User {
}
```

Utilisez `unknown` pour des données réellement inconnues :

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Utiliser les types à bon escient {#pl-ts-002--use-types-deliberately}

Les types locaux inférés comme explicites sont conformes à Pureline.

```ts
const user = loadUser();
```

est valide lorsque le type inféré est évident.

Le typage explicite est tout aussi valide :

```ts
const user: User = loadUser();
```

Pureline ne considère **pas** une annotation explicite comme redondante simplement parce que TypeScript pourrait l'inférer.

Les types explicites sont particulièrement utiles lorsqu'ils :

- clarifient l'intention
- documentent un contrat attendu
- protègent une frontière d'un élargissement involontaire
- renforcent la confiance lors des refactorisations
- rendent le code plus facile à comprendre sans suivre toute une chaîne d'appels

L'inférence de types doit supprimer du bruit. Elle ne doit jamais devenir une règle contre l'usage du système de types de TypeScript.

### PL-TS-003 — Pas de préfixe `I` à la manière de Java {#pl-ts-003--no-java-style-i-prefix}

Recommandé :

```ts
interface Session {
}
```

Et non :

```ts
interface ISession {
}
```

Le préfixe `I` est propre à certains profils : Java, Emerald et Emvus l'utilisent ; TypeScript non.

### PL-TS-004 — `interface` ou `type` {#pl-ts-004--interface-vs-type}

Utilisez `interface` pour les contrats de type objet :

```ts
interface User {
    id: string;
    name: string;
}
```

Utilisez `type` pour les unions, les alias et les formes appelables :

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Préférer les unions aux enums quand c'est approprié {#pl-ts-005--prefer-union-types-over-enums-when-appropriate}

Recommandé :

```ts
type State = "idle" | "ready" | "closed";
```

N'utilisez un enum que lorsqu'une véritable construction enum apporte une valeur.

### PL-TS-006 — Types forts aux frontières, liberté en interne {#pl-ts-006--strong-types-at-boundaries-freedom-internally}

Les API publiques, les données externes, les frontières de persistance et les charges utiles réseau doivent normalement exposer des types clairs.

À l'intérieur d'une implémentation, les annotations explicites comme l'inférence sont valides. Choisissez la forme qui rend le code le plus facile à comprendre. Pureline ne considère pas l'une comme plus propre que l'autre simplement parce qu'elle contient moins d'annotations de types.

---

### PL-TS-007 — Densité des dossiers {#pl-ts-007--folder-density}

Un dossier de fonctionnalité/source TypeScript peut contenir au maximum **10 modules sources de production** par défaut.

Les fichiers barrel comme `index.ts`, les fichiers de support contenant uniquement des déclarations, les tests, les fichiers générés et les fichiers contenant uniquement des métadonnées ne comptent pas.

Un découpage doit représenter une véritable frontière de responsabilité, par exemple :

```text
session/
session/state/
session/transport/
session/storage/
```
